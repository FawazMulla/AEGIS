import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './select';

describe('Select', () => {
  it('renders select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select target service" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auth-service">Auth Service</SelectItem>
          <SelectItem value="payment-service">Payment Service</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Select target service')).toBeInTheDocument();
  });
});
