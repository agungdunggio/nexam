'use client';

interface TestProgressProps {
  current: number;
  total: number;
  answered: number;
}

export function TestProgress({ current, total, answered }: TestProgressProps) {
  const percentAnswered = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Progres: <strong className="text-slate-800 dark:text-slate-200">{answered}</strong> dari {total} dijawab
        </span>
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
          {Math.round(percentAnswered)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
          style={{ width: `${percentAnswered}%` }}
        />
      </div>
    </div>
  );
}
