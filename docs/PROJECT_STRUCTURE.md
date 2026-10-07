# Project Structure

Current repository layout, verified 2026-10-07. Empty scaffolding is noted rather than presented as implemented architecture.

```text
backend/
  src/
    app.js, server.js
    db/connection.js
    middleware/       auth, metrics, validation
    routes/           auth, orders, products
    utils/            logger, orderItems
  Dockerfile

database/
  schema.sql          all tables, including users
  catalog.sql         initial categories and products
  dev_fixtures.sql    local/staging sample data only
  add_users_table.sql standalone migration for an existing schema

docs/
  API_DOCUMENTATION.md
  ARCHITECTURE.md
  DATABASE.md
  PROJECT_STATUS.md
  TESTING.md
  archive/            historical audits, sessions and superseded notes
  framework/          test automation patterns

src/
  context/            AuthContext, CartContext
  infrastructure/api/ authService, orderService, productService
  presentation/       components and routed pages
  shared/utils/       performanceMonitor
  application/, domain/ empty scaffolding; not implemented Clean Architecture layers

tests/
  unit/               utility, context and component tests
  integration/        frontend integration tests
  e2e/                Playwright specs, page objects, steps and assertions
  fixtures/           shared test fixtures and local-only admin credentials

Root configuration:
  docker-compose.yml             local MySQL/API/phpMyAdmin
  docker-compose.staging.yml     local staging simulation
  docker-compose.prod.yml        production starting point, not release-verified
  nginx.conf.template            NGINX frontend and API proxy template
  playwright.config.js           E2E config
  vite.config.js                 frontend dev/build and Vitest config
```

## Runtime boundaries

- Product data is loaded through the API; initial products are in `database/catalog.sql`.
- `database/dev_fixtures.sql` contains local/staging sample orders and a test admin. Production Compose must not load it.
- MySQL init SQL is only applied to a new empty data directory; existing volumes need reviewed migrations.
- Search in the homepage is basic client-side filtering. Server-side search UI, debounce and pagination remain deferred.
- The frontend uses presentation/API-client layers; `application/` and `domain/` folders are empty scaffolding.
