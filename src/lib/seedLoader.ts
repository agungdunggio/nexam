import fs from 'fs';
import path from 'path';
import { Question, TestType } from '@/types/test';

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

const SUBTEST_SEED_FILES: Record<string, string> = {
  penalaran_umum: 'utbk/penalaran-umum.json',
  penalaran_matematika: 'utbk/penalaran-matematika.json',
  literasi_bahasa_indonesia: 'utbk/literasi-bahasa-indonesia.json',
  literasi_bahasa_inggris: 'utbk/literasi-bahasa-inggris.json',
  pengetahuan_kuantitatif: 'utbk/pengetahuan-kuantitatif.json',
  pemahaman_bacaan_menulis: 'utbk/pemahaman-bacaan-menulis.json',
  verbal: 'tpa/verbal.json',
  numerik: 'tpa/numerik.json',
  figural: 'tpa/figural.json',
};

/**
 * Local-only filesystem fallback when Supabase is unreachable in dev.
 * Uses runtime fs reads instead of static JSON imports because `src/data/seed/`
 * is gitignored and absent from Vercel build checkouts.
 */
export function getSeedQuestions(
  subtest: string,
  locale: 'id' | 'en' = 'id'
): (RawSeedQuestion & { id: string })[] {
  void locale;
  const relPath = SUBTEST_SEED_FILES[subtest];
  if (!relPath) return [];

  try {
    const fullPath = path.join(/* turbopackIgnore: true */ process.cwd(), 'src', 'data', 'seed', relPath);
    if (!fs.existsSync(fullPath)) return [];
    const rawJson = fs.readFileSync(fullPath, 'utf8');
    const rawList = JSON.parse(rawJson) as RawSeedQuestion[];
    if (!Array.isArray(rawList) || rawList.length === 0) return [];

    return rawList.map((item, idx) => ({
      ...item,
      id: `q_${subtest}_${idx + 1}`,
    }));
  } catch {
    return [];
  }
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
    content: isEn && q.content_en ? q.content_en : q.content_id,
    options: isEn && q.options_en && q.options_en.length > 0 ? q.options_en : q.options_id,
    difficulty: q.difficulty,
  };
}
