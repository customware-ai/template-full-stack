import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '~/components/ui/Button';

describe('Button', () => {
  it('renders children with the default button styling', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(button.className).toContain('inline-flex');
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('h-9');
  });

  it('applies important variant and size classes', () => {
    render(
      <>
        <Button variant="outline" size="sm">
          Outline
        </Button>
        <Button variant="destructive" size="lg">
          Delete
        </Button>
      </>,
    );

    const outline = screen.getByRole('button', { name: 'Outline' });
    const destructive = screen.getByRole('button', { name: 'Delete' });

    expect(outline.className).toContain('bg-card');
    expect(outline.className).toContain('h-8');
    expect(destructive.className).toContain('bg-destructive');
    expect(destructive.className).toContain('h-10');
  });

  it('shows loading feedback and disables interaction while loading', () => {
    const handleClick = vi.fn();

    render(
      <Button loading onClick={handleClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving' });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards button props and click handlers', () => {
    const handleClick = vi.fn();

    render(
      <Button className="custom-class" type="submit" onClick={handleClick}>
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });

    fireEvent.click(button);

    expect(button).toHaveAttribute('type', 'submit');
    expect(button.className).toContain('custom-class');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
