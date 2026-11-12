'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UTBK_SIMULATION_SUBTESTS } from '@/lib/simulationConfig';
import { playDing, playPop } from '@/lib/soundEffects';
import {
  GraduationCap,
  Clock,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Layers,
} from 'lucide-react';

export default function SimulationHubPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = UTBK_SIMULATION_SUBTESTS.reduce((acc, s) => acc + s.questionCount, 0);
  const totalMinutes = Math.round(
    UTBK_SIMULATION_SUBTESTS.reduce((acc, s) => acc + s.timeLimitSec, 0) / 60
  );

  const handleStartSimulation = async () => {
    try {
      setStarting(true);
      setError(null);
      playPop();

      const res = await fetch('/api/simulation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Gagal memulai simulasi');
      }

      playDing();
      router.push(`/simulation/session/${data.simulation.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kendala saat memulai simulasi';
      setError(message);
      setStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 space-y-8">
      {/* Hero Briefing Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white border-2 border-indigo-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Format Resmi Simulasi UTBK</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {UTBK_SIMULATION_SUBTESTS.length} Subtes
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {totalQuestions} Soal
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {totalMinutes} Menit
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Simulasi UTBK-SNBT 2026
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
          Uji kesiapan mental dan ketepatan strategi dengan simulasi ujian terpadu. Sistem menjalankan alur subtes berurutan dengan batas waktu realistis layaknya pelaksanaan ujian nasional aslinya.
        </p>

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-semibold">
            {error}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Pastikan koneksi internet stabil dan waktu pengerjaan tidak terganggu.
          </div>
          <button
            onClick={handleStartSimulation}
            disabled={starting}
            className="w-full sm:w-auto h-13 px-8 rounded-2xl duo-button-green text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"
          >
            {starting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyiapkan Sesi...</span>
              </>
            ) : (
              <>
                <span>Mulai Simulasi Sekarang</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rules & Guidelines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
            1
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Alur Sekuensial
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Subtes dikerjakan secara berurutan mulai dari Penalaran Umum hingga Penalaran Matematika.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">
            2
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Timer Mandiri per Subtes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tiap subtes memiliki alokasi waktu tersendiri. Ketika waktu habis, sistem otomatis mengunci dan beralih.
          </p>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-sm">
            3
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Satu Arah (No Return)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Jawaban pada subtes yang sudah diselesaikan atau habis waktunya tidak dapat dibuka kembali.
          </p>
        </div>
      </div>

      {/* Sequence Roadmap of Subtests */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Urutan Subtes Ujian
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Berikut 6 subtes yang akan kamu selesaikan dalam rangkaian simulasi ini.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {UTBK_SIMULATION_SUBTESTS.map((sub, idx) => (
            <div
              key={sub.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-black text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {sub.name_id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                      {sub.component}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {sub.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 shrink-0">
                <span>{sub.questionCount} Soal</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {Math.round(sub.timeLimitSec / 60)} Menit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
