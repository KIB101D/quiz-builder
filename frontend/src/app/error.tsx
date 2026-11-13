'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-xl bg-danger-soft text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 mb-6 max-w-sm text-muted">
        We couldn&apos;t load this page. Make sure the backend API is running, then try again.
      </p>
      <Button variant="secondary" onClick={retry} disabled={isPending}>
        <RotateCw className={isPending ? 'size-4 animate-spin' : 'size-4'} aria-hidden />
        Try again
      </Button>
    </div>
  );
}
