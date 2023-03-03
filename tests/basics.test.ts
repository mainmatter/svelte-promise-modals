import { expect, test } from '@playwright/test';

import { logMessages } from './test-helper';

test('clicking the backdrop closes the modal', async ({ page }) => {
  logMessages(page);

  // Reduced motion will speed up animations which comes handy for testing
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/');

  await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

  await page.getByTestId('open-foo').click();

  expect(await page.getByTestId('backdrop')).toBeTruthy();
  expect(await page.getByTestId('spm-modal')).toBeTruthy();

  await page.waitForFunction(async () => {
    let backdrop = document.querySelector('.spm-backdrop') as Element;
    let { opacity } = window.getComputedStyle(backdrop);

    return opacity === '1';
  });

  let { pointerEvents } = await page
    .locator('[data-testid="backdrop"]')
    .evaluate((element) => window.getComputedStyle(element));

  expect(pointerEvents).toBe('auto');

  // The backdrop isn't interactive (hence `force: true`), but it shouldn't really be, as it's only
  // a convenience for pointing device users and not the primary means of closing modals.
  page.locator('[data-testid="backdrop"]').click({ force: true, position: { x: 1, y: 1 } });

  await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });
});
