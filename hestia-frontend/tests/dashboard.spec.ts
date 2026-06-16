import { test, expect } from '@playwright/test';

test('has title and dashboard is accessible without login', async ({ page }) => {
  // Navigate directly to dashboard
  await page.goto('/dashboard');

  // Expects page to have a heading (either language)
  await expect(page.getByRole('heading', { name: /Bem-vindo|Welcome/i })).toBeVisible();
});
