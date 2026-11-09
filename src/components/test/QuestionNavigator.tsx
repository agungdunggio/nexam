'use client';

import { Check, Bookmark, AlertCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number; // 0-indexed
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  const answeredCount = answeredQuestions.size;
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Navigasi Soal
        </h4>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {currentQuestion + 1} / {totalQuestions}
        </span>
      </div>

      {/* Grid of numbers */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isCurrent = index === currentQuestion;
          const isAnswered = answeredQuestions.has(index);
          const isFlagged = flaggedQuestions.has(index);

          let buttonStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700';

          if (isCurrent) {
            buttonStyle = 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900';
          } else if (isFlagged) {
            buttonStyle = 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80 font-bold';
          } else if (isAnswered) {
            buttonStyle = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80 font-bold';
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate(index)}
              className={`relative h-10 rounded-xl text-xs font-mono font-bold transition-all duration-150 flex items-center justify-center ${buttonStyle}`}
              title={`Nomor ${index + 1}`}
            >
              <span>{index + 1}</span>
              {isFlagged && !isCurrent && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Summary */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Sudah Dijawab</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200">{answeredCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Ragu-ragu</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200">{flaggedCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Belum Dijawab</span>
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-200">{unansweredCount}</span>
        </div>
      </div>
    </div>
  );
}
