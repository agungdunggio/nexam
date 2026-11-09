import { cn, formatTime, formatScore } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('merges tailwind classes cleanly and resolves conflicts', () => {
      const result = cn('px-2 py-1', 'px-4', 'text-red-500');
      expect(result).toContain('px-4');
      expect(result).not.toContain('px-2');
      expect(result).toContain('py-1');
      expect(result).toContain('text-red-500');
    });
  });

  describe('formatTime', () => {
    it('formats seconds into MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(1800)).toBe('30:00');
      expect(formatTime(2100)).toBe('35:00');
    });

    it('handles negative or decimal seconds safely', () => {
      expect(formatTime(-10)).toBe('00:00');
      expect(formatTime(59.9)).toBe('00:59');
    });
  });

  describe('formatScore', () => {
    it('formats whole numbers without decimal point', () => {
      expect(formatScore(800)).toBe('800');
      expect(formatScore(100)).toBe('100');
    });

    it('formats floats with one decimal place', () => {
      expect(formatScore(73.3333)).toBe('73.3');
      expect(formatScore(86.6666)).toBe('86.7');
    });
  });
});
