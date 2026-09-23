import Box from '@/Layout/Box';
import { buttonVariant } from './Button.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from 'linaria';

export type ButtonProps = VariantProps<typeof buttonVariant> &
  React.ComponentPropsWithRef<'button'>;

function Button(props: ButtonProps) {
  const { size, variant, type = 'button', className, children, ...restProps } = props;
  const buttonClassName = cx(buttonVariant({ size, variant }), className);

  return (
    <Box as="button" type={type} className={buttonClassName} {...restProps}>
      {children}
    </Box>
  );
}

export default Button;
