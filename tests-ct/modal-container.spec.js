import { expect, test } from '@playwright/experimental-ct-svelte';

import TestApp from './TestApp.svelte';

test.describe('ModalContainer', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('missing', async ({ mount, page }) => {
    await mount(TestApp, {
      props: {
        modalContainerCount: 0,
      },
    });

    await expect(page.getByTestId('error-message')).toBeHidden();

    await page.getByTestId('open-modal-button').click();

    await expect(page.getByTestId('error-message')).toHaveText(
      'Error: <ModalContainer /> is missing'
    );
  });

  test('too many', async ({ mount, page, context }) => {
    await mount(TestApp, {
      props: {
        modalContainerCount: 2,
      },
    });

    await expect(page.getByTestId('error-message')).toBeHidden();

    await page.getByTestId('open-modal-button').click();

    await expect(page.getByTestId('error-message')).toHaveText(
      'Error: Multiple <ModalContainer /> instances exist in the application. Please make sure there is only one rendered at a time.'
    );
  });
});
