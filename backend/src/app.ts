import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { quizRouter } from './modules/quizzes/quiz.routes.js';

export const createApp = (corsOrigin: string | string[] = '*') => {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/quizzes', quizRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
