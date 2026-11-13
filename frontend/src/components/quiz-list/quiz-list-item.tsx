import { ArrowUpRight, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { IconButton } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { formatDate, pluralize } from '@/lib/format';
import type { QuizSummary } from '@/types/quiz';

interface QuizListItemProps {
  quiz: QuizSummary;
  deleting: boolean;
  onDelete: () => void;
}

export function QuizListItem({ quiz, deleting, onDelete }: QuizListItemProps) {
  return (
    <li
      className={cn(
        'group relative flex items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-[border-color,box-shadow,opacity] hover:border-ink/25 hover:shadow-sm sm:p-5',
        deleting && 'pointer-events-none opacity-50',
      )}
    >
      <div className="min-w-0 flex-1">
        {/* Stretched link: the whole card is clickable, the delete button sits above it. */}
        <Link
          href={`/quizzes/${quiz.id}`}
          className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
        >
          <h2 className="flex items-center gap-1 font-semibold break-words transition-colors group-hover:text-accent">
            {quiz.title}
            <ArrowUpRight
              className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          </h2>
        </Link>
        <p className="mt-1.5 text-sm text-muted">
          <span className="font-medium text-ink">{pluralize(quiz.questionCount, 'question')}</span>
          <span aria-hidden> · </span>
          <time dateTime={quiz.createdAt}>{formatDate(quiz.createdAt)}</time>
        </p>
      </div>

      <IconButton
        aria-label={`Delete quiz “${quiz.title}”`}
        title="Delete quiz"
        variant="danger"
        className="relative z-10 -mt-1 -mr-1"
        disabled={deleting}
        onClick={onDelete}
      >
        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
      </IconButton>
    </li>
  );
}
