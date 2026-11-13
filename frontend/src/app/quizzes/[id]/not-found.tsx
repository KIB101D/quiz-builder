import { ButtonLink } from '@/components/ui/button';

export default function QuizNotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Quiz not found</h1>
      <p className="mt-2 mb-6 text-muted">It may have been deleted or the link is wrong.</p>
      <ButtonLink href="/quizzes" variant="secondary">
        Back to quizzes
      </ButtonLink>
    </div>
  );
}
