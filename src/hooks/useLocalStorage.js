import { useState } from 'react';
import { logger } from '../utils/logger';

/**
 * Custom hook for syncing state to localStorage.
 * Provides persistent state that survives page refreshes.
 * @template T
 * @param {string} key - localStorage key to store value under.
 * @param {T} initialValue - Default value if key doesn't exist.
 * @returns {[T, Function]} Tuple of [storedValue, setValue].
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.warn(`useLocalStorage: Failed to read key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      logger.warn(`useLocalStorage: Failed to write key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
