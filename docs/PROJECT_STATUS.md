# Project Status

**Verified:** 2026-10-07. This is a factual snapshot, not a readiness score.

## Checks

| Check | Result |
|---|---|
| `npm test -- --run` | 24 tests passed across five files at the latest complete run |
| `npm run build` | Passed |
| `npm run lint` | Passed with `--max-warnings 0` after cleanup |
| Focused ESLint on changed source/tests | Passed |
| Local, staging and production Compose parsing | Passed |
| Manual browser smoke on isolated staging stack | Passed: catalog, add-to-cart, checkout, order confirmation, admin login/protected orders |
| Full Playwright E2E with a working database | Not signed off |
| Production deployment | Not verified |

## Local runtime observation

The original local Compose stack has a MySQL credential mismatch against its existing volume; that volume was not deleted. To avoid touching it, an isolated staging project `vds-staging-check` was started with its own volume. At verification, its DB/backend/frontend were healthy; the frontend proxy returned 3 products, admin login and protected order listing worked, and a browser checkout created order #2 with stock decrement. `TRUST_PROXY_HOPS=1` is configured for the staging NGINX hop and the rate-limit proxy warning no longer appears. The active app is at `http://127.0.0.1:5173`; staging API direct port is `5000` and DB is `3307`.

Product images reference `via.placeholder.com`, which timed out in this browser environment; product data and checkout work, but those remote images may not render without external network access.

MySQL initialization scripts run only for an empty data directory. Existing volumes do not adopt changed `.env` credentials or rerun initialization SQL. Back up and review a migration before changing an existing volume.

## Implemented

- Product catalog API, cart/checkout/order flow and transaction-based stock decrement.
- JWT login and role-protected admin frontend/backend routes.
- Duplicate product lines are aggregated before stock validation.
- Product catalog and development fixtures are separate SQL sources; development fixtures are not mounted by production Compose.
- Unit/integration tests cover cart flows, duplicate order lines and JWT middleware.

## Outstanding release work

1. Reconcile original local MySQL volume credentials without data loss, or keep using the isolated staging project.
2. Run full Playwright E2E against the healthy isolated staging stack and record results.
3. Review local deletions of `.github/workflows/ci-cd.yml` and `.github/workflows/deploy.yml` before commit.
4. Verify production secrets, admin provisioning, TLS/proxy, backup/restore and rollback in target infrastructure.

Priorities: [ROADMAP.md](../ROADMAP.md). Release gates: [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md).
