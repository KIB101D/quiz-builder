import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { quizController } from './quiz.controller.js';
import { createQuizSchema, quizIdParamsSchema } from './quiz.schema.js';

export const quizRouter = Router();

quizRouter.get('/', quizController.list);
quizRouter.post('/', validate(createQuizSchema), quizController.create);
quizRouter.get('/:id', validate(quizIdParamsSchema, 'params'), quizController.getById);
quizRouter.delete('/:id', validate(quizIdParamsSchema, 'params'), quizController.remove);
