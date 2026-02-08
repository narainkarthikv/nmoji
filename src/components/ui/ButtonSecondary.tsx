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
      className={`px-4 py-2 rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-action-default)] motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 ${className}`}>
      {children}
    </button>
  );
}
