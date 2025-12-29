import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Emoji } from '../types/emoji';
import { extractCategories, extractTags, extractAliases } from '../utils/emoji';

interface Props {
  emojis: Emoji[];
  onFilter: (category: string, tag: string, alias: string) => void;
  compact?: boolean;
}

const selectClasses = `px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-full transition-all duration-300 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 text-sm cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[right_10px_center] bg-[length:12px] focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none hover:border-slate-400 dark:hover:border-slate-500 motion-safe:hover:scale-105 motion-safe:active:scale-95`;

export function FilterBar({ emojis, onFilter, compact = false }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');
  const filterTimeoutRef = useRef<NodeJS.Timeout>();

  // Extract unique values from emojis
  useEffect(() => {
    setCategories(extractCategories(emojis));
    setTags(extractTags(emojis));
    setAliases(extractAliases(emojis));
  }, [emojis]);

  // Debounced filter update to prevent excessive filtering
  const debouncedFilter = useCallback(
    (category: string, tag: string, alias: string) => {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        onFilter(category, tag, alias);
      }, 80);
    },
    [onFilter],
  );

  // Handle filter changes with debouncing
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedCategory(value);
      debouncedFilter(value, selectedTag, selectedAlias);
    },
    [selectedTag, selectedAlias, debouncedFilter],
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedTag(value);
      debouncedFilter(selectedCategory, value, selectedAlias);
    },
    [selectedCategory, selectedAlias, debouncedFilter],
  );

  const handleAliasChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedAlias(value);
      debouncedFilter(selectedCategory, selectedTag, value);
    },
    [selectedCategory, selectedTag, debouncedFilter],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    };
  }, []);

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        <label className="sr-only" htmlFor="category-select">
          Category filter
        </label>
        <select
          id="category-select"
          className={`${selectClasses} min-w-[120px]`}
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Filter emojis by category"
        >
          <option value="">Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="tag-select">
          Tag filter
        </label>
        <select
          id="tag-select"
          className={`${selectClasses} min-w-[100px]`}
          value={selectedTag}
          onChange={handleTagChange}
          aria-label="Filter emojis by tag"
        >
          <option value="">Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="alias-select">
          Alias filter
        </label>
        <select
          id="alias-select"
          className={`${selectClasses} min-w-[100px]`}
          value={selectedAlias}
          onChange={handleAliasChange}
          aria-label="Filter emojis by alias"
        >
          <option value="">Aliases</option>
          {aliases.map((alias) => (
            <option key={alias} value={alias}>
              {alias}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden lg:flex gap-3 flex-wrap justify-start w-full">
        <label className="sr-only" htmlFor="category-select">
          Category filter
        </label>
        <select
          id="category-select"
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Filter emojis by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="tag-select">
          Tag filter
        </label>
        <select
          id="tag-select"
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={selectedTag}
          onChange={handleTagChange}
          aria-label="Filter emojis by tag"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="alias-select">
          Alias filter
        </label>
        <select
          id="alias-select"
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={selectedAlias}
          onChange={handleAliasChange}
          aria-label="Filter emojis by alias"
        >
          <option value="">All Aliases</option>
          {aliases.map((alias) => (
            <option key={alias} value={alias}>
              {alias}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile accordion */}
      <div className="lg:hidden flex flex-col gap-2">
        <select
          className={`${selectClasses} w-full`}
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Mobile filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className={`${selectClasses} w-full`}
          value={selectedTag}
          onChange={handleTagChange}
          aria-label="Mobile filter by tag"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          className={`${selectClasses} w-full`}
          value={selectedAlias}
          onChange={handleAliasChange}
          aria-label="Mobile filter by alias"
        >
          <option value="">All Aliases</option>
          {aliases.map((alias) => (
            <option key={alias} value={alias}>
              {alias}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
