'use client';

import { AlertCircle, FileQuestion, Plus } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { pluralize } from '@/lib/format';
import { ApiError } from '@/services/api-client';
import { quizService } from '@/services/quiz.service';
import type { QuizSummary } from '@/types/quiz';
import { QuizListItem } from './quiz-list-item';

export function QuizList({ initialQuizzes }: { initialQuizzes: QuizSummary[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [deletingIds, setDeletingIds] = useState<ReadonlySet<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const setDeleting = (id: number, deleting: boolean) =>
    setDeletingIds((prev) => {
      const next = new Set(prev);
      if (deleting) next.add(id);
      else next.delete(id);
      return next;
    });

  const handleDelete = async (quiz: QuizSummary) => {
    setError(null);
    setDeleting(quiz.id, true);

    try {
      await quizService.remove(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (err) {
      if (err instanceof ApiError && err.isNotFound) {
        // Already gone on the server: just sync the UI.
        setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      } else {
        const reason = err instanceof ApiError ? err.message : 'Unknown error.';
        setError(`Couldn't delete “${quiz.title}”. ${reason}`);
      }
    } finally {
      setDeleting(quiz.id, false);
    }
  };

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
        <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <FileQuestion className="size-6" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold">No quizzes yet</h2>
        <p className="mt-1 mb-6 max-w-xs text-[15px] text-muted">
          Build your first quiz with true/false, short answer and multiple choice questions.
        </p>
        <ButtonLink href="/create">
          <Plus className="size-4" aria-hidden />
          Create a quiz
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {pluralize(quizzes.length, 'quiz', 'quizzes')}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <QuizListItem
            key={quiz.id}
            quiz={quiz}
            deleting={deletingIds.has(quiz.id)}
            onDelete={() => handleDelete(quiz)}
          />
        ))}
      </ul>
    </div>
  );
}
