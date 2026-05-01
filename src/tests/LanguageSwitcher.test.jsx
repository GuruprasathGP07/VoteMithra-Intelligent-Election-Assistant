import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../components/LanguageSwitcher';

describe('LanguageSwitcher Component', () => {
  it('renders all 6 language options', () => {
    const onChange = vi.fn();
    render(<LanguageSwitcher currentLang="en" onChange={onChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
    
    const codes = options.map(opt => opt.value);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('kn');
    expect(codes).toContain('ml');
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<LanguageSwitcher currentLang="en" onChange={onChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'ta' } });
    
    expect(onChange).toHaveBeenCalledWith('ta');
  });
});
