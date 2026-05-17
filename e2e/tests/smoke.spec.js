import { test, expect } from '@playwright/test';

test.describe('E2E Smoke Test', () => {
  test('app loads and shows connection form', async ({ page }) => {
    await page.goto('/');
    // The app should load and show the AGE Viewer interface
    await expect(page).toHaveTitle(/AGEViewer/);
  });
});
