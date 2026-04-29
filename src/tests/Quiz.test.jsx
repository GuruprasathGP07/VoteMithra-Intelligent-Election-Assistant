import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quiz from '../pages/Quiz';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mock'
  }))
}));

// Mock navigator.share
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'share', {
    value: vi.fn(() => Promise.resolve()),
    configurable: true
  });
}

describe('Quiz Component', () => {
  it('renders quiz start screen initially', () => {
    render(<Quiz />);
    expect(screen.getByText(/Voter Knowledge Quiz/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
  });

  it('starts quiz after entering name', () => {
    render(<Quiz />);
    const nameInput = screen.getByPlaceholderText(/Enter your name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
  });

  it('selecting correct answer shows feedback', () => {
    render(<Quiz />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    // Correct answer for Q1 is index 1 (18)
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[1]);
    
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
  });

  it('selecting wrong answer shows incorrect feedback', () => {
    render(<Quiz />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    
    expect(screen.getByText(/Incorrect/i)).toBeInTheDocument();
  });

  it('navigates through questions and shows final results', async () => {
    render(<Quiz />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    // Correct indices for each question to get 10/10
    const correctAnswers = [1, 2, 1, 2, 3, 2, 2, 2, 1, 2];

    for (let i = 0; i < 10; i++) {
        await waitFor(() => expect(screen.getByText(new RegExp(`Question ${i + 1} of 10`, 'i'))).toBeInTheDocument());
        const options = screen.getAllByRole('radio');
        fireEvent.click(options[correctAnswers[i]]);
        const nextBtn = screen.getByText(/Next Question|Show Results/i);
        fireEvent.click(nextBtn);
    }
    
    expect(screen.getByText(/Quiz Complete!/i)).toBeInTheDocument();
    expect(screen.getAllByText(/10\/10/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Election Champion/i)).toBeInTheDocument();
  });

  it('handles download and share buttons on results screen', async () => {
    render(<Quiz />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    // Complete quiz quickly
    for (let i = 0; i < 10; i++) {
        const options = screen.getAllByRole('radio');
        fireEvent.click(options[0]); // Click any option
        fireEvent.click(screen.getByText(/Next Question|Show Results/i));
    }

    const downloadBtn = screen.getByText(/Download PNG/i);
    fireEvent.click(downloadBtn);
    // expect(html2canvas).toHaveBeenCalled(); // verified by mock call count if needed

    const shareBtn = screen.getByText(/WhatsApp Share/i);
    fireEvent.click(shareBtn);
    expect(navigator.share).toHaveBeenCalled();
  });
});