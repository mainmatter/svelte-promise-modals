import { expect, test } from '@playwright/test';

import { logMessages } from './test-helper';

test('clicking the backdrop closes the modal', async ({ page }) => {
  logMessages(page);

  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/');

  await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

  await page.getByText('Open').click();

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

  page.locator('[data-testid="backdrop"]').click();

  await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });
});
