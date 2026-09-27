import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders textarea', () => {
    render(<Textarea placeholder="Enter query..." />);
    expect(screen.getByPlaceholderText('Enter query...')).toBeInTheDocument();
  });
});
