import React, { useState } from 'react';
import type { EmojiCollection } from '../types/collection';

interface Props {
  collections: EmojiCollection[];
  activeCollection: EmojiCollection;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (collection: EmojiCollection) => void;
  onDelete: (collection: EmojiCollection) => void;
}

export function CollectionsPanel({
  collections,
  activeCollection,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className='relative z-[70] min-w-0 flex-1 md:max-w-xs'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className='flex w-full items-center justify-between gap-3 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)]'>
        <span className='min-w-0 truncate'>
          📚 {activeCollection?.name ?? 'Collections'}{' '}
          <span className='text-[var(--color-text-secondary)]'>
            (
            {activeCollection?.id === 'all'
              ? 'all'
              : (activeCollection?.emojis.length ?? 0)}
            )
          </span>
        </span>
        <span aria-hidden='true'>⌄</span>
      </button>
      {open && (
        <div
          role='listbox'
          aria-label='Emoji collections'
          className='absolute left-0 right-0 top-full z-[70] mt-2 max-h-80 overflow-y-auto rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-2 shadow-xl'>
          {collections.map((collection) => (
            <div key={collection.id} className='group flex items-center gap-1'>
              <button
                type='button'
                role='option'
                aria-selected={collection.id === activeCollection?.id}
                onClick={() => {
                  onSelect(collection.id);
                  setOpen(false);
                }}
                className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] ${collection.id === activeCollection?.id ? 'font-semibold text-[var(--color-action-default)]' : ''}`}>
                <span>
                  {collection.id === activeCollection?.id ? '✓ ' : '  '}
                  {collection.name}
                </span>
                <span className='float-right text-[var(--color-text-secondary)]'>
                  {collection.id === 'all' ? 'all' : collection.emojis.length}
                </span>
              </button>
              {collection.id !== 'all' && (
                <button
                  type='button'
                  onClick={() => onEdit(collection)}
                  aria-label={`Edit ${collection.name}`}
                  className='rounded px-2 py-1 text-xs opacity-60 hover:bg-[var(--color-bg-secondary)] group-hover:opacity-100'>
                  ✎
                </button>
              )}
              {!collection.isDefault && (
                <button
                  type='button'
                  onClick={() => onDelete(collection)}
                  aria-label={`Delete ${collection.name}`}
                  className='rounded px-2 py-1 text-xs text-[var(--color-error)] opacity-60 hover:bg-[var(--color-bg-secondary)] group-hover:opacity-100'>
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type='button'
            onClick={() => {
              onCreate();
              setOpen(false);
            }}
            className='mt-2 w-full rounded-lg border border-dashed border-[var(--color-border-primary)] px-3 py-2 text-sm font-medium text-[var(--color-action-default)] hover:bg-[var(--color-bg-secondary)]'>
            ＋ Create Collection
          </button>
        </div>
      )}
    </div>
  );
}
