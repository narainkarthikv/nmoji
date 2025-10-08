import React, { useState, useCallback } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch],
  );

  return (
    <div className="w-full flex justify-center">
      <label htmlFor="emoji-search" className="sr-only">
        Search emojis
      </label>
      <div className="relative w-full max-w-3xl">
        <input
          id="emoji-search"
          aria-label="Search emojis"
          className="w-full py-3 px-4 pr-11 text-base border border-slate-200 rounded-2xl transition-shadow duration-200 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 outline-none focus:shadow-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          type="search"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search emojis..."
        />
        <button
          aria-hidden
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          🔍
        </button>
      </div>
    </div>
  );
}
