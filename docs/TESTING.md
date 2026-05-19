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

## CI

GitHub Actions workflow: `.github/workflows/e2e.yml`

Runs on push and pull request:
1. Starts Docker services
2. Waits for backend health
3. Installs Playwright browsers
4. Runs full E2E suite
5. Uploads HTML and JUnit reports as artifacts
