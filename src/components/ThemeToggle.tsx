import React from 'react';
import type { ThemeMode } from '../types/emoji';

interface Props {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      className='relative inline-flex justify-center items-center w-11 h-11 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] cursor-pointer transition-colors duration-200 text-xl hover:bg-[var(--color-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-[var(--color-bg-primary)]'
      onClick={onToggle}
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
      title={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }>
      <span
        className={`inline-block transition-transform duration-200 ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}>
        {theme === 'light' ? '🌞' : '🌜'}
      </span>
    </button>
  );
}
