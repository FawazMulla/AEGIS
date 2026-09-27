import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from './dialog';

describe('Dialog', () => {
  it('opens dialog when trigger clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Modal</DialogTrigger>
        <DialogContent>
          <DialogTitle>Modal Header</DialogTitle>
          <div>Body content</div>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Modal Header')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Modal Header')).toBeInTheDocument();
  });
});
