import { describe, expect, it } from 'vitest';
import { createQuizSchema, quizIdParamsSchema } from '../src/modules/quizzes/quiz.schema.js';

const validQuiz = {
  title: '  Sample quiz  ',
  questions: [
    { type: 'BOOLEAN', text: 'Is the sky blue?', correctAnswer: true },
    { type: 'INPUT', text: 'Capital of Spain?', correctAnswer: 'Madrid' },
    {
      type: 'CHECKBOX',
      text: 'Pick the even numbers',
      options: [
        { text: '2', isCorrect: true },
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
      ],
    },
  ],
};

describe('createQuizSchema', () => {
  it('accepts a valid quiz and trims strings', () => {
    const result = createQuizSchema.parse(validQuiz);
    expect(result.title).toBe('Sample quiz');
    expect(result.questions).toHaveLength(3);
  });

  it('rejects a quiz without questions', () => {
    const result = createQuizSchema.safeParse({ title: 'Empty', questions: [] });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown question type', () => {
    const result = createQuizSchema.safeParse({
      title: 'Bad',
      questions: [{ type: 'RADIO', text: 'Huh?' }],
    });
    expect(result.success).toBe(false);
  });

  it('requires at least one correct checkbox option', () => {
    const result = createQuizSchema.safeParse({
      title: 'Checkbox',
      questions: [
        {
          type: 'CHECKBOX',
          text: 'Pick one',
          options: [
            { text: 'A', isCorrect: false },
            { text: 'B', isCorrect: false },
          ],
        },
      ],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Mark at least one option as correct');
  });

  it('requires at least two checkbox options', () => {
    const result = createQuizSchema.safeParse({
      title: 'Checkbox',
      questions: [{ type: 'CHECKBOX', text: 'Pick', options: [{ text: 'A', isCorrect: true }] }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a blank input answer', () => {
    const result = createQuizSchema.safeParse({
      title: 'Input',
      questions: [{ type: 'INPUT', text: 'Say something', correctAnswer: '   ' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('quizIdParamsSchema', () => {
  it('coerces numeric ids', () => {
    expect(quizIdParamsSchema.parse({ id: '42' })).toEqual({ id: 42 });
  });

  it.each(['abc', '0', '-1', '1.5'])('rejects invalid id "%s"', (id) => {
    expect(quizIdParamsSchema.safeParse({ id }).success).toBe(false);
  });
});
