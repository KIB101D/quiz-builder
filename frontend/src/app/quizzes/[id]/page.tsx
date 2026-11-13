import { ArrowLeft, Eye } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { QuestionPreview } from '@/components/quiz-detail/question-preview';
import { PageHeader } from '@/components/ui/page-header';
import { formatDate, pluralize } from '@/lib/format';
import { ApiError } from '@/services/api-client';
import { quizService } from '@/services/quiz.service';

/** Deduplicated per request: shared by `generateMetadata` and the page. */
const getQuiz = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) notFound();

  try {
    return await quizService.getById(id);
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.status === 400)) notFound();
    throw error;
  }
});

// Always fetch fresh data from the API.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/quizzes/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getQuiz(id);
  return { title: quiz.title };
}

export default async function QuizDetailPage({ params }: PageProps<'/quizzes/[id]'>) {
  const { id } = await params;
  const quiz = await getQuiz(id);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link
            href="/quizzes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All quizzes
          </Link>
        }
        title={quiz.title}
        description={
          <>
            {pluralize(quiz.questions.length, 'question')} · Created{' '}
            <time dateTime={quiz.createdAt}>{formatDate(quiz.createdAt)}</time>
          </>
        }
      />

      <p className="mb-6 flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
        <Eye className="size-4 shrink-0" aria-hidden />
        Read-only preview. Correct answers are highlighted.
      </p>

      <ol className="space-y-4">
        {quiz.questions.map((question, index) => (
          <QuestionPreview key={question.id} question={question} number={index + 1} />
        ))}
      </ol>
    </>
  );
}
