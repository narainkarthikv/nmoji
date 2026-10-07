import React, { useCallback, useMemo } from 'react';
import type { Emoji } from '../types/emoji';
import type { EmojiFilterState } from '../types/emoji';
import { extractCategories, extractTags, extractAliases } from '../utils/emoji';
import { CATEGORY_ICONS } from '../lib/constants';

interface Props {
  emojis: Emoji[];
  filters: EmojiFilterState;
  onFilter: (category: string, tag: string, alias: string) => void;
  compact?: boolean;
}

const selectClasses = `px-3 py-2.5 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] text-sm cursor-pointer appearance-none transition-colors duration-200 bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[right_10px_center] bg-[length:12px] focus:border-[var(--color-action-default)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_25%,transparent_75%)] focus:outline-none hover:border-[var(--color-action-hover)]`;

export function FilterBar({
  emojis,
  filters,
  onFilter,
  compact = false,
}: Props) {
  // Memoize filter extractions to avoid recalculating on every render
  const categories = useMemo(() => extractCategories(emojis), [emojis]);
  const tags = useMemo(() => extractTags(emojis), [emojis]);
  const aliases = useMemo(() => extractAliases(emojis), [emojis]);

  // Memoize options lists for stable rendering
  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => (
        <option key={cat} value={cat}>
          {CATEGORY_ICONS[cat] ? `${CATEGORY_ICONS[cat]} ${cat}` : cat}
        </option>
      )),
    [categories]
  );
  const tagOptions = useMemo(
    () =>
      tags.map((tag) => (
        <option key={tag} value={tag}>
          {tag}
        </option>
      )),
    [tags]
  );
  const aliasOptions = useMemo(
    () =>
      aliases.map((alias) => (
        <option key={alias} value={alias}>
          {alias}
        </option>
      )),
    [aliases]
  );

  // Apply filters immediately so collection changes cannot leave a delayed
  // update from the previous collection queued behind the current UI state.
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilter(e.target.value, filters.tag, filters.alias);
    },
    [filters, onFilter]
  );

  const handleTagChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilter(filters.category, e.target.value, filters.alias);
    },
    [filters, onFilter]
  );

  const handleAliasChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilter(filters.category, filters.tag, e.target.value);
    },
    [filters, onFilter]
  );

  if (compact) {
    return (
      <div className='flex gap-2 flex-wrap'>
        <label className='sr-only' htmlFor='category-select'>
          Category filter
        </label>
        <div className='relative'>
          <select
            id='category-select'
            className={`${selectClasses} min-w-[120px] bg-none pr-9`}
            value={filters.category}
            onChange={handleCategoryChange}
            aria-label='Filter emojis by category'>
            <option value=''>Categories</option>
            {categoryOptions}
          </select>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]'>
            <path d='m6 9 6 6 6-6' />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='hidden lg:flex gap-3 flex-wrap justify-start w-full'>
        <label className='sr-only' htmlFor='category-select'>
          Category filter
        </label>
        <select
          id='category-select'
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={filters.category}
          onChange={handleCategoryChange}
          aria-label='Filter emojis by category'>
          <option value=''>All Categories</option>
          {categoryOptions}
        </select>

        <label className='sr-only' htmlFor='tag-select'>
          Tag filter
        </label>
        <select
          id='tag-select'
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={filters.tag}
          onChange={handleTagChange}
          aria-label='Filter emojis by tag'>
          <option value=''>All Tags</option>
          {tagOptions}
        </select>

        <label className='sr-only' htmlFor='alias-select'>
          Alias filter
        </label>
        <select
          id='alias-select'
          className={`${selectClasses} min-w-[140px] max-w-[220px]`}
          value={filters.alias}
          onChange={handleAliasChange}
          aria-label='Filter emojis by alias'>
          <option value=''>All Aliases</option>
          {aliasOptions}
        </select>
      </div>

      {/* Mobile accordion */}
      <div className='lg:hidden flex flex-col gap-2'>
        <select
          className={`${selectClasses} w-full`}
          value={filters.category}
          onChange={handleCategoryChange}
          aria-label='Mobile filter by category'>
          <option value=''>All Categories</option>
          {categoryOptions}
        </select>
        <select
          className={`${selectClasses} w-full`}
          value={filters.tag}
          onChange={handleTagChange}
          aria-label='Mobile filter by tag'>
          <option value=''>All Tags</option>
          {tagOptions}
        </select>
        <select
          className={`${selectClasses} w-full`}
          value={filters.alias}
          onChange={handleAliasChange}
          aria-label='Mobile filter by alias'>
          <option value=''>All Aliases</option>
          {aliasOptions}
        </select>
      </div>
    </div>
  );
}
