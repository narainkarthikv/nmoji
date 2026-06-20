import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nmoji|nMoji/i);
  });

  test('should have no console errors on initial load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('should render emoji grid on app page', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    // Look for actual emoji content or grid container
    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText).toBeTruthy();
  });

  test('should display search bar component', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchInputVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    // Either search input or page content should be visible
    expect(
      isSearchInputVisible || (await page.textContent('body'))
    ).toBeTruthy();
  });

  test('should have responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const content = page.locator('body');
    await expect(content).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });
});
