'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Logo } from '@/components/common/Logo';
import { IconNexamOwl } from '@/components/icons/SubtestIcons';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { isSoundEnabled, setSoundEnabled, playPop } from '@/lib/soundEffects';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Volume2, VolumeX, BookOpen, GraduationCap } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname?.startsWith('/login');
  const { user, isLoggedIn, logout } = useAuthStore();
  const [soundOn, setSoundOn] = useState(true);

  const isSimulation = pathname?.startsWith('/simulation');
  const isPractice = pathname?.startsWith('/test') || pathname?.startsWith('/results');

  const currentMode = isSimulation
    ? {
        label: 'Simulasi UTBK',
        shortLabel: 'Simulasi',
        icon: <GraduationCap className="w-3.5 h-3.5" />,
      }
    : isPractice
    ? {
        label: 'Latihan Soal',
        shortLabel: 'Latihan',
        icon: <BookOpen className="w-3.5 h-3.5" />,
      }
    : null;

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playPop();
  };

  const homeHref = isLoggedIn ? '/test' : '/login';

  return (
    <header className="sticky top-0 z-40 w-full glass border-b-2 border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href={homeHref} className="flex items-center gap-2.5 select-none group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/icons/nexam_owl_logo.jpg"
                alt="Nexam Owl"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Nexam
              </span>
              {currentMode && (
                <>
                  <span className="text-slate-300 dark:text-slate-700 font-semibold text-sm">/</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                    {currentMode.icon}
                    <span>{currentMode.label}</span>
                  </span>
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <ThemeToggle />

          {!isAuthPage && (
            isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-3 py-1 h-9 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer outline-none transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate text-slate-800 dark:text-slate-200">
                    {user.name}
                  </span>
                  {currentMode && (
                    <span className="hidden md:inline-flex text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                      {currentMode.shortLabel}
                    </span>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 shadow-xl">
                  <DropdownMenuLabel className="font-normal px-2.5 py-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-none truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Pilih Mode
                  </div>
                  <DropdownMenuItem
                    className={`cursor-pointer rounded-xl text-xs p-0 transition-colors ${
                      isSimulation
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-black'
                        : 'focus:bg-indigo-50 dark:focus:bg-indigo-950/60 focus:text-indigo-600 dark:focus:text-indigo-300'
                    }`}
                  >
                    <Link
                      href="/simulation"
                      className="flex items-center justify-between w-full px-3 py-2.5 font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GraduationCap
                          className={`w-4 h-4 shrink-0 ${
                            isSimulation
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        />
                        <span
                          className={
                            isSimulation
                              ? 'text-indigo-600 dark:text-indigo-300 font-black'
                              : 'text-slate-700 dark:text-slate-200'
                          }
                        >
                          Simulasi UTBK Penuh
                        </span>
                      </div>
                      {isSimulation && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shrink-0 ml-2">
                          Aktif
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={`cursor-pointer rounded-xl text-xs p-0 transition-colors ${
                      isPractice
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-black'
                        : 'focus:bg-indigo-50 dark:focus:bg-indigo-950/60 focus:text-indigo-600 dark:focus:text-indigo-300'
                    }`}
                  >
                    <Link
                      href="/test"
                      className="flex items-center justify-between w-full px-3 py-2.5 font-bold transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <BookOpen
                          className={`w-4 h-4 shrink-0 ${
                            isPractice
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        />
                        <span
                          className={
                            isPractice
                              ? 'text-indigo-600 dark:text-indigo-300 font-black'
                              : 'text-slate-700 dark:text-slate-200'
                          }
                        >
                          Latihan Soal
                        </span>
                      </div>
                      {isPractice && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shrink-0 ml-2">
                          Aktif
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                  <DropdownMenuItem
                    onClick={async () => {
                      playPop();
                      await logout();
                    }}
                    className="cursor-pointer rounded-xl text-xs px-3 py-2.5 text-rose-600 dark:text-rose-400 font-bold focus:bg-rose-50 dark:focus:bg-rose-950/50 focus:text-rose-700 dark:focus:text-rose-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Keluar Akun</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl duo-button-green text-xs font-extrabold uppercase"
              >
                Masuk
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
