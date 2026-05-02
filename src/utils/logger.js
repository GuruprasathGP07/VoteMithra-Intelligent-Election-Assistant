/**
 * Centralized logging utility for VoteMithra.
 * Use this instead of direct console.log/error/warn calls.
 */
export const logger = {
  /**
   * Logs general information. Only outputs in development mode.
   * @param {...any} args
   */
  log: (...args) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[VoteMithra]:', ...args);
    }
  },

  /**
   * Logs warnings.
   * @param {...any} args
   */
  warn: (...args) => {
    // eslint-disable-next-line no-console
    console.warn('[VoteMithra WARNING]:', ...args);
  },

  /**
   * Logs errors.
   * @param {...any} args
   */
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error('[VoteMithra ERROR]:', ...args);
  },
};
