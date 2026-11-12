'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { useTestStore } from '@/stores/testStore';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { SubtestIconRenderer } from '@/components/icons/SubtestIcons';
import { playDing, playPop } from '@/lib/soundEffects';
import { TestType } from '@/types/test';
import { GraduationCap, Sparkles, Clock, ArrowRight, Loader2, Zap } from 'lucide-react';

export default function DuolingoSelectTestPage() {
  const router = useRouter();
  const { startTest, isLoading } = useTestStore();
  const [selectedTrack, setSelectedTrack] = useState<TestType>('utbk');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleSelectTrack = (track: TestType) => {
    playPop();
    setSelectedTrack(track);
  };

  const handleStartSubtest = async (track: TestType, subtestKey: string) => {
    playDing();
    setLoadingKey(subtestKey);
    const sessionId = await startTest(track, subtestKey);
    if (sessionId) {
      router.push(`/test/${track}/${sessionId}`);
    } else {
      setLoadingKey(null);
    }
  };

  const subtests = Object.entries(SUBTEST_CONFIG[selectedTrack]);

  // Mascot dynamic messages
  const mascotMessages: Record<TestType, string> = {
    utbk: 'Pilih subtes UTBK-SNBT yang ingin kamu kerjakan untuk mengukur kesiapan ujianmu.',
    tpa: 'Pilih modul Tes Potensi Akademik untuk melatih kemampuan verbal, logika, dan numerik.',
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-6">
      {/* Duolingo Mascot & Greeting Banner */}
      <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-4 sm:p-7 mb-6 sm:mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <DuolingoMascot
            mood="happy"
            size="md"
            message={mascotMessages[selectedTrack]}
            bubbleSide="right"
          />

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2 text-center sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-100 dark:border-indigo-900/40">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Langsung Mulai Soal
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Bank Soal Terkurasi Kisi-Kisi Terbaru
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Track Switcher (Smooth Sliding Pill Tab with Perfect Padding) */}
      <div className="relative max-w-2xl mx-auto mb-8 p-1.5 rounded-2xl sm:rounded-full bg-slate-100/90 dark:bg-slate-800/80 border-2 border-slate-200/90 dark:border-slate-700/80 shadow-sm select-none">
        {/* Sliding Indicator Background Pill (Grid-based 50/50 with zero overflow) */}
        <div
          aria-hidden="true"
          className="absolute inset-1.5 grid grid-cols-2 pointer-events-none"
        >
          <div
            className={`h-full w-full rounded-xl sm:rounded-full bg-indigo-600 border-b-4 border-indigo-800 shadow-md shadow-indigo-500/25 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              selectedTrack === 'utbk' ? 'translate-x-0' : 'translate-x-full'
            }`}
          />
        </div>

        {/* Buttons (Interactive Layer) */}
        <div className="relative z-10 grid grid-cols-2">
          <button
            type="button"
            onClick={() => handleSelectTrack('utbk')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-colors duration-200 focus:outline-none ${
              selectedTrack === 'utbk'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <GraduationCap className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
              <span className="tracking-tight uppercase whitespace-nowrap">
                <span className="sm:hidden">UTBK / SNBT</span>
                <span className="hidden sm:inline">UTBK / SNBT 2026</span>
              </span>
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors duration-200 ${
                selectedTrack === 'utbk'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
              }`}
            >
              6 Subtes
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTrack('tpa')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-full font-black text-xs sm:text-sm transition-colors duration-200 focus:outline-none ${
              selectedTrack === 'tpa'
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-colors duration-200 ${
                  selectedTrack === 'tpa' ? 'text-amber-300' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span className="tracking-tight uppercase whitespace-nowrap">
                <span className="sm:hidden">TPA AKADEMIK</span>
                <span className="hidden sm:inline">Tes Potensi Akademik</span>
              </span>
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors duration-200 ${
                selectedTrack === 'tpa'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
              }`}
            >
              3 Subtes
            </span>
          </button>
        </div>
      </div>

      {/* Subtests Grid (Duolingo Style Chunky 3D Cards with Smooth Fade-in-up) */}
      <div key={selectedTrack} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-fade-in-up">
        {subtests.map(([key, meta], idx) => {
          const isCurrentLoading = isLoading && loadingKey === key;
          const minutes = Math.round(meta.timeLimitSec / 60);

          return (
            <div
              key={key}
              onClick={() => !isLoading && handleStartSubtest(selectedTrack, key)}
              className="group relative rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 border-b-6 hover:border-indigo-500 dark:hover:border-indigo-500 hover:border-b-6 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between select-none"
            >
              {/* Duration & Question Info */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {minutes} Menit • {meta.seedCount} Soal
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-inner shrink-0 bg-indigo-50 dark:bg-indigo-950/60">
                  <SubtestIconRenderer subtest={key} className="w-full h-full object-cover" size={56} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {meta.name_id}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {meta.description_id}
                  </p>
                </div>
              </div>

              {/* Action 3D Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  className={`w-full h-12 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                    isCurrentLoading
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-wait'
                      : 'duo-button-green shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {isCurrentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Membuka Soal...</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Soal Sekarang</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
