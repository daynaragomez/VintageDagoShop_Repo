# Project Structure - VintageDagoShop

## Directory Tree

```
VintageDagoShop/                      <- project root
├── docker-compose.yml                <- MySQL + phpMyAdmin + Backend
├── .env                              <- environment variables (never commit)
├── .env.example                      <- environment variable template
├── index.html                        <- HTML entry point (Vite)
├── vite.config.js                    <- Vite config (includes /api proxy)
├── package.json                      <- frontend dependencies
│
├── database/                         <- SQL scripts
│   ├── schema.sql                    <- MySQL table definitions
│   ├── seeds.sql                     <- initial data (3 products)
│   └── migrations/                   <- incremental schema changes
│       └── 001_example_migration.sql
│
├── backend/                          <- Node.js + Express backend
│   ├── Dockerfile                    <- backend Docker image
│   ├── package.json                  <- backend dependencies (express, mysql2)
│   └── src/
│       ├── server.js                 ← Express entry point + middleware
│       ├── domain/
│       │   └── entities/             ← Entidades puras del negocio
│       │       ├── Product.js
│       │       ├── CartItem.js
│       │       ├── Order.js
│       │       └── Customer.js
│       ├── application/
│       │   ├── services/             ← Lógica de negocio reutilizable
│       │   │   ├── CartService.js
│       │   │   └── InventoryService.js
│       │   └── usecases/             ← Casos de uso orquestadores
│       │       ├── AddToCartUseCase.js
│       │       └── ProcessOrderUseCase.js
│       ├── infrastructure/
│       │   ├── db/
│       │   │   └── connection.js     ← Pool MySQL (mysql2/promise)
│       │   └── repositories/         ← Implementaciones con MySQL
│       │       ├── ProductRepository.js
│       │       ├── OrderRepository.js
│       │       └── CartRepository.js
│       └── presentation/
│           └── routes/               ← Endpoints Express
│               ├── products.js       ← GET /api/products
│               ├── orders.js         ← POST /api/orders, GET /api/orders/:id
│               └── cart.js           ← POST /api/cart, DELETE /api/cart/:id
│
├── src/                              <- React frontend
│   ├── main.jsx                      <- React entry point
│   ├── App.jsx                       <- routes + providers
│   ├── index.css                     <- global styles
│   ├── App.css
│   ├── context/
│   │   └── CartContext.jsx           <- global cart state
│   └── presentation/                 <- UI layer (web only)
│       ├── components/
│       │   ├── common/               <- Button, Modal, Spinner, Input
│       │   ├── products/             <- ProductCard, ProductGrid
│       │   ├── cart/                 <- CartItem, CartSummary
│       │   └── layout/               <- Header, Footer
│       ├── pages/
│       │   ├── HomePage/             <- catalog + cart
│       │   ├── CheckoutPage/         <- payment form
│       │   └── ConfirmationPage/     <- order confirmation
│       └── hooks/
│           ├── useCart.js
│           ├── useProducts.js        <- fetches products from API
│           └── useCheckout.js
│
├── public/                           <- static assets
│   └── images/products/
│
├── docs/                             <- documentation
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md                   <- MySQL schema + Docker setup
│   ├── API_DOCUMENTATION.md
│   ├── PROJECT_STRUCTURE.md
│   ├── COMPONENT_GUIDELINES.md
│   ├── TESTING_STRATEGY.md
│   ├── CONTRIBUTING.md
│   └── MOBILE_MIGRATION.md
│
└── tests/
    ├── unit/                         <- tests without DB
    └── integration/                  <- tests with MySQL Docker (:3307)
```

## Layer Descriptions

### FRONTEND — Presentation Layer (React)
UI components, pages, and custom hooks. Web only. Will be rewritten in React Native for mobile.

- `src/presentation/components/` — reusable UI (Button, Modal, ProductCard)
- `src/presentation/pages/` — full pages (HomePage, CheckoutPage)
- `src/presentation/hooks/` — hooks that consume the API (useProducts, useCart)
- `src/context/` — global state via Context API

### BACKEND — Application + Domain + Infrastructure (Node.js)
Business logic and data access live here. 100% reusable for React Native.

- `backend/src/domain/entities/` — pure entities (Product, Order, Customer)
- `backend/src/application/services/` — CartService, InventoryService
- `backend/src/application/usecases/` — ProcessOrderUseCase, AddToCartUseCase
- `backend/src/infrastructure/db/` — MySQL connection via mysql2/promise
- `backend/src/infrastructure/repositories/` — MySQL CRUD implementations
- `backend/src/presentation/routes/` — Express REST endpoints

### DATABASE (Docker)
- `database/schema.sql` — tables: `products`, `customers`, `orders`, `order_items`
- `database/seeds.sql` — 3 initial products
- `database/migrations/` — incremental schema changes

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `ProductCard.jsx` |
| Pages | PascalCase | `HomePage.jsx` |
| Hooks | camelCase + "use" | `useCart.js` |
| Services | PascalCase + "Service" | `CartService.js` |
| Repositories | PascalCase + "Repository" | `ProductRepository.js` |
| Express routes | camelCase | `products.js` |
| Utils | camelCase | `formatCurrency.js` |
| CSS Modules | kebab-case | `product-card.module.css` |
| Environment vars | UPPER_SNAKE_CASE | `DB_HOST`, `JWT_SECRET` |

## Request Flow

```
Browser (React)
  +-- useProducts.js
        +-- fetch('/api/products')  -- Vite proxy -->
                                         Express :3000
                                           +-- routes/products.js
                                                 +-- ProductRepository.js
                                                       +-- mysql2 pool
                                                             +-- MySQL :3306 (Docker)
```

## React Native Migration

Reusable (lives in backend):
- `backend/src/application/` — services, use cases
- `backend/src/domain/` — entities
- `backend/src/infrastructure/` — MySQL repositories

Must rewrite (web-specific):
- `src/presentation/` — React web components

## Vite Aliases

```javascript
'@'           -> ./src
'@components' -> ./src/presentation/components
'@hooks'      -> ./src/presentation/hooks
'@context'    -> ./src/context
```

See also: [ARCHITECTURE.md](./ARCHITECTURE.md) | [DATABASE.md](./DATABASE.md) | [CONTRIBUTING.md](./CONTRIBUTING.md)
