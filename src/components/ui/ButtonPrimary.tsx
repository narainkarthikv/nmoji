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
      className={`px-4 py-2 rounded-md text-[var(--color-text-inverse)] bg-[var(--color-action-default)] hover:bg-[var(--color-action-hover)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-action-default)] motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 ${className}`}>
      {children}
    </button>
  );
}
