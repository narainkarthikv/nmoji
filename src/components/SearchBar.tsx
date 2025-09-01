import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: calc(1rem + 0.2vw);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;
  outline: none;

  &:focus {
    border-color: lightseagreen;
    box-shadow: 0 0 0 3px rgba(32, 178, 170, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 10px 36px 10px 14px;
    font-size: 1rem;
  }

  body.dark-mode & {
    background-color: #2a2a2a;
    border-color: #404040;
    color: #e0e0e0;

    &:focus {
      border-color: #2a9d8f;
      box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
    }

    &::placeholder {
      color: #666;
    }
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 10px;
  font-size: 1.2em;
  color: gray;
  padding: 5px;
`;

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
    <SearchContainer>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search emojis..."
      />
      <SearchIcon>🔍</SearchIcon>
    </SearchContainer>
  );
}
