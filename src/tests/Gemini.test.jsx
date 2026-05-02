import { describe, it, expect, vi, beforeEach } from 'vitest';
/**
 * @vitest-environment node
 */
import { sendMessage, detectFakeNewsCloud, rateLimiter } from '../utils/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

// We mock the SDK directly to test our fallback and error handling logic
vi.mock('@google/generative-ai');

describe('Gemini Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateLimiter.calls = [];
  });

  describe('sendMessage', () => {
    it('throws error when rate limit is exceeded', async () => {
      rateLimiter.calls = new Array(50).fill(Date.now());
      await expect(sendMessage('Hi', 'en')).rejects.toThrow('Rate limit exceeded');
    });

    it('successfully sends a message with fallback logic', async () => {
      const mockResponse = { response: { text: () => 'Hello user' } };
      const mockSendMessage = vi.fn().mockResolvedValue(mockResponse);
      const mockStartChat = vi.fn().mockReturnValue({ sendMessage: mockSendMessage });
      
      GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
        startChat: mockStartChat
      });

      const result = await sendMessage('Hi', 'en');
      expect(result).toBe('Hello user');
      expect(mockSendMessage).toHaveBeenCalledWith('Hi');
    });

    it('falls back to next model on 503 error', async () => {
      const overloadedError = new Error('503 Service Unavailable');
      const successResponse = { response: { text: () => 'Fallback response' } };

      const mockGetModel = vi.fn()
        .mockReturnValueOnce({ // Primary fails
          startChat: () => ({ sendMessage: () => Promise.reject(overloadedError) })
        })
        .mockReturnValueOnce({ // Fallback 1 succeeds
          startChat: () => ({ sendMessage: () => Promise.resolve(successResponse) })
        });

      GoogleGenerativeAI.prototype.getGenerativeModel = mockGetModel;

      const result = await sendMessage('Hi', 'en');
      expect(result).toBe('Fallback response');
      expect(mockGetModel).toHaveBeenCalledTimes(2);
    });
  });

  describe('detectFakeNewsCloud', () => {
    it('successfully analyses content and parses JSON', async () => {
      const mockJson = JSON.stringify({
        score: 90,
        verdict: 'SAFE',
        reasoning: 'Verified source'
      });
      const mockResponse = { response: { text: () => mockJson } };
      
      GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await detectFakeNewsCloud('Voters must bring ID to the booth.');
      expect(result.score).toBe(90);
      expect(result.verdict).toBe('SAFE');
    });

    it('returns suspicious verdict on syntax error', async () => {
      const mockResponse = { response: { text: () => 'Invalid JSON' } };
      
      GoogleGenerativeAI.prototype.getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await detectFakeNewsCloud('This is a test message for analysis.');
      expect(result.verdict).toBe('SUSPICIOUS');
    });
  });
});
