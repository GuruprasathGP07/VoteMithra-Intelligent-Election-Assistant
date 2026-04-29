import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import LanguageSwitcher from '../components/LanguageSwitcher';
// Import the singleton mock so we assert on the exact same reference
import { changeLanguageMock } from './setup.js';

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    changeLanguageMock.mockClear();
  });

  it('renders with correct default selection', () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('en');
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('contains all 6 language options', () => {
    render(<LanguageSwitcher />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
    expect(screen.getByText('தமிழ்')).toBeInTheDocument();
  });

  it('changing selection calls changeLanguage', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);
    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'ta');

    expect(changeLanguageMock).toHaveBeenCalledWith('ta');
    expect(localStorage.setItem).toHaveBeenCalledWith('voteMitra_lang', 'ta');
  });

  it('select container has correct styles', () => {
    render(<LanguageSwitcher />);
    const container = screen.getByRole('combobox').closest('div');
    expect(container).toHaveClass('bg-bg-main');
    expect(container).toHaveClass('border-border-gray');
  });
});
