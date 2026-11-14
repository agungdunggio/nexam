import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { UTBK_SIMULATION_SUBTESTS, StoredSimulationSession } from '@/lib/simulationConfig';
import { toClientQuestion } from '@/lib/seedLoader';
import { sessionsCache, simulationsCache, StoredSession } from '@/lib/sessionStore';
import { fetchQuestionsForSubtest, saveSimulationStartToSupabase } from '@/lib/supabaseSimulation';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('nexam_session');
    const userId = sessionCookie?.value || 'anonymous_user';

    const simulationId = crypto.randomUUID();
    const startedAt = new Date().toISOString();

    const subtestsState: StoredSimulationSession['subtests'] = [];
    const subtestSessionsForDb: Array<{
      sessionId: string;
      subtestId: string;
      timeLimitSec: number;
      questionIds: string[];
    }> = [];

    let firstSubtestData: {
      subtestId: string;
      sessionId: string;
      timeLimitSec: number;
      questions: ReturnType<typeof toClientQuestion>[];
    } | null = null;

    for (let i = 0; i < UTBK_SIMULATION_SUBTESTS.length; i++) {
      const def = UTBK_SIMULATION_SUBTESTS[i];
      const sessionId = crypto.randomUUID();
      const questions = await fetchQuestionsForSubtest(def.id);

      const clientQuestions = questions.map((q, idx) => toClientQuestion(q, idx + 1, 'id'));

      const storedSession: StoredSession = {
        id: sessionId,
        user_id: userId,
        test_type: 'utbk',
        subtest: def.id,
        time_limit_sec: def.timeLimitSec,
        started_at: startedAt,
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

      subtestSessionsForDb.push({
        sessionId,
        subtestId: def.id,
        timeLimitSec: def.timeLimitSec,
        questionIds: questions.map((q) => q.id),
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

    // Persist to Supabase in background (non-blocking)
    saveSimulationStartToSupabase({
      simulationId,
      userId,
      startedAt,
      subtestSessions: subtestSessionsForDb,
    }).catch((err) => console.warn('[Supabase] Non-blocking simulation start save error:', err));

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
