import { expect, test } from '@playwright/experimental-ct-svelte';
import sinon from 'sinon';

import TestApp from './TestApp.svelte';

test.describe('Focus trap', () => {
  test.beforeEach(async ({ page }) => {
    // Reduced motion will speed up animations which comes handy for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('focus trap is enabled by default', async ({ mount, page }) => {
    await mount(TestApp);

    await page.getByText('Open Modal').focus();
    await expect(page.getByText('Open Modal')).toBeFocused();

    await page.getByText('Open Modal').click();
    await expect(page.getByText('Open Modal')).not.toBeFocused();
    await expect(page.getByText('foo')).toBeFocused();
  });

  test('focus trap can be disabled', async ({ page, mount }) => {
    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: null,
        },
      },
    });

    await page.getByText('Open Modal').focus();
    await expect(page.getByText('Open Modal')).toBeFocused();

    await page.getByText('Open Modal').click();
    await expect(page.getByText('Open Modal')).toBeFocused();
    await expect(page.getByText('foo')).not.toBeFocused();
  });

  test('global focus trap options', async ({ mount, page }) => {
    let onActivate = sinon.fake();

    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: {
            onActivate,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();
    await expect(onActivate.called).toBeTruthy();
  });

  test('local focus trap options', async ({ mount, page }) => {
    let onActivate = sinon.fake();

    await mount(TestApp, {
      props: {
        openModalOptions: {
          focusTrapOptions: {
            onActivate,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();
    await expect(onActivate.called).toBeTruthy();
  });

  test('focus trap is disabled locally', async ({ mount, page }) => {
    let onActivate = sinon.fake();

    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: {
            onActivate,
          },
        },
        openModalOptions: {
          focusTrapOptions: null,
        },
      },
    });

    await page.getByText('Open Modal').click();
    await expect(onActivate.called).not.toBeTruthy();
  });

  test('globally disabled focusTrapOptions is overriden when local options are provided', async ({
    mount,
    page,
  }) => {
    let onActivate = sinon.fake();

    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: null,
        },
        openModalOptions: {
          focusTrapOptions: {
            onActivate,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();
    await expect(onActivate.called).toBeTruthy();
  });

  test('onDeactivate is called when the modal is closed when the Escape key is pressed', async ({
    mount,
    page,
  }) => {
    let onDeactivate = sinon.fake();

    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: {
            onDeactivate,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();
    await page.keyboard.press('Escape');
    await expect(onDeactivate.called).toBeTruthy();
  });

  test('onDeactivate is called when the modal is closed via the close action', async ({
    mount,
    page,
  }) => {
    let onDeactivate = sinon.fake();

    await mount(TestApp, {
      props: {
        modalContainerOptions: {
          focusTrapOptions: {
            onDeactivate,
          },
        },
      },
    });

    await page.getByText('Open Modal').click();
    await page.getByText('close').click();
    await expect(onDeactivate.called).toBeTruthy();
  });
});
