import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { Emoji } from '../types/emoji';
import { findRelatedEmojis } from '../utils/emoji';
import type { EmojiCollection } from '../types/collection';

interface Props {
  emoji: Emoji;
  allEmojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  defaultMessage?: string;
  onClosePanel: () => void;
  collections: EmojiCollection[];
  onToggleCollection: (collectionId: string, emoji: string) => void;
}

export function EmojiDescription({
  emoji,
  allEmojis,
  onEmojiSelect,
  onClosePanel,
  defaultMessage,
  collections,
  onToggleCollection,
}: Props) {
  const [openMobile, setOpenMobile] = useState(false);

  // Auto open mobile drawer when selection changes on small screens
  useEffect(() => {
    if (!emoji) return;
    const isSmall =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1024px)').matches;
    if (isSmall) setOpenMobile(true);
    else setOpenMobile(false);
  }, [emoji, window]);

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
      <div className='lg:hidden mb-3  relative flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Details</h3>
        <button
          aria-expanded={openMobile}
          aria-controls='emoji-detail'
          onClick={() => setOpenMobile((v) => !v)}
          className='px-3 py-1 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-sm hover:bg-[var(--color-surface-secondary)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'>
          {openMobile ? 'Close' : 'Open'}
        </button>
      </div>

      {/* Mobile overlay handles closing the panel */}
      {openMobile && (
        <div
          className=' w-full h-full fixed inset-0 z-30 bg-black/30 backdrop-blur-sm'
          onClick={() => onClosePanel()}
          aria-hidden='true'
        />
      )}

      <div
        id='emoji-detail'
        role='region'
        aria-label='Emoji details panel'
        className={`max-w-full rounded-xl z-50 border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-5 transition-all duration-200 ease-out overflow-auto lg:overflow-visible lg:relative ${openMobile ? 'fixed left-4 right-4 bottom-4 z-40 max-h-[65vh] lg:static lg:max-h-none animate-fade-in-up lg:animate-none' : 'hidden lg:block'}`}>
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

            <div className='rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-4'>
              <h4 className='text-sm font-semibold text-[var(--color-text-primary)]'>
                Collections
              </h4>
              <p className='mt-1 text-xs text-[var(--color-text-secondary)]'>
                Add or remove this emoji from your packs.
              </p>
              <div className='mt-3 space-y-2'>
                {collections
                  .filter((collection) => collection.id !== 'all')
                  .map((collection) => {
                    const included = collection.emojis.includes(emoji.emoji);
                    return (
                      <label
                        key={collection.id}
                        className='flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary)]'>
                        <input
                          type='checkbox'
                          checked={included}
                          onChange={() =>
                            onToggleCollection(collection.id, emoji.emoji)
                          }
                          className='h-4 w-4 accent-[var(--color-action-default)]'
                        />
                        {collection.name}
                        <span className='ml-auto text-xs text-[var(--color-text-secondary)]'>
                          {collection.emojis.length}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
              {relatedEmojis.length > 0 && (
                <div className='min-w-0 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-3 animate-fade-in-up'>
                  <h4 className='text-sm font-semibold'>Related</h4>
                  <div className='mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3'>
                    {relatedEmojis.map((related, idx) => (
                      <button
                        key={`related-${related.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(related)}
                        title={related.description}
                        className='flex aspect-square w-full items-center justify-center rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-lg transition-colors duration-200 hover:bg-[var(--color-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'
                        aria-label={`Select ${related.description}`}>
                        {related.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularEmojis.length > 0 && (
                <div
                  className='min-w-0 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-3 animate-fade-in-up'
                  style={{ animationDelay: '100ms' }}>
                  <h4 className='text-sm font-semibold'>Popular</h4>
                  <div className='mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3'>
                    {popularEmojis.map((popular, idx) => (
                      <button
                        key={`popular-${popular.emoji}-${idx}`}
                        onClick={() => handleRelatedEmojiSelect(popular)}
                        title={popular.description}
                        className='flex aspect-square w-full items-center justify-center rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] text-lg transition-colors duration-200 hover:bg-[var(--color-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'
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
