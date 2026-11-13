import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { HttpError } from '../src/lib/http-error.js';
import { quizService } from '../src/modules/quizzes/quiz.service.js';

vi.mock('../src/modules/quizzes/quiz.service.js', () => ({
  quizService: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));

const service = vi.mocked(quizService);
const app = createApp();

describe('Quiz routes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /quizzes returns the list', async () => {
    service.findAll.mockResolvedValue([
      { id: 1, title: 'Quiz', questionCount: 2, createdAt: '2026-01-01T00:00:00.000Z' },
    ]);

    const res = await request(app).get('/quizzes');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].questionCount).toBe(2);
  });

  it('GET /quizzes/:id returns 400 for an invalid id', async () => {
    const res = await request(app).get('/quizzes/abc');

    expect(res.status).toBe(400);
    expect(service.findById).not.toHaveBeenCalled();
  });

  it('GET /quizzes/:id returns 404 when the quiz is missing', async () => {
    service.findById.mockRejectedValue(HttpError.notFound('Quiz with id 99 not found'));

    const res = await request(app).get('/quizzes/99');

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Quiz with id 99 not found');
  });

  it('POST /quizzes validates the payload', async () => {
    const res = await request(app).post('/quizzes').send({ title: '', questions: [] });

    expect(res.status).toBe(400);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'title' })]),
    );
    expect(service.create).not.toHaveBeenCalled();
  });

  it('POST /quizzes passes sanitized data to the service and returns 201', async () => {
    service.create.mockResolvedValue({
      id: 7,
      title: 'Trimmed',
      createdAt: '2026-01-01T00:00:00.000Z',
      questions: [],
    });

    const res = await request(app)
      .post('/quizzes')
      .send({
        title: '  Trimmed  ',
        questions: [{ type: 'BOOLEAN', text: 'Yes?', correctAnswer: true }],
      });

    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/quizzes/7');
    expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Trimmed' }));
  });

  it('DELETE /quizzes/:id returns 204', async () => {
    service.remove.mockResolvedValue();

    const res = await request(app).delete('/quizzes/3');

    expect(res.status).toBe(204);
    expect(service.remove).toHaveBeenCalledWith(3);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/quizzes')
      .set('Content-Type', 'application/json')
      .send('{"title": ');

    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
  });
});
