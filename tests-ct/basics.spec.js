import { expect, test } from '@playwright/experimental-ct-svelte';
import sinon from 'sinon';

import TestApp from './TestApp.svelte';

test.describe('Basics', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('clicking the backdrop closes the modal', async ({ mount, page }) => {
    await mount(TestApp);

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();

    await page.getByText('Open Modal').click();

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

    await expect(page.getByTestId('backdrop')).toBeHidden();
    await expect(page.getByTestId('spm-modal')).toBeHidden();
  });

  test('clicking the backdrop does not close the modal if `clickOutsideDeactivates` is `false`', async ({
    mount,
    page,
  }) => {
    await mount(TestApp, {
      props: {
        openModalOptions: {
          focusTrapOptions: {
            clickOutsideDeactivates: false,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();

    await expect(page.getByTestId('backdrop')).toBeVisible();
    await expect(page.getByTestId('spm-modal')).toBeVisible();

    // The backdrop isn't interactive (hence `force: true`), but it shouldn't really be, as it's only
    // a convenience for pointing device users and not the primary means of closing modals.
    await page.getByTestId('backdrop').click({ force: true, position: { x: 1, y: 1 } });

    await expect(page.getByTestId('backdrop')).toBeVisible();
    await expect(page.getByTestId('spm-modal')).toBeVisible();
  });

  test('opening a modal disables scrolling on the <body> element', async ({ mount, page }) => {
    let getBodyStyle = () => {
      return page.locator('body').evaluate((element) => window.getComputedStyle(element));
    };

    await mount(TestApp);

    await expect((await getBodyStyle()).overflow).toBe('visible');
    expect(page.getByTestId('backdrop')).toBeHidden();

    await page.getByText('Open Modal').click();

    await expect(page.getByTestId('backdrop')).toBeVisible();
    expect((await getBodyStyle()).overflow).toBe('hidden');

    await page.getByText('close').click();

    await expect(page.getByTestId('backdrop')).toBeHidden();
    expect((await getBodyStyle()).overflow).toBe('visible');
  });

  test('pressing the Escape keyboard button closes the modal', async ({ mount, page }) => {
    await mount(TestApp);

    await page.getByText('Open Modal').click();

    await expect(page.getByTestId('spm-modal')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('spm-modal')).toBeHidden();
  });

  test('closing the modal via the close function returns passed values', async ({
    mount,
    page,
  }) => {
    let resultCallback = sinon.fake();

    await mount(TestApp, {
      props: {
        modalProps: {
          foo: 'bar',
        },
        resultCallback,
      },
    });

    await page.getByText('Open Modal').click();
    await page.getByText('close').click();

    await expect(resultCallback.called).toBeTruthy();
    await expect(resultCallback.lastCall.firstArg).toMatchObject({ foo: 'bar' });
  });

  test('opening and closing a modal both adds `.spm-animating` class to <body>', async ({
    mount,
    page,
  }) => {
    await mount(TestApp);

    await page.waitForSelector('body:not(.spm-animating)');

    await page.getByText('Open Modal').click();

    await page.waitForSelector('body.spm-animating');
    await page.waitForSelector('body:not(.spm-animating)');

    await page.getByText('close').click();

    await page.waitForSelector('body.spm-animating');
    await page.waitForSelector('body:not(.spm-animating)');
  });
});
