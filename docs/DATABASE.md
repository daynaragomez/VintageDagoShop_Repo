# Database Documentation - VintageDagoShop

Complete guide for the MySQL relational database setup, schema, and Docker configuration.

## Overview

VintageDagoShop uses **MySQL 8.0** as its relational database, managed via **Docker Compose** for consistent development and production environments.

| Component     | Technology         | Port |
|---------------|--------------------|------|
| Database      | MySQL 8.0          | 3306 |
| DB Admin UI   | phpMyAdmin         | 8080 |
| Backend API   | Node.js + Express  | 3000 |
| Frontend      | React + Vite       | 5173 |

---

## Docker Setup

### docker-compose.yml (project root)

```yaml
version: '3.8'

services:
  mysql:
	image: mysql:8.0
	container_name: vintagedago_mysql
	restart: always
	environment:
	  MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
	  MYSQL_DATABASE: ${DB_NAME}
	  MYSQL_USER: ${DB_USER}
	  MYSQL_PASSWORD: ${DB_PASSWORD}
	ports:
	  - "3306:3306"
	volumes:
	  - mysql_data:/var/lib/mysql
	  - ./database/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql
	  - ./database/seeds.sql:/docker-entrypoint-initdb.d/02_seeds.sql
	networks:
	  - vintagedago_network
	healthcheck:
	  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
	  timeout: 20s
	  retries: 10

  phpmyadmin:
	image: phpmyadmin/phpmyadmin
	container_name: vintagedago_phpmyadmin
	restart: always
	ports:
	  - "8080:80"
	environment:
	  PMA_HOST: mysql
	  PMA_USER: ${DB_USER}
	  PMA_PASSWORD: ${DB_PASSWORD}
	depends_on:
	  mysql:
		condition: service_healthy
	networks:
	  - vintagedago_network

  backend:
	build:
	  context: ./backend
	  dockerfile: Dockerfile
	container_name: vintagedago_backend
	restart: always
	ports:
	  - "3000:3000"
	environment:
	  NODE_ENV: development
	  DB_HOST: mysql
	  DB_PORT: 3306
	  DB_NAME: ${DB_NAME}
	  DB_USER: ${DB_USER}
	  DB_PASSWORD: ${DB_PASSWORD}
	  JWT_SECRET: ${JWT_SECRET}
	  FRONTEND_URL: http://localhost:5173
	depends_on:
	  mysql:
		condition: service_healthy
	volumes:
	  - ./backend:/app
	  - /app/node_modules
	networks:
	  - vintagedago_network

volumes:
  mysql_data:

networks:
  vintagedago_network:
	driver: bridge
```

### Start All Services

```bash
# Start all services (MySQL + phpMyAdmin + Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v

# Rebuild backend after code changes
docker-compose up -d --build backend
```

### Access Points

| Service    | URL                             | Credentials              |
|------------|---------------------------------|--------------------------|
| Backend API| http://localhost:3000/api       | —                        |
| phpMyAdmin | http://localhost:8080           | DB_USER / DB_PASSWORD    |
| Frontend   | http://localhost:5173           | (npm run dev)            |
| MySQL      | localhost:3306                  | DB_USER / DB_PASSWORD    |

---

## Database Schema

### Entity Relationship Diagram

```
products
  id (PK)
  name
  description
  price
  stock
  image_url
  category
  is_active
  created_at
  updated_at

customers
  id (PK)
  name
  email (UNIQUE)
  phone
  street
  city
  zip_code
  country
  created_at

orders
  id (PK)
  customer_id (FK -> customers.id)
  subtotal
  tax
  total
  status  [pending | processing | completed | cancelled]
  created_at
  updated_at

order_items
  id (PK)
  order_id (FK -> orders.id)
  product_id (FK -> products.id)
  quantity
  price_at_purchase   <- snapshot of price at time of order
```

### database/schema.sql

```sql
-- VintageDagoShop - MySQL Schema
-- Version: 1.0.0

CREATE DATABASE IF NOT EXISTS vintagedago CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vintagedago;

-- --------------------------------------------------------
-- Products
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)     NOT NULL,
  description   TEXT,
  price         DECIMAL(10, 2)   NOT NULL CHECK (price >= 0),
  stock         INT UNSIGNED     NOT NULL DEFAULT 0,
  image_url     VARCHAR(500),
  category      VARCHAR(100),
  is_active     TINYINT(1)       NOT NULL DEFAULT 1,
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Customers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)     NOT NULL,
  email         VARCHAR(255)     NOT NULL UNIQUE,
  phone         VARCHAR(30),
  street        VARCHAR(255),
  city          VARCHAR(100),
  zip_code      VARCHAR(20),
  country       VARCHAR(100)     DEFAULT 'USA',
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Orders
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id   INT UNSIGNED     NOT NULL,
  subtotal      DECIMAL(10, 2)   NOT NULL,
  tax           DECIMAL(10, 2)   NOT NULL DEFAULT 0.00,
  total         DECIMAL(10, 2)   NOT NULL,
  status        ENUM('pending','processing','completed','cancelled')
								 NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id)
	REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Order Items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id           INT UNSIGNED     NOT NULL,
  product_id         INT UNSIGNED     NOT NULL,
  quantity           INT UNSIGNED     NOT NULL CHECK (quantity > 0),
  price_at_purchase  DECIMAL(10, 2)   NOT NULL,
  CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)
	REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
	REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Indexes
-- --------------------------------------------------------
CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
```

### database/seeds.sql

```sql
-- VintageDagoShop - Seed Data
USE vintagedago;

INSERT INTO products (name, description, price, stock, image_url, category) VALUES
(
  'Vintage Leather Jacket',
  'Authentic 80s brown leather jacket, excellent condition',
  89.99, 5,
  '/images/products/leather-jacket.jpg',
  'outerwear'
),
(
  'Retro Denim Jeans',
  'High-waisted denim jeans, vintage 90s style',
  45.50, 8,
  '/images/products/denim-jeans.jpg',
  'bottoms'
),
(
  'Vintage Band T-Shirt',
  'Original 90s rock band t-shirt, rare find',
  29.99, 12,
  '/images/products/band-tshirt.jpg',
  'tops'
);
```

---

## Backend Database Connection

### backend/src/infrastructure/db/connection.js

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  database: process.env.DB_NAME     || 'vintagedago',
  user:     process.env.DB_USER     || 'vintagedago_user',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```

### backend/src/infrastructure/repositories/ProductRepository.js

```javascript
import pool from '../db/connection.js';

export class ProductRepository {
  async findAll() {
	const [rows] = await pool.query(
	  'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC'
	);
	return rows;
  }

  async findById(id) {
	const [rows] = await pool.query(
	  'SELECT * FROM products WHERE id = ? AND is_active = 1',
	  [id]
	);
	return rows[0] || null;
  }

  async decrementStock(id, quantity) {
	const [result] = await pool.query(
	  'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
	  [quantity, id, quantity]
	);
	return result.affectedRows > 0;
  }
}
```

---

## Migrations Strategy

For future schema changes, use sequential numbered SQL files:

```
database/
+-- schema.sql          <- initial schema (auto-loaded by Docker)
+-- seeds.sql           <- initial data  (auto-loaded by Docker)
+-- migrations/
	+-- 001_add_users_table.sql
	+-- 002_add_wishlist.sql
	+-- 003_add_reviews.sql
```

Apply a migration manually:
```bash
docker exec -i vintagedago_mysql mysql -u root -p vintagedago < database/migrations/001_add_users_table.sql
```

---

## Environment Variables

See `.env.example` for all required variables. Never commit `.env` to version control.

Key database variables:

| Variable        | Description                     | Example                 |
|-----------------|---------------------------------|-------------------------|
| DB_HOST         | MySQL host (docker service name)| mysql                   |
| DB_PORT         | MySQL port                      | 3306                    |
| DB_NAME         | Database name                   | vintagedago             |
| DB_USER         | Database user                   | vintagedago_user        |
| DB_PASSWORD     | Database password               | yourpassword            |
| DB_ROOT_PASSWORD| MySQL root password             | rootpassword            |

---

## Testing with Database

For integration tests, spin up a separate MySQL container:

```bash
# Start test DB
docker run --name vintagedago_test_db -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=vintagedago_test -p 3307:3306 -d mysql:8.0

# Run integration tests
DB_PORT=3307 DB_NAME=vintagedago_test npm run test:integration

# Stop and remove test DB
docker rm -f vintagedago_test_db
```

---

See also:
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
