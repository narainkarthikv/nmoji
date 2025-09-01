import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
  min-height: 350px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  border: 3px solid lightseagreen;
  padding: 16px;
  border-radius: 16px;
  background-color: #fff;
  width: 100%;
  max-width: 800px;
  align-items: start;
  justify-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-height: calc(100vh - 250px);
    padding: 12px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    padding: 8px;
    gap: 6px;
  }

  body.dark-mode & {
    background-color: #1e1e1e;
    border-color: #3a8b84;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

interface EmojiItemProps {
  selected?: boolean;
}

const EmojiItem = styled.div<EmojiItemProps>`
  text-align: center;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(1.2em + 0.5vw);
  border-radius: 12px;
  cursor: pointer;
  background-color: ${props => props.selected ? 'var(--primary-color)' : '#fff'};
  color: ${props => props.selected ? '#fff' : 'inherit'};
  box-shadow: ${props => props.selected 
    ? '0 4px 12px rgba(32, 178, 170, 0.2)' 
    : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
  position: relative;
  transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1)'};

  &:hover {
    transform: ${props => props.selected ? 'scale(1.05)' : 'translateY(-2px)'};
    box-shadow: ${props => props.selected 
      ? '0 6px 16px rgba(32, 178, 170, 0.3)' 
      : '0 4px 8px rgba(0, 0, 0, 0.1)'};
    background-color: ${props => props.selected 
      ? 'var(--primary-dark)' 
      : 'rgba(32, 178, 170, 0.1)'};
  }

  &:active {
    transform: ${props => props.selected ? 'scale(1.05)' : 'translateY(0)'};
  }

  @media (max-width: 768px) {
    font-size: calc(1em + 0.5vw);
  }

  @media (max-width: 480px) {
    font-size: calc(0.9em + 0.5vw);
  }

  body.dark-mode & {
    background-color: ${props => props.selected 
      ? 'var(--primary-color)' 
      : 'var(--card-background)'};
    box-shadow: ${props => props.selected 
      ? '0 4px 12px rgba(32, 178, 170, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.2)'};

    &:hover {
      box-shadow: ${props => props.selected 
        ? '0 6px 16px rgba(32, 178, 170, 0.4)' 
        : '0 4px 8px rgba(0, 0, 0, 0.3)'};
      background-color: ${props => props.selected 
        ? 'var(--primary-dark)' 
        : 'rgba(32, 178, 170, 0.15)'};
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
  onEmojiSelect: (emoji: Emoji) => void;
  selectedEmoji: Emoji | null;
}

export function EmojiGrid({ emojis, onEmojiSelect, selectedEmoji }: Props) {
  return (
    <Grid>
      {emojis.slice(0, 40).map((emoji, index) => (
        <EmojiItem
          key={emoji.emoji}
          onClick={() => onEmojiSelect(emoji)}
          title={`${emoji.description} - Category: ${emoji.category}`}
          style={{ 
            animationDelay: `${(Math.floor(index / 8) + index % 8) * 50}ms`,
            '--highlight': selectedEmoji?.emoji === emoji.emoji ? '1' : '0'
          } as React.CSSProperties}
          selected={selectedEmoji?.emoji === emoji.emoji}
        >
          {emoji.emoji}
        </EmojiItem>
      ))}
    </Grid>
  );
}
