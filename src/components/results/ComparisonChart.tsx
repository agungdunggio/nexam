'use client';

import { ComparisonStats } from '@/types/results';
import { BarChart2, Users, ArrowUpRight } from 'lucide-react';

interface ComparisonChartProps {
  userScore: number;
  comparison?: ComparisonStats;
}

export function ComparisonChart({ userScore, comparison }: ComparisonChartProps) {
  if (!comparison) return null;

  const avg = comparison.avg_score;
  const p75 = comparison.p75;
  const p90 = comparison.p90;

  const maxVal = Math.max(1000, userScore * 1.15, p90 * 1.1);

  const bars = [
    { label: 'Rata-rata Peserta', value: avg, color: 'bg-slate-400 dark:bg-slate-600', isUser: false },
    { label: 'Top 25% (P75)', value: p75, color: 'bg-indigo-400 dark:bg-indigo-500', isUser: false },
    { label: 'Top 10% (P90)', value: p90, color: 'bg-purple-500 dark:bg-purple-600', isUser: false },
    { label: 'Skor Kamu', value: userScore, color: 'bg-gradient-to-r from-emerald-500 to-teal-500', isUser: true },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Perbandingan Peserta
            </h4>
            <p className="text-[11px] text-slate-500">
              Peringkat #{comparison.your_rank} dari {comparison.total_participants} peserta
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Top {Math.max(1, Math.round((comparison.your_rank / comparison.total_participants) * 100))}%
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {bars.map((bar, idx) => {
          const pct = Math.min(100, (bar.value / maxVal) * 100);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${bar.isUser ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                  {bar.label}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {bar.value}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${bar.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
