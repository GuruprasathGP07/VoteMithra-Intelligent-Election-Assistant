import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '../pages/Quiz';

describe('Quiz Page', () => {
  it('renders the start screen and starts the quiz', () => {
    render(<Quiz />);
    expect(screen.getByText('Voter Knowledge Quiz')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('Enter your name for the certificate');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    const startBtn = screen.getByText('Start Quiz (10 Questions)');
    fireEvent.click(startBtn);
    
    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
  });

  it('verifies first question and feedback', () => {
    render(<Quiz />);
    // Start quiz
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    // First question: "What is the minimum age to vote in India?"
    expect(screen.getByText(/What is the minimum age to vote in India\?/i)).toBeInTheDocument();
    
    // Click correct answer: 18 (index 1, so option B)
    const optionB = screen.getByText(/B\) 18/i);
    fireEvent.click(optionB);
    
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    expect(screen.getByText(/Article 326 guarantees voting rights/i)).toBeInTheDocument();
  });

  it('increments score on correct answer', () => {
    render(<Quiz />);
    // Start quiz
    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i), { target: { value: 'John' } });
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    // Correct answer for Q1 is 18
    fireEvent.click(screen.getByText(/B\) 18/i));
    
    // Click Next
    fireEvent.click(screen.getByText(/Next Question/i));
    
    // Should be on Q2
    expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument();
  });
});
