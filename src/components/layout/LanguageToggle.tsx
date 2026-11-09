'use client';

import { useLanguageStore } from '@/stores/languageStore';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-9 px-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5 inline-flex items-center justify-center cursor-pointer transition-colors border-0 outline-none"
        aria-label="Toggle language"
      >
        <Languages className="w-3.5 h-3.5 text-indigo-500" />
        <span className="uppercase">{locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => setLocale('id')}
          className={`cursor-pointer text-xs font-medium py-2 rounded-lg flex items-center justify-between ${
            locale === 'id' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        >
          <span>🇮🇩 Indonesia</span>
          {locale === 'id' && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          className={`cursor-pointer text-xs font-medium py-2 rounded-lg flex items-center justify-between ${
            locale === 'en' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        >
          <span>🇬🇧 English</span>
          {locale === 'en' && <span className="text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
