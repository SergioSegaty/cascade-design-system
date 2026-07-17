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
    id: 'color.text.primary',
    path: ['color', 'text', 'primary'],
    value: '{color.blue.200}',
    source: 'packages/tokens/semantic/color',
  },
];

export const classifiedTokensMock: ClassifiedTokens = {
  primitives: [{ path: 'basic/test', segments: ['basic', 'teste'], tokens: primitivesTokenMock }],
  semanticBase: [
    { path: 'semantic/test', segments: ['sematantic', 'test'], tokens: semanticTokenMock },
  ],
  themes: {
    product: [
      {
        path: 'test/semantic/Themes/product/color',
        segments: ['test', 'semantic', 'Themes', 'product', 'color'],
        tokens: [
          {
            id: 'product.color.focus.primary',
            path: ['product', 'color', 'focus', 'primary'],
            value: '{color.text.primary}',
            source: 'packages/tokens/semantic/Themes/product/color',
          },
        ],
      },
    ],
  },
};
