import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function ButtonSecondary({
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] active:bg-[var(--color-surface-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] ${className}`}>
      {children}
    </button>
  );
}
