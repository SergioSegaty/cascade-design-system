import '@testing-library/jest-dom/vitest';
import { createRef } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import Label from './Label';
import type { LabelProps } from './Label';
import { labelVariant, requiredIndicatorVariant } from './Label.style';

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

function renderWithInput(labelProps: LabelProps = {}) {
  return render(
    <>
      <Label htmlFor="email" {...labelProps}>
        Email
      </Label>
      <input id="email" type="email" required={labelProps.required} />
    </>,
  );
}

describe('Label', () => {
  it('renders a native label element', () => {
    render(<Label>Email</Label>);

    expect(screen.getByText('Email').tagName).toBe('LABEL');
  });

  it('forwards htmlFor so it names the associated control', () => {
    renderWithInput();

    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'email');
  });

  it('focuses the associated control when clicked', async () => {
    const user = userEvent.setup();
    renderWithInput();

    await user.click(screen.getByText('Email'));

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });

  it('applies the default variant classes with no props', () => {
    render(<Label>Email</Label>);

    expectClasses(screen.getByText('Email'), labelVariant());
  });

  it.each(['sm', 'md'] as const)('applies the class for the %s size', (size) => {
    render(<Label size={size}>Email</Label>);

    expectClasses(screen.getByText('Email'), labelVariant({ size }));
  });

  it('applies the disabled class without leaking a disabled attribute', () => {
    render(<Label disabled>Email</Label>);

    const label = screen.getByText('Email');
    expectClasses(label, labelVariant({ disabled: true }));
    expect(label).toHaveAttribute('data-disabled');
    expect(label).not.toHaveAttribute('disabled');
  });

  it('does not render a required marker by default', () => {
    render(<Label>Email</Label>);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows a required marker hidden from assistive technology', () => {
    renderWithInput({ required: true });

    const marker = screen.getByText('*');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expectClasses(marker, requiredIndicatorVariant());
  });

  it('keeps the marker out of the accessible name; the control exposes required', () => {
    renderWithInput({ required: true });

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
  });

  it('dims the required marker when disabled', () => {
    render(
      <Label required disabled>
        Email
      </Label>,
    );

    expectClasses(screen.getByText('*'), requiredIndicatorVariant({ disabled: true }));
  });

  it('merges a consumer className with the variant classes', () => {
    render(<Label className="custom">Email</Label>);

    const label = screen.getByText('Email');
    expect(label).toHaveClass('custom');
    expectClasses(label, labelVariant());
  });

  it('forwards its ref to the label element', () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Label ref={ref}>Email</Label>);

    expect(ref.current).toBe(screen.getByText('Email'));
  });
});
