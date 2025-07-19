import { expect, test } from '@playwright/test';

test('it renders', async ({ page }) => {
	await page.goto('/demo');
	await expect(page.getByTestId('open:user-modal')).toBeVisible();
	await expect(page.getByTestId('open:inner-modal')).toBeVisible();
});

test('it opens user modal', async ({ page }) => {
	await page.goto('/demo');
	await expect(page.getByTestId('user-modal')).not.toBeVisible();
	await expect(page).toHaveScreenshot({ fullPage: true });
	await page.getByTestId('open:user-modal').click();
	await expect(page.getByTestId('user-modal')).toBeVisible();
	await expect(page).toHaveScreenshot({ fullPage: true });
});

test('removing the parent component removes the modal as well', async ({ page }) => {
	await page.goto('/demo');

	await expect(page.getByTestId('backdrop')).toBeHidden();
	await expect(page.getByTestId('spm-modal')).toBeHidden();

	await expect(page).toHaveScreenshot({ fullPage: true });
	await page.getByTestId('open:inner-modal').click();

	await expect(page.getByTestId('backdrop')).toBeVisible();
	await expect(page.getByTestId('spm-modal')).toBeVisible();
	await expect(page).toHaveScreenshot({ fullPage: true });

	await page.evaluateHandle(() =>
		(
			window.document.querySelector(
				"[data-testid='toggle:wrapper-visibility']"
			) as HTMLButtonElement
		).click()
	);
	await page.waitForTimeout(500);
	await expect(page).toHaveScreenshot({ fullPage: true });

	await expect(page.getByTestId('backdrop')).toBeHidden();
	await expect(page.getByTestId('spm-modal')).toBeHidden();
});

test('it opens save-user modal and displays output', async ({ page }) => {
	await page.goto('/demo');

	await expect(page.getByTestId('save-user-modal')).not.toBeVisible();
	await page.getByTestId('open:save-user-modal').click();
	await expect(page.getByTestId('save-user-modal')).toBeVisible();
	await page.getByTestId('save:user-modal').click();

	const preOutput = page.getByTestId('output:user-modal');
	await expect(preOutput).toBeVisible();
	await expect(JSON.parse((await preOutput.textContent()) as string)).toStrictEqual({
		id: 'a-b-c',
		name: 'Saved user'
	});
	await expect(page).toHaveScreenshot({ fullPage: true });
});
