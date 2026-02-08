import React, { useState, useEffect, useCallback } from 'react';
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

  const handleSearch = useCallback(
    (query: string) => {
      const results = searchEmojis(emojis, query);
      setFilteredEmojis(results);
    },
    [emojis]
  );

  const handleFilter = useCallback(
    (category: string, tag: string, alias: string) => {
      const results = filterEmojis(
        emojis,
        category || undefined,
        tag || undefined,
        alias || undefined
      );
      setFilteredEmojis(results);
    },
    [emojis]
  );

  const handleEmojiSelect = useCallback((emoji: Emoji) => {
    setSelectedEmoji(emoji);
    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emoji.emoji).catch((err) => {
        console.error('Clipboard error:', err);
      });
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]'>
        <div className='text-center p-6'>
          <h2 className='text-2xl font-bold text-[var(--color-error)] mb-2'>
            Error Loading Emojis
          </h2>
          <p className='text-[var(--color-text-secondary)]'>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300'>
      <div className='pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,_color-mix(in_srgb,var(--color-action-default)_18%,transparent_82%)_0%,_transparent_70%)] blur-3xl'></div>
      <div className='pointer-events-none absolute -bottom-28 left-[-10%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,_color-mix(in_srgb,var(--color-action-default)_18%,transparent_82%)_0%,_transparent_70%)] blur-3xl'></div>

      {/* Header - Fixed height */}
      <header className='flex-shrink-0 border-b border-[var(--color-border-primary)] bg-[color-mix(in_srgb,var(--color-surface-primary)_88%,transparent_12%)] backdrop-blur-xl shadow-[0_12px_30px_-24px_rgba(0,0,0,0.5)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3 min-w-0'>
              <a
                href='/'
                aria-label='Back to landing page'
                className='inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full border border-[var(--color-border-primary)] bg-[color-mix(in_srgb,var(--color-surface-primary)_92%,transparent_8%)] hover:bg-[var(--color-surface-secondary)] shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-action-default)]'>
                <span className='sr-only'>Back to home</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-[var(--color-text-primary)]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </a>

              <div className='min-w-0'>
                <h1 className='text-2xl font-extrabold tracking-tight truncate'>
                  Nmoji
                </h1>
                <p className='text-sm text-[var(--color-text-secondary)] truncate'>
                  Browse emojis — fast & lovely
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 flex-shrink-0'>
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar - Fixed height */}
      <div className='flex-shrink-0 border-b border-[var(--color-border-primary)] bg-[color-mix(in_srgb,var(--color-surface-primary)_92%,transparent_8%)] backdrop-blur-xl shadow-[0_10px_24px_-20px_rgba(0,0,0,0.5)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <div className='flex flex-col md:flex-row gap-3 items-stretch md:items-center'>
            <SearchBar onSearch={handleSearch} compact />
            <FilterBar onFilter={handleFilter} emojis={emojis} compact />
          </div>
        </div>
      </div>

      {/* Main Content - Flexible, scrollable */}
      <main className='flex-1 overflow-hidden'>
        <div className='h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8 h-full'>
            {/* Emoji Grid - Scrollable */}
            <section className='overflow-y-auto min-h-0'>
              {isLoading ? (
                <div className='text-center py-12'>
                  <p className='text-[var(--color-text-secondary)]'>
                    Loading emojis...
                  </p>
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
            <aside className='overflow-y-auto min-h-0'>
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
