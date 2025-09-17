import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import TimelineView from '../TimelineView';
import { Change } from '../../../lib/types';

describe('TimelineView', () => {
  const mockChanges: Change[] = [
    {
      id: '1',
      documentId: 'doc1',
      timestamp: '2023-01-01T00:00:00Z',
      type: 'Clause Added',
      affectedClauseIds: ['c1'],
      riskImpact: 'Low',
    },
    {
      id: '2',
      documentId: 'doc1',
      timestamp: '2023-01-02T00:00:00Z',
      type: 'Risk Updated',
      affectedClauseIds: ['c2', 'c3'],
      riskImpact: 'Medium',
    },
  ];

  it('renders timeline with changes', () => {
    const mockOnClose = jest.fn();
    render(<TimelineView changes={mockChanges} onClose={mockOnClose} />);

    expect(screen.getByText('Change Timeline')).toBeInTheDocument();
    expect(screen.getByText('Clause Added')).toBeInTheDocument();
    expect(screen.getByText('Risk Updated')).toBeInTheDocument();
    expect(screen.getByText('Affected Clauses: c1')).toBeInTheDocument();
    expect(screen.getByText('Affected Clauses: c2, c3')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<TimelineView changes={mockChanges} onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});