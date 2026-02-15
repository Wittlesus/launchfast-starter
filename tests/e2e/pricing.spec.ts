import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');

    // Verify page loads
    await expect(page).toHaveURL(/.*pricing/);

    // Check for pricing heading
    const heading = page.locator('h1, h2').filter({ hasText: /pricing|plans/i });
    await expect(heading.first()).toBeVisible();
  });

  test('should display all pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Look for pricing cards/sections
    // Should have at least 2 pricing options based on the README
    const pricingCards = page.locator('[class*="grid"] > div, [class*="pricing"] > div').filter({
      has: page.locator('text=/\\$|price/i'),
    });

    const cardCount = await pricingCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(2);
  });

  test('should display Starter tier ($79)', async ({ page }) => {
    await page.goto('/pricing');

    // Check for Starter plan
    const starterPlan = page.locator('text=/Starter/i');
    await expect(starterPlan).toBeVisible();

    // Verify price is displayed
    const price79 = page.locator('text=/\\$79/');
    await expect(price79).toBeVisible();
  });

  test('should display Pro tier ($119)', async ({ page }) => {
    await page.goto('/pricing');

    // Check for Pro plan
    const proPlan = page.locator('text=/Pro/i');
    await expect(proPlan).toBeVisible();

    // Verify price is displayed
    const price119 = page.locator('text=/\\$119/');
    await expect(price119).toBeVisible();
  });

  test('should display Complete Bundle ($99)', async ({ page }) => {
    await page.goto('/pricing');

    // Check for Bundle plan
    const bundlePlan = page.locator('text=/Complete Bundle|Bundle/i');
    await expect(bundlePlan).toBeVisible();

    // Verify bundle price
    const price99 = page.locator('text=/\\$99/');
    await expect(price99).toBeVisible();
  });

  test('should have Buy Now buttons with Stripe links', async ({ page }) => {
    await page.goto('/pricing');

    // Find all "Buy" buttons
    const buyButtons = page.locator('a, button').filter({ hasText: /buy now|buy|get started/i });

    // Should have at least 3 buy buttons (one per tier)
    const buttonCount = await buyButtons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(3);

    // Check that at least one has a valid Stripe URL
    const firstButton = buyButtons.first();
    await expect(firstButton).toBeVisible();

    // Verify it's a link (not a disabled button)
    const firstLink = page.locator('a').filter({ hasText: /buy now|buy|get started/i }).first();
    const href = await firstLink.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toContain('stripe.com');
  });

  test('all Stripe checkout links should be valid URLs', async ({ page }) => {
    await page.goto('/pricing');

    // Get all links that look like buy buttons
    const buyLinks = page.locator('a').filter({ hasText: /buy now|buy|get started/i });

    const linkCount = await buyLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = buyLinks.nth(i);
      const href = await link.getAttribute('href');

      // Verify each link is a valid Stripe URL
      expect(href).toBeTruthy();
      expect(href).toMatch(/stripe\.com/);
      expect(href).toMatch(/^https:\/\//);
    }
  });

  test('should display feature lists for each tier', async ({ page }) => {
    await page.goto('/pricing');

    // Look for feature lists (usually <ul> elements in pricing cards)
    const featureLists = page.locator('ul');

    const listCount = await featureLists.count();
    expect(listCount).toBeGreaterThanOrEqual(3); // At least one list per tier
  });

  test('should display refund policy', async ({ page }) => {
    await page.goto('/pricing');

    // Look for refund/guarantee text
    const refundText = page.locator('text=/refund|money-back|guarantee/i');
    await expect(refundText.first()).toBeVisible();
  });

  test('should highlight popular/recommended plan', async ({ page }) => {
    await page.goto('/pricing');

    // Look for "popular" or "recommended" badge
    const popularBadge = page.locator('text=/popular|recommended|best value/i');

    // Should have at least one highlighted plan
    const badgeCount = await popularBadge.count();
    expect(badgeCount).toBeGreaterThanOrEqual(1);
  });

  test('should display one-time payment messaging', async ({ page }) => {
    await page.goto('/pricing');

    // Verify one-time payment is emphasized
    const oneTimeText = page.locator('text=/one-time|lifetime/i');
    await expect(oneTimeText.first()).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/pricing');

    // Verify header exists
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should have working footer', async ({ page }) => {
    await page.goto('/pricing');

    // Verify footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
