/**
 * Production-grade input validation helper.
 * Ensures data integrity before processing or sending to AI.
 */
export const validateInput = (text, minLength = 2, maxLength = 500) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Global API Wrapper for consistent error handling and reporting.
 */
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
        console.error(`[API ERROR] ${url}:`, error);
    }
    return { 
        error: true, 
        message: error.message || "An unexpected error occurred" 
    };
  }
};
