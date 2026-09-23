import { css } from 'linaria';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseButtonCss = css`
  font-family: ${semantic.font.family.body};
  font-weight: ${semantic.font.weight.medium};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${component.button.gap};
  box-sizing: border-box;
  border: ${component.button.border.width} solid transparent;
  border-radius: ${component.button.radius};
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;

  &:focus-visible {
    outline: ${semantic.focus.ring.width} solid ${semantic.color.border.focus};
    outline-offset: ${semantic.focus.ring.offset};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const variants = {
  primary: css`
    background-color: ${component.button.color.primary.background.default};
    color: ${component.button.color.primary.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.primary.background.hover};
    }

    &:active:not(:disabled) {
      background-color: ${component.button.color.primary.background.active};
    }

    &:disabled {
      background-color: ${component.button.color.primary.background.disabled};
      color: ${component.button.color.primary.text.disabled};
    }
  `,
  secondary: css`
    background-color: ${component.button.color.secondary.background.default};
    border-color: ${component.button.color.secondary.border.default};
    color: ${component.button.color.secondary.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.secondary.background.hover};
    }

    &:active:not(:disabled) {
      background-color: ${component.button.color.secondary.background.active};
    }

    &:disabled {
      background-color: ${component.button.color.secondary.background.disabled};
      color: ${component.button.color.secondary.text.disabled};
    }
  `,
  danger: css`
    background-color: ${component.button.color.danger.background.default};
    color: ${component.button.color.danger.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.danger.background.hover};
    }

    &:active:not(:disabled) {
      background-color: ${component.button.color.danger.background.active};
    }

    &:disabled {
      background-color: ${component.button.color.danger.background.disabled};
      color: ${component.button.color.danger.text.disabled};
    }
  `,
  ghost: css`
    background-color: ${component.button.color.ghost.background.default};
    color: ${component.button.color.ghost.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.ghost.background.hover};
    }

    &:active:not(:disabled) {
      background-color: ${component.button.color.ghost.background.active};
    }

    &:disabled {
      background-color: ${component.button.color.ghost.background.disabled};
      color: ${component.button.color.ghost.text.disabled};
    }
  `,
};

const sizes = {
  sm: css`
    min-height: ${component.button.size.sm.minHeight};
    padding-block: ${component.button.size.sm.paddingBlock};
    padding-inline: ${component.button.size.sm.paddingInline};
    font-size: ${semantic.font.size.sm};
  `,
  md: css`
    min-height: ${component.button.size.md.minHeight};
    padding-block: ${component.button.size.md.paddingBlock};
    padding-inline: ${component.button.size.md.paddingInline};
    font-size: ${semantic.font.size.md};
  `,
  lg: css`
    min-height: ${component.button.size.lg.minHeight};
    padding-block: ${component.button.size.lg.paddingBlock};
    padding-inline: ${component.button.size.lg.paddingInline};
    font-size: ${semantic.font.size.lg};
  `,
};

export const buttonVariant = cva(baseButtonCss, {
  variants: {
    variant: variants,
    size: sizes,
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
