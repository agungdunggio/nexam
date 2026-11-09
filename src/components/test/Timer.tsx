'use client';

import { UrgencyLevel } from '@/stores/timerStore';
import { Clock } from 'lucide-react';

interface TimerProps {
  formattedTime: string;
  urgencyLevel: UrgencyLevel;
  className?: string;
}

export function Timer({ formattedTime, urgencyLevel, className = '' }: TimerProps) {
  let colorStyle = 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700';

  if (urgencyLevel === 'warning') {
    colorStyle = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800/80';
  } else if (urgencyLevel === 'critical') {
    colorStyle = 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 animate-pulse-fast';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-extrabold text-sm sm:text-base tracking-wider transition-colors shadow-sm ${colorStyle} ${className}`}
      aria-live="polite"
      role="timer"
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>{formattedTime}</span>
    </div>
  );
}
