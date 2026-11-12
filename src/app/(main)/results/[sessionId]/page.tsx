'use client';

import Link from 'next/link';
import { useResults } from '@/hooks/useResults';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { ScoreSummary } from '@/components/results/ScoreSummary';
import { ComparisonChart } from '@/components/results/ComparisonChart';
import { ScoreDistribution } from '@/components/results/ScoreDistribution';
import { PerformanceChart } from '@/components/results/PerformanceChart';
import { AnswerReview } from '@/components/results/AnswerReview';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { Button } from '@/components/ui/button';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { RotateCcw, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function ResultsPage({ params }: PageProps) {
  const { sessionId } = params;
  const { result, isLoading, error } = useResults(sessionId);
  const { t } = useLanguageStore();

  if (isLoading) {
    return <LoadingScreen message="Memproses skor dan analisis pembahasan..." fullscreen />;
  }

  if (error || !result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Hasil Tidak Ditemukan
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Sesi ujian mungkin belum dikumpulkan atau telah kedaluwarsa.
        </p>
        <Link href="/test">
          <button className="px-5 h-11 rounded-2xl duo-button-green text-xs font-black uppercase">
            Mulai Ujian Baru
          </button>
        </Link>
      </div>
    );
  }

  const meta = SUBTEST_CONFIG[result.test_type]?.[result.subtest];
  const subtestName = meta?.name_id || result.subtest;
  const maxScore = result.test_type === 'utbk' ? 1000 : 800;
  const accuracy = result.total_questions > 0 ? Math.round((result.correct_count / result.total_questions) * 100) : 0;
  const speedSec = result.total_questions > 0 ? result.time_spent_sec / result.total_questions : 60;

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      {/* Duolingo Hero Celebration Banner */}
      <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <DuolingoMascot
          mood="cheering"
          size="md"
          message={`Sesi latihan selesai. Skor kamu: ${result.score} poin. Evaluasi hasil dan pembahasanmu di bawah ini.`}
          bubbleSide="right"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/test">
            <button className="h-12 px-6 rounded-2xl duo-button-green text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 h-4" />
              <span>Latihan Subtes Lain</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Score Summary */}
      <ScoreSummary
        score={result.score}
        totalQuestions={result.total_questions}
        correctCount={result.correct_count}
        wrongCount={result.wrong_count}
        unansweredCount={result.unanswered_count}
        timeSpentSec={result.time_spent_sec}
        percentile={result.percentile}
        maxScore={maxScore}
      />

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ComparisonChart userScore={result.score} comparison={result.comparison} />
        <ScoreDistribution userScore={result.score} />
        <PerformanceChart
          accuracy={accuracy}
          speedSecPerQuestion={speedSec}
          percentile={result.percentile}
        />
      </div>

      {/* Answer Review & Explanations */}
      <AnswerReview answers={result.answers} />
    </div>
  );
}
