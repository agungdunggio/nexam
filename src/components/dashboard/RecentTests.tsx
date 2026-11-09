import Link from 'next/link';
import { RecentTestItem } from '@/types/results';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentTestsProps {
  tests: RecentTestItem[];
}

export function RecentTests({ tests }: RecentTestsProps) {
  if (!tests || tests.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <p className="text-xs text-slate-500 mb-4">Belum ada riwayat tes.</p>
        <Link href="/test">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs">
            Mulai Tes Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Riwayat Simulasi Terbaru
        </h3>
        <Link href="/test" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Latihan Lagi →
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {tests.map((item, idx) => {
          const meta = SUBTEST_CONFIG[item.test_type]?.[item.subtest];
          const name = meta?.name_id || item.subtest;
          const icon = meta?.icon || '📝';

          return (
            <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.test_type.toUpperCase()} • {formatDate(item.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                    {item.score}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                    Poin
                  </span>
                </div>
                <Link href={`/results/${item.session_id}`}>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
