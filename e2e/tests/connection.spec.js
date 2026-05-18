import { test, expect } from '@playwright/test';

const DB_HOST = process.env.E2E_DB_HOST || 'localhost';
const DB_PORT = process.env.E2E_DB_PORT || '5455';
const DB_USER = process.env.E2E_DB_USER || 'ageviewer_e2e';
const DB_PASSWORD = process.env.E2E_DB_PASSWORD || '';
const DB_NAME = process.env.E2E_DB_NAME || 'ageviewer_e2e';

test.describe('Database Connection', () => {
  test('connects to database and shows status', async ({ page }) => {
    await page.goto('/');

    // Wait for the connection form to appear (app calls getConnectionStatus → rejected → shows form)
    await expect(page.locator('text=Connect to Database')).toBeVisible({ timeout: 15000 });

    // Fill in connection form
    await page.fill('input[placeholder="192.168.0.1"]', DB_HOST);
    await page.fill('input[placeholder="5432"]', DB_PORT);
    await page.fill('input[placeholder="postgres"][id="database"]', DB_NAME);
    await page.fill('input[placeholder="postgres"][id="user"]', DB_USER);
    await page.fill('input[placeholder="postgres"][id="password"]', DB_PASSWORD);

    // Submit
    await page.click('button:has-text("Connect")');

    // Should show connection success (wait longer in CI)
    await expect(page.locator('text=Connection Status')).toBeVisible({ timeout: 30000 });
  });

  test('shows error on invalid connection', async ({ page }) => {
    await page.goto('/');

    // Wait for the connection form
    await expect(page.locator('text=Connect to Database')).toBeVisible({ timeout: 15000 });

    // Fill with invalid host
    await page.fill('input[placeholder="192.168.0.1"]', 'invalid-host-xyz');
    await page.fill('input[placeholder="5432"]', '59999');
    await page.fill('input[placeholder="postgres"][id="database"]', 'nonexistent');
    await page.fill('input[placeholder="postgres"][id="user"]', 'nobody');
    await page.fill('input[placeholder="postgres"][id="password"]', 'wrong');

    await page.click('button:has-text("Connect")');

    // Should show error notification
    await expect(page.locator('text=Database Connection Failed')).toBeVisible({ timeout: 30000 });
  });
});
