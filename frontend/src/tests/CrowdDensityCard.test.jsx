import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CrowdDensityCard from '../components/CrowdDensityCard';
import React from 'react';

vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }) => <div>{children}</div>,
  Map: ({ children }) => <div data-testid="map">{children}</div>,
  useMap: vi.fn(),
  useMapsLibrary: vi.fn(),
}));

describe('CrowdDensityCard', () => {
  it('renders nothing when no props are provided', () => {
    const { container } = render(<CrowdDensityCard />);
    expect(container.firstChild).toBeNull();
  });

  it('renders crowd density with live accessibility features', () => {
    const mockDensity = { section_a: 85, section_b: 40 };
    render(<CrowdDensityCard crowd_density={mockDensity} />);
    
    expect(screen.getByText('Live Crowd Density')).toBeInTheDocument();
    
    // Check buttons are present and have correct density
    expect(screen.getByRole('button', { name: "section a density is 85%" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "section b density is 40%" })).toBeInTheDocument();
    
    // Check that ARIA live region is set
    const container = screen.getByText('Live Crowd Density').closest('div[aria-live="polite"]');
    expect(container).toBeInTheDocument();
  });
});
