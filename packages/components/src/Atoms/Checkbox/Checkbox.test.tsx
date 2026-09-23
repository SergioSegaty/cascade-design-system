import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox';
import { checkboxVariant } from './Checkbox.style';

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

describe('Checkbox', () => {
  it('renders a native checkbox named by its children', () => {
    render(<Checkbox>Accept terms</Checkbox>);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('wraps itself in a label only when it has children', () => {
    const { container, rerender } = render(<Checkbox>Accept terms</Checkbox>);
    expect(container.firstElementChild?.tagName).toBe('LABEL');

    rerender(<Checkbox aria-label="Accept terms" />);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('can be named with aria-label', () => {
    render(<Checkbox aria-label="Select row" />);

    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  });

  it('can be named by an external label via id + htmlFor', () => {
    render(
      <>
        <label htmlFor="newsletter">Newsletter</label>
        <Checkbox id="newsletter" />
      </>,
    );

    expect(screen.getByRole('checkbox', { name: 'Newsletter' })).toBeInTheDocument();
  });

  it('can be named by a wrapping label', () => {
    render(
      // jsx-a11y can't see that <Checkbox> renders a native input.
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      <label>
        <Checkbox /> Remember me
      </label>,
    );

    expect(screen.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
  });

  it('applies the default variant classes to the root', () => {
    const { container } = render(<Checkbox>Accept terms</Checkbox>);

    expectClasses(container.firstElementChild as HTMLElement, checkboxVariant({ disabled: false }));
  });

  it('applies the disabled variant class to the root when disabled', () => {
    const { container } = render(<Checkbox disabled>Accept terms</Checkbox>);

    expectClasses(container.firstElementChild as HTMLElement, checkboxVariant({ disabled: true }));
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Checkbox className="custom">Accept terms</Checkbox>);

    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('toggles when clicked (uncontrolled) and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Checkbox onChange={handleChange}>Accept terms</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when its label text is clicked', async () => {
    const user = userEvent.setup();

    render(<Checkbox>Accept terms</Checkbox>);

    await user.click(screen.getByText('Accept terms'));
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Checkbox defaultChecked>Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <>
          <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
            Accept terms
          </Checkbox>
          <output>{checked ? 'on' : 'off'}</output>
        </>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('on');
  });

  it('stays unchecked when controlled and the parent ignores onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox checked={false} onChange={handleChange}>
        Accept terms
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).not.toBeChecked();
  });

  it('does not toggle or fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Checkbox disabled onChange={handleChange}>
        Accept terms
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    await user.click(checkbox);
    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('exposes the indeterminate (mixed) state', () => {
    const { rerender } = render(<Checkbox indeterminate>Select all</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });

    expect(checkbox).toBePartiallyChecked();

    rerender(<Checkbox indeterminate={false}>Select all</Checkbox>);
    expect(checkbox).not.toBePartiallyChecked();
  });

  it('is reachable by keyboard and toggles with Space', async () => {
    const user = userEvent.setup();

    render(<Checkbox>Accept terms</Checkbox>);

    await user.tab();
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('forwards its ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox ref={ref}>Accept terms</Checkbox>);

    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Accept terms' }));
  });
});
