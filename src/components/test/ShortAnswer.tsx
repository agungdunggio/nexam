'use client';

import { X, Hash } from 'lucide-react';
import { playPop } from '@/lib/soundEffects';

interface ShortAnswerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function ShortAnswer({
  value,
  onChange,
  placeholder = 'Ketik jawaban angka di sini...',
}: ShortAnswerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || /^-?[\d.,]*$/.test(raw)) {
      onChange(raw);
    }
  };

  const handleClear = () => {
    playPop();
    onChange('');
  };

  return (
    <div className="space-y-3 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-4 border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        <Hash className="w-4 h-4 stroke-[3]" />
        <span>Jawaban Isian Singkat</span>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-14 px-5 text-lg font-mono font-black pr-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-b-4 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 focus:border-b-indigo-800 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-700 hover:bg-slate-300 transition-colors"
            title="Hapus jawaban"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        )}
      </div>
      <p className="text-xs font-semibold text-slate-400">
        💡 Masukkan angka bulat atau desimal (contoh: 42 atau 3.5).
      </p>
    </div>
  );
}
