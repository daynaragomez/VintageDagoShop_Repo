/**
 * Database Helper - Centralized Database Operations
 * 
 * Provides:
 * - Transaction-based operations for data integrity
 * - Data cleanup & reset utilities
 * - Query builders & helpers
 * - Connection pooling
 * 
 * Usage:
 *   const dbHelper = new DatabaseHelper(config.db);
 *   await dbHelper.resetDatabase();
 *   await dbHelper.createProduct({ name: 'Test Product', price: 29.99 });
 */

const mysql = require('mysql2/promise');

class DatabaseHelper {
  constructor(dbConfig) {
    this.config = dbConfig;
    this.pool = null;
  }

  /**
   * Initialize connection pool
   */
  async connect() {
    if (this.pool) return;
    
    this.pool = mysql.createPool({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    console.log('✓ Database pool initialized');
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('✓ Database pool closed');
    }
  }

  /**
   * Reset entire database (for test isolation)
   */
  async resetDatabase() {
    await this.connect();
    const conn = await this.pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Clear test data in order (respecting foreign keys)
      await conn.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY))');
      await conn.query('DELETE FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)');
      await conn.query('DELETE FROM addresses');
      await conn.query('DELETE FROM customers WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)');
      
      // Reset product stock to initial values
      await conn.query(`
        UPDATE products SET stock = CASE 
          WHEN id = 1 THEN 5 
          WHEN id = 2 THEN 8 
          WHEN id = 3 THEN 12 
          ELSE stock 
        END
      `);
      
      await conn.commit();
      console.log('✓ Database reset complete');
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  /**
   * Execute query with transaction
   */
  async executeInTransaction(queryFn) {
    await this.connect();
    const conn = await this.pool.getConnection();
    
    try {
      await conn.beginTransaction();
      const result = await queryFn(conn);
      await conn.commit();
      return result;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(productId) {
    await this.connect();
    const [rows] = await this.pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    return rows[0] || null;
  }

  /**
   * Get all products
   */
  async getAllProducts() {
    await this.connect();
    const [rows] = await this.pool.query('SELECT * FROM products ORDER BY id');
    return rows;
  }

  /**
   * Create test product
   */
  async createProduct(productData) {
    const { name, price, stock, category_id = 1, description = '', image = '' } = productData;
    
    return this.executeInTransaction(async (conn) => {
      const [result] = await conn.query(
        'INSERT INTO products (name, price, stock, category_id, description, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, stock, category_id, description, image]
      );
      return { id: result.insertId, ...productData };
    });
  }

  /**
   * Create test order
   */
  async createOrder(orderData) {
    const { customer_id, total_price, status = 'pending' } = orderData;
    
    return this.executeInTransaction(async (conn) => {
      const [result] = await conn.query(
        'INSERT INTO orders (customer_id, total_price, status) VALUES (?, ?, ?)',
        [customer_id, total_price, status]
      );
      return { id: result.insertId, ...orderData };
    });
  }

  /**
   * Create test customer
   */
  async createCustomer(customerData) {
    const { name, email, phone = '' } = customerData;
    
    return this.executeInTransaction(async (conn) => {
      const [result] = await conn.query(
        'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
        [name, email, phone]
      );
      return { id: result.insertId, ...customerData };
    });
  }

  /**
   * Get order with items
   */
  async getOrderWithItems(orderId) {
    await this.connect();
    const [order] = await this.pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (!order.length) return null;

    const [items] = await this.pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    return {
      ...order[0],
      items: items
    };
  }

  /**
   * Verify product stock after order
   */
  async verifyProductStock(productId, expectedStock) {
    const product = await this.getProduct(productId);
    return product ? product.stock === expectedStock : false;
  }

  /**
   * Count total orders
   */
  async countOrders() {
    await this.connect();
    const [result] = await this.pool.query('SELECT COUNT(*) as count FROM orders');
    return result[0].count;
  }

  /**
   * Delete test data by filter
   */
  async deleteWhere(table, whereClause, values = []) {
    return this.executeInTransaction(async (conn) => {
      const query = `DELETE FROM ${table} WHERE ${whereClause}`;
      const [result] = await conn.query(query, values);
      return result.affectedRows;
    });
  }
}

module.exports = DatabaseHelper;
