import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate from landing to pricing', async ({ page }) => {
    await page.goto('/');

    // Find and click pricing link
    const pricingLink = page.locator('a').filter({ hasText: /pricing/i }).first();
    await pricingLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/.*pricing/);
  });

  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/');

    // Find and click login/sign in link
    const loginLink = page.locator('a').filter({ hasText: /sign in|log in|login/i }).first();

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should navigate from login to signup', async ({ page }) => {
    await page.goto('/login');

    // Click signup link
    const signupLink = page.locator('a').filter({ hasText: /sign up|create account/i }).first();
    await signupLink.click();

    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate from signup to login', async ({ page }) => {
    await page.goto('/signup');

    // Click login link
    const loginLink = page.locator('a').filter({ hasText: /sign in|log in|already have/i }).first();
    await loginLink.click();

    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to privacy policy', async ({ page }) => {
    await page.goto('/');

    // Look for privacy link in footer
    const privacyLink = page.locator('a').filter({ hasText: /privacy/i }).first();

    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL(/.*privacy/);
    }
  });

  test('should navigate to terms of service', async ({ page }) => {
    await page.goto('/');

    // Look for terms link in footer
    const termsLink = page.locator('a').filter({ hasText: /terms/i }).first();

    if (await termsLink.isVisible()) {
      await termsLink.click();
      await expect(page).toHaveURL(/.*terms/);
    }
  });

  test('header navigation should be consistent across pages', async ({ page }) => {
    const pages = ['/', '/pricing', '/login'];

    for (const url of pages) {
      await page.goto(url);

      // Verify header exists on each page
      const header = page.locator('header, nav').first();
      await expect(header).toBeVisible();
    }
  });

  test('footer should be present on public pages', async ({ page }) => {
    const pages = ['/', '/pricing'];

    for (const url of pages) {
      await page.goto(url);

      // Verify footer exists
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('should have working back navigation', async ({ page }) => {
    await page.goto('/');
    await page.goto('/pricing');
    await page.goBack();

    await expect(page).toHaveURL(/^(?!.*pricing)/);
  });

  test('logo should link to home page', async ({ page }) => {
    await page.goto('/pricing');

    // Find logo or brand name link (usually in header)
    const logoLink = page.locator('header a').first();

    if (await logoLink.isVisible()) {
      await logoLink.click();
      await expect(page).toHaveURL(/^\/$|^\/$/);
    }
  });
});
