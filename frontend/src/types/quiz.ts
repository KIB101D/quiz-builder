export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface QuizSummary {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

interface BaseQuestion {
  id: number;
  text: string;
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'BOOLEAN';
  correctAnswer: boolean;
}

export interface InputQuestion extends BaseQuestion {
  type: 'INPUT';
  correctAnswer: string;
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'CHECKBOX';
  options: QuestionOption[];
}

export type Question = BooleanQuestion | InputQuestion | CheckboxQuestion;

export interface QuizDetail {
  id: number;
  title: string;
  createdAt: string;
  questions: Question[];
}

/** Payload accepted by `POST /quizzes` */
export interface CreateQuizPayload {
  title: string;
  questions: Array<
    | { type: 'BOOLEAN'; text: string; correctAnswer: boolean }
    | { type: 'INPUT'; text: string; correctAnswer: string }
    | { type: 'CHECKBOX'; text: string; options: Array<{ text: string; isCorrect: boolean }> }
  >;
}
