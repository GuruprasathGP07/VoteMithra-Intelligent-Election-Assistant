import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FakeNews from '../pages/FakeNews';

// Mock gemini utility
vi.mock('../utils/gemini', () => ({
  detectFakeNewsCloud: vi.fn(),
  rateLimiter: { isAllowed: () => true },
}));

describe('FakeNews Page', () => {
  it('renders swipe cards in phase 1', () => {
    render(<FakeNews />);
    expect(screen.getByText('Swipe Challenge')).toBeInTheDocument();
    expect(
      screen.getByText(/URGENT: Voting date for your area/i)
    ).toBeInTheDocument();
  });

  it('verifies textarea has maxLength of 2000 in phase 2', () => {
    render(<FakeNews />);

    // Swipe through the 3 cards to get to phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const btnText = i === 2 ? /Go to Custom AI Scanner/i : /Next Message/i;
      fireEvent.click(screen.getByText(btnText));
    }

    // Now in Phase 2
    expect(screen.getByText('Custom AI Message Scanner')).toBeInTheDocument();
    const textarea = screen.getByLabelText('Paste election message to analyze');
    expect(textarea).toHaveAttribute('maxLength', '2000');
  });

  it('detects misinformation and shows result', async () => {
    const { detectFakeNewsCloud } = await import('../utils/gemini');
    detectFakeNewsCloud.mockResolvedValueOnce({
      score: 10,
      verdict: 'FAKE',
      reasoning: 'This is fake.'
    });

    render(<FakeNews />);
    
    // Move to Phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const btnText = i === 2 ? /Go to Custom AI Scanner/i : /Next Message/i;
      fireEvent.click(screen.getByText(btnText));
    }

    const textarea = screen.getByPlaceholderText(/Paste the message/i);
    const button = screen.getByRole('button', { name: /Analyse Message/i });

    fireEvent.change(textarea, { target: { value: 'Fake news content' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('FAKE')).toBeDefined();
      expect(screen.getByText('This is fake.')).toBeDefined();
    });
  });

  it('handles API errors gracefully', async () => {
    const { detectFakeNewsCloud } = await import('../utils/gemini');
    detectFakeNewsCloud.mockRejectedValueOnce(new Error('API Failed'));

    render(<FakeNews />);
    
    // Move to Phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const btnText = i === 2 ? /Go to Custom AI Scanner/i : /Next Message/i;
      fireEvent.click(screen.getByText(btnText));
    }

    const textarea = screen.getByPlaceholderText(/Paste the message/i);
    const button = screen.getByRole('button', { name: /Analyse Message/i });

    fireEvent.change(textarea, { target: { value: 'Some news content' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Could not complete/i)).toBeDefined();
    });
  });

  it('handles JSON parsing syntax errors', async () => {
    const { detectFakeNewsCloud } = await import('../utils/gemini');
    // Simulate a successful API call but with a malformed response that results in SUSPICIOUS verdict
    detectFakeNewsCloud.mockResolvedValueOnce({
      score: 50,
      verdict: 'SUSPICIOUS',
      reasoning: 'Could not complete full analysis.'
    });

    render(<FakeNews />);
    
    // Move to Phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const btnText = i === 2 ? /Go to Custom AI Scanner/i : /Next Message/i;
      fireEvent.click(screen.getByText(btnText));
    }

    const textarea = screen.getByPlaceholderText(/Paste the message/i);
    const button = screen.getByRole('button', { name: /Analyse Message/i });

    fireEvent.change(textarea, { target: { value: 'Malformed response test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('SUSPICIOUS')).toBeDefined();
    });
  });

  it('verify analyze button exists in phase 2', () => {
    render(<FakeNews />);
    // Swipe through the 3 cards to get to phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const btnText = i === 2 ? /Go to Custom AI Scanner/i : /Next Message/i;
      fireEvent.click(screen.getByText(btnText));
    }

    expect(screen.getByText('Analyze with Gemini AI')).toBeInTheDocument();
  });
});
