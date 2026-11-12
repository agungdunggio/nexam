'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { DuolingoMascot } from '@/components/common/DuolingoMascot';
import { playDing, playPop } from '@/lib/soundEffects';
import { ArrowRight, Sparkles, Loader2, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Auto redirect if user is already authenticated
  useEffect(() => {
    if (isLoggedIn && user) {
      router.replace('/test');
    }
  }, [isLoggedIn, user, router]);

  // Don't render login card if user is logged in (avoid flashing login form)
  if (isLoggedIn && user) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Mengalihkan ke beranda ujian...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Tulis nama kamu dulu yuk!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Masukkan alamat email yang valid ya!');
      return;
    }

    playPop();
    const success = await login(name.trim(), email.trim());
    if (success) {
      playDing();
      router.push('/test');
    } else {
      setError('Gagal masuk. Silakan coba lagi.');
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    playPop();
    const demoName = 'Pejuang PTN';
    const demoEmail = `pejuang_${Math.floor(Math.random() * 1000)}@nexam.id`;
    setName(demoName);
    setEmail(demoEmail);

    const success = await login(demoName, demoEmail);
    if (success) {
      playDing();
      router.push('/test');
    } else {
      setError('Gagal masuk sebagai tamu.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 sm:py-10 px-4">
      {/* Duolingo Mascot Hero Greeting */}
      <div className="flex flex-col items-center text-center mb-8">
        <DuolingoMascot
          mood="cheering"
          size="lg"
          message="Siap mulai latihan UTBK dan TPA hari ini? Pilih jalur ujian dan uji kemampuanmu."
          bubbleSide="top"
          className="mb-4 flex-col"
        />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
          Selamat Datang di Nexam!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Simulasi ujian masuk perguruan tinggi dengan evaluasi nilai instan dan analisis mendalam.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 border-b-6 shadow-xl shadow-indigo-500/5">
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-600 dark:text-rose-400 animate-pop-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Email Aktif
            </label>
            <input
              id="email"
              type="email"
              placeholder="Contoh: budi@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl duo-button-green text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyiapkan Soal...</span>
                </>
              ) : (
                <>
                  <span>Mulai Latihan Sekarang</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            atau coba langsung
          </span>
        </div>

        {/* 1-Click Guest / Instant Start */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full h-12 rounded-2xl duo-button-outline text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Masuk Langsung Sebagai Tamu (1-Klik)</span>
        </button>

        <p className="mt-5 text-center text-[11px] font-medium text-slate-400">
          Akses simulasi langsung tanpa kata sandi. Skor dan riwayat pengerjaan tersimpan otomatis.
        </p>
      </div>
    </div>
  );
}
