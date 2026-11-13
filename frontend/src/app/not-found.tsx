import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 mb-6 text-muted">The page you are looking for does not exist.</p>
      <ButtonLink href="/quizzes" variant="secondary">
        Go to quizzes
      </ButtonLink>
    </div>
  );
}
