'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UTBK_SIMULATION_SUBTESTS } from '@/lib/simulationConfig';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { playDing, playPop } from '@/lib/soundEffects';
import {
  GraduationCap,
  Clock,
  ArrowRight,
  BookOpen,
  Loader2,
  Layers,
  ShieldCheck,
  Timer,
  Lock,
  AlertCircle,
} from 'lucide-react';

export default function SimulationHubPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = UTBK_SIMULATION_SUBTESTS.reduce((acc, s) => acc + s.questionCount, 0);
  const totalMinutes = Math.round(
    UTBK_SIMULATION_SUBTESTS.reduce((acc, s) => acc + s.timeLimitSec, 0) / 60
  );

  const tpsSubtests = UTBK_SIMULATION_SUBTESTS.filter(
    (s) => s.component === 'Tes Potensi Skolastik (TPS)'
  );
  const literasiSubtests = UTBK_SIMULATION_SUBTESTS.filter(
    (s) => s.component === 'Tes Literasi & Penalaran'
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
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Hero Briefing Card - Tactile Nexam Theme */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Header pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-black">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Simulasi Mandiri CBT Standar Seleksi Nasional</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Simulasi UTBK-SNBT Penuh
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Uji ketahanan fokus dan strategi manajemen waktu dalam kondisi CBT sesungguhnya. 6 subtes dijalankan berurutan satu arah dengan timer ketat per subtes.
              </p>
            </div>

            {/* Credential Specs Grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Subtes</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  6 Sesi
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  TPS &amp; Literasi
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Jumlah Soal</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {totalQuestions} Butir
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Pilihan Ganda &amp; Isian
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Total Waktu</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {totalMinutes} Menit
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Timer Mandiri
                </div>
              </div>
            </div>
          </div>

          {/* Right Mascot + Quick CTA Box */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-900/60 text-center space-y-4">
            <DuolingoMascot
              mood="cheering"
              size="md"
              message="Siapkan fokus dan tempat tenang. Ujian berjalan berurutan tanpa jeda!"
              bubbleSide="top"
            />

            <div className="w-full space-y-2">
              <button
                onClick={handleStartSimulation}
                disabled={starting}
                className="w-full h-12 px-6 rounded-2xl duo-button-indigo text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyiapkan Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>Mulai Simulasi Sekarang</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Format resmi SNPMB · Skor komposit 0–1000
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* CBT Protocols Strip - High scanability, zero generic slop */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
          Aturan Pelaksanaan CBT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Alur Berurutan (Sequential)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Subtes dikerjakan bertahap mulai dari Penalaran Umum hingga selesai di Penalaran Matematika.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Timer className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Timer Mandiri Tiap Subtes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tiap subtes memiliki alokasi waktu tersendiri. Ketika waktu habis, sistem otomatis mengunci dan berpindah.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Satu Arah (No Return)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Subtes yang telah diselesaikan atau habis waktunya tidak dapat dibuka kembali untuk menjaga integritas ujian.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Subtest Table - Categorized & Structured */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Struktur &amp; Jadwal Subtes Ujian
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rincian 6 subtes yang akan dihadapi secara berkesinambungan.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-3 py-1 rounded-xl self-start sm:self-auto border border-indigo-200/60 dark:border-indigo-800/60">
            Total {totalQuestions} Soal · {totalMinutes} Menit
          </span>
        </div>

        {/* Group 1: TPS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Bagian 1: Tes Potensi Skolastik (TPS)
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
            {tpsSubtests.map((sub, idx) => (
              <div
                key={sub.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-200/60 dark:border-indigo-800/60">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {sub.name_id}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    {sub.questionCount} Soal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    {Math.round(sub.timeLimitSec / 60)} Menit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: Literasi & Penalaran */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bagian 2: Tes Literasi &amp; Penalaran
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
            {literasiSubtests.map((sub, idx) => (
              <div
                key={sub.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    {tpsSubtests.length + idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {sub.name_id}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {sub.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                    {sub.questionCount} Soal
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {Math.round(sub.timeLimitSec / 60)} Menit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Ready Callout */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Hasil simulasi langsung dievaluasi dengan analisis skor komposit dan rekomendasi penguatan.</span>
          </div>
          <button
            onClick={handleStartSimulation}
            disabled={starting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl duo-button-indigo text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {starting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan...</span>
              </>
            ) : (
              <>
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
