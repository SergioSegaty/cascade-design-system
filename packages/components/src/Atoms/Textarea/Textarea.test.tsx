import '@testing-library/jest-dom/vitest';
import { createRef, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Textarea from './Textarea';
import { textareaVariant } from './Textarea.style';

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

describe('Textarea', () => {
  it('renders a native textarea', () => {
    render(<Textarea aria-label="Message" />);

    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('defaults to three rows and lets consumers override it', () => {
    const { rerender } = render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('rows', '3');

    rerender(<Textarea aria-label="Message" rows={6} />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('rows', '6');
  });

  it('can be named by an external label via id + htmlFor', () => {
    render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument();
  });

  it('applies the default variant classes with no props', () => {
    render(<Textarea aria-label="Message" />);

    expectClasses(screen.getByRole('textbox', { name: 'Message' }), textareaVariant());
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the class for the %s size', (size) => {
    render(<Textarea aria-label="Message" size={size} />);

    expectClasses(screen.getByRole('textbox', { name: 'Message' }), textareaVariant({ size }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Textarea aria-label="Message" className="custom" />);

    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea).toHaveClass('custom');
    expectClasses(textarea, textareaVariant());
  });

  it('accepts typing when uncontrolled and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="Message" defaultValue="Hi" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, ' there');
    expect(textarea).toHaveValue('Hi there');
    expect(handleChange).toHaveBeenCalledTimes(6);
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <>
          <Textarea
            aria-label="Message"
            value={value}
            onChange={(event) => setValue(event.target.value.toUpperCase())}
          />
          <output>{value.length}</output>
        </>
      );
    }

    render(<Controlled />);

    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'abc');
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveValue('ABC');
    expect(screen.getByRole('status')).toHaveTextContent('3');
  });

  it('does not accept input when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea aria-label="Message" disabled onChange={handleChange} />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'abc');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue('');
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not accept input when read-only', async () => {
    const user = userEvent.setup();

    render(<Textarea aria-label="Message" readOnly defaultValue="Locked" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'abc');
    expect(textarea).toHaveValue('Locked');
  });

  it('exposes the invalid state to assistive technology', () => {
    render(<Textarea aria-label="Message" aria-invalid="true" />);

    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInvalid();
  });

  it('is reachable by keyboard', async () => {
    const user = userEvent.setup();

    render(<Textarea aria-label="Message" />);

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveFocus();
  });

  it('forwards its ref to the textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea aria-label="Message" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Message' }));
  });
});
