import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'id' | 'en';

type NestedTranslations = { [key: string]: string | NestedTranslations };

interface LanguageState {
  locale: Locale;
  translations: Record<string, any>;
  isLoading: boolean;
  setLocale: (locale: Locale) => void;
  loadTranslations: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Flat lookup for keys like 'common.login' or 'test.question_of'
function lookup(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'id',
      translations: {},
      isLoading: false,

      loadTranslations: async (locale: Locale) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`/locales/${locale}.json`);
          if (res.ok) {
            const data = await res.json();
            set({ translations: data, locale, isLoading: false });
          } else {
            set({ locale, isLoading: false });
          }
        } catch {
          set({ locale, isLoading: false });
        }
      },

      setLocale: (locale: Locale) => {
        set({ locale });
        get().loadTranslations(locale);
      },

      t: (key: string, params?: Record<string, string | number>) => {
        const { translations } = get();
        let value = lookup(translations, key);

        if (!value) {
          // If translation is not yet loaded, return friendly fallback from the key
          const lastPart = key.split('.').pop() || key;
          value = lastPart.replace(/_/g, ' ');
        }

        if (params) {
          for (const [pKey, pVal] of Object.entries(params)) {
            value = value.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
          }
        }

        return value;
      },
    }),
    {
      name: 'nexam-locale',
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loadTranslations(state.locale || 'id');
        }
      },
    }
  )
);
