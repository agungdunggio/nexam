'use client';

import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, Trophy, Play } from 'lucide-react';

interface TestCardProps {
  testType: 'utbk' | 'tpa';
  subtest: string;
  name: string;
  description?: string;
  questionCount: number;
  timeLimitSec: number;
  icon: string;
  bestScore?: number;
  totalAttempts?: number;
  onStart: () => void;
}

export function TestCard({
  name,
  description,
  questionCount,
  timeLimitSec,
  icon,
  bestScore,
  totalAttempts,
  onStart,
}: TestCardProps) {
  const minutes = Math.floor(timeLimitSec / 60);

  return (
    <div className="group relative rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {bestScore !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>{bestScore}</span>
            </div>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            {questionCount} Soal
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-indigo-500" />
            {minutes} Menit
          </span>
          {totalAttempts !== undefined && totalAttempts > 0 && (
            <span className="text-[11px] text-slate-400">
              {totalAttempts}x dicoba
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={onStart}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all gap-2"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Mulai Simulasi</span>
      </Button>
    </div>
  );
}
