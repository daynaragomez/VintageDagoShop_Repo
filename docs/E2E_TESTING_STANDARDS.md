# E2E Testing Standards

## Overview
End-to-End (E2E) tests verify the complete application flow using Playwright. These tests run in a real browser with a running backend and database.

## Architecture

### Test Structure (BDD Pattern)
```
tests/e2e/
├── specs/           # Test scenarios (*.spec.js or *.spec.ts)
├── pages/           # Page Object Model (PageObjects)
├── steps/           # Test steps (Given-When-Then abstraction)
├── assertions/      # Custom assertions
├── api/            # API clients for backend testing
├── db/             # Database helpers
└── utils/          # Test data, constants, helpers
```

### BDD Pattern
Tests follow the **Page Object Model (POM)** + **Steps** + **Assertions** pattern:

- **Pages**: Encapsulate element selectors and low-level actions
- **Steps**: Implement business-level scenarios (Given-When-Then)
- **Assertions**: Custom expects for domain-specific checks

Example:
```javascript
test('user can add product to cart', async ({ homeSteps, cartSteps, cartAssert }) => {
  await homeSteps.openShop();           // Given: user is on shop
  await homeSteps.addProductToCart(1); // When: user adds product
  await cartSteps.openCart();            // And: user opens cart
  await cartAssert.itemCountIs(1);       // Then: cart has 1 item
});
```

## Standards

### 1. **Test Selectors**
✅ **Required**: Use `data-testid` attributes
```javascript
// Good
this.page.getByTestId('btn-add-to-cart')

// Bad
this.page.getByRole('button', { name: 'Add to Cart' })
this.page.locator('.btn-primary')
```

**Frontend Implementation**:
All interactive elements must have `data-testid` attributes:
```jsx
<button data-testid="btn-add-to-cart" onClick={...}>Add to Cart</button>
<div data-testid="cart-items-list">...</div>
```

### 2. **Test Tags**
All tests must have tags for filtering:
```javascript
test('scenario', { tag: ['@smoke', '@critical'] }, async ({ ... }) => {
  // test code
});
```

**Tag Convention**:
- `@smoke` - Quick smoke tests (runs on every PR)
- `@critical` - Critical user flows (checkout, auth, payments)
- `@ui` - UI/frontend tests
- `@api` - API endpoint tests
- `@admin` - Admin-only tests
- `@boundary` - Edge cases and boundary conditions
- `@validation` - Input validation tests

### 3. **Test Fixtures & Setup**
Tests use custom fixtures for consistency:
```javascript
// ✅ Use custom fixtures
test('scenario', async ({ homeSteps, cartAssert }) => {
  // Fixtures provide pre-configured Page Objects, Steps, and Assertions
});

// ❌ Do NOT mix imports
import { test } from '@playwright/test';  // Don't use this directly
import { test } from '../../fixtures/index.js'; // Use this instead
```

### 4. **Timeouts & Waits**
Use appropriate waits:
```javascript
// ✅ Wait for specific conditions
await page.waitForURL(/\/cart/);
await element.waitFor({ state: 'visible', timeout: 5000 });

// ❌ Avoid arbitrary sleeps
await page.waitForTimeout(3000); // Only as last resort
```

### 5. **Environment Variables in CI**
The workflow must provide:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `DB_ROOT_PASSWORD`
- `JWT_SECRET` (required for auth)
- `NODE_ENV` (set to 'development' or 'test')

### 6. **Test Data**
Store test data in `tests/e2e/utils/testData.js`:
```javascript
export const testData = {
  validCustomer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '514-555-0100',
    street: '123 Main St',
    city: 'Montreal',
    country: 'Canada',
    card: '4111111111111111',
  },
  invalidCustomer: {
    missingName: { /* ... */ },
    badEmail: { /* ... */ },
    missingCard: { /* ... */ },
  }
};
```

### 7. **Error Handling**
Always handle missing elements gracefully:
```javascript
// ✅ Handle missing elements
const element = await page.$('[data-testid="some-element"]');
if (!element) {
  throw new Error('Element not found - check if frontend has data-testid');
}

// ❌ Crash if element not found
await page.click('[data-testid="some-element"]');
```

### 8. **Backend Requirements**
Backend must respond with correct:
- **API Format**: JSON responses with consistent field names
- **Status Codes**: 200, 201, 400, 401, 404, 500
- **CORS**: Enabled for `http://localhost:5173`
- **Database**: Initialized with seed data before tests run

### 9. **Test Organization**
Files should follow naming convention:
```
✅ cart.spec.js          # Tests for cart feature
✅ checkout.spec.js      # Tests for checkout
✅ api.spec.js           # API endpoint tests
✅ auth.spec.js          # Authentication tests

❌ test.js               # Too generic
❌ e2e-flow-v2.js        # Use feature names
```

### 10. **Reporting**
Tests generate reports in:
- `playwright-report/` - HTML report (open in browser)
- `test-results/junit.xml` - JUnit format (for CI integration)
- `test-results/artifacts/` - Screenshots and videos on failure

## Common Issues & Fixes

### Issue: "Element not found: data-testid=..."
**Cause**: Frontend component missing `data-testid`
**Fix**: Add `data-testid` to the React component

### Issue: "Timeout waiting for URL..."
**Cause**: Redirect didn't happen, or wrong URL pattern
**Fix**: Check that:
1. Backend is running
2. API endpoints are correct
3. Component has correct navigation logic

### Issue: "generateToken is not defined"
**Cause**: Trying to import backend code in browser context
**Fix**: Use API endpoint to generate test tokens, or use fake tokens with `.catch()` handlers

### Issue: "Connection refused to localhost:3000"
**Cause**: Backend container not started or not healthy
**Fix**: Ensure `docker-compose up` completes and backend responds to `/api/products`

## Execution

### Local Development
```powershell
# Install browsers (once)
npx playwright install

# Run all tests
npm run test:e2e

# Run specific tag
npx playwright test --grep "@smoke"

# Run specific file
npx playwright test tests/e2e/specs/cart.spec.js

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui
```

### CI Pipeline
Tests run automatically on:
- Push to `master` or `main`
- Pull requests targeting `master` or `main`

CI configuration: `.github/workflows/e2e.yml`

## Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Use beforeEach for setup**: Initialize data before each test
3. **Make assertions specific**: Check exact values, not just visibility
4. **Avoid hardcoded IDs**: Use constants from `tests/e2e/utils/constants.js`
5. **Test real user flows**: Focus on scenarios users will actually perform
6. **Keep tests fast**: Aim for < 5s per test (smoke tests < 2s)
7. **Document complex scenarios**: Use descriptive test names and comments

## Future Improvements

- [ ] Add visual regression testing
- [ ] Add performance monitoring in E2E tests
- [ ] Add accessibility (a11y) testing
- [ ] Expand mobile/tablet device coverage
- [ ] Add load/stress testing scenarios
