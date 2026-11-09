'use client';

import { CheckCircle, Trophy, BarChart2, Zap } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface QuickStatsProps {
  totalTests: number;
  averageScore: number;
  highestScore: number;
}

export function QuickStats({
  totalTests,
  averageScore,
  highestScore,
}: QuickStatsProps) {
  const { t } = useLanguageStore();

  const cards = [
    {
      label: t('dashboard.total_tests'),
      value: totalTests,
      icon: CheckCircle,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      label: t('dashboard.avg_score'),
      value: averageScore > 0 ? averageScore : '-',
      icon: BarChart2,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      label: t('dashboard.best_score'),
      value: highestScore > 0 ? highestScore : '-',
      icon: Trophy,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      label: 'Konsistensi Belajar',
      value: totalTests > 0 ? 'Aktif' : 'Mulai Sekarang',
      icon: Zap,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <span className="font-mono text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
