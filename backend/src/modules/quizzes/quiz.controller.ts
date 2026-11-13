import type { Request, Response } from 'express';
import type { CreateQuizInput, QuizIdParams } from './quiz.schema.js';
import { quizService } from './quiz.service.js';

// Express 5 forwards rejected promises to the error handler automatically.
export const quizController = {
  async list(_req: Request, res: Response) {
    res.json(await quizService.findAll());
  },

  async getById(_req: Request, res: Response) {
    const { id } = res.locals.params as QuizIdParams;
    res.json(await quizService.findById(id));
  },

  async create(_req: Request, res: Response) {
    const quiz = await quizService.create(res.locals.body as CreateQuizInput);
    res.status(201).location(`/quizzes/${quiz.id}`).json(quiz);
  },

  async remove(_req: Request, res: Response) {
    const { id } = res.locals.params as QuizIdParams;
    await quizService.remove(id);
    res.status(204).end();
  },
};
