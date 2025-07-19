import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';
import type { UserConfig as VitestConfig } from 'vitest/config';

const config: UserConfig & { test: VitestConfig['test'] } = defineConfig(({ mode }) => ({
  plugins: [sveltekit()],
  define: {
    // Eliminate in-source test code
    'import.meta.vitest': 'undefined',
  },
  test: {
    // Can't patch `expect` otherwise
    globals: true,
    // Importing CSS only inside components won't do it in vitest
    css: {
      include: [/.+\.css/],
    },
    environment: 'jsdom',
    // in-source testing
    includeSource: ['src/**/*.{js,ts,svelte}'],
    // Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
    setupFiles: ['./setupTest.ts'],
    include: ['src/**/*.test.{js,ts}'],
  },
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
}));

export default config;
