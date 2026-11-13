'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export function SiteHeader() {
  const pathname = usePathname();
  const onQuizzes = pathname.startsWith('/quizzes');

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/quizzes" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-ink font-mono text-sm text-white"
          >
            Q?
          </span>
          <span className="hidden sm:inline">Quiz Builder</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link
            href="/quizzes"
            aria-current={onQuizzes ? 'page' : undefined}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              onQuizzes ? 'bg-black/5 text-ink' : 'text-muted hover:text-ink',
            )}
          >
            All quizzes
          </Link>
          <ButtonLink
            href="/create"
            size="sm"
            aria-current={pathname === '/create' ? 'page' : undefined}
          >
            <Plus className="size-4" aria-hidden />
            New quiz
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
