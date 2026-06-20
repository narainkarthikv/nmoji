import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent';

type ButtonProps = {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
};

type AnchorProps = ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = AnchorProps | NativeButtonProps;

const base =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]';
const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-action-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-action-hover)] active:bg-[var(--color-action-active)] focus-visible:ring-[var(--color-action-default)]',
  secondary:
    'bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] active:bg-[var(--color-surface-secondary)] focus-visible:ring-[var(--color-action-default)]',
  accent:
    'bg-[var(--color-action-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-action-hover)] active:bg-[var(--color-action-active)] focus-visible:ring-[var(--color-action-default)]',
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
      <a
        href={href}
        className={cls}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={cls}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
