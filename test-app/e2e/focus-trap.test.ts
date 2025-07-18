import { expect, test } from '@playwright/test';

test.describe('Focus trap', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('tabbing works and focus is trapped', async ({ page }) => {
    await page.goto('/testing');

    // Open the modal
    await page.getByTestId('open-modal-button').click();

    // Wait for the modal to open
    await page.waitForFunction(async () => {
      let modal = document.querySelector('.spm-modal');
      let { opacity } = window.getComputedStyle(modal);

      return opacity === '1';
    });

    await expect(page.getByTestId('foo-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('show-modal-2')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('close')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('foo-button')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('close')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('show-modal-2')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('foo-button')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('close')).toBeFocused();
  });

  test('focus returns to the last focused element once the modal is closed', async ({ page }) => {
    await page.goto('/testing');

    await page.getByTestId('open-modal-button').focus();
    await page.keyboard.press('Enter');

    // Wait for the modal to open
    await page.waitForFunction(async () => {
      let modal = document.querySelector('.spm-modal');
      let { opacity } = window.getComputedStyle(modal);

      return opacity === '1';
    });

    await expect(page.getByTestId('foo-button')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('spm-modal')).toBeHidden();
    await expect(page.getByTestId('open-modal-button')).toBeFocused();
  });

  test('the modal container option `focusTrapOptions=null` works', async ({ page }) => {
    const options = {
      modalContainerOptions: {
        focusTrapOptions: null,
      },
    };
    await page.goto(`/testing?modalContainerOptions=${encodeURIComponent(JSON.stringify(options.modalContainerOptions))}`);

    await page.getByTestId('open-modal-button').click();
    await page.waitForFunction(async () => {
      let modal = document.querySelector('.spm-modal');
      let { opacity } = window.getComputedStyle(modal);

      return opacity === '1';
    });

    await expect(page.getByTestId('open-modal-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('open-modal-using-context-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('foo-button')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('show-modal-2')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('close')).toBeFocused();
  });
});
