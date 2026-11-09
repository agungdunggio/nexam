'use client';

import { Check } from 'lucide-react';
import { playPop } from '@/lib/soundEffects';

interface OptionItem {
  label: string;
  text: string;
}

interface MultipleChoiceProps {
  options?: OptionItem[];
  selectedAnswer: string | null;
  onSelect: (label: string) => void;
}

export function MultipleChoice({
  options = [],
  selectedAnswer,
  onSelect,
}: MultipleChoiceProps) {
  if (!options || options.length === 0) {
    return null;
  }

  const handleChoose = (label: string) => {
    playPop();
    onSelect(label);
  };

  return (
    <div className="space-y-3.5 select-none" role="radiogroup">
      {options.map((option, index) => {
        const isSelected = selectedAnswer?.toUpperCase() === option.label.toUpperCase();
        const shortcutKey = index + 1;

        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleChoose(option.label)}
            className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all duration-150 flex items-start gap-4 active:border-b-2 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isSelected
                ? 'border-indigo-600 border-b-4 border-b-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-slate-900 dark:text-indigo-50 shadow-md shadow-indigo-500/10 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-700 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {/* Duolingo Letter Badge (A, B, C, D, E) */}
            <div
              className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-all border-2 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm scale-110'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isSelected ? (
                <Check className="w-5 h-5 stroke-[3.5] animate-pop-in" />
              ) : (
                option.label
              )}
            </div>

            {/* Option Text */}
            <div className="flex-1 pt-1">
              <span className="text-sm sm:text-base font-semibold leading-relaxed">
                {option.text}
              </span>
            </div>

            {/* Subtle Keyboard hint */}
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-300 dark:text-slate-600 rounded bg-slate-50 dark:bg-slate-800/50">
              {shortcutKey}
            </span>
          </button>
        );
      })}
    </div>
  );
}
