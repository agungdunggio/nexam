import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const fontSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
  weight: '100 900',
});

const fontMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexam-test.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Nexam — Platform Simulasi UTBK SNBT & Tes Potensi Akademik',
    template: '%s | Nexam',
  },
  description:
    'Platform simulasi ujian UTBK SNBT dan Tes Potensi Akademik (TPA) online terlengkap dengan timer realistis, penilaian instan, dan evaluasi performa mendalam.',
  keywords: [
    'UTBK 2026',
    'SNBT 2026',
    'Simulasi UTBK',
    'Tryout UTBK Gratis',
    'Tes Potensi Akademik',
    'TPA Online',
    'Latihan Soal UTBK',
    'Skor IRT',
    'Penalaran Matematika',
    'Literasi Bahasa Indonesia',
    'Literasi Bahasa Inggris',
    'Kemampuan Penalaran Umum',
    'Pengetahuan Kuantitatif',
    'Masuk Perguruan Tinggi Negeri',
    'PTN Favorit',
  ],
  authors: [{ name: 'Nexam Team' }],
  creator: 'Nexam',
  publisher: 'Nexam',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: '32x32' },
      { url: '/icon.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nexam — Platform Simulasi UTBK SNBT & Tes Potensi Akademik',
    description:
      'Platform simulasi ujian UTBK SNBT dan Tes Potensi Akademik (TPA) online terlengkap dengan timer realistis dan evaluasi performa mendalam.',
    url: appUrl,
    siteName: 'Nexam',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexam — Platform Simulasi UTBK SNBT & Tes Potensi Akademik',
    description:
      'Simulasi ujian UTBK SNBT dan TPA online dengan evaluasi nilai instan dan analisis mendalam.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalApplication',
  name: 'Nexam',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  url: appUrl,
  description:
    'Platform simulasi ujian UTBK SNBT dan Tes Potensi Akademik (TPA) online dengan timer realistis dan analisis performa komprehensif.',
  inLanguage: 'id',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'IDR',
  },
  educationalLevel: 'Secondary Education, Higher Education',
  publisher: {
    '@type': 'Organization',
    name: 'Nexam',
    url: appUrl,
    logo: `${appUrl}/icon.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fontSans.variable} ${fontMono.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <TooltipProvider delay={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
