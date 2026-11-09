import { create } from 'zustand';
import { formatTime } from '@/lib/utils';

export type UrgencyLevel = 'normal' | 'warning' | 'critical';

interface TimerState {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  intervalId: NodeJS.Timeout | null;

  percentage: number;
  formattedTime: string;
  urgencyLevel: UrgencyLevel;

  onTimeUp: (() => void) | null;
  onWarning: ((minutesLeft: number) => void) | null;

  startTimer: (totalSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  setCallbacks: (onTimeUp: () => void, onWarning?: (min: number) => void) => void;
}

function calculateUrgency(remaining: number, total: number): UrgencyLevel {
  if (total <= 0) return 'normal';
  const pct = (remaining / total) * 100;
  if (remaining <= 60 || pct < 20) return 'critical';
  if (remaining <= 300 || pct < 35) return 'warning';
  return 'normal';
}

export const useTimerStore = create<TimerState>((set, get) => ({
  remainingSeconds: 0,
  totalSeconds: 0,
  isRunning: false,
  isPaused: false,
  intervalId: null,

  percentage: 100,
  formattedTime: '00:00',
  urgencyLevel: 'normal',

  onTimeUp: null,
  onWarning: null,

  setCallbacks: (onTimeUp, onWarning) => {
    set({
      onTimeUp,
      onWarning: onWarning || null,
    });
  },

  startTimer: (totalSeconds: number) => {
    // Clear any existing timer
    const existing = get().intervalId;
    if (existing) clearInterval(existing);

    const safeTotal = Math.max(0, totalSeconds);
    const initialUrgency = calculateUrgency(safeTotal, safeTotal);

    const interval = setInterval(() => {
      get().tick();
    }, 1000);

    set({
      remainingSeconds: safeTotal,
      totalSeconds: safeTotal,
      isRunning: true,
      isPaused: false,
      intervalId: interval,
      percentage: 100,
      formattedTime: formatTime(safeTotal),
      urgencyLevel: initialUrgency,
    });
  },

  tick: () => {
    const { remainingSeconds, totalSeconds, intervalId, onTimeUp, onWarning } = get();

    if (remainingSeconds <= 1) {
      if (intervalId) clearInterval(intervalId);
      set({
        remainingSeconds: 0,
        isRunning: false,
        isPaused: false,
        intervalId: null,
        percentage: 0,
        formattedTime: '00:00',
        urgencyLevel: 'critical',
      });
      if (onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const nextRemaining = remainingSeconds - 1;
    const pct = totalSeconds > 0 ? (nextRemaining / totalSeconds) * 100 : 0;
    const urgency = calculateUrgency(nextRemaining, totalSeconds);

    // Warning triggers at exactly 5m (300s) and 1m (60s)
    if (onWarning) {
      if (nextRemaining === 300) onWarning(5);
      if (nextRemaining === 60) onWarning(1);
    }

    set({
      remainingSeconds: nextRemaining,
      percentage: Number(pct.toFixed(1)),
      formattedTime: formatTime(nextRemaining),
      urgencyLevel: urgency,
    });
  },

  pauseTimer: () => {
    const { intervalId, isRunning } = get();
    if (intervalId) clearInterval(intervalId);
    if (isRunning) {
      set({ isRunning: false, isPaused: true, intervalId: null });
    }
  },

  resumeTimer: () => {
    const { isPaused, remainingSeconds } = get();
    if (isPaused && remainingSeconds > 0) {
      const interval = setInterval(() => {
        get().tick();
      }, 1000);
      set({ isRunning: true, isPaused: false, intervalId: interval });
    }
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      isRunning: false,
      isPaused: false,
      intervalId: null,
    });
  },
}));
