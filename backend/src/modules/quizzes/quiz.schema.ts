import { z } from 'zod';

const questionText = z
  .string()
  .trim()
  .min(1, 'Question text is required')
  .max(500, 'Question text must be at most 500 characters');

const booleanQuestionSchema = z.object({
  type: z.literal('BOOLEAN'),
  text: questionText,
  correctAnswer: z.boolean({ error: 'Choose True or False' }),
});

const inputQuestionSchema = z.object({
  type: z.literal('INPUT'),
  text: questionText,
  correctAnswer: z
    .string()
    .trim()
    .min(1, 'Correct answer is required')
    .max(500, 'Answer must be at most 500 characters'),
});

const optionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Option text is required')
    .max(300, 'Option must be at most 300 characters'),
  isCorrect: z.boolean().default(false),
});

const checkboxQuestionSchema = z.object({
  type: z.literal('CHECKBOX'),
  text: questionText,
  options: z
    .array(optionSchema)
    .min(2, 'Add at least 2 options')
    .max(10, 'At most 10 options are allowed')
    .refine((options) => options.some((o) => o.isCorrect), 'Mark at least one option as correct'),
});

export const questionSchema = z.discriminatedUnion('type', [
  booleanQuestionSchema,
  inputQuestionSchema,
  checkboxQuestionSchema,
]);

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  questions: z
    .array(questionSchema)
    .min(1, 'Add at least one question')
    .max(50, 'At most 50 questions are allowed'),
});

export const quizIdParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'Quiz id must be a positive integer' })
    .int('Quiz id must be a positive integer')
    .positive('Quiz id must be a positive integer'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type QuizIdParams = z.infer<typeof quizIdParamsSchema>;
