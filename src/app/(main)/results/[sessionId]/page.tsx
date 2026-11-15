'use client';

import Link from 'next/link';
import { useResults } from '@/hooks/useResults';
import { ScoreSummary } from '@/components/results/ScoreSummary';
import { ScoreDistribution } from '@/components/results/ScoreDistribution';
import { PerformanceChart } from '@/components/results/PerformanceChart';
import { AnswerReview } from '@/components/results/AnswerReview';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { SUBTEST_CONFIG } from '@/lib/constants';

interface PageProps {
  params: {
    sessionId: string;
  };
}

export default function ResultsPage({ params }: PageProps) {
  const { sessionId } = params;
  const { result, isLoading, error } = useResults(sessionId);

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
  const accuracy =
    result.total_questions > 0
      ? Math.round((result.correct_count / result.total_questions) * 100)
      : 0;
  const speedSec =
    result.total_questions > 0 ? result.time_spent_sec / result.total_questions : 60;

  // Consistent top-percent rank across Hero Stage and Performance Meter
  const topPercent = result.comparison
    ? Math.max(
        1,
        Math.min(
          99,
          Math.round(
            (result.comparison.your_rank / Math.max(1, result.comparison.total_participants)) * 100
          )
        )
      )
    : Math.max(1, 100 - Math.round(result.percentile));

  return (
    <div className="max-w-[1060px] mx-auto py-4 space-y-6">
      {/* Unified Duolingo Tactile Hero Stage */}
      <ScoreSummary
        score={result.score}
        totalQuestions={result.total_questions}
        correctCount={result.correct_count}
        wrongCount={result.wrong_count}
        unansweredCount={result.unanswered_count}
        timeSpentSec={result.time_spent_sec}
        topPercent={topPercent}
        maxScore={maxScore}
        subtestName={subtestName}
        comparison={result.comparison}
      />

      {/* Asymmetric 7 : 5 Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7">
          <ScoreDistribution
            userScore={result.score}
            maxScore={maxScore}
            buckets={result.score_distribution}
            comparison={result.comparison}
          />
        </div>
        <div className="lg:col-span-5">
          <PerformanceChart
            accuracy={accuracy}
            speedSecPerQuestion={speedSec}
            topPercent={topPercent}
            correctCount={result.correct_count}
            totalQuestions={result.total_questions}
          />
        </div>
      </div>

      {/* Answer Review & Explanations */}
      <AnswerReview answers={result.answers} testType={result.test_type} />
    </div>
  );
}
