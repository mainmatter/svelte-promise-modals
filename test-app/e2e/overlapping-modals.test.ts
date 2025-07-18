import { expect, test } from '@playwright/test';

test.describe('Overlapping modals', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('overlapping modals', async ({ page }) => {
    await page.goto('/testing');
    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();

    await page.getByText('Open Modal').click();

    await expect(page.locator('[data-testid="backdrop"]')).toHaveCount(1);

    await page.getByText('Open another modal').click();

    await expect(page.locator('[data-testid="backdrop"]')).toHaveCount(2);

    await page.waitForSelector('body:not(.spm-animating)');

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
