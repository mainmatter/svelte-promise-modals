import { expect, test } from '@playwright/test';

import { logMessages } from './test-helper.js';

test.describe('Destroy', () => {
  test.beforeEach(async ({ page }) => {
    logMessages(page);

    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('destroying the modal removes it from the DOM', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
    await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

    await page.getByTestId('open-foo').click();

    expect(await page.getByTestId('backdrop')).toBeTruthy();
    expect(await page.getByTestId('spm-modal')).toBeTruthy();

    await page.evaluate('window.destroyModals()');

    await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
    await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });
  });
});
