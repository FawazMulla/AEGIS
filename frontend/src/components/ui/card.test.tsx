import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Card', () => {
  it('renders card with title and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p>All nodes operational</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('All nodes operational')).toBeInTheDocument();
  });
});
