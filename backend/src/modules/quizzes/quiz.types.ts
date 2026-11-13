export interface QuizSummaryDto {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
}

interface BaseQuestionDto {
  id: number;
  text: string;
}

export interface BooleanQuestionDto extends BaseQuestionDto {
  type: 'BOOLEAN';
  correctAnswer: boolean;
}

export interface InputQuestionDto extends BaseQuestionDto {
  type: 'INPUT';
  correctAnswer: string;
}

export interface OptionDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface CheckboxQuestionDto extends BaseQuestionDto {
  type: 'CHECKBOX';
  options: OptionDto[];
}

export type QuestionDto = BooleanQuestionDto | InputQuestionDto | CheckboxQuestionDto;

export interface QuizDetailDto {
  id: number;
  title: string;
  createdAt: string;
  questions: QuestionDto[];
}
