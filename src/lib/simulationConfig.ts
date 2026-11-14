export interface SimulationSubtestDef {
  id: string;
  testType: 'utbk';
  name_id: string;
  component: 'Tes Potensi Skolastik (TPS)' | 'Tes Literasi & Penalaran';
  description: string;
  officialQuestions: number;
  officialMinutes: number;
  questionCount: number;
  timeLimitSec: number;
}

export const UTBK_SIMULATION_SUBTESTS: SimulationSubtestDef[] = [
  {
    id: 'penalaran_umum',
    testType: 'utbk',
    name_id: 'Penalaran Umum (PU)',
    component: 'Tes Potensi Skolastik (TPS)',
    description: 'Penalaran induktif, deduktif, dan analisis argumen kuantitatif.',
    officialQuestions: 30,
    officialMinutes: 30,
    questionCount: 10,
    timeLimitSec: 600, // 10 menit
  },
  {
    id: 'pengetahuan_kuantitatif',
    testType: 'utbk',
    name_id: 'Pengetahuan Kuantitatif (PK)',
    component: 'Tes Potensi Skolastik (TPS)',
    description: 'Penguasaan konsep matematika dasar, aljabar, dan kalkulasi.',
    officialQuestions: 20,
    officialMinutes: 20,
    questionCount: 10,
    timeLimitSec: 600, // 10 menit
  },
  {
    id: 'pemahaman_bacaan_menulis',
    testType: 'utbk',
    name_id: 'Pemahaman Bacaan & Menulis (PBM)',
    component: 'Tes Potensi Skolastik (TPS)',
    description: 'Kaidah tata tulis bahasa, ejaan efektif, dan koherensi paragraf.',
    officialQuestions: 20,
    officialMinutes: 25,
    questionCount: 10,
    timeLimitSec: 750, // 12.5 menit
  },
  {
    id: 'literasi_bahasa_indonesia',
    testType: 'utbk',
    name_id: 'Literasi Bahasa Indonesia',
    component: 'Tes Literasi & Penalaran',
    description: 'Pemahaman makna mendalam, analisis teks, dan inferensi wacana kritis.',
    officialQuestions: 30,
    officialMinutes: 45,
    questionCount: 10,
    timeLimitSec: 900, // 15 menit
  },
  {
    id: 'literasi_bahasa_inggris',
    testType: 'utbk',
    name_id: 'Literasi Bahasa Inggris',
    component: 'Tes Literasi & Penalaran',
    description: 'Critical comprehension, vocabulary, and inference in academic English texts.',
    officialQuestions: 20,
    officialMinutes: 30,
    questionCount: 10,
    timeLimitSec: 900, // 15 menit
  },
  {
    id: 'penalaran_matematika',
    testType: 'utbk',
    name_id: 'Penalaran Matematika',
    component: 'Tes Literasi & Penalaran',
    description: 'Penyelesaian masalah kontekstual kehidupan nyata berbasis logika matematika.',
    officialQuestions: 20,
    officialMinutes: 30,
    questionCount: 10,
    timeLimitSec: 900, // 15 menit
  },
];

export interface StoredSimulationSession {
  id: string;
  userId: string;
  startedAt: string;
  finishedAt: string | null;
  status: 'in_progress' | 'completed';
  currentSubtestIndex: number;
  subtests: Array<{
    subtestId: string;
    sessionId: string;
    startedAt: string | null;
    finishedAt: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'timed_out';
    answers: Record<string, string>;
    flagged: number[];
    score?: number;
    correctCount?: number;
    incorrectCount?: number;
    unansweredCount?: number;
  }>;
  compositeScore?: number;
}
