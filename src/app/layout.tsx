import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Nexam — Platform Simulasi UTBK & Ujian Masuk Kuliah',
  description:
    'Simulasi ujian UTBK/SNBT dan tes kemampuan umum (TPA) berbasis web dengan timer realistis, analisis performa, dan pembahasan lengkap.',
  keywords: ['UTBK', 'SNBT', 'TPA', 'Simulasi Ujian', 'Masuk Kuliah', 'Tes Potensi Akademik'],
  icons: {
    icon: '/icons/nexam_owl_logo.jpg',
  },
  authors: [{ name: 'Nexam Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexam.vercel.app'),
  openGraph: {
    title: 'Nexam — Platform Simulasi UTBK & Ujian Masuk Kuliah',
    description:
      'Simulasi ujian UTBK/SNBT dan tes kemampuan umum (TPA) berbasis web dengan analisis mendalam.',
    url: 'https://nexam.vercel.app',
    siteName: 'Nexam',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fontSans.variable} ${fontMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <TooltipProvider delay={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
