import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function ButtonPrimary({
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-lg text-[var(--color-text-inverse)] bg-[var(--color-action-default)] hover:bg-[var(--color-action-hover)] active:bg-[var(--color-action-active)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] ${className}`}>
      {children}
    </button>
  );
}
