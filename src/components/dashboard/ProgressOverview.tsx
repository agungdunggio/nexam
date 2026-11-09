import { SubtestIconRenderer } from '@/components/icons/SubtestIcons';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { SubtestStat } from '@/types/results';
import { Target, TrendingUp } from 'lucide-react';

interface ProgressOverviewProps {
  subtests: SubtestStat[];
}

export function ProgressOverview({ subtests }: ProgressOverviewProps) {
  const allUtbkKeys = Object.keys(SUBTEST_CONFIG.utbk);
  const completedKeys = new Set(subtests.map((s) => s.subtest));
  const completionRate = Math.round((completedKeys.size / allUtbkKeys.length) * 100);

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cakupan Subtes UTBK
            </h3>
            <p className="text-[11px] text-slate-500">
              {completedKeys.size} dari {allUtbkKeys.length} subtes telah dicoba
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {completionRate}%
        </span>
      </div>

      <div className="space-y-3">
        {allUtbkKeys.map((key) => {
          const meta = SUBTEST_CONFIG.utbk[key];
          const stat = subtests.find((s) => s.subtest === key);
          const isDone = !!stat;

          return (
            <div key={key} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 truncate">
                <SubtestIconRenderer subtest={key} className="w-5 h-5 rounded-md shrink-0" size={20} />
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {meta.name_id}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isDone ? (
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Skor: {stat.best_score}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Belum Dicoba</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
