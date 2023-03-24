import { expect, test } from '@playwright/test';

import { logMessages } from './test-helper.js';

test.describe('Overlapping modals', () => {
  test.beforeEach(async ({ page }) => {
    logMessages(page);

    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('every modal should have a dedicated backdrop', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
    await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

    await page.getByTestId('open-foo').click();

    await expect(page.locator('[data-testid="backdrop"]')).toHaveCount(1);

    await page.getByTestId('show-modal-2').click();

    await page.waitForSelector('body:not(.spm-animating)');

    await expect(page.locator('[data-testid="backdrop"]')).toHaveCount(2);

    let backdropStyles;

    backdropStyles = await page
      .locator('[data-testid="backdrop"]')
      .nth(0)
      .evaluate((element) => window.getComputedStyle(element));

    expect(backdropStyles.pointerEvents).toBe('auto');
    expect(backdropStyles.opacity).toBe('1');

    backdropStyles = await page
      .locator('[data-testid="backdrop"]')
      .nth(1)
      .evaluate((element) => window.getComputedStyle(element));

    expect(backdropStyles.pointerEvents).toBe('auto');
    expect(backdropStyles.opacity).toBe('1');
  });
});
