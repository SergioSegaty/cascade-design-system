import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import wyw from '@wyw-in-js/vite';
import 'vitest-axe/extend-expect';

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the "@/*" path alias declared in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // Compiles linaria's `css` tag at build time; without it, importing
    // any *.style.ts file throws at runtime under Vitest just like it did
    // in Storybook before this plugin was added there.
    wyw({
      include: ['**/*.{ts,tsx}'],
      sourceMap: false,
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});
