import React, { useMemo, useState } from 'react';
import type { Emoji } from '../types/emoji';

interface Props {
  emojis: Emoji[];
  selected: string[];
  onChange: (emojis: string[]) => void;
}

export function CollectionEditor({ emojis, selected, onChange }: Props) {
  const [query, setQuery] = useState('');
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    return emojis
      .filter(
        (emoji) =>
          !value ||
          `${emoji.emoji} ${emoji.description} ${emoji.category} ${(emoji.aliases ?? []).join(' ')}`
            .toLowerCase()
            .includes(value)
      )
      .slice(0, 80);
  }, [emojis, query]);
  const toggle = (emoji: string) =>
    onChange(
      selectedSet.has(emoji)
        ? selected.filter((item) => item !== emoji)
        : [...selected, emoji]
    );

  return (
    <div className='space-y-3'>
      <label
        className='block text-sm font-medium'
        htmlFor='collection-emoji-search'>
        Search & add emojis
      </label>
      <input
        id='collection-emoji-search'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Search emojis...'
        className='w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-action-default)]'
      />
      <div
        className='max-h-44 overflow-y-auto rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-2'
        role='listbox'
        aria-label='Choose emojis'
        aria-multiselectable='true'>
        <div className='grid grid-cols-8 gap-1 sm:grid-cols-10'>
          {results.map((emoji) => (
            <button
              type='button'
              key={emoji.emoji}
              role='option'
              aria-selected={selectedSet.has(emoji.emoji)}
              aria-label={`${selectedSet.has(emoji.emoji) ? 'Remove' : 'Add'} ${emoji.description}`}
              title={emoji.description}
              onClick={() => toggle(emoji.emoji)}
              className={`flex h-9 items-center justify-center rounded-md text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] ${selectedSet.has(emoji.emoji) ? 'bg-[var(--color-action-default)]' : 'hover:bg-[var(--color-surface-primary)]'}`}>
              {emoji.emoji}
            </button>
          ))}
        </div>
        {!results.length && (
          <p className='p-4 text-center text-sm text-[var(--color-text-secondary)]'>
            No emojis found.
          </p>
        )}
      </div>
      <div>
        <p className='mb-2 text-sm font-medium'>
          Selected emojis{' '}
          <span className='font-normal text-[var(--color-text-secondary)]'>
            ({selected.length})
          </span>
        </p>
        <div className='flex min-h-10 flex-wrap gap-1 rounded-lg bg-[var(--color-bg-secondary)] p-2 text-xl'>
          {selected.map((emoji) => (
            <button
              type='button'
              key={emoji}
              onClick={() => toggle(emoji)}
              aria-label={`Remove ${emoji}`}
              className='rounded px-1 hover:bg-[var(--color-surface-primary)]'>
              {emoji}
            </button>
          ))}
          {!selected.length && (
            <span className='text-sm text-[var(--color-text-muted)]'>
              Pick emojis above
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
