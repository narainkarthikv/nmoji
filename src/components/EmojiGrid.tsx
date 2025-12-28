import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

  const COLUMN_COUNT = 9; // Base column count for desktop, will adjust responsively
  const EMOJI_CELL_HEIGHT = 92; // pixels (80px emoji + 12px gap)
  const OVERSCAN = 3; // Render 3 rows outside viewport

  // Calculate grid dimensions
  const rowCount = Math.ceil(emojis.length / COLUMN_COUNT);
  const gridHeight = rowCount * EMOJI_CELL_HEIGHT;

  // Calculate visible range based on scroll position
  useEffect(() => {
    if (!containerRef.current || containerHeight === 0) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      setScrollTop(containerRef.current.scrollTop);
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerHeight]);

  // Calculate visible emoji indices
  useEffect(() => {
    const startRow = Math.max(
      0,
      Math.floor((scrollTop - OVERSCAN * EMOJI_CELL_HEIGHT) / EMOJI_CELL_HEIGHT),
    );
    const endRow = Math.min(
      rowCount,
      Math.ceil((scrollTop + containerHeight + OVERSCAN * EMOJI_CELL_HEIGHT) / EMOJI_CELL_HEIGHT),
    );

    const newVisibleIndices = new Set<number>();
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < COLUMN_COUNT; col++) {
        const index = row * COLUMN_COUNT + col;
        if (index < emojis.length) {
          newVisibleIndices.add(index);
        }
      }
    }

    setVisibleIndices(newVisibleIndices);
  }, [scrollTop, containerHeight, emojis.length, rowCount]);

  // Set container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current?.parentElement) {
        setContainerHeight(containerRef.current.parentElement.clientHeight);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, emoji: Emoji) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEmojiSelect(emoji);
    }
  };

  // Memoize grid rows for better performance
  const visibleRows = useMemo(() => {
    const rows: React.ReactNode[] = [];

    for (let row = 0; row < rowCount; row++) {
      const rowStart = row * COLUMN_COUNT;
      const rowEmojis = emojis.slice(rowStart, rowStart + COLUMN_COUNT);

      rows.push(
        <div
          key={`row-${row}`}
          className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(64px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(60px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(72px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(80px,1fr))]"
        >
          {rowEmojis.map((emoji, colIndex) => {
            const index = rowStart + colIndex;
            const isVisible = visibleIndices.has(index);

            return (
              <button
                key={`${emoji.emoji}-${index}`}
                onClick={() => onEmojiSelect(emoji)}
                onKeyDown={(e) => handleKeyDown(e, emoji)}
                aria-pressed={selectedEmoji?.emoji === emoji.emoji}
                aria-label={`${emoji.description}. Category: ${emoji.category}`}
                title={`${emoji.description} — ${emoji.category}`}
                className={`flex items-center justify-center aspect-square rounded-2xl p-2 transition-all duration-150 ease-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:scale-105 hover:shadow-lg bg-white dark:bg-slate-800 text-2xl shadow-sm
                  ${selectedEmoji?.emoji === emoji.emoji ? 'ring-2 ring-blue-400 scale-110 bg-blue-500 text-white shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}
                  ${isVisible ? 'animate-pop-in' : 'opacity-0'}`}
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

    return rows;
  }, [emojis, rowCount, selectedEmoji, visibleIndices]);

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
