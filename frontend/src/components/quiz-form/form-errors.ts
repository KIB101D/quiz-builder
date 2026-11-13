import type { FieldError, FieldErrors } from 'react-hook-form';
import type { QuizFormValues } from '@/lib/validation/quiz-form.schema';

/**
 * RHF types errors of a discriminated union as a union of error shapes,
 * which makes member-specific keys awkward to read. This flattens them.
 */
export interface QuestionErrors {
  text?: FieldError;
  correctAnswer?: FieldError;
  options?: {
    message?: string;
    root?: FieldError;
    [index: number]: { text?: FieldError } | undefined;
  };
}

export const getQuestionErrors = (errors: FieldErrors<QuizFormValues>, index: number) =>
  errors.questions?.[index] as QuestionErrors | undefined;
