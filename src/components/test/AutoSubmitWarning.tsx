'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface AutoSubmitWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  minutesLeft: number;
}

export function AutoSubmitWarning({
  open,
  onOpenChange,
  minutesLeft,
}: AutoSubmitWarningProps) {
  const { t } = useLanguageStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <DialogHeader className="text-left space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 flex items-center justify-center mb-1 animate-bounce">
            <Clock className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white">
            {t('test.time_warning', { minutes: minutesLeft })}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t('test.time_warning_desc')} Sesi tes akan dikumpulkan secara otomatis jika timer mencapai 00:00.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl text-xs font-bold h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            Lanjutkan Ujian
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
