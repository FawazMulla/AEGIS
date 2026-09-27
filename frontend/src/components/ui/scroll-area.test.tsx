import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('renders scroll area content', () => {
    render(
      <ScrollArea className="h-40">
        <div>Scrollable log messages</div>
      </ScrollArea>
    );
    expect(screen.getByText('Scrollable log messages')).toBeInTheDocument();
  });
});
