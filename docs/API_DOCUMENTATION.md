# API Documentation

Base URL: `http://localhost:3000/api`

---

## GET /products

Returns all products with their current stock level.

**Response 200**
```json
[
  {
    "id": 1,
    "name": "Vintage Leather Jacket",
    "price": "89.99",
    "stock": 5,
    "category": "Jackets",
    "description": "Classic brown leather jacket from the 80s",
    "image": "https://..."
  }
]
```

---

## GET /products/:id

Returns a single product by ID.

**Response 200** — product object  
**Response 404** — `{ "error": "Product not found" }`

---

## POST /orders

Places an order, inserts customer + address records, and decrements stock atomically inside a transaction.

**Request body**
```json
{
  "name":  "Jane Doe",
  "email": "jane@example.com",
  "phone": "514-555-0100",
  "address": {
    "street":  "123 Rue Sainte-Catherine",
    "city":    "Montreal",
    "state":   "Quebec",
    "zipCode": "H3B 1A1",
    "country": "Canada"
  },
  "items": [
    { "productId": 1, "quantity": 1, "unitPrice": 89.99 }
  ]
}
```

> `phone`, `state`, and `zipCode` are optional.  
> `name`, `email`, `address.street`, `address.city`, `address.country`, and `items` are required.

**Response 201**
```json
{
  "orderId":  7,
  "subtotal": 89.99,
  "tax":      13.50,
  "total":    103.49
}
```

**Response 400** — `{ "error": "Insufficient stock for product 1" }` or `{ "error": "Missing required fields" }`  
**Response 500** — server error
