'use client';

import { Activity } from 'lucide-react';

interface PerformanceChartProps {
  accuracy: number;
  speedSecPerQuestion: number;
  percentile: number;
}

export function PerformanceChart({
  accuracy,
  speedSecPerQuestion,
  percentile,
}: PerformanceChartProps) {
  const metrics = [
    { label: 'Akurasi Jawaban', value: `${accuracy}%`, percent: accuracy, color: 'from-emerald-500 to-teal-500' },
    { label: 'Percentile Rank', value: `Top ${Math.max(1, 100 - Math.round(percentile))}%`, percent: percentile, color: 'from-indigo-500 to-purple-600' },
    {
      label: 'Kecepatan Menjawab',
      value: `${Math.round(speedSecPerQuestion)} dtk/soal`,
      percent: Math.max(10, Math.min(100, 100 - (speedSecPerQuestion / 120) * 100)),
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Indikator Performa
          </h4>
          <p className="text-[11px] text-slate-500">
            Analisis kecepatan dan ketepatan pengerjaan
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">{m.label}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{m.value}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                style={{ width: `${Math.max(5, m.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
