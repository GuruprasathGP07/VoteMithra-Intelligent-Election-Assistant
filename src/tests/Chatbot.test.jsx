import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from '../components/Chatbot';

// Mock Firebase before anything else
vi.mock('../services/firebaseService', () => ({
  isFirebaseConfigured: true,
  db: {},
  ref: vi.fn(),
  push: vi.fn().mockResolvedValue({}),
}));

vi.mock('../utils/gemini', () => ({
  sendMessage: vi.fn(() => Promise.resolve('Mock AI response')),
  rateLimiter: { calls: [], isAllowed: vi.fn(() => true) },
}));

vi.mock('../utils/analytics', () => ({
  logChatbotQuery: vi.fn(),
}));

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chatbot toggle button', async () => {
    render(<Chatbot isOpen={false} />);
    expect(screen.getByLabelText(/Open AI Voter Coach/i)).toBeDefined();
  });

  it('sends a message and displays AI response', async () => {
    render(<Chatbot isOpen={true} />);
    
    const input = screen.getByLabelText(/Type your election question/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'How do I register?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Mock AI response')).toBeDefined();
    }, { timeout: 10000 });
  });
});
