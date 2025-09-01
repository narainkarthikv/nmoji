import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

interface SelectProps {
  theme?: 'light' | 'dark';
}

const Select = styled.select<SelectProps>`
  min-width: 150px;
  max-width: 200px;
  padding: 8px 36px 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 20px;
  transition: all 0.2s ease;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  padding-right: 36px;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(32, 178, 170, 0.1);
    outline: none;
  }

  &:hover {
    border-color: var(--primary-color);
    background-color: ${props => props.theme === 'dark' 
      ? 'rgba(42, 157, 143, 0.1)' 
      : 'rgba(32, 178, 170, 0.05)'};
  }

  @media (max-width: 768px) {
    min-width: 130px;
    padding: 6px 32px 6px 12px;
  }

  option {
    background-color: var(--card-background);
    color: var(--text-color);
    padding: 8px;
  }
`;

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
    <FilterContainer>
      <Select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>
      <Select value={selectedTag} onChange={handleTagChange}>
        <option value="">All Tags</option>
        {tags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </Select>
      <Select value={selectedAlias} onChange={handleAliasChange}>
        <option value="">All Aliases</option>
        {aliases.map(alias => (
          <option key={alias} value={alias}>{alias}</option>
        ))}
      </Select>
    </FilterContainer>
  );
}
