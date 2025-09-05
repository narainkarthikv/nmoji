import React, { useState, useCallback } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  return (
    <div className="relative w-full max-w-[600px] mx-auto mb-4 flex items-center">
      <input
        className="w-full py-3 px-4 pr-10 text-[calc(1rem+0.2vw)] border-2 border-gray-200 rounded-xl transition-all duration-200 bg-white text-gray-800 outline-none focus:border-[lightseagreen] focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] placeholder-gray-400 md:py-2.5 md:px-3.5 md:pr-9 md:text-base dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:focus:border-[#2a9d8f] dark:placeholder-gray-600"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search emojis..."
      />
      <span className="absolute right-2.5 text-lg text-gray-500 p-1.5">🔍</span>
    </div>
  );
}
