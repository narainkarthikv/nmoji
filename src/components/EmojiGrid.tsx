import React from 'react';

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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3 min-h-[350px] max-h-[calc(100vh-200px)] overflow-y-auto border-3 border-[lightseagreen] p-4 rounded-2xl bg-white w-full max-w-[800px] items-start justify-items-center transition-all duration-300 shadow-md dark:bg-card-background dark:border-[#3a8b84] dark:shadow-lg md:max-h-[calc(100vh-250px)] md:p-3 md:gap-2 sm:grid-cols-[repeat(auto-fill,minmax(50px,1fr))] sm:p-2 sm:gap-1.5">
      {emojis.slice(0, 40).map((emoji, index) => (
        <div
          key={emoji.emoji}
          className={`text-center w-full aspect-square flex items-center justify-center text-[calc(1.2em+0.5vw)] rounded-xl cursor-pointer bg-white text-inherit shadow-sm transition-all duration-200 animate-fade-in opacity-0 relative scale-100 hover:translate-y-[-2px] hover:shadow-md hover:bg-primary/10 md:text-[calc(1em+0.5vw)] sm:text-[calc(0.9em+0.5vw)] dark:bg-card-background dark:shadow-md dark:hover:shadow-lg dark:hover:bg-primary/15
            ${selectedEmoji?.emoji === emoji.emoji ? 'bg-primary text-white shadow-lg scale-105 hover:shadow-xl hover:bg-primary-dark dark:bg-primary dark:shadow-xl dark:hover:shadow-2xl' : ''}`}
          onClick={() => onEmojiSelect(emoji)}
          title={`${emoji.description} - Category: ${emoji.category}`}
          style={{ 
            animationDelay: `${(Math.floor(index / 8) + index % 8) * 50}ms`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}
