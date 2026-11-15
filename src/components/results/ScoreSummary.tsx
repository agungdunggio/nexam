'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { formatTime, formatScore } from '@/lib/utils';
import { ComparisonStats } from '@/types/results';

interface ScoreSummaryProps {
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  timeSpentSec: number;
  topPercent: number;
  maxScore?: number;
  subtestName?: string;
  comparison?: ComparisonStats;
}

/**
 * Tactile Duolingo-style Hero Stage unifying Nexi coaching feedback,
 * primary score readout, and breakdown tokens without nested slop cards.
 */
export function ScoreSummary({
  score,
  totalQuestions,
  correctCount,
  wrongCount,
  unansweredCount,
  timeSpentSec,
  topPercent,
  maxScore = 1000,
  subtestName = 'Latihan Subtes',
  comparison,
}: ScoreSummaryProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    const counterObj = { val: 0 };
    const tween = gsap.to(counterObj, {
      val: score,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayScore(Math.round(counterObj.val * 10) / 10);
      },
    });

    return () => {
      tween.kill();
    };
  }, [score]);

  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const speedSec =
    totalQuestions > 0 ? Math.round(timeSpentSec / totalQuestions) : 0;

  let headline = `Sesi selesai! Posisimu ada di Top ${topPercent}%.`;
  let feedback = `Kamu menjawab ${correctCount} dari ${totalQuestions} soal dengan benar (${speedSec} dtk/soal). Tinjau pembahasan di bawah.`;

  if (wrongCount > 0 && accuracy < 60) {
    feedback = `Kecepatanmu ${speedSec} dtk/soal, namun ketelitian masih bisa ditingkatkan. Cek ${wrongCount} soal yang keliru di bawah.`;
  } else if (accuracy >= 80) {
    headline = `Hasil solid! Kamu menembus Top ${topPercent}% peserta.`;
    feedback = `Penguasaan materi sudah kuat dengan akurasi ${accuracy}%. Pertahankan ritme pengerjaan ini.`;
  }

  return (
    <section
      aria-label="Ringkasan Skor"
      className="rounded-[22px] bg-white dark:bg-[#141a29] border-2 border-[#dfe4ee] dark:border-[#252f47] border-b-[5px] border-b-[#cbd3e3] dark:border-b-[#0b0f19] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
    >
      {/* Left: Nexi Mascot + Contextual Coach Feedback */}
      <div className="lg:col-span-7 flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
        <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-2xl border-2 border-b-4 border-indigo-200 dark:border-indigo-700/70 bg-[#f8f7ff] dark:bg-[#192138] overflow-hidden shrink-0">
          <Image
            src="/images/nexi_mascot.jpg"
            alt="Maskot Nexi Nexam"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-[#5248e5] dark:text-indigo-400 mb-1">
            {subtestName}
            {comparison
              ? ` · Peringkat #${comparison.your_rank} dari ${comparison.total_participants} peserta`
              : ''}
          </p>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-[-0.025em] text-[#13192b] dark:text-slate-50 leading-snug mb-1.5">
            {headline}
          </h1>
          <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-[48ch]">
            {feedback}
          </p>
        </div>
      </div>

      {/* Right: Score Lockup + Tactile CTA + Breakdown Tokens */}
      <div className="lg:col-span-5 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold leading-none tracking-[-0.04em] text-[#13192b] dark:text-white tabular-nums">
              {formatScore(displayScore)}
            </span>
            <span className="text-sm sm:text-[15px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
              / {maxScore}
            </span>
          </div>

          <Link
            href="/test"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[14px] bg-[#5248e5] hover:bg-[#463cd6] text-white border-2 border-[#3730a3] border-b-[5px] active:translate-y-[2px] active:border-b-[3px] text-[13.5px] font-bold transition-[transform,background-color] duration-100 select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#141a29]"
          >
            <span>Latihan Subtes Lain</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-[14px] bg-emerald-50 dark:bg-emerald-950/35 border-2 border-b-[3px] border-emerald-300 dark:border-emerald-700/60 px-2.5 py-2.5 text-center">
            <span className="block text-lg font-extrabold leading-tight text-emerald-700 dark:text-emerald-300 tabular-nums">
              {correctCount}
            </span>
            <span className="block text-[11px] font-bold text-emerald-700/80 dark:text-emerald-400 mt-0.5">
              Benar
            </span>
          </div>

          <div className="rounded-[14px] bg-rose-50 dark:bg-rose-950/35 border-2 border-b-[3px] border-rose-300 dark:border-rose-700/60 px-2.5 py-2.5 text-center">
            <span className="block text-lg font-extrabold leading-tight text-rose-700 dark:text-rose-300 tabular-nums">
              {wrongCount}
            </span>
            <span className="block text-[11px] font-bold text-rose-700/80 dark:text-rose-400 mt-0.5">
              Salah
            </span>
          </div>

          <div className="rounded-[14px] bg-[#f6f7fb] dark:bg-[#1c2438] border-2 border-b-[3px] border-[#dfe4ee] dark:border-[#252f47] px-2.5 py-2.5 text-center">
            <span className="block text-lg font-extrabold leading-tight text-[#13192b] dark:text-slate-100 tabular-nums">
              {unansweredCount}
            </span>
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Kosong
            </span>
          </div>

          <div className="rounded-[14px] bg-[#f6f7fb] dark:bg-[#1c2438] border-2 border-b-[3px] border-[#dfe4ee] dark:border-[#252f47] px-2.5 py-2.5 text-center">
            <span className="block text-lg font-extrabold leading-tight text-[#13192b] dark:text-slate-100 font-mono tabular-nums">
              {formatTime(timeSpentSec)}
            </span>
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              Waktu
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
