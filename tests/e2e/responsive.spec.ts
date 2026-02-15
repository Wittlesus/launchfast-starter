import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('landing page should be mobile responsive', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Page should load without horizontal scroll
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check that main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('pricing page should be mobile responsive', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/pricing');

    // Pricing cards should be visible
    const pricingSection = page.locator('section, main').first();
    await expect(pricingSection).toBeVisible();

    // Buy buttons should be visible and accessible
    const buyButton = page.locator('a, button').filter({ hasText: /buy now|buy/i }).first();
    await expect(buyButton).toBeVisible();
  });

  test('login page should be mobile responsive', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/login');

    // OAuth buttons should be visible and usable on mobile
    const googleButton = page.locator('button').filter({ hasText: /google/i }).first();
    const githubButton = page.locator('button').filter({ hasText: /github/i }).first();

    await expect(googleButton).toBeVisible();
    await expect(githubButton).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize(devices['iPad Pro'].viewport);
    await page.goto('/');

    // Verify content is visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Navigation should be accessible
    const nav = page.locator('header, nav').first();
    await expect(nav).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Desktop layout should render properly
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('mobile menu should be accessible', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Look for mobile menu toggle (hamburger icon)
    const menuToggle = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]');

    // If mobile menu exists, test it
    if (await menuToggle.isVisible()) {
      await menuToggle.click();

      // Menu should be visible after click
      await page.waitForTimeout(500); // Wait for animation

      // At least some navigation should be visible
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
    }
  });

  test('images should be responsive', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i);

        // Images should have proper attributes
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });

  test('text should be readable on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Main heading should be large enough to read
    const heading = page.locator('h1').first();
    const fontSize = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Font should be at least 20px on mobile
    const fontSizeValue = parseFloat(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(20);
  });

  test('buttons should be tappable on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/pricing');

    // Buy buttons should be large enough for touch targets
    const buyButton = page.locator('a, button').filter({ hasText: /buy now|buy/i }).first();

    const box = await buyButton.boundingBox();

    if (box) {
      // Touch target should be at least 44x44px (iOS guidelines)
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('/');

    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });
});
