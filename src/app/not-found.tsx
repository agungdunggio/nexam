import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="mb-6">
        <Logo />
      </div>

      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 text-2xl font-mono font-bold shadow-sm">
        404
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Halaman Tidak Ditemukan
      </h1>

      <p className="text-sm text-slate-500 max-w-md mb-8">
        Halaman yang kamu tuju tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda atau dasbor simulasi.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" className="rounded-xl text-xs font-semibold gap-1.5 h-11 px-5">
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Button>
        </Link>
        <Link href="/test">
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 h-11 px-6 shadow-md shadow-indigo-500/20">
            <span>Mulai Simulasi</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
