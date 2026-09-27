import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders badge text', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders with tertiary variant', () => {
    render(<Badge variant="tertiary">Active</Badge>);
    expect(screen.getByText('Active')).toHaveClass('bg-tertiary');
  });
});
