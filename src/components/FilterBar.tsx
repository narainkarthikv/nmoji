import React, { useState, useEffect } from 'react';

interface Emoji {
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
  aliases?: string[];
}

interface Props {
  emojis: Emoji[];
  onFilter: (category: string, tag: string, alias: string) => void;
}

const selectClasses = `min-w-[140px] max-w-[220px] px-4 py-2 pr-9 border border-slate-200 rounded-2xl transition-all duration-200 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 text-sm cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[right_12px_center] bg-[length:14px] focus:border-blue-400 focus:shadow-[0_0_0_6px_rgba(59,130,246,0.08)] focus:outline-none hover:border-slate-300 dark:border-slate-700 md:min-w-[130px] md:py-1.5 md:px-3`;

export function FilterBar({ emojis, onFilter }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const uniqueCategories = new Set(emojis.map((emoji) => emoji.category));
    const uniqueTags = new Set(emojis.flatMap((emoji) => emoji.tags || []));
    const uniqueAliases = new Set(emojis.flatMap((emoji) => emoji.aliases || []));

    setCategories(Array.from(uniqueCategories));
    setTags(Array.from(uniqueTags));
    setAliases(Array.from(uniqueAliases));
  }, [emojis]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    onFilter(e.target.value, selectedTag, selectedAlias);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
    onFilter(selectedCategory, e.target.value, selectedAlias);
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlias(e.target.value);
    onFilter(selectedCategory, selectedTag, e.target.value);
  };

  return (
    <div>
      <div className="hidden lg:flex gap-3 flex-wrap justify-start w-full">
        <label className="sr-only" htmlFor="category-select">
          Category
        </label>
        <select
          id="category-select"
          className={selectClasses}
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="tag-select">
          Tag
        </label>
        <select
          id="tag-select"
          className={selectClasses}
          value={selectedTag}
          onChange={handleTagChange}
          aria-label="Filter by tag"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="alias-select">
          Alias
        </label>
        <select
          id="alias-select"
          className={selectClasses}
          value={selectedAlias}
          onChange={handleAliasChange}
          aria-label="Filter by alias"
        >
          <option value="">All Aliases</option>
          {aliases.map((alias) => (
            <option key={alias} value={alias}>
              {alias}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile accordion / compact */}
      <div className="lg:hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-filters"
        >
          <span className="text-sm font-medium">Filters</span>
          <span className="text-sm text-slate-500">{open ? 'Hide' : 'Show'}</span>
        </button>

        <div id="mobile-filters" className={`${open ? 'block' : 'hidden'} mt-2 space-y-2`}>
          <select
            className={selectClasses}
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
            className={selectClasses}
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
            className={selectClasses}
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
    </div>
  );
}
