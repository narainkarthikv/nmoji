import React from 'react';
import '../styles/EmojiGrid.css';

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
    <div className="emoji-grid">
      {emojis.slice(0, 40).map((emoji, index) => (
        <div
          key={emoji.emoji}
          className={`emoji-item ${selectedEmoji?.emoji === emoji.emoji ? 'selected' : ''}`}
          onClick={() => onEmojiSelect(emoji)}
          title={`${emoji.description} - Category: ${emoji.category}`}
          style={{ 
            animationDelay: `${(Math.floor(index / 8) + index % 8) * 50}ms`,
            '--highlight': selectedEmoji?.emoji === emoji.emoji ? '1' : '0'
          } as React.CSSProperties}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
