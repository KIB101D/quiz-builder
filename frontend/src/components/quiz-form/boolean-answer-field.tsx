import { Check } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import { FieldError } from '@/components/ui/field-error';
import type { QuizFormValues } from '@/lib/validation/quiz-form.schema';

interface BooleanAnswerFieldProps {
  index: number;
  register: UseFormRegister<QuizFormValues>;
  error?: string;
}

const CHOICES = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' },
] as const;

export function BooleanAnswerField({ index, register, error }: BooleanAnswerFieldProps) {
  const errorId = `q-${index}-answer-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 text-sm font-medium text-muted">Correct answer</legend>
      <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
        {CHOICES.map(({ value, label }) => (
          <label
            key={value}
            className="flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-line-strong bg-surface px-3 text-[15px] font-medium transition-colors hover:border-ink/40 has-checked:border-success has-checked:bg-success-soft has-focus-visible:ring-4 has-focus-visible:ring-accent/20"
          >
            <input
              type="radio"
              value={value}
              className="peer sr-only"
              {...register(`questions.${index}.correctAnswer`)}
            />
            <span className="grid size-5 place-items-center rounded-full border border-line-strong text-white peer-checked:border-success peer-checked:bg-success">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            {label}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
