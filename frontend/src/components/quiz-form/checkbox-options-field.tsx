import { Plus, X } from 'lucide-react';
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import { Button, IconButton } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { TextInput } from '@/components/ui/text-input';
import { MAX_OPTIONS, MIN_OPTIONS, type QuizFormValues } from '@/lib/validation/quiz-form.schema';
import type { QuestionErrors } from './form-errors';

interface CheckboxOptionsFieldProps {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  errors?: QuestionErrors['options'];
}

export function CheckboxOptionsField({
  index,
  control,
  register,
  errors,
}: CheckboxOptionsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  const listError = errors?.root?.message ?? errors?.message;

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-muted">
        Options <span className="font-normal">· tick every correct one</span>
      </legend>

      <ul className="space-y-2">
        {fields.map((field, optionIndex) => {
          const textError = errors?.[optionIndex]?.text?.message;
          const optionLabel = `Option ${optionIndex + 1}`;

          return (
            <li key={field.id}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label={`${optionLabel} is correct`}
                  className="size-5 shrink-0 cursor-pointer rounded accent-success"
                  {...register(`questions.${index}.options.${optionIndex}.isCorrect`)}
                />
                <TextInput
                  placeholder={optionLabel}
                  aria-label={`${optionLabel} text`}
                  invalid={!!textError}
                  {...register(`questions.${index}.options.${optionIndex}.text`)}
                />
                <IconButton
                  aria-label={`Remove ${optionLabel.toLowerCase()}`}
                  variant="danger"
                  disabled={fields.length <= MIN_OPTIONS}
                  onClick={() => remove(optionIndex)}
                >
                  <X />
                </IconButton>
              </div>
              <div className="pl-7">
                <FieldError message={textError} />
              </div>
            </li>
          );
        })}
      </ul>

      <FieldError message={listError} />

      {fields.length < MAX_OPTIONS && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 -ml-2"
          onClick={() => append({ text: '', isCorrect: false })}
        >
          <Plus className="size-4" aria-hidden />
          Add option
        </Button>
      )}
    </fieldset>
  );
}
