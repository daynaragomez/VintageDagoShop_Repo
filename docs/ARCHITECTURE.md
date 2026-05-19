# Architecture

## Overview

```
React :5173  →  fetch /api/*  →  Express :3000  →  mysql2  →  MySQL :3306
```

The frontend is a React SPA with client-side routing. The backend is a thin Express API that owns all data mutations. The database is the single source of truth for product stock.

## Frontend layers

```
presentation/pages      Routed page components
presentation/components Shared UI (Navbar)
context/                CartContext — client-side cart state (in-memory)
infrastructure/api/     productService — all fetch calls
```

Cart state lives in React context (in-memory per session). On order submission the backend decrements stock atomically. The frontend re-fetches product data from the API — no local stock tracking.

## Backend

Single Express router at `backend/`. Key endpoints:

```
GET  /api/products        list all products with current stock
GET  /api/products/:id    single product
POST /api/orders          place order — decrements stock in a transaction, returns 400 if insufficient
```

## Database schema

```sql
products    (id, name, description, price, stock, category, image)
orders      (id, name, email, address, total, created_at)
order_items (id, order_id, product_id, quantity, unit_price)
```

Stock decrement is wrapped in a MySQL transaction with a row-level lock to prevent overselling.

## Test automation layers

```
specs           thin — describe/test blocks with steps + assertions only
steps           action orchestration (no assertions)
assertions      all expect() calls centralized per page
pages           Playwright Page Objects — data-testid locators and actions only
fixtures        custom test fixture that injects all layers + DB reset
api/            Playwright request context clients for setup and contract checks
db/             dbHelper — execSync docker exec for deterministic DB state
```

No raw `expect()` calls appear in spec files. No `page.waitForTimeout()` anywhere — all waits are condition-based (`waitFor({ state })`, `waitForURL`, `waitForFunction`).
