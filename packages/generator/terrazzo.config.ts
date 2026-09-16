import { defineConfig } from '@terrazzo/cli';
import type { Config, Plugin } from '@terrazzo/parser';
import css from '@terrazzo/plugin-css';
import type { Permutation } from '@terrazzo/plugin-css';
import cssInJs from '@terrazzo/plugin-css-in-js';

// Single source of truth for theme names: both the CSS permutations below and
// the `Theme` union type are derived from this array, plus a `theme-names.js`/
// `.d.ts` pair emitted into @cascade-ds/styles for other packages to consume.
const permutations = [
  {
    input: { theme: 'light' },
    prepare: (contents) => `:root {\n  ${contents}\n}`,
  },
  {
    input: { theme: 'dark' },
    prepare: (contents) =>
      `@media (prefers-color-scheme: dark) {\n  :root {\n    ${contents}\n  }\n}`,
  },
] satisfies Permutation[];

export type Theme = (typeof permutations)[number]['input']['theme'];

const themeNames = permutations.map((permutation) => permutation.input.theme);

const emitThemeNames: Plugin = {
  name: 'emit-theme-names',
  build({ outputFile }) {
    outputFile('theme-names.js', `export const THEMES = ${JSON.stringify(themeNames)};\n`);
    outputFile(
      'theme-names.d.ts',
      `export declare const THEMES: readonly [${themeNames.map((name) => `'${name}'`).join(', ')}];\nexport type Theme = (typeof THEMES)[number];\n`,
    );
  },
};

const customConfig: Config = {
  tokens: ['../tokens/design-system.resolver.json'],
  plugins: [
    css({ permutations }),
    cssInJs({
      filename: 'theme.js',
    }),
    emitThemeNames,
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
