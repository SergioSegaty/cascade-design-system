import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import wyw from '@wyw-in-js/vite';

const currentDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../../components/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Mirrors the "@/*" path alias declared in packages/components/tsconfig.json
      '@': join(currentDir, '../../components/src'),
    };
    config.plugins ??= [];
    config.plugins.push(
      wyw({
        include: ['**/*.{ts,tsx}'],
        sourceMap: process.env.NODE_ENV !== 'production',
      }),
    );
    return config;
  },
};

export default config;
