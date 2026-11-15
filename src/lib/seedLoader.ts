import { Question, TestType } from '@/types/test';
import penalaranUmum from '@/data/seed/utbk/penalaran-umum.json';
import penalaranMatematika from '@/data/seed/utbk/penalaran-matematika.json';
import literasiBahasaIndonesia from '@/data/seed/utbk/literasi-bahasa-indonesia.json';
import literasiBahasaInggris from '@/data/seed/utbk/literasi-bahasa-inggris.json';
import pengetahuanKuantitatif from '@/data/seed/utbk/pengetahuan-kuantitatif.json';
import pemahamanBacaanMenulis from '@/data/seed/utbk/pemahaman-bacaan-menulis.json';
import tpaVerbal from '@/data/seed/tpa/verbal.json';
import tpaNumerik from '@/data/seed/tpa/numerik.json';
import tpaFigural from '@/data/seed/tpa/figural.json';

export interface RawSeedQuestion {
  test_type: TestType;
  subtest: string;
  question_type: 'multiple_choice' | 'short_answer';
  content_id: string;
  content_en?: string;
  options_id?: Array<{ label: string; text: string }>;
  options_en?: Array<{ label: string; text: string }>;
  correct_answer: string;
  explanation_id: string;
  explanation_en?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SUBTEST_SEED_MAP: Record<string, RawSeedQuestion[]> = {
  penalaran_umum: penalaranUmum as RawSeedQuestion[],
  penalaran_matematika: penalaranMatematika as RawSeedQuestion[],
  literasi_bahasa_indonesia: literasiBahasaIndonesia as RawSeedQuestion[],
  literasi_bahasa_inggris: literasiBahasaInggris as RawSeedQuestion[],
  pengetahuan_kuantitatif: pengetahuanKuantitatif as RawSeedQuestion[],
  pemahaman_bacaan_menulis: pemahamanBacaanMenulis as RawSeedQuestion[],
  verbal: tpaVerbal as RawSeedQuestion[],
  numerik: tpaNumerik as RawSeedQuestion[],
  figural: tpaFigural as RawSeedQuestion[],
};

export function getSeedQuestions(subtest: string, locale: 'id' | 'en' = 'id'): (RawSeedQuestion & { id: string })[] {
  void locale;
  const rawList = SUBTEST_SEED_MAP[subtest];
  if (!rawList || rawList.length === 0) return [];

  return rawList.map((item, idx) => ({
    ...item,
    id: `q_${subtest}_${idx + 1}`,
  }));
}

export function toClientQuestion(
  q: RawSeedQuestion & { id: string },
  number: number,
  locale: 'id' | 'en' = 'id'
): Question {
  const isEn = locale === 'en';
  return {
    id: q.id,
    number,
    type: q.question_type,
    content: (isEn && q.content_en) ? q.content_en : q.content_id,
    options: (isEn && q.options_en && q.options_en.length > 0) ? q.options_en : q.options_id,
    difficulty: q.difficulty,
  };
}
