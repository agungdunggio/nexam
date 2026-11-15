import { calculateScore, calculatePercentile, getQuestionIrtWeight } from '@/lib/scoring';

describe('Scoring Logic', () => {
  describe('IRT Difficulty Weighting', () => {
    it('assigns higher weights to harder questions', () => {
      expect(getQuestionIrtWeight('easy')).toBe(1.0);
      expect(getQuestionIrtWeight('medium')).toBe(1.5);
      expect(getQuestionIrtWeight('hard')).toBe(2.0);
    });

    it('boosts weight when empirical correct rate is lower', () => {
      const highPassWeight = getQuestionIrtWeight('medium', 0.9);
      const lowPassWeight = getQuestionIrtWeight('medium', 0.2);

      expect(lowPassWeight).toBeGreaterThan(highPassWeight);
    });
  });

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
      expect(result.scoringModel).toBe('irt_weighted');
    });

    it('awards higher score for solving harder items with same correct count (IRT)', () => {
      const baseItems = [
        { isCorrect: false, isAnswered: true, difficulty: 'easy' },
        { isCorrect: false, isAnswered: true, difficulty: 'hard' },
      ];

      const onlyEasyCorrect = calculateScore({
        testType: 'utbk',
        totalQuestions: 2,
        correctCount: 1,
        wrongCount: 1,
        unansweredCount: 0,
        items: [
          { ...baseItems[0], isCorrect: true },
          baseItems[1],
        ],
      });

      const onlyHardCorrect = calculateScore({
        testType: 'utbk',
        totalQuestions: 2,
        correctCount: 1,
        wrongCount: 1,
        unansweredCount: 0,
        items: [
          baseItems[0],
          { ...baseItems[1], isCorrect: true },
        ],
      });

      expect(onlyHardCorrect.score).toBeGreaterThan(onlyEasyCorrect.score);
      expect(onlyEasyCorrect.score).toBe(333.3);
      expect(onlyHardCorrect.score).toBe(666.7);
    });

    it('does not deduct points for wrong answers in UTBK', () => {
      const withWrong = calculateScore({
        testType: 'utbk',
        totalQuestions: 2,
        correctCount: 1,
        wrongCount: 1,
        unansweredCount: 0,
        items: [
          { isCorrect: true, isAnswered: true, difficulty: 'medium' },
          { isCorrect: false, isAnswered: true, difficulty: 'medium' },
        ],
      });

      const withBlank = calculateScore({
        testType: 'utbk',
        totalQuestions: 2,
        correctCount: 1,
        wrongCount: 0,
        unansweredCount: 1,
        items: [
          { isCorrect: true, isAnswered: true, difficulty: 'medium' },
          { isCorrect: false, isAnswered: false, difficulty: 'medium' },
        ],
      });

      expect(withWrong.score).toBe(withBlank.score);
      expect(withWrong.score).toBe(500);
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
      expect(result.scoringModel).toBe('tpa_classic');
    });

    it('applies -1 penalty so wrong answers score lower than blanks in TPA', () => {
      const withWrong = calculateScore({
        testType: 'tpa',
        totalQuestions: 10,
        correctCount: 5,
        wrongCount: 5,
        unansweredCount: 0,
      });

      const withBlanks = calculateScore({
        testType: 'tpa',
        totalQuestions: 10,
        correctCount: 5,
        wrongCount: 0,
        unansweredCount: 5,
      });

      expect(withWrong.rawScore).toBe(15);
      expect(withBlanks.rawScore).toBe(20);
      expect(withWrong.score).toBeLessThan(withBlanks.score);
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
