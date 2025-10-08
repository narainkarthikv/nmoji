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
    <div className="w-full">
      <div className="grid gap-4 auto-rows-fr grid-cols-[repeat(auto-fit,minmax(60px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(56px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(72px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(80px,1fr))]">
        {emojis.slice(0, 200).map((emoji, index) => {
          const isSelected = selectedEmoji?.emoji === emoji.emoji;
          return (
            <button
              key={emoji.emoji + index}
              onClick={() => onEmojiSelect(emoji)}
              aria-pressed={isSelected}
              aria-label={`${emoji.description}. Category ${emoji.category}`}
              title={`${emoji.description} — ${emoji.category}`}
              className={`flex items-center justify-center aspect-square rounded-2xl p-2 transition-transform duration-200 ease-in-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 hover:shadow-lg transform bg-white dark:bg-slate-800 text-2xl shadow-sm
                ${isSelected ? 'ring-2 ring-blue-400 scale-105 bg-blue-500 text-white shadow-xl' : 'hover:bg-blue-50 dark:hover:bg-slate-700'}`}
              style={{ animationDelay: `${(index % 8) * 30}ms` }}
            >
              <span className="leading-none text-[clamp(1.2rem,3.5vw,2.2rem)]" aria-hidden>
                {emoji.emoji}
              </span>
            </button>
          );
        })}
      </div>
      {emojis.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-6">No emojis found.</p>
      )}
    </div>
  );
}
