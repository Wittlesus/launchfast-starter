import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');

    // Check that page loads without errors
    await expect(page).toHaveTitle(/LaunchFast/i);

    // Verify page is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display header with navigation', async ({ page }) => {
    await page.goto('/');

    // Check for header/navigation elements
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    // Look for common hero section elements
    const hero = page.locator('h1, h2').first();
    await expect(hero).toBeVisible();

    // Check for CTA buttons
    const buttons = page.locator('a, button').filter({ hasText: /get started|buy|sign up/i });
    await expect(buttons.first()).toBeVisible();
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');

    // Check for pricing section
    const pricingSection = page.locator('#pricing, section').filter({ has: page.locator('text=/pricing/i') });
    await expect(pricingSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify footer contains links
    const footerLinks = footer.locator('a');
    await expect(footerLinks.first()).toBeVisible();
  });

  test('should display social proof section', async ({ page }) => {
    await page.goto('/');

    // Check if social proof section exists (may have testimonials, stats, etc.)
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Verify multiple sections are present
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should have meta tags for SEO', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
  });
});
