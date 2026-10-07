# Database

MySQL 8 is the application database. The Express service connects through a `mysql2` pool using `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD`.

## SQL files

| File | Purpose | Environment |
|---|---|---|
| `database/schema.sql` | Tables, indexes and foreign keys, including `users` | All |
| `database/catalog.sql` | Initial categories and products | Fresh local/staging/production database |
| `database/dev_fixtures.sql` | Sample customer/order and local admin test user | Local/staging only; never production |
| `database/add_users_table.sql` | Standalone migration for an existing DB missing `users` | Reviewed manual migration |

`docker-compose.yml` and `docker-compose.staging.yml` initialize schema, catalog and development fixtures. `docker-compose.prod.yml` initializes schema and catalog only.

## Existing MySQL volumes

MySQL runs `/docker-entrypoint-initdb.d` scripts only when its data directory is empty. A named volume keeps its initialized users, passwords and schema; editing `.env` or mounted SQL files does not update it. If the backend gets `ER_ACCESS_DENIED_ERROR`, verify the existing MySQL account/volume configuration and take a backup before any repair.

`docker compose down` preserves data. `docker compose down -v` deletes the named volume and its data; use only when that loss is intentional.

## Tables

`categories`, `products`, `customers`, `addresses`, `orders`, `order_items`, `users`.

See `database/schema.sql` for columns and relationships. Order creation locks product rows, uses database prices, and commits customer/address/order/items and stock decrement atomically.
