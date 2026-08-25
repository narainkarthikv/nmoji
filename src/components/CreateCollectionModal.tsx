import React, { useEffect, useState } from 'react';
import type { CollectionDraft, EmojiCollection } from '../types/collection';
import type { Emoji } from '../types/emoji';
import { collectionNameExists } from '../utils/collections';
import { CollectionEditor } from './CollectionEditor';

interface Props {
  isOpen: boolean;
  collection?: EmojiCollection | null;
  collections: EmojiCollection[];
  emojis: Emoji[];
  onClose: () => void;
  onSave: (draft: CollectionDraft) => void;
}

export function CreateCollectionModal({
  isOpen,
  collection,
  collections,
  emojis,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const editing = Boolean(collection);

  useEffect(() => {
    if (isOpen) {
      setName(collection?.name ?? '');
      setDescription(collection?.description ?? '');
      setSelected(collection?.emojis ?? []);
      setError('');
    }
  }, [isOpen, collection]);
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError('Enter a collection name.');
    if (collectionNameExists(collections, name, collection?.id))
      return setError('That collection name is already in use.');
    onSave({ name, description, emojis: selected });
    onClose();
  };
  return (
    <div
      className='fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-3 backdrop-blur-sm sm:items-center'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <form
        onSubmit={submit}
        role='dialog'
        aria-modal='true'
        aria-labelledby='collection-modal-title'
        className='max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-5 shadow-2xl'>
        <div className='mb-5 flex items-center justify-between'>
          <div>
            <h2 id='collection-modal-title' className='text-lg font-semibold'>
              {editing ? 'Edit Collection' : 'Create New Collection'}
            </h2>
            <p className='mt-1 text-sm text-[var(--color-text-secondary)]'>
              Build a pack for the way you use emojis.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close collection modal'
            className='rounded-lg px-2 py-1 text-xl hover:bg-[var(--color-bg-secondary)]'>
            ×
          </button>
        </div>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='collection-name'
              className='mb-1 block text-sm font-medium'>
              Collection name
            </label>
            <input
              id='collection-name'
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              maxLength={40}
              className='w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-action-default)]'
            />
          </div>
          <div>
            <label
              htmlFor='collection-description'
              className='mb-1 block text-sm font-medium'>
              Description{' '}
              <span className='font-normal text-[var(--color-text-secondary)]'>
                (optional)
              </span>
            </label>
            <textarea
              id='collection-description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={120}
              rows={2}
              className='w-full resize-none rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-action-default)]'
            />
          </div>
          <CollectionEditor
            emojis={emojis}
            selected={selected}
            onChange={setSelected}
          />
          {error && (
            <p className='text-sm text-[var(--color-error)]' role='alert'>
              {error}
            </p>
          )}
        </div>
        <div className='mt-6 flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-[var(--color-border-primary)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-bg-secondary)]'>
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-lg bg-[var(--color-action-default)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-action-hover)]'>
            {editing ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}
