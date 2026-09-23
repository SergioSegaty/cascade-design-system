import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Badge from './Badge';
import { badgeVariant } from './Badge.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: HTMLElement, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

const tones = ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;

describe('Badge', () => {
  it('renders its children in a non-interactive span', () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText('Active');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
  });

  it('is not a focus stop', async () => {
    const user = userEvent.setup();

    render(<Badge>Active</Badge>);

    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('applies the default (neutral) tone classes with no props', () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText('Active');
    expectClasses(badge, badgeVariant());
    expectClasses(badge, badgeVariant({ tone: 'neutral' }));
  });

  it.each(tones)('applies the class for the %s tone', (tone) => {
    render(<Badge tone={tone}>Active</Badge>);

    expectClasses(screen.getByText('Active'), badgeVariant({ tone }));
  });

  it.each(['sm', 'md'] as const)('applies the class for the %s size', (size) => {
    render(<Badge size={size}>Active</Badge>);

    expectClasses(screen.getByText('Active'), badgeVariant({ size }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Badge className="custom">Active</Badge>);

    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('custom');
    expectClasses(badge, badgeVariant());
  });

  it('forwards its ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>Active</Badge>);

    expect(ref.current).toBe(screen.getByText('Active'));
  });
});
