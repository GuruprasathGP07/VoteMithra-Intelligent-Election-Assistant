import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from '../components/Chatbot';

// Mock the Gemini service completely
vi.mock('../utils/gemini', () => ({
  askGemini: vi.fn().mockResolvedValue('This is a mock AI response.'),
}));

// Mock Firebase
vi.mock('../services/firebaseService', () => ({
  saveChatHistory: vi.fn().mockResolvedValue(true),
  loadChatHistory: vi.fn().mockResolvedValue([]),
}));

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat toggle button', () => {
    render(<Chatbot language="en" />);
    const toggleBtn = screen.getByRole('button', { name: /voter coach/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('opens chat panel when toggle is clicked', async () => {
    render(<Chatbot language="en" />);
    const toggleBtn = screen.getByRole('button', { name: /voter coach/i });
    fireEvent.click(toggleBtn);
    expect(screen.getByPlaceholderText(/ask a question/i)).toBeInTheDocument();
  });

  it('displays initial greeting message', () => {
    render(<Chatbot language="en" />);
    fireEvent.click(screen.getByRole('button', { name: /voter coach/i }));
    expect(screen.getByText(/namaste/i)).toBeInTheDocument();
  });

  it('has correct aria attributes for accessibility', () => {
    render(<Chatbot language="en" />);
    const toggleBtn = screen.getByRole('button', { name: /voter coach/i });
    expect(toggleBtn).toHaveAttribute('aria-expanded');
  });

  it('renders in Tamil language', () => {
    render(<Chatbot language="ta" />);
    expect(
      screen.getByRole('button', { name: /voter coach/i })
    ).toBeInTheDocument();
  });
});
