import Box from '@/Atoms/Box';
import { buttonVariant } from './Button.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from 'linaria';

type ButtonProps = VariantProps<typeof buttonVariant> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {
  const { size, variant, children, ...restProps } = props;
  const buttonClassName = cx(buttonVariant({ size, variant }));

  return (
    <Box as="button" className={buttonClassName} {...restProps}>
      {children}
    </Box>
  );
}

export default Button;
