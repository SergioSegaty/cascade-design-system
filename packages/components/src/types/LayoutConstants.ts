export const layoutElements = [
  'div',
  'section',
  'article',
  'aside',
  'main',
  'header',
  'footer',
  'nav',
  'ul',
  'ol',
  'form',
  'fieldset',
] as const;

export type LayoutElement = (typeof layoutElements)[number];
