# Testing

## E2E — Playwright

Framework: `@playwright/test` 1.60  
Requires: Node 16+, Docker running, `npm run dev` running (or let Playwright start it)

```bash
npm run test:e2e              # all specs, chromium + firefox
npx playwright test --grep "@smoke"        # smoke suite only
npx playwright test --grep "@api"          # API contract tests
npx playwright test --grep "@critical"     # business-critical flows
npx playwright show-report                 # open last HTML report
```

### Tag reference

| Tag | Tests |
|---|---|
| `@smoke` | navbar visible, product count, cart badge, form visible, full purchase |
| `@ui` | all browser interaction tests |
| `@api` | GET /products, GET /products/:id, POST /orders |
| `@e2e` | multi-step purchase journeys |
| `@critical` | order placement, stock decrement |
| `@validation` | form error messages |
| `@boundary` | stock cap on qty controls |
| `@inventory` | DB stock consistency after purchase |

### Architecture rules

- Specs contain no raw `expect()` — all assertions are in `assertions/` classes.
- Specs contain no raw locators — all selectors are in `pages/` objects.
- Steps contain action orchestration only.
- All locators use `data-testid` attributes.
- No `waitForTimeout` — waits are condition-based.
- API clients are used for setup to avoid long UI chains.
- DB is reset before and after each test via the `db` fixture.

### Spec files and tags

| File | Tags |
|---|---|
| home.spec.js | @smoke @ui @home |
| product.spec.js | @ui @product |
| cart.spec.js | @ui @cart |
| checkout.spec.js | @ui @checkout @validation |
| e2e-flow.spec.js | @e2e @critical @smoke |
| api.spec.js | @api @smoke @inventory |

## Unit & Integration — Vitest

```bash
npm test                # run all Vitest tests
npm run test:coverage   # with coverage report
```

Test files: `tests/unit/`, `tests/integration/`

### Coverage Status

**Current Status:** ⚠️ **DEGRADED - Test Failures**

**Environment:** ✅ Node.js v24.16.0, npm v11.13.0, @vitest/coverage-v8 installed

**Coverage Command:** `npm run test:coverage`

**Baseline Measurement (2024-05-28):**

| Metric | Result | Notes |
|--------|--------|-------|
| Test Suites | 3 files | unit/components, unit/context, integration |
| Tests Total | 21 tests | 9 passing, 12 failing |
| Test Status | ⚠️ DEGRADED | Test failures block clean coverage measurement |

**Known Test Issues:**
1. **HomePage tests (7 failures):** Missing `<Router>` wrapper - `useNavigate()` requires `<Router>` context in test setup
2. **CartContext test (1 failure):** `updateQuantity` produces NaN instead of expected value
3. **Cart integration tests (4 failures):** Same Router context issue

**Coverage Metrics:** Unable to generate full report due to test failures. Coverage tool runs successfully but test failures prevent accurate measurement.

**Target Coverage:** 80% line coverage for unit tests

**Current Test Files:**
- `tests/unit/components/HomePage.test.jsx` - ❌ 7/7 failing (Router context)
- `tests/unit/context/CartContext.test.jsx` - ⚠️ 9/10 passing (1 NaN issue)
- `tests/integration/cart-flow.test.jsx` - ❌ 0/4 passing (Router context)

**Next Steps:**
1. Fix test setup to wrap components in `<MemoryRouter>` for Router context
2. Fix CartContext `updateQuantity` NaN bug
3. Re-run coverage to establish clean baseline
4. Add unit tests for remaining 5 page components (ProductPage, CartPage, CheckoutPage, AdminOrders, AdminOrderDetail)

**Gap Identified:** Very low unit test coverage - only 2 unit test files exist for ~7 page components + CartContext. See docs/PROJECT_STATUS.md Gap #5 for remediation plan.

## CI

GitHub Actions workflow: `.github/workflows/e2e.yml`

Runs on push and pull request:
1. Starts Docker services
2. Waits for backend health
3. Installs Playwright browsers
4. Runs full E2E suite
5. Uploads HTML and JUnit reports as artifacts
