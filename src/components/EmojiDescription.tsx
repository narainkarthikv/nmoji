import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { Emoji } from '../types/emoji';
import { findRelatedEmojis } from '../utils/emoji';

interface Props {
  emoji?: Emoji | null;
  allEmojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  defaultMessage?: string;
}

export function EmojiDescription({
  emoji,
  allEmojis,
  onEmojiSelect,
  defaultMessage,
}: Props) {
  const [openMobile, setOpenMobile] = useState(false);

  // Auto open mobile drawer when selection changes on small screens
  useEffect(() => {
    if (!emoji) return;
    const isSmall =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1024px)').matches;
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
    [onEmojiSelect]
  );

  // Early exit if no emoji to display
  const shouldShowDetails = Boolean(emoji);

  return (
    <div>
      {/* Mobile header toggle */}
      <div className='lg:hidden mb-3 flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Details</h3>
        <button
          aria-expanded={openMobile}
          aria-controls='emoji-detail'
          onClick={() => setOpenMobile((v) => !v)}
          className='px-3 py-1 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-sm hover:bg-[var(--color-surface-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'>
          {openMobile ? 'Close' : 'Open'}
        </button>
      </div>

      <div
        id='emoji-detail'
        role='region'
        aria-label='Emoji details panel'
        className={`w-full rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-5 transition-all duration-200 ease-out overflow-auto lg:overflow-visible lg:relative ${openMobile ? 'fixed left-4 right-4 bottom-4 z-40 max-h-[65vh] lg:static lg:max-h-none animate-fade-in-up lg:animate-none' : 'hidden lg:block'}`}>
        {!shouldShowDetails ? (
          <p
            className='text-center text-[var(--color-text-secondary)] opacity-80 py-8'
            role='status'>
            {defaultMessage || 'Loading emojis...'}
          </p>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div
                className='w-14 h-14 flex items-center justify-center rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)] text-3xl'
                aria-hidden='true'>
                {emoji.emoji}
              </div>
              <div>
                <h2 className='text-xl font-semibold leading-tight'>
                  {emoji.description}
                </h2>
                <p className='text-sm text-[var(--color-text-secondary)] mt-1'>
                  {emoji.category}
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-3 text-sm text-[var(--color-text-secondary)]'>
              {emoji.tags && emoji.tags.length > 0 && (
                <div>
                  <div className='font-medium text-[var(--color-text-primary)]'>
                    Tags
                  </div>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {emoji.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 rounded-full bg-[var(--color-bg-secondary)] text-xs'>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {emoji.aliases && emoji.aliases.length > 0 && (
                <div>
                  <div className='font-medium text-[var(--color-text-primary)]'>
                    Aliases
                  </div>
                  <div className='mt-1 text-sm text-[var(--color-text-secondary)]'>
                    {emoji.aliases.join(', ')}
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              {relatedEmojis.length > 0 && (
                <div className='bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] p-4 rounded-lg animate-fade-in-up'>
                  <h4 className='text-sm font-semibold'>Related</h4>
                  <div className='mt-3 grid grid-cols-6 gap-2'>
                    {relatedEmojis.map((related, idx) => (
                      <button
                        key={`related-${related.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(related)}
                        title={related.description}
                        className='w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'
                        aria-label={`Select ${related.description}`}>
                        {related.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularEmojis.length > 0 && (
                <div
                  className='bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] p-4 rounded-lg animate-fade-in-up'
                  style={{ animationDelay: '100ms' }}>
                  <h4 className='text-sm font-semibold'>Popular</h4>
                  <div className='mt-3 grid grid-cols-6 gap-2'>
                    {popularEmojis.map((popular, idx) => (
                      <button
                        key={`popular-${popular.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(popular)}
                        title={popular.description}
                        className='w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'
                        aria-label={`Select ${popular.description}`}>
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
