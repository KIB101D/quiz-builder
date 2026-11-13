import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-sm hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-paper',
  ghost: 'text-muted hover:bg-black/5 hover:text-ink',
  danger: 'text-muted hover:bg-danger-soft hover:text-danger',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

export const buttonClasses = ({ variant = 'primary', size = 'md' }: StyleProps = {}) =>
  cn(base, variants[variant], sizes[size]);

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & StyleProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}

export function IconButton({
  className,
  type = 'button',
  variant = 'ghost',
  ...props
}: ComponentProps<'button'> & { variant?: Variant; 'aria-label': string }) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variants[variant],
        'size-9 shrink-0 rounded-lg p-0 [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}
