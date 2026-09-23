import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Tag from './Tag';
import { tagVariant } from './Tag.style';

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

describe('Tag', () => {
  it('renders its label in a span with no button by default', () => {
    const { container } = render(<Tag>Design</Tag>);

    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies the default (neutral) tone classes to the root with no props', () => {
    const { container } = render(<Tag>Design</Tag>);

    expectClasses(container.firstElementChild as HTMLElement, tagVariant());
    expectClasses(container.firstElementChild as HTMLElement, tagVariant({ tone: 'neutral' }));
  });

  it.each(tones)('applies the class for the %s tone', (tone) => {
    const { container } = render(<Tag tone={tone}>Design</Tag>);

    expectClasses(container.firstElementChild as HTMLElement, tagVariant({ tone }));
  });

  it.each(['sm', 'md'] as const)('applies the class for the %s size', (size) => {
    const { container } = render(<Tag size={size}>Design</Tag>);

    expectClasses(container.firstElementChild as HTMLElement, tagVariant({ size }));
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Tag className="custom">Design</Tag>);

    expect(container.firstElementChild).toHaveClass('custom');
    expectClasses(container.firstElementChild as HTMLElement, tagVariant());
  });

  it('renders a native remove button named after a text label when onRemove is set', () => {
    render(<Tag onRemove={() => {}}>Design</Tag>);

    const button = screen.getByRole('button', { name: 'Remove Design' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('lets consumers override the remove button name', () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Clear design filter">
        Design
      </Tag>,
    );

    expect(screen.getByRole('button', { name: 'Clear design filter' })).toBeInTheDocument();
  });

  it('names the remove button from rich (non-text) children', () => {
    render(
      <Tag onRemove={() => {}}>
        <strong>Design</strong>
      </Tag>,
    );

    expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(<Tag onRemove={handleRemove}>Design</Tag>);

    await user.click(screen.getByRole('button', { name: 'Remove Design' }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not submit an enclosing form when removed', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form aria-label="Filters" onSubmit={handleSubmit}>
        <Tag onRemove={() => {}}>Design</Tag>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Remove Design' }));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('reaches the remove button by keyboard and activates it with Enter and Space', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(<Tag onRemove={handleRemove}>Design</Tag>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Remove Design' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(handleRemove).toHaveBeenCalledTimes(2);
  });

  it('forwards its ref to the root span', () => {
    const ref = createRef<HTMLSpanElement>();

    const { container } = render(<Tag ref={ref}>Design</Tag>);

    expect(ref.current).toBe(container.firstElementChild);
  });
});
