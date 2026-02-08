import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent';

type Props = {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 motion-safe:active:scale-95';
const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-action-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-action-hover)] focus:ring-[var(--color-action-default)] motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5',
  secondary:
    'bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] focus:ring-[var(--color-action-default)] motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5',
  accent:
    'bg-[var(--color-success)] text-[var(--color-text-inverse)] hover:bg-[color-mix(in_srgb,var(--color-success)_85%,black_15%)] focus:ring-[var(--color-success)] motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5',
};

export default function Button({
  variant = 'primary',
  href,
  children,
  className = '',
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a href={href} className={cls} {...(rest as any)}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
