import { NextRequest, NextResponse } from 'next/server';
import { calculateScore } from '@/lib/scoring';
import { sessionsCache, StoredSession } from '@/lib/sessionStore';
import { fetchQuestionsForSubtest } from '@/lib/supabaseSimulation';
import {
  buildComparisonStats,
  loadTestSession,
  orderQuestionsByIds,
  saveTestSubmissionToSupabase,
} from '@/lib/supabaseTest';
import { AnswerReviewItem, TestResult } from '@/types/results';
import { TestType } from '@/types/test';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      session_id,
      answers,
      time_spent_sec = 0,
      auto_submitted = false,
      test_type: fallbackTestType,
      subtest: fallbackSubtest,
    } = body as {
      session_id?: string;
      answers?: Array<{ question_id: string; answer: string | null }>;
      time_spent_sec?: number;
      auto_submitted?: boolean;
      test_type?: TestType;
      subtest?: string;
    };

    if (!session_id || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Data submission tidak lengkap' },
        },
        { status: 400 }
      );
    }

    let session = await loadTestSession(session_id);
    if (!session && fallbackTestType && fallbackSubtest) {
      session = {
        id: session_id,
        user_id: 'anonymous_user',
        test_type: fallbackTestType,
        subtest: fallbackSubtest,
        time_limit_sec: 0,
        started_at: new Date().toISOString(),
        finished_at: null,
        status: 'in_progress',
        question_ids: [],
        saved_answers: {},
      } satisfies StoredSession;
    }

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

    const rawQuestions = await fetchQuestionsForSubtest(session.subtest, session.version || 'v1');
    const questions = orderQuestionsByIds(rawQuestions, session.question_ids);
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
      items: reviewItems.map((item) => ({
        isCorrect: item.is_correct,
        isAnswered: item.user_answer !== null,
        difficulty: item.difficulty,
      })),
    });

    const { percentile, comparison, score_distribution } = await buildComparisonStats(
      session.test_type,
      session.subtest,
      scoreResult.score,
      session_id
    );

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
      score_distribution,
    };

    session.status = auto_submitted ? 'timed_out' : 'completed';
    session.finished_at = new Date().toISOString();
    session.result = finalResult;
    sessionsCache.set(session_id, session);
    await saveTestSubmissionToSupabase({ session, result: finalResult, reviewItems });

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
      fullResult: finalResult,
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
