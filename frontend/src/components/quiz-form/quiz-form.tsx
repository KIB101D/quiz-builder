'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { QuestionTypeIcon } from '@/components/quiz/question-type-icon';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { TextInput } from '@/components/ui/text-input';
import { pluralize } from '@/lib/format';
import { QUESTION_TYPE_ORDER, QUESTION_TYPES } from '@/lib/question-types';
import {
  createEmptyQuestion,
  quizFormDefaults,
  quizFormSchema,
  toCreateQuizPayload,
  type QuizFormOutput,
  type QuizFormValues,
} from '@/lib/validation/quiz-form.schema';
import { ApiError } from '@/services/api-client';
import { quizService } from '@/services/quiz.service';
import type { QuestionType } from '@/types/quiz';
import { getQuestionErrors } from './form-errors';
import { QuestionEditor } from './question-editor';

const MAX_QUESTIONS = 50;

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormValues, unknown, QuizFormOutput>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quizFormDefaults,
    mode: 'onTouched',
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'questions' });

  const addQuestion = (type: QuestionType) => {
    append(createEmptyQuestion(type));
    // Focus the new question once it has rendered.
    requestAnimationFrame(() => setFocus(`questions.${fields.length}.text`));
  };

  const changeQuestionType = (index: number, type: QuestionType) => {
    // Keep the question text, reset type-specific answer fields.
    update(index, createEmptyQuestion(type, getValues(`questions.${index}.text`)));
    clearErrors(`questions.${index}`);
  };

  const onSubmit = async (values: QuizFormOutput) => {
    setSubmitError(null);
    try {
      const quiz = await quizService.create(toCreateQuizPayload(values));
      setIsRedirecting(true);
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Something went wrong.');
    }
  };

  const busy = isSubmitting || isRedirecting;
  const questionsError = errors.questions?.root?.message ?? errors.questions?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <section className="rounded-xl border border-line bg-surface p-4 sm:p-6">
        <label htmlFor="quiz-title" className="mb-2 block font-semibold">
          Quiz title
        </label>
        <TextInput
          id="quiz-title"
          autoFocus
          placeholder="e.g. JavaScript Fundamentals"
          className="h-12 text-lg"
          invalid={!!errors.title}
          aria-describedby={errors.title ? 'quiz-title-error' : undefined}
          {...register('title')}
        />
        <FieldError id="quiz-title-error" message={errors.title?.message} />
      </section>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
          <span className="font-mono text-sm text-muted">{fields.length}</span>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <QuestionEditor
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={getQuestionErrors(errors, index)}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
              onTypeChange={(type) => changeQuestionType(index, type)}
            />
          ))}
        </div>

        <FieldError message={questionsError} />

        {fields.length < MAX_QUESTIONS && (
          <div className="mt-4 rounded-xl border border-dashed border-line-strong p-4">
            <p className="mb-3 text-sm text-muted">Add a question</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {QUESTION_TYPE_ORDER.map((type) => (
                <Button
                  key={type}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => addQuestion(type)}
                >
                  <Plus className="size-4 text-muted" aria-hidden />
                  <QuestionTypeIcon type={type} className="size-4" />
                  {QUESTION_TYPES[type].label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-5">
        {submitError && (
          <div
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {submitError}
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted">{pluralize(fields.length, 'question')}</span>
          <Button type="submit" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {busy ? 'Saving…' : 'Create quiz'}
          </Button>
        </div>
      </div>
    </form>
  );
}
