import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders switch control', () => {
    render(<Switch aria-label="Toggle autonomous mode" />);
    expect(screen.getByRole('switch', { name: /toggle autonomous mode/i })).toBeInTheDocument();
  });
});
