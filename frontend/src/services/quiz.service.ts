import type { CreateQuizPayload, QuizDetail, QuizSummary } from '@/types/quiz';
import { apiRequest } from './api-client';

export const quizService = {
  getAll: () => apiRequest<QuizSummary[]>('/quizzes'),

  getById: (id: number | string) => apiRequest<QuizDetail>(`/quizzes/${id}`),

  create: (payload: CreateQuizPayload) =>
    apiRequest<QuizDetail>('/quizzes', { method: 'POST', body: JSON.stringify(payload) }),

  remove: (id: number) => apiRequest<void>(`/quizzes/${id}`, { method: 'DELETE' }),
};
