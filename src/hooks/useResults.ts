'use client';

import { useEffect, useState, useCallback } from 'react';
import { TestResult } from '@/types/results';

export function useResults(sessionId: string) {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/results/${sessionId}`);
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setError(data.error?.message || 'Failed to load results');
      }
    } catch {
      setError('An error occurred while fetching test results');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    result,
    isLoading,
    error,
    refetch: fetchResults,
  };
}
