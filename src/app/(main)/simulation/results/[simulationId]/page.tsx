'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Trophy,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface SubtestResult {
  subtestId: string;
  name: string;
  component: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalQuestions: number;
  status: string;
}

interface SimulationResultData {
  id: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  compositeScore: number;
  totalSubtests: number;
  breakdown: SubtestResult[];
}

export default function SimulationResultsPage({ params }: { params: { simulationId: string } }) {
  const { simulationId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SimulationResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        setLoading(true);
        const res = await fetch(`/api/simulation/${simulationId}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || 'Gagal memuat hasil evaluasi');
        }

        setData(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kendala saat memuat hasil');
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [simulationId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-bold text-slate-500">Mengkalkulasi Skor Komposit UTBK...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Hasil Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">{error || 'Data hasil simulasi tidak tersedia.'}</p>
        <Link href="/simulation">
          <button className="h-11 px-6 rounded-xl duo-button-green text-xs font-bold uppercase mt-2">
            Kembali ke Hub Simulasi
          </button>
        </Link>
      </div>
    );
  }

  const sortedBreakdown = [...data.breakdown].sort((a, b) => b.score - a.score);
  const strongestSubtest = sortedBreakdown[0];
  const weakestSubtest = sortedBreakdown[sortedBreakdown.length - 1];

  const totalCorrect = data.breakdown.reduce((acc, s) => acc + s.correctCount, 0);
  const totalQuestions = data.breakdown.reduce((acc, s) => acc + s.totalQuestions, 0);
  const overallAccuracy = Math.round((totalCorrect / Math.max(1, totalQuestions)) * 100);

  // Score qualification tag
  let qualification = 'Kategori Rintisan';
  let qualColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900';
  if (data.compositeScore >= 700) {
    qualification = 'Peluang Sangat Tinggi (Kompetitif PTN Top)';
    qualColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900';
  } else if (data.compositeScore >= 600) {
    qualification = 'Peluang Baik (Kompetitif PTN)';
    qualColor = 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900';
  } else if (data.compositeScore >= 500) {
    qualification = 'Perlu Pemantapan Target';
    qualColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900';
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {/* Hero Scorecard Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white border-2 border-indigo-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Rangkuman Evaluasi Simulasi UTBK</span>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${qualColor}`}>
            {qualification}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Estimasi Skor Rata-Rata UTBK
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-7xl font-black text-white tracking-tight">
                {data.compositeScore}
              </span>
              <span className="text-slate-400 text-lg font-bold">/ 1000</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Skor dihitung berdasarkan komposit 6 subtes dengan standar pembobotan UTBK-SNBT.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-2xl font-black text-emerald-400 block">{totalCorrect}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Jawaban Benar</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-2xl font-black text-indigo-400 block">{overallAccuracy}%</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Akurasi Soal</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-2xl font-black text-white block">{data.totalSubtests}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Subtes Selesai</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/simulation" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-11 px-5 rounded-xl duo-button-outline text-xs font-bold flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Simulasi Baru</span>
            </button>
          </Link>

          <Link href="/test" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-11 px-6 rounded-xl duo-button-green text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Latihan Subtes Tertentu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Strength & Improvement Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strongestSubtest && (
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Subtes Terkuat
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                {strongestSubtest.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Skor <strong>{strongestSubtest.score}</strong> ({strongestSubtest.correctCount} dari{' '}
                {strongestSubtest.totalQuestions} benar).
              </p>
            </div>
          </div>
        )}

        {weakestSubtest && (
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Fokus Peningkatan
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                {weakestSubtest.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Skor <strong>{weakestSubtest.score}</strong>. Tingkatkan latihan intensif pada subtes ini.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subtests Score Breakdown Table */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Rincian Nilai 6 Subtes UTBK
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Berikut breakdown skor dan ketepatan jawaban untuk masing-masing bidang uji.
          </p>
        </div>

        <div className="space-y-4">
          {data.breakdown.map((sub, idx) => {
            const pct = Math.min(100, Math.max(0, Math.round(sub.score / 10)));
            return (
              <div
                key={sub.subtestId}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {sub.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {sub.component}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {sub.correctCount} Benar
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      {sub.incorrectCount} Salah
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {sub.unansweredCount} Kosong
                    </span>
                    <div className="text-right ml-2">
                      <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {sub.score}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">/ 1000</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
