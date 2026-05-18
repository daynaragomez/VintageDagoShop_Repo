# API Documentation - VintageDagoShop

REST API specification for VintageDagoShop Backend (Phase 2).

## Base URL

Development: http://localhost:3000/api
Production: https://api.vintagedagoshop.com/api

## Authentication

All protected routes require JWT token in header:

Authorization: Bearer &lt;token&gt;

## Endpoints

### Products

GET /products
Get all products

Response 200:
{
  success: true,
  data: [
    {
      id: &quot;1&quot;,
      name: &quot;Vintage Leather Jacket&quot;,
      description: &quot;Authentic 80s jacket&quot;,
      price: 89.99,
      stock: 5,
      image: &quot;/images/products/jacket.jpg&quot;,
      category: &quot;outerwear&quot;,
      createdAt: &quot;2024-01-01T00:00:00Z&quot;
    }
  ]
}

GET /products/:id
Get a specific product

Response 200:
{
  success: true,
  data: { ... }
}

Response 404:
{
  success: false,
  error: &quot;Product not found&quot;
}

### Cart

POST /cart
Add product to cart

Request:
{
  productId: &quot;1&quot;,
  quantity: 1
}

Response 201:
{
  success: true,
  data: {
    cartId: &quot;cart-123&quot;,
    items: [...],
    total: 89.99
  }
}

GET /cart/:userId
Get user cart

DELETE /cart/:userId/items/:itemId
Remove item from cart

### Orders

POST /orders
Create new order

Request:
{
  customer: {
    name: &quot;John Doe&quot;,
    email: &quot;john@example.com&quot;,
    phone: &quot;555-1234&quot;,
    address: {
      street: &quot;123 Main St&quot;,
      city: &quot;City&quot;,
      zipCode: &quot;12345&quot;,
      country: &quot;USA&quot;
    }
  },
  payment: {
    method: &quot;credit_card&quot;,
    cardLast4: &quot;4242&quot;
  },
  items: [
    {
      productId: &quot;1&quot;,
      quantity: 1,
      price: 89.99
    }
  ],
  subtotal: 89.99,
  tax: 14.40,
  total: 104.39
}

Response 201:
{
  success: true,
  data: {
    orderId: &quot;ORD-20240101-001&quot;,
    status: &quot;pending&quot;,
    createdAt: &quot;2024-01-01T00:00:00Z&quot;
  }
}

GET /orders/:orderId
Get order details

GET /orders/user/:userId
Get user orders

### Authentication (Future)

POST /auth/register
Register new user

POST /auth/login
Login

POST /auth/logout
Logout

## Status Codes

200 OK - Successful request
201 Created - Resource created
400 Bad Request - Invalid data
401 Unauthorized - Not authenticated
403 Forbidden - Not authorized
404 Not Found - Resource not found
500 Internal Server Error - Server error

## Error Handling

Error response format:

{
  success: false,
  error: {
    code: &quot;PRODUCT_NOT_FOUND&quot;,
    message: &quot;The requested product does not exist&quot;,
    details: { productId: &quot;123&quot; }
  }
}

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Pagination

For endpoints that return lists:

GET /products?page=1&amp;limit=20

Response includes metadata:

{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  }
}

## Webhooks (Future)

POST /webhooks/stripe
Webhook for Stripe events

## Implementation Plan (Phase 2)

### Stack
| Layer      | Technology              | Port |
|------------|-------------------------|------|
| Frontend   | React 18 + Vite         | 5173 |
| Backend    | Node.js + Express       | 3000 |
| Database   | MySQL 8.0 (Docker)      | 3306 |
| DB Admin   | phpMyAdmin (Docker)     | 8080 |

### Backend Project Structure

```
backend/
├── Dockerfile
├── package.json
└── src/
    ├── server.js                  <- Express entry point
    ├── domain/
    │   └── entities/              <- Product, Order, Customer, CartItem
    ├── application/
    │   ├── services/              <- CartService, InventoryService
    │   └── usecases/              <- ProcessOrderUseCase
    ├── infrastructure/
    │   ├── db/
    │   │   └── connection.js      <- mysql2 pool
    │   └── repositories/          <- ProductRepository, OrderRepository
    └── presentation/
        └── routes/                <- products.js, orders.js, cart.js
```

### Setup with Docker

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start MySQL + phpMyAdmin + Backend
docker-compose up -d

# 3. Start Frontend (separate terminal)
npm run dev
```

### Vite Dev Proxy

In development, Vite proxies `/api/*` calls to the backend so there are no CORS issues:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

### Authentication (Phase 3)
- JWT tokens via `POST /auth/login`
- Token stored in `httpOnly` cookie or `Authorization` header
- Refresh token strategy for session management

### Payment Integration (Phase 3)
- Stripe for credit/debit card processing
- Webhook endpoint: `POST /webhooks/stripe`

### Deployment (Phase 4)
- Docker Compose on VPS (DigitalOcean, Linode)
- OR managed MySQL (AWS RDS / PlanetScale) + backend on Railway/Render

See full database schema and Docker configuration in [DATABASE.md](./DATABASE.md).

See roadmap in README.md

---

See also:
- ARCHITECTURE.md
- PROJECT_STRUCTURE.md
