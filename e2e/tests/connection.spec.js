import { test, expect } from '@playwright/test';

const DB_HOST = process.env.E2E_DB_HOST || 'localhost';
const DB_PORT = process.env.E2E_DB_PORT || '5455';
const DB_USER = process.env.E2E_DB_USER || 'ageviewer_e2e';
const DB_PASSWORD = process.env.E2E_DB_PASSWORD || '';
const DB_NAME = process.env.E2E_DB_NAME || 'ageviewer_e2e';

test.describe('Database Connection', () => {
  test('connects to database and shows status', async ({ page }) => {
    await page.goto('/');

    // Wait for the connection form to appear
    await expect(page.locator('text=Connect to Database')).toBeVisible({ timeout: 15000 });

    // Fill in connection form using Carbon component IDs
    await page.fill('#host', DB_HOST);
    // Carbon NumberInput renders the input with the given id
    await page.fill('#port', DB_PORT);
    await page.fill('#database', DB_NAME);
    await page.fill('#user', DB_USER);
    await page.fill('#password', DB_PASSWORD);

    // Submit
    await page.click('button[type="submit"]:has-text("Connect")');

    // After successful connection, the :server status frame is added
    // which contains "Connection Status" heading
    await expect(page.locator('text=Connection Status')).toBeVisible({ timeout: 30000 });
  });

  test('shows error on invalid connection', async ({ page }) => {
    await page.goto('/');

    // Wait for the connection form
    await expect(page.locator('text=Connect to Database')).toBeVisible({ timeout: 15000 });

    // Fill with invalid credentials
    await page.fill('#host', 'invalid-host-xyz');
    await page.fill('#port', '59999');
    await page.fill('#database', 'nonexistent');
    await page.fill('#user', 'nobody');
    await page.fill('#password', 'wrong');

    await page.click('button[type="submit"]:has-text("Connect")');

    // Should show error notification
    await expect(page.locator('text=Database Connection Failed')).toBeVisible({ timeout: 30000 });
  });
});
