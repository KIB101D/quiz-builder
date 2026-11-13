import { z } from 'zod';
import type { CreateQuizPayload, QuestionType } from '@/types/quiz';

/**
 * The form works with "form-shaped" values (e.g. radio values are strings),
 * which are converted to the API payload by `toCreateQuizPayload`.
 * Limits mirror the backend schema.
 */

const questionText = z
  .string()
  .trim()
  .min(1, 'Question text is required')
  .max(500, 'At most 500 characters');

const booleanQuestion = z.object({
  type: z.literal('BOOLEAN'),
  text: questionText,
  correctAnswer: z
    .string()
    .refine((value) => value === 'true' || value === 'false', 'Choose the correct answer'),
});

const inputQuestion = z.object({
  type: z.literal('INPUT'),
  text: questionText,
  correctAnswer: z.string().trim().min(1, 'Correct answer is required').max(500, 'Too long'),
});

const checkboxOption = z.object({
  text: z.string().trim().min(1, 'Option text is required').max(300, 'Too long'),
  isCorrect: z.boolean(),
});

const checkboxQuestion = z.object({
  type: z.literal('CHECKBOX'),
  text: questionText,
  options: z
    .array(checkboxOption)
    .min(2, 'Add at least 2 options')
    .max(10, 'At most 10 options')
    .refine((options) => options.some((o) => o.isCorrect), 'Mark at least one correct option'),
});

export const questionFormSchema = z.discriminatedUnion('type', [
  booleanQuestion,
  inputQuestion,
  checkboxQuestion,
]);

export const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Quiz title is required').max(200, 'At most 200 characters'),
  questions: z
    .array(questionFormSchema)
    .min(1, 'Add at least one question')
    .max(50, 'At most 50 questions'),
});

export type QuizFormValues = z.input<typeof quizFormSchema>;
export type QuizFormOutput = z.output<typeof quizFormSchema>;
export type QuestionFormValues = z.input<typeof questionFormSchema>;
export type CheckboxQuestionFormValues = z.input<typeof checkboxQuestion>;

export const MAX_OPTIONS = 10;
export const MIN_OPTIONS = 2;

export const createEmptyQuestion = (type: QuestionType, text = ''): QuestionFormValues => {
  switch (type) {
    case 'BOOLEAN':
      return { type, text, correctAnswer: '' };
    case 'INPUT':
      return { type, text, correctAnswer: '' };
    case 'CHECKBOX':
      return {
        type,
        text,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      };
  }
};

export const quizFormDefaults: QuizFormValues = {
  title: '',
  questions: [createEmptyQuestion('BOOLEAN')],
};

export const toCreateQuizPayload = (values: QuizFormOutput): CreateQuizPayload => ({
  title: values.title,
  questions: values.questions.map((question) => {
    switch (question.type) {
      case 'BOOLEAN':
        return { ...question, correctAnswer: question.correctAnswer === 'true' };
      case 'INPUT':
      case 'CHECKBOX':
        return question;
    }
  }),
});
