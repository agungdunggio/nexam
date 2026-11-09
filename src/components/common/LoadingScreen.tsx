'use client';

import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export function LoadingScreen({
  message = 'Memuat...',
  fullscreen = false,
}: LoadingScreenProps) {
  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md'
    : 'min-h-[50vh] flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-14 h-14 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 animate-ping" />
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
}
