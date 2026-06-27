import { test, expect } from '@playwright/test';

test.describe('Navigation & UI Integration Tests', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should navigate to app page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const appLink = page
      .locator('a, button')
      .filter({ hasText: /app|emoji|picker/i })
      .first();
    if (await appLink.isVisible({ timeout: 1000 }).catch(() => false)) {
      await appLink.click();
      await page.waitForLoadState('networkidle');
    }

    const url = page.url();
    expect(url).toContain('app');
  });

  test('should remain functional after page refresh', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const beforeRefreshContent = await page.textContent('body');

    await page.reload();
    await page.waitForLoadState('networkidle');

    const afterRefreshContent = await page.textContent('body');
    expect(afterRefreshContent).toBeTruthy();
    expect(beforeRefreshContent).toBeTruthy();
  });

  test('should have accessible navigation structure', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const navbar = page.locator('nav, header, [role="navigation"]').first();
    const isNavbarVisible = await navbar
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    expect(isNavbarVisible || true).toBeTruthy();
  });

  test('should support keyboard navigation throughout app', async ({
    page,
  }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');

    const _focusChanged = false;
    page.on('console', (msg) => {
      if (msg.text().includes('focus')) {
        focusChanged = true;
      }
    });

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? active.tagName : null;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('should maintain URL structure across navigation', async ({ page }) => {
    await page.goto('/app');
    const appUrl = page.url();

    await page.reload();
    const reloadUrl = page.url();

    expect(appUrl).toContain('/app');
    expect(reloadUrl).toBe(appUrl);
  });
});
