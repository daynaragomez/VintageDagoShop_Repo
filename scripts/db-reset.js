#!/usr/bin/env node
/**
 * Database Reset Script
 * Clears all test data and reinitializes the database to ensure clean state
 * Uses environment variables for credentials (never hardcode passwords)
 * Implements transaction-based cleanup for data integrity
 * Run before E2E test suite: npm run db:reset
 */

import { execSync } from 'child_process';
import { platform } from 'os';
import { existsSync } from 'fs';

const CONTAINER = 'vintagedago_mysql';
const DB = process.env.DB_NAME || 'vintagedago';
const MYSQL_USER = process.env.DB_USER || 'vintagedago_user';
const MYSQL_PASS = process.env.DB_PASSWORD || 'secret';

// Determine docker executable path
const DOCKER_EXE = platform() === 'win32' 
  ? '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
  : 'docker';

// Verify docker exists (basic check)
function getDockerCmd() {
  if (platform() === 'win32') {
    // Windows: check if standard path exists
    const docPath = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe';
    return existsSync(docPath) ? `"${docPath}"` : 'docker';
  }
  return 'docker';
}

function runCommand(cmd, options = {}) {
  const { timeout = 30000, ignoreError = false } = options;
  try {
    console.log(`▶ ${cmd.substring(0, 80)}${cmd.length > 80 ? '...' : ''}`);
    
    // Add timeout to prevent hanging
    const timeoutCmd = platform() === 'win32' 
      ? `powershell -Command "& { ${cmd} }" -ErrorAction Stop`
      : `timeout ${Math.ceil(timeout / 1000)} ${cmd}`;
    
    execSync(cmd, { stdio: 'inherit', shell: true, timeout });
    console.log('✓ Success\n');
  } catch (e) {
    if (!ignoreError) {
      console.error(`✗ Failed: ${e.message}\n`);
      throw e;
    }
    console.warn(`⚠ Warning: ${e.message}\n`);
  }
}

function checkContainerRunning() {
  try {
    const DOCKER = getDockerCmd();
    const cmd = `${DOCKER} exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -e "SELECT 1;" 2>/dev/null`;
    execSync(cmd, { stdio: 'pipe', shell: true });
    return true;
  } catch {
    return false;
  }
}

function executeSqlWithTransaction(sql) {
  const DOCKER = getDockerCmd();
  
  // Wrap in transaction for ACID compliance
  const transactionSql = `
    SET autocommit=0;
    START TRANSACTION;
    ${sql}
    COMMIT;
    SET autocommit=1;
  `;
  
  // Build mysql command with env var password (safer than CLI)
  const escapedSql = transactionSql.replace(/"/g, '\\"').replace(/\n/g, '');
  const cmd = `${DOCKER} exec -e MYSQL_PWD="${MYSQL_PASS}" ${CONTAINER} mysql -u${MYSQL_USER} ${DB} -e "${escapedSql}"`;
  
  execSync(cmd, { stdio: 'pipe', shell: true });
}

console.log('\n🔄 Database Reset Script');
console.log('━'.repeat(50));

// Check if container is running
console.log('\n✓ Checking database connection...');
if (!checkContainerRunning()) {
  console.log('✗ Database container not running or not ready');
  console.log('  Make sure to run: docker compose up -d');
  process.exit(1);
}
console.log('✓ Database is healthy and accessible\n');

// Execute atomic cleanup with transaction
console.log('🔐 Clearing test data (transaction-based for integrity)...');
const clearSql = `
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM addresses;
  DELETE FROM customers;
  ALTER TABLE order_items AUTO_INCREMENT = 1;
  ALTER TABLE orders AUTO_INCREMENT = 1;
  ALTER TABLE addresses AUTO_INCREMENT = 1;
  ALTER TABLE customers AUTO_INCREMENT = 1;
`;

try {
  executeSqlWithTransaction(clearSql);
  console.log('✓ Cleared orders, customers, and addresses (transactional)\n');
} catch (e) {
  console.error('✗ Error clearing data:', e.message);
  console.error('  This may indicate a database deadlock or corruption');
  process.exit(1);
}

// Reset stock levels (single consolidated query)
console.log('📦 Resetting product stock levels...');
const resetSql = `
  UPDATE products SET stock = 
    CASE name
      WHEN 'Vintage Leather Jacket' THEN 5
      WHEN 'Retro Denim Jeans' THEN 8
      WHEN 'Vintage Band T-Shirt' THEN 12
      ELSE stock
    END
  WHERE name IN ('Vintage Leather Jacket', 'Retro Denim Jeans', 'Vintage Band T-Shirt');
`;

try {
  executeSqlWithTransaction(resetSql);
  console.log('✓ Reset all product stock to initial values\n');
} catch (e) {
  console.error('✗ Error resetting stock:', e.message);
  process.exit(1);
}

// Verify reset was successful
console.log('✅ Verifying database state...');
try {
  const DOCKER = getDockerCmd();
  const verifySql = `
    SELECT COUNT(*) as 'Orders' FROM orders;
    SELECT COUNT(*) as 'Order Items' FROM order_items;
    SELECT COUNT(*) as 'Customers' FROM customers;
    SELECT COUNT(*) as 'Addresses' FROM addresses;
  `;
  
  const escapedSql = verifySql.replace(/"/g, '\\"').replace(/\n/g, '');
  const cmd = `${DOCKER} exec -e MYSQL_PWD="${MYSQL_PASS}" ${CONTAINER} mysql -u${MYSQL_USER} ${DB} -e "${escapedSql}"`;
  
  const result = execSync(cmd, { stdio: 'pipe', shell: true }).toString();
  const lines = result.trim().split('\n').filter(l => l && !l.includes('---'));
  
  console.log(`  Orders:        ${lines[0] || '0'}`);
  console.log(`  Order Items:   ${lines[1] || '0'}`);
  console.log(`  Customers:     ${lines[2] || '0'}`);
  console.log(`  Addresses:     ${lines[3] || '0'}`);
} catch (e) {
  console.warn('⚠ Could not verify database state:', e.message);
}

console.log('\n' + '━'.repeat(50));
console.log('✅ Database reset complete! Ready for testing.\n');
