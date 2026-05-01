import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Timeline from '../pages/Timeline';

describe('ElectionTimeline Page', () => {
  it('renders all 6 phases', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );

    // With our mock, t(key) returns the key string
    expect(screen.getByText('timeline.reg_title')).toBeInTheDocument();
    expect(screen.getByText('timeline.nom_title')).toBeInTheDocument();
    expect(screen.getByText('timeline.cam_title')).toBeInTheDocument();
    expect(screen.getByText('timeline.sil_title')).toBeInTheDocument();
    expect(screen.getByText('timeline.pol_title')).toBeInTheDocument();
    expect(screen.getByText('timeline.res_title')).toBeInTheDocument();
  });

  it('renders the countdown card', () => {
    render(
      <BrowserRouter>
        <Timeline />
      </BrowserRouter>
    );
    expect(screen.getByText(/365 Days Left/i)).toBeInTheDocument();
  });
});
