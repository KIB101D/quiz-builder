import type { Metadata } from 'next';
import { QuizList } from '@/components/quiz-list/quiz-list';
import { PageHeader } from '@/components/ui/page-header';
import { quizService } from '@/services/quiz.service';

// Always fetch fresh data from the API.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Quizzes' };

export default async function QuizzesPage() {
  const quizzes = await quizService.getAll();

  return (
    <>
      <PageHeader
        title="Quizzes"
        description="Open a quiz to see its structure, or remove the ones you no longer need."
      />
      <QuizList initialQuizzes={quizzes} />
    </>
  );
}
