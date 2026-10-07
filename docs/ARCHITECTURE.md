# Architecture

## Runtime overview

```text
React/Vite :5173 -> /api proxy -> Express :3000 -> mysql2 -> MySQL 8 :3306
```

Vite proxies `/api` to `http://localhost:3000` in development. The container NGINX template proxies `/api` to `API_UPSTREAM`, supplied by the active Compose file.

## Frontend

- `presentation/pages/`: customer pages and admin pages.
- `presentation/components/`: navigation, admin layout and route guard.
- `context/`: cart and admin-auth state.
- `infrastructure/api/`: product, order and auth HTTP clients.
- `shared/utils/performanceMonitor.js`: browser performance/error instrumentation; imported for side effects from `main.jsx`.
- `domain/` and `application/` are scaffolding directories, not implemented Clean Architecture layers.

The former static catalog module `src/shared/data/products.js` was unused and has been removed. Product data is loaded from the API; initial catalog values are in `database/catalog.sql`.

## Backend and security

Express mounts product, order and auth routers. Admin APIs require a Bearer JWT and admin role. Login validates credentials against the `users` table and returns a JWT. `JWT_SECRET` is required in production.

Order creation is public for checkout. It validates request fields, aggregates repeated product IDs, locks product rows with `FOR UPDATE`, computes prices from the database, creates order records and decrements stock in one transaction.

## Data flow

- Catalog: `GET /api/products` and `GET /api/products/:id`.
- Checkout: `POST /api/orders`.
- Admin: `POST /api/auth/login`, then protected `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`.
- Database schema and initial data are described in [DATABASE.md](DATABASE.md).

## Tests

Vitest covers current unit/integration slices. Playwright covers browser/API flows and requires a working database-backed stack. Current test evidence and gaps are in [TESTING.md](TESTING.md) and [PROJECT_STATUS.md](PROJECT_STATUS.md).
