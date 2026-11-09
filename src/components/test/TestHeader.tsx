'use client';

import { Timer } from './Timer';
import { Button } from '@/components/ui/button';
import { UrgencyLevel } from '@/stores/timerStore';
import { Send, GraduationCap } from 'lucide-react';
import { useLanguageStore } from '@/stores/languageStore';

interface TestHeaderProps {
  subtestName: string;
  subtestIcon?: string;
  formattedTime: string;
  urgencyLevel: UrgencyLevel;
  onSubmitClick: () => void;
  isSubmitting?: boolean;
}

export function TestHeader({
  subtestName,
  subtestIcon = '🧠',
  formattedTime,
  urgencyLevel,
  onSubmitClick,
  isSubmitting = false,
}: TestHeaderProps) {
  const { t } = useLanguageStore();

  return (
    <header className="sticky top-16 z-30 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0">{subtestIcon}</span>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {subtestName}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Simulasi Ujian Masuk Perguruan Tinggi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Timer formattedTime={formattedTime} urgencyLevel={urgencyLevel} />
          <Button
            size="sm"
            onClick={onSubmitClick}
            disabled={isSubmitting}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm shadow-emerald-500/20 gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('test.submit_test')}</span>
            <span className="sm:hidden">{t('common.submit')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
