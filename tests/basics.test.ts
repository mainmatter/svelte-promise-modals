import { expect, test } from '@playwright/test';

import { logMessages } from './test-helper.js';

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

test('clicking the backdrop does not close the modal if `clickOutsideDeactivates` is `false`', async ({
  page,
  context,
}) => {
  // Reduced motion will speed up animations which comes handy for testing
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await context.exposeBinding('modalOptions', () => ({
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  }));

  await page.goto('/');

  await page.waitForSelector('[data-testid="backdrop"]', { state: 'hidden', timeout: 500 });
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

  await page.getByTestId('open-foo').click();

  expect(await page.getByTestId('backdrop')).toBeTruthy();
  expect(await page.getByTestId('spm-modal')).toBeTruthy();

  // The backdrop isn't interactive (hence `force: true`), but it shouldn't really be, as it's only
  // a convenience for pointing device users and not the primary means of closing modals.
  await page.locator('[data-testid="backdrop"]').click({ force: true, position: { x: 1, y: 1 } });

  expect(await page.getByTestId('backdrop')).toBeTruthy();
  expect(await page.getByTestId('spm-modal')).toBeTruthy();
});

test('opening a modal disables scrolling on the <body> element', async ({ page }) => {
  let getBodyStyle = () => {
    return page.locator('body').evaluate((element) => window.getComputedStyle(element));
  };

  // Reduced motion will speed up animations which comes handy for testing
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/');

  expect((await getBodyStyle()).overflow).toBe('visible');

  await page.getByTestId('open-foo').click();

  expect((await getBodyStyle()).overflow).toBe('hidden');

  await page.getByTestId('close').click();
  await page.waitForSelector('[data-testid="spm-modal"]', { state: 'hidden', timeout: 500 });

  expect((await getBodyStyle()).overflow).toBe('visible');
});

test('closing the modal via the close function returns passed values', async ({
  page,
  context,
}) => {
  await context.exposeBinding('modalResult', () => undefined);

  // Reduced motion will speed up animations which comes handy for testing
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByTestId('open-foo').click();
  await page.getByTestId('close').click();

  expect(await page.evaluate('modalResult')).toMatchObject({ foo: 'bar' });
});
