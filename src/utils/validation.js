/**
 * Production-grade input validation helper.
 * Ensures data integrity before processing or sending to AI.
 * @param {string} text - The raw string to validate
 * @param {number} [minLength=2] - Minimum allowed characters
 * @param {number} [maxLength=500] - Maximum allowed characters
 * @returns {boolean} True if input is valid
 */
export const validateInput = (text, minLength = 2, maxLength = 500) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Global API Wrapper for consistent error handling and reporting.
 * @param {string} url - The target endpoint
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<{error?: boolean, message?: string, [key: string]: any}>}
 */
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[API ERROR] ${url}:`, error);
    }
    return {
      error: true,
      message: error.message || 'An unexpected error occurred',
    };
  }
};
