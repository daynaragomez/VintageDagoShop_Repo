#!/usr/bin/env node
/**
 * Database Reset Script
 * Clears all test data and reinitializes the database
 * Run before E2E test suite to ensure clean state
 */

import { execSync } from 'child_process';
import { platform } from 'os';

const CONTAINER = 'vintagedago_mysql';
const DB = 'vintagedago';
const MYSQL_USER = 'vintagedago_user';
const MYSQL_PASS = 'secret';

// Use docker exe path on Windows
const DOCKER_CMD = platform() === 'win32' 
  ? '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
  : 'docker';

function runCommand(cmd) {
  try {
    console.log(`▶ ${cmd}`);
    execSync(cmd, { stdio: 'inherit', shell: true });
    console.log('✓ Success\n');
  } catch (e) {
    console.error(`✗ Failed: ${e.message}\n`);
    throw e;
  }
}

function checkContainerRunning() {
  try {
    const cmd = `${DOCKER_CMD} exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -e "SELECT 1;"`;
    execSync(cmd, { stdio: 'pipe', shell: true });
    return true;
  } catch {
    return false;
  }
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
console.log('✓ Database is healthy\n');

// Clear all orders and associated data
console.log('Clearing test data...');
const clearSQL = `
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
  const cmd = `${DOCKER_CMD} exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -e "${clearSQL.replace(/\n/g, '')}"`;
  execSync(cmd, { stdio: 'pipe', shell: true });
  console.log('✓ Cleared orders, customers, and addresses');
} catch (e) {
  console.error('✗ Error clearing data:', e.message);
  process.exit(1);
}

// Reset stock levels
console.log('\nResetting product stock levels...');
const resetSQL = `
  UPDATE products SET stock = 5 WHERE name = 'Vintage Leather Jacket';
  UPDATE products SET stock = 8 WHERE name = 'Retro Denim Jeans';
  UPDATE products SET stock = 12 WHERE name = 'Vintage Band T-Shirt';
`;

try {
  const cmd = `${DOCKER_CMD} exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -e "${resetSQL.replace(/\n/g, '')}"`;
  execSync(cmd, { stdio: 'pipe', shell: true });
  console.log('✓ Reset all product stock to initial values');
} catch (e) {
  console.error('✗ Error resetting stock:', e.message);
  process.exit(1);
}

// Verify reset
console.log('\nVerifying database state...');
try {
  const cmd = `${DOCKER_CMD} exec ${CONTAINER} mysql -u${MYSQL_USER} -p${MYSQL_PASS} ${DB} -se "SELECT COUNT(*) as orders FROM orders; SELECT COUNT(*) as items FROM order_items;"`;
  const result = execSync(cmd, { stdio: 'pipe', shell: true }).toString();
  
  const lines = result.trim().split('\n');
  console.log(`✓ Orders: ${lines[0] || 0}`);
  console.log(`✓ Order Items: ${lines[1] || 0}`);
} catch (e) {
  console.error('✗ Error verifying:', e.message);
  process.exit(1);
}

console.log('\n━'.repeat(50));
console.log('✅ Database reset complete! Ready for testing.\n');
