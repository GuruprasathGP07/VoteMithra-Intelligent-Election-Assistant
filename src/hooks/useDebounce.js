import { useState, useEffect } from 'react';

/**
 * Custom hook that delays updating a value until after a wait period.
 * Useful for search inputs and API calls that should not fire on every keystroke.
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds (default: 500ms).
 * @returns {T} The debounced value.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
