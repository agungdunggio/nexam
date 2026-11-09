import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden gradient-hero p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-indigo-500/20">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-900/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gratis & Tanpa Batas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Siap Menghadapi Ujian Masuk Kampus Impian?
          </h2>

          <p className="text-base sm:text-lg text-indigo-100 mb-8 leading-relaxed">
            Tingkatkan peluang lolos PTN favoritmu dengan simulasi terstruktur, analisis kelemahan per materi, dan latihan konsisten.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/test" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white hover:bg-slate-100 text-indigo-600 font-bold text-sm shadow-lg shadow-black/10 transition-transform hover:scale-105 gap-2"
              >
                <span>Mulai Latihan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/30 text-white hover:bg-white/10 font-semibold text-sm transition-all"
              >
                Masuk / Buat Akun
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
