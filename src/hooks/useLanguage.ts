'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';

export function useLanguage() {
  const { locale, setLocale, t, loadTranslations, isLoading } = useLanguageStore();

  useEffect(() => {
    loadTranslations(locale);
  }, [locale, loadTranslations]);

  return {
    locale,
    setLocale,
    t,
    isLoading,
  };
}
