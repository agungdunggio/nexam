import { TestType } from '@/types/test';

export interface ScoreCalculationInput {
  testType: TestType;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
}

export interface ScoreCalculationResult {
  score: number;
  rawScore: number;
  maxScore: number;
  minScore: number;
  accuracy: number;
}

export function calculateScore(input: ScoreCalculationInput): ScoreCalculationResult {
  const { testType, totalQuestions, correctCount, wrongCount } = input;
  const safeTotal = Math.max(1, totalQuestions);
  const accuracy = Number(((correctCount / safeTotal) * 100).toFixed(1));

  if (testType === 'utbk') {
    // UTBK (SNBT): +1 per correct answer, 0 for wrong/unanswered. Scaled 0 - 1000
    const rawScore = correctCount * 1;
    const score = Number(((correctCount / safeTotal) * 1000).toFixed(1));
    return {
      score,
      rawScore,
      maxScore: 1000,
      minScore: 0,
      accuracy,
    };
  }

  // TPA: +4 per correct, -1 per wrong, 0 unanswered. Scaled 200 - 800
  const rawScore = correctCount * 4 + wrongCount * -1;
  const maxRaw = safeTotal * 4;
  const minRaw = safeTotal * -1;

  const normalized = (rawScore - minRaw) / (maxRaw - minRaw);
  const scaledScore = Math.max(200, Math.min(800, Math.round(200 + normalized * (800 - 200))));

  return {
    score: scaledScore,
    rawScore,
    maxScore: 800,
    minScore: 200,
    accuracy,
  };
}

export function calculatePercentile(userScore: number, allScores: number[]): number {
  if (!allScores || allScores.length === 0) {
    return 50.0;
  }
  const countBelow = allScores.filter((s) => s < userScore).length;
  const equalCount = allScores.filter((s) => s === userScore).length;
  // Standard percentile rank: (below + 0.5 * equal) / total * 100
  const percentile = ((countBelow + 0.5 * equalCount) / allScores.length) * 100;
  return Number(Math.max(1, Math.min(99.9, percentile)).toFixed(1));
}
