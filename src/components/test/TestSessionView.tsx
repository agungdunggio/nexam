'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTest } from '@/hooks/useTest';
import { useTimer } from '@/hooks/useTimer';
import { SUBTEST_CONFIG } from '@/lib/constants';
import { QuestionRenderer } from '@/components/test/QuestionRenderer';
import { ConfirmSubmit } from '@/components/test/ConfirmSubmit';
import { AutoSubmitWarning } from '@/components/test/AutoSubmitWarning';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { playDing, playPop, isSoundEnabled, setSoundEnabled } from '@/lib/soundEffects';
import { TestType } from '@/types/test';
import {
  X,
  Clock,
  Flame,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Grid,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TestSessionViewProps {
  sessionId: string;
  testType: TestType;
}

export function TestSessionView({ sessionId, testType }: TestSessionViewProps) {
  const router = useRouter();
  const {
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    answeredIndices,
    flaggedSet,
    answeredCount,
    unansweredCount,
    isLoading,
    isSubmitting,
    setAnswer,
    toggleFlag,
    goToQuestion,
    goNext,
    goPrevious,
    submitTest,
    loadProgress,
  } = useTest();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMinutes, setWarningMinutes] = useState(5);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playPop();
  };

  // Load progress if session doesn't match current URL
  useEffect(() => {
    if (!session || session.id !== sessionId) {
      loadProgress(sessionId);
    }
  }, [sessionId, session, loadProgress]);

  const handleTimeUp = useCallback(async () => {
    const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const res = await submitTest(elapsedSec, true);
    if (res?.sessionId) {
      router.push(`/results/${res.sessionId}`);
    }
  }, [submitTest, router]);

  const handleWarning = useCallback((minutesLeft: number) => {
    setWarningMinutes(minutesLeft);
    setWarningOpen(true);
  }, []);

  const {
    formattedTime,
    urgencyLevel,
    startTimer,
    stopTimer,
    totalSeconds,
  } = useTimer({
    onTimeUp: handleTimeUp,
    onWarning: handleWarning,
  });

  // Start timer once session is ready
  useEffect(() => {
    if (session && session.timeLimitSec && totalSeconds === 0) {
      startTimer(session.timeLimitSec);
      startTimeRef.current = Date.now();
    }
  }, [session, totalSeconds, startTimer]);

  const handleManualSubmit = async () => {
    stopTimer();
    const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const res = await submitTest(elapsedSec, false);
    if (res?.sessionId) {
      router.push(`/results/${res.sessionId}`);
    }
  };

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const hasAnsweredCurrent = !!currentAnswer;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      setConfirmOpen(true);
    } else {
      playDing();
      goNext();
    }
  }, [isLastQuestion, goNext]);

  // Keyboard shortcut listener for Duolingo lightning-fast flow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (confirmOpen || exitModalOpen || navModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      } else if (e.key === 'ArrowRight' && currentQuestionIndex < totalQuestions - 1) {
        goNext();
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        goPrevious();
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && currentQuestion?.options) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[idx]) {
          playPop();
          setAnswer(currentQuestion.id, currentQuestion.options[idx].label);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    confirmOpen,
    exitModalOpen,
    navModalOpen,
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    setAnswer,
    goNext,
    goPrevious,
    handleContinue,
  ]);

  if (isLoading || !session || !currentQuestion) {
    return <LoadingScreen message="Menyiapkan lembar simulasi ujian..." fullscreen />;
  }

  const meta = SUBTEST_CONFIG[session.testType]?.[session.subtest];
  const subtestName = meta?.name_id || session.subtest;
  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-950/70 selection:bg-indigo-600 selection:text-white pb-32">
      {/* Duolingo Sticky Top Bar */}
      <header className="sticky top-0 z-30 w-full glass border-b-2 border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Exit 'X' Button */}
          <button
            type="button"
            onClick={() => setExitModalOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Keluar dari Latihan"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Duolingo Animated Progress Bar */}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-4 sm:h-5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Shiny gloss bar effect */}
                <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
            <span className="text-xs font-mono font-black text-slate-500 dark:text-slate-400 shrink-0">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>

          {/* Right Counters: Urgency Timer & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono font-black text-xs sm:text-sm tracking-wider shadow-sm transition-colors ${
                urgencyLevel === 'critical'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-400 animate-pulse-fast'
                  : urgencyLevel === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Sisa Waktu"
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formattedTime}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Mascot Encouragement Banner */}
        <div className="flex items-center justify-between mb-6">
          <DuolingoMascot
            mood={hasAnsweredCurrent ? 'happy' : 'thinking'}
            size="sm"
            message={
              hasAnsweredCurrent
                ? 'Pilihan bagus! Klik lanjutkan untuk soal berikutnya 🚀'
                : 'Pilih jawaban yang paling tepat menurutmu!'
            }
            bubbleSide="right"
          />

          <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-black text-indigo-600 dark:text-indigo-400">
            {subtestName}
          </span>
        </div>

        {/* Question Renderer */}
        <QuestionRenderer
          question={currentQuestion}
          currentAnswer={currentAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          isFlagged={flaggedSet.has(currentQuestionIndex)}
          onAnswer={(ans) => setAnswer(currentQuestion.id, ans)}
          onFlag={() => toggleFlag(currentQuestionIndex)}
          onPrevious={goPrevious}
          onNext={goNext}
          canPrevious={currentQuestionIndex > 0}
          canNext={currentQuestionIndex < totalQuestions - 1}
        />
      </main>

      {/* Duolingo Sticky Bottom Action Drawer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 py-3.5 sm:py-4 px-4 sm:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Left Buttons: Navigation Overview & Previous */}
          <div className="flex items-center gap-2">
            {/* Question Map Sheet Button */}
            <button
              type="button"
              onClick={() => {
                playPop();
                setNavModalOpen(true);
              }}
              className="h-12 px-3 sm:px-4 rounded-2xl duo-button-outline text-xs sm:text-sm font-bold flex items-center gap-2"
              title="Lihat Semua Soal"
            >
              <Grid className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Daftar Soal</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                {answeredCount}/{totalQuestions}
              </span>
            </button>

            {/* Previous Question Button */}
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  goPrevious();
                }}
                className="h-12 w-12 rounded-2xl duo-button-outline flex items-center justify-center text-slate-600 dark:text-slate-300"
                title="Soal Sebelumnya"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Right Action: Big Vibrant Duolingo Green Button */}
          <button
            type="button"
            onClick={handleContinue}
            className={`h-12 sm:h-14 px-6 sm:px-10 rounded-2xl text-xs sm:text-base font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              hasAnsweredCurrent
                ? 'duo-button-green shadow-indigo-500/25 animate-pop-in'
                : 'duo-button-outline text-slate-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
            }`}
          >
            <span>
              {isLastQuestion
                ? 'Selesai & Kumpulkan 🎉'
                : hasAnsweredCurrent
                ? 'Lanjutkan'
                : 'Lewati Soal'}
            </span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </footer>

      {/* Question Map / Navigator Modal */}
      <Dialog open={navModalOpen} onOpenChange={setNavModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="pr-10">
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-between gap-3">
              <span className="truncate">Daftar Soal {subtestName}</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold shrink-0">
                {answeredCount} Terjawab
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5 my-4 max-h-[320px] overflow-y-auto p-1">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = answeredIndices.has(index);
              const isFlagged = flaggedSet.has(index);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    playPop();
                    goToQuestion(index);
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
                  <span>{index + 1}</span>
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

      {/* Exit Test Modal */}
      <Dialog open={exitModalOpen} onOpenChange={setExitModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-center">
          <DuolingoMascot
            mood="thinking"
            size="md"
            message="Yakin ingin keluar? Jangan menyerah sekarang ya! 🦉"
            bubbleSide="top"
            className="flex-col mx-auto mb-4"
          />
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
            Keluar dari Latihan Soal?
          </DialogTitle>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Progres jawabanmu tersimpan, tetapi timer ujian tetap berjalan. Kamu bisa kembali kapan saja.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                playPop();
                router.push('/test');
              }}
              className="w-full h-12 rounded-2xl duo-button-outline text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center select-none"
            >
              Ya, Keluar
            </button>
            <button
              type="button"
              onClick={() => {
                playPop();
                setExitModalOpen(false);
              }}
              className="w-full h-12 rounded-2xl duo-button-green text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center select-none"
            >
              Lanjut Latihan
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duolingo Completion Modal */}
      <ConfirmSubmit
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
        onConfirm={handleManualSubmit}
      />

      <AutoSubmitWarning
        open={warningOpen}
        onOpenChange={setWarningOpen}
        minutesLeft={warningMinutes}
      />
    </div>
  );
}
