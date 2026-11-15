import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * Custom 404 gallery surface pairing the classical oil-painted Nexi sanctuary
 * artwork with directional chiaroscuro scrims and editorial typography.
 */
export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0E0B09] text-[#F5EDE0] flex flex-col justify-between selection:bg-[#E2C285]/30 selection:text-[#FAF4E8]">
      {/* Full-bleed classical oil painting canvas */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <Image
          src="/images/not-found-sanctuary.jpg"
          alt="Lukisan minyak klasik maskot Nexam Nexi di ruang arsip diterangi lilin, menunjuk pintu lengkung menuju jalan pulang yang aman"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_30%] sm:object-[72%_center] lg:object-center"
        />
      </div>

      {/* Directional chiaroscuro scrim for legibility without floating boxes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(14, 11, 9, 0.42) 0%, rgba(14, 11, 9, 0.28) 32%, rgba(14, 11, 9, 0.78) 64%, rgba(14, 11, 9, 0.94) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(14, 11, 9, 0.88) 0%, rgba(14, 11, 9, 0.64) 34%, rgba(14, 11, 9, 0.18) 58%, rgba(14, 11, 9, 0) 80%)',
        }}
      />

      {/* Restrained archival brand mark */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-7 sm:pt-9">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[#EAE0CF]/90 hover:text-[#FAF4E8] transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0E0B09]"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-[#E2C285]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span className="font-serif text-lg font-medium tracking-[-0.01em]">
            Nexam
          </span>
        </Link>
      </header>

      {/* Primary editorial message anchored in the quiet left shadow zone */}
      <section
        aria-labelledby="not-found-heading"
        className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-end lg:items-center pb-10 pt-24 sm:pb-14 lg:py-16"
      >
        <div className="max-w-lg">
          <p
            aria-hidden="true"
            className="font-serif text-7xl sm:text-8xl lg:text-[6rem] font-normal leading-none tracking-[-0.04em] text-[#F5EDE0]"
          >
            404
          </p>

          <h1
            id="not-found-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-[2.125rem] font-normal tracking-[-0.02em] leading-[1.2] text-[#F5EDE0] text-balance mt-6 mb-3"
          >
            Ruang arsip ini tidak ditemukan.
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-[#D8CEBE] max-w-[44ch] mb-8">
            Halaman yang kamu cari sudah dipindahkan atau memang tidak tercatat di sini. Biar Nexi antar kembali ke tempat yang aman.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-lg bg-[#F2E9DA] hover:bg-[#FAF4E8] text-[#17120D] border border-[#FAF4E8]/40 text-sm font-medium tracking-[-0.01em] shadow-[0_12px_28px_-8px_rgba(0,0,0,0.65)] transition-colors duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0B09]"
            >
              <ShieldCheck className="w-4 h-4 text-[#6B4E1B]" aria-hidden="true" />
              <span>Kembali ke Tempat Aman</span>
            </Link>

            <Link
              href="/test"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg bg-[#16120E]/65 hover:bg-[#221B15]/85 text-[#EAE0CF] hover:text-[#FAF4E8] border border-[#D8CEBE]/30 hover:border-[#E2C285]/55 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0B09]"
            >
              <span>Masuk ke Simulasi</span>
              <ArrowRight className="w-4 h-4 text-[#D8CEBE]/80" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
