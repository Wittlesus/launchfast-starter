import { test, expect } from '@playwright/test';

test.describe('SEO & Meta Tags', () => {
  test('landing page should have title tag', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('landing page should have meta description', async ({ page }) => {
    await page.goto('/');

    const metaDescription = page.locator('meta[name="description"]');
    const content = await metaDescription.getAttribute('content');

    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(50); // Good descriptions are 50-160 chars
    expect(content!.length).toBeLessThanOrEqual(160);
  });

  test('pages should have unique titles', async ({ page }) => {
    const pages = ['/', '/pricing', '/login'];
    const titles = new Set();

    for (const url of pages) {
      await page.goto(url);
      const title = await page.title();
      titles.add(title);
    }

    // All titles should be unique
    expect(titles.size).toBe(pages.length);
  });

  test('should have Open Graph meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for OG tags
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogTitleContent = await ogTitle.getAttribute('content');
    expect(ogTitleContent).toBeTruthy();
  });

  test('should have Twitter Card meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for Twitter tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    const cardType = await twitterCard.getAttribute('content');

    if (cardType) {
      expect(['summary', 'summary_large_image']).toContain(cardType);
    }
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute('href');

    if (href) {
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // h1 should have meaningful content
    const h1Text = await page.locator('h1').first().textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(10);
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check first few images have alt text
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');

    expect(content).toBeTruthy();
    expect(content).toContain('width=device-width');
  });

  test('should have charset meta tag', async ({ page }) => {
    await page.goto('/');

    const charset = page.locator('meta[charset]');
    const charsetValue = await charset.getAttribute('charset');

    expect(charsetValue).toBeTruthy();
    expect(charsetValue?.toLowerCase()).toContain('utf-8');
  });

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/');

    // Check that links don't just say "click here"
    const clickHereLinks = page.locator('a').filter({ hasText: /^click here$/i });
    const count = await clickHereLinks.count();

    expect(count).toBe(0); // Should not have generic "click here" links
  });

  test('should have robots meta tag', async ({ page }) => {
    await page.goto('/');

    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute('content');

    if (content) {
      // Should not have "noindex" on main pages
      expect(content).not.toContain('noindex');
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Should not have critical console errors
    const criticalErrors = errors.filter(
      (err) => !err.includes('favicon') && !err.includes('Source map')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have fast load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    expect(lang).toBeTruthy();
    expect(lang).toBe('en');
  });
});
