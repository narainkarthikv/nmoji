import React, { useState, useEffect } from 'react';
import { EmojiGrid } from './EmojiGrid';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { EmojiDescription } from './EmojiDescription';
import { ThemeToggle } from './ThemeToggle';
import type { Emoji, ThemeMode } from '../types/emoji';
import { searchEmojis, filterEmojis } from '../utils/emoji';
import { getInitialTheme, saveTheme, applyTheme } from '../utils/theme';

export function EmojiApp() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch emoji data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadEmojis = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/NmojiList.json');
        if (!response.ok) {
          throw new Error('Failed to fetch emoji data');
        }
        const data: Emoji[] = await response.json();
        setEmojis(data);
        setFilteredEmojis(data);
        // Set first emoji as selected
        if (data.length > 0) {
          setSelectedEmoji(data[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error loading emoji data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmojis();
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const handleSearch = (query: string) => {
    const results = searchEmojis(emojis, query);
    setFilteredEmojis(results);
  };

  const handleFilter = (category: string, tag: string, alias: string) => {
    const results = filterEmojis(
      emojis,
      category || undefined,
      tag || undefined,
      alias || undefined,
    );
    setFilteredEmojis(results);
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emoji.emoji).catch((err) => {
        console.error('Clipboard error:', err);
      });
    }
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Emojis</h2>
          <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <a
                href="/"
                aria-label="Back to landing page"
                className="inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                <span className="sr-only">Back to home</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-700 dark:text-slate-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </a>

              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight truncate">Nmoji</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  Browse emojis — fast & lovely
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar - Fixed height */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <SearchBar onSearch={handleSearch} compact />
            <FilterBar onFilter={handleFilter} emojis={emojis} compact />
          </div>
        </div>
      </div>

      {/* Main Content - Flexible, scrollable */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 h-full">
            {/* Emoji Grid - Scrollable */}
            <section className="overflow-y-auto min-h-0">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">Loading emojis...</p>
                </div>
              ) : (
                <EmojiGrid
                  emojis={filteredEmojis}
                  onEmojiSelect={handleEmojiSelect}
                  selectedEmoji={selectedEmoji}
                />
              )}
            </section>

            {/* Emoji Description - Sticky */}
            <aside className="overflow-y-auto min-h-0">
              <EmojiDescription
                emoji={selectedEmoji}
                allEmojis={emojis}
                onEmojiSelect={handleEmojiSelect}
                defaultMessage={
                  !emojis.length
                    ? 'Loading emojis...'
                    : !selectedEmoji
                      ? 'Tap or click an emoji to see details'
                      : undefined
                }
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
