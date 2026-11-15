'use client';

interface PerformanceChartProps {
  accuracy: number;
  speedSecPerQuestion: number;
  topPercent: number;
  correctCount: number;
  totalQuestions: number;
}

/**
 * Tactile Duolingo XP-bar performance indicators with consistent rank math
 * and solid semantic fills (replacing multi-hue gradient bars).
 */
export function PerformanceChart({
  accuracy,
  speedSecPerQuestion,
  topPercent,
  correctCount,
  totalQuestions,
}: PerformanceChartProps) {
  const percentileBeat = Math.max(0, 100 - topPercent);
  const roundedSpeed = Math.round(speedSecPerQuestion);
  const speedPct = Math.max(10, Math.min(100, 100 - (speedSecPerQuestion / 120) * 100));

  const meters = [
    {
      label: 'Akurasi Jawaban',
      value: `${accuracy}%`,
      percent: Math.max(6, accuracy),
      sub: `${correctCount} benar dari ${totalQuestions} butir soal`,
      textClass: 'text-emerald-700 dark:text-emerald-400',
      fillClass: 'bg-emerald-600 dark:bg-emerald-500',
    },
    {
      label: 'Posisi Persentil',
      value: `Top ${topPercent}%`,
      percent: Math.max(8, percentileBeat),
      sub:
        percentileBeat > 0
          ? `Lebih tinggi dari ${percentileBeat}% peserta pada subtes ini`
          : 'Peringkat awal pada subtes ini',
      textClass: 'text-[#5248e5] dark:text-indigo-400',
      fillClass: 'bg-[#5248e5] dark:bg-indigo-500',
    },
    {
      label: 'Kecepatan Menjawab',
      value: `${roundedSpeed} dtk/soal`,
      percent: speedPct,
      sub: 'Target ideal UTBK: 45–60 detik/soal',
      textClass: 'text-amber-700 dark:text-amber-400',
      fillClass: 'bg-amber-500',
    },
  ];

  return (
    <div className="h-full rounded-[22px] bg-white dark:bg-[#141a29] border-2 border-[#dfe4ee] dark:border-[#252f47] border-b-[5px] border-b-[#cbd3e3] dark:border-b-[#0b0f19] p-5 sm:p-6 flex flex-col justify-between gap-5">
      <div>
        <h2 className="text-base font-extrabold tracking-[-0.02em] text-[#13192b] dark:text-white">
          Indikator Pengerjaan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ketepatan, tempo menjawab, dan posisi persentil
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {meters.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-bold text-[#13192b] dark:text-slate-100">
                {m.label}
              </span>
              <span className={`text-[15px] font-extrabold tabular-nums ${m.textClass}`}>
                {m.value}
              </span>
            </div>

            <div className="h-3.5 rounded-full bg-[#eef1f7] dark:bg-[#1c2438] border-[1.5px] border-[#dfe4ee] dark:border-[#252f47] p-0.5 overflow-hidden">
              <div
                className={`h-full rounded-full relative transition-[width] duration-500 ${m.fillClass}`}
                style={{ width: `${m.percent}%` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[2px] left-1.5 right-1.5 h-[3px] rounded-full bg-white/35"
                />
              </div>
            </div>

            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
              {m.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
