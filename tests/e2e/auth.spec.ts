import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');

    // Check page title
    await expect(page).toHaveURL(/.*login/);

    // Verify login heading
    const heading = page.locator('h1').filter({ hasText: /sign in|login|welcome/i });
    await expect(heading.first()).toBeVisible();
  });

  test('should display OAuth providers', async ({ page }) => {
    await page.goto('/login');

    // Check for Google OAuth button
    const googleButton = page.locator('button, a').filter({ hasText: /google/i });
    await expect(googleButton.first()).toBeVisible();

    // Check for GitHub OAuth button
    const githubButton = page.locator('button, a').filter({ hasText: /github/i });
    await expect(githubButton.first()).toBeVisible();
  });

  test('should have link to signup page', async ({ page }) => {
    await page.goto('/login');

    // Look for signup link
    const signupLink = page.locator('a').filter({ hasText: /sign up|create account|register/i });
    await expect(signupLink.first()).toBeVisible();
  });

  test('should load signup page', async ({ page }) => {
    await page.goto('/signup');

    // Check page loads
    await expect(page).toHaveURL(/.*signup/);

    // Verify signup heading
    const heading = page.locator('h1, h2').filter({ hasText: /sign up|create|get started/i });
    await expect(heading.first()).toBeVisible();
  });

  test('signup page should display OAuth providers', async ({ page }) => {
    await page.goto('/signup');

    // Check for Google OAuth button
    const googleButton = page.locator('button, a').filter({ hasText: /google/i });
    await expect(googleButton.first()).toBeVisible();

    // Check for GitHub OAuth button
    const githubButton = page.locator('button, a').filter({ hasText: /github/i });
    await expect(githubButton.first()).toBeVisible();
  });

  test('signup page should have link to login', async ({ page }) => {
    await page.goto('/signup');

    // Look for login link
    const loginLink = page.locator('a').filter({ hasText: /sign in|log in|already have/i });
    await expect(loginLink.first()).toBeVisible();
  });

  test('OAuth buttons should have proper attributes', async ({ page }) => {
    await page.goto('/login');

    const googleButton = page.locator('button').filter({ hasText: /google/i }).first();
    await expect(googleButton).toBeVisible();

    // Verify button is clickable
    await expect(googleButton).toBeEnabled();

    const githubButton = page.locator('button').filter({ hasText: /github/i }).first();
    await expect(githubButton).toBeVisible();
    await expect(githubButton).toBeEnabled();
  });
});
