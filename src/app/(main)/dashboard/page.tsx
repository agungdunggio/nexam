'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { RecentTests } from '@/components/dashboard/RecentTests';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { ScoreTrend } from '@/components/dashboard/ScoreTrend';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Button } from '@/components/ui/button';
import { UserStats } from '@/types/results';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch {
        // Fallback default
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Memuat dasbor analitik..." />;
  }

  const userName = user?.name || 'Pejuang PTN';

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 gradient-card border border-indigo-200/60 dark:border-indigo-900/60 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Lolos UTBK 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selamat datang kembali, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Terus pertahankan konsistensi latihan. Pantau evaluasi skor dan pelajari pembahasan pada setiap sesi simulasi.
            </p>
          </div>

          <Link href="/test" className="shrink-0">
            <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 gap-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('nav.start_test')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick stats metrics */}
      <QuickStats
        totalTests={stats?.total_tests_taken || 0}
        averageScore={stats?.average_score || 0}
        highestScore={stats?.highest_score || 0}
      />

      {/* Progress & Trend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <ScoreTrend trend={stats?.subtests[0]?.trend} />
          <RecentTests tests={stats?.recent_tests || []} />
        </div>

        <div className="lg:col-span-5">
          <ProgressOverview subtests={stats?.subtests || []} />
        </div>
      </div>
    </div>
  );
}
