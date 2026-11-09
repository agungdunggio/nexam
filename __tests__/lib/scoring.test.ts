import { calculateScore, calculatePercentile } from '@/lib/scoring';

describe('Scoring Logic', () => {
  describe('UTBK Scoring', () => {
    it('calculates UTBK score correctly on a 0-1000 scale', () => {
      const result = calculateScore({
        testType: 'utbk',
        totalQuestions: 10,
        correctCount: 8,
        wrongCount: 2,
        unansweredCount: 0,
      });

      expect(result.score).toBe(800);
      expect(result.accuracy).toBe(80);
      expect(result.maxScore).toBe(1000);
      expect(result.minScore).toBe(0);
    });

    it('handles perfect score in UTBK', () => {
      const result = calculateScore({
        testType: 'utbk',
        totalQuestions: 30,
        correctCount: 30,
        wrongCount: 0,
        unansweredCount: 0,
      });

      expect(result.score).toBe(1000);
      expect(result.accuracy).toBe(100);
    });

    it('handles zero score in UTBK', () => {
      const result = calculateScore({
        testType: 'utbk',
        totalQuestions: 10,
        correctCount: 0,
        wrongCount: 10,
        unansweredCount: 0,
      });

      expect(result.score).toBe(0);
      expect(result.accuracy).toBe(0);
    });
  });

  describe('TPA Scoring', () => {
    it('scales score correctly between 200 and 800 with +4 and -1 penalty', () => {
      const result = calculateScore({
        testType: 'tpa',
        totalQuestions: 10,
        correctCount: 10,
        wrongCount: 0,
        unansweredCount: 0,
      });

      expect(result.score).toBe(800);
    });

    it('calculates scaled score when there are wrong answers', () => {
      const result = calculateScore({
        testType: 'tpa',
        totalQuestions: 10,
        correctCount: 5,
        wrongCount: 5,
        unansweredCount: 0,
      });

      expect(result.score).toBeGreaterThan(200);
      expect(result.score).toBeLessThan(800);
    });
  });

  describe('calculatePercentile', () => {
    it('computes higher percentile for higher scores', () => {
      const benchmarks = [500, 600, 700, 800, 900];
      const pctLow = calculatePercentile(550, benchmarks);
      const pctHigh = calculatePercentile(850, benchmarks);

      expect(pctHigh).toBeGreaterThan(pctLow);
    });
  });
});
