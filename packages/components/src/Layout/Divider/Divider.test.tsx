import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Divider from './Divider';
import { dividerVariant } from './Divider.style';

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

describe('Divider', () => {
  it('renders a horizontal separator as an hr by default', () => {
    render(<Divider />);

    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('HR');
    expect(divider).not.toHaveAttribute('aria-orientation');
  });

  it('exposes vertical orientation to assistive technology', () => {
    render(<Divider orientation="vertical" />);

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies the default variant classes with no props', () => {
    render(<Divider />);

    expectClasses(screen.getByRole('separator'), dividerVariant());
  });

  it.each(['subtle', 'default', 'strong'] as const)('applies the class for the %s tone', (tone) => {
    render(<Divider tone={tone} />);

    expectClasses(screen.getByRole('separator'), dividerVariant({ tone }));
  });

  it('applies the class for the vertical orientation', () => {
    render(<Divider orientation="vertical" />);

    expectClasses(screen.getByRole('separator'), dividerVariant({ orientation: 'vertical' }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Divider className="custom" />);

    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('custom');
    expectClasses(divider, dividerVariant());
  });
});
