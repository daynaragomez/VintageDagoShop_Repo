# Database

## Start

```bash
docker-compose up -d --build
```

MySQL is ready when:
```bash
docker logs vintagedago_mysql 2>&1 | Select-String "ready for connections"
```

## Connection details

| Parameter | Value |
|---|---|
| Host | localhost |
| Port | 3306 |
| Database | vintagedago |
| User | root |
| Password | rootpassword |

phpMyAdmin: http://localhost:8080

## Reset stock and orders

```bash
docker exec vintagedago_mysql mysql -uroot -prootpassword vintagedago -e "
  UPDATE products SET stock = 5  WHERE name = 'Vintage Leather Jacket';
  UPDATE products SET stock = 8  WHERE name = 'Retro Denim Jeans';
  UPDATE products SET stock = 12 WHERE name = 'Vintage Band T-Shirt';
  DELETE FROM order_items;
  DELETE FROM orders;
  ALTER TABLE orders      AUTO_INCREMENT = 1;
  ALTER TABLE order_items AUTO_INCREMENT = 1;
"
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
docker exec vintagedago_mysql mysql -uroot -prootpassword vintagedago \
  -e "UPDATE products SET price = 79.99 WHERE name = 'Vintage Leather Jacket';"
```

## Schema

See `database/init.sql` for full schema. See `database/seeds.sql` for initial data.
