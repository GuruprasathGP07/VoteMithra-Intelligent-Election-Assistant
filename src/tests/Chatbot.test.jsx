import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from '../components/Chatbot';

describe('Chatbot Component', () => {
  it('renders toggle button with correct aria-label', () => {
    render(<Chatbot />);
    const toggleBtn = screen.getByLabelText(/Open AI Voter Coach/i);
    expect(toggleBtn).toBeInTheDocument();
  });

  it('opens chat panel on toggle click', () => {
    render(<Chatbot />);
    const toggleBtn = screen.getByLabelText(/Open AI Voter Coach/i);
    fireEvent.click(toggleBtn);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Voter Assistant Chat/i)).toBeInTheDocument();
  });

  it('input field has maxLength of 500', () => {
    render(<Chatbot isOpen={true} />);
    const input = screen.getByLabelText(/Type your election question/i);
    expect(input).toHaveAttribute('maxLength', '500');
  });
});
