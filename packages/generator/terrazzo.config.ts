import { defineConfig } from '@terrazzo/cli';
import type { Config } from '@terrazzo/parser';
import css from '@terrazzo/plugin-css';
import cssInJs from '@terrazzo/plugin-css-in-js';

const customConfig: Config = {
  tokens: ['../tokens/design-system.resolver.json'],
  plugins: [
    css({
      permutations: [
        {
          input: { theme: 'light' },
          prepare: (contents) => `:root {\n  ${contents}\n}`,
        },
        {
          input: { theme: 'dark' },
          prepare: (contents) =>
            `@media (prefers-color-scheme: dark) {\n  :root {\n    ${contents}\n  }\n}`,
        },
      ],
    }),
    cssInJs({
      filename: 'theme.js',
    }),
  ],
  outDir: '../styles/',
  lint: {
    build: {
      enabled: true,
    },
    rules: {
      'core/valid-color': 'error',
      'core/valid-dimension': 'error',
      'core/valid-font-family': 'error',
      'core/valid-font-weight': 'error',
      'core/valid-duration': 'error',
      'core/valid-cubic-bezier': 'error',
      'core/valid-number': 'error',
      'core/valid-link': 'error',
      'core/valid-boolean': 'error',
      'core/valid-string': 'error',
      'core/valid-stroke-style': 'error',
      'core/valid-border': 'error',
      'core/valid-transition': 'error',
      'core/valid-shadow': 'error',
      'core/valid-gradient': 'error',
      'core/valid-typography': 'error',
      'core/consistent-naming': 'warn',
    },
  },
};

export default defineConfig(customConfig);
