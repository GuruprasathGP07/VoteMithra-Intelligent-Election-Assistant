import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeInput } from '../utils/sanitize';
import { rateLimiter } from '../utils/gemini';
import { validateInput } from '../utils/validation';

describe('Utility Functions', () => {
  describe('sanitizeInput', () => {
    it('removes script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('removes onclick attributes', () => {
      const input = '<button onclick="alert(1)">Click me</button>';
      // sanitizeInput strips all tags based on the implementation
      expect(sanitizeInput(input)).toBe('Click me');
    });

    it('handles empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('handles normal text', () => {
      const input = 'Normal text';
      expect(sanitizeInput(input)).toBe('Normal text');
    });
  });

  describe('rateLimiter', () => {
    beforeEach(() => {
      rateLimiter.calls = [];
    });

    it('allows calls under limit', () => {
      for (let i = 0; i < 10; i++) {
        expect(rateLimiter.isAllowed()).toBe(true);
      }
    });

    it('blocks calls over limit', () => {
      for (let i = 0; i < 10; i++) {
        rateLimiter.isAllowed();
      }
      expect(rateLimiter.isAllowed()).toBe(false);
    });
  });

  describe('inputValidation', () => {
    it('rejects strings over maxLength', () => {
      const longString = 'a'.repeat(501);
      expect(validateInput(longString, 2, 500)).toBe(false);
    });

    it('accepts valid strings', () => {
      expect(validateInput('Valid input', 2, 500)).toBe(true);
    });
  });
});
