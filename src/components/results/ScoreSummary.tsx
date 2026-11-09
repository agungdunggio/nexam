'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { formatTime, formatScore } from '@/lib/utils';
import { Trophy, CheckCircle, XCircle, MinusCircle, Clock, Award } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  timeSpentSec: number;
  percentile: number;
  maxScore?: number;
}

export function ScoreSummary({
  score,
  totalQuestions,
  correctCount,
  wrongCount,
  unansweredCount,
  timeSpentSec,
  percentile,
  maxScore = 1000,
}: ScoreSummaryProps) {
  const { t } = useLanguageStore();
  const [displayScore, setDisplayScore] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counterObj = { val: 0 };
    const tween = gsap.to(counterObj, {
      val: score,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayScore(Math.round(counterObj.val * 10) / 10);
      },
    });

    return () => {
      tween.kill();
    };
  }, [score]);

  return (
    <div
      ref={cardRef}
      className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-indigo-500/5 mb-8 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Main Score Hero */}
        <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent border border-indigo-100 dark:border-indigo-900/50">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-500/25">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {t('results.your_score')}
          </span>
          <div className="flex items-baseline gap-1 font-mono my-2">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatScore(displayScore)}
            </span>
            <span className="text-sm font-bold text-slate-400">/ {maxScore}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-bold mt-2">
            <Award className="w-3.5 h-3.5" />
            <span>Top {Math.max(1, 100 - Math.round(percentile))}% Peserta</span>
          </div>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex flex-col items-center text-center">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-1.5" />
            <span className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {correctCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {t('results.correct')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 flex flex-col items-center text-center">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mb-1.5" />
            <span className="font-mono text-2xl font-bold text-red-700 dark:text-red-300">
              {wrongCount}
            </span>
            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
              {t('results.wrong')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center text-center">
            <MinusCircle className="w-6 h-6 text-slate-400 mb-1.5" />
            <span className="font-mono text-2xl font-bold text-slate-700 dark:text-slate-200">
              {unansweredCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {t('results.unanswered')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1.5" />
            <span className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-300 pt-1">
              {formatTime(timeSpentSec)}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-auto">
              Waktu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
