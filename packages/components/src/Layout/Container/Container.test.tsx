import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Container from './Container';
import { containerVariant } from './Container.style';

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

describe('Container', () => {
  it('renders a div with its children by default', () => {
    render(
      <Container aria-label="Content" role="group">
        <p>Page content</p>
      </Container>,
    );

    const container = screen.getByRole('group', { name: 'Content' });
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveTextContent('Page content');
  });

  it('renders as the element passed to `as`', () => {
    render(<Container as="main">Page content</Container>);

    expect(screen.getByRole('main').tagName).toBe('MAIN');
  });

  it('applies the default variant classes with no props', () => {
    render(<Container as="main" />);

    expectClasses(screen.getByRole('main'), containerVariant());
  });

  it.each(['sm', 'md', 'lg', 'xl'] as const)('applies the class for the %s size', (size) => {
    render(<Container as="main" size={size} />);

    expectClasses(screen.getByRole('main'), containerVariant({ size }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Container as="main" className="custom" />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('custom');
    expectClasses(main, containerVariant());
  });

  it('forwards native event handlers', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Container as="main" onClick={handleClick}>
        Page content
      </Container>,
    );

    await user.click(screen.getByRole('main'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
