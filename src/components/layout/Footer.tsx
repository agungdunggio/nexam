import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Logo showTagline />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Platform simulasi ujian masuk perguruan tinggi terbaik untuk persiapan UTBK-SNBT & TPA dengan sistem penilaian modern.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Beranda
          </Link>
          <Link href="/test" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Mulai Tes
          </Link>
          <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Dasbor
          </Link>
          <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Masuk
          </Link>
        </div>

        <div className="text-center md:text-right text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Nexam. Hak cipta dilindungi.</p>
          <p className="mt-0.5 text-[11px]">Didesain untuk masa depan calon mahasiswa Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
