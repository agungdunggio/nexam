'use client';

import { Question } from '@/types/test';
import { MultipleChoice } from './MultipleChoice';
import { ShortAnswer } from './ShortAnswer';
import { Bookmark, HelpCircle } from 'lucide-react';
import { playPop } from '@/lib/soundEffects';

interface QuestionRendererProps {
  question: Question;
  currentAnswer: string | null;
  questionNumber: number;
  totalQuestions: number;
  isFlagged: boolean;
  onAnswer: (answer: string) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}

export function QuestionRenderer({
  question,
  currentAnswer,
  questionNumber,
  totalQuestions,
  isFlagged,
  onAnswer,
  onFlag,
}: QuestionRendererProps) {
  const handleFlag = () => {
    playPop();
    onFlag();
  };

  return (
    <div className="flex flex-col rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 border-b-6 shadow-sm transition-all duration-200 animate-pop-in">
      {/* Top Question Meta Bar */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 dark:border-slate-800 mb-6 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wider">
            Soal #{questionNumber}
          </span>
          <span className="text-xs text-slate-400 font-bold">
            dari {totalQuestions} Soal
          </span>
        </div>

        {/* Flag button */}
        <button
          type="button"
          onClick={handleFlag}
          className={`h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 flex items-center transition-all ${
            isFlagged
              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-800'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
          }`}
          title="Tandai untuk diperiksa lagi"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
          <span>{isFlagged ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
        </button>
      </div>

      {/* Question Content */}
      <div className="mb-7">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
          {question.content}
        </h2>

        {question.imageUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 max-h-72 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.imageUrl}
              alt={`Soal #${questionNumber}`}
              className="max-h-64 object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="mb-2">
        {question.type === 'multiple_choice' ? (
          <MultipleChoice
            options={question.options}
            selectedAnswer={currentAnswer}
            onSelect={onAnswer}
          />
        ) : (
          <ShortAnswer
            value={currentAnswer || ''}
            onChange={onAnswer}
          />
        )}
      </div>
    </div>
  );
}
