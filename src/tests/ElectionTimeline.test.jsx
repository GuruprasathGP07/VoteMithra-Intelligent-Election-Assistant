import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Timeline from '../pages/Timeline';

describe('Timeline Component', () => {
  it('all timeline phases render', () => {
    render(
      <MemoryRouter>
        <Timeline />
      </MemoryRouter>
    );
    // Use regex to be safe with mock behavior
    expect(screen.getByText(/timeline\.title/i)).toBeInTheDocument();
    expect(screen.getByText(/timeline\.reg_title/i)).toBeInTheDocument();
    expect(screen.getByText(/timeline\.pol_title/i)).toBeInTheDocument();
  });

  it('dates/countdown are displayed correctly', () => {
    render(
      <MemoryRouter>
        <Timeline />
      </MemoryRouter>
    );
    expect(screen.getByText(/365 Days Left/i)).toBeInTheDocument();
  });

  it('current phase is highlighted', () => {
    render(
      <MemoryRouter>
        <Timeline />
      </MemoryRouter>
    );
    const phases = screen.getAllByRole('heading', { level: 4 });
    expect(phases[0].closest('div')).toHaveClass('group');
  });
});
