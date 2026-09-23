import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Radio from './Radio';
import { radioVariant } from './Radio.style';

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

function SizeGroup(props: { onChange?: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <fieldset>
      <legend>Size</legend>
      <Radio name="size" value="sm" onChange={props.onChange}>
        Small
      </Radio>
      <Radio name="size" value="md" onChange={props.onChange}>
        Medium
      </Radio>
      <Radio name="size" value="lg" disabled onChange={props.onChange}>
        Large
      </Radio>
    </fieldset>
  );
}

describe('Radio', () => {
  it('renders a native radio named by its children', () => {
    render(<Radio name="size">Small</Radio>);

    const radio = screen.getByRole('radio', { name: 'Small' });
    expect(radio.tagName).toBe('INPUT');
    expect(radio).toHaveAttribute('type', 'radio');
    expect(radio).not.toBeChecked();
  });

  it('wraps itself in a label only when it has children', () => {
    const { container, rerender } = render(<Radio>Small</Radio>);
    expect(container.firstElementChild?.tagName).toBe('LABEL');

    rerender(<Radio aria-label="Small" />);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('can be named with aria-label', () => {
    render(<Radio aria-label="Small" />);

    expect(screen.getByRole('radio', { name: 'Small' })).toBeInTheDocument();
  });

  it('can be named by an external label via id + htmlFor', () => {
    render(
      <>
        <label htmlFor="size-sm">Small</label>
        <Radio id="size-sm" />
      </>,
    );

    expect(screen.getByRole('radio', { name: 'Small' })).toBeInTheDocument();
  });

  it('applies the default variant classes to the root', () => {
    const { container } = render(<Radio>Small</Radio>);

    expectClasses(container.firstElementChild as HTMLElement, radioVariant({ disabled: false }));
  });

  it('applies the disabled variant class to the root when disabled', () => {
    const { container } = render(<Radio disabled>Small</Radio>);

    expectClasses(container.firstElementChild as HTMLElement, radioVariant({ disabled: true }));
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Radio className="custom">Small</Radio>);

    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('selects one option at a time within a group and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SizeGroup onChange={handleChange} />);
    const small = screen.getByRole('radio', { name: 'Small' });
    const medium = screen.getByRole('radio', { name: 'Medium' });

    await user.click(small);
    expect(small).toBeChecked();
    expect(medium).not.toBeChecked();

    await user.click(medium);
    expect(medium).toBeChecked();
    expect(small).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('selects when its label text is clicked', async () => {
    const user = userEvent.setup();

    render(<SizeGroup />);

    await user.click(screen.getByText('Medium'));
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(
      <Radio name="size" defaultChecked>
        Small
      </Radio>,
    );

    expect(screen.getByRole('radio', { name: 'Small' })).toBeChecked();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('sm');
      return (
        <>
          {['sm', 'md'].map((option) => (
            <Radio
              key={option}
              name="size"
              value={option}
              checked={value === option}
              onChange={(event) => setValue(event.target.value)}
            >
              {option}
            </Radio>
          ))}
          <output>{value}</output>
        </>
      );
    }

    render(<Controlled />);
    expect(screen.getByRole('radio', { name: 'sm' })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'md' }));
    expect(screen.getByRole('radio', { name: 'md' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'sm' })).not.toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('md');
  });

  it('does not select or fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SizeGroup onChange={handleChange} />);
    const large = screen.getByRole('radio', { name: 'Large' });

    await user.click(large);
    expect(large).toBeDisabled();
    expect(large).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('moves selection with arrow keys within a group', async () => {
    const user = userEvent.setup();

    render(<SizeGroup />);

    await user.click(screen.getByRole('radio', { name: 'Small' }));
    await user.keyboard('{ArrowDown}');

    const medium = screen.getByRole('radio', { name: 'Medium' });
    expect(medium).toHaveFocus();
    expect(medium).toBeChecked();
  });

  it('forwards its ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Radio ref={ref}>Small</Radio>);

    expect(ref.current).toBe(screen.getByRole('radio', { name: 'Small' }));
  });
});
