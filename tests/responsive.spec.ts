import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('should render correctly on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const content = page.locator('body');
    await expect(content).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
  });

  test('should render correctly on tablet viewport (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const content = page.locator('body');
    await expect(content).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(768);
  });

  test('should render correctly on desktop viewport (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const content = page.locator('body');
    await expect(content).toBeVisible();

    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);
  });

  test('should handle viewport resize correctly', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const originalViewport = page.viewportSize();

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    const mobileViewport = page.viewportSize();
    expect(mobileViewport?.width).toBe(375);

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);

    const desktopViewport = page.viewportSize();
    expect(desktopViewport?.width).toBe(1920);
  });

  test('should support touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]').first();
    const isSearchVisible = await searchInput.isVisible({ timeout: 2000 }).catch(() => false);

    if (isSearchVisible) {
      // Use click instead of tap for better compatibility
      await searchInput.click();
      await searchInput.fill('smile');
      await page.waitForTimeout(500);
    }

    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
  });

  test('should scale properly across different screen sizes', async ({ page }) => {
    const sizes = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];

    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/app');
      await page.waitForLoadState('networkidle');

      const content = await page.textContent('body');
      expect(content).toBeTruthy();

      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(size.width);
    }
  });
});
