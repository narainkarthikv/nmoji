import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  onSearch: (query: string) => void;
  compact?: boolean;
}

export function SearchBar({ onSearch, compact = false }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounce search to avoid excessive filtering
  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      // Immediate feedback on keystroke
      setSearchTerm(query);

      // Debounced search execution (100ms delay)
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(query);
      }, 100);
    },
    [onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    onSearch('');
  }, [onSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className={`flex-1 ${compact ? 'min-w-[250px]' : 'w-full'}`}>
      <label htmlFor='emoji-search' className='sr-only'>
        Search emojis by name, category, or tags
      </label>
      <div className='relative w-full'>
        <input
          id='emoji-search'
          aria-label='Search emojis by name, category, tags, or aliases'
          className={`w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] outline-none transition-colors duration-200 focus:border-[var(--color-action-default)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_25%,transparent_75%)] placeholder-[var(--color-text-muted)] ${
            compact ? 'py-2.5 px-4 pr-10 text-sm' : 'py-3 px-4 pr-11 text-base'
          }`}
          type='search'
          value={searchTerm}
          onChange={handleChange}
          placeholder='Search emojis...'
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 right-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1.5 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-action-default)_35%,transparent_65%)] ${
              compact ? 'text-sm' : ''
            }`}
            aria-label='Clear search'>
            ✕
          </button>
        )}
        {!searchTerm && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 right-2 text-[var(--color-text-muted)] p-1.5 pointer-events-none ${
              compact ? 'text-sm' : ''
            }`}
            aria-hidden='true'>
            🔍
          </div>
        )}
      </div>
    </div>
  );
}
