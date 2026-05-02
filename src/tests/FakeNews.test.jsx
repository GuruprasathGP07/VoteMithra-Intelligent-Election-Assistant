import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FakeNews from '../pages/FakeNews';

// MUST be before component import
vi.mock('../utils/gemini', () => ({
  detectFakeNewsCloud: vi.fn(() => Promise.resolve({
    score: 25,
    verdict: 'FAKE',
    reasoning: 'This appears to be fake news.',
  })),
  sendMessage: vi.fn(() => Promise.resolve('Mock response')),
  rateLimiter: {
    calls: [],
    isAllowed: vi.fn(() => true),
  },
}));

describe('FakeNews Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders swipe cards in phase 1', () => {
    render(<FakeNews />);
    expect(screen.getByText('Swipe Challenge')).toBeInTheDocument();
  });

  it('detects misinformation and shows result', async () => {
    const user = userEvent.setup();
    render(<FakeNews />);
    
    // Navigate through swipe phase
    const textareas = screen.queryAllByRole('textbox');
    if (textareas.length === 0) {
      // Click through swipe cards to reach phase 2
      for (let i = 0; i < 3; i++) {
        const fakeButton = screen.getByLabelText('Mark as Fake');
        fireEvent.click(fakeButton);
        const nextButton = await screen.findByText(/Next|Scanner/i);
        fireEvent.click(nextButton);
      }
    }

    await waitFor(() => {
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'URGENT forward this voting date changed');

    const analyzeButton = screen.getByRole('button', { 
      name: /analyze/i 
    });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('FAKE')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('handles API errors gracefully', async () => {
    const { detectFakeNewsCloud } = await import('../utils/gemini');
    vi.mocked(detectFakeNewsCloud).mockRejectedValueOnce(new Error('Network error'));
    
    render(<FakeNews />);
    
    // Navigate to Phase 2
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByLabelText('Mark as Fake'));
      const nextButton = await screen.findByText(/Next|Scanner/i);
      fireEvent.click(nextButton);
    }

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'some message' } });
    const button = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analysis failed/i)).toBeInTheDocument();
    });
  });
});
