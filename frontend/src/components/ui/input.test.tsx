import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './input';

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Search services..." />);
    expect(screen.getByPlaceholderText('Search services...')).toBeInTheDocument();
  });
});
