import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function ButtonPrimary({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
