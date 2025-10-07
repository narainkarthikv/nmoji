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

const selectClasses = `min-w-[150px] max-w-[200px] px-4 py-2 pr-9 border-2 border-gray-200 rounded-full transition-all duration-200 bg-white dark:bg-card-background text-gray-800 dark:text-gray-200 text-sm cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[right_12px_center] bg-[length:14px] focus:border-primary focus:shadow-[0_0_0_3px_rgba(32,178,170,0.1)] focus:outline-none hover:border-primary dark:border-gray-600 dark:hover:bg-primary/10 hover:bg-primary/5 md:min-w-[130px] md:py-1.5 md:px-3`;

export function FilterBar({ emojis, onFilter }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAlias, setSelectedAlias] = useState('');

  useEffect(() => {
    const uniqueCategories = new Set(emojis.map(emoji => emoji.category));
    const uniqueTags = new Set(emojis.flatMap(emoji => emoji.tags || []));
    const uniqueAliases = new Set(emojis.flatMap(emoji => emoji.aliases || []));

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
    <div className="flex gap-3 flex-wrap justify-center w-full md:gap-2">
      <select className={selectClasses} value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category} className="bg-white dark:bg-card-background text-gray-800 dark:text-gray-200 p-2">{category}</option>
        ))}
      </select>
      <select className={selectClasses} value={selectedTag} onChange={handleTagChange}>
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag} value={tag} className="bg-white dark:bg-card-background text-gray-800 dark:text-gray-200 p-2">{tag}</option>
        ))}
      </select>
      <select className={selectClasses} value={selectedAlias} onChange={handleAliasChange}>
        <option value="">All Aliases</option>
        {aliases.map(alias => (
          <option key={alias} value={alias} className="bg-white dark:bg-card-background text-gray-800 dark:text-gray-200 p-2">{alias}</option>
        ))}
      </select>
    </div>
  );
}
