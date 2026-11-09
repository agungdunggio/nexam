export type TestType = 'utbk' | 'tpa';

export type UTBKSubtest =
  | 'penalaran_umum'
  | 'penalaran_matematika'
  | 'literasi_bahasa_indonesia'
  | 'literasi_bahasa_inggris'
  | 'pengetahuan_kuantitatif'
  | 'pemahaman_bacaan_menulis';

export type TPASubtest = 'verbal' | 'numerik' | 'figural';

export type SubtestId = UTBKSubtest | TPASubtest;

export type QuestionType = 'multiple_choice' | 'short_answer';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  label: string; // "A" | "B" | "C" | "D" | "E"
  text: string;
}

export interface Question {
  id: string;
  number: number;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  imageUrl?: string | null;
  difficulty?: DifficultyLevel;
}

export interface TestSession {
  id: string;
  userId?: string;
  testType: TestType;
  subtest: string;
  timeLimitSec: number;
  startedAt: string;
  finishedAt?: string | null;
  status: 'in_progress' | 'completed' | 'timed_out';
}

export interface StartTestRequest {
  test_type: TestType;
  subtest: string;
}

export interface UserAnswerInput {
  question_id: string;
  answer: string | null;
}

export interface SubmitTestRequest {
  session_id: string;
  answers: UserAnswerInput[];
  time_spent_sec: number;
  auto_submitted?: boolean;
}

export interface SubtestMeta {
  name_id: string;
  name_en: string;
  questionCount: number;
  seedCount: number;
  timeLimitSec: number;
  icon: string;
  description_id?: string;
  description_en?: string;
}
