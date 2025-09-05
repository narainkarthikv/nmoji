import React, { useMemo } from 'react';

interface Emoji {
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
  aliases?: string[];
}

interface Props {
  emoji?: Emoji | null;
  allEmojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  defaultMessage?: string;
}

export function EmojiDescription({ emoji, allEmojis, onEmojiSelect, defaultMessage }: Props) {
  const relatedEmojis = useMemo(() => {
    if (!emoji) return [];
    
    const relatedByTag = new Set<Emoji>();
    const relatedByCategory = new Set<Emoji>();

    if (emoji.tags) {
      emoji.tags.forEach(tag => {
        allEmojis.forEach(e => {
          if (e.emoji !== emoji.emoji && e.tags?.includes(tag)) {
            relatedByTag.add(e);
          }
        });
      });
    }

    allEmojis.forEach(e => {
      if (e.emoji !== emoji.emoji && e.category === emoji.category) {
        relatedByCategory.add(e);
      }
    });

    const related = Array.from(new Set([...relatedByTag, ...relatedByCategory]))
      .slice(0, 12);

    return related;
  }, [emoji, allEmojis]);

  const popularEmojis = useMemo(() => {
    if (!allEmojis?.length) return [];
    return allEmojis
      .filter(e => e.emoji !== emoji?.emoji)
      .slice(0, 8);
  }, [allEmojis, emoji]);

  return (
    <div className="w-[320px] p-5 border-2 border-primary rounded-2xl bg-white dark:bg-card-background shadow-md dark:shadow-lg transition-all duration-300 flex flex-direction-column gap-4 sticky top-[100px] lg:w-full lg:static">
      {defaultMessage || !emoji ? (
        <p className="text-center text-gray-600 dark:text-gray-400 opacity-70 text-lg my-5">
          {defaultMessage || "Loading emojis..."}
        </p>
      ) : (
        <>
          <div className="w-[50px] h-[50px] p-1.5 my-2.5 text-3xl rounded-[20px] bg-white shadow-md transition-all duration-300">{emoji.emoji}</div>
          <h3 className="capitalize text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">{emoji.description}</h3>
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 items-baseline">
            <span className="font-medium text-gray-700 dark:text-gray-300 opacity-80">Category:</span>
            <span className="text-gray-800 dark:text-gray-200">{emoji.category}</span>
            {emoji.tags && (
              <>
                <span className="font-medium text-gray-700 dark:text-gray-300 opacity-80">Tags:</span>
                <span className="text-gray-800 dark:text-gray-200">{emoji.tags.join(', ')}</span>
              </>
            )}
            {emoji.aliases && (
              <>
                <span className="font-medium text-gray-700 dark:text-gray-300 opacity-80">Aliases:</span>
                <span className="text-gray-800 dark:text-gray-200">{emoji.aliases.join(', ')}</span>
              </>
            )}
          </div>
        </>
      )}
      
      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 m-0 pt-2 border-t border-gray-200 dark:border-gray-700">Related Emojis</h4>
      <div className="grid grid-cols-5 gap-2.5 p-4 mt-4 border-3 border-[lightseagreen] rounded-lg bg-white/80 max-h-[200px] overflow-y-auto items-start justify-items-center">
        {relatedEmojis.map((related, index) => (
          <div
            key={related.emoji}
            className="w-[45px] h-[45px] text-2xl flex items-center justify-center rounded-lg shadow-sm opacity-0 animate-fade-in cursor-pointer"
            onClick={() => onEmojiSelect(related)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={related.description}
          >
            {related.emoji}
          </div>
        ))}
      </div>

      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 m-0 pt-2 border-t border-gray-200 dark:border-gray-700">Popular Emojis</h4>
      <div className="grid grid-cols-5 gap-2.5 p-4 mt-4 border-3 border-[lightseagreen] rounded-lg bg-white/80 max-h-[200px] overflow-y-auto items-start justify-items-center">
        {popularEmojis.map((popular, index) => (
          <div
            key={popular.emoji}
            className="w-[45px] h-[45px] text-2xl flex items-center justify-center rounded-lg shadow-sm opacity-0 animate-fade-in cursor-pointer"
            onClick={() => onEmojiSelect(popular)}
            style={{ animationDelay: `${(Math.floor(index / 4) + index % 4) * 0.05}s` }}
            title={popular.description}
          >
            {popular.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
