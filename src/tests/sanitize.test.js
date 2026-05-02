import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHTML, createSafeHTML } from '../utils/sanitize';

describe('sanitizeInput', () => {
  it('removes script tags', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('removes html tags and returns text content', () => {
    const result = sanitizeInput('<b>bold</b>');
    expect(result).toBe('bold');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('handles null gracefully', () => {
    expect(sanitizeInput(null)).toBe('');
  });

  it('handles undefined gracefully', () => {
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('handles plain text unchanged', () => {
    expect(sanitizeInput('How do I vote?')).toBe('How do I vote?');
  });

  it('removes onclick attributes', () => {
    const result = sanitizeInput('<div onclick="evil()">click</div>');
    expect(result).not.toContain('onclick');
  });

  it('handles nested tags', () => {
    const result = sanitizeInput('<div><p><b>nested</b></p></div>');
    expect(result).toBe('nested');
  });
});

describe('sanitizeHTML', () => {
  it('returns empty string for null', () => {
    expect(sanitizeHTML(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(sanitizeHTML(undefined)).toBe('');
  });

  it('allows safe tags like b and i', () => {
    const result = sanitizeHTML('<b>bold</b> and <i>italic</i>');
    expect(result).toContain('<b>bold</b>');
    expect(result).toContain('<i>italic</i>');
  });

  it('removes script tags', () => {
    const result = sanitizeHTML('<script>evil()</script><p>safe</p>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>safe</p>');
  });

  it('removes disallowed tags but keeps text', () => {
    const result = sanitizeHTML('<marquee>hello</marquee>');
    expect(result).not.toContain('<marquee>');
    expect(result).toContain('hello');
  });
});

describe('createSafeHTML', () => {
  it('returns object with __html property', () => {
    const result = createSafeHTML('<b>hello</b>');
    expect(result).toHaveProperty('__html');
  });

  it('sanitizes the HTML content', () => {
    const result = createSafeHTML('<script>evil()</script><p>safe</p>');
    expect(result.__html).not.toContain('<script>');
    expect(result.__html).toContain('<p>safe</p>');
  });
});
