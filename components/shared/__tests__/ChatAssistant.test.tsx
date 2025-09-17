import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';
import ChatAssistant from '../ChatAssistant';

// Mock the API
jest.mock('../../../lib/api', () => ({
  chatWithAssistant: jest.fn(),
}));

import { chatWithAssistant } from '../../../lib/api';

describe('ChatAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface', () => {
    render(<ChatAssistant uid="test-uid" />);
    expect(screen.getByText('Chat Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask about your document...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('updates input value', () => {
    render(<ChatAssistant uid="test-uid" />);
    const input = screen.getByPlaceholderText('Ask about your document...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
  });

  it('sends message on button click and displays response', async () => {
    (chatWithAssistant as jest.MockedFunction<typeof chatWithAssistant>).mockResolvedValue({ response: 'Hi there!' });

    render(<ChatAssistant uid="test-uid" />);
    const input = screen.getByPlaceholderText('Ask about your document...');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    expect(chatWithAssistant).toHaveBeenCalledWith('test-uid', 'Hello');

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    expect(input).toHaveValue('');
  });

  it('sends message on Enter key', async () => {
    (chatWithAssistant as jest.MockedFunction<typeof chatWithAssistant>).mockResolvedValue({ response: 'Response' });

    render(<ChatAssistant uid="test-uid" />);
    const input = screen.getByPlaceholderText('Ask about your document...');

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(chatWithAssistant).toHaveBeenCalledWith('test-uid', 'Test');
    });
  });

  it('shows loading indicator while sending', async () => {
    (chatWithAssistant as jest.MockedFunction<typeof chatWithAssistant>).mockResolvedValue({ response: 'Done' });

    render(<ChatAssistant uid="test-uid" />);
    const input = screen.getByPlaceholderText('Ask about your document...');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(button);

    expect(screen.getByText('Assistant is typing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Assistant is typing...')).not.toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    (chatWithAssistant as jest.MockedFunction<typeof chatWithAssistant>).mockRejectedValue(new Error('API error'));

    render(<ChatAssistant uid="test-uid" />);
    const input = screen.getByPlaceholderText('Ask about your document...');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error from assistant.')).toBeInTheDocument();
    });
  });
});