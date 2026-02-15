# Testing Guide

LaunchFast includes a comprehensive Playwright E2E test suite to ensure production quality. This guide explains how to run and extend the tests.

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in UI mode (recommended for development)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/e2e/landing.spec.ts

# Run tests in debug mode
npx playwright test --debug
```

## Test Coverage

The test suite covers **8 key areas** with **80+ test cases**:

### 1. Landing Page (`landing.spec.ts`)
- Page loads successfully
- Header and navigation display
- Hero section renders
- Pricing section visible
- Footer with working links
- Social proof section
- SEO meta tags present

### 2. Authentication (`auth.spec.ts`)
- Login page loads correctly
- OAuth providers (Google & GitHub) display
- Signup page functionality
- Link navigation between login/signup
- OAuth button attributes and states
- Form accessibility

### 3. Dashboard Access Control (`dashboard.spec.ts`)
- Redirects to login when not authenticated
- Protected routes require authentication
- API routes return 401 without auth
- Dashboard UI components (with auth - skipped tests document expected behavior)
- AI Assistant section
- Billing management section
- Navigation sidebar
- Sign out functionality

### 4. Pricing Page (`pricing.spec.ts`)
- All pricing tiers display correctly
- Starter tier ($79) visible
- Pro tier ($119) visible
- Complete Bundle ($99) visible
- Buy Now buttons work
- **Stripe checkout links validation** - all links verified as valid Stripe URLs
- Feature lists for each tier
- Refund policy display
- Popular plan highlighting
- One-time payment messaging

### 5. Navigation (`navigation.spec.ts`)
- Landing to pricing navigation
- Landing to login navigation
- Login to signup flow
- Signup to login flow
- Privacy policy access
- Terms of service access
- Header consistency across pages
- Footer presence on public pages
- Back navigation
- Logo links to home

### 6. Responsive Design (`responsive.spec.ts`)
- Mobile viewport testing (iPhone 12)
- Tablet viewport testing (iPad Pro)
- Desktop viewport testing (1920x1080)
- Mobile menu accessibility
- Image responsiveness
- Text readability on mobile
- Touch target sizes (44x44px minimum)
- No horizontal overflow on mobile

### 7. Legal Pages (`legal-pages.spec.ts`)
- Privacy policy loads and has content
- Terms of service loads and has content
- Substantial content on both pages
- Navigation and footer present
- Data collection mentions (privacy)
- License/usage mentions (terms)
- Content readability
- Proper heading hierarchy

### 8. SEO & Performance (`seo.spec.ts`)
- Title tags on all pages
- Meta descriptions (50-160 characters)
- Unique titles per page
- Open Graph meta tags
- Twitter Card meta tags
- Canonical URLs
- Proper heading hierarchy (single h1)
- Image alt text
- Viewport meta tag
- Charset meta tag
- No generic "click here" links
- No console errors
- Fast load time (<5 seconds)
- HTML lang attribute

## Test Configuration

The test suite is configured via `playwright.config.ts`:

- **Test Directory**: `tests/e2e/`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_TEST_BASE_URL`)
- **Dev Server**: Automatically starts `npm run dev` before tests
- **Reports**: HTML report generated in `playwright-report/`
- **Screenshots**: Captured on test failure
- **Traces**: Captured on first retry

## Running Tests

### Development Workflow

```bash
# Interactive UI mode (best for development)
npm run test:ui
```

This opens the Playwright Test UI where you can:
- Run individual tests
- See test execution in real-time
- Debug failing tests
- View screenshots and traces

### CI/CD Mode

```bash
# Run all tests headlessly
npm test

# Run tests with specific reporter
npx playwright test --reporter=line

# Run tests in parallel
npx playwright test --workers=4
```

### Specific Test Runs

```bash
# Run only auth tests
npx playwright test auth

# Run only mobile tests
npx playwright test --project="Mobile Chrome"

# Run tests matching a pattern
npx playwright test --grep "should display pricing"

# Skip specific tests
npx playwright test --grep-invert "should be mobile responsive"
```

## Viewing Test Reports

After running tests:

```bash
# Open HTML report
npx playwright show-report
```

The report shows:
- Pass/fail status for each test
- Execution time
- Screenshots of failures
- Full error messages and stack traces

## Debugging Failed Tests

### Method 1: Debug Mode

```bash
npx playwright test --debug
```

This opens the Playwright Inspector where you can:
- Step through test execution
- Pause and inspect the page
- View selector highlights
- See console logs

### Method 2: Headed Mode

```bash
npm run test:headed
```

Watch tests run in a real browser window.

### Method 3: UI Mode

```bash
npm run test:ui
```

Interactive mode with time-travel debugging.

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // 1. Navigate to page
    await page.goto('/your-route');

    // 2. Interact with elements
    const button = page.locator('button.your-button');
    await button.click();

    // 3. Assert expected behavior
    await expect(page).toHaveURL(/success/);
  });
});
```

### Best Practices

1. **Use meaningful test names**: Describe what the test verifies
2. **Keep tests isolated**: Each test should work independently
3. **Use data-testid attributes**: For stable selectors
4. **Avoid hard-coded waits**: Use Playwright's auto-waiting
5. **Test user flows**: Not just individual components
6. **Check accessibility**: Proper labels, ARIA attributes
7. **Verify error states**: Not just happy paths

### Example: Testing a New Feature

```typescript
// tests/e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup that runs before each test
    await page.goto('/');
  });

  test('should display feature on homepage', async ({ page }) => {
    const feature = page.locator('[data-testid="new-feature"]');
    await expect(feature).toBeVisible();
  });

  test('should handle user interaction', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Try Feature' });
    await button.click();

    await expect(page.locator('.result')).toContainText('Success');
  });
});
```

## Authentication Testing (Advanced)

For tests that require authentication, use Playwright's storage state:

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  // Perform login...
  await page.context().storageState({ path: 'auth.json' });
});

// tests/e2e/authenticated.spec.ts
import { test } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('access protected page', async ({ page }) => {
  await page.goto('/dashboard');
  // Now authenticated!
});
```

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Vercel Integration

Add to your `vercel.json`:

```json
{
  "buildCommand": "npm run build && npm run test"
}
```

## Environment Variables

For testing different environments:

```bash
# Test against staging
PLAYWRIGHT_TEST_BASE_URL=https://staging.yourapp.com npm test

# Test against production
PLAYWRIGHT_TEST_BASE_URL=https://yourapp.com npm test
```

## Performance Testing

The SEO test suite includes basic performance checks:

- Page load time (<5s)
- No console errors
- Proper resource loading

For advanced performance testing, use Lighthouse CI or similar tools.

## Accessibility Testing

While basic accessibility is covered (alt text, proper headings), consider adding:

```bash
npm install -D @axe-core/playwright
```

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## Visual Regression Testing

For visual testing, enable screenshots:

```typescript
test('homepage should look correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## Continuous Improvement

The test suite should evolve with your product:

1. **Add tests for new features** before merging
2. **Update tests when UI changes** to avoid flakiness
3. **Review failing tests** - they often catch real bugs
4. **Monitor test execution time** - keep tests fast
5. **Increase coverage** - aim for critical user paths

## Support

For Playwright documentation and support:
- [Playwright Docs](https://playwright.dev)
- [Playwright Discord](https://aka.ms/playwright/discord)
- [GitHub Issues](https://github.com/microsoft/playwright/issues)

For LaunchFast-specific testing questions:
- [GitHub Issues](https://github.com/Wittlesus/launchfast-starter/issues)
- Email: support@wittlesus.com

---

**Remember**: Tests are a selling point. Buyers see "includes E2E tests" and think "production-grade, not a weekend project."
