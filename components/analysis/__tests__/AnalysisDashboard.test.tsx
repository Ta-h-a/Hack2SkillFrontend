import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import AnalysisDashboard from '../AnalysisDashboard';
import { Clause } from '../../../lib/types';

describe('AnalysisDashboard', () => {
  const mockClauses: Clause[] = [
    {
      id: '1',
      documentId: 'doc1',
      text: 'Clause 1',
      risk: 'green',
      explanation: 'Explanation 1',
      alternatives: ['Alt 1'],
      legalAids: [{ name: 'Aid 1', url: 'url1' }],
    },
    {
      id: '2',
      documentId: 'doc1',
      text: 'Clause 2',
      risk: 'ghost',
      explanation: 'Explanation 2',
      alternatives: [],
      legalAids: [],
    },
  ];

  it('renders all clauses', () => {
    const mockOnClauseClick = jest.fn();
    const mockOnGhostAdd = jest.fn();

    render(
      <AnalysisDashboard
        clauses={mockClauses}
        onClauseClick={mockOnClauseClick}
        onGhostAdd={mockOnGhostAdd}
      />
    );

    expect(screen.getByText('Clause 1')).toBeInTheDocument();
    expect(screen.getByText('Clause 2')).toBeInTheDocument();
  });

  it('renders ClauseCard for non-ghost clauses and calls onClauseClick on click', () => {
    const mockOnClauseClick = jest.fn();
    const mockOnGhostAdd = jest.fn();

    render(
      <AnalysisDashboard
        clauses={[mockClauses[0]]}
        onClauseClick={mockOnClauseClick}
        onGhostAdd={mockOnGhostAdd}
      />
    );

    const clauseCard = screen.getByText('Clause 1');
    fireEvent.click(clauseCard);

    expect(mockOnClauseClick).toHaveBeenCalledWith('1');
  });

  it('renders GhostClauseCard for ghost clauses and calls onGhostAdd on add', () => {
    const mockOnClauseClick = jest.fn();
    const mockOnGhostAdd = jest.fn();

    render(
      <AnalysisDashboard
        clauses={[mockClauses[1]]}
        onClauseClick={mockOnClauseClick}
        onGhostAdd={mockOnGhostAdd}
      />
    );

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(mockOnGhostAdd).toHaveBeenCalledWith('Clause 2');
  });
});