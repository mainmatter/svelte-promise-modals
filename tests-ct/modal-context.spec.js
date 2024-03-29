import { expect, test } from '@playwright/experimental-ct-svelte';

import TestApp from './TestApp.svelte';

test.describe('Modal Context', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('removing the parent component removes the modal as well', async ({ mount, page }) => {
    await mount(TestApp);

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();

    await page.getByText('Open Using Context').click();

    await expect(page.getByTestId('backdrop')).toBeVisible();
    await expect(page.getByTestId('spm-modal')).toBeVisible();

    await page.evaluateHandle(() => window.handle.hideWrapper());

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();
  });
});
