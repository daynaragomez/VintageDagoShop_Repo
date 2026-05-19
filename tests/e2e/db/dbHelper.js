import { execSync } from 'child_process';

const CONTAINER  = 'vintagedago_mysql';
const DB         = 'vintagedago';
const MYSQL_USER = 'root';
const MYSQL_PASS = 'rootpassword';

function runSql(sql) {
  const escaped = sql.replace(//g, '\');
  execSync(
    docker exec  mysql -u -p  -e """",
    { stdio: 'pipe' }
  );
}

export const dbHelper = {
  /**
   * Reset product stock to seed values.
   * Call in beforeEach / afterEach to guarantee clean state.
   */
  resetStock() {
    runSql(
      UPDATE products SET stock = 5  WHERE name = 'Vintage Leather Jacket';
      UPDATE products SET stock = 8  WHERE name = 'Retro Denim Jeans';
      UPDATE products SET stock = 12 WHERE name = 'Vintage Band T-Shirt';
    );
  },

  /**
   * Delete all test orders and reset auto-increment counters.
   */
  clearOrders() {
    runSql(
      DELETE FROM order_items;
      DELETE FROM orders;
      ALTER TABLE orders      AUTO_INCREMENT = 1;
      ALTER TABLE order_items AUTO_INCREMENT = 1;
    );
  },

  /**
   * Full reset: clear orders then restore stock.
   */
  fullReset() {
    this.clearOrders();
    this.resetStock();
  },

  /**
   * Get current stock for a product by name.
   * Returns the stock number.
   */
  getStock(productName) {
    const out = execSync(
      docker exec  mysql -u -p  -se "SELECT stock FROM products WHERE name='';",
      { stdio: 'pipe' }
    ).toString().trim();
    return parseInt(out, 10);
  },

  /**
   * Get all orders count.
   */
  getOrderCount() {
    const out = execSync(
      docker exec  mysql -u -p  -se "SELECT COUNT(*) FROM orders;",
      { stdio: 'pipe' }
    ).toString().trim();
    return parseInt(out, 10);
  },
};