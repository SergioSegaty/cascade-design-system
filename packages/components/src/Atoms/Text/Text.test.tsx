import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Text from './Text';
import { textVariant } from './Text.style';

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

describe('Text', () => {
  it('renders body text as a paragraph by default', () => {
    render(<Text>Hello world</Text>);

    const text = screen.getByRole('paragraph');
    expect(text).toHaveTextContent('Hello world');
    expect(text.tagName).toBe('P');
  });

  it('renders the caption variant as a span by default', () => {
    render(<Text variant="caption">Updated 5 min ago</Text>);

    expect(screen.getByText('Updated 5 min ago').tagName).toBe('SPAN');
  });

  it('renders as the element passed to `as`', () => {
    render(
      <Text as="label" htmlFor="email">
        Email
      </Text>,
    );

    const label = screen.getByText('Email');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('lets `as` override the caption default element', () => {
    render(
      <figure>
        <Text as="figcaption" variant="caption">
          Figure 1
        </Text>
      </figure>,
    );

    expect(screen.getByText('Figure 1').tagName).toBe('FIGCAPTION');
  });

  it('applies the default variant classes with no props', () => {
    render(<Text>Hello</Text>);

    expectClasses(screen.getByText('Hello'), textVariant());
  });

  it.each(['body', 'caption'] as const)('applies the class for the %s variant', (variant) => {
    render(<Text variant={variant}>Hello</Text>);

    expectClasses(screen.getByText('Hello'), textVariant({ variant }));
  });

  it.each(['xs', 'sm', 'md', 'lg'] as const)('applies the class for the %s size', (size) => {
    render(<Text size={size}>Hello</Text>);

    expectClasses(screen.getByText('Hello'), textVariant({ size }));
  });

  it.each(['regular', 'medium', 'semibold', 'bold'] as const)(
    'applies the class for the %s weight',
    (weight) => {
      render(<Text weight={weight}>Hello</Text>);

      expectClasses(screen.getByText('Hello'), textVariant({ weight }));
    },
  );

  it.each([
    'primary',
    'secondary',
    'tertiary',
    'disabled',
    'brand',
    'inverse',
    'danger',
    'success',
    'warning',
    'info',
  ] as const)('applies the class for the %s color', (color) => {
    render(<Text color={color}>Hello</Text>);

    expectClasses(screen.getByText('Hello'), textVariant({ color }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Text className="custom">Hello</Text>);

    const text = screen.getByText('Hello');
    expect(text).toHaveClass('custom');
    expectClasses(text, textVariant());
  });

  it('forwards its ref to the rendered element', () => {
    const ref = createRef<HTMLParagraphElement>();

    render(<Text ref={ref}>Hello</Text>);

    expect(ref.current).toBe(screen.getByText('Hello'));
  });
});
