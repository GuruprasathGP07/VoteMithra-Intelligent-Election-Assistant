import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from '../components/Chatbot';

// Mock gemini utility with the correct function name
vi.mock('../utils/gemini', () => ({
  sendMessage: vi.fn().mockResolvedValue('Mock AI response'),
  rateLimiter: { isAllowed: () => true },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

vi.mock('../services/firebaseService', () => ({
  isFirebaseConfigured: true,
  db: {},
  ref: vi.fn(),
  push: vi.fn().mockResolvedValue({}),
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

  it('opens chat window when toggled', async () => {
    render(<Chatbot isOpen={false} />);
    const button = screen.getByLabelText(/Open AI Voter Coach/i);
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeDefined();
  });

  it('sends a message and displays AI response', async () => {
    render(<Chatbot isOpen={true} />);
    
    const input = screen.getByLabelText(/Type your election question/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'How do I register?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Mock AI response')).toBeDefined();
    });
  });
});
