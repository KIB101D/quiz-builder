import type { Metadata } from 'next';
import { QuizForm } from '@/components/quiz-form/quiz-form';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'New quiz' };

export default function CreateQuizPage() {
  return (
    <>
      <PageHeader
        title="New quiz"
        description="Give it a title, then add true/false, short answer or multiple choice questions."
      />
      <QuizForm />
    </>
  );
}
