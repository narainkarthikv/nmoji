import React, { useState, useCallback } from 'react';
import '../styles/SearchBar.css';

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
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search emojis..."
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}
