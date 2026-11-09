import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950/60">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
