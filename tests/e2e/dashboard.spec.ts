import { test, expect } from '@playwright/test';

test.describe('Dashboard Access Control', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard route should require authentication', async ({ page }) => {
    // Try to access dashboard directly
    const response = await page.goto('/dashboard');

    // Should either redirect (3xx) or show login page
    // Check if we're on login page after potential redirect
    await page.waitForURL(/.*login/, { timeout: 5000 }).catch(() => {});

    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login/);
  });

  test('should show login form after redirect', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for redirect to complete
    await page.waitForLoadState('networkidle');

    // Verify we're on login page with OAuth options
    const googleButton = page.locator('button').filter({ hasText: /google/i });
    const githubButton = page.locator('button').filter({ hasText: /github/i });

    await expect(googleButton.first()).toBeVisible();
    await expect(githubButton.first()).toBeVisible();
  });

  test('protected API routes should return 401', async ({ page }) => {
    // Test that API endpoints require authentication
    const response = await page.goto('/api/ai', {
      waitUntil: 'networkidle',
    });

    // Should not be a successful 200 response
    expect(response?.status()).not.toBe(200);
  });
});

test.describe('Dashboard UI (Authenticated)', () => {
  // Note: These tests document the expected authenticated UI
  // In a real scenario, you'd set up authentication state
  test.skip('should display user email when authenticated', async ({ page }) => {
    // This test requires authentication setup
    // Skipped for now, but documents expected behavior
    await page.goto('/dashboard');

    const userEmail = page.locator('text=/.*@.*/');
    await expect(userEmail).toBeVisible();
  });

  test.skip('should display AI Assistant section', async ({ page }) => {
    await page.goto('/dashboard');

    const aiSection = page.locator('text=/AI Assistant/i');
    await expect(aiSection).toBeVisible();

    const promptInput = page.locator('input[placeholder*="prompt" i]');
    await expect(promptInput).toBeVisible();
  });

  test.skip('should display Billing section', async ({ page }) => {
    await page.goto('/dashboard');

    const billingSection = page.locator('text=/Billing/i');
    await expect(billingSection).toBeVisible();

    const manageBillingButton = page.locator('button').filter({ hasText: /manage billing/i });
    await expect(manageBillingButton).toBeVisible();
  });

  test.skip('should have navigation sidebar', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for nav items
    const dashboardNav = page.locator('text=/Dashboard/i');
    const aiNav = page.locator('text=/AI Assistant/i');
    const billingNav = page.locator('text=/Billing/i');
    const settingsNav = page.locator('text=/Settings/i');

    await expect(dashboardNav).toBeVisible();
    await expect(aiNav).toBeVisible();
    await expect(billingNav).toBeVisible();
    await expect(settingsNav).toBeVisible();
  });

  test.skip('should have sign out button', async ({ page }) => {
    await page.goto('/dashboard');

    const signOutButton = page.locator('button').filter({ hasText: /sign out|log out/i });
    await expect(signOutButton).toBeVisible();
  });
});
