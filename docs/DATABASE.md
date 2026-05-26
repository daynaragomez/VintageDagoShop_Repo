# Database

## Start

```bash
docker-compose up -d --build
```

MySQL is ready when:
```bash
docker logs vintagedago_mysql 2>&1 | grep "ready for connections"
```

## Connection details

| Parameter | Value |
|---|---|
| Host | localhost |
| Port | 3306 |
| Database | vintagedago |
| User | vintagedago_user |
| Password | secret |

phpMyAdmin: http://localhost:8080 — user: `vintagedago_user` / pass: `secret`

## Reset stock and orders (keeps containers running)

```bash
docker exec vintagedago_mysql mysql -uvintagedago_user -psecret vintagedago -e "
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM addresses;
  DELETE FROM customers;
  ALTER TABLE order_items AUTO_INCREMENT = 1;
  ALTER TABLE orders      AUTO_INCREMENT = 1;
  ALTER TABLE addresses   AUTO_INCREMENT = 1;
  ALTER TABLE customers   AUTO_INCREMENT = 1;
  UPDATE products SET stock = 5  WHERE name = 'Vintage Leather Jacket';
  UPDATE products SET stock = 8  WHERE name = 'Retro Denim Jeans';
  UPDATE products SET stock = 12 WHERE name = 'Vintage Band T-Shirt';
"
```

## Full reset (destroys volume and re-applies schema + seeds)

```bash
docker-compose down -v
docker-compose up -d --build
```

## Prices

Prices are stored in the `products` table (DECIMAL 10,2). Seed values:

| Product | Price |
|---|---|
| Vintage Leather Jacket | 89.99 |
| Retro Denim Jeans | 45.50 |
| Vintage Band T-Shirt | 29.99 |

To update a price:
```bash
docker exec vintagedago_mysql mysql -uvintagedago_user -psecret vintagedago \
  -e "UPDATE products SET price = 79.99 WHERE name = 'Vintage Leather Jacket';"
```

## Schema

See `database/schema.sql` for the full schema definition.  
See `database/seeds.sql` for initial data.

### Tables

| Table | Purpose |
|---|---|
| `categories` | Lookup table — eliminates repeating category strings |
| `products` | Catalog items with stock and FK to categories |
| `customers` | Customer records extracted per order |
| `addresses` | Structured shipping addresses linked to customers |
| `orders` | Order header — references customer + address, stores subtotal/tax/total |
| `order_items` | Line items per order — references product, stores quantity and unit price |
