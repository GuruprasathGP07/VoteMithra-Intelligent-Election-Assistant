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
    render(<EVMSimulator />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    await screen.findByText(/VVPAT/i); // waits properly
  });

  it('verify NOTA button is present', () => {
    render(<EVMSimulator />);
    expect(screen.getByText(/NOTA — None of the Above/i)).toBeInTheDocument();
  });
});
