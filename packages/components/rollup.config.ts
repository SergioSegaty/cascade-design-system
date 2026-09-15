import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import wyw from '@wyw-in-js/rollup';
import css from 'rollup-plugin-css-only';
import type { InputPluginOption, RollupOptions } from 'rollup';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
];
const isExternal = (id: string) =>
  externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

const config: RollupOptions = {
  input: 'src/index.ts',
  external: isExternal,
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    // Mirrors the "@/*" path alias declared in tsconfig.json.
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    commonjs(),
    wyw({
      include: ['**/*.{ts,tsx}'],
      sourceMap: process.env.NODE_ENV !== 'production',
    }),
    css({ output: 'styles.css' }) as InputPluginOption,
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.stories.tsx', '**/*.test.tsx', 'node_modules/**'],
      compilerOptions: {
        composite: false,
        incremental: false,
        declaration: true,
        declarationDir: 'dist',
        outDir: 'dist',
      },
    }),
  ],
};

export default config;
