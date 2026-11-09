'use client';

import { TrendingUp } from 'lucide-react';
import { ScoreTrendItem } from '@/types/results';

interface ScoreTrendProps {
  trend?: ScoreTrendItem[];
}

export function ScoreTrend({
  trend = [
    { attempt: 1, score: 60.0, date: '2026-10-01' },
    { attempt: 2, score: 68.0, date: '2026-10-08' },
    { attempt: 3, score: 75.5, date: '2026-10-12' },
    { attempt: 4, score: 82.0, date: '2026-10-16' },
    { attempt: 5, score: 86.7, date: '2026-10-20' },
  ],
}: ScoreTrendProps) {
  const maxScore = Math.max(...trend.map((t) => t.score), 100);

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Grafik Tren Perkembangan Skor
            </h3>
            <p className="text-[11px] text-slate-500">
              Perkembangan skor dari simulasi pertama hingga terbaru
            </p>
          </div>
        </div>
      </div>

      <div className="h-40 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
        {trend.map((item, idx) => {
          const heightPct = Math.max(15, (item.score / maxScore) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                {item.score}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-300 group-hover:scale-105"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[10px] text-slate-400 leading-none truncate font-medium">
                Tes {item.attempt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
