import type { ClassifiedTokens, Token } from '@types';

export const aliasedPrimitivesTokenMock: Token[] = [
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
  {
    id: 'color.blue.300',
    path: ['color', 'blue', '200'],
    value: '{color.component.secondary}',
    source: '',
  },
];

export const aliasedSemanticTokenMock: Token[] = [
  {
    id: 'color.component.primary',
    path: ['color', 'component', 'primary'],
    value: '{color.blue.200}',
    source: '',
  },
  {
    id: 'color.component.secondary',
    path: ['color', 'component', 'secondary'],
    value: '{color.blue.300}',
    source: '',
  },
];

export const aliasedClassifiedFiles: ClassifiedTokens = {
  primitives: [
    {
      path: 'test/primitives',
      segments: ['test', 'primitives'],
      tokens: aliasedPrimitivesTokenMock,
    },
  ],
  semanticBase: [
    {
      path: 'test/semantic',
      segments: ['test', 'semantic'],
      tokens: aliasedSemanticTokenMock,
    },
  ],
  themes: {},
};
