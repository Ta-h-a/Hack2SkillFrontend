import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import ExportControls from '../ExportControls';

describe('ExportControls', () => {
  it('renders controls with default state', () => {
    const mockOnExport = jest.fn();
    render(<ExportControls onExport={mockOnExport} />);

    expect(screen.getByLabelText('Include ghost clauses')).toBeChecked();
    expect(screen.getByLabelText('Include explanations')).toBeChecked();
    expect(screen.getByPlaceholderText('e.g. DRAFT')).toHaveValue('');
  });

  it('updates state on checkbox changes', () => {
    const mockOnExport = jest.fn();
    render(<ExportControls onExport={mockOnExport} />);

    const ghostCheckbox = screen.getByLabelText('Include ghost clauses');
    const eli5Checkbox = screen.getByLabelText('Include explanations');

    fireEvent.click(ghostCheckbox);
    expect(ghostCheckbox).not.toBeChecked();

    fireEvent.click(eli5Checkbox);
    expect(eli5Checkbox).not.toBeChecked();
  });

  it('updates watermark input', () => {
    const mockOnExport = jest.fn();
    render(<ExportControls onExport={mockOnExport} />);

    const watermarkInput = screen.getByPlaceholderText('e.g. DRAFT');
    fireEvent.change(watermarkInput, { target: { value: 'CONFIDENTIAL' } });
    expect(watermarkInput).toHaveValue('CONFIDENTIAL');
  });

  it('calls onExport with correct options on button click', () => {
    const mockOnExport = jest.fn();
    render(<ExportControls onExport={mockOnExport} />);

    const button = screen.getByText('Export PDF');
    fireEvent.click(button);

    expect(mockOnExport).toHaveBeenCalledWith({
      includeGhosts: true,
      includeEli5: true,
      watermark: '',
    });
  });
});