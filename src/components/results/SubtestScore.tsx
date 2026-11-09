import { SubtestIconRenderer } from '@/components/icons/SubtestIcons';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { TestType } from '@/types/test';

interface SubtestScoreProps {
  testType: TestType;
  subtest: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
}

export function SubtestScore({
  testType,
  subtest,
  score,
  totalQuestions,
  correctCount,
}: SubtestScoreProps) {
  const meta = SUBTEST_CONFIG[testType]?.[subtest];
  const name = meta?.name_id || subtest;
  const icon = meta?.icon || '📊';
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-950/60">
          <SubtestIconRenderer subtest={subtest} className="w-full h-full object-cover" size={40} />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {name}
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            {correctCount} dari {totalQuestions} benar ({percentage}%)
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {score}
        </span>
        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Skor Akhir
        </span>
      </div>
    </div>
  );
}
