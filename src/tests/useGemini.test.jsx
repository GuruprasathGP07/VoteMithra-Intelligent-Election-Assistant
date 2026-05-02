import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock sendMessage BEFORE importing the hook
vi.mock('../utils/gemini', () => ({
  sendMessage: vi.fn(() => Promise.resolve('Mock bot response')),
}));

import { useGemini } from '../hooks/useGemini';

describe('useGemini hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with one welcome message', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('model');
  });

  it('initializes with loading false', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.loading).toBe(false);
  });

  it('initializes with no error', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.error).toBeNull();
  });

  it('exposes sendQuery function', () => {
    const { result } = renderHook(() => useGemini());
    expect(typeof result.current.sendQuery).toBe('function');
  });

  it('exposes clearMessages function', () => {
    const { result } = renderHook(() => useGemini());
    expect(typeof result.current.clearMessages).toBe('function');
  });

  it('does not send whitespace-only messages', async () => {
    const { result } = renderHook(() => useGemini());
    const initialLen = result.current.messages.length;
    await act(async () => {
      await result.current.sendQuery('   ');
    });
    expect(result.current.messages).toHaveLength(initialLen);
  });

  it('adds user message on sendQuery', async () => {
    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendQuery('What is NOTA?');
    });
    const userMsg = result.current.messages.find(m => m.role === 'user');
    expect(userMsg).toBeDefined();
    expect(userMsg.parts[0].text).toBe('What is NOTA?');
  });

  it('adds bot response after user message', async () => {
    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendQuery('How do I vote?');
    });
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThanOrEqual(3);
    });
    const botMsgs = result.current.messages.filter(m => m.role === 'model');
    expect(botMsgs.length).toBeGreaterThanOrEqual(2);
  });

  it('clears to welcome message on clearMessages call', async () => {
    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendQuery('test message');
    });
    act(() => {
      result.current.clearMessages();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('model');
  });

  it('clears error on clearMessages call', () => {
    const { result } = renderHook(() => useGemini());
    act(() => {
      result.current.clearMessages();
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error on API failure', async () => {
    const { sendMessage } = await import('../utils/gemini');
    sendMessage.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendQuery('fail query');
    });
    expect(result.current.error).not.toBeNull();
  });

  it('sets rate limit error message on rate limit error', async () => {
    const { sendMessage } = await import('../utils/gemini');
    sendMessage.mockRejectedValueOnce(new Error('Rate limit exceeded'));

    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendQuery('any query');
    });
    expect(result.current.error).toMatch(/rate limit|chatbot\.error_rate_limit/i);
  });
});
