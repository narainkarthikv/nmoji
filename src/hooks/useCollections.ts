import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CollectionDraft, CollectionState } from '../types/collection';
import {
  createCollection,
  getEmojisInCollection,
  updateCollection,
} from '../utils/collections';
import {
  getInitialCollectionState,
  loadCollectionState,
  saveCollectionState,
} from '../utils/localStorage';
import { getDefaultCollection } from '../lib/defaultCollections';
import type { Emoji } from '../types/emoji';

export function useCollections(allEmojis: Emoji[]) {
  const [state, setState] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadCollectionState());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveCollectionState(state);
  }, [ready, state]);

  const activeCollection =
    state.collections.find(
      (collection) => collection.id === state.activeCollection
    ) ?? state.collections[0]!;
  const visibleEmojis = useMemo(
    () => getEmojisInCollection(allEmojis, activeCollection),
    [allEmojis, activeCollection]
  );
  const setActiveCollection = useCallback(
    (id: string) =>
      setState((current) => ({
        ...current,
        activeCollection: current.collections.some((item) => item.id === id)
          ? id
          : 'all',
      })),
    []
  );
  const addCollection = useCallback((draft: CollectionDraft) => {
    const collection = createCollection(draft);
    setState((current) => ({
      ...current,
      collections: [...current.collections, collection],
      activeCollection: collection.id,
    }));
    return collection;
  }, []);
  const editCollection = useCallback(
    (id: string, draft: CollectionDraft) =>
      setState((current) => ({
        ...current,
        collections: current.collections.map((item) =>
          item.id === id ? updateCollection(item, draft) : item
        ),
      })),
    []
  );
  const deleteCollection = useCallback(
    (id: string) =>
      setState((current) => ({
        ...current,
        collections: current.collections.filter((item) => item.id !== id),
        activeCollection:
          current.activeCollection === id ? 'all' : current.activeCollection,
      })),
    []
  );
  const resetCollection = useCallback(
    (id: string) =>
      setState((current) => ({
        ...current,
        collections: current.collections.map((item) =>
          item.id === id
            ? {
                ...getDefaultCollection(id)!,
                emojis: [...getDefaultCollection(id)!.emojis],
                updatedAt: Date.now(),
              }
            : item
        ),
      })),
    []
  );
  const toggleEmoji = useCallback(
    (id: string, emoji: string) =>
      setState((current) => ({
        ...current,
        collections: current.collections.map((item) =>
          item.id !== id || item.id === 'all'
            ? item
            : {
                ...item,
                emojis: item.emojis.includes(emoji)
                  ? item.emojis.filter((value) => value !== emoji)
                  : [...item.emojis, emoji],
                updatedAt: Date.now(),
              }
        ),
      })),
    []
  );
  return {
    ...state,
    activeCollection,
    visibleEmojis,
    setActiveCollection,
    addCollection,
    editCollection,
    deleteCollection,
    resetCollection,
    toggleEmoji,
  };
}
