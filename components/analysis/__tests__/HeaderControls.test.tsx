import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import HeaderControls from '../HeaderControls';

describe('HeaderControls', () => {
  it('renders buttons', () => {
    const mockOnViewHistory = jest.fn();
    const mockOnDownload = jest.fn();

    render(<HeaderControls onViewHistory={mockOnViewHistory} onDownload={mockOnDownload} />);

    expect(screen.getByText('View History')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('calls onViewHistory on View History click', () => {
    const mockOnViewHistory = jest.fn();
    const mockOnDownload = jest.fn();

    render(<HeaderControls onViewHistory={mockOnViewHistory} onDownload={mockOnDownload} />);

    fireEvent.click(screen.getByText('View History'));
    expect(mockOnViewHistory).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload on Download click', () => {
    const mockOnViewHistory = jest.fn();
    const mockOnDownload = jest.fn();

    render(<HeaderControls onViewHistory={mockOnViewHistory} onDownload={mockOnDownload} />);

    fireEvent.click(screen.getByText('Download'));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });
});