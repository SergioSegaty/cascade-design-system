import Box from '@/Layout/Box';
import { switchControlCss, switchVariant } from './Switch.style';
import type { VariantProps } from 'class-variance-authority';
import { cx } from 'linaria';

export type SwitchProps = VariantProps<typeof switchVariant> &
  Omit<React.ComponentPropsWithRef<'input'>, 'type' | 'role' | 'children'> & {
    /** Inline label text. When provided, the switch is wrapped in a `<label>`. */
    children?: React.ReactNode;
  };

function Switch(props: SwitchProps) {
  const { disabled, className, children, ...restProps } = props;
  const rootClassName = cx(switchVariant({ disabled: Boolean(disabled) }), className);

  return (
    <Box as={children ? 'label' : 'span'} className={rootClassName}>
      <span className={switchControlCss}>
        <Box as="input" type="checkbox" role="switch" disabled={disabled} {...restProps} />
        <span aria-hidden="true" />
      </span>
      {children}
    </Box>
  );
}

export default Switch;
