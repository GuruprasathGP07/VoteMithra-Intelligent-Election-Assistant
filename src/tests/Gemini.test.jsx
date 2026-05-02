import { describe, it, expect, vi, beforeEach } from 'vitest';

// Must be before ANY other imports
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn(() => Promise.resolve({
        response: {
          text: () => JSON.stringify({
            score: 85,
            verdict: 'SAFE',
            reasoning: 'Looks legitimate.',
          }),
        },
      })),
      startChat: vi.fn(() => ({
        sendMessage: vi.fn(() => Promise.resolve({
          response: { text: () => 'Mock chat response' },
        })),
      })),
    })),
  })),
}));

// Mock the gemini utils to ensure no real API calls happen during module load
vi.mock('../utils/gemini', () => ({
  sendMessage: vi.fn(() => Promise.resolve('Mock AI response')),
  detectFakeNewsCloud: vi.fn(() => Promise.resolve({
    score: 85,
    verdict: 'SAFE',
    reasoning: 'Looks legitimate.',
  })),
  rateLimiter: {
    calls: [],
    maxCalls: 10,
    windowMs: 60000,
    isAllowed: vi.fn(() => true),
  },
}));

// Stub env before import
vi.stubEnv('VITE_GEMINI_API_KEY', 'mock-key');

import { rateLimiter, sendMessage, detectFakeNewsCloud } from '../utils/gemini';

describe('Gemini Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when rate limit is exceeded', () => {
    rateLimiter.isAllowed.mockReturnValueOnce(false);
    expect(rateLimiter.isAllowed()).toBe(false);
  });

  it('allows calls under the rate limit', () => {
    rateLimiter.isAllowed.mockReturnValueOnce(true);
    expect(rateLimiter.isAllowed()).toBe(true);
  });

  it('successfully sends a message', async () => {
    const result = await sendMessage('What is NOTA?', 'en', []);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('successfully analyses content and parses JSON', async () => {
    const result = await detectFakeNewsCloud('Test message');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('verdict');
  });

  it('returns suspicious verdict on error', async () => {
    vi.mocked(detectFakeNewsCloud).mockResolvedValueOnce({
      score: 40,
      verdict: 'SUSPICIOUS',
      reasoning: 'Could not parse response.',
    });
    const result = await detectFakeNewsCloud('bad message');
    expect(result.verdict).toBe('SUSPICIOUS');
  });
});
