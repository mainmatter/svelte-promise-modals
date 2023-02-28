import type { Page } from '@playwright/test';

export const logMessages = (page: Page) => {
  page.on('console', (msg) => console.log(msg.text()));
};
