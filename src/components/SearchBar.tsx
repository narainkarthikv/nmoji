import React, { useState, useCallback } from 'react';

interface Props {
  onSearch: (query: string) => void;
  compact?: boolean;
}

export function SearchBar({ onSearch, compact = false }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={`flex-1 ${compact ? 'min-w-[250px]' : 'w-full'}`}>
      <label htmlFor="emoji-search" className="sr-only">
        Search emojis by name, category, or tags
      </label>
      <div className="relative w-full">
        <input
          id="emoji-search"
          aria-label="Search emojis by name, category, tags, or aliases"
          className={`w-full border border-slate-300 dark:border-slate-600 rounded-full transition-all duration-200 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 outline-none focus:shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 placeholder-slate-500 dark:placeholder-slate-400 ${
            compact ? 'py-2.5 px-4 pr-10 text-sm' : 'py-3 px-4 pr-11 text-base'
          }`}
          type="search"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search emojis..."
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 right-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              compact ? 'text-sm' : ''
            }`}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {!searchTerm && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-2 text-slate-400 dark:text-slate-500 p-1.5 pointer-events-none ${
              compact ? 'text-sm' : ''
            }`}
            aria-hidden="true"
          >
            🔍
          </div>
        )}
      </div>
    </div>
  );
}
