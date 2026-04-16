import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnomalyFeed from '../components/AnomalyFeed';
import React from 'react';

describe('AnomalyFeed', () => {
  it('renders nothing with no alerts', () => {
    const { container } = render(<AnomalyFeed />);
    expect(container.firstChild).toBeNull();
  });

  it('renders alerts within an aria-live assertive role alert region', () => {
    const mockAlerts = [
      { id: 1, severity: 'critical', message: 'Fire alarm triggered' }
    ];
    render(<AnomalyFeed alerts={mockAlerts} />);
    
    const alertRegion = screen.getByRole('alert');
    expect(alertRegion).toHaveAttribute('aria-live', 'assertive');
    
    expect(screen.getByText('Fire alarm triggered')).toBeInTheDocument();
    expect(screen.getByText('critical PRIORITY')).toBeInTheDocument();
  });
});
