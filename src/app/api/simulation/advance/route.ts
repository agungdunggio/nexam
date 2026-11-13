import { NextRequest, NextResponse } from 'next/server';
import { UTBK_SIMULATION_SUBTESTS } from '@/lib/simulationConfig';
import { toClientQuestion } from '@/lib/seedLoader';
import { simulationsCache } from '@/lib/sessionStore';
import { calculateScore } from '@/lib/scoring';
import {
  fetchQuestionsForSubtest,
  saveSubtestResultToSupabase,
  saveSimulationCompletionToSupabase,
} from '@/lib/supabaseSimulation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { simulationId, subtestIndex, answers, flagged = [] } = body;

    if (!simulationId || typeof subtestIndex !== 'number' || !Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Data simulasi tidak valid' },
        },
        { status: 400 }
      );
    }

    const sim = simulationsCache.get(simulationId);
    if (!sim) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Sesi simulasi tidak ditemukan' },
        },
        { status: 404 }
      );
    }

    if (sim.status === 'completed') {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'ALREADY_COMPLETED', message: 'Simulasi ini sudah selesai dikerjakan' },
        },
        { status: 409 }
      );
    }

    const currentSubtestState = sim.subtests[subtestIndex];
    if (!currentSubtestState) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Subtes tidak valid' },
        },
        { status: 404 }
      );
    }

    // Score current subtest
    const rawQuestions = await fetchQuestionsForSubtest(currentSubtestState.subtestId);
    const answersMap = new Map<string, string>();
    answers.forEach((item: { question_id: string; answer: string | null }) => {
      if (item.answer) {
        answersMap.set(item.question_id, String(item.answer).trim());
      }
    });

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const answersToSave = rawQuestions.map((q) => {
      const userAns = answersMap.get(q.id);
      let isCorrect = false;

      if (!userAns) {
        unansweredCount++;
      } else {
        isCorrect =
          q.question_type === 'multiple_choice'
            ? userAns.toUpperCase() === q.correct_answer.toUpperCase()
            : userAns === q.correct_answer;
        if (isCorrect) correctCount++;
        else wrongCount++;
      }

      return {
        questionId: q.id,
        userAnswer: userAns || null,
        isCorrect,
      };
    });

    const scoreResult = calculateScore({
      testType: 'utbk',
      totalQuestions: rawQuestions.length,
      correctCount,
      wrongCount,
      unansweredCount,
    });

    const finishedAt = new Date().toISOString();

    // Mark current subtest completed
    currentSubtestState.status = 'completed';
    currentSubtestState.finishedAt = finishedAt;
    currentSubtestState.answers = Object.fromEntries(answersMap);
    currentSubtestState.flagged = flagged;
    currentSubtestState.score = scoreResult.score;
    currentSubtestState.correctCount = correctCount;
    currentSubtestState.incorrectCount = wrongCount;
    currentSubtestState.unansweredCount = unansweredCount;

    // Save subtest result to Supabase (non-blocking)
    saveSubtestResultToSupabase({
      userId: sim.userId,
      sessionId: currentSubtestState.sessionId,
      subtestId: currentSubtestState.subtestId,
      finishedAt,
      timeSpentSec: UTBK_SIMULATION_SUBTESTS[subtestIndex]?.timeLimitSec || 600,
      totalQuestions: rawQuestions.length,
      correctCount,
      wrongCount,
      unansweredCount,
      score: scoreResult.score,
      answers: answersToSave,
    }).catch((err) => console.warn('[Supabase] Non-blocking subtest save error:', err));

    // Check if there is a next subtest
    const nextIndex = subtestIndex + 1;
    if (nextIndex < sim.subtests.length) {
      sim.currentSubtestIndex = nextIndex;
      const nextSubtestState = sim.subtests[nextIndex];
      const nextDef = UTBK_SIMULATION_SUBTESTS[nextIndex];
      const nextQuestions = await fetchQuestionsForSubtest(nextDef.id);
      const nextClientQuestions = nextQuestions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

      nextSubtestState.status = 'in_progress';
      nextSubtestState.startedAt = new Date().toISOString();

      return NextResponse.json({
        success: true,
        completed: false,
        currentSubtestIndex: nextIndex,
        totalSubtests: sim.subtests.length,
        nextSubtest: {
          subtestId: nextDef.id,
          name: nextDef.name_id,
          component: nextDef.component,
          sessionId: nextSubtestState.sessionId,
          timeLimitSec: nextDef.timeLimitSec,
          questions: nextClientQuestions,
        },
      });
    }

    // Final subtest reached: complete the whole simulation
    sim.status = 'completed';
    sim.finishedAt = new Date().toISOString();

    // Calculate composite score (average of all subtests)
    const validScores = sim.subtests.map((s) => s.score || 0);
    const compositeScore = Math.round(
      validScores.reduce((acc, curr) => acc + curr, 0) / Math.max(1, validScores.length)
    );
    sim.compositeScore = compositeScore;

    // Save final simulation score to Supabase (non-blocking)
    saveSimulationCompletionToSupabase({
      simulationId: sim.id,
      userId: sim.userId,
      finishedAt: sim.finishedAt,
      totalScore: compositeScore,
      subtestScores: sim.subtests.map((s) => ({
        subtestId: s.subtestId,
        score: s.score || 0,
        correctCount: s.correctCount || 0,
        totalQuestions: rawQuestions.length,
      })),
    }).catch((err) => console.warn('[Supabase] Non-blocking simulation final save error:', err));

    return NextResponse.json({
      success: true,
      completed: true,
      simulationId,
      compositeScore,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal memperbarui progres simulasi' },
      },
      { status: 500 }
    );
  }
}
