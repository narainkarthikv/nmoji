import React, { useState, useEffect } from 'react';
import { EmojiGrid } from './EmojiGrid';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { EmojiDescription } from './EmojiDescription';
import { ThemeToggle } from './ThemeToggle';
import '../styles/EmojiApp.css';

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
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch emoji data');
          }
          return response.json();
        })
        .then(data => {
          console.log('Loaded emojis:', data.length);
          setEmojis(data);
          setFilteredEmojis(data);
        })
        .catch(error => {
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
    const filtered = emojis.filter(emoji => {
      const descriptionMatch = emoji.description.toLowerCase().includes(searchValue);
      const categoryMatch = emoji.category.toLowerCase().includes(searchValue);
      const tagMatch = emoji.tags?.some(tag => tag.toLowerCase().includes(searchValue));
      const aliasMatch = emoji.aliases?.some(alias => alias.toLowerCase().includes(searchValue));
      
      return descriptionMatch || categoryMatch || tagMatch || aliasMatch;
    });

    setFilteredEmojis(filtered);
  };

  const handleFilter = (category: string, tag: string, alias: string) => {
    let filtered = [...emojis];

    if (category) {
      filtered = filtered.filter(emoji => emoji.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      filtered = filtered.filter(emoji => emoji.tags?.includes(tag));
    }

    if (alias) {
      filtered = filtered.filter(emoji => emoji.aliases?.includes(alias));
    }

    setFilteredEmojis(filtered);
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emoji.emoji).catch(err => console.error("Clipboard error:", err));
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Default emoji for first render
  useEffect(() => {
    if (emojis.length > 0 && !selectedEmoji) {
      setSelectedEmoji(emojis[0]);
    }
  }, [emojis]);

  return (
    <>
      <header className="app-header">
        <h1>Nmoji</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      <div className="app-container">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} />
          <div className="filter-section">
            <FilterBar onFilter={handleFilter} emojis={emojis} />
          </div>
        </div>
        <div className="main-content">
          <EmojiGrid 
            emojis={filteredEmojis} 
            onEmojiSelect={handleEmojiSelect} 
            selectedEmoji={selectedEmoji}
          />
          <EmojiDescription 
            emoji={selectedEmoji}
            allEmojis={emojis}
            onEmojiSelect={handleEmojiSelect}
            defaultMessage={
              !emojis.length 
                ? "Loading emojis..." 
                : !selectedEmoji 
                  ? "Click an emoji to see more details!" 
                  : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
