import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatePicker } from '~/components/ui/date-picker';

describe('DatePicker', () => {
  it('renders the placeholder when no value is selected', () => {
    render(<DatePicker placeholder="Choose date" />);

    expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
  });

  it('renders the formatted selected date', () => {
    render(<DatePicker value={new Date('2026-05-25T00:00:00.000Z')} />);

    expect(screen.getByRole('button', { name: /may 25th, 2026/i })).toBeInTheDocument();
  });

  it('accepts an onChange handler', () => {
    const handleChange = vi.fn();

    render(<DatePicker onChange={handleChange} />);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
