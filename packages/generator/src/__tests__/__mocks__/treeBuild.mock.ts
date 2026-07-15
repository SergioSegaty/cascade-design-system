import type { ClassifiedTokens, Token } from '@types';

export const primitivesTokenMock: Token[] = [
  {
    id: 'color.blue.50',
    path: ['color', 'blue', '50'],
    value: '#2d49a5',
    source: '',
  },
  {
    id: 'color.blue.100',
    path: ['color', 'blue', '100'],
    value: '#2d49a5',
    source: '',
  },
  {
    id: 'color.blue.200',
    path: ['color', 'blue', '200'],
    value: '#2d49a5',
    source: '',
  },
];

export const semanticTokenMock: Token[] = [
  {
    id: 'spacing.component.round.xs',
    path: ['spacing', 'component', 'round', 'xs'],
    value: '0.5rem',
    source: 'packages/tokens/semantic/spacing',
  },
  {
    id: 'spacing.component.padding.sm',
    path: ['spacing', 'component', 'padding', 'sm'],
    value: '0.5rem',
    source: 'packages/tokens/semantic/spacing',
  },
  {
    id: 'spacing.layout.section',
    path: ['spacing', 'layout', 'section'],
    value: '4rem',
    source: 'packages/tokens/semantic/spacing',
  },
  {
    id: 'spacing.layout.container-padding',
    path: ['spacing', 'layout', 'container-padding'],
    value: '1.5rem',
    source: 'packages/tokens/semantic/spacing',
  },
  {
    id: 'spacing.stack.xs',
    path: ['spacing', 'stack', 'xs'],
    value: '0.25rem',
    source: 'packages/tokens/semantic/spacing',
  },
];

export const classifiedTokensMock: ClassifiedTokens = {
  primitives: [{ path: 'basic/test', segments: ['basic', 'teste'], tokens: primitivesTokenMock }],
  semanticBase: [
    { path: 'semantic/test', segments: ['sematantic', 'test'], tokens: semanticTokenMock },
  ],
  themes: {
    dark: [
      {
        path: 'test/semantic/Themes/dark/color',
        segments: ['test', 'semantic', 'Themes', 'dark', 'color'],
        tokens: [
          {
            id: 'dark.color.focus.primary',
            path: ['dark', 'color', 'focus', 'primary'],
            value: '#f9fafb',
            source: 'packages/tokens/semantic/Themes/dark/color',
          },
          {
            id: 'dark.color.text.primary',
            path: ['dark', 'color', 'text', 'primary'],
            value: '#f9fafb',
            source: 'packages/tokens/semantic/Themes/dark/color',
          },
        ],
      },
    ],
    light: [
      {
        path: 'test/semantic/Themes/light/color',
        segments: ['test', 'semantic', 'Themes', 'light', 'color'],
        tokens: [
          {
            id: 'light.color.focus.primary',
            path: ['light', 'color', 'focus', 'primary'],
            value: '#374151',
            source: 'packages/tokens/semantic/Themes/light/color',
          },
          {
            id: 'light.color.text.primary',
            path: ['light', 'color', 'text', 'primary'],
            value: '#111827',
            source: 'packages/tokens/semantic/Themes/light/color',
          },
        ],
      },
    ],
    product: [
      {
        path: 'test/semantic/Themes/product/color',
        segments: ['test', 'semantic', 'Themes', 'product', 'color'],
        tokens: [
          {
            id: 'product.color.focus.primary',
            path: ['product', 'color', 'focus', 'primary'],
            value: '#374151',
            source: 'packages/tokens/semantic/Themes/product/color',
          },
          {
            id: 'product.color.text.primary',
            path: ['product', 'color', 'text', 'primary'],
            value: '#111827',
            source: 'packages/tokens/semantic/Themes/product/color',
          },
        ],
      },
    ],
  },
};
