'use client';

import { ComparisonStats, ScoreDistributionBucket } from '@/types/results';

interface ScoreDistributionProps {
  buckets?: ScoreDistributionBucket[];
  userScore: number;
  maxScore?: number;
  comparison?: ComparisonStats;
}

const DEFAULT_BUCKETS: ScoreDistributionBucket[] = [
  { range: '0-10', count: 0 },
  { range: '11-20', count: 0 },
  { range: '21-30', count: 0 },
  { range: '31-40', count: 0 },
  { range: '41-50', count: 0 },
  { range: '51-60', count: 0 },
  { range: '61-70', count: 0 },
  { range: '71-80', count: 0 },
  { range: '81-90', count: 0 },
  { range: '91-100', count: 0 },
];

/**
 * Combined score distribution histogram with floating user pin
 * and integrated cohort quartile strip (replacing duplicate slop cards).
 */
export function ScoreDistribution({
  buckets = DEFAULT_BUCKETS,
  userScore,
  maxScore = 1000,
  comparison,
}: ScoreDistributionProps) {
  const safeBuckets = buckets.length > 0 ? buckets : DEFAULT_BUCKETS;
  const maxCount = Math.max(...safeBuckets.map((b) => b.count), 1);
  const normalizedUserPct =
    maxScore > 0 ? Math.min(100, Math.max(0, Math.round((userScore / maxScore) * 100))) : 0;

  return (
    <div className="h-full rounded-[22px] bg-white dark:bg-[#141a29] border-2 border-[#dfe4ee] dark:border-[#252f47] border-b-[5px] border-b-[#cbd3e3] dark:border-b-[#0b0f19] p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold tracking-[-0.02em] text-[#13192b] dark:text-white">
            Sebaran &amp; Posisi Skor Peserta
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Perbandingan kelompok skor kamu terhadap seluruh peserta di subtes ini
          </p>
        </div>

        {comparison && (
          <span className="px-2.5 py-1 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700/60 text-[#5248e5] dark:text-indigo-300 text-xs font-extrabold whitespace-nowrap tabular-nums">
            Peringkat #{comparison.your_rank} / {comparison.total_participants}
          </span>
        )}
      </div>

      {/* Histogram Stage */}
      <div className="pt-2">
        <div className="h-40 grid grid-cols-10 gap-1 sm:gap-2 items-end pt-8 border-b-2 border-[#dfe4ee] dark:border-[#252f47]">
          {safeBuckets.map((bucket) => {
            const heightPct =
              bucket.count > 0 ? Math.max(12, Math.round((bucket.count / maxCount) * 100)) : 6;
            const [minStr, maxStr] = bucket.range.split('-');
            const minVal = parseInt(minStr, 10);
            const maxVal = parseInt(maxStr, 10);
            const isUserBucket = normalizedUserPct >= minVal && normalizedUserPct <= maxVal;

            return (
              <div
                key={bucket.range}
                className="h-full flex flex-col justify-end items-center relative group"
              >
                {isUserBucket && (
                  <span className="absolute top-0 px-2 py-0.5 rounded-lg bg-[#5248e5] border-b-2 border-[#3730a3] text-white text-[10px] font-extrabold whitespace-nowrap z-10">
                    Kamu
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#3730a3]"
                    />
                  </span>
                )}

                <span className="absolute bottom-[calc(100%+6px)] px-2 py-0.5 rounded-md bg-[#13192b] dark:bg-slate-100 text-white dark:text-[#13192b] text-[10.5px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 tabular-nums">
                  {bucket.count} peserta ({bucket.range})
                </span>

                <div
                  className={`w-full rounded-t-[7px] transition-[transform,background-color] duration-150 ${
                    isUserBucket
                      ? 'bg-[#5248e5] border-2 border-b-0 border-[#3730a3]'
                      : 'bg-[#dfe4ee] dark:bg-[#26314a] group-hover:bg-[#c5cedf] dark:group-hover:bg-[#354363] group-hover:-translate-y-0.5'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-10 gap-1 sm:gap-2 text-center mt-2 font-mono text-[11px] font-bold tabular-nums">
          {safeBuckets.map((bucket) => {
            const [minStr, maxStr] = bucket.range.split('-');
            const minVal = parseInt(minStr, 10);
            const maxVal = parseInt(maxStr, 10);
            const isUserBucket = normalizedUserPct >= minVal && normalizedUserPct <= maxVal;
            return (
              <span
                key={bucket.range}
                className={
                  isUserBucket
                    ? 'text-[#5248e5] dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }
              >
                {minStr}
              </span>
            );
          })}
        </div>
      </div>

      {/* Integrated Cohort Benchmarks */}
      {comparison && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 border-t-2 border-[#dfe4ee] dark:border-[#252f47]">
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Rata-rata
            </div>
            <div className="text-base font-extrabold text-[#13192b] dark:text-white mt-0.5 tabular-nums">
              {comparison.avg_score}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Top 25% (P75)
            </div>
            <div className="text-base font-extrabold text-[#13192b] dark:text-white mt-0.5 tabular-nums">
              {comparison.p75}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Top 10% (P90)
            </div>
            <div className="text-base font-extrabold text-[#13192b] dark:text-white mt-0.5 tabular-nums">
              {comparison.p90}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#5248e5] dark:text-indigo-400">
              Skor Kamu
            </div>
            <div className="text-base font-extrabold text-[#5248e5] dark:text-indigo-400 mt-0.5 tabular-nums">
              {userScore}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
