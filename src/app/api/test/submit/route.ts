import { NextRequest, NextResponse } from 'next/server';
import { calculatePercentile, calculateScore } from '@/lib/scoring';
import { getSeedQuestions } from '@/lib/seedLoader';
import { sessionsCache } from '@/lib/sessionStore';
import { AnswerReviewItem, ComparisonStats, TestResult } from '@/types/results';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, answers, time_spent_sec = 0, auto_submitted = false } = body;

    if (!session_id || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Data submission tidak lengkap' },
        },
        { status: 400 }
      );
    }

    const session = sessionsCache.get(session_id);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Sesi tes tidak ditemukan atau telah kedaluwarsa' },
        },
        { status: 404 }
      );
    }

    if (session.status === 'completed') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'ALREADY_SUBMITTED', message: 'Tes ini sudah dikumpulkan sebelumnya' },
        },
        { status: 409 }
      );
    }

    const questions = getSeedQuestions(session.subtest);
    const answersMap = new Map<string, string | null>();
    answers.forEach((item: { question_id: string; answer: string | null }) => {
      answersMap.set(item.question_id, item.answer ? String(item.answer).trim() : null);
    });

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const reviewItems: AnswerReviewItem[] = questions.map((q, idx) => {
      const userAns = answersMap.get(q.id) || null;
      let isCorrect = false;

      if (!userAns) {
        unansweredCount++;
      } else {
        if (q.question_type === 'multiple_choice') {
          isCorrect = userAns.toUpperCase() === q.correct_answer.toUpperCase();
        } else {
          isCorrect = userAns === q.correct_answer;
        }

        if (isCorrect) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }

      return {
        question_id: q.id,
        number: idx + 1,
        type: q.question_type,
        content: q.content_id,
        options: q.options_id,
        user_answer: userAns,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation_id,
        difficulty: q.difficulty,
      };
    });

    const totalQuestions = questions.length;
    const scoreResult = calculateScore({
      testType: session.test_type,
      totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
    });

    // Mock benchmark comparison distribution
    const benchmarkScores = session.test_type === 'utbk'
      ? [420, 510, 580, 620, 680, 720, 750, 780, 830, 890]
      : [350, 420, 490, 540, 590, 640, 690, 730, 770];

    const percentile = calculatePercentile(scoreResult.score, benchmarkScores);

    const comparison: ComparisonStats = {
      avg_score: session.test_type === 'utbk' ? 640 : 540,
      median_score: session.test_type === 'utbk' ? 650 : 550,
      your_rank: Math.max(1, Math.round((1 - percentile / 100) * 450) || 1),
      total_participants: 450,
      p25: session.test_type === 'utbk' ? 520 : 420,
      p75: session.test_type === 'utbk' ? 760 : 660,
      p90: session.test_type === 'utbk' ? 860 : 760,
    };

    const finalResult: TestResult = {
      session_id,
      test_type: session.test_type,
      subtest: session.subtest,
      total_questions: totalQuestions,
      correct_count: correctCount,
      wrong_count: wrongCount,
      unanswered_count: unansweredCount,
      score: scoreResult.score,
      percentile,
      time_spent_sec,
      created_at: new Date().toISOString(),
      answers: reviewItems,
      comparison,
    };

    session.status = auto_submitted ? 'timed_out' : 'completed';
    session.finished_at = new Date().toISOString();
    session.result = finalResult;
    sessionsCache.set(session_id, session);

    return NextResponse.json({
      success: true,
      result: {
        session_id,
        total_questions: totalQuestions,
        correct_count: correctCount,
        wrong_count: wrongCount,
        unanswered_count: unansweredCount,
        score: scoreResult.score,
        percentile,
        time_spent_sec,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal mengumpulkan jawaban' },
      },
      { status: 500 }
    );
  }
}
