/**
 * Emoji type definitions
 * Centralized type system for the entire application
 */

export interface Emoji {
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
  aliases?: string[];
}

export interface EmojiFilterState {
  category: string;
  tag: string;
  alias: string;
}

export type ThemeMode = 'light' | 'dark';

export interface EmojiAppState {
  emojis: Emoji[];
  filteredEmojis: Emoji[];
  selectedEmoji: Emoji | null;
  theme: ThemeMode;
  isLoading: boolean;
  error: Error | null;
}
