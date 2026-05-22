# VintageDagoShop

E-commerce web app for vintage clothing. React 18 frontend, Express backend, MySQL 8 via Docker.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express |
| Database | MySQL 8 (Docker) |
| Testing | Playwright 1.60 (E2E), Vitest (unit/integration) |

## Prerequisites

- Node.js 16+
- Docker Desktop

## Start the app

```bash
# 1. Start database and backend
docker-compose up -d --build

# 2. Install frontend dependencies (first time only)
npm install

# 3. Start frontend dev server
npm run dev
# → http://localhost:5173
```

## Pages

| Route | Page |
|---|---|
| `/` | Home — product grid |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/checkout` | Checkout form |
| `/confirmation` | Order confirmation |

## Scripts

```bash
npm run dev            # start Vite dev server
npm run build          # production build
npm run lint           # ESLint
npm test               # Vitest unit + integration
npm run test:e2e       # Playwright E2E suite
```

## E2E Test Tags

Run a subset of tests by tag:

```bash
npx playwright test --grep "@smoke"       # fast critical-path
npx playwright test --grep "@api"         # API contract tests only
npx playwright test --grep "@e2e"         # full purchase flows
npx playwright test --grep "@validation"  # form validation
npx playwright test --grep "@checkout"    # checkout feature area
```

| Tag | Scope |
|---|---|
| `@smoke` | Fast, must-pass on every run |
| `@ui` | Browser UI interaction |
| `@api` | Backend API contract |
| `@e2e` | Full user journey |
| `@critical` | Core business logic |
| `@validation` | Form error handling |
| `@boundary` | Edge cases (stock limits) |
| `@inventory` | Stock decrement consistency |
| `@home` `@product` `@cart` `@checkout` | Feature area |

## Database operations

```bash
# First time / full reset — destroys volume and re-applies schema + seeds
docker-compose down -v
docker-compose up -d --build

# Reset stock and clear orders (deterministic test state, keeps DB running)
docker exec vintagedago_mysql mysql -uvintagedago_user -psecret vintagedago \
  -e "UPDATE products SET stock=5 WHERE name='Vintage Leather Jacket'; \
      UPDATE products SET stock=8 WHERE name='Retro Denim Jeans'; \
      UPDATE products SET stock=12 WHERE name='Vintage Band T-Shirt'; \
      DELETE FROM order_items; DELETE FROM orders; \
      DELETE FROM addresses; DELETE FROM customers;"

# Stop containers (keeps data volume)
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f mysql

# phpMyAdmin — visual table browser
# http://localhost:8080   user: vintagedago_user   pass: secret
```

## Project structure

```
src/
  context/                  CartContext — global cart state
  infrastructure/api/       productService — fetch wrapper
  presentation/
    components/layout/      Navbar
    pages/                  HomePage, ProductPage, CartPage, CheckoutPage, ConfirmationPage

database/
  init.sql                  Schema creation
  seeds.sql                 Initial product data

tests/
  fixtures/                 Playwright custom fixtures (pages, steps, assertions, api, db)
  e2e/
    pages/                  Page Objects (data-testid locators only)
    steps/                  Action orchestration
    assertions/             Centralized expect() calls
    api/                    productApiClient, orderApiClient
    db/                     dbHelper — DB reset helper
    utils/                  constants, testData
    specs/                  Test suites (thin — call steps + assertions only)

.github/workflows/e2e.yml   CI pipeline
docker-compose.yml          MySQL + Express + phpMyAdmin
playwright.config.js        Playwright configuration
```

## Prices

All prices are stored in the `products` MySQL table and read from `GET /api/products`. Nothing is hardcoded in the frontend.

## Repository

https://github.com/daynaragomez/VintageDagoShop_Repo
