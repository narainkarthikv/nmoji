import React from 'react';
import type { ThemeMode } from '../types/emoji';

interface Props {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      className='relative inline-flex justify-center items-center w-[50px] h-[50px] rounded-full border border-[color-mix(in_srgb,var(--color-border-primary)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--color-surface-primary)_92%,transparent_8%)] cursor-pointer shadow-[0_12px_30px_-22px_rgba(0,0,0,0.55)] transition-all duration-300 ease-in-out text-2xl hover:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.6)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-110 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_70%,var(--color-action-hover)_30%)] focus:ring-offset-[var(--color-bg-primary)]'
      onClick={onToggle}
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
      title={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }>
      <span
        className={`inline-block transition-transform duration-300 ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}>
        {theme === 'light' ? '🌞' : '🌜'}
      </span>
    </button>
  );
}
