import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Heading from './Heading';
import { headingVariant } from './Heading.style';

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

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Section title</Heading>);

    const heading = screen.getByRole('heading', { name: 'Section title', level: 2 });
    expect(heading.tagName).toBe('H2');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders an h%i for level %i', (level) => {
    render(<Heading level={level}>Title</Heading>);

    const heading = screen.getByRole('heading', { name: 'Title', level });
    expect(heading.tagName).toBe(`H${level}`);
  });

  it('applies the default variant classes with no props', () => {
    render(<Heading>Title</Heading>);

    expectClasses(screen.getByRole('heading', { name: 'Title' }), headingVariant({ size: 'h2' }));
  });

  it.each([
    [1, 'h1'],
    [2, 'h2'],
    [3, 'h3'],
    [4, 'h4'],
    [5, 'h5'],
    [6, 'h6'],
  ] as const)('derives the visual size from level %i when size is omitted', (level, size) => {
    render(<Heading level={level}>Title</Heading>);

    expectClasses(screen.getByRole('heading', { name: 'Title' }), headingVariant({ size }));
  });

  it.each(['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
    'applies the class for the %s size independently of level',
    (size) => {
      render(
        <Heading level={3} size={size}>
          Title
        </Heading>,
      );

      const heading = screen.getByRole('heading', { name: 'Title', level: 3 });
      expectClasses(heading, headingVariant({ size }));
    },
  );

  it.each(['primary', 'secondary', 'brand', 'inverse'] as const)(
    'applies the class for the %s color',
    (color) => {
      render(<Heading color={color}>Title</Heading>);

      expectClasses(
        screen.getByRole('heading', { name: 'Title' }),
        headingVariant({ size: 'h2', color }),
      );
    },
  );

  it('merges a consumer className with the variant classes', () => {
    render(<Heading className="custom">Title</Heading>);

    const heading = screen.getByRole('heading', { name: 'Title' });
    expect(heading).toHaveClass('custom');
    expectClasses(heading, headingVariant({ size: 'h2' }));
  });

  it('forwards its ref to the heading element', () => {
    const ref = createRef<HTMLHeadingElement>();

    render(<Heading ref={ref}>Title</Heading>);

    expect(ref.current).toBe(screen.getByRole('heading', { name: 'Title' }));
  });
});
