# Decision Guide

Current priorities are maintained only in [ROADMAP.md](ROADMAP.md); verification evidence is in [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

Recommended order:

1. Reconcile credentials for the existing MySQL volume without deleting it.
2. Verify backend catalog access and Vite `/api` routing locally.
3. Run Playwright E2E against a healthy stack.
4. Confirm `npm run lint` passes with its zero-warning threshold.
5. Review pending workflow deletions, then evaluate production against [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

Old scores and delivery estimates are not current.
