import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { Emoji } from '../types/emoji';
import { findRelatedEmojis } from '../utils/emoji';

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
    const isSmall =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
    if (isSmall) setOpenMobile(true);
  }, [emoji]);

  // Memoized related emojis calculation
  const relatedEmojis = useMemo(() => {
    if (!emoji) return [];
    return findRelatedEmojis(emoji, allEmojis, 12);
  }, [emoji, allEmojis]);

  // Memoized popular emojis (first 8, excluding current)
  const popularEmojis = useMemo(() => {
    if (!allEmojis?.length) return [];
    return allEmojis.filter((e) => e.emoji !== emoji?.emoji).slice(0, 8);
  }, [allEmojis, emoji]);

  // Memoized handler to prevent unnecessary re-renders of related emoji buttons
  const handleRelatedEmojiSelect = useCallback(
    (relatedEmoji: Emoji) => {
      onEmojiSelect(relatedEmoji);
    },
    [onEmojiSelect],
  );

  // Early exit if no emoji to display
  const shouldShowDetails = Boolean(emoji);

  return (
    <div>
      {/* Mobile header toggle */}
      <div className="lg:hidden mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Details</h3>
        <button
          aria-expanded={openMobile}
          aria-controls="emoji-detail"
          onClick={() => setOpenMobile((v) => !v)}
          className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 motion-safe:hover:scale-105 motion-safe:active:scale-95"
        >
          {openMobile ? 'Close' : 'Open'}
        </button>
      </div>

      <div
        id="emoji-detail"
        role="region"
        aria-label="Emoji details panel"
        className={`w-full bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md dark:shadow-lg transition-all duration-300 ease-out overflow-auto lg:overflow-visible lg:relative ${openMobile ? 'fixed left-4 right-4 bottom-4 z-40 max-h-[65vh] lg:static lg:max-h-none animate-slide-in-up lg:animate-none' : 'hidden lg:block'}`}
      >
        {!shouldShowDetails ? (
          <p
            className="text-center text-slate-500 dark:text-slate-400 opacity-80 py-8"
            role="status"
          >
            {defaultMessage || 'Loading emojis...'}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg bg-white shadow-md text-3xl dark:bg-slate-700"
                aria-hidden="true"
              >
                {emoji.emoji}
              </div>
              <div>
                <h2 className="text-xl font-semibold leading-tight">{emoji.description}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{emoji.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-300">
              {emoji.tags && emoji.tags.length > 0 && (
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

              {emoji.aliases && emoji.aliases.length > 0 && (
                <div>
                  <div className="font-medium text-slate-600 dark:text-slate-300">Aliases</div>
                  <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {emoji.aliases.join(', ')}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {relatedEmojis.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg animate-fade-in-up">
                  <h4 className="text-sm font-semibold">Related</h4>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {relatedEmojis.map((related, idx) => (
                      <button
                        key={`related-${related.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(related)}
                        title={related.description}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 motion-safe:hover:scale-110 motion-safe:hover:shadow-md motion-safe:active:scale-95"
                        aria-label={`Select ${related.description}`}
                      >
                        {related.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularEmojis.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <h4 className="text-sm font-semibold">Popular</h4>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {popularEmojis.map((popular, idx) => (
                      <button
                        key={`popular-${popular.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(popular)}
                        title={popular.description}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 motion-safe:hover:scale-110 motion-safe:hover:shadow-md motion-safe:active:scale-95"
                        aria-label={`Select ${popular.description}`}
                      >
                        {popular.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
