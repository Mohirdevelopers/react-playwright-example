import { test, expect } from '@playwright/test';


test('welcome text', async ({ page }) => {
  await page.goto('/');

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Vite + React' })).toBeVisible();
});
