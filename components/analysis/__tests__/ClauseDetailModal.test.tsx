import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import ClauseDetailModal from '../ClauseDetailModal';
import { Clause } from '../../../lib/types';

describe('ClauseDetailModal', () => {
  const mockClause: Clause = {
    id: '1',
    documentId: 'doc1',
    text: 'Sample clause text',
    risk: 'yellow',
    explanation: 'This is an explanation',
    alternatives: ['Alt 1', 'Alt 2'],
    legalAids: [{ name: 'Aid 1', url: 'http://example.com' }],
  };

  it('does not render when clause is null', () => {
    const mockOnClose = jest.fn();
    const { container } = render(<ClauseDetailModal clause={null} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders clause details when clause is provided', () => {
    const mockOnClose = jest.fn();
    render(<ClauseDetailModal clause={mockClause} onClose={mockOnClose} />);

    expect(screen.getByText('Clause Details')).toBeInTheDocument();
    expect(screen.getByText('Sample clause text')).toBeInTheDocument();
    expect(screen.getByText('This is an explanation')).toBeInTheDocument();
    expect(screen.getByText('yellow')).toBeInTheDocument();
    expect(screen.getByText('Alt 1')).toBeInTheDocument();
    expect(screen.getByText('Alt 2')).toBeInTheDocument();
    expect(screen.getByText('Aid 1')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<ClauseDetailModal clause={mockClause} onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});