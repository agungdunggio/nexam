import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Penalaran Umum — 3D Glossy Brain with Sparks
export function IconPenalaranUmum({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brainLeft" x1="12" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="0.6" stopColor="#EC4899" />
          <stop offset="1" stopColor="#BE185D" />
        </linearGradient>
        <linearGradient id="brainRight" x1="32" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="0.6" stopColor="#F43F5E" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="brainGloss" x1="20" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id="brainGlow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#BE185D" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#brainGlow)">
        {/* Left Hemisphere */}
        <path
          d="M30 18C26 14 18 15 15 21C11 25 10 32 14 37C11 41 13 48 18 50C22 52 28 50 30 46V18Z"
          fill="url(#brainLeft)"
        />
        {/* Right Hemisphere */}
        <path
          d="M34 18C38 14 46 15 49 21C53 25 54 32 50 37C53 41 51 48 46 50C42 52 36 50 34 46V18Z"
          fill="url(#brainRight)"
        />
        {/* Brain folds & creases */}
        <path
          d="M17 26C20 28 25 24 29 27M14 34C19 33 22 38 29 36M18 43C22 41 26 44 29 42"
          stroke="#9D174D"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M47 26C44 28 39 24 35 27M50 34C45 33 42 38 35 36M46 43C42 41 38 44 35 42"
          stroke="#9F1239"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Center Split */}
        <path d="M32 16V48" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
        {/* Gloss highlight */}
        <ellipse cx="21" cy="20" rx="4" ry="2.5" transform="rotate(-25 21 20)" fill="url(#brainGloss)" />
        <ellipse cx="43" cy="20" rx="4" ry="2.5" transform="rotate(25 43 20)" fill="url(#brainGloss)" />
        {/* Intellect spark stars */}
        <path d="M54 13L55.5 17L59.5 18.5L55.5 20L54 24L52.5 20L48.5 18.5L52.5 17L54 13Z" fill="#FBBF24" />
        <circle cx="10" cy="18" r="2" fill="#FBBF24" />
      </g>
    </svg>
  );
}

// 2. Penalaran Matematika — 3D Set Square Ruler & Compass
export function IconPenalaranMatematika({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="rulerGrad" x1="10" y1="52" x2="52" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="rulerInner" x1="20" y1="44" x2="44" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#E0E7FF" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* 3D Triangle Ruler Bottom Shadow */}
      <polygon points="12,54 54,54 12,12" fill="#1E3A8A" opacity="0.4" />
      {/* 3D Triangle Body */}
      <polygon points="10,50 50,50 10,10" fill="url(#rulerGrad)" stroke="#1E40AF" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Hollow Center Triangle */}
      <polygon points="18,44 40,44 18,22" fill="#F8FAFC" stroke="#1E40AF" strokeWidth="2" strokeLinejoin="round" />
      {/* Ruler Tick Marks */}
      <line x1="14" y1="50" x2="14" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="50" x2="20" y2="47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="50" x2="26" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="50" x2="32" y2="47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="50" x2="38" y2="45" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="50" x2="44" y2="47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="42" x2="15" y2="42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="34" x2="14" y2="34" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="26" x2="15" y2="26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="18" x2="14" y2="18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Golden Compass divider accent */}
      <circle cx="48" cy="20" r="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <path d="M48 20L56 36M48 20L42 34" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 3. Literasi Bahasa Indonesia — 3D Open Book with Merah Putih Ribbon
export function IconLiterasiIndonesia({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bookCover" x1="8" y1="46" x2="56" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338CA" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="pageLeft" x1="12" y1="20" x2="32" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="pageRight" x1="32" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
      {/* Book Cover Base */}
      <path
        d="M8 42C16 38 28 38 32 44C36 38 48 38 56 42V48C48 44 36 44 32 50C28 44 16 44 8 48V42Z"
        fill="url(#bookCover)"
        stroke="#312E81"
        strokeWidth="2.5"
      />
      {/* Pages Left */}
      <path
        d="M10 22C18 18 28 19 32 24V43C28 38 18 37 10 41V22Z"
        fill="url(#pageLeft)"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Pages Right */}
      <path
        d="M54 22C46 18 36 19 32 24V43C36 38 46 37 54 41V22Z"
        fill="url(#pageRight)"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Text lines preview */}
      <line x1="14" y1="26" x2="27" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="31" x2="26" y2="33" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="36" x2="24" y2="38" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="28" x2="50" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="33" x2="50" y2="31" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="38" x2="50" y2="36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      {/* Indonesian Ribbon Bookmark (Merah Putih) */}
      <path d="M30 18L32 15L34 18V38L32 35L30 38V18Z" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
      <rect x="30" y="24" width="4" height="6" fill="#FFFFFF" />
    </svg>
  );
}

// 4. Literasi Bahasa Inggris — 3D Cute Cartoon Globe
export function IconLiterasiInggris({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="globeOcean" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="globeStand" x1="24" y1="48" x2="40" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Stand Base */}
      <ellipse cx="32" cy="54" rx="14" ry="4" fill="url(#globeStand)" stroke="#B45309" strokeWidth="2" />
      <path d="M32 46V53" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
      {/* Arc Arm */}
      <path
        d="M18 36C18 43 24 49 32 49C40 49 46 43 46 36"
        stroke="#D97706"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ocean Sphere */}
      <circle cx="32" cy="28" r="17" fill="url(#globeOcean)" stroke="#0369A1" strokeWidth="2.5" />
      {/* Continents (Stylized Green landmasses) */}
      <path
        d="M26 18C28 17 33 20 33 23C33 26 30 28 27 28C24 28 23 23 26 18Z"
        fill="#4ADE80"
      />
      <path
        d="M37 25C41 23 44 26 44 29C44 32 39 34 37 32C35 30 35 27 37 25Z"
        fill="#22C55E"
      />
      <path
        d="M24 33C27 32 30 35 29 39C28 42 24 42 23 39C22 36 22 34 24 33Z"
        fill="#16A34A"
      />
      {/* Globe Meridian Latitude Grid Lines */}
      <ellipse cx="32" cy="28" rx="7" ry="17" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
      <line x1="15" y1="28" x2="49" y2="28" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* Gloss */}
      <ellipse cx="27" cy="18" rx="4" ry="2" transform="rotate(-35 27 18)" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

// 5. Pengetahuan Kuantitatif — 3D Ascending Bar Chart & Star
export function IconPengetahuanKuantitatif({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bar1" x1="12" y1="36" x2="22" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="bar2" x1="26" y1="26" x2="36" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="bar3" x1="40" y1="16" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Base Grid Line */}
      <path d="M8 52H56" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      {/* Bar 1 (Short) */}
      <rect x="12" y="36" width="10" height="16" rx="3" fill="url(#bar1)" stroke="#5B21B6" strokeWidth="2" />
      {/* Bar 2 (Medium) */}
      <rect x="26" y="26" width="10" height="26" rx="3" fill="url(#bar2)" stroke="#3730A3" strokeWidth="2" />
      {/* Bar 3 (Tall) */}
      <rect x="40" y="16" width="10" height="36" rx="3" fill="url(#bar3)" stroke="#065F46" strokeWidth="2" />
      {/* Rising Trend Arrow */}
      <path
        d="M14 30L27 20L39 23L48 10"
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="46,7 52,10 49,15" fill="#F59E0B" />
      {/* Top Gold Star on Tallest Bar */}
      <path
        d="M45 7L46.5 10.5L50 11L47.5 13.5L48 17L45 15.5L42 17L42.5 13.5L40 11L43.5 10.5L45 7Z"
        fill="#FBBF24"
      />
    </svg>
  );
}

// 6. Pemahaman Bacaan & Menulis — 3D Fountain Pen & Notepad
export function IconPemahamanBacaanMenulis({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="padGrad" x1="12" y1="12" x2="42" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="penBody" x1="38" y1="12" x2="52" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.7" stopColor="#D97706" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Notepad */}
      <rect x="12" y="14" width="30" height="38" rx="5" fill="url(#padGrad)" stroke="#94A3B8" strokeWidth="2.5" />
      {/* Binding Rings */}
      <circle cx="18" cy="14" r="2.5" fill="#64748B" />
      <circle cx="27" cy="14" r="2.5" fill="#64748B" />
      <circle cx="36" cy="14" r="2.5" fill="#64748B" />
      {/* Writing lines on pad */}
      <line x1="17" y1="24" x2="35" y2="24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="30" x2="33" y2="30" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="36" x2="36" y2="36" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="42" x2="28" y2="42" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      {/* 3D Stylus / Fountain Pen */}
      <g transform="rotate(-30 44 32)">
        {/* Pen Barrel */}
        <rect x="42" y="10" width="8" height="28" rx="2" fill="url(#penBody)" stroke="#92400E" strokeWidth="2" />
        <rect x="42" y="32" width="8" height="4" fill="#FDE68A" />
        {/* Pen Nib */}
        <polygon points="42,38 50,38 46,47" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
        <line x1="46" y1="38" x2="46" y2="44" stroke="#78350F" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 7. Tes Verbal — 3D Speech Bubbles with 'Aa'
export function IconVerbal({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bubbleBig" x1="10" y1="12" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="bubbleSmall" x1="32" y1="26" x2="56" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C084FC" />
          <stop offset="1" stopColor="#9333EA" />
        </linearGradient>
      </defs>
      {/* Small Back Bubble */}
      <path
        d="M32 30C32 24.5 37.4 20 44 20C50.6 20 56 24.5 56 30C56 35.5 50.6 40 44 40C42 40 40 39.5 38 38.5L33 42L34.5 37C33 35 32 32.5 32 30Z"
        fill="url(#bubbleSmall)"
        stroke="#6B21A8"
        strokeWidth="2"
      />
      <text x="44" y="33" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        a
      </text>
      {/* Big Front Bubble */}
      <path
        d="M10 24C10 16.3 17.6 10 27 10C36.4 10 44 16.3 44 24C44 31.7 36.4 38 27 38C24.2 38 21.6 37.3 19 36L12 41L14 34C11.5 31.3 10 27.8 10 24Z"
        fill="url(#bubbleBig)"
        stroke="#3730A3"
        strokeWidth="2.5"
      />
      <text x="27" y="29" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        A
      </text>
      {/* Gloss */}
      <ellipse cx="20" cy="16" rx="4" ry="2" transform="rotate(-20 20 16)" fill="#FFFFFF" opacity="0.6" />
    </svg>
  );
}

// 8. Tes Numerik — 3D Playful Number Blocks (1, 2, 3)
export function IconNumerik({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cubeRed" x1="10" y1="28" x2="26" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F87171" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="cubeBlue" x1="36" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="cubeYellow" x1="23" y1="10" x2="39" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Block 1 (Bottom Left) */}
      <rect x="10" y="32" width="20" height="20" rx="4" fill="url(#cubeRed)" stroke="#991B1B" strokeWidth="2.5" />
      <text x="20" y="47" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        1
      </text>
      {/* Block 2 (Bottom Right) */}
      <rect x="34" y="32" width="20" height="20" rx="4" fill="url(#cubeBlue)" stroke="#1E40AF" strokeWidth="2.5" />
      <text x="44" y="47" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        2
      </text>
      {/* Block 3 (Top Center) */}
      <rect x="22" y="10" width="20" height="20" rx="4" fill="url(#cubeYellow)" stroke="#B45309" strokeWidth="2.5" />
      <text x="32" y="25" fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        3
      </text>
    </svg>
  );
}

// 9. Tes Figural — 3D Floating Geometric Shapes
export function IconFigural({ className = 'w-10 h-10', size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cubeTop" x1="14" y1="34" x2="34" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="14" y1="34" x2="24" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="24" y1="52" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338CA" />
          <stop offset="1" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="sphereGrad" x1="40" y1="14" x2="56" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="1" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id="pyramidGrad" x1="36" y1="36" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* 3D Isometric Cube */}
      <polygon points="24,24 34,29 24,34 14,29" fill="url(#cubeTop)" stroke="#312E81" strokeWidth="1.5" />
      <polygon points="14,29 24,34 24,48 14,43" fill="url(#cubeLeft)" stroke="#312E81" strokeWidth="1.5" />
      <polygon points="24,34 34,29 34,43 24,48" fill="url(#cubeRight)" stroke="#312E81" strokeWidth="1.5" />

      {/* Floating 3D Sphere */}
      <circle cx="46" cy="22" r="10" fill="url(#sphereGrad)" stroke="#9D174D" strokeWidth="2" />
      <ellipse cx="43" cy="18" rx="3" ry="1.5" transform="rotate(-30 43 18)" fill="#FFFFFF" opacity="0.75" />

      {/* 3D Floating Tetrahedron / Cone */}
      <polygon points="46,36 38,52 54,52" fill="url(#pyramidGrad)" stroke="#065F46" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="46,36 46,52 54,52" fill="#047857" opacity="0.4" />
    </svg>
  );
}

// 10. Nexam Owl Icon for Navbar Logo
export function IconNexamOwl({ className = 'w-6 h-6', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <rect x="10" y="16" width="44" height="42" rx="20" fill="#6366F1" stroke="#4338CA" strokeWidth="3" />
      {/* Belly */}
      <ellipse cx="32" cy="44" rx="14" ry="12" fill="#C7D2FE" />
      {/* Big Eyes */}
      <circle cx="23" cy="32" r="8" fill="#FFFFFF" />
      <circle cx="41" cy="32" r="8" fill="#FFFFFF" />
      <circle cx="24" cy="32" r="4.5" fill="#1E293B" />
      <circle cx="42" cy="32" r="4.5" fill="#1E293B" />
      <circle cx="25" cy="30" r="1.5" fill="#FFFFFF" />
      <circle cx="43" cy="30" r="1.5" fill="#FFFFFF" />
      {/* Beak */}
      <polygon points="32,35 28,42 36,42" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      {/* Graduation Cap */}
      <polygon points="32,6 12,14 32,22 52,14" fill="#4338CA" stroke="#312E81" strokeWidth="2" />
      <circle cx="32" cy="14" r="1.5" fill="#FBBF24" />
      <path d="M32 14 Q44 16 46 24" stroke="#FBBF24" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Map helper to resolve subtest icon (renders 3D generated image, with vector SVG fallback)
export function SubtestIconRenderer({
  subtest,
  className = 'w-12 h-12',
  size = 48,
}: {
  subtest: string;
  className?: string;
  size?: number;
}) {
  const imageMap: Record<string, string> = {
    penalaran_umum: '/icons/penalaran_umum.jpg',
    penalaran_matematika: '/icons/penalaran_matematika.jpg',
    literasi_bahasa_indonesia: '/icons/literasi_bahasa_indonesia.jpg',
    literasi_bahasa_inggris: '/icons/literasi_bahasa_inggris.jpg',
    pengetahuan_kuantitatif: '/icons/pengetahuan_kuantitatif.jpg',
    pemahaman_bacaan_menulis: '/icons/pemahaman_bacaan_menulis.jpg',
    verbal: '/icons/verbal.jpg',
    numerik: '/icons/numerik.jpg',
    figural: '/icons/figural.jpg',
  };

  const src = imageMap[subtest];
  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={subtest}
        width={size}
        height={size}
        className={`rounded-2xl object-cover shadow-sm select-none ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  switch (subtest) {
    case 'penalaran_umum':
      return <IconPenalaranUmum className={className} size={size} />;
    case 'penalaran_matematika':
      return <IconPenalaranMatematika className={className} size={size} />;
    case 'literasi_bahasa_indonesia':
      return <IconLiterasiIndonesia className={className} size={size} />;
    case 'literasi_bahasa_inggris':
      return <IconLiterasiInggris className={className} size={size} />;
    case 'pengetahuan_kuantitatif':
      return <IconPengetahuanKuantitatif className={className} size={size} />;
    case 'pemahaman_bacaan_menulis':
      return <IconPemahamanBacaanMenulis className={className} size={size} />;
    case 'verbal':
      return <IconVerbal className={className} size={size} />;
    case 'numerik':
      return <IconNumerik className={className} size={size} />;
    case 'figural':
      return <IconFigural className={className} size={size} />;
    default:
      return <IconPenalaranUmum className={className} size={size} />;
  }
}
