import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import React from 'react';

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

import FileUploadForm from '../FileUploadForm';
import { uploadDocument } from '../../../lib/api';

describe('FileUploadForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads file and redirects on success', async () => {
    (uploadDocument as jest.MockedFunction<typeof uploadDocument>).mockResolvedValue({ uid: 'test-uid' });

    render(<FileUploadForm />);

    const user = userEvent.setup();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const nameInput = screen.getByLabelText('Document name');
    const typeSelect = screen.getByLabelText('Document type');
    const form = document.querySelector('form') as HTMLFormElement;

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await user.type(nameInput, 'Test Doc');
    await user.selectOptions(typeSelect, 'pdf');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith(expect.any(FormData));
      expect(mockPush).toHaveBeenCalledWith('/result/test-uid');
    });
  });
});