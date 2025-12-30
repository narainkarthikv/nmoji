// Lightweight debounce utility for scroll and resize events
export function useDebounce<T>(value: T, delay: number = 16): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Throttle for high-frequency events (like scroll)
export function useThrottle<T>(callback: (value: T) => void, value: T, delay: number = 16) {
  const lastRun = React.useRef(Date.now());
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(value);
      lastRun.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(value);
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay, callback]);
}
