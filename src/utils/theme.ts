/**
 * Theme management utilities
 * Handles dark/light mode persistence and detection
 */

import type { ThemeMode } from '../types/emoji';

const THEME_STORAGE_KEY = 'nmoji-theme';
const DARK_MODE_CLASS = 'dark-mode';

/**
 * Get the current theme from localStorage or system preferences
 */
export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  // Check localStorage first
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Persist theme selection to localStorage
 */
export function saveTheme(theme: ThemeMode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

/**
 * Apply theme to DOM
 */
export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const isDark = theme === 'dark';
  document.body.classList.toggle(DARK_MODE_CLASS, isDark);

  // Also update HTML element for CSS custom properties
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Toggle theme between light and dark
 */
export function toggleTheme(currentTheme: ThemeMode): ThemeMode {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  saveTheme(newTheme);
  applyTheme(newTheme);
  return newTheme;
}

/**
 * Watch for system theme changes and update app accordingly
 */
export function watchSystemTheme(callback: (theme: ThemeMode) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    const theme = e.matches ? 'dark' : 'light';
    callback(theme);
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
