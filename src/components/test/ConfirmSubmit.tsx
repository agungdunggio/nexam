'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { playDing, playFanfare, playPop } from '@/lib/soundEffects';
import { TestType } from '@/types/test';
import { Send, Loader2, CheckCircle2, AlertTriangle, ArrowRight, Bookmark } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmSubmitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting?: boolean;
  onConfirm: () => void;
  unansweredNumbers?: number[];
  flaggedNumbers?: number[];
  testType?: TestType;
  onJumpToQuestion?: (questionNumber: number) => void;
}

export function ConfirmSubmit({
  open,
  onOpenChange,
  answeredCount,
  totalQuestions,
  isSubmitting = false,
  onConfirm,
  unansweredNumbers = [],
  flaggedNumbers = [],
  testType,
  onJumpToQuestion,
}: ConfirmSubmitProps) {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const isComplete = unansweredCount === 0;

  useEffect(() => {
    if (open) {
      if (isComplete) {
        playFanfare();
      } else {
        playDing();
      }
    }
  }, [open, isComplete]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="text-center items-center space-y-3">
          <DuolingoMascot
            mood={isComplete ? 'cheering' : 'thinking'}
            size="md"
            message={
              isComplete
                ? 'Semua soal pada subtes ini telah selesai kamu jawab.'
                : `Masih ada ${unansweredCount} soal yang belum dijawab.`
            }
            bubbleSide="top"
            className="flex-col"
          />

          <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isComplete ? 'Siap Kumpulkan Jawaban?' : 'Kumpulkan Sekarang?'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isComplete
              ? 'Skor dan analisis pembahasan lengkap akan langsung dihitung.'
              : testType === 'tpa'
              ? 'TPA menerapkan sistem minus (-1 untuk jawaban salah). Kamu boleh mengosongkan soal yang tidak yakin atau memeriksanya lagi.'
              : testType === 'utbk'
              ? 'Di UTBK tidak ada pengurangan nilai untuk jawaban salah. Sebaiknya isi semua soal sebelum mengumpulkan.'
              : 'Kamu masih punya waktu untuk memeriksa soal-soal yang belum terisi.'}
          </DialogDescription>
        </DialogHeader>

        {/* Stats Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 my-2 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Soal Dijawab:
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black font-mono text-base">
              {answeredCount} / {totalQuestions}
            </span>
          </div>

          {unansweredCount > 0 && (
            <div className="space-y-2 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Belum Terjawab:
                </span>
                <span className="text-amber-500 font-black font-mono text-base">
                  {unansweredCount}
                </span>
              </div>

              {unansweredNumbers.length > 0 && onJumpToQuestion && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {unansweredNumbers.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        playPop();
                        onJumpToQuestion(num);
                        onOpenChange(false);
                      }}
                      className="h-7 min-w-[34px] px-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono text-xs font-black text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                    >
                      #{num}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {flaggedNumbers.length > 0 && onJumpToQuestion && (
            <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Ditandai ragu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {flaggedNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      playPop();
                      onJumpToQuestion(num);
                      onOpenChange(false);
                    }}
                    className="h-7 min-w-[34px] px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-black text-slate-700 dark:text-slate-300 hover:border-amber-400 transition-colors"
                  >
                    #{num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons (Balanced 2-Column Layout) */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          {unansweredNumbers.length > 0 && onJumpToQuestion ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                playPop();
                onJumpToQuestion(unansweredNumbers[0]);
                onOpenChange(false);
              }}
              className="w-full h-12 rounded-2xl duo-button-green text-xs sm:text-sm font-black flex items-center justify-center transition-all select-none"
            >
              <span>Isi Soal #{unansweredNumbers[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                playPop();
                onOpenChange(false);
              }}
              className="w-full h-12 rounded-2xl duo-button-outline text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all select-none hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>Periksa Lagi</span>
            </button>
          )}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              playDing();
              onConfirm();
            }}
            className={`w-full h-12 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all select-none ${
              unansweredNumbers.length > 0 && onJumpToQuestion
                ? 'duo-button-outline text-slate-700 dark:text-slate-200'
                : 'duo-button-green shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghitung...</span>
              </>
            ) : (
              <>
                <span>{unansweredCount > 0 ? 'Tetap Kumpul' : 'Kumpulkan'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
