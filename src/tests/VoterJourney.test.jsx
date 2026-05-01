import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('VoterJourney on Home Page', () => {
  it('renders all 9 journey stops', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Check for IDs 1-9 that are rendered in the badges
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    
    // Check for specific keys from journey_stops translations (mock returns key)
    expect(screen.getByText(/journey_stops.eligible/i)).toBeInTheDocument();
    expect(screen.getByText(/journey_stops.registered/i)).toBeInTheDocument();
  });

  it('clicking a stop triggers navigation', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Click "Am I Eligible?" which has id "1"
    const stop1 = screen.getByText('1').closest('div');
    fireEvent.click(stop1);
    
    expect(mockNavigate).toHaveBeenCalledWith('/eligibility');
  });
});
