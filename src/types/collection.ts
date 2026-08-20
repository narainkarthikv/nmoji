import type { Emoji } from './emoji';

export interface EmojiCollection {
  id: string;
  name: string;
  description?: string;
  emojis: string[];
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CollectionState {
  collections: EmojiCollection[];
  activeCollection: string;
  favorites: string[];
}

export type CollectionDraft = Pick<
  EmojiCollection,
  'name' | 'description' | 'emojis'
>;

export function collectionContains(
  collection: EmojiCollection,
  emoji: Emoji
): boolean {
  return collection.emojis.includes(emoji.emoji);
}
