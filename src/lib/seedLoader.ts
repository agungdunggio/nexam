import fs from 'fs';
import path from 'path';
import { Question, TestType } from '@/types/test';

interface RawSeedQuestion {
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

const SUBTEST_FILE_MAP: Record<string, { folder: 'utbk' | 'tpa'; file: string }> = {
  penalaran_umum: { folder: 'utbk', file: 'penalaran-umum.json' },
  penalaran_matematika: { folder: 'utbk', file: 'penalaran-matematika.json' },
  literasi_bahasa_indonesia: { folder: 'utbk', file: 'literasi-bahasa-indonesia.json' },
  literasi_bahasa_inggris: { folder: 'utbk', file: 'literasi-bahasa-inggris.json' },
  pengetahuan_kuantitatif: { folder: 'utbk', file: 'pengetahuan-kuantitatif.json' },
  pemahaman_bacaan_menulis: { folder: 'utbk', file: 'pemahaman-bacaan-menulis.json' },
  verbal: { folder: 'tpa', file: 'verbal.json' },
  numerik: { folder: 'tpa', file: 'numerik.json' },
  figural: { folder: 'tpa', file: 'figural.json' },
};

export function getSeedQuestions(subtest: string, locale: 'id' | 'en' = 'id'): (RawSeedQuestion & { id: string })[] {
  const mapEntry = SUBTEST_FILE_MAP[subtest];
  if (!mapEntry) return [];

  const filePath = path.join(
    process.cwd(),
    'src',
    'data',
    'seed',
    mapEntry.folder,
    mapEntry.file
  );

  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const rawList: RawSeedQuestion[] = JSON.parse(content);

    return rawList.map((item, idx) => ({
      ...item,
      id: `q_${subtest}_${idx + 1}`,
    }));
  } catch (err) {
    console.error('Failed reading seed questions:', err);
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
    content: (isEn && q.content_en) ? q.content_en : q.content_id,
    options: (isEn && q.options_en && q.options_en.length > 0) ? q.options_en : q.options_id,
    difficulty: q.difficulty,
  };
}
