'use client';

import { useState } from 'react';
import { AnswerReviewItem } from '@/types/results';
import { TestType } from '@/types/test';
import { getQuestionIrtWeight } from '@/lib/scoring';
import { BookOpen, CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface AnswerReviewProps {
  answers?: AnswerReviewItem[];
  testType?: TestType;
}

type FilterMode = 'all' | 'correct' | 'wrong' | 'unanswered';

const DIFFICULTY_LABELS: Record<string, { label: string; style: string }> = {
  easy: {
    label: 'Mudah',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  },
  medium: {
    label: 'Sedang',
    style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  },
  hard: {
    label: 'Sulit',
    style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  },
};

/**
 * Tactile Duolingo-style answer review with standalone pressable filter tabs,
 * lesson-map question navigator, and flush two-zone question cards.
 */
export function AnswerReview({ answers = [], testType }: AnswerReviewProps) {
  const { t } = useLanguageStore();
  const [filter, setFilter] = useState<FilterMode>('all');

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

  const handleJump = (item: AnswerReviewItem) => {
    const matchesCurrentFilter =
      filter === 'all' ||
      (filter === 'correct' && item.is_correct) ||
      (filter === 'wrong' && !item.is_correct && item.user_answer !== null) ||
      (filter === 'unanswered' && item.user_answer === null);

    if (!matchesCurrentFilter) {
      setFilter('all');
    }

    setTimeout(() => {
      document.getElementById(`soal-${item.number}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 20);
  };

  const filterButtons: {
    id: FilterMode;
    label: string;
    count: number;
    activeClass: string;
  }[] = [
    {
      id: 'all',
      label: 'Semua',
      count: totalCount,
      activeClass: 'bg-[#5248e5] border-[#3730a3] text-white',
    },
    {
      id: 'correct',
      label: 'Benar',
      count: correctCount,
      activeClass: 'bg-emerald-600 border-emerald-800 text-white',
    },
    {
      id: 'wrong',
      label: 'Salah',
      count: wrongCount,
      activeClass: 'bg-rose-600 border-rose-800 text-white',
    },
    {
      id: 'unanswered',
      label: 'Kosong',
      count: unansweredCount,
      activeClass: 'bg-slate-700 border-slate-900 text-white dark:bg-slate-200 dark:border-slate-400 dark:text-slate-950',
    },
  ];

  return (
    <section id="pembahasan" aria-labelledby="review-heading" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            id="review-heading"
            className="text-xl sm:text-[22px] font-extrabold tracking-[-0.025em] text-[#13192b] dark:text-white"
          >
            Pembahasan Soal
          </h2>
          <p className="text-[13.5px] text-slate-500 dark:text-slate-400 mt-0.5">
            Tinjau kembali kunci jawaban dan langkah penyelesaian tiap butir soal.
          </p>
        </div>

        {/* Standalone Tactile Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter status soal">
          {filterButtons.map((btn) => {
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(btn.id)}
                className={`h-9 px-3.5 rounded-xl border-2 border-b-4 active:translate-y-[2px] active:border-b-2 text-[13px] font-bold inline-flex items-center gap-1.5 transition-[transform,border-color,background-color] duration-100 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? btn.activeClass
                    : 'bg-white dark:bg-[#141a29] border-[#dfe4ee] dark:border-[#252f47] text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-700'
                }`}
              >
                <span>{btn.label}</span>
                <span className="text-xs opacity-85 tabular-nums">{btn.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tactile Lesson-Map Question Navigator */}
      {answers.length > 0 && (
        <nav aria-label="Peta nomor soal" className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
            Loncat:
          </span>
          {answers.map((item) => {
            const isAnswered = item.user_answer !== null;
            const nodeStyle = item.is_correct
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/70 text-emerald-700 dark:text-emerald-300'
              : isAnswered
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700/70 text-rose-700 dark:text-rose-300'
              : 'bg-white dark:bg-[#141a29] border-[#dfe4ee] dark:border-[#252f47] text-slate-600 dark:text-slate-300';

            return (
              <button
                key={item.question_id}
                type="button"
                onClick={() => handleJump(item)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-[10px] border-2 border-b-[3px] sm:border-b-4 active:translate-y-[2px] active:border-b-2 font-mono text-[11.5px] sm:text-xs font-extrabold inline-flex items-center justify-center transition-transform duration-100 tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${nodeStyle}`}
                title={`Lompat ke Soal ${item.number}`}
              >
                {item.number}
              </button>
            );
          })}
        </nav>
      )}

      {/* Question Stack */}
      {filteredAnswers.length === 0 ? (
        <div className="rounded-[20px] bg-white dark:bg-[#141a29] border-2 border-[#dfe4ee] dark:border-[#252f47] p-8 text-center">
          <p className="text-sm font-bold text-[#13192b] dark:text-slate-100">
            Tidak ada soal pada filter ini.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pilih tab &ldquo;Semua&rdquo; untuk menampilkan seluruh butir soal.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnswers.map((item) => {
            const isAnswered = item.user_answer !== null;
            const irtWeight = getQuestionIrtWeight(item.difficulty);
            const difficultyMeta = item.difficulty
              ? DIFFICULTY_LABELS[item.difficulty.toLowerCase()]
              : undefined;

            let statusClass = 'text-slate-500 dark:text-slate-400';
            let statusText = testType ? 'Kosong (0)' : 'Kosong';
            let StatusIcon = MinusCircle;

            if (item.is_correct) {
              statusClass = 'text-emerald-700 dark:text-emerald-400';
              statusText =
                testType === 'tpa'
                  ? 'Benar (+4)'
                  : testType === 'utbk'
                  ? `Benar · Bobot ${irtWeight}x`
                  : 'Benar';
              StatusIcon = CheckCircle2;
            } else if (isAnswered) {
              statusClass = 'text-rose-700 dark:text-rose-400';
              statusText =
                testType === 'tpa' ? 'Salah (-1)' : testType === 'utbk' ? 'Salah (0)' : 'Salah';
              StatusIcon = XCircle;
            }

            const paddedNum = String(item.number).padStart(2, '0');

            return (
              <article
                id={`soal-${item.number}`}
                key={item.question_id}
                className="scroll-mt-20 rounded-[20px] bg-white dark:bg-[#141a29] border-2 border-[#dfe4ee] dark:border-[#252f47] border-b-[5px] border-b-[#cbd3e3] dark:border-b-[#0b0f19] overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div className="inline-flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-[#5248e5] dark:text-indigo-300 font-mono text-xs font-extrabold inline-flex items-center justify-center tabular-nums">
                        {paddedNum}
                      </span>
                      <span className="text-[13px] font-extrabold text-[#13192b] dark:text-white">
                        Soal #{item.number}
                      </span>
                      {difficultyMeta && (
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${difficultyMeta.style}`}
                        >
                          {difficultyMeta.label}
                        </span>
                      )}
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${statusClass}`}>
                      <StatusIcon className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                      <span>{statusText}</span>
                    </span>
                  </div>

                  <p className="max-w-[68ch] text-[15.5px] font-semibold text-[#13192b] dark:text-slate-100 leading-relaxed whitespace-pre-line mb-4">
                    {item.content}
                  </p>

                  {/* Tactile MCQ Option Keycaps (full readable text, no truncation) */}
                  {item.options && item.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[72ch] mb-4">
                      {item.options.map((opt) => {
                        const isUserPick =
                          item.user_answer?.toUpperCase() === opt.label.toUpperCase();
                        const isRightPick =
                          item.correct_answer?.toUpperCase() === opt.label.toUpperCase();

                        let optStyle =
                          'bg-[#f6f7fb] dark:bg-[#1c2438] border-[#dfe4ee] dark:border-[#252f47] text-slate-600 dark:text-slate-300 font-medium';
                        let keyStyle =
                          'border-[#dfe4ee] dark:border-[#334155] text-[#13192b] dark:text-slate-100';

                        if (isRightPick) {
                          optStyle =
                            'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-700/70 text-emerald-800 dark:text-emerald-300 font-bold';
                          keyStyle =
                            'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
                        } else if (isUserPick) {
                          optStyle =
                            'bg-rose-50 dark:bg-rose-950/35 border-rose-300 dark:border-rose-700/70 text-rose-800 dark:text-rose-300 font-bold';
                          keyStyle =
                            'border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300';
                        }

                        return (
                          <div
                            key={opt.label}
                            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-[13px] border-2 border-b-[3px] text-[13.5px] leading-snug ${optStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-[7px] border bg-white dark:bg-[#141a29] font-extrabold text-[11.5px] inline-flex items-center justify-center shrink-0 mt-0.5 ${keyStyle}`}
                            >
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Verdict Row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500 dark:text-slate-400">
                    <div>
                      <span>{t('results.your_answer')}: </span>
                      <strong
                        className={`font-extrabold tabular-nums ${
                          item.is_correct
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : isAnswered
                            ? 'text-rose-700 dark:text-rose-400'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {item.user_answer || '(Tidak Dijawab)'}
                      </strong>
                    </div>
                    <div>
                      <span>{t('results.correct_answer')}: </span>
                      <strong className="font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {item.correct_answer}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Flush Tonal Explanation Footer (Zero Nested Inner Box) */}
                {item.explanation && (
                  <div className="bg-[#f3f5ff] dark:bg-[#192138] border-t-2 border-[#dfe4ee] dark:border-[#252f47] px-5 sm:px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5248e5] dark:text-indigo-400 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                      <span>{t('results.explanation')}</span>
                    </div>
                    <p className="max-w-[68ch] text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
