import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Switch from './Switch';
import { switchVariant } from './Switch.style';

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

describe('Switch', () => {
  it('renders a native checkbox exposed as a switch, named by its children', () => {
    render(<Switch>Notifications</Switch>);

    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle.tagName).toBe('INPUT');
    expect(toggle).toHaveAttribute('type', 'checkbox');
    expect(toggle).not.toBeChecked();
  });

  it('wraps itself in a label only when it has children', () => {
    const { container, rerender } = render(<Switch>Notifications</Switch>);
    expect(container.firstElementChild?.tagName).toBe('LABEL');

    rerender(<Switch aria-label="Notifications" />);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  it('can be named with aria-label', () => {
    render(<Switch aria-label="Dark mode" />);

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('can be named by an external label via id + htmlFor', () => {
    render(
      <>
        <label htmlFor="wifi">Wi-Fi</label>
        <Switch id="wifi" />
      </>,
    );

    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
  });

  it('applies the default variant classes to the root', () => {
    const { container } = render(<Switch>Notifications</Switch>);

    expectClasses(container.firstElementChild as HTMLElement, switchVariant({ disabled: false }));
  });

  it('applies the disabled variant class to the root when disabled', () => {
    const { container } = render(<Switch disabled>Notifications</Switch>);

    expectClasses(container.firstElementChild as HTMLElement, switchVariant({ disabled: true }));
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(<Switch className="custom">Notifications</Switch>);

    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('toggles when clicked (uncontrolled) and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch onChange={handleChange}>Notifications</Switch>);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('toggles when its label text is clicked', async () => {
    const user = userEvent.setup();

    render(<Switch>Notifications</Switch>);

    await user.click(screen.getByText('Notifications'));
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Switch defaultChecked>Notifications</Switch>);

    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [checked, setChecked] = useState(false);
      return (
        <>
          <Switch checked={checked} onChange={(event) => setChecked(event.target.checked)}>
            Notifications
          </Switch>
          <output>{checked ? 'on' : 'off'}</output>
        </>
      );
    }

    render(<Controlled />);

    await user.click(screen.getByRole('switch', { name: 'Notifications' }));
    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
    expect(screen.getByRole('status')).toHaveTextContent('on');
  });

  it('does not toggle or fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Switch disabled onChange={handleChange}>
        Notifications
      </Switch>,
    );
    const toggle = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(toggle);
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('is reachable by keyboard and toggles with Space', async () => {
    const user = userEvent.setup();

    render(<Switch>Notifications</Switch>);

    await user.tab();
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toHaveFocus();

    await user.keyboard(' ');
    expect(toggle).toBeChecked();
  });

  it('forwards its ref to the input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Switch ref={ref}>Notifications</Switch>);

    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Notifications' }));
  });
});
