import type { Option, Prisma, Question } from '../../generated/prisma/client.js';
import type { QuestionInput } from './quiz.schema.js';
import type { QuestionDto, QuizDetailDto } from './quiz.types.js';

type QuestionWithOptions = Question & { options: Option[] };

/** Converts a validated question payload into a Prisma nested-create input. */
export const toQuestionCreateInput = (
  question: QuestionInput,
  position: number,
): Prisma.QuestionCreateWithoutQuizInput => {
  const base = { type: question.type, text: question.text, position };

  switch (question.type) {
    case 'BOOLEAN':
      return { ...base, booleanAnswer: question.correctAnswer };
    case 'INPUT':
      return { ...base, textAnswer: question.correctAnswer };
    case 'CHECKBOX':
      return {
        ...base,
        options: {
          create: question.options.map((option, index) => ({ ...option, position: index })),
        },
      };
  }
};

/** Converts a DB row into the public discriminated-union DTO. */
export const toQuestionDto = (question: QuestionWithOptions): QuestionDto => {
  const base = { id: question.id, text: question.text };

  switch (question.type) {
    case 'BOOLEAN':
      return { ...base, type: 'BOOLEAN', correctAnswer: question.booleanAnswer ?? false };
    case 'INPUT':
      return { ...base, type: 'INPUT', correctAnswer: question.textAnswer ?? '' };
    case 'CHECKBOX':
      return {
        ...base,
        type: 'CHECKBOX',
        options: question.options.map(({ id, text, isCorrect }) => ({ id, text, isCorrect })),
      };
  }
};

export const toQuizDetailDto = (quiz: {
  id: number;
  title: string;
  createdAt: Date;
  questions: QuestionWithOptions[];
}): QuizDetailDto => ({
  id: quiz.id,
  title: quiz.title,
  createdAt: quiz.createdAt.toISOString(),
  questions: quiz.questions.map(toQuestionDto),
});
