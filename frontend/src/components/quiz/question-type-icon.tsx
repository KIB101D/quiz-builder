import { ListChecks, TextCursorInput, ToggleRight, type LucideProps } from 'lucide-react';
import type { QuestionType } from '@/types/quiz';

const ICONS = {
  BOOLEAN: ToggleRight,
  INPUT: TextCursorInput,
  CHECKBOX: ListChecks,
} satisfies Record<QuestionType, unknown>;

export function QuestionTypeIcon({ type, ...props }: LucideProps & { type: QuestionType }) {
  const Icon = ICONS[type];
  return <Icon aria-hidden {...props} />;
}
