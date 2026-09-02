import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { EmojiGrid } from './EmojiGrid';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { EmojiDescription } from './EmojiDescription';
import { ThemeToggle } from './ThemeToggle';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { CombosPanel } from './CombosPanel';
import type { Emoji, ThemeMode } from '../types/emoji';
import { searchEmojis, filterEmojis } from '../utils/emoji';
import { getInitialTheme, saveTheme, applyTheme } from '../utils/theme';
import { setupKeyboardShortcuts } from '../utils/keyboard';
import { useCollections } from '../hooks/useCollections';
import { CollectionsPanel } from './CollectionsPanel';
import { CreateCollectionModal } from './CreateCollectionModal';
import type { EmojiCollection } from '../types/collection';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function EmojiApp() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeTab, setActiveTab] = useState<'app' | 'combos'>('app');
  const collections = useCollections(emojis);
  const [editingCollection, setEditingCollection] =
    useState<EmojiCollection | null>(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const isSmallScreen =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 1024px)').matches;
  // Fetch emoji data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadEmojis = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/NmojiList.json');
        if (!response.ok) {
          throw new Error('Failed to fetch emoji data');
        }
        const data: Emoji[] = await response.json();
        setEmojis(data);
        setFilteredEmojis(data);
        // Set first emoji as selected
        if (data.length > 0 && !isSmallScreen) {
          // Only auto-select on first page load on larger screens
          setSelectedEmoji(data[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        console.error('Error loading emoji data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmojis();
  }, []);

  const collectionEmojis = collections.visibleEmojis;

  // Apply theme to DOM
  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  // Setup global keyboard shortcuts
  useEffect(() => {
    if (emojis.length === 0) return;

    // Get unique categories from emojis
    const categories = Array.from(new Set(emojis.map((e) => e.category)));

    const unsubscribe = setupKeyboardShortcuts({
      help: () => setShowShortcuts(true),
      reset: () => {
        setFilteredEmojis(collectionEmojis);
      },
      category: (categoryIndex?: string) => {
        if (!categoryIndex) return;
        const index = parseInt(categoryIndex, 10) - 1; // Convert 1-9 to 0-8
        if (index >= 0 && index < categories.length) {
          const category = categories[index];
          const filtered = emojis.filter((e) => e.category === category);
          setFilteredEmojis(filtered);
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [emojis, collectionEmojis]);

  const handleSearch = useCallback(
    (query: string) => {
      const results = searchEmojis(collectionEmojis, query);
      setFilteredEmojis(results);
    },
    [collectionEmojis]
  );

  const handleFilter = useCallback(
    (category: string, tag: string, alias: string) => {
      const results = filterEmojis(
        collectionEmojis,
        category || undefined,
        tag || undefined,
        alias || undefined
      );
      setFilteredEmojis(results);
    },
    [collectionEmojis]
  );

  useEffect(() => {
    setFilteredEmojis(collectionEmojis);
  }, [collectionEmojis]);

  const selectCollection = useCallback(
    (id: string) => {
      collections.setActiveCollection(id);
    },
    [collections]
  );

  const openCreateCollection = useCallback(() => {
    setEditingCollection(null);
    setCollectionModalOpen(true);
  }, []);

  const openEditCollection = useCallback((collection: EmojiCollection) => {
    setEditingCollection(collection);
    setCollectionModalOpen(true);
  }, []);

  const saveCollection = useCallback(
    (draft: { name: string; description?: string; emojis: string[] }) => {
      if (editingCollection)
        collections.editCollection(editingCollection.id, draft);
      else collections.addCollection(draft);
    },
    [collections, editingCollection]
  );

  const deleteCollection = useCallback(
    (collection: EmojiCollection) => {
      if (window.confirm(`Delete “${collection.name}”? This cannot be undone.`))
        collections.deleteCollection(collection.id);
    },
    [collections]
  );

  const handleEmojiSelect = useCallback((emoji: Emoji) => {
    setSelectedEmoji(emoji);
    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emoji.emoji).catch((err) => {
        console.error('Clipboard error:', err);
      });
    }
  }, []);
  // Used to close the detail panel on small screens.
  const onClosePanel = useCallback(() => {
    setSelectedEmoji(null);
  }, []);
  const handleThemeToggle = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    const viewTransitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!viewTransitionDocument.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    // Disable per-component color transitions while the viewport snapshot fades.
    root.classList.add('theme-switching');
    const transition = viewTransitionDocument.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    transition.finished.then(
      () => root.classList.remove('theme-switching'),
      () => root.classList.remove('theme-switching')
    );
  }, [theme]);

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]'>
        <div className='text-center p-6'>
          <h2 className='text-2xl font-bold text-[var(--color-error)] mb-2'>
            Error Loading Emojis
          </h2>
          <p className='text-[var(--color-text-secondary)]'>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300'>
      {/* Header - Fixed height */}
      <header className='flex-shrink-0 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-primary)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3 min-w-0'>
              <a
                href='/'
                aria-label='Back to landing page'
                className='inline-flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] hover:bg-[var(--color-surface-secondary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] focus-visible:ring-[var(--color-action-default)]'>
                <span className='sr-only'>Back to home</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-[var(--color-text-primary)]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </a>

              <div className='min-w-0'>
                <h1 className='text-2xl font-extrabold tracking-tight truncate'>
                  Nmoji
                </h1>
                <p className='text-sm text-[var(--color-text-secondary)] truncate'>
                  Wisdom Fox emoji picker
                </p>
              </div>
            </div>

            <div className='flex min-w-0 items-center gap-3 flex-shrink-0'>
              <div
                className='flex items-center gap-1 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-1'
                role='tablist'
                aria-label='Emoji views'>
                <button
                  onClick={() => setActiveTab('app')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'app'
                      ? 'bg-[var(--color-action-default)] text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-primary)] hover:text-[var(--color-text-primary)]'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-secondary)]`}
                  role='tab'
                  aria-selected={activeTab === 'app'}
                  aria-controls='app-panel'>
                  🔍 Emojis
                </button>
                <button
                  onClick={() => setActiveTab('combos')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'combos'
                      ? 'bg-[var(--color-action-default)] text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-primary)] hover:text-[var(--color-text-primary)]'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg-secondary)]`}
                  role='tab'
                  aria-selected={activeTab === 'combos'}
                  aria-controls='combos-panel'>
                  ❤️ Combos
                </button>
              </div>
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar - Fixed height */}
      <div className='relative z-[60] flex-shrink-0 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-primary)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <div className='flex flex-col md:flex-row gap-3 items-stretch md:items-center'>
            <SearchBar onSearch={handleSearch} compact />
            <FilterBar
              onFilter={handleFilter}
              emojis={collectionEmojis}
              compact
            />
            <CollectionsPanel
              collections={collections.collections}
              activeCollection={collections.activeCollection}
              onSelect={selectCollection}
              onCreate={openCreateCollection}
              onEdit={openEditCollection}
              onDelete={deleteCollection}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Flexible, scrollable */}
      <main className='flex-1 overflow-hidden flex flex-col'>
        <div className='flex-1 overflow-hidden'>
          <div className='h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            {activeTab === 'app' ? (
              <div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8 h-full'>
                {/* Emoji Grid - Scrollable */}
                <section className='overflow-y-auto min-h-0'>
                  {isLoading ? (
                    <div className='text-center py-12'>
                      <p className='text-[var(--color-text-secondary)]'>
                        Loading emojis...
                      </p>
                    </div>
                  ) : (
                    <EmojiGrid
                      emojis={filteredEmojis}
                      onEmojiSelect={handleEmojiSelect}
                      selectedEmoji={selectedEmoji}
                    />
                  )}
                </section>

                {/* Emoji Description - Sticky */}
                {!!selectedEmoji && (
                  <aside className='overflow-y-auto min-h-0'>
                    <EmojiDescription
                      emoji={selectedEmoji}
                      allEmojis={emojis}
                      collections={collections.collections}
                      onToggleCollection={collections.toggleEmoji}
                      onEmojiSelect={handleEmojiSelect}
                      onClosePanel={onClosePanel}
                      defaultMessage={
                        !emojis.length
                          ? 'Loading emojis...'
                          : !selectedEmoji
                            ? 'Tap or click an emoji to see details'
                            : undefined
                      }
                    />
                  </aside>
                )}
              </div>
            ) : (
              <div id='combos-panel' className='h-full min-h-0 overflow-hidden'>
                <CombosPanel />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating keyboard shortcuts action */}
      <button
        onClick={() => setShowShortcuts(true)}
        className='fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-primary)] bg-[var(--color-action-default)] text-xl text-white shadow-lg transition-transform hover:scale-105 hover:bg-[var(--color-action-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-action-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]'
        title='Keyboard shortcuts (press ?)'
        aria-label='Show keyboard shortcuts'>
        ⌨️
      </button>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <CreateCollectionModal
        isOpen={collectionModalOpen}
        collection={editingCollection}
        collections={collections.collections}
        emojis={emojis}
        onClose={() => setCollectionModalOpen(false)}
        onSave={saveCollection}
      />
    </div>
  );
}
