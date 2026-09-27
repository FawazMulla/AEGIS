import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders slider element', () => {
    render(<Slider defaultValue={[50]} max={100} step={1} aria-label="Chaos blast radius" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});
