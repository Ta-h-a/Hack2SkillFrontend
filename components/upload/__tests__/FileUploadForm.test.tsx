import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import FileUploadForm from '../FileUploadForm';
import React from 'react';
import { uploadDocument } from '../../../lib/api';

// Mock the API
jest.mock('../../../lib/api', () => ({
  uploadDocument: jest.fn(),
}));

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('FileUploadForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads file and redirects on success', async () => {
    (uploadDocument as jest.MockedFunction<typeof uploadDocument>).mockResolvedValue({ uid: 'test-uid' });

    render(<FileUploadForm />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const nameInput = screen.getByPlaceholderText('Document name');
    const submitButton = screen.getByText('Upload');

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.change(nameInput, { target: { value: 'Test Doc' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockPush).toHaveBeenCalledWith('/result/test-uid');
    });
  });
});