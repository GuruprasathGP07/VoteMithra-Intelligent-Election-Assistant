import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Eligibility from '../pages/Eligibility';

describe('Eligibility Page', () => {
  it('renders the Eligibility page and form', () => {
    render(<Eligibility />);
    expect(screen.getByText('Eligibility Checker')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Check My Eligibility')).toBeInTheDocument();
  });

  it('shows eligible message for DOB 20 years ago', () => {
    render(<Eligibility />);
    const dobInput = screen.getByLabelText('Date of Birth');
    const today = new Date();
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    fireEvent.change(dobInput, { target: { value: twentyYearsAgo.toISOString().split('T')[0] } });
    
    // Set other criteria to positive
    fireEvent.click(screen.getByLabelText('yes for Are you an Indian Citizen?'));
    fireEvent.click(screen.getByLabelText('no for Have you been declared of unsound mind by a court?'));
    fireEvent.click(screen.getByLabelText('no for Have you been disqualified by a court or ECI?'));
    
    fireEvent.click(screen.getByText('Check My Eligibility'));
    expect(screen.getByText('You are Eligible! ✓')).toBeInTheDocument();
  });

  it('shows underage message for DOB 5 years ago', () => {
    render(<Eligibility />);
    const dobInput = screen.getByLabelText('Date of Birth');
    const today = new Date();
    const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    fireEvent.change(dobInput, { target: { value: fiveYearsAgo.toISOString().split('T')[0] } });
    
    fireEvent.click(screen.getByText('Check My Eligibility'));
    expect(screen.getByText('Future Voter!')).toBeInTheDocument();
  });

  it('shows incorrect message for citizen=No', () => {
    render(<Eligibility />);
    const dobInput = screen.getByLabelText('Date of Birth');
    fireEvent.change(dobInput, { target: { value: '2000-01-01' } });
    
    fireEvent.click(screen.getByLabelText('no for Are you an Indian Citizen?'));
    fireEvent.click(screen.getByText('Check My Eligibility'));
    expect(screen.getByText('Not Eligible')).toBeInTheDocument();
    expect(screen.getByText(/Only Indian citizens can vote/)).toBeInTheDocument();
  });
});
