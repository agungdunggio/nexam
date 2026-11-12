'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isLoggedIn && !user) {
      router.replace('/login');
    }
  }, [isLoggedIn, user, router]);

  // Test session routes have their own full-screen UI
  const isTestSession =
    pathname.includes('/test/utbk/ses_') ||
    pathname.includes('/test/tpa/ses_') ||
    pathname.startsWith('/simulation/session');
  const isSelectPage = pathname === '/test' || pathname === '/test/utbk' || pathname === '/test/tpa';
  const isResultsPage = pathname.startsWith('/results') || pathname.startsWith('/simulation/results');
  const isSimulationPage = pathname.startsWith('/simulation');
  const hideSidebar = isSelectPage || isResultsPage || isSimulationPage;

  // If user is logged out, don't flash protected screen
  if (isClient && !isLoggedIn && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isTestSession) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950/60">
      <Navbar />
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {!hideSidebar && <Sidebar />}
        <main className={`flex-1 min-w-0 ${hideSidebar ? 'p-3 sm:p-6 lg:p-8' : 'p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
