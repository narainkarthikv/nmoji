import type { CollectionState, EmojiCollection } from '../types/collection';
import { DEFAULT_COLLECTIONS } from '../lib/defaultCollections';

export const COLLECTIONS_STORAGE_KEY = 'nmoji-collections';
const STORAGE_VERSION = 1;

export function getInitialCollectionState(): CollectionState {
  return {
    collections: DEFAULT_COLLECTIONS.map((collection) => ({
      ...collection,
      emojis: [...collection.emojis],
    })),
    activeCollection: 'all',
    favorites: [],
  };
}

export function loadCollectionState(): CollectionState {
  if (typeof window === 'undefined') return getInitialCollectionState();
  try {
    const raw = window.localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!raw) return getInitialCollectionState();
    const parsed = JSON.parse(raw) as Partial<CollectionState> & {
      version?: number;
    };
    const collections = Array.isArray(parsed.collections)
      ? parsed.collections.filter(isCollection)
      : [];
    const defaults = getInitialCollectionState().collections;
    const merged = defaults.map(
      (fallback) =>
        collections.find((item) => item.id === fallback.id) ?? fallback
    );
    const custom = collections.filter(
      (item) => !item.isDefault && !merged.some((item2) => item2.id === item.id)
    );
    const allCollections = [...merged, ...custom].slice(0, 50);
    const activeCollection = allCollections.some(
      (item) => item.id === parsed.activeCollection
    )
      ? parsed.activeCollection!
      : 'all';
    return {
      collections: allCollections,
      activeCollection,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
    };
  } catch {
    return getInitialCollectionState();
  }
}

export function saveCollectionState(state: CollectionState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    COLLECTIONS_STORAGE_KEY,
    JSON.stringify({ ...state, version: STORAGE_VERSION })
  );
}

function isCollection(value: unknown): value is EmojiCollection {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<EmojiCollection>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    Array.isArray(item.emojis) &&
    typeof item.isDefault === 'boolean'
  );
}
