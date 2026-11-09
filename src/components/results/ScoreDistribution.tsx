'use client';

import { BarChart3 } from 'lucide-react';

interface BucketItem {
  range: string;
  count: number;
}

interface ScoreDistributionProps {
  buckets?: BucketItem[];
  userScore: number;
}

export function ScoreDistribution({
  buckets = [
    { range: '0-10', count: 5 },
    { range: '11-20', count: 12 },
    { range: '21-30', count: 28 },
    { range: '31-40', count: 45 },
    { range: '41-50', count: 67 },
    { range: '51-60', count: 89 },
    { range: '61-70', count: 78 },
    { range: '71-80', count: 65 },
    { range: '81-90', count: 42 },
    { range: '91-100', count: 19 },
  ],
  userScore,
}: ScoreDistributionProps) {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const normalizedUserPct = userScore > 100 ? (userScore / 1000) * 100 : userScore;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Distribusi Skor Peserta
          </h4>
          <p className="text-[11px] text-slate-500">
            Sebaran hasil pengerjaan seluruh peserta pada subtes ini
          </p>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 pt-6 pb-2 px-1 border-b border-slate-200 dark:border-slate-800">
        {buckets.map((bucket, idx) => {
          const heightPct = Math.max(8, (bucket.count / maxCount) * 100);
          const [minStr, maxStr] = bucket.range.split('-');
          const minVal = parseInt(minStr, 10);
          const maxVal = parseInt(maxStr, 10);
          const isUserBucket = normalizedUserPct >= minVal && normalizedUserPct <= maxVal;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                {bucket.count} peserta
              </div>

              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  isUserBucket
                    ? 'bg-gradient-to-t from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30'
                    : 'bg-slate-200 dark:bg-slate-700/80 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span className={`text-[9px] font-mono leading-none truncate ${isUserBucket ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                {minStr}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
        <span>Rentang Rendah</span>
        <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-indigo-600" /> Posisi Skor Kamu
        </span>
        <span>Rentang Tinggi</span>
      </div>
    </div>
  );
}
