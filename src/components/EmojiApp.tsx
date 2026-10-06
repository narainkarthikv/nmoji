import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { EmojiGrid } from './EmojiGrid';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { EmojiDescription } from './EmojiDescription';
import { ThemeToggle } from './ThemeToggle';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { CombosPanel } from './CombosPanel';
import type { Emoji, ThemeMode } from '../types/emoji';
import { searchEmojis, filterEmojis, sanitizeEmojiData } from '../utils/emoji';
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
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    tag: '',
    alias: '',
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activeTab, setActiveTab] = useState<'app' | 'combos'>('app');
  const collections = useCollections(emojis);
  const [editingCollection, setEditingCollection] =
    useState<EmojiCollection | null>(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const isSmallScreen =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 1024px)').matches;
  // Fetch emoji data with a bounded timeout and retries for transient failures.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let activeController: AbortController | null = null;
    let mounted = true;
    const loadEmojis = async () => {
      setIsLoading(true);
      setError(null);
      for (let attempt = 0; attempt < 3; attempt++) {
        const controller = new AbortController();
        activeController = controller;
        let timedOut = false;
        const timeout = window.setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, 10000);
        try {
          const response = await fetch('/NmojiList.json', {
            signal: controller.signal,
          });
          if (!response.ok) {
            if (response.status === 404)
              throw new Error(
                'Emoji data was not found (404). Check that /NmojiList.json is deployed.'
              );
            if (response.status >= 500)
              throw new Error(
                `The server could not load emoji data (${response.status}). Please retry shortly.`
              );
            throw new Error(
              `Emoji data request failed (${response.status} ${response.statusText}).`
            );
          }
          let payload: unknown;
          try {
            payload = await response.json();
          } catch {
            throw new Error(
              'Emoji data returned invalid JSON. Check the deployed /NmojiList.json file.'
            );
          }
          const data = sanitizeEmojiData(payload);
          if (!mounted) return;
          setEmojis(data);
          if (data.length && !isSmallScreen) setSelectedEmoji(data[0]);
          setIsLoading(false);
          return;
        } catch (err) {
          if (!mounted) return;
          const message = err instanceof Error ? err.message : '';
          const finalError = timedOut
            ? new Error(
                'Loading emoji data timed out after 10 seconds. Check your connection and retry.'
              )
            : message.includes('404') ||
                message.includes('server') ||
                message.includes('valid') ||
                message.includes('not a list')
              ? new Error(message)
              : new Error(
                  'Could not reach emoji data. Check your connection and that this site is allowed to load its same-origin data (network or CORS failure).'
                );
          const permanentFailure =
            /404|invalid JSON|not a list|no valid emoji|server could not load/i.test(
              message
            );
          if (attempt === 2 || permanentFailure) {
            setError(finalError);
            setIsLoading(false);
            return;
          }
          await new Promise((resolve) =>
            window.setTimeout(resolve, 400 * (attempt + 1))
          );
          if (!mounted) return;
        } finally {
          window.clearTimeout(timeout);
        }
      }
    };
    loadEmojis();
    return () => {
      mounted = false;
      activeController?.abort();
    };
  }, [loadAttempt]);

  const collectionEmojis = collections.visibleEmojis;
  const currentEmojis = useMemo(
    () =>
      filterEmojis(
        searchEmojis(collectionEmojis, searchQuery),
        activeFilters.category || undefined,
        activeFilters.tag || undefined,
        activeFilters.alias || undefined
      ),
    [collectionEmojis, searchQuery, activeFilters]
  );

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
        setSearchQuery('');
        setActiveFilters({ category: '', tag: '', alias: '' });
      },
      category: (categoryIndex?: string) => {
        if (!categoryIndex) return;
        const index = parseInt(categoryIndex, 10) - 1; // Convert 1-9 to 0-8
        if (index >= 0 && index < categories.length) {
          const category = categories[index];
          setActiveFilters((current) => ({ ...current, category }));
        }
      },
    });

    return () => {
      unsubscribe();
    };
  }, [emojis]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilter = useCallback(
    (category: string, tag: string, alias: string) => {
      setActiveFilters({ category, tag, alias });
    },
    []
  );

  const selectCollection = useCallback(
    (id: string) => {
      collections.setActiveCollection(id);
      setActiveFilters({ category: '', tag: '', alias: '' });
      setSelectedEmoji(null);
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
          <button
            className='mt-4 rounded-lg bg-[var(--color-action-default)] px-4 py-2 text-white'
            onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
            Retry loading emojis
          </button>
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
            <SearchBar onSearch={handleSearch} value={searchQuery} compact />
            <FilterBar
              onFilter={handleFilter}
              emojis={collectionEmojis}
              filters={activeFilters}
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
                      emojis={currentEmojis}
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
