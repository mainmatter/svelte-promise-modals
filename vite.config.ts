import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { configDefaults, type UserConfig as VitestConfig } from 'vitest/config';
// import { defineConfig } from 'vitest/config';

const config: UserConfig & { test: VitestConfig['test'] } = {
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
    // Exclude files in c8
    coverage: {
      exclude: ['setupTest.ts'],
    },
    // Exclude playwright tests folder
    exclude: [...configDefaults.exclude, 'tests'],
  },
};

export default config;
