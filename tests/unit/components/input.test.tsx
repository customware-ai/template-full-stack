import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '~/components/ui/Input';
import { Textarea } from '~/components/ui/Textarea';

describe('Input', () => {
  it('renders an accessible labeled field with generated and forwarded props', () => {
    render(
      <Input
        label="Email Address"
        type="email"
        helperText="Use your work email"
        disabled
        className="custom-class"
      />,
    );

    const input = screen.getByLabelText('Email Address');

    expect(input).toHaveAttribute('id', 'email-address');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeDisabled();
    expect(input.className).toContain('custom-class');
    expect(screen.getByText('Use your work email')).toBeInTheDocument();
  });

  it('shows validation feedback instead of helper text', () => {
    render(<Input error="Invalid input" helperText="Helper copy" data-testid="input" />);

    const input = screen.getByTestId('input');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-destructive');
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
    expect(screen.queryByText('Helper copy')).not.toBeInTheDocument();
  });

  it('forwards user interaction handlers', () => {
    const handleChange = vi.fn();
    const handleBlur = vi.fn();
    const handleFocus = vi.fn();

    render(
      <Input
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});

describe('Textarea', () => {
  it('renders an accessible textarea with helper text and textarea styling', () => {
    render(<Textarea label="Description" helperText="Max 500 characters" />);

    const textarea = screen.getByLabelText('Description');

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.className).toContain('min-h-16');
    expect(textarea.className).toContain('resize-y');
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('shows validation feedback instead of helper text', () => {
    render(
      <Textarea
        error="Required field"
        helperText="Max 500 characters"
        data-testid="textarea"
      />,
    );

    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.className).toContain('border-destructive');
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('Max 500 characters')).not.toBeInTheDocument();
  });

  it('forwards change handlers', () => {
    const handleChange = vi.fn();

    render(<Textarea onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
