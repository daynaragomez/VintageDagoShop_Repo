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
context/                CartContext — client-side cart state (localStorage-backed)
infrastructure/api/     productService — all fetch calls
```

Cart state lives in React context, persisted to `localStorage` per session. On order submission the backend inserts customer, address, and order records atomically and decrements stock. The frontend re-fetches product data from the API — no local stock tracking.

## Backend

Single Express router at `backend/`. Key endpoints:

```
GET  /api/products        list all products with current stock
GET  /api/products/:id    single product
POST /api/orders          place order — inserts customer + address + order in a transaction,
                          decrements stock with row-level locks, returns 400 if stock insufficient
```

POST /api/orders response:
```json
{ "orderId": 7, "subtotal": 89.99, "tax": 13.50, "total": 103.49 }
```

## Database schema (3NF)

```
categories  (id, name, slug)
products    (id, name, description, details, price, stock, category_id → categories, image, created_at)
customers   (id, name, email, phone, created_at)
addresses   (id, customer_id → customers, street, city, state, zip_code, country, created_at)
orders      (id, customer_id → customers, address_id → addresses, subtotal, tax, total, status, created_at)
order_items (id, order_id → orders, product_id → products, quantity, unit_price)
```

Stock decrement is wrapped in a MySQL transaction with `FOR UPDATE` row-level locks to prevent overselling.

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
