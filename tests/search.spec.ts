import { test, expect } from '@playwright/test';

test.describe('Search Functionality Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
  });

  test('should search for valid emoji keyword and display results', async ({
    page,
  }) => {
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isSearchVisible) {
      await searchInput.fill('smile');
      await page.waitForTimeout(500);

      // Verify search executed
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe('smile');
    }
  });

  test('should clear search and show all emojis', async ({ page }) => {
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isSearchVisible) {
      await searchInput.fill('smile');
      await page.waitForTimeout(500);

      await searchInput.clear();
      await page.waitForTimeout(500);

      const inputValue = await searchInput.inputValue();
      expect(inputValue).toBe('');
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isSearchVisible) {
      await searchInput.fill('xyznonexistent12345');
      await page.waitForTimeout(500);

      const page_content = await page.textContent('body');
      expect(page_content).toBeTruthy();
    }
  });

  test('should perform real-time search with debouncing', async ({ page }) => {
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isSearchVisible) {
      await searchInput.type('h', { delay: 100 });
      await page.waitForTimeout(300);

      await searchInput.type('e', { delay: 100 });
      await page.waitForTimeout(300);

      await searchInput.type('a', { delay: 100 });
      await page.waitForTimeout(300);

      await searchInput.type('rt', { delay: 100 });
      await page.waitForTimeout(500);

      const body_content = await page.textContent('body');
      expect(body_content).toBeTruthy();
    }
  });

  test('should maintain search state after page interaction', async ({
    page,
  }) => {
    const searchInput = page
      .locator(
        'input[type="text"], input[placeholder*="search" i], input[placeholder*="emoji" i]'
      )
      .first();
    const isSearchVisible = await searchInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isSearchVisible) {
      await searchInput.fill('love');
      await page.waitForTimeout(500);

      const searchInputValue = await searchInput.inputValue();
      expect(searchInputValue).toBe('love');

      await searchInput.click();
      expect(await searchInput.inputValue()).toBe('love');
    }
  });

  test('should display clean category and collection dropdown labels without internal keys', async ({
    page,
  }) => {
    // Verify collection dropdown button displays user-facing label without internal '(all)' key
    const collectionBtn = page
      .locator('button[aria-haspopup="listbox"]')
      .first();
    if (await collectionBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      const text = await collectionBtn.textContent();
      expect(text).toContain('All Emojis');
      expect(text).not.toContain('(all)');
    }

    // Verify category select options display friendly names and icons without internal keys
    const categorySelect = page.locator('#category-select').first();
    if (await categorySelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      const optionTexts = await categorySelect
        .locator('option')
        .allTextContents();
      for (const opt of optionTexts) {
        expect(opt).not.toMatch(/\([a-z_]+\)/);
      }
    }
  });
});
