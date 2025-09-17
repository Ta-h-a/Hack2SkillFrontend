import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import React from 'react';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
