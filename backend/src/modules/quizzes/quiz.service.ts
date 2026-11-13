import { prisma } from '../../lib/prisma.js';
import { HttpError } from '../../lib/http-error.js';
import { toQuestionCreateInput, toQuizDetailDto } from './quiz.mapper.js';
import type { CreateQuizInput } from './quiz.schema.js';
import type { QuizDetailDto, QuizSummaryDto } from './quiz.types.js';

const detailInclude = {
  questions: {
    orderBy: { position: 'asc' },
    include: { options: { orderBy: { position: 'asc' } } },
  },
} as const;

export const quizService = {
  async findAll(): Promise<QuizSummaryDto[]> {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
    });

    return quizzes.map(({ _count, createdAt, ...quiz }) => ({
      ...quiz,
      questionCount: _count.questions,
      createdAt: createdAt.toISOString(),
    }));
  },

  async findById(id: number): Promise<QuizDetailDto> {
    const quiz = await prisma.quiz.findUnique({ where: { id }, include: detailInclude });

    if (!quiz) throw HttpError.notFound(`Quiz with id ${id} not found`);

    return toQuizDetailDto(quiz);
  },

  async create(input: CreateQuizInput): Promise<QuizDetailDto> {
    const quiz = await prisma.quiz.create({
      data: {
        title: input.title,
        questions: { create: input.questions.map(toQuestionCreateInput) },
      },
      include: detailInclude,
    });

    return toQuizDetailDto(quiz);
  },

  async remove(id: number): Promise<void> {
    // Questions and options are removed via ON DELETE CASCADE.
    // A missing record throws P2025, mapped to 404 by the error handler.
    await prisma.quiz.delete({ where: { id } });
  },
};
