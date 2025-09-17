import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import NegotiationHelper from '../NegotiationHelper';

// Mock the API
jest.mock('../../../lib/api', () => ({
  negotiateClause: jest.fn(),
}));

import { negotiateClause } from '../../../lib/api';

describe('NegotiationHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default state', () => {
    render(<NegotiationHelper uid="test-uid" clauseId="c1" />);
    expect(screen.getByDisplayValue('Friendly')).toBeInTheDocument();
    expect(screen.getByText('Negotiate')).toBeInTheDocument();
  });

  it('updates tone on select change', () => {
    render(<NegotiationHelper uid="test-uid" clauseId="c1" />);
    const select = screen.getByDisplayValue('Friendly');
    fireEvent.change(select, { target: { value: 'firm' } });
    expect(screen.getByDisplayValue('Firm')).toBeInTheDocument();
  });

  it('calls negotiateClause and displays suggestion on success', async () => {
    (negotiateClause as jest.MockedFunction<typeof negotiateClause>).mockResolvedValue({ suggestion: 'Better wording', newRisk: 'green' });

    render(<NegotiationHelper uid="test-uid" clauseId="c1" />);
    const button = screen.getByText('Negotiate');
    fireEvent.click(button);

    expect(negotiateClause).toHaveBeenCalledWith('test-uid', 'c1', 'friendly');

    await waitFor(() => {
      expect(screen.getByText('Better wording')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    (negotiateClause as jest.MockedFunction<typeof negotiateClause>).mockResolvedValue({ suggestion: 'Ok', newRisk: 'yellow' });

    render(<NegotiationHelper uid="test-uid" clauseId="c1" />);
    const button = screen.getByText('Negotiate');
    fireEvent.click(button);

    expect(screen.getByText('Negotiating...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Negotiating...')).not.toBeInTheDocument();
    });
  });

  it('handles error', async () => {
    (negotiateClause as jest.MockedFunction<typeof negotiateClause>).mockRejectedValue(new Error('Fail'));

    render(<NegotiationHelper uid="test-uid" clauseId="c1" />);
    const button = screen.getByText('Negotiate');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Negotiation failed')).toBeInTheDocument();
    });
  });
});