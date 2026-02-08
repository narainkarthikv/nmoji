import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import type { Emoji } from '../types/emoji';

interface Props {
  emojis: Emoji[];
  onEmojiSelect: (emoji: Emoji) => void;
  selectedEmoji: Emoji | null;
}

export function EmojiGrid({ emojis, onEmojiSelect, selectedEmoji }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const COLUMN_COUNT = 9;
  const EMOJI_CELL_HEIGHT = 92;
  const OVERSCAN = 3;
  const SCROLL_THROTTLE = 16; // ~60fps

  const rowCount = Math.ceil(emojis.length / COLUMN_COUNT);
  const gridHeight = rowCount * EMOJI_CELL_HEIGHT;

  // Throttled scroll handler - update at most every 16ms (60fps)
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    setScrollTop(containerRef.current.scrollTop);
  }, []);

  // Attach throttled scroll listener
  useEffect(() => {
    if (!containerRef.current || containerHeight === 0) return;

    const container = containerRef.current;
    let lastScrollTime = Date.now();

    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime >= SCROLL_THROTTLE) {
        handleScroll();
        lastScrollTime = now;
      } else {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(handleScroll, SCROLL_THROTTLE);
      }
    };

    container.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [containerHeight, handleScroll, SCROLL_THROTTLE]);

  // Set container height on mount and resize with debouncing
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current?.parentElement) {
        setContainerHeight(containerRef.current.parentElement.clientHeight);
      }
    };

    updateHeight();
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize updates to avoid thrashing
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 100);
    });

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, emoji: Emoji) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEmojiSelect(emoji);
      }
    },
    [onEmojiSelect]
  );

  // Calculate visible row range for efficient rendering
  const visibleRowRange = useMemo(() => {
    const startRow = Math.max(
      0,
      Math.floor((scrollTop - OVERSCAN * EMOJI_CELL_HEIGHT) / EMOJI_CELL_HEIGHT)
    );
    const endRow = Math.min(
      rowCount,
      Math.ceil(
        (scrollTop + containerHeight + OVERSCAN * EMOJI_CELL_HEIGHT) /
          EMOJI_CELL_HEIGHT
      )
    );
    return { startRow, endRow };
  }, [scrollTop, containerHeight, rowCount]);

  // Render only visible rows to optimize DOM
  const visibleRows = useMemo(() => {
    const rows: React.ReactNode[] = [];
    const { startRow, endRow } = visibleRowRange;

    // Calculate spacer heights to maintain scroll behavior
    const offsetBefore = startRow * EMOJI_CELL_HEIGHT;
    const offsetAfter = (rowCount - endRow) * EMOJI_CELL_HEIGHT;

    // Top spacer to push visible content to correct scroll position
    if (offsetBefore > 0) {
      rows.push(
        <div key='spacer-before' style={{ height: `${offsetBefore}px` }} />
      );
    }

    for (let row = startRow; row < endRow; row++) {
      const rowStart = row * COLUMN_COUNT;
      const rowEmojis = emojis.slice(rowStart, rowStart + COLUMN_COUNT);

      rows.push(
        <div key={`row-${row}`} className='grid grid-cols-9 gap-3 md:gap-4'>
          {rowEmojis.map((emoji, colIndex) => {
            const index = rowStart + colIndex;

            return (
              <button
                key={`${emoji.emoji}-${index}`}
                onClick={() => onEmojiSelect(emoji)}
                onKeyDown={(e) => handleKeyDown(e, emoji)}
                aria-pressed={selectedEmoji?.emoji === emoji.emoji}
                aria-label={`${emoji.description}. Category: ${emoji.category}`}
                title={`${emoji.description} — ${emoji.category}`}
                className={`flex items-center justify-center aspect-square rounded-2xl p-2 transition-all duration-200 ease-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color-mix(in_srgb,var(--color-action-default)_70%,var(--color-action-hover)_30%)] focus:ring-offset-[var(--color-bg-primary)] bg-[color-mix(in_srgb,var(--color-surface-primary)_92%,transparent_8%)] text-2xl shadow-[0_12px_30px_-22px_rgba(0,0,0,0.55)] hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.55)] active:scale-95 motion-safe:hover:scale-105 motion-safe:active:scale-95 animate-pop-in
                  ${selectedEmoji?.emoji === emoji.emoji ? 'ring-2 ring-[color-mix(in_srgb,var(--color-action-default)_80%,var(--color-action-hover)_20%)] scale-110 bg-[color-mix(in_srgb,var(--color-action-default)_90%,var(--color-action-hover)_10%)] text-[var(--color-text-inverse)] shadow-[0_20px_50px_-22px_rgba(0,0,0,0.65)]' : 'hover:bg-[var(--color-surface-secondary)]'}`}
                style={{
                  animationDelay: `${(index % 12) * 15}ms`,
                  willChange: 'transform, opacity',
                }}>
                <span
                  className='leading-none text-[clamp(1.5rem,4vw,2.4rem)]'
                  aria-hidden='true'>
                  {emoji.emoji}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // Bottom spacer to maintain correct scroll height
    if (offsetAfter > 0) {
      rows.push(
        <div key='spacer-after' style={{ height: `${offsetAfter}px` }} />
      );
    }

    return rows;
  }, [
    emojis,
    visibleRowRange,
    selectedEmoji,
    COLUMN_COUNT,
    rowCount,
    EMOJI_CELL_HEIGHT,
  ]);

  return (
    <div className='w-full h-full flex flex-col'>
      <div
        ref={containerRef}
        className='flex-1 overflow-y-auto overflow-x-hidden w-full rounded-3xl border border-[color-mix(in_srgb,var(--color-border-primary)_80%,transparent_20%)] bg-[color-mix(in_srgb,var(--color-bg-secondary)_85%,transparent_15%)] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)]'
        role='region'
        aria-label='Emoji grid'>
        <div className='space-y-3 p-2 sm:p-3'>
          {visibleRows}
          {emojis.length === 0 && (
            <p
              className='text-center text-[var(--color-text-secondary)] py-12'
              role='status'>
              No emojis found. Try a different search or filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
