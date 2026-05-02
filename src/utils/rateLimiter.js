/**
 * Client-side rate limiter to prevent API abuse.
 * Uses a sliding window algorithm.
 */

/**
 * Creates a rate limiter instance.
 * @param {number} maxCalls - Maximum calls allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ isAllowed: Function, getRemainingCalls: Function, reset: Function }}
 */
export const createRateLimiter = (maxCalls = 10, windowMs = 60000) => {
  let calls = [];

  return {
    /**
     * Checks if a new call is allowed under the rate limit.
     * @returns {boolean} True if allowed, false if limit exceeded
     */
    isAllowed() {
      const now = Date.now();
      calls = calls.filter((t) => now - t < windowMs);
      if (calls.length >= maxCalls) return false;
      calls.push(now);
      return true;
    },

    /**
     * Returns how many calls remain in the current window.
     * @returns {number} Remaining calls allowed
     */
    getRemainingCalls() {
      const now = Date.now();
      calls = calls.filter((t) => now - t < windowMs);
      return Math.max(0, maxCalls - calls.length);
    },

    /**
     * Resets the rate limiter call history.
     */
    reset() {
      calls = [];
    },
  };
};

// Pre-built limiters for each API
export const geminiLimiter = createRateLimiter(10, 60000);
export const fakeNewsLimiter = createRateLimiter(5, 60000);
export const legalCheckerLimiter = createRateLimiter(5, 60000);
export const mapsLimiter = createRateLimiter(20, 60000);
