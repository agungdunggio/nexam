'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { SubtestIconRenderer } from '@/components/icons/SubtestIcons';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Clock, BarChart3 } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

export function HeroSection() {
  const { t } = useLanguageStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
      })
        .from(
          titleRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          '-=0.3'
        )
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          cardRef.current,
          {
            opacity: 0,
            scale: 0.95,
            y: 30,
            duration: 0.8,
            ease: 'back.out(1.2)',
          },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden gradient-mesh"
    >
      {/* Decorative blurred background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi UTBK-SNBT & TPA 2026</span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6"
            >
              {t('landing.hero_title')}{' '}
              <span className="gradient-text">Impianmu</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {t('landing.hero_subtitle')}
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link href="/test" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 gap-2"
                >
                  <span>{t('landing.cta_start')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {t('landing.cta_features')}
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                6 Subtes Lengkap SNBT
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sistem Timer Realistis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Pembahasan Lengkap
              </span>
            </div>
          </div>

          {/* Interactive Preview Card on the Right */}
          <div ref={cardRef} className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl glass p-6 shadow-2xl shadow-indigo-500/10 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                <div className="flex items-center gap-2.5">
                  <SubtestIconRenderer subtest="penalaran_umum" className="w-8 h-8 rounded-lg shrink-0" size={32} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Penalaran Umum
                    </h3>
                    <p className="text-[11px] text-slate-500">Soal 01 dari 30</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>34:45</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  Semua mahasiswa kedokteran wajib mengikuti praktikum. Beberapa orang yang rajin bukan mahasiswa kedokteran. Maka...
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  { label: 'A', text: 'Semua yang rajin wajib praktikum', checked: false },
                  { label: 'B', text: 'Beberapa yang rajin wajib praktikum', checked: true },
                  { label: 'C', text: 'Semua mahasiswa kedokteran rajin', checked: false },
                ].map((opt) => (
                  <div
                    key={opt.label}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      opt.checked
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        opt.checked
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Auto-save aktif</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Simulasi Real-time →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
