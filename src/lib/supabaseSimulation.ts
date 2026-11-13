import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSeedQuestions, RawSeedQuestion } from '@/lib/seedLoader';

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

const questionsCache = new Map<string, (RawSeedQuestion & { id: string })[]>();

/**
 * Fetch questions from Supabase `questions` table with fallback to local seed.
 * Uses in-memory caching to avoid redundant network queries during a session.
 */
export async function fetchQuestionsForSubtest(
  subtest: string
): Promise<(RawSeedQuestion & { id: string })[]> {
  if (questionsCache.has(subtest)) {
    return questionsCache.get(subtest)!;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('questions')
      .select('*')
      .eq('subtest', subtest);

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: (RawSeedQuestion & { id: string })[] = data.map((q) => ({
        id: q.id,
        test_type: q.test_type,
        subtest: q.subtest,
        question_type: q.question_type,
        content_id: q.content_id,
        content_en: q.content_en || undefined,
        options_id: q.options_id || undefined,
        options_en: q.options_en || undefined,
        correct_answer: q.correct_answer,
        explanation_id: q.explanation_id || '',
        explanation_en: q.explanation_en || undefined,
        difficulty: q.difficulty || 'medium',
      }));

      questionsCache.set(subtest, mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('[Supabase] Failed to fetch questions, using seed fallback:', err);
  }

  const fallback = getSeedQuestions(subtest);
  return fallback;
}

export interface SubtestSessionInit {
  sessionId: string;
  subtestId: string;
  timeLimitSec: number;
  questionIds: string[];
}

export async function saveSimulationStartToSupabase(params: {
  simulationId: string;
  userId: string;
  startedAt: string;
  subtestSessions: SubtestSessionInit[];
}) {
  if (!isValidUUID(params.userId)) {
    return; // anonymous or offline user
  }

  try {
    const supabase = await createServerSupabaseClient();

    // 1. Save master simulation record if table exists
    try {
      const simulationsTable = (supabase as any).from('simulations');
      await simulationsTable.insert({
        id: params.simulationId,
        user_id: params.userId,
        status: 'in_progress',
        started_at: params.startedAt,
        subtest_scores: [],
      });
    } catch {
      // Table might not exist yet if migration hasn't run
    }

    // 2. Save individual subtest sessions in test_sessions
    const sessionsToInsert = params.subtestSessions.map((s) => ({
      id: s.sessionId,
      user_id: params.userId,
      test_type: 'utbk' as const,
      subtest: s.subtestId,
      status: 'in_progress' as const,
      time_limit_sec: s.timeLimitSec,
      question_ids: s.questionIds,
      started_at: params.startedAt,
    }));

    const { error: sessionError } = await (supabase as any)
      .from('test_sessions')
      .insert(sessionsToInsert);

    if (sessionError) {
      console.warn('[Supabase] Non-blocking warning saving test_sessions:', sessionError.message);
    }
  } catch (err) {
    console.warn('[Supabase] Non-blocking warning during simulation start persistence:', err);
  }
}

export interface AnswerToSave {
  questionId: string;
  userAnswer: string | null;
  isCorrect: boolean;
}

export async function saveSubtestResultToSupabase(params: {
  userId: string;
  sessionId: string;
  subtestId: string;
  finishedAt: string;
  timeSpentSec: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  answers: AnswerToSave[];
}) {
  if (!isValidUUID(params.userId) || !isValidUUID(params.sessionId)) {
    return;
  }

  try {
    const supabase = await createServerSupabaseClient();

    // 1. Update test_sessions status
    await (supabase as any)
      .from('test_sessions')
      .update({
        status: 'completed',
        finished_at: params.finishedAt,
      })
      .eq('id', params.sessionId);

    // 2. Insert answers (filter to UUID question IDs)
    if (params.answers.length > 0) {
      const answersToInsert = params.answers
        .filter((a) => isValidUUID(a.questionId))
        .map((a) => ({
          session_id: params.sessionId,
          question_id: a.questionId,
          user_answer: a.userAnswer,
          is_correct: a.isCorrect,
          answered_at: params.finishedAt,
        }));

      if (answersToInsert.length > 0) {
        await (supabase as any).from('answers').insert(answersToInsert);
      }
    }

    // 3. Insert results record
    const { error: resultErr } = await (supabase as any).from('results').insert({
      user_id: params.userId,
      session_id: params.sessionId,
      test_type: 'utbk' as const,
      subtest: params.subtestId,
      total_questions: params.totalQuestions,
      correct_count: params.correctCount,
      wrong_count: params.wrongCount,
      unanswered_count: params.unansweredCount,
      score: params.score,
      time_spent_sec: params.timeSpentSec,
    });

    if (resultErr) {
      console.warn('[Supabase] Non-blocking warning saving result:', resultErr.message);
    }
  } catch (err) {
    console.warn('[Supabase] Non-blocking warning during subtest result persistence:', err);
  }
}

export async function saveSimulationCompletionToSupabase(params: {
  simulationId: string;
  userId: string;
  finishedAt: string;
  totalScore: number;
  subtestScores: Array<{
    subtestId: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
  }>;
}) {
  if (!isValidUUID(params.userId) || !isValidUUID(params.simulationId)) {
    return;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const simulationsTable = (supabase as any).from('simulations');
    await simulationsTable
      .update({
        status: 'completed',
        finished_at: params.finishedAt,
        total_score: params.totalScore,
        subtest_scores: params.subtestScores,
      })
      .eq('id', params.simulationId);
  } catch {
    // Non-blocking
  }
}
