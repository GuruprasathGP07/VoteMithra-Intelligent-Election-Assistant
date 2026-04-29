import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Module Mocks (Hoisted) ───────────────────────────────────────────────────
vi.mock('../utils/gemini', () => ({
  sendMessage: vi.fn(),
  APIError: class APIError extends Error { constructor(m) { super(m); this.name = 'APIError'; } },
  RateLimitError: class RateLimitError extends Error { constructor(m) { super(m); this.name = 'RateLimitError'; } },
  NetworkError: class NetworkError extends Error { constructor(m) { super(m); this.name = 'NetworkError'; } },
}));

vi.mock('../utils/analytics', () => ({
  logChatbotQuery: vi.fn(),
}));

vi.mock('../services/firebaseService', () => ({
  isFirebaseConfigured: false,
  db: {},
  ref: vi.fn(),
  push: vi.fn(() => Promise.resolve()),
}));

vi.mock('../utils/sanitize', () => ({
  sanitizeInput: vi.fn((text) => text),
}));

// ── Imports ──────────────────────────────────────────────────────────────────
import Chatbot from '../components/Chatbot';
import { sendMessage } from '../utils/gemini';

describe('Chatbot Component', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    // Default mock response resolves immediately
    sendMessage.mockResolvedValue('Mocked AI Response');
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly and starts in closed state', () => {
    render(<Chatbot />);
    expect(screen.getByRole('button', { name: /Open AI Voter Coach/i })).toBeInTheDocument();
    
    const chatPanel = screen.getByTestId('chatbot');
    expect(chatPanel).toHaveClass('opacity-0');
  });

  it('opens and displays welcome message when toggled', async () => {
    render(<Chatbot />);
    const toggleBtn = screen.getByRole('button', { name: /Open AI Voter Coach/i });
    
    await user.click(toggleBtn);
    
    expect(screen.getByTestId('chatbot')).toHaveClass('opacity-100');
    expect(screen.getByText(/chatbot\.welcome/i)).toBeInTheDocument();
  });

  it('handles user sending a message successfully', async () => {
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const input = screen.getByPlaceholderText(/chatbot\.placeholder/i);
    const sendBtn = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Hello VoteMitra');
    await user.click(sendBtn);

    // Verify message appeared
    expect(screen.getByText('Hello VoteMitra')).toBeInTheDocument();
    
    // Note: We don't check for loading-spinner here because the mock resolves too fast in tests,
    // causing a race condition where the spinner is already gone.
    
    // Wait for AI response to appear
    const aiResponse = await screen.findByText('Mocked AI Response');
    expect(aiResponse).toBeInTheDocument();
  });

  it('sends message on Enter key press', async () => {
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const input = screen.getByPlaceholderText(/chatbot\.placeholder/i);
    await user.type(input, 'Testing Enter{Enter}');

    expect(screen.getByText('Testing Enter')).toBeInTheDocument();
    expect(await screen.findByText('Mocked AI Response')).toBeInTheDocument();
  });

  it('does not send message for empty or whitespace input', async () => {
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const sendBtn = screen.getByRole('button', { name: /send/i });
    await user.click(sendBtn);
    
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('handles API failure gracefully', async () => {
    // Force a rejection
    sendMessage.mockRejectedValueOnce(new Error('Overloaded'));
    
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const input = screen.getByPlaceholderText(/chatbot\.placeholder/i);
    await user.type(input, 'Fail this{Enter}');

    // Should show error text
    const errorText = await screen.findByText(/chatbot\.error_message|overloaded/i);
    expect(errorText).toBeInTheDocument();
  });

  it('uses starter chips to trigger messages', async () => {
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const chips = screen.getAllByRole('listitem');
    await user.click(chips[0]);

    expect(sendMessage).toHaveBeenCalled();
    expect(await screen.findByText('Mocked AI Response')).toBeInTheDocument();
  });

  it('closes when the close button in header is clicked', async () => {
    render(<Chatbot />);
    await user.click(screen.getByRole('button', { name: /Open AI Voter Coach/i }));
    
    const closeBtn = screen.getByRole('button', { name: /Minimize Chat/i });
    await user.click(closeBtn);
    
    expect(screen.getByTestId('chatbot')).toHaveClass('opacity-0');
  });

  it('opens chat automatically when custom event is dispatched', async () => {
    render(<Chatbot />);
    
    act(() => {
      window.dispatchEvent(new Event('open-chatbot'));
    });
    
    expect(screen.getByTestId('chatbot')).toHaveClass('opacity-100');
  });
});
