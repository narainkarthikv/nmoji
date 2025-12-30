import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent';

type Props = {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-4 motion-safe:active:scale-95';
const variants: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 dark:focus:ring-blue-900 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5',
  secondary:
    'bg-slate-100 text-gray-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600 focus:ring-slate-200 dark:focus:ring-slate-700 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5',
  accent: 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-200 dark:focus:ring-teal-700 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5',
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
