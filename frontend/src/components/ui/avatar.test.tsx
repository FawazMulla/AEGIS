import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback } from './avatar';

describe('Avatar', () => {
  it('renders fallback when no image provided', () => {
    render(
      <Avatar>
        <AvatarFallback>AG</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AG')).toBeInTheDocument();
  });
});
