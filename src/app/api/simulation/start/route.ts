import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UTBK_SIMULATION_SUBTESTS, StoredSimulationSession } from '@/lib/simulationConfig';
import { getSeedQuestions, toClientQuestion } from '@/lib/seedLoader';
import { sessionsCache, simulationsCache, StoredSession } from '@/lib/sessionStore';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nexam_session');
    const userId = sessionCookie?.value || 'anonymous_user';

    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startedAt = new Date().toISOString();

    const subtestsState: StoredSimulationSession['subtests'] = [];

    let firstSubtestData: {
      subtestId: string;
      sessionId: string;
      timeLimitSec: number;
      questions: ReturnType<typeof toClientQuestion>[];
    } | null = null;

    for (let i = 0; i < UTBK_SIMULATION_SUBTESTS.length; i++) {
      const def = UTBK_SIMULATION_SUBTESTS[i];
      const sessionId = `ses_sim_${Date.now()}_${i}_${def.id}`;
      const questions = getSeedQuestions(def.id);

      const clientQuestions = questions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

      const storedSession: StoredSession = {
        id: sessionId,
        user_id: userId,
        test_type: 'utbk',
        subtest: def.id,
        time_limit_sec: def.timeLimitSec,
        started_at: i === 0 ? startedAt : startedAt,
        finished_at: null,
        status: 'in_progress',
        question_ids: questions.map((q) => q.id),
        saved_answers: {},
      };

      sessionsCache.set(sessionId, storedSession);

      subtestsState.push({
        subtestId: def.id,
        sessionId,
        startedAt: i === 0 ? startedAt : null,
        finishedAt: null,
        status: i === 0 ? 'in_progress' : 'pending',
        answers: {},
        flagged: [],
      });

      if (i === 0) {
        firstSubtestData = {
          subtestId: def.id,
          sessionId,
          timeLimitSec: def.timeLimitSec,
          questions: clientQuestions,
        };
      }
    }

    const storedSimulation: StoredSimulationSession = {
      id: simulationId,
      userId,
      startedAt,
      finishedAt: null,
      status: 'in_progress',
      currentSubtestIndex: 0,
      subtests: subtestsState,
    };

    simulationsCache.set(simulationId, storedSimulation);

    return NextResponse.json({
      success: true,
      simulation: {
        id: simulationId,
        startedAt,
        currentSubtestIndex: 0,
        totalSubtests: UTBK_SIMULATION_SUBTESTS.length,
        subtests: UTBK_SIMULATION_SUBTESTS.map((s, idx) => ({
          id: s.id,
          name: s.name_id,
          component: s.component,
          timeLimitSec: s.timeLimitSec,
          questionCount: s.questionCount,
          index: idx,
        })),
        activeSubtest: firstSubtestData,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Gagal memulai simulasi UTBK' },
      },
      { status: 500 }
    );
  }
}
