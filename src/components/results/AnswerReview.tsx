'use client';

import { useState } from 'react';
import { AnswerReviewItem } from '@/types/results';
import { CheckCircle2, XCircle, MinusCircle, Lightbulb, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/stores/languageStore';

interface AnswerReviewProps {
  answers?: AnswerReviewItem[];
}

export function AnswerReview({ answers = [] }: AnswerReviewProps) {
  const { t } = useLanguageStore();
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  const totalCount = answers.length;
  const correctCount = answers.filter((a) => a.is_correct).length;
  const wrongCount = answers.filter((a) => !a.is_correct && a.user_answer !== null).length;
  const unansweredCount = answers.filter((a) => a.user_answer === null).length;

  const filteredAnswers = answers.filter((item) => {
    if (filter === 'correct') return item.is_correct;
    if (filter === 'wrong') return !item.is_correct && item.user_answer !== null;
    if (filter === 'unanswered') return item.user_answer === null;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Pembahasan Soal
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Pelajari kunci jawaban dan pembahasan lengkap setiap butir soal.
          </p>
        </div>

        {/* Filter Buttons with Icons & Counter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 select-none">
          {/* Semua */}
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>Semua</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                filter === 'all'
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Benar */}
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'correct'
                ? 'bg-emerald-500 text-white shadow-sm font-black'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Benar</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                filter === 'correct'
                  ? 'bg-white/25 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {correctCount}
            </span>
          </button>

          {/* Salah */}
          <button
            type="button"
            onClick={() => setFilter('wrong')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'wrong'
                ? 'bg-rose-500 text-white shadow-sm font-black'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <XCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Salah</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                filter === 'wrong'
                  ? 'bg-white/25 text-white'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
              }`}
            >
              {wrongCount}
            </span>
          </button>

          {/* Kosong / Belum Terjawab */}
          <button
            type="button"
            onClick={() => setFilter('unanswered')}
            className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'unanswered'
                ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <MinusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Kosong</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                filter === 'unanswered'
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {unansweredCount}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnswers.map((item) => {
          const isAnswered = item.user_answer !== null;
          let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
          let statusText = 'Tidak Dijawab';
          let StatusIcon = MinusCircle;

          if (item.is_correct) {
            badgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            statusText = 'Benar (+1)';
            StatusIcon = CheckCircle2;
          } else if (isAnswered) {
            badgeColor = 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            statusText = 'Salah';
            StatusIcon = XCircle;
          }

          return (
            <div
              key={item.question_id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                  Soal #{item.number}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{statusText}</span>
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {/* Multiple choice options preview if present */}
              {item.options && item.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.options.map((opt) => {
                    const isUserPick = item.user_answer?.toUpperCase() === opt.label.toUpperCase();
                    const isRightPick = item.correct_answer?.toUpperCase() === opt.label.toUpperCase();

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400';
                    if (isRightPick) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (isUserPick) {
                      optStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-bold';
                    }

                    return (
                      <div
                        key={opt.label}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 bg-white dark:bg-slate-900 border">
                          {opt.label}
                        </span>
                        <span className="truncate">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Answer comparison tags */}
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">{t('results.your_answer')}: </span>
                  <strong className={item.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400 font-mono'}>
                    {item.user_answer || '(Tidak Dijawab)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">{t('results.correct_answer')}: </span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    {item.correct_answer}
                  </strong>
                </div>
              </div>

              {/* Explanation Box */}
              {item.explanation && (
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>{t('results.explanation')}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
