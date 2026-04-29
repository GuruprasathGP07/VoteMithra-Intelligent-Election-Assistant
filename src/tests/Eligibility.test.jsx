import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Eligibility from '../pages/Eligibility';

describe('Eligibility Component', () => {
  it('age below 18 shows ineligible', async () => {
    render(<Eligibility />);
    const dobInput = screen.getByLabelText(/Date of Birth/i);
    fireEvent.change(dobInput, { target: { value: '2015-01-01' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Check My Eligibility/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Future Voter/i)).toBeInTheDocument();
    });
  });

  it('age 18+ shows eligible when all criteria met', async () => {
    render(<Eligibility />);
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1995-01-01' } });
    
    // Select 'Yes' for citizenship
    fireEvent.click(screen.getByLabelText(/yes for are you an indian citizen/i));
    
    // Select 'No' for unsound mind
    fireEvent.click(screen.getByLabelText(/no for have you been declared of unsound mind/i));
    
    // Select 'No' for disqualified
    fireEvent.click(screen.getByLabelText(/no for have you been disqualified/i));
    
    fireEvent.click(screen.getByRole('button', { name: /Check My Eligibility/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/You are Eligible/i)).toBeInTheDocument();
    });
  });

  it('non-citizen shows ineligible', async () => {
    render(<Eligibility />);
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1995-01-01' } });
    
    fireEvent.click(screen.getByLabelText(/no for are you an indian citizen/i));
    
    fireEvent.click(screen.getByRole('button', { name: /Check My Eligibility/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Not Eligible/i)).toBeInTheDocument();
    });
  });
});
