'use client';

import { Users, CheckCircle, HelpCircle, Trophy } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      label: 'Pengguna Aktif',
      value: '2,500+',
      icon: Users,
      description: 'Siswa SMA dan pejuang PTN',
    },
    {
      label: 'Tes Diselesaikan',
      value: '10,000+',
      icon: CheckCircle,
      description: 'Sesi latihan berhasil diselesaikan',
    },
    {
      label: 'Bank Soal',
      value: '500+',
      icon: HelpCircle,
      description: 'Soal terstandar dan diverifikasi',
    },
    {
      label: 'Tingkat Kepuasan',
      value: '96%',
      icon: Trophy,
      description: 'Ulasan positif dari pengguna',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-950 dark:to-transparent border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
