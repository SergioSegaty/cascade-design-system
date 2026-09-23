import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Icon from './Icon';
import { iconVariant } from './Icon.style';

afterEach(() => {
  cleanup();
});

function expectClasses(element: Element | null, className: string) {
  className
    .split(' ')
    .filter(Boolean)
    .forEach((name) => {
      expect(element).toHaveClass(name);
    });
}

const svg = (
  <svg viewBox="0 0 24 24">
    <path d="M12 2 2 22h20z" fill="currentColor" />
  </svg>
);

describe('Icon', () => {
  it('is decorative by default and hidden from assistive technology', () => {
    const { container } = render(<Icon>{svg}</Icon>);

    const icon = container.firstElementChild;
    expect(icon?.tagName).toBe('SPAN');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the svg passed as children', () => {
    const { container } = render(<Icon>{svg}</Icon>);

    expect(container.querySelector('span > svg')).toBeInTheDocument();
  });

  it('is exposed as an image named by `label` when one is given', () => {
    render(<Icon label="Warning">{svg}</Icon>);

    const icon = screen.getByRole('img', { name: 'Warning' });
    expect(icon.tagName).toBe('SPAN');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('applies the default variant classes with no props', () => {
    render(<Icon label="Warning">{svg}</Icon>);

    expectClasses(screen.getByRole('img'), iconVariant());
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies the class for the %s size', (size) => {
    render(
      <Icon label="Warning" size={size}>
        {svg}
      </Icon>,
    );

    expectClasses(screen.getByRole('img'), iconVariant({ size }));
  });

  it.each(['current', 'primary', 'secondary', 'brand', 'inverse', 'disabled'] as const)(
    'applies the class for the %s color',
    (color) => {
      render(
        <Icon label="Warning" color={color}>
          {svg}
        </Icon>,
      );

      expectClasses(screen.getByRole('img'), iconVariant({ color }));
    },
  );

  it('merges a consumer className with the variant classes', () => {
    render(
      <Icon label="Warning" className="custom">
        {svg}
      </Icon>,
    );

    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('custom');
    expectClasses(icon, iconVariant());
  });

  it('forwards its ref to the wrapper element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Icon label="Warning" ref={ref}>
        {svg}
      </Icon>,
    );

    expect(ref.current).toBe(screen.getByRole('img'));
  });
});
