import { test, expect } from '@playwright/test';

test.describe('external login page', () => {
  test('renders login form for 10xDevs 3 prework', async ({ page }) => {
    await page.goto('/external/10xdevs-3-prework/login');

    await expect(page.getByLabel(/adres email|email address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /wyślij link do logowania|send sign-in link/i })).toBeVisible();
  });
});
