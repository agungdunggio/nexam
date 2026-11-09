'use client';

import {
  Target,
  BarChart3,
  BookOpenCheck,
  Smartphone,
  Moon,
  Globe2,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: 'Simulasi Realistis',
      description:
        'Sistem timer countdown per subtes, navigasi nomor soal, fitur ragu-ragu, dan auto-submit persis seperti ujian sebenarnya.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: BarChart3,
      title: 'Analisis Mendalam',
      description:
        'Dapatkan skor terstandar, ranking percentile perbandingan dengan ribuan peserta lain, serta grafik performa visual.',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: BookOpenCheck,
      title: 'Pembahasan Lengkap',
      description:
        'Setiap soal dilengkapi pembahasan langkah-demi-langkah, rumus cepat, dan konsep dasar untuk evaluasi belajar maksimal.',
      color: 'from-indigo-500 to-violet-600',
    },
    {
      icon: Smartphone,
      title: 'Akses Dari Mana Saja',
      description:
        'Desain responsif yang nyaman digunakan di smartphone, tablet, maupun laptop dengan performa kilat tanpa lag.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Moon,
      title: 'Dark & Light Mode',
      description:
        'Tampilan gelap elegan yang ramah mata untuk sesi belajar larut malam, atau mode terang segar untuk pagi hari.',
      color: 'from-slate-600 to-indigo-700',
    },
    {
      icon: Globe2,
      title: 'Dukungan Bilingual',
      description:
        'Beralih dengan mudah antara Bahasa Indonesia dan Bahasa Inggris untuk mempersiapkan tes universitas internasional.',
      color: 'from-indigo-600 to-blue-600',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
          Fitur Unggulan
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Dirancang Khusus untuk Persiapan Masuk PTN Impian
        </p>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Nexam menggabungkan akurasi materi, teknologi modern, dan pengalaman pengguna premium tanpa kompromi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
