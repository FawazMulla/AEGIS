import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders checkbox component', () => {
    render(<Checkbox aria-label="Enable autonomous healing" />);
    expect(screen.getByRole('checkbox', { name: /enable autonomous healing/i })).toBeInTheDocument();
  });
});
