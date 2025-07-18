import { expect, test } from '@playwright/test';

test.describe('Modal context', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('the modal can be opened using context', async ({ page }) => {
    await page.goto('/testing');

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();

    await page.getByTestId('open-modal-using-context-button').click();

    await expect(page.getByTestId('backdrop')).toBeVisible();
    await expect(page.getByTestId('spm-modal')).toBeVisible();

    await page.waitForFunction(async () => {
      let backdrop = document.querySelector('.spm-backdrop');
      let { opacity } = window.getComputedStyle(backdrop);

      return opacity === '1';
    });

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('spm-modal')).toBeHidden();
  });
});