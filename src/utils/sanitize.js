import DOMPurify from 'dompurify';

/**
 * Sanitize plain text input to remove any HTML tags or script patterns.
 * @param {string} text - The raw input text.
 * @returns {string} - Cleaned text.
 */
export const sanitizeInput = (text) => {
  if (!text) return '';
  // Strip all HTML tags
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const cleanText = doc.body.textContent || "";
  // Further clean with DOMPurify to be safe
  return DOMPurify.sanitize(cleanText, { ALLOWED_TAGS: [] });
};

/**
 * Sanitize HTML content for safe rendering in components.
 * @param {string} html - The raw HTML string.
 * @returns {string} - Cleaned HTML string.
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

/**
 * Hook or helper for rendering sanitized HTML safely.
 */
export const createSafeHTML = (html) => ({
  __html: sanitizeHTML(html)
});
