import React, { useMemo, useState, useEffect } from 'react';

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
  const [openMobile, setOpenMobile] = useState(false);

  // Auto open mobile drawer when selection changes on small screens
  useEffect(() => {
    if (!emoji) return;
    // Simple media check
    const isSmall =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
    if (isSmall) setOpenMobile(true);
  }, [emoji]);
  const relatedEmojis = useMemo(() => {
    if (!emoji) return [];

    const relatedByTag = new Set<Emoji>();
    const relatedByCategory = new Set<Emoji>();

    if (emoji.tags) {
      emoji.tags.forEach((tag) => {
        allEmojis.forEach((e) => {
          if (e.emoji !== emoji.emoji && e.tags?.includes(tag)) {
            relatedByTag.add(e);
          }
        });
      });
    }

    allEmojis.forEach((e) => {
      if (e.emoji !== emoji.emoji && e.category === emoji.category) {
        relatedByCategory.add(e);
      }
    });

    const related = Array.from(new Set([...relatedByTag, ...relatedByCategory])).slice(0, 12);

    return related;
  }, [emoji, allEmojis]);

  const popularEmojis = useMemo(() => {
    if (!allEmojis?.length) return [];
    return allEmojis.filter((e) => e.emoji !== emoji?.emoji).slice(0, 8);
  }, [allEmojis, emoji]);

  return (
    <div>
      {/* Mobile header toggle */}
      <div className="lg:hidden mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Details</h3>
        <button
          aria-expanded={openMobile}
          aria-controls="emoji-detail"
          onClick={() => setOpenMobile((v) => !v)}
          className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          {openMobile ? 'Close' : 'Open'}
        </button>
      </div>

      <div
        id="emoji-detail"
        role="region"
        aria-label="Emoji details panel"
        className={`w-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md dark:shadow-lg transition-all duration-300 overflow-hidden lg:relative ${openMobile ? 'fixed left-4 right-4 bottom-4 z-40 max-h-[65vh] lg:static lg:max-h-none' : ''}`}
      >
        {defaultMessage || !emoji ? (
          <p className="text-center text-slate-500 dark:text-slate-400 opacity-80 py-8">
            {defaultMessage || 'Loading emojis...'}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-white shadow-md text-3xl dark:bg-slate-700">
                {emoji.emoji}
              </div>
              <div>
                <h2 className="text-xl font-semibold leading-tight">{emoji.description}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{emoji.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-300">
              {emoji.tags && (
                <div>
                  <div className="font-medium text-slate-600 dark:text-slate-300">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {emoji.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {emoji.aliases && (
                <div>
                  <div className="font-medium text-slate-600 dark:text-slate-300">Aliases</div>
                  <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {emoji.aliases.join(', ')}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="card bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                <h4 className="text-sm font-semibold">Related</h4>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {relatedEmojis.map((related, idx) => (
                    <button
                      key={related.emoji + idx}
                      onClick={() => onEmojiSelect(related)}
                      title={related.description}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:scale-105 transition shadow-sm"
                      aria-label={`Select ${related.description}`}
                    >
                      {related.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                <h4 className="text-sm font-semibold">Popular</h4>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {popularEmojis.map((popular, idx) => (
                    <button
                      key={popular.emoji + idx}
                      onClick={() => onEmojiSelect(popular)}
                      title={popular.description}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:scale-105 transition shadow-sm"
                      aria-label={`Select ${popular.description}`}
                    >
                      {popular.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
