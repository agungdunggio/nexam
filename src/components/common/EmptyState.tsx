import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 my-6">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 text-2xl shadow-sm">
          {icon}
        </div>
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 text-2xl">
          📑
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
