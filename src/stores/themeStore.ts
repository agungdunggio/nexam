import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      initTheme: () => {
        const currentTheme = get().theme;
        const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme;
        set({ resolvedTheme: resolved });
        applyThemeToDOM(resolved);

        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const listener = (e: MediaQueryListEvent) => {
            if (get().theme === 'system') {
              const nextResolved = e.matches ? 'dark' : 'light';
              set({ resolvedTheme: nextResolved });
              applyThemeToDOM(nextResolved);
            }
          };
          mediaQuery.addEventListener('change', listener);
        }
      },

      setTheme: (theme: Theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        set({ theme, resolvedTheme: resolved });
        applyThemeToDOM(resolved);
      },

      toggleTheme: () => {
        const nextResolved: ResolvedTheme = get().resolvedTheme === 'dark' ? 'light' : 'dark';
        set({ theme: nextResolved, resolvedTheme: nextResolved });
        applyThemeToDOM(nextResolved);
      },
    }),
    {
      name: 'nexam-theme',
    }
  )
);
