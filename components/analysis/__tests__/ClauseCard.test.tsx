import { render, screen } from '@testing-library/react';
import ClauseCard from '../ClauseCard';
import React from 'react';

const mockClause = {
  id: '1',
  documentId: 'doc1',
  text: 'Sample clause text',
  risk: 'green' as const,
  explanation: 'Safe clause',
  alternatives: ['Alternative 1'],
  legalAids: [{ name: 'Aid 1', url: 'http://aid1.com' }],
};

describe('ClauseCard', () => {
  it('renders clause text and risk', () => {
    render(<ClauseCard clause={mockClause} onClick={() => {}} />);
    expect(screen.getByText('Sample clause text')).toBeInTheDocument();
    expect(screen.getByText('Risk: green')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<ClauseCard clause={mockClause} onClick={mockOnClick} />);
    const card = screen.getByText('Sample clause text').parentElement;
    card?.click();
    expect(mockOnClick).toHaveBeenCalledWith('1');
  });
});