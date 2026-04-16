import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SOSButton from '../components/SOSButton';
import React from 'react';

describe('SOSButton', () => {
  it('renders emergency root button initially', () => {
    render(<SOSButton />);
    expect(screen.getByText('Emergency SOS')).toBeInTheDocument();
  });

  it('opens confirmation modal when clicked and simulates SOS trigger', async () => {
    render(<SOSButton />);
    
    // Open modal
    fireEvent.click(screen.getByText('Emergency SOS'));
    expect(screen.getByText('Trigger SOS?')).toBeInTheDocument();
    
    // Confirm SOS
    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Confirm SOS'));
    
    // Status updates
    expect(screen.getByText('SOS Dispatched')).toBeInTheDocument();
    
    // Modal closes after timeout
    vi.runAllTimers();
    vi.useRealTimers();
    
    await waitFor(() => {
      expect(screen.queryByText('Trigger SOS?')).not.toBeInTheDocument();
    });
  });
});
