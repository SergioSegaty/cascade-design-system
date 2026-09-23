import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import VisuallyHidden from './VisuallyHidden';
import { visuallyHiddenVariant } from './VisuallyHidden.style';

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

describe('VisuallyHidden', () => {
  it('renders its children as a span by default', () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);

    const element = screen.getByText('Hidden label');
    expect(element.tagName).toBe('SPAN');
  });

  it('keeps its content in the accessibility tree', () => {
    render(
      <button type="button">
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  it('renders the element passed via `as`', () => {
    render(<VisuallyHidden as="h2">Section title</VisuallyHidden>);

    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeInTheDocument();
  });

  it('applies the default (always hidden) class with no props', () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);

    expectClasses(screen.getByText('Hidden label'), visuallyHiddenVariant());
  });

  it.each([false, true])('applies the class for focusable=%s', (focusable) => {
    render(<VisuallyHidden focusable={focusable}>Hidden label</VisuallyHidden>);

    expectClasses(screen.getByText('Hidden label'), visuallyHiddenVariant({ focusable }));
  });

  it('works as a focusable skip link', async () => {
    const user = userEvent.setup();

    render(
      <VisuallyHidden as="a" href="#main" focusable>
        Skip to content
      </VisuallyHidden>,
    );

    await user.tab();

    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute('href', '#main');
  });

  it('merges a consumer className with the variant classes', () => {
    render(<VisuallyHidden className="custom">Hidden label</VisuallyHidden>);

    const element = screen.getByText('Hidden label');
    expect(element).toHaveClass('custom');
    expectClasses(element, visuallyHiddenVariant());
  });

  it('forwards its ref to the rendered element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<VisuallyHidden ref={ref}>Hidden label</VisuallyHidden>);

    expect(ref.current).toBe(screen.getByText('Hidden label'));
  });
});
