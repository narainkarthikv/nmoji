import React from 'react';
import '../styles/ThemeToggle.css';

interface Props {
  theme: string;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button 
      className="theme-toggle-button"
      onClick={onToggle} 
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌞' : '🌜'}
    </button>
  );
}
