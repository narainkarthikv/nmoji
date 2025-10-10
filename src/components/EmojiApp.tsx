import React, { useState, useEffect } from 'react';
import { EmojiGrid } from './EmojiGrid';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { EmojiDescription } from './EmojiDescription';
import { ThemeToggle } from './ThemeToggle';
// Tailwind handles most styles; keep custom only if needed

interface Emoji {
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
  aliases?: string[];
}

export function EmojiApp() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);

  // ✅ Safe localStorage read during SSR
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light'; // default fallback
  });

  useEffect(() => {
    // ✅ Only run fetch in browser
    if (typeof window !== 'undefined') {
      fetch('/NmojiList.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch emoji data');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Loaded emojis:', data.length);
          setEmojis(data);
          setFilteredEmojis(data);
        })
        .catch((error) => {
          console.error('Error loading emoji data:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark-mode', theme === 'dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEmojis(emojis);
      return;
    }

    const searchValue = query.toLowerCase();
    const filtered = emojis.filter((emoji) => {
      const descriptionMatch = emoji.description.toLowerCase().includes(searchValue);
      const categoryMatch = emoji.category.toLowerCase().includes(searchValue);
      const tagMatch = emoji.tags?.some((tag) => tag.toLowerCase().includes(searchValue));
      const aliasMatch = emoji.aliases?.some((alias) => alias.toLowerCase().includes(searchValue));

      return descriptionMatch || categoryMatch || tagMatch || aliasMatch;
    });

    setFilteredEmojis(filtered);
  };

  const handleFilter = (category: string, tag: string, alias: string) => {
    let filtered = [...emojis];

    if (category) {
      filtered = filtered.filter(
        (emoji) => emoji.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (tag) {
      filtered = filtered.filter((emoji) => emoji.tags?.includes(tag));
    }

    if (alias) {
      filtered = filtered.filter((emoji) => emoji.aliases?.includes(alias));
    }

    setFilteredEmojis(filtered);
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(emoji.emoji)
        .catch((err) => console.error('Clipboard error:', err));
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Default emoji for first render
  useEffect(() => {
    if (emojis.length > 0 && !selectedEmoji) {
      setSelectedEmoji(emojis[0]);
    }
  }, [emojis]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              aria-label="Back to landing"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="sr-only">Back</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-700 dark:text-slate-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </a>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Nmoji</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Browse emojis — fast & lovely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        <div className="space-y-6">
          <div className="sticky top-4 z-20">
            <div className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md rounded-2xl p-4 transition-all duration-300">
              <SearchBar onSearch={handleSearch} />
              <div className="mt-3">
                <FilterBar onFilter={handleFilter} emojis={emojis} />
              </div>
            </div>
          </div>

          <main className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 items-start">
            <section className="">
              <EmojiGrid
                emojis={filteredEmojis}
                onEmojiSelect={handleEmojiSelect}
                selectedEmoji={selectedEmoji}
              />
            </section>

            <aside className="lg:sticky lg:top-20">
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
          </main>
        </div>
      </div>
    </div>
  );
}
