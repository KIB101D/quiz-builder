import { Trash2 } from 'lucide-react';
import { useWatch, type Control, type UseFormRegister } from 'react-hook-form';
import { IconButton } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { TextInput } from '@/components/ui/text-input';
import type { QuizFormValues } from '@/lib/validation/quiz-form.schema';
import type { QuestionType } from '@/types/quiz';
import { BooleanAnswerField } from './boolean-answer-field';
import { CheckboxOptionsField } from './checkbox-options-field';
import type { QuestionErrors } from './form-errors';
import { QuestionTypePicker } from './question-type-picker';

interface QuestionEditorProps {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  errors?: QuestionErrors;
  canRemove: boolean;
  onRemove: () => void;
  onTypeChange: (type: QuestionType) => void;
}

export function QuestionEditor({
  index,
  control,
  register,
  errors,
  canRemove,
  onRemove,
  onTypeChange,
}: QuestionEditorProps) {
  const type = useWatch({ control, name: `questions.${index}.type` });
  const number = index + 1;
  const textId = `q-${index}-text`;

  return (
    <section
      aria-labelledby={`q-${index}-heading`}
      className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 id={`q-${index}-heading`} className="flex items-center gap-2.5 font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-ink font-mono text-xs text-white">
            {number}
          </span>
          Question {number}
        </h3>
        <IconButton
          aria-label={`Remove question ${number}`}
          variant="danger"
          disabled={!canRemove}
          title={canRemove ? undefined : 'A quiz needs at least one question'}
          onClick={onRemove}
        >
          <Trash2 />
        </IconButton>
      </div>

      <div className="space-y-5">
        <QuestionTypePicker
          value={type}
          onChange={onTypeChange}
          label={`Question ${number} type`}
        />

        <div>
          <label htmlFor={textId} className="mb-2 block text-sm font-medium text-muted">
            Question
          </label>
          <TextInput
            id={textId}
            placeholder="Type your question…"
            invalid={!!errors?.text}
            aria-describedby={errors?.text ? `${textId}-error` : undefined}
            {...register(`questions.${index}.text`)}
          />
          <FieldError id={`${textId}-error`} message={errors?.text?.message} />
        </div>

        {type === 'BOOLEAN' && (
          <BooleanAnswerField
            index={index}
            register={register}
            error={errors?.correctAnswer?.message}
          />
        )}

        {type === 'INPUT' && (
          <div>
            <label
              htmlFor={`q-${index}-answer`}
              className="mb-2 block text-sm font-medium text-muted"
            >
              Correct answer
            </label>
            <TextInput
              id={`q-${index}-answer`}
              placeholder="Expected short answer"
              invalid={!!errors?.correctAnswer}
              {...register(`questions.${index}.correctAnswer`)}
            />
            <FieldError message={errors?.correctAnswer?.message} />
          </div>
        )}

        {type === 'CHECKBOX' && (
          <CheckboxOptionsField
            index={index}
            control={control}
            register={register}
            errors={errors?.options}
          />
        )}
      </div>
    </section>
  );
}
