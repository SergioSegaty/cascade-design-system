import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import wyw from '@wyw-in-js/vite';

export default defineConfig({
  resolve: {
    alias: {
      // Mirrors the "@/*" path alias declared in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    wyw({
      include: ['**/*.{ts,tsx}'],
      sourceMap: false,
    }),
  ],
  test: {
    environment: 'jsdom',
  },
});
