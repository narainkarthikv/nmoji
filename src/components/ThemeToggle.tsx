import React from 'react';
import type { ThemeMode } from '../types/emoji';

interface Props {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      className="relative inline-flex justify-center items-center w-[50px] h-[50px] rounded-full border-none bg-transparent cursor-pointer shadow-lg transition-all duration-300 ease-in-out text-2xl hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      onClick={onToggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌞' : '🌜'}
    </button>
  );
}
