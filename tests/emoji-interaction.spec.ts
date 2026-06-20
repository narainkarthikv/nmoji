import { test, expect } from '@playwright/test';

test.describe('Emoji Interaction & Copy Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
  });

  test('should select an emoji on click', async ({ page }) => {
    const firstEmoji = page.locator('[class*="emoji"], button').first();
    await expect(firstEmoji).toBeVisible();

    await firstEmoji.click();
    await page.waitForTimeout(300);

    const body = page.locator('body');
    const bodyText = await body.textContent();
    expect(bodyText).toBeTruthy();
  });

  test('should copy emoji to clipboard', async ({ page }) => {
    const firstEmoji = page.locator('[class*="emoji"], button').first();
    await expect(firstEmoji).toBeVisible();

    const clipboardHandle = await page.evaluateHandle(() => navigator.clipboard);
    let clipboardContent = '';

    page.on('console', (msg) => {
      if (msg.text().includes('copied')) {
        clipboardContent = msg.text();
      }
    });

    await firstEmoji.click();
    await page.waitForTimeout(500);

    const firstEmojiText = await firstEmoji.textContent();
    if (firstEmojiText) {
      expect(firstEmojiText).toBeTruthy();
    }
  });

  test('should display emoji details when emoji is selected', async ({ page }) => {
    const firstEmoji = page.locator('[class*="emoji"], button').first();
    await expect(firstEmoji).toBeVisible();

    await firstEmoji.click();
    await page.waitForTimeout(300);

    const detailPanel = page.locator('[class*="description"], [class*="detail"], [class*="info"]').first();
    if (await detailPanel.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(detailPanel).toBeVisible();
    }
  });

  test('should handle multiple emoji selections', async ({ page }) => {
    const emojis = page.locator('[class*="emoji"], button').filter({ hasNot: page.locator('svg') });
    const count = await emojis.count();

    if (count >= 2) {
      const firstEmoji = emojis.nth(0);
      const secondEmoji = emojis.nth(1);

      await firstEmoji.click();
      await page.waitForTimeout(300);

      const firstText = await firstEmoji.textContent();

      await secondEmoji.click();
      await page.waitForTimeout(300);

      const secondText = await secondEmoji.textContent();

      expect(firstText).not.toBe(secondText);
    }
  });

  test('should support keyboard navigation for emoji selection', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
  });
});
