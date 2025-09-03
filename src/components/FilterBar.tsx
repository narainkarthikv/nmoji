import React, { useState, useEffect } from 'react';
import '../styles/FilterBar.css';

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
    <div className="filter-container">
      <select className="filter-select" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select className="filter-select" value={selectedTag} onChange={handleTagChange}>
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <select className="filter-select" value={selectedAlias} onChange={handleAliasChange}>
        <option value="">All Aliases</option>
        {aliases.map(alias => (
          <option key={alias} value={alias}>{alias}</option>
        ))}
      </select>
    </div>
  );
}
