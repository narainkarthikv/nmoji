import { useState, useEffect, useRef, useCallback } from 'react';

interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleItems: number;
}

export function useVirtualScroll(
  itemCount: number,
  { itemHeight, containerHeight, overscan = 5 }: VirtualScrollConfig,
): VirtualScrollState {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(itemCount, startIndex + visibleItems + overscan * 2);
  const offsetY = startIndex * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Expose the container ref through a custom hook pattern
  useVirtualScroll.containerRef = containerRef;

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleItems,
  };
}

// Helper to get container ref
export function getVirtualScrollContainer() {
  return useVirtualScroll.containerRef;
}
