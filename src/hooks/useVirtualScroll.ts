import { useState, useEffect, useRef } from 'react';

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
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualScroll(
  itemCount: number,
  { itemHeight, containerHeight, overscan = 5 }: VirtualScrollConfig
): VirtualScrollState {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount,
    startIndex + visibleItems + overscan * 2
  );
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

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleItems,
    containerRef,
  };
}
