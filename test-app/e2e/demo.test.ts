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
