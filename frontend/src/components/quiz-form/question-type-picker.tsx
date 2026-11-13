import { QuestionTypeIcon } from '@/components/quiz/question-type-icon';
import { cn } from '@/lib/cn';
import { QUESTION_TYPE_ORDER, QUESTION_TYPES } from '@/lib/question-types';
import type { QuestionType } from '@/types/quiz';

interface QuestionTypePickerProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  label: string;
}

export function QuestionTypePicker({ value, onChange, label }: QuestionTypePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-paper p-1"
    >
      {QUESTION_TYPE_ORDER.map((type) => {
        const selected = type === value;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            title={QUESTION_TYPES[type].description}
            onClick={() => !selected && onChange(type)}
            className={cn(
              'flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors sm:text-sm',
              selected ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            <QuestionTypeIcon type={type} className="hidden size-4 sm:block" />
            <span className="sm:hidden">{QUESTION_TYPES[type].shortLabel}</span>
            <span className="hidden sm:inline">{QUESTION_TYPES[type].label}</span>
          </button>
        );
      })}
    </div>
  );
}
