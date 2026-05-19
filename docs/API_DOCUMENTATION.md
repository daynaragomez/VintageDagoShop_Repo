# API

Base URL: `http://localhost:3000/api`

## GET /products

Returns all products with current stock.

**Response 200**
```json
[
  { "id": 1, "name": "Vintage Leather Jacket", "price": "89.99", "stock": 5, "category": "Jackets", "description": "...", "image": "..." }
]
```

## GET /products/:id

Returns a single product.

**Response 200** — product object  
**Response 404** — `{ "error": "Product not found" }`

## POST /orders

Places an order and decrements stock atomically.

**Request body**
```json
{
  "name":    "Jane Doe",
  "email":   "jane@example.com",
  "address": "123 Main St",
  "items": [
    { "productId": 1, "quantity": 1, "unitPrice": 89.99 }
  ]
}
```

**Response 201** — `{ "orderId": 7, "message": "Order placed" }`  
**Response 400** — `{ "error": "Insufficient stock for Vintage Leather Jacket" }`  
**Response 500** — server error
