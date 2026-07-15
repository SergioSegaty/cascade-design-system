import { describe, test, expect } from 'vitest';
import { classifiedTokensMock, primitivesTokenMock } from './__mocks__/treeBuild.mock.js';
import { TreeBuilder } from '../treeBuilder.js';

const treeBuilder = new TreeBuilder();

describe('TreeBuild tests', () => {
  test('Should create branch by string array', () => {
    const keys = ['foo', 'bar'];

    const expectedResult = { foo: { bar: {} } };

    const result = treeBuilder.buildBranch(keys);
    expect(result).toStrictEqual(expectedResult);
  });

  test('Should build tokens', () => {
    const expected = {
      color: {
        blue: {
          50: '#2d49a5',
          100: '#2d49a5',
          200: '#2d49a5',
        },
      },
    };
    const result = treeBuilder.buildTree(primitivesTokenMock);

    expect(result).toStrictEqual(expected);
  });

  test('Should build Tree by ClassifiedTokens', () => {
    const expectedResult = {
      color: {
        blue: {
          50: '#2d49a5',
          100: '#2d49a5',
          200: '#2d49a5',
        },
      },
      spacing: {
        component: {
          round: {
            xs: '0.5rem',
          },
          padding: {
            sm: '0.5rem',
          },
        },
        layout: {
          section: '4rem',
          'container-padding': '1.5rem',
        },
        stack: {
          xs: '0.25rem',
        },
      },
      themes: {
        dark: {
          color: {
            focus: {
              primary: '#f9fafb',
            },
            text: {
              primary: '#f9fafb',
            },
          },
        },
        light: {
          color: {
            focus: {
              primary: '#374151',
            },
            text: {
              primary: '#111827',
            },
          },
        },
        product: {
          color: {
            focus: {
              primary: '#374151',
            },
            text: {
              primary: '#111827',
            },
          },
        },
      },
    };

    const result = treeBuilder.buildFromClassified(classifiedTokensMock);

    expect(result).toStrictEqual(expectedResult);
  });
});
