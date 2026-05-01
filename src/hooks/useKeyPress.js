import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks whether a specific keyboard key is pressed.
 * Used for keyboard accessibility in EVM Simulator and Quiz.
 * @param {string} targetKey - The key to monitor (e.g., 'Enter', 'Escape').
 * @returns {boolean} True while the key is held down.
 */
export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(true);
    };
    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
