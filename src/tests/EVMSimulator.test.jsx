import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EVMSimulator from '../pages/EVMSimulator';

describe('EVMSimulator Page', () => {
  it('renders 4 candidate buttons and NOTA', () => {
    render(<EVMSimulator />);
    expect(screen.getByLabelText('Vote for Candidate A')).toBeInTheDocument();
    expect(screen.getByLabelText('Vote for Candidate B')).toBeInTheDocument();
    expect(screen.getByLabelText('Vote for Candidate C')).toBeInTheDocument();
    expect(screen.getByLabelText('Vote for NOTA')).toBeInTheDocument();
  });

  it('shows VVPAT panel after clicking a candidate', async () => {
    vi.useFakeTimers();
    render(<EVMSimulator />);
    
    const voteBtn = screen.getByLabelText('Vote for Candidate A');
    fireEvent.click(voteBtn);
    
    // VVPAT shows after 1s
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText(/Visible for 7 seconds.../i)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Candidate A')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('verify NOTA button is present', () => {
    render(<EVMSimulator />);
    expect(screen.getByText(/NOTA — None of the Above/i)).toBeInTheDocument();
  });
});
