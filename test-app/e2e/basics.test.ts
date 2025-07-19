import { expect, test } from '@playwright/test';

test.describe('Basics', () => {
	test.beforeEach(async ({ page }) => {
		// Reduced motion will speed up animations which comes handy for testing
		await page.emulateMedia({ reducedMotion: 'reduce' });
	});

	test('clicking the backdrop closes the modal', async ({ page }) => {
		await page.goto('/testing');

		await expect(page.getByTestId('backdrop')).toBeHidden();
		await expect(page.getByTestId('spm-modal')).toBeHidden();

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('backdrop')).toBeVisible();
		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.waitForFunction(async () => {
			let backdrop = document.querySelector('.spm-backdrop');
			let { opacity } = window.getComputedStyle(backdrop);

			return opacity === '1';
		});

		let { pointerEvents } = await page
			.getByTestId('backdrop')
			.evaluate((element) => window.getComputedStyle(element));

		expect(pointerEvents).toBe('auto');

		// The backdrop isn't interactive (hence `force: true`), but it shouldn't really be, as it's only
		// a convenience for pointing device users and not the primary means of closing modals.
		await page.getByTestId('backdrop').click({ force: true, position: { x: 1, y: 1 } });

		// Wait for animation to complete
		await page.waitForTimeout(100);

		await expect(page.getByTestId('backdrop')).toBeHidden();
		await expect(page.getByTestId('spm-modal')).toBeHidden();
	});

	test('clicking the backdrop does not close the modal if `clickOutsideDeactivates` is `false`', async ({
		page
	}) => {
		const options = {
			openModalOptions: {
				clickOutsideDeactivates: false
			}
		};
		await page.goto(
			`/testing?openModalOptions=${encodeURIComponent(JSON.stringify(options.openModalOptions))}`
		);

		await expect(page.getByTestId('spm-modal')).toBeHidden();

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.waitForFunction(async () => {
			let backdrop = document.querySelector('.spm-backdrop');
			let { opacity } = window.getComputedStyle(backdrop);

			return opacity === '1';
		});

		await page.getByTestId('backdrop').click({ force: true, position: { x: 1, y: 1 } });

		await expect(page.getByTestId('spm-modal')).toBeVisible();
	});

	test('pressing Escape closes the modal', async ({ page }) => {
		await page.goto('/testing');

		await expect(page.getByTestId('spm-modal')).toBeHidden();

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.waitForFunction(async () => {
			let backdrop = document.querySelector('.spm-backdrop');
			let { opacity } = window.getComputedStyle(backdrop);

			return opacity === '1';
		});

		await page.keyboard.press('Escape');

		// Wait for animation to complete
		await page.waitForTimeout(100);

		await expect(page.getByTestId('spm-modal')).toBeHidden();
	});

	test('pressing Escape does not close the modal if `escapeDeactivates` is `false`', async ({
		page
	}) => {
		const options = {
			openModalOptions: {
				escapeDeactivates: false
			}
		};
		await page.goto(
			`/testing?openModalOptions=${encodeURIComponent(JSON.stringify(options.openModalOptions))}`
		);

		await expect(page.getByTestId('spm-modal')).toBeHidden();

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.waitForFunction(async () => {
			let backdrop = document.querySelector('.spm-backdrop');
			let { opacity } = window.getComputedStyle(backdrop);

			return opacity === '1';
		});

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('spm-modal')).toBeVisible();
	});

	test('the modal receives props', async ({ page }) => {
		const modalProps = { foo: 'bar' };
		await page.goto(`/testing?modalProps=${encodeURIComponent(JSON.stringify(modalProps))}`);

		await expect(page.getByTestId('foo-prop')).toBeHidden();

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('foo-prop')).toHaveText('bar');
	});

	test('multiple close modals are registered with correct lifecycle', async ({ page }) => {
		await page.goto('/testing');

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		// Hide the wrapper.
		await page.evaluate(() => {
			return window.handle.hideWrapper();
		});

		await expect(page.getByTestId('open-modal-using-context-button')).toBeHidden();

		// The modal must still be visible.
		await expect(page.getByTestId('spm-modal')).toBeVisible();
	});

	test('the modal resolves with a value once closed', async ({ page }) => {
		await page.goto('/testing');

		// Set up a listener for the result before opening the modal
		await page.evaluate(() => {
			window.lastModalResult = undefined;
		});

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.getByTestId('close').click();

		// Wait for animation to complete
		await page.waitForTimeout(100);

		await expect(page.getByTestId('spm-modal')).toBeHidden();

		const result = await page.evaluate(() => window.lastModalResult);
		expect(result).toBeUndefined();
	});

	test('the modal resolves with a value once closed with props', async ({ page }) => {
		const modalProps = { foo: 'bar' };
		await page.goto(`/testing?modalProps=${encodeURIComponent(JSON.stringify(modalProps))}`);

		// Set up a listener for the result before opening the modal
		await page.evaluate(() => {
			window.lastModalResult = undefined;
		});

		await page.getByTestId('open-modal-button').click();

		await expect(page.getByTestId('spm-modal')).toBeVisible();

		await page.getByTestId('close').click();

		// Wait for animation to complete
		await page.waitForTimeout(100);

		await expect(page.getByTestId('spm-modal')).toBeHidden();

		const result = await page.evaluate(() => window.lastModalResult);
		expect(result).toBe('bar');
	});
});
