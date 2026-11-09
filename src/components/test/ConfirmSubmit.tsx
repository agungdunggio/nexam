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
import { Send, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmSubmitProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting?: boolean;
  onConfirm: () => void;
}

export function ConfirmSubmit({
  open,
  onOpenChange,
  answeredCount,
  totalQuestions,
  isSubmitting = false,
  onConfirm,
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
                ? 'Luar biasa! Semua soal sudah berhasil kamu jawab! 🎉'
                : `Masih ada ${unansweredCount} soal yang belum dijawab nih!`
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
              : 'Kamu masih punya waktu untuk memeriksa soal-soal yang belum terisi.'}
          </DialogDescription>
        </DialogHeader>

        {/* Stats Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700/60 my-2 space-y-2">
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
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Belum Terjawab:
              </span>
              <span className="text-amber-500 font-black font-mono text-base">
                {unansweredCount}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons (Balanced 2-Column Layout) */}
        <div className="grid grid-cols-2 gap-3 pt-3">
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
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              playDing();
              onConfirm();
            }}
            className="w-full h-12 rounded-2xl duo-button-green text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-indigo-500/20 transition-all select-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghitung...</span>
              </>
            ) : (
              <>
                <span>Kumpulkan</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
