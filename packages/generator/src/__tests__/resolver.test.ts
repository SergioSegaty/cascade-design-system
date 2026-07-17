import { describe, expect, test } from 'vitest';
import { TokenRegistry } from '../registry.js';
import { aliasedClassifiedFiles } from './__mocks__/aliasedCircularTokens.mock.js';
import { classifiedTokensMock } from './__mocks__/aliasedTokens.mock.js';
import { AliasResolver } from '../resolver.js';

describe('Resolver Class test', () => {
  test('Should resolve with cache', () => {
    const registry = TokenRegistry.from(classifiedTokensMock);
    const aliasResolver = new AliasResolver(registry);
    const expectedResult = {
      primitives: [
        {
          path: 'basic/test',
          segments: ['basic', 'teste'],
          tokens: [
            {
              id: 'color.blue.50',
              path: ['color', 'blue', '50'],
              source: '',
              value: '#2d49a5',
            },
            {
              id: 'color.blue.100',
              path: ['color', 'blue', '100'],
              source: '',
              value: '#2d49a5',
            },
            {
              id: 'color.blue.200',
              path: ['color', 'blue', '200'],
              source: '',
              value: '#2d49a5',
            },
          ],
        },
      ],
      semanticBase: [
        {
          path: 'semantic/test',
          segments: ['sematantic', 'test'],
          tokens: [
            {
              id: 'spacing.component.round.xs',
              path: ['spacing', 'component', 'round', 'xs'],
              source: 'packages/tokens/semantic/spacing',
              value: '0.5rem',
            },
            {
              id: 'color.text.primary',
              path: ['color', 'text', 'primary'],
              source: 'packages/tokens/semantic/color',
              value: '#2d49a5',
            },
          ],
        },
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
                source: 'packages/tokens/semantic/Themes/product/color',
                value: '#2d49a5',
              },
            ],
          },
        ],
      },
    };

    const result = aliasResolver.resolveClassified(classifiedTokensMock);

    expect(result).toStrictEqual(expectedResult);
  });

  test('Should throw error when Cycle Aliases is found.', () => {
    const registry = TokenRegistry.from(aliasedClassifiedFiles);
    const aliasResolver = new AliasResolver(registry);
    expect(() => aliasResolver.resolveClassified(aliasedClassifiedFiles)).toThrow(/Circular/);
  });
});
