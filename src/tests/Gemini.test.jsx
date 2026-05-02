import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock BEFORE importing the module to ensure genAI is initialized correctly in tests
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn(() => Promise.resolve({
        response: { text: () => JSON.stringify({ score: 85, verdict: 'SAFE', reasoning: 'Looks fine' }) }
      })),
      startChat: vi.fn(() => ({
        sendMessage: vi.fn(() => Promise.resolve({
          response: { text: () => 'Mock response' }
        })),
      })),
    })),
  })),
}));

// Stub env before import
vi.stubEnv('VITE_GEMINI_API_KEY', 'mock-key');

import { sendMessage, detectFakeNewsCloud, rateLimiter } from '../utils/gemini';

describe('Gemini Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimiter.calls = [];
  });

  it('throws error when rate limit is exceeded', async () => {
    rateLimiter.calls = new Array(50).fill(Date.now());
    await expect(sendMessage('Hi', 'en')).rejects.toThrow('Rate limit exceeded');
  });

  it('successfully sends a message', async () => {
    const result = await sendMessage('What is NOTA?', 'en', []);
    expect(typeof result).toBe('string');
    expect(result).toBe('Mock response');
  });

  it('successfully analyses content and parses JSON', async () => {
    const result = await detectFakeNewsCloud('Test message');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('verdict');
    expect(result.score).toBe(85);
  });

  it('returns suspicious verdict on syntax error', async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => ({
      getGenerativeModel: vi.fn(() => ({
        generateContent: vi.fn(() => Promise.resolve({
          response: { text: () => 'invalid json {{{' }
        })),
      })),
    }));

    const result = await detectFakeNewsCloud('bad message');
    expect(result.verdict).toBe('SUSPICIOUS');
  });
});
