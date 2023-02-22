/* eslint-disable @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom/extend-expect';
import '@sveltejs/kit';

import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

import type * as environment from '$app/environment';

// Add custom jest matchers
expect.extend(matchers);

// Mock SvelteKit runtime module $app/environment
vi.mock('$app/environment', (): typeof environment => ({
  browser: false,
  dev: true,
  building: false,
  version: 'any',
}));
