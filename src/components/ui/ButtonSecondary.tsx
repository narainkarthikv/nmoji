import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function ButtonSecondary({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md bg-slate-100 text-gray-800 hover:bg-slate-200 transition-all duration-200 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
