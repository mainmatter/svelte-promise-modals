import { expect, Page, test } from '@playwright/test';

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
				focusTrapOptions: null
			}
		};
		await page.goto(
			`/testing?modalContainerOptions=${encodeURIComponent(JSON.stringify(options.modalContainerOptions))}`
		);

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

	test('focus trap is enabled by default', async ({ page }) => {
		await page.goto('/testing');

		await page.getByText('Open Modal').focus();
		await expect(page.getByText('Open Modal')).toBeFocused();

		await page.getByText('Open Modal').click();
		await expect(page.getByText('Open Modal')).not.toBeFocused();
		await expect(page.getByText('foo')).toBeFocused();
	});

	test('global focus trap options', async ({ page }) => {
		await page.goto('/testing?containerOnActivate=true');

		await page.getByText('Open Modal').click();
		expect(await readPreContent(page, 'focus-trap-activate')).toStrictEqual([]);
	});

	test('local focus trap options', async ({ page }) => {
		await page.goto('/testing?modalOnActivate=true');

		await page.getByText('Open Modal').click();
		expect(await readPreContent(page, 'focus-trap-activate')).toStrictEqual([]);
	});

	test('focus trap is disabled locally', async ({ page }) => {
		await page.goto('/testing?containerOnActivate=true&modalDisableFocusTrap=true');

		await page.getByText('Open Modal').click();
		expect(await readPreContent(page, 'focus-trap-activate')).toStrictEqual(undefined);
	});

	test('globally disabled focusTrapOptions is overriden when local options are provided', async ({
		page
	}) => {
		await page.goto('/testing?modalOnActivate=true&containerDisableFocusTrap=true');

		await page.getByText('Open Modal').click();
		expect(await readPreContent(page, 'focus-trap-activate')).toStrictEqual([]);
	});

	test('onDeactivate is called when the modal is closed when the Escape key is pressed', async ({
		page
	}) => {
		await page.goto('/testing?containerOnDeactivate=true');

		await page.getByText('Open Modal').click();
		await expect(page).toHaveScreenshot({ fullPage: true });
		await page.keyboard.press('Escape');
		await expect(page).toHaveScreenshot({ fullPage: true });
		expect(await readPreContent(page, 'focus-trap-deactivate')).toStrictEqual([]);
	});

	test('onDeactivate is called when the modal is closed via the close action', async ({ page }) => {
		await page.goto('/testing?containerOnDeactivate=true');

		await page.getByText('Open Modal').click();
		await page.getByText('close').click();
		expect(await readPreContent(page, 'focus-trap-deactivate')).toStrictEqual([]);
	});
});

async function readPreContent(page: Page, id: string): any {
	try {
		const content = (await page.getByTestId(id).textContent()) as any;
		return JSON.parse(content);
	} catch (err) {
		console.warn(
			new Error('readPreContent failed to parse content. This might be expected.', { cause: err })
		);
		return undefined;
	}
}
