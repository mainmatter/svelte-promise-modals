import { expect, test } from '@playwright/test';

test('it renders', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('open:user-modal')).toBeVisible();
	await expect(page.getByTestId('open:inner-modal')).toBeVisible();
});

test('it opens user modal', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByTestId('user-modal')).not.toBeVisible();
	await page.getByTestId('open:user-modal').click();
	await expect(page.getByTestId('user-modal')).toBeVisible();
});

  test('removing the parent component removes the modal as well', async ({ page }) => {
	  await page.goto('/');

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();

    await page.getByTestId("open:inner-modal").click();

    await expect(page.getByTestId('backdrop')).toBeVisible();
    await expect(page.getByTestId('spm-modal')).toBeVisible();

    await page.evaluateHandle(() => (window.document.querySelector("[data-testid='toggle:wrapper-visibility']") as HTMLButtonElement).click());
  await page.waitForTimeout(500);

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();
  });
