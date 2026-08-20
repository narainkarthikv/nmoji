import type { Emoji } from '../types/emoji';
import type { CollectionDraft, EmojiCollection } from '../types/collection';

export const MAX_COLLECTIONS = 50;

export function getEmojisInCollection(
  allEmojis: Emoji[],
  collection: EmojiCollection
): Emoji[] {
  if (collection.id === 'all') return allEmojis;
  const emojiSet = new Set(collection.emojis);
  return allEmojis.filter((emoji) => emojiSet.has(emoji.emoji));
}

export function createCollection(draft: CollectionDraft): EmojiCollection {
  const timestamp = Date.now();
  const id = `custom-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...draft,
    id,
    name: draft.name.trim(),
    description: draft.description?.trim(),
    emojis: [...new Set(draft.emojis)],
    isDefault: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateCollection(
  collection: EmojiCollection,
  draft: CollectionDraft
): EmojiCollection {
  return {
    ...collection,
    ...draft,
    name: draft.name.trim(),
    description: draft.description?.trim(),
    emojis: [...new Set(draft.emojis)],
    updatedAt: Date.now(),
  };
}

export function collectionNameExists(
  collections: EmojiCollection[],
  name: string,
  exceptId?: string
): boolean {
  return collections.some(
    (collection) =>
      collection.id !== exceptId &&
      collection.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
}
