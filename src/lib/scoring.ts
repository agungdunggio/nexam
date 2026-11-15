import { DifficultyLevel, TestType } from '@/types/test';

export const IRT_DIFFICULTY_WEIGHTS: Record<DifficultyLevel, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

export interface ScoredQuestionItem {
  isCorrect: boolean;
  isAnswered: boolean;
  difficulty?: DifficultyLevel | string;
  /** Optional cohort pass rate (0..1); lower pass rate increases item weight */
  empiricalCorrectRate?: number;
}

export interface ScoreCalculationInput {
  testType: TestType;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  items?: ScoredQuestionItem[];
}

export interface ScoreCalculationResult {
  score: number;
  rawScore: number;
  maxScore: number;
  minScore: number;
  accuracy: number;
  scoringModel: 'irt_weighted' | 'tpa_classic';
  maxRawScore?: number;
}

/**
 * Compute IRT-style item weight from difficulty level and optional cohort accuracy.
 * Harder items carry higher weight; wrong/blank answers never incur a negative penalty in UTBK.
 */
export function getQuestionIrtWeight(
  difficulty?: DifficultyLevel | string,
  empiricalCorrectRate?: number
): number {
  const key = difficulty?.toLowerCase() as DifficultyLevel | undefined;
  const baseWeight = (key && IRT_DIFFICULTY_WEIGHTS[key]) || IRT_DIFFICULTY_WEIGHTS.medium;

  if (typeof empiricalCorrectRate === 'number' && Number.isFinite(empiricalCorrectRate)) {
    const clampedRate = Math.max(0, Math.min(1, empiricalCorrectRate));
    // Boost weight up to +50% when fewer participants answer the item correctly
    return Number((baseWeight * (1 + 0.5 * (1 - clampedRate))).toFixed(3));
  }

  return baseWeight;
}

export function calculateScore(input: ScoreCalculationInput): ScoreCalculationResult {
  const { testType, totalQuestions, correctCount, wrongCount, items } = input;
  const safeTotal = Math.max(1, totalQuestions);
  const accuracy = Number(((correctCount / safeTotal) * 100).toFixed(1));

  if (testType === 'utbk') {
    // UTBK (SNBT): IRT difficulty-weighted, no negative marking (wrong/blank = 0), scaled 0 - 1000
    if (items && items.length > 0) {
      let earnedWeight = 0;
      let totalWeight = 0;

      for (const item of items) {
        const weight = getQuestionIrtWeight(item.difficulty, item.empiricalCorrectRate);
        totalWeight += weight;
        if (item.isCorrect) {
          earnedWeight += weight;
        }
      }

      const safeTotalWeight = Math.max(0.001, totalWeight);
      const score = Number(((earnedWeight / safeTotalWeight) * 1000).toFixed(1));
      return {
        score,
        rawScore: Number(earnedWeight.toFixed(2)),
        maxRawScore: Number(totalWeight.toFixed(2)),
        maxScore: 1000,
        minScore: 0,
        accuracy,
        scoringModel: 'irt_weighted',
      };
    }

    const rawScore = correctCount * 1;
    const score = Number(((correctCount / safeTotal) * 1000).toFixed(1));
    return {
      score,
      rawScore,
      maxRawScore: safeTotal,
      maxScore: 1000,
      minScore: 0,
      accuracy,
      scoringModel: 'irt_weighted',
    };
  }

  // TPA classic: +4 per correct, -1 per wrong, 0 unanswered. Scaled 200 - 800
  const rawScore = correctCount * 4 + wrongCount * -1;
  const maxRaw = safeTotal * 4;
  const minRaw = safeTotal * -1;

  const normalized = (rawScore - minRaw) / (maxRaw - minRaw);
  const scaledScore = Math.max(200, Math.min(800, Math.round(200 + normalized * (800 - 200))));

  return {
    score: scaledScore,
    rawScore,
    maxRawScore: maxRaw,
    maxScore: 800,
    minScore: 200,
    accuracy,
    scoringModel: 'tpa_classic',
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
