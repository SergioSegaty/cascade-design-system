export type BoxOwnProps<TElement extends React.ElementType> = {
  as?: TElement;
};

export type BoxProps<TElement extends React.ElementType> = BoxOwnProps<TElement> &
  Omit<React.ComponentPropsWithRef<TElement>, keyof BoxOwnProps<TElement>>;

const _defaultElement = 'div';

export function Box<TElement extends React.ElementType = typeof _defaultElement>({
  as,
  children,
  className,
  ...restProps
}: BoxProps<TElement>) {
  const Component = as ?? _defaultElement;

  return (
    <Component {...restProps} className={className}>
      {children}
    </Component>
  );
}
