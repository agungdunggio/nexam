'use client';

import React from 'react';

interface DuolingoMascotProps {
  mood?: 'happy' | 'thinking' | 'cheering' | 'talking';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  bubbleSide?: 'top' | 'right' | 'left';
}

export function DuolingoMascot({
  mood = 'happy',
  message,
  size = 'md',
  className = '',
  bubbleSide = 'right',
}: DuolingoMascotProps) {
  const [use3D, setUse3D] = React.useState(true);

  const sizeMap = {
    sm: { w: 72, h: 72, text: 'text-xs' },
    md: { w: 108, h: 108, text: 'text-sm' },
    lg: { w: 144, h: 144, text: 'text-base' },
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center gap-4 select-none ${
        bubbleSide === 'left'
          ? 'flex-row-reverse'
          : bubbleSide === 'top'
          ? 'flex-col'
          : 'flex-row'
      } ${className}`}
    >
      {/* 3D Character Mascot Container */}
      <div
        className="relative shrink-0 rounded-3xl overflow-hidden border-2 border-indigo-200/90 dark:border-indigo-800/90 shadow-lg shadow-indigo-500/10 bg-white dark:bg-slate-800 flex items-center justify-center p-1"
        style={{ width: dim.w, height: dim.h }}
      >
        {use3D ? (
          <img
            src="/images/nexi_mascot.jpg"
            alt="Nexi the Scholar Owl"
            width={dim.w}
            height={dim.h}
            className="w-full h-full object-cover rounded-[20px] select-none"
            onError={() => setUse3D(false)}
          />
        ) : (
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            {/* Shadow */}
            <ellipse cx="60" cy="112" rx="36" ry="6" fill="#cbd5e1" opacity="0.6" />

            {/* Feet */}
            <ellipse cx="46" cy="106" rx="9" ry="5" fill="#f59e0b" />
            <ellipse cx="74" cy="106" rx="9" ry="5" fill="#f59e0b" />

            {/* Body */}
            <rect
              x="24"
              y="32"
              width="72"
              height="76"
              rx="36"
              fill="#6366F1"
              stroke="#4338CA"
              strokeWidth="3.5"
            />
            <ellipse cx="60" cy="74" rx="22" ry="26" fill="#C7D2FE" />

            {/* Rest wings */}
            <ellipse cx="24" cy="68" rx="6" ry="16" fill="#4F46E5" transform="rotate(12 24 68)" />
            <ellipse cx="96" cy="68" rx="6" ry="16" fill="#4F46E5" transform="rotate(-12 96 68)" />

            {/* Eyes */}
            <circle cx="44" cy="56" r="14" fill="#ffffff" />
            <circle cx="76" cy="56" r="14" fill="#ffffff" />
            <circle cx="46" cy="56" r="7.5" fill="#1e293b" />
            <circle cx="78" cy="56" r="7.5" fill="#1e293b" />
            <circle cx="48" cy="53" r="2.8" fill="#ffffff" />
            <circle cx="80" cy="53" r="2.8" fill="#ffffff" />

            {/* Beak */}
            <polygon points="60,63 53,73 67,73" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />

            {/* Graduation Cap */}
            <path d="M60 14 L28 26 L60 38 L92 26 Z" fill="#4F46E5" stroke="#3730A3" strokeWidth="2.5" />
            <circle cx="60" cy="26" r="2.5" fill="#FBBF24" />
          </svg>
        )}
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative max-w-xs sm:max-w-md bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm text-slate-800 dark:text-slate-100 font-bold tracking-tight">
          {/* Bubble Arrow */}
          <div
            className={`absolute w-3.5 h-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transform rotate-45 ${
              bubbleSide === 'left'
                ? 'top-1/2 -translate-y-1/2 -right-2 border-t-2 border-r-2'
                : bubbleSide === 'top'
                ? '-bottom-2 left-1/2 -translate-x-1/2 border-b-2 border-r-2'
                : 'top-1/2 -translate-y-1/2 -left-2 border-b-2 border-l-2'
            }`}
          />
          <p className={`${dim.text} leading-snug relative z-10`}>{message}</p>
        </div>
      )}
    </div>
  );
}

