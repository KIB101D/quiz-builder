import { QUESTION_TYPES } from '@/lib/question-types';
import { cn } from '@/lib/cn';
import type { QuestionType } from '@/types/quiz';

export function TypeBadge({ type }: { type: QuestionType }) {
  const meta = QUESTION_TYPES[type];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        meta.badgeClass,
      )}
    >
      {meta.label}
    </span>
  );
}
