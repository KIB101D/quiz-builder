import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function TextInput({
  className,
  invalid,
  ...props
}: ComponentProps<'input'> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-[15px] text-ink transition-colors outline-none placeholder:text-muted/70',
        'focus:border-accent focus:ring-4 focus:ring-accent/15',
        'disabled:bg-paper disabled:text-ink disabled:opacity-100',
        invalid && 'border-danger focus:border-danger focus:ring-danger/15',
        className,
      )}
      {...props}
    />
  );
}
