/**
 * Application constants and configuration
 */

export const SITE_CONFIG = {
  name: 'Nmoji',
  description:
    'Find and filter emojis quickly with Nmoji. Search by name, category, tags, or aliases.',
  url: 'https://nmoji.netlify.app',
  repo: 'https://github.com/narainkarthikv/Nmoji',
  author: 'Wisdom Fox Community',
};

export const EMOJI_CONFIG = {
  // Maximum number of emojis to display in grid initially
  gridLimit: 200,
  // Number of related emojis to show
  relatedEmojiLimit: 12,
  // Number of popular emojis to show
  popularEmojiLimit: 8,
  // Data file path
  dataUrl: '/NmojiList.json',
};

export const ANIMATION_DURATION = {
  default: 200, // ms
  slow: 300, // ms
  fast: 100, // ms
};

export const THEME_CONFIG = {
  storageKey: 'nmoji-theme',
  darkModeClass: 'dark-mode',
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ARIA_LABELS = {
  searchInput: 'Search emojis by name, category, tags, or aliases',
  themeToggle: (theme: string) =>
    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
  categoryFilter: 'Filter emojis by category',
  tagFilter: 'Filter emojis by tag',
  aliasFilter: 'Filter emojis by alias',
  backToHome: 'Back to home page',
  selectEmoji: (description: string) => `Select ${description}`,
};
