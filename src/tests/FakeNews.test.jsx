import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FakeNews from '../pages/FakeNews';
import { detectFakeNewsCloud } from '../utils/gemini';

// ✅ FIXED: mock returns { score, verdict, reasoning } to match updated FakeNews.jsx
vi.mock('../utils/gemini', () => ({
  detectFakeNewsCloud: vi.fn(() => Promise.resolve({
    score: 85,
    verdict: 'SAFE',
    reasoning: 'This is a verified election information.',
    flaggedKeywords: [],
    recommendedAction: 'Keep sharing good info.'
  })),
}));

describe('FakeNews Component', () => {
  const originalError = console.error;
  const originalAlert = window.alert;

  beforeEach(() => {
    console.error = vi.fn();
    window.alert = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalError;
    window.alert = originalAlert;
  });

  const moveToPhase2 = () => {
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText(/FAKE 👎/i));
      const nextBtn = screen.getByText(/Next Message →|Go to Custom AI Scanner/i);
      fireEvent.click(nextBtn);
    }
  };

  it('renders swipe challenge initially', () => {
    render(<FakeNews />);
    expect(screen.getByText(/Swipe Challenge/i)).toBeInTheDocument();
  });

  it('handles swipe interaction and shows feedback', () => {
    render(<FakeNews />);
    fireEvent.click(screen.getByText(/FAKE 👎/i));
    expect(screen.getByText(/Correct!|Incorrect/i)).toBeInTheDocument();
  });

  it('navigates through all swipes to phase 2', () => {
    render(<FakeNews />);
    moveToPhase2();
    expect(screen.getByText(/Custom AI Message Scanner/i)).toBeInTheDocument();
  });

  it('prevents analysis if input is empty', () => {
    render(<FakeNews />);
    moveToPhase2();
    fireEvent.click(screen.getByText(/Analyze with Gemini AI/i));
    expect(detectFakeNewsCloud).not.toHaveBeenCalled();
  });

  // ✅ FIXED: check for 'SAFE' not 'Safe Risk'
  it('displays result card after analysis in scanner', async () => {
    render(<FakeNews />);
    moveToPhase2();

    fireEvent.change(screen.getByPlaceholderText(/Example: 🚨/i), {
      target: { value: 'Valid input' }
    });
    fireEvent.click(screen.getByText(/Analyze with Gemini AI/i));

    const score = await screen.findByText('85');
    expect(score).toBeInTheDocument();
    expect(screen.getByText('SAFE')).toBeInTheDocument();
  });

  // ✅ FIXED: mock returns { score, verdict } — check for 'SUSPICIOUS' not 'Suspicious Risk'
  it('handles different risk levels (Suspicious, High)', async () => {
    detectFakeNewsCloud.mockResolvedValueOnce({
      score: 45,
      verdict: 'SUSPICIOUS',
      reasoning: 'Vague sources.',
      flaggedKeywords: ['urgent'],
      recommendedAction: 'Verify first.'
    });

    render(<FakeNews />);
    moveToPhase2();

    fireEvent.change(screen.getByPlaceholderText(/Example: 🚨/i), {
      target: { value: 'urgent news' }
    });
    fireEvent.click(screen.getByText(/Analyze with Gemini AI/i));

    const score = await screen.findByText('45');
    expect(score).toBeInTheDocument();
    expect(screen.getByText('SUSPICIOUS')).toBeInTheDocument();
  });

  // ✅ FIXED: check for inline alert banner, not window.alert()
  it('handles API error gracefully with inline error message', async () => {
    detectFakeNewsCloud.mockRejectedValueOnce(new Error('Cloud Fail'));

    render(<FakeNews />);
    moveToPhase2();

    fireEvent.change(screen.getByPlaceholderText(/Example: 🚨/i), {
      target: { value: 'test' }
    });
    fireEvent.click(screen.getByText(/Analyze with Gemini AI/i));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Analysis failed/i)).toBeInTheDocument();
    });
  });
});
