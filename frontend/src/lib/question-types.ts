import type { QuestionType } from '@/types/quiz';

interface QuestionTypeMeta {
  label: string;
  /** Compact label for narrow screens */
  shortLabel: string;
  description: string;
  /** Tailwind classes for the type badge */
  badgeClass: string;
}

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeMeta> = {
  BOOLEAN: {
    label: 'True / False',
    shortLabel: 'True/False',
    description: 'One correct answer: true or false',
    badgeClass: 'bg-teal-50 text-teal-800 ring-teal-200',
  },
  INPUT: {
    label: 'Short answer',
    shortLabel: 'Text',
    description: 'A short text answer',
    badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  CHECKBOX: {
    label: 'Multiple choice',
    shortLabel: 'Checkbox',
    description: 'Several options, one or more correct',
    badgeClass: 'bg-violet-50 text-violet-800 ring-violet-200',
  },
};

export const QUESTION_TYPE_ORDER: QuestionType[] = ['BOOLEAN', 'INPUT', 'CHECKBOX'];
