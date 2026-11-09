'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/stores/languageStore';
import {
  LayoutDashboard,
  FileSpreadsheet,
  History,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguageStore();

  const navItems = [
    {
      label: t('nav.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: t('nav.start_test'),
      href: '/test',
      icon: FileSpreadsheet,
      active: pathname.startsWith('/test'),
    },
    {
      label: 'Simulasi UTBK',
      href: '/test/utbk',
      icon: GraduationCap,
      active: pathname.startsWith('/test/utbk'),
    },
    {
      label: 'Tes TPA/TBS',
      href: '/test/tpa',
      icon: Sparkles,
      active: pathname.startsWith('/test/tpa'),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left fixed) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 shrink-0">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    item.active ? 'text-indigo-600 dark:text-indigo-400 scale-110' : ''
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Info card at bottom of sidebar */}
        <div className="mt-auto pt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent border border-indigo-200/50 dark:border-indigo-900/50">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UTBK 2026 Ready</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Format soal dan sistem penilaian telah disesuaikan dengan aturan SNBT terbaru.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                item.active
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
