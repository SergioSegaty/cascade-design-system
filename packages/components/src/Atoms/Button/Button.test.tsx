import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Button from './Button';
import { buttonVariant } from './Button.style';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('applies the class for the given size and variant', () => {
    render(
      <Button size="medium" variant="secondary">
        Submit
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    const expectedClassName = buttonVariant({ size: 'medium', variant: 'secondary' });

    expectedClassName
      .split(' ')
      .filter(Boolean)
      .forEach((className) => {
        expect(button).toHaveClass(className);
      });
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
