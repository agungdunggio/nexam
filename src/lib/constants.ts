import { SubtestMeta, TestType } from '@/types/test';

export const SUBTEST_CONFIG: {
  utbk: Record<string, SubtestMeta>;
  tpa: Record<string, SubtestMeta>;
} = {
  utbk: {
    penalaran_umum: {
      name_id: 'Penalaran Umum',
      name_en: 'General Reasoning',
      questionCount: 30,
      seedCount: 10,
      timeLimitSec: 2100, // 35 menit
      icon: '🧠',
      description_id: 'Mengukur kemampuan bernalar logis, induktif, deduktif, dan analisis argumen.',
      description_en: 'Measures logical, inductive, deductive, and argumentative reasoning skills.',
    },
    penalaran_matematika: {
      name_id: 'Penalaran Matematika',
      name_en: 'Mathematical Reasoning',
      questionCount: 20,
      seedCount: 10,
      timeLimitSec: 1800, // 30 menit
      icon: '📐',
      description_id: 'Mengukur kemampuan memecahkan masalah kontekstual menggunakan konsep matematika.',
      description_en: 'Measures problem-solving ability in contextual scenarios using math concepts.',
    },
    literasi_bahasa_indonesia: {
      name_id: 'Literasi Bahasa Indonesia',
      name_en: 'Indonesian Literacy',
      questionCount: 25,
      seedCount: 10,
      timeLimitSec: 1500, // 25 menit
      icon: '📖',
      description_id: 'Mengukur pemahaman membaca, interpretasi teks, dan penarikan simpulan bacaan.',
      description_en: 'Measures reading comprehension, textual interpretation, and conclusion drawing.',
    },
    literasi_bahasa_inggris: {
      name_id: 'Literasi Bahasa Inggris',
      name_en: 'English Literacy',
      questionCount: 25,
      seedCount: 10,
      timeLimitSec: 1500, // 25 menit
      icon: '🌐',
      description_id: 'Mengukur kemampuan memahami dan menganalisis teks berbahasa Inggris akademik.',
      description_en: 'Measures understanding and analysis of academic English texts.',
    },
    pengetahuan_kuantitatif: {
      name_id: 'Pengetahuan Kuantitatif',
      name_en: 'Quantitative Knowledge',
      questionCount: 20,
      seedCount: 10,
      timeLimitSec: 1200, // 20 menit
      icon: '📊',
      description_id: 'Mengukur penguasaan konsep matematika dasar, aljabar, dan kalkulasi angka.',
      description_en: 'Measures mastery of basic math, algebra, and numerical calculations.',
    },
    pemahaman_bacaan_menulis: {
      name_id: 'Pemahaman Bacaan dan Menulis',
      name_en: 'Reading & Writing Comprehension',
      questionCount: 20,
      seedCount: 10,
      timeLimitSec: 1500, // 25 menit
      icon: '✍️',
      description_id: 'Mengukur kemampuan kaidah ejaan, struktur kalimat efektif, dan koherensi paragraf.',
      description_en: 'Measures spelling rules, effective sentence structure, and paragraph coherence.',
    },
  },
  tpa: {
    verbal: {
      name_id: 'Tes Verbal',
      name_en: 'Verbal Test',
      questionCount: 25,
      seedCount: 10,
      timeLimitSec: 1500, // 25 menit
      icon: '💬',
      description_id: 'Menguji perbendaharaan kata, analogi hubungan kata, sinonim, dan antonim.',
      description_en: 'Tests vocabulary, word relationship analogies, synonyms, and antonyms.',
    },
    numerik: {
      name_id: 'Tes Numerik',
      name_en: 'Numerical Test',
      questionCount: 25,
      seedCount: 10,
      timeLimitSec: 1500, // 25 menit
      icon: '🔢',
      description_id: 'Menguji ketelitian hitung cepat, deret pola angka, dan aritmatika aplikasi.',
      description_en: 'Tests speed math, number sequence patterns, and applied arithmetic.',
    },
    figural: {
      name_id: 'Tes Figural',
      name_en: 'Figural Test',
      questionCount: 20,
      seedCount: 10,
      timeLimitSec: 1200, // 20 menit
      icon: '🔷',
      description_id: 'Menguji penalaran spasial, rotasi 2D/3D, dan deret pola gambar visual.',
      description_en: 'Tests spatial reasoning, 2D/3D rotations, and visual shape patterns.',
    },
  },
};

export const APP_CONFIG = {
  name: 'Nexam',
  tagline: 'Your Next Step to University',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://nexam.vercel.app',
};

export function getSubtestConfig(testType: TestType, subtest: string): SubtestMeta | undefined {
  return SUBTEST_CONFIG[testType]?.[subtest];
}
