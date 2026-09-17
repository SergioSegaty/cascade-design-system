import { css } from 'linaria';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseButtonCss = css`
  font-family: ${semantic.font.family.body};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  vertical-align: middle;
`;

const variants = {
  primary: css`
    background: ${component.button.color.primary.background.default};
    color: ${component.button.color.primary.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.primary.background.hover};
    }
  `,
  secondary: css`
    background: ${component.button.color.secondary.background.default};
    color: ${component.button.color.primary.text.default};

    &:hover:not(:disabled) {
      background-color: ${component.button.color.secondary.background.hover};
    }
  `,
};

const sizes = {
  small: css`
    padding: ${semantic.padding.sm};
    font-size: ${semantic.font.size.sm};
  `,
  medium: css`
    padding: ${semantic.padding.md};
    font-size: ${semantic.font.size.md};
  `,
};

export const buttonVariant = cva(baseButtonCss, {
  variants: {
    variant: variants,
    size: sizes,
  },
  defaultVariants: {
    variant: 'primary',
    size: 'small',
  },
});
