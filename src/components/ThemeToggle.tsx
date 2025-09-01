import React from 'react';
import styled from 'styled-components';

const ToggleButton = styled.button`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  font-size: 1.5em;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

interface Props {
  theme: string;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <ToggleButton onClick={onToggle} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      {theme === 'light' ? '🌞' : '🌜'}
    </ToggleButton>
  );
}
