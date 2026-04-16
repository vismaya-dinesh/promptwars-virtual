import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WaitTimePanel from '../components/WaitTimePanel';
import React from 'react';

describe('WaitTimePanel', () => {
  it('renders nothing when missing wait_times', () => {
    const { container } = render(<WaitTimePanel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders wait times correctly and accessible', () => {
    const mockTimes = { food_stand: 15, restroom: 5 };
    render(<WaitTimePanel wait_times={mockTimes} />);
    
    expect(screen.getByText('Wait Times')).toBeInTheDocument();
    
    expect(screen.getByLabelText('Wait time for food stand is 15 minutes')).toBeInTheDocument();
    expect(screen.getByLabelText('Wait time for restroom is 5 minutes')).toBeInTheDocument();
    
    const panel = screen.getByRole('heading', { level: 3 }).closest('div[aria-live="polite"]');
    expect(panel).toBeInTheDocument();
  });
});
