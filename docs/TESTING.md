# Testing

## Unit and integration (Vitest)

```powershell
npm test -- --run
npm run test:coverage
```

Vitest discovers `tests/unit/**/*.test.{js,jsx}` and `tests/integration/**/*.test.{js,jsx}`. At the 2026-10-07 verification, 24 tests passed across five files. Earlier test counts and coverage percentages in archived reports are historical.

## End-to-end (Playwright)

Requirements: Docker running, database initialized with the correct credentials, and Playwright browsers installed.

```powershell
npx playwright install
npm run test:e2e
```

For the separate local staging stack, stop a local Vite instance first because both use port 5173:

```powershell
npm run staging:up
$env:STAGING_URL='http://localhost:5173'
npm run test:e2e:staging
npm run staging:down
```

**E2E Testing Standards**: See [E2E_TESTING_STANDARDS.md](E2E_TESTING_STANDARDS.md) for architecture, test patterns, and best practices.

### Recent Fixes (2026-10-07)
- ✅ Added `JWT_SECRET` to CI workflow (was causing backend startup failures)
- ✅ Fixed admin authentication tests (removed invalid backend code imports)
- ✅ Improved test selectors and error handling in admin specs
- ✅ Standardized test patterns to use Page Objects + Steps + Assertions (BDD)

## Test layout

- `tests/unit/`: focused utilities, contexts and components.
- `tests/integration/`: frontend integration behavior.
- `tests/e2e/specs/`: Playwright browser and API scenarios.
- `tests/fixtures/`: shared Playwright fixtures and development-only credentials.

 Development credentials must not be exposed publicly or used in production. Test architecture is implemented under `tests/e2e/` and summarized in [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).
