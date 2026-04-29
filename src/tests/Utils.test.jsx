import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeInput, sanitizeHTML, createSafeHTML } from '../utils/sanitize';
import { logCustomEvent, logQuizStarted, logQuizCompleted, logEligibilityChecked } from '../utils/analytics';
import { logEvent as firebaseLogEvent } from "firebase/analytics";

// Mock firebase/analytics
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})), 
  logEvent: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(true))
}));

// Mock firebase/app
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}));

// Mock global fetch for BigQuery logging
global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

describe('Sanitize Utility', () => {
  it('sanitizeInput strips HTML tags', () => {
    const input = '<script>alert("xss")</script><b>Hello</b>';
    expect(sanitizeInput(input)).toBe('Hello');
  });

  it('sanitizeInput handles empty/null/undefined input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('sanitizeHTML allows safe tags and strips unsafe ones', () => {
    const input = '<p>Hello <b>World</b> <script>bad()</script></p>';
    const output = sanitizeHTML(input);
    expect(output).toContain('<p>Hello <b>World</b> </p>');
    expect(output).not.toContain('<script>');
  });

  it('sanitizeHTML handles empty/null/undefined input', () => {
    expect(sanitizeHTML('')).toBe('');
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
  });

  it('createSafeHTML returns object for dangerouslySetInnerHTML', () => {
    const input = '<b>Bold</b>';
    const result = createSafeHTML(input);
    expect(result).toHaveProperty('__html');
    expect(result.__html).toContain('<b>Bold</b>');
  });
});

describe('Analytics Utility', () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeEach(() => {
    console.error = vi.fn();
    console.warn = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  it('logCustomEvent handles missing eventName', () => {
    logCustomEvent('');
    expect(firebaseLogEvent).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    
    logCustomEvent(null);
    expect(firebaseLogEvent).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('logCustomEvent attempts BigQuery log if URL is present', () => {
    // Note: VITE_BIGQUERY_LOG_URL is present in our mock environment
    logCustomEvent('test_bq', { data: 123 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('logToBigQuery'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test_bq')
      })
    );
  });

  it('logQuizStarted calls logCustomEvent', () => {
    logQuizStarted('TestUser');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('quiz_started')
      })
    );
  });

  it('logEligibilityChecked logs correctly', () => {
    logEligibilityChecked(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('eligibility_checked')
      })
    );
  });

  it('handles fetch failures gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Fail'));
    // Should not throw
    expect(() => logCustomEvent('test_fail')).not.toThrow();
  });
});
