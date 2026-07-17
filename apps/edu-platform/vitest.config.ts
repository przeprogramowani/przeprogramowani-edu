import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })] as never,
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    environmentMatchGlobs: [
      ['src/components/**/*.test.ts', 'jsdom'],
      ['src/utils/extractHeadingsFromMarkdown.test.ts', 'jsdom'],
    ],
  },
  resolve: {
    conditions: ['browser'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@edu/circle': path.resolve(__dirname, '../../libs/circle/src'),
    },
  },
});
