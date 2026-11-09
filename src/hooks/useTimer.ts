'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/stores/timerStore';

interface UseTimerOptions {
  totalSeconds?: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
  onWarning?: (minutesLeft: number) => void;
}

export function useTimer(options?: UseTimerOptions) {
  const {
    remainingSeconds,
    totalSeconds,
    isRunning,
    isPaused,
    percentage,
    formattedTime,
    urgencyLevel,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setCallbacks,
  } = useTimerStore();

  useEffect(() => {
    if (options?.onTimeUp) {
      setCallbacks(options.onTimeUp, options.onWarning);
    }
  }, [options?.onTimeUp, options?.onWarning, setCallbacks]);

  useEffect(() => {
    if (options?.autoStart && options.totalSeconds && options.totalSeconds > 0) {
      startTimer(options.totalSeconds);
    }
    return () => {
      // Don't auto-stop on re-render, allow persist
    };
  }, [options?.autoStart, options?.totalSeconds, startTimer]);

  return {
    remainingSeconds,
    totalSeconds,
    isRunning,
    isPaused,
    percentage,
    formattedTime,
    urgencyLevel,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
}
