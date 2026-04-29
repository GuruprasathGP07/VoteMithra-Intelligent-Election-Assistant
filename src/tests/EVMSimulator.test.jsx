import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EVMSimulator from '../pages/EVMSimulator';

describe('EVMSimulator Component', () => {
  it('renders correctly', () => {
    render(<EVMSimulator />);
    expect(screen.getByText('EVM Simulator')).toBeInTheDocument();
    expect(screen.getByText('Candidate A — SUNFLOWER PARTY')).toBeInTheDocument();
  });

  it('candidate selection works', () => {
    render(<EVMSimulator />);
    const voteButton = screen.getByLabelText('Vote for Candidate A');
    fireEvent.click(voteButton);
    expect(screen.getByText('Vote Recorded')).toBeInTheDocument();
  });

  it('vote confirmation appears after casting', async () => {
    vi.useFakeTimers();
    render(<EVMSimulator />);
    const voteButton = screen.getByLabelText('Vote for Candidate A');
    fireEvent.click(voteButton);
    
    // Advance 1s to trigger VVPAT appearance
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Advance 7s for the VVPAT countdown
    await act(async () => {
      vi.advanceTimersByTime(7000);
    });
    
    expect(screen.getByText('Did the slip match your selection?')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('cannot vote twice', () => {
    render(<EVMSimulator />);
    const voteButtonA = screen.getByLabelText('Vote for Candidate A');
    const voteButtonB = screen.getByLabelText('Vote for Candidate B');
    
    fireEvent.click(voteButtonA);
    expect(voteButtonB).toBeDisabled();
  });

  it('aria-pressed attribute toggles correctly', () => {
    render(<EVMSimulator />);
    const voteButton = screen.getByLabelText('Vote for Candidate A');
    
    expect(voteButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(voteButton);
    expect(voteButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('reset works after verification', async () => {
    vi.useFakeTimers();
    render(<EVMSimulator />);
    fireEvent.click(screen.getByLabelText('Vote for Candidate A'));
    
    await act(async () => {
        vi.advanceTimersByTime(1000); // show VVPAT
    });
    await act(async () => {
        vi.advanceTimersByTime(7000); // finish countdown
    });
    
    const yesBtn = screen.getByRole('button', { name: /Yes/i });
    fireEvent.click(yesBtn);
    expect(screen.getByText(/Verification Successful/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/Test Again/i));
    expect(screen.queryByText(/Verification Successful/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Vote for Candidate A')).not.toBeDisabled();
    
    vi.useRealTimers();
  });
});
