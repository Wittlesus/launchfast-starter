import { test, expect } from '@playwright/test';

test.describe('Legal Pages', () => {
  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy');

    // Verify page loads
    await expect(page).toHaveURL(/.*privacy/);

    // Check for privacy-related content
    const heading = page.locator('h1, h2').filter({ hasText: /privacy/i }).first();
    await expect(heading).toBeVisible();
  });

  test('privacy policy should have substantial content', async ({ page }) => {
    await page.goto('/privacy');

    // Privacy policy should have multiple sections
    const mainContent = page.locator('main, article, [class*="content"]').first();
    await expect(mainContent).toBeVisible();

    // Should have multiple paragraphs or sections
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThanOrEqual(3);
  });

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms');

    // Verify page loads
    await expect(page).toHaveURL(/.*terms/);

    // Check for terms-related content
    const heading = page.locator('h1, h2').filter({ hasText: /terms/i }).first();
    await expect(heading).toBeVisible();
  });

  test('terms of service should have substantial content', async ({ page }) => {
    await page.goto('/terms');

    // Terms should have multiple sections
    const mainContent = page.locator('main, article, [class*="content"]').first();
    await expect(mainContent).toBeVisible();

    // Should have multiple paragraphs or sections
    const paragraphs = page.locator('p');
    const paragraphCount = await paragraphs.count();
    expect(paragraphCount).toBeGreaterThanOrEqual(3);
  });

  test('legal pages should have navigation', async ({ page }) => {
    const legalPages = ['/privacy', '/terms'];

    for (const url of legalPages) {
      await page.goto(url);

      // Should have header with navigation back to main site
      const header = page.locator('header, nav').first();
      await expect(header).toBeVisible();
    }
  });

  test('legal pages should have footer', async ({ page }) => {
    const legalPages = ['/privacy', '/terms'];

    for (const url of legalPages) {
      await page.goto(url);

      // Should have footer
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('privacy policy should mention data collection', async ({ page }) => {
    await page.goto('/privacy');

    // Should mention key privacy concepts
    const dataText = page.locator('text=/data|information|personal|collect/i').first();
    await expect(dataText).toBeVisible();
  });

  test('terms should mention license or usage', async ({ page }) => {
    await page.goto('/terms');

    // Should mention key terms concepts
    const termsText = page.locator('text=/license|use|agreement|service/i').first();
    await expect(termsText).toBeVisible();
  });

  test('legal pages should be readable', async ({ page }) => {
    await page.goto('/privacy');

    // Content should be properly formatted
    const mainContent = page.locator('main, article').first();

    // Check that text is not too wide (good readability)
    const boundingBox = await mainContent.boundingBox();

    if (boundingBox) {
      // Content width should be reasonable (not full screen on desktop)
      expect(boundingBox.width).toBeLessThanOrEqual(1200);
    }
  });

  test('legal pages should have proper headings hierarchy', async ({ page }) => {
    await page.goto('/privacy');

    // Should have h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Should have section headings (h2 or h3)
    const h2 = page.locator('h2, h3');
    const h2Count = await h2.count();
    expect(h2Count).toBeGreaterThanOrEqual(1);
  });
});
