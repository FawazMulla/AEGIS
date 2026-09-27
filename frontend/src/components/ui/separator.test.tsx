import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders horizontal separator', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('h-[1px]');
  });
});
