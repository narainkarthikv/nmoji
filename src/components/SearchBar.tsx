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
          className={`w-full rounded-full border border-[color-mix(in_srgb,var(--color-border-primary)_85%,transparent_15%)] bg-[color-mix(in_srgb,var(--color-surface-primary)_92%,transparent_8%)] text-[var(--color-text-primary)] shadow-[0_12px_30px_-24px_rgba(0,0,0,0.5)] outline-none transition-all duration-300 focus:border-[var(--color-action-default)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_30%,transparent_70%)] placeholder-[var(--color-text-muted)] ${
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
            className={`absolute top-1/2 -translate-y-1/2 right-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1.5 rounded-full hover:bg-[var(--color-bg-secondary)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_35%,transparent_65%)] motion-safe:hover:scale-110 motion-safe:active:scale-95 ${
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
