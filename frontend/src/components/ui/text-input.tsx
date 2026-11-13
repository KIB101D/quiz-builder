import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const sizes = {
  // 16px on small screens: iOS Safari zooms into inputs with a smaller font on focus.
  md: 'h-10 text-base sm:text-[15px]',
  lg: 'h-12 text-lg',
} as const;

export function TextInput({
  className,
  invalid,
  inputSize = 'md',
  ...props
}: Omit<ComponentProps<'input'>, 'size'> & { invalid?: boolean; inputSize?: keyof typeof sizes }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-lg border border-line-strong bg-surface px-3 text-ink transition-colors outline-none placeholder:text-muted/70',
        sizes[inputSize],
        'focus:border-accent focus:ring-4 focus:ring-accent/15',
        'disabled:bg-paper disabled:text-ink disabled:opacity-100',
        invalid && 'border-danger focus:border-danger focus:ring-danger/15',
        className,
      )}
      {...props}
    />
  );
}
