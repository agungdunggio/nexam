import { NextRequest, NextResponse } from 'next/server';
import { UTBK_SIMULATION_SUBTESTS } from '@/lib/simulationConfig';
import { simulationsCache } from '@/lib/sessionStore';
import { getSeedQuestions, toClientQuestion } from '@/lib/seedLoader';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const sim = simulationsCache.get(id);
    if (!sim) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Hasil simulasi tidak ditemukan' },
        },
        { status: 404 }
      );
    }

    const breakdown = sim.subtests.map((sub, idx) => {
      const def = UTBK_SIMULATION_SUBTESTS[idx];
      return {
        subtestId: sub.subtestId,
        name: def?.name_id || sub.subtestId,
        component: def?.component || 'TPS',
        score: sub.score ?? 0,
        correctCount: sub.correctCount ?? 0,
        incorrectCount: sub.incorrectCount ?? 0,
        unansweredCount: sub.unansweredCount ?? 0,
        totalQuestions: def?.questionCount || 10,
        status: sub.status,
      };
    });

    let activeSubtestData = null;
    if (sim.status === 'in_progress') {
      const activeDef = UTBK_SIMULATION_SUBTESTS[sim.currentSubtestIndex];
      const activeState = sim.subtests[sim.currentSubtestIndex];
      if (activeDef && activeState) {
        const rawQuestions = getSeedQuestions(activeDef.id);
        const clientQuestions = rawQuestions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));
        activeSubtestData = {
          subtestId: activeDef.id,
          name: activeDef.name_id,
          component: activeDef.component,
          sessionId: activeState.sessionId,
          timeLimitSec: activeDef.timeLimitSec,
          questions: clientQuestions,
          savedAnswers: activeState.answers || {},
          flagged: activeState.flagged || [],
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: sim.id,
        startedAt: sim.startedAt,
        finishedAt: sim.finishedAt,
        status: sim.status,
        currentSubtestIndex: sim.currentSubtestIndex,
        totalSubtests: sim.subtests.length,
        breakdown,
        activeSubtest: activeSubtestData,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal memuat hasil simulasi' },
      },
      { status: 500 }
    );
  }
}
