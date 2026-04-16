import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PersonnelTracker from '../components/PersonnelTracker';
import React from 'react';

describe('PersonnelTracker', () => {
  it('renders nothing with no personnel', () => {
    const { container } = render(<PersonnelTracker />);
    expect(container.firstChild).toBeNull();
  });

  it('renders personnel roles and locations', () => {
    const mockPersonnel = [
      { id: 'p1', role: 'security', location: 'North Gate' },
      { id: 'p2', role: 'medical', location: 'Section A' }
    ];
    render(<PersonnelTracker personnel={mockPersonnel} />);
    
    expect(screen.getByText('security Unit')).toBeInTheDocument();
    expect(screen.getByText('North Gate')).toBeInTheDocument();
    expect(screen.getByText('medical Unit')).toBeInTheDocument();
    expect(screen.getByText('Section A')).toBeInTheDocument();
  });
});
