import { execSync } from 'child_process';

const CONTAINER  = 'vintagedago_mysql';
const DB         = 'vintagedago';
const MYSQL_USER = 'root';
const MYSQL_PASS = 'rootpassword';

function runSql(sql) {
  execSync(
    `docker exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -e "${sql}"`,
    { stdio: 'pipe' }
  );
}

export const dbHelper = {
  resetStock() {
    runSql(
      "UPDATE products SET stock = 5  WHERE name = 'Vintage Leather Jacket';" +
      "UPDATE products SET stock = 8  WHERE name = 'Retro Denim Jeans';" +
      "UPDATE products SET stock = 12 WHERE name = 'Vintage Band T-Shirt';"
    );
  },

  clearOrders() {
    runSql(
      "DELETE FROM order_items;" +
      "DELETE FROM orders;" +
      "ALTER TABLE orders      AUTO_INCREMENT = 1;" +
      "ALTER TABLE order_items AUTO_INCREMENT = 1;"
    );
  },

  fullReset() {
    this.clearOrders();
    this.resetStock();
  },

  getStock(productName) {
    const out = execSync(
      `docker exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -se "SELECT stock FROM products WHERE name='${productName}';"`,
      { stdio: 'pipe' }
    ).toString().trim();
    return parseInt(out, 10);
  },

  getOrderCount() {
    const out = execSync(
      `docker exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -se "SELECT COUNT(*) FROM orders;"`,
      { stdio: 'pipe' }
    ).toString().trim();
    return parseInt(out, 10);
  },
};
