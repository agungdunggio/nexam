import { createServerSupabaseClient } from '@/lib/supabase/server';
import { calculatePercentile } from '@/lib/scoring';
import { RawSeedQuestion } from '@/lib/seedLoader';
import { sessionsCache, StoredSession } from '@/lib/sessionStore';
import { fetchQuestionsForSubtest, isValidUUID } from '@/lib/supabaseSimulation';
import {
  AnswerReviewItem,
  ComparisonStats,
  ScoreDistributionBucket,
  TestResult,
} from '@/types/results';
import { TestType } from '@/types/test';

/**
 * Reorder fetched questions to match the persisted session question order.
 */
export function orderQuestionsByIds(
  questions: (RawSeedQuestion & { id: string })[],
  questionIds?: string[]
): (RawSeedQuestion & { id: string })[] {
  if (!questionIds || questionIds.length === 0) return questions;

  const byId = new Map(questions.map((q) => [q.id, q]));
  const ordered: (RawSeedQuestion & { id: string })[] = [];

  for (const id of questionIds) {
    const found = byId.get(id);
    if (found) {
      ordered.push(found);
      byId.delete(id);
    }
  }

  for (const remaining of Array.from(byId.values())) {
    ordered.push(remaining);
  }

  return ordered;
}

function getPercentileValue(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((p / 100) * sortedAsc.length) - 1)
  );
  return Math.round(sortedAsc[idx]);
}

function normalizeRowScore(row: { score: number }): number {
  return Number(row.score) || 0;
}

function toBucketPercentage(testType: TestType, normalizedScore: number): number {
  if (testType === 'utbk') {
    return Math.max(0, Math.min(100, (normalizedScore / 1000) * 100));
  }
  return Math.max(0, Math.min(100, ((normalizedScore - 200) / 600) * 100));
}

const DISTRIBUTION_RANGES: Array<{ range: string; min: number; max: number }> = [
  { range: '0-10', min: 0, max: 10 },
  { range: '11-20', min: 11, max: 20 },
  { range: '21-30', min: 21, max: 30 },
  { range: '31-40', min: 31, max: 40 },
  { range: '41-50', min: 41, max: 50 },
  { range: '51-60', min: 51, max: 60 },
  { range: '61-70', min: 61, max: 70 },
  { range: '71-80', min: 71, max: 80 },
  { range: '81-90', min: 81, max: 90 },
  { range: '91-100', min: 91, max: 100 },
];

/**
 * Compute comparison stats and score distribution buckets from real Supabase `results`.
 */
export async function buildComparisonStats(
  testType: TestType,
  subtest: string,
  userScore: number,
  sessionId?: string
): Promise<{
  percentile: number;
  comparison: ComparisonStats;
  score_distribution: ScoreDistributionBucket[];
}> {
  let allScores: number[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await (supabase as any)
      .from('results')
      .select('session_id, score')
      .eq('test_type', testType)
      .eq('subtest', subtest);

    if (!error && Array.isArray(data)) {
      let includesCurrent = false;
      allScores = data.map((row: any) => {
        if (sessionId && row.session_id === sessionId) {
          includesCurrent = true;
        }
        return normalizeRowScore(row);
      });

      if (!includesCurrent) {
        allScores.push(userScore);
      }
    }
  } catch (err) {
    console.warn('[Supabase] Error querying results for comparison:', err);
  }

  if (allScores.length === 0) {
    allScores = [userScore];
  }

  const sorted = [...allScores].sort((a, b) => a - b);
  const totalParticipants = sorted.length;
  const avgScore = Math.round(sorted.reduce((sum, s) => sum + s, 0) / totalParticipants);
  const medianScore = getPercentileValue(sorted, 50);
  const p25 = getPercentileValue(sorted, 25);
  const p75 = getPercentileValue(sorted, 75);
  const p90 = getPercentileValue(sorted, 90);
  const higherCount = sorted.filter((s) => s > userScore).length;
  const yourRank = higherCount + 1;
  const percentile = calculatePercentile(userScore, sorted);

  const bucketCounts = DISTRIBUTION_RANGES.map((b) => ({ range: b.range, count: 0 }));
  for (const score of sorted) {
    const pct = Math.round(toBucketPercentage(testType, score));
    const bucketIdx = DISTRIBUTION_RANGES.findIndex((b) => pct >= b.min && pct <= b.max);
    if (bucketIdx >= 0) {
      bucketCounts[bucketIdx].count += 1;
    } else if (pct <= 0) {
      bucketCounts[0].count += 1;
    } else {
      bucketCounts[bucketCounts.length - 1].count += 1;
    }
  }

  return {
    percentile,
    comparison: {
      avg_score: avgScore,
      median_score: medianScore,
      your_rank: yourRank,
      total_participants: totalParticipants,
      p25,
      p75,
      p90,
    },
    score_distribution: bucketCounts,
  };
}

/**
 * Persist a newly started test session to Supabase when both session and user IDs are UUIDs.
 */
export async function saveTestSessionToSupabase(session: StoredSession): Promise<void> {
  if (!isValidUUID(session.id) || !isValidUUID(session.user_id)) {
    return;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await (supabase as any).from('test_sessions').insert({
      id: session.id,
      user_id: session.user_id,
      test_type: session.test_type,
      subtest: session.subtest,
      status: session.status,
      time_limit_sec: session.time_limit_sec,
      question_ids: session.question_ids,
      started_at: session.started_at,
    });

    if (error) {
      console.warn('[Supabase] Failed saving test_session:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase] Error saving test_session:', err);
  }
}

/**
 * Load a test session from in-memory cache or Supabase `test_sessions` table.
 */
export async function loadTestSession(sessionId: string): Promise<StoredSession | null> {
  const cached = sessionsCache.get(sessionId);
  if (cached) return cached;

  if (!isValidUUID(sessionId)) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: sessionRow, error } = await (supabase as any)
      .from('test_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error || !sessionRow) return null;

    const savedAnswers: Record<string, string> = {};
    const { data: answerRows } = await (supabase as any)
      .from('answers')
      .select('question_id, user_answer')
      .eq('session_id', sessionId);

    if (Array.isArray(answerRows)) {
      for (const row of answerRows) {
        if (row.user_answer) {
          savedAnswers[row.question_id] = row.user_answer;
        }
      }
    }

    const stored: StoredSession = {
      id: sessionRow.id,
      user_id: sessionRow.user_id,
      test_type: sessionRow.test_type,
      subtest: sessionRow.subtest,
      time_limit_sec: sessionRow.time_limit_sec,
      started_at: sessionRow.started_at,
      finished_at: sessionRow.finished_at,
      status: sessionRow.status,
      question_ids: Array.isArray(sessionRow.question_ids) ? sessionRow.question_ids : [],
      saved_answers: savedAnswers,
    };

    sessionsCache.set(sessionId, stored);
    return stored;
  } catch (err) {
    console.warn('[Supabase] Error loading test_session:', err);
    return null;
  }
}

/**
 * Persist completed test session, user answers, and computed result to Supabase.
 */
export async function saveTestSubmissionToSupabase(params: {
  session: StoredSession;
  result: TestResult;
  reviewItems: AnswerReviewItem[];
}): Promise<void> {
  const { session, result, reviewItems } = params;
  if (!isValidUUID(session.id) || !isValidUUID(session.user_id)) {
    return;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { error: sessionErr } = await (supabase as any)
      .from('test_sessions')
      .update({
        status: session.status,
        finished_at: session.finished_at,
      })
      .eq('id', session.id);

    if (sessionErr) {
      console.warn('[Supabase] Failed updating test_session:', sessionErr.message);
    }

    const answersToUpsert = reviewItems
      .filter((item) => isValidUUID(item.question_id))
      .map((item) => ({
        session_id: session.id,
        question_id: item.question_id,
        user_answer: item.user_answer,
        is_correct: item.is_correct,
        answered_at: session.finished_at || new Date().toISOString(),
      }));

    if (answersToUpsert.length > 0) {
      const { error: answersErr } = await (supabase as any)
        .from('answers')
        .upsert(answersToUpsert, { onConflict: 'session_id,question_id' });

      if (answersErr) {
        console.warn('[Supabase] Failed saving answers:', answersErr.message);
      }
    }

    const { error: resultErr } = await (supabase as any).from('results').upsert(
      {
        user_id: session.user_id,
        session_id: session.id,
        test_type: result.test_type,
        subtest: result.subtest,
        total_questions: result.total_questions,
        correct_count: result.correct_count,
        wrong_count: result.wrong_count,
        unanswered_count: result.unanswered_count,
        score: result.score,
        percentile: result.percentile,
        time_spent_sec: result.time_spent_sec,
      },
      { onConflict: 'session_id' }
    );

    if (resultErr) {
      console.warn('[Supabase] Failed saving result:', resultErr.message);
    }
  } catch (err) {
    console.warn('[Supabase] Error saving test submission:', err);
  }
}

/**
 * Load a test result from in-memory cache or reconstruct it from Supabase tables.
 */
export async function loadTestResult(sessionId: string): Promise<TestResult | null> {
  const cached = sessionsCache.get(sessionId);
  if (cached?.result) return cached.result;

  if (!isValidUUID(sessionId)) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: resultRow, error } = await (supabase as any)
      .from('results')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error || !resultRow) return null;

    const session = await loadTestSession(sessionId);
    const rawQuestions = await fetchQuestionsForSubtest(resultRow.subtest);
    const orderedQuestions = orderQuestionsByIds(rawQuestions, session?.question_ids);

    const { data: answerRows } = await (supabase as any)
      .from('answers')
      .select('question_id, user_answer, is_correct')
      .eq('session_id', sessionId);

    const answerMap = new Map<string, { user_answer: string | null; is_correct: boolean }>();
    if (Array.isArray(answerRows)) {
      for (const row of answerRows) {
        answerMap.set(row.question_id, {
          user_answer: row.user_answer ?? null,
          is_correct: Boolean(row.is_correct),
        });
      }
    }

    const reviewItems: AnswerReviewItem[] = orderedQuestions.map((q, idx) => {
      const saved = answerMap.get(q.id);
      return {
        question_id: q.id,
        number: idx + 1,
        type: q.question_type,
        content: q.content_id,
        options: q.options_id,
        user_answer: saved?.user_answer ?? null,
        correct_answer: q.correct_answer,
        is_correct: saved?.is_correct ?? false,
        explanation: q.explanation_id,
        difficulty: q.difficulty,
      };
    });

    const score = normalizeRowScore(resultRow);
    const { percentile, comparison, score_distribution } = await buildComparisonStats(
      resultRow.test_type,
      resultRow.subtest,
      score,
      sessionId
    );

    const reconstructed: TestResult = {
      session_id: sessionId,
      test_type: resultRow.test_type,
      subtest: resultRow.subtest,
      total_questions: resultRow.total_questions,
      correct_count: resultRow.correct_count,
      wrong_count: resultRow.wrong_count,
      unanswered_count: resultRow.unanswered_count,
      score,
      percentile,
      time_spent_sec: resultRow.time_spent_sec || 0,
      created_at: resultRow.created_at,
      answers: reviewItems,
      comparison,
      score_distribution,
    };

    if (session) {
      session.result = reconstructed;
      sessionsCache.set(sessionId, session);
    }

    return reconstructed;
  } catch (err) {
    console.warn('[Supabase] Error loading test result:', err);
    return null;
  }
}
