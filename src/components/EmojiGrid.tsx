import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
    [onEmojiSelect],
  );

  // Calculate visible row range for efficient rendering
  const visibleRowRange = useMemo(() => {
    const startRow = Math.max(
      0,
      Math.floor((scrollTop - OVERSCAN * EMOJI_CELL_HEIGHT) / EMOJI_CELL_HEIGHT),
    );
    const endRow = Math.min(
      rowCount,
      Math.ceil((scrollTop + containerHeight + OVERSCAN * EMOJI_CELL_HEIGHT) / EMOJI_CELL_HEIGHT),
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
      rows.push(<div key="spacer-before" style={{ height: `${offsetBefore}px` }} />);
    }

    for (let row = startRow; row < endRow; row++) {
      const rowStart = row * COLUMN_COUNT;
      const rowEmojis = emojis.slice(rowStart, rowStart + COLUMN_COUNT);

      rows.push(
        <div
          key={`row-${row}`}
          className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(64px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(60px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(72px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(80px,1fr))]"
        >
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
                className={`flex items-center justify-center aspect-square rounded-2xl p-2 transition-all duration-200 ease-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-800 text-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg active:scale-95 motion-safe:hover:scale-105 motion-safe:active:scale-95 animate-pop-in
                  ${selectedEmoji?.emoji === emoji.emoji ? 'ring-2 ring-blue-400 scale-110 bg-blue-500 text-white shadow-lg dark:shadow-2xl' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                style={{
                  animationDelay: `${(index % 12) * 15}ms`,
                  willChange: 'transform, opacity',
                }}
              >
                <span className="leading-none text-[clamp(1.5rem,4vw,2.4rem)]" aria-hidden="true">
                  {emoji.emoji}
                </span>
              </button>
            );
          })}
        </div>,
      );
    }

    // Bottom spacer to maintain correct scroll height
    if (offsetAfter > 0) {
      rows.push(<div key="spacer-after" style={{ height: `${offsetAfter}px` }} />);
    }

    return rows;
  }, [emojis, visibleRowRange, selectedEmoji, COLUMN_COUNT, rowCount, EMOJI_CELL_HEIGHT]);

  return (
    <div className="w-full h-full flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden w-full"
        role="region"
        aria-label="Emoji grid"
      >
        <div className="space-y-3 p-1">
          {visibleRows}
          {emojis.length === 0 && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-12" role="status">
              No emojis found. Try a different search or filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
