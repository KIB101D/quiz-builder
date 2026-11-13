import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { TypeBadge } from '@/components/ui/type-badge';
import { cn } from '@/lib/cn';
import type { Question } from '@/types/quiz';

/**
 * Read-only rendering of a question's structure.
 * Uses visual indicators instead of disabled native inputs, which browsers
 * render greyed out and would hide which answers are correct.
 */

function Indicator({ shape, checked }: { shape: 'radio' | 'checkbox'; checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-5 shrink-0 place-items-center border text-white',
        shape === 'radio' ? 'rounded-full' : 'rounded-[5px]',
        checked ? 'border-success bg-success' : 'border-line-strong bg-surface',
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </span>
  );
}

function AnswerRow({
  shape,
  correct,
  children,
}: {
  shape: 'radio' | 'checkbox';
  correct: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex min-h-11 items-center gap-2.5 rounded-lg border px-3 py-2 text-[15px]',
        correct ? 'border-success bg-success-soft' : 'border-line bg-paper text-muted',
      )}
    >
      <Indicator shape={shape} checked={correct} />
      <span className="min-w-0 break-words">{children}</span>
      {correct && (
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success">
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          Correct
        </span>
      )}
    </div>
  );
}

function QuestionAnswers({ question }: { question: Question }) {
  switch (question.type) {
    case 'BOOLEAN':
      return (
        <ul className="grid grid-cols-2 gap-2 sm:max-w-sm">
          {[true, false].map((value) => (
            <li key={String(value)}>
              <AnswerRow shape="radio" correct={value === question.correctAnswer}>
                {value ? 'True' : 'False'}
              </AnswerRow>
            </li>
          ))}
        </ul>
      );

    case 'INPUT':
      return (
        <div className="sm:max-w-sm">
          <div className="flex h-10 items-center rounded-lg border border-success bg-success-soft px-3 text-[15px] break-all">
            {question.correctAnswer}
          </div>
          <p className="mt-1.5 text-xs text-muted">Expected answer</p>
        </div>
      );

    case 'CHECKBOX':
      return (
        <ul className="space-y-2">
          {question.options.map((option) => (
            <li key={option.id}>
              <AnswerRow shape="checkbox" correct={option.isCorrect}>
                {option.text}
              </AnswerRow>
            </li>
          ))}
        </ul>
      );
  }
}

export function QuestionPreview({ question, number }: { question: Question; number: number }) {
  return (
    <li className="rounded-xl border border-line bg-surface p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-md bg-ink font-mono text-xs text-white">
          {number}
        </span>
        <TypeBadge type={question.type} />
      </div>

      <p className="mb-4 text-[17px] font-medium break-words">{question.text}</p>

      <QuestionAnswers question={question} />
    </li>
  );
}
