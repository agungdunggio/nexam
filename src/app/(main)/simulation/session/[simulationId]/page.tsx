'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types/test';
import { UTBK_SIMULATION_SUBTESTS } from '@/lib/simulationConfig';
import { QuestionRenderer } from '@/components/test/QuestionRenderer';
import { playDing, playPop } from '@/lib/soundEffects';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Lock,
  Layers,
  Loader2,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface PageProps {
  params: {
    simulationId: string;
  };
}

interface ActiveSubtest {
  subtestId: string;
  name: string;
  component: string;
  sessionId: string;
  timeLimitSec: number;
  questions: Question[];
}

export default function SimulationSessionPage({ params }: PageProps) {
  const { simulationId } = params;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);
  const [activeSubtest, setActiveSubtest] = useState<ActiveSubtest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Per-subtest local state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Set<number>>(new Set());

  // Subtest Timer
  const [remainingSec, setRemainingSec] = useState<number>(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [confirmNextOpen, setConfirmNextOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);
  const [nextSubtestName, setNextSubtestName] = useState('');

  // 1. Initial Load of Simulation State
  useEffect(() => {
    let isMounted = true;

    async function loadSimulation() {
      try {
        setLoading(true);
        const res = await fetch(`/api/simulation/${simulationId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'Gagal memuat sesi simulasi');
        }

        if (data.data.status === 'completed') {
          router.replace(`/simulation/results/${simulationId}`);
          return;
        }

        if (isMounted) {
          setCurrentSubtestIndex(data.data.currentSubtestIndex);
          if (data.data.activeSubtest) {
            setActiveSubtest(data.data.activeSubtest);
            setAnswers(data.data.activeSubtest.savedAnswers || {});
            setFlaggedIndices(new Set(data.data.activeSubtest.flagged || []));
            setRemainingSec(data.data.activeSubtest.timeLimitSec);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Terjadi kendala saat memuat simulasi');
          setLoading(false);
        }
      }
    }

    loadSimulation();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simulationId, router]);

  // 2. Advance to next subtest or finish
  const handleAdvance = useCallback(
    async (isAutoSubmit = false) => {
      if (!activeSubtest || advancing) return;

      try {
        setAdvancing(true);
        if (timerRef.current) clearInterval(timerRef.current);

        const answersPayload = activeSubtest.questions.map((q) => ({
          question_id: q.id,
          answer: answers[q.id] || null,
        }));

        const res = await fetch('/api/simulation/advance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            simulationId,
            subtestIndex: currentSubtestIndex,
            answers: answersPayload,
            flagged: Array.from(flaggedIndices),
            isAutoSubmit,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'Gagal beralih ke subtes berikutnya');
        }

        playDing();

        if (data.completed) {
          router.push(`/simulation/results/${simulationId}`);
        } else {
          // Prepare next subtest
          setConfirmNextOpen(false);
          setNextSubtestName(data.nextSubtest.name);
          setActiveSubtest(data.nextSubtest);
          setCurrentSubtestIndex(data.currentSubtestIndex);
          setCurrentQuestionIndex(0);
          setAnswers({});
          setFlaggedIndices(new Set());
          setRemainingSec(data.nextSubtest.timeLimitSec);
          setTransitionModalOpen(true);
          setAdvancing(false);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Terjadi kendala');
        setAdvancing(false);
      }
    },
    [activeSubtest, advancing, answers, currentSubtestIndex, flaggedIndices, router, simulationId]
  );

  // 3. Countdown Timer Runner
  useEffect(() => {
    if (loading || transitionModalOpen || !activeSubtest) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAdvance(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, transitionModalOpen, activeSubtest, handleAdvance]);

  // Question navigation handlers
  const handleSelectAnswer = (ans: string) => {
    if (!activeSubtest) return;
    playPop();
    const currentQ = activeSubtest.questions[currentQuestionIndex];
    if (currentQ) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
    }
  };

  const handleToggleFlag = () => {
    setFlaggedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionIndex)) next.delete(currentQuestionIndex);
      else next.add(currentQuestionIndex);
      return next;
    });
  };

  // Timer formatting
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isLastSubtest = currentSubtestIndex === UTBK_SIMULATION_SUBTESTS.length - 1;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-bold text-slate-500">Menyiapkan Lembar Simulasi...</p>
      </div>
    );
  }

  if (error || !activeSubtest) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Kendala Simulasi</h2>
        <p className="text-xs text-slate-500">{error || 'Data simulasi tidak tersedia.'}</p>
        <button
          onClick={() => router.push('/simulation')}
          className="h-11 px-6 rounded-xl duo-button-green text-xs font-bold uppercase"
        >
          Kembali ke Hub Simulasi
        </button>
      </div>
    );
  }

  const currentQuestion = activeSubtest.questions[currentQuestionIndex];
  const totalQuestions = activeSubtest.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Simulation Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Subtest Information & Step Indicators */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              {UTBK_SIMULATION_SUBTESTS.map((sub, idx) => {
                const isPassed = idx < currentSubtestIndex;
                const isCurrent = idx === currentSubtestIndex;
                return (
                  <div
                    key={sub.id}
                    title={`${sub.name_id} (${isPassed ? 'Selesai' : isCurrent ? 'Sedang Dikerjakan' : 'Terkunci'})`}
                    className={`h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'w-7 bg-indigo-600 shadow-sm shadow-indigo-500/40'
                        : isPassed
                        ? 'w-3.5 bg-emerald-500'
                        : 'w-2 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block leading-tight">
                Subtes {currentSubtestIndex + 1} dari {UTBK_SIMULATION_SUBTESTS.length}
              </span>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate leading-tight">
                {activeSubtest.name}
              </h2>
            </div>
          </div>

          {/* Right Action: Subtest Timer & Navigator Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono font-black text-xs sm:text-sm transition-colors ${
                remainingSec < 120
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-600 animate-pulse'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(remainingSec)}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                playPop();
                setNavModalOpen(true);
              }}
              className="h-9 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Peta Soal</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                {answeredCount}/{totalQuestions}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Question View */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            currentAnswer={answers[currentQuestion.id] || null}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            isFlagged={flaggedIndices.has(currentQuestionIndex)}
            onAnswer={handleSelectAnswer}
            onFlag={handleToggleFlag}
            onPrevious={() => {
              playPop();
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
            }}
            onNext={() => {
              playPop();
              setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
            }}
            canPrevious={currentQuestionIndex > 0}
            canNext={currentQuestionIndex < totalQuestions - 1}
          />
        )}
      </main>

      {/* Bottom Sticky Action Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 p-3 sm:p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playPop();
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentQuestionIndex === 0}
            className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl duo-button-outline text-xs sm:text-sm font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                }}
                className="h-11 sm:h-12 px-5 sm:px-7 rounded-2xl duo-button-outline text-xs sm:text-sm font-black flex items-center gap-1.5"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}

            {/* Advance Subtest Button */}
            <button
              type="button"
              onClick={() => {
                playPop();
                setConfirmNextOpen(true);
              }}
              disabled={advancing}
              className={`h-11 sm:h-12 px-5 sm:px-8 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                isLastSubtest
                  ? 'duo-button-green shadow-emerald-500/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
              }`}
            >
              {advancing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>
                    {isLastSubtest ? 'Selesai & Kumpulkan Simulasi' : 'Kunci & Lanjut Subtes'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Confirmation Modal to Advance Subtest */}
      <Dialog open={confirmNextOpen} onOpenChange={setConfirmNextOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="pr-10 text-left space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              {isLastSubtest ? 'Kumpulkan Seluruh Simulasi?' : 'Beralih ke Subtes Berikutnya?'}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {isLastSubtest
                ? 'Semua 6 subtes simulasi telah selesai dikerjakan. Hasil evaluasi dan skor komposit UTBK akan langsung dihitung.'
                : 'Sesuai aturan resmi CBT, subtes saat ini akan dikunci permanen. Kamu tidak dapat kembali mengubah jawaban subtes ini setelah beralih.'}
            </p>
          </DialogHeader>

          <div className="my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Progress Subtes Ini:</span>
            <span className="font-mono font-bold text-indigo-600">
              {answeredCount} dari {totalQuestions} Soal Terjawab
            </span>
          </div>

          <DialogFooter className="pt-2 flex flex-row gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmNextOpen(false)}
              className="flex-1 h-11 rounded-xl duo-button-outline text-xs font-bold"
            >
              Periksa Lagi
            </button>
            <button
              type="button"
              onClick={() => handleAdvance(false)}
              disabled={advancing}
              className="flex-1 h-11 rounded-xl duo-button-green text-xs font-black uppercase tracking-wider"
            >
              {isLastSubtest ? 'Kumpulkan' : 'Ya, Lanjutkan'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subtest Transition Modal */}
      <Dialog open={transitionModalOpen} onOpenChange={setTransitionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
            Subtes Berhasil Dikunci!
          </DialogTitle>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Kamu sekarang memasuki{' '}
            <strong className="text-indigo-600 dark:text-indigo-400">{nextSubtestName}</strong>.
            Waktu pengerjaan akan langsung berjalan begitu kamu menekan tombol di bawah.
          </p>

          <button
            type="button"
            onClick={() => {
              playPop();
              setTransitionModalOpen(false);
            }}
            className="w-full mt-6 h-12 rounded-2xl duo-button-green text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Mulai Subtes {nextSubtestName}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </DialogContent>
      </Dialog>

      {/* Question Navigator Modal */}
      <Dialog open={navModalOpen} onOpenChange={setNavModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="pr-10">
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-between gap-3">
              <span className="truncate">Peta Soal: {activeSubtest.name}</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold shrink-0">
                {answeredCount}/{totalQuestions}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 my-4 max-h-[320px] overflow-y-auto p-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const q = activeSubtest.questions[idx];
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = q && !!answers[q.id];
              const isFlagged = flaggedIndices.has(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playPop();
                    setCurrentQuestionIndex(idx);
                    setNavModalOpen(false);
                  }}
                  className={`h-12 rounded-2xl font-mono font-black text-sm transition-all flex items-center justify-center relative border-2 ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                      : isFlagged
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : isAnswered
                      ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && !isCurrent && (
                    <Bookmark className="w-3 h-3 absolute top-1 right-1 fill-amber-500 text-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500" />
              <span>Sudah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span>Ragu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-slate-700" />
              <span>Belum</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
