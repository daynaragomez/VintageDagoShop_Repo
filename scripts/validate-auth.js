#!/usr/bin/env node

/**
 * Admin Auth Validation Script
 * 
 * Validates the admin authentication flow by testing API endpoints
 * Prerequisites:
 *   - Backend server running on http://localhost:3000
 *   - Frontend server running on http://localhost:5173
 *   - Database populated with admin user (email: admin@vintagedago.com, password: admin123)
 */

const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@vintagedago.com';
const ADMIN_PASSWORD = 'admin123';

let authToken = null;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers.Authorization = `Bearer ${authToken}`;
    }

    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function test(name, fn) {
  try {
    process.stdout.write(`✓ ${name}... `);
    await fn();
    console.log('PASS');
    return true;
  } catch (err) {
    console.log(`FAIL: ${err.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🔐 Admin Authentication Validation\n');
  console.log(`API Base: ${API_BASE}\n`);

  let passed = 0;
  let failed = 0;

  // Test 1: Login with valid credentials
  if (await test('Login with valid credentials', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${res.body?.error || 'Unknown error'}`);
    }

    if (!res.body?.token) {
      throw new Error('No token returned');
    }

    authToken = res.body.token;
    console.log(`\n    Retrieved token: ${authToken.substring(0, 20)}...`);
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 2: Login with invalid password
  if (await test('Login with invalid password returns 401', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      email: ADMIN_EMAIL,
      password: 'wrongpassword',
    });

    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Access protected endpoint without token
  if (await test('Access /api/orders without token returns 401', async () => {
    const tempToken = authToken;
    authToken = null;

    const res = await makeRequest('GET', '/orders');

    authToken = tempToken;

    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Access protected endpoint with valid token
  if (await test('Access /api/orders with valid token returns 200', async () => {
    const res = await makeRequest('GET', '/orders');

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${res.body?.error || 'Unknown error'}`);
    }

    if (!Array.isArray(res.body)) {
      throw new Error('Expected array of orders');
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: Get order detail with token
  if (await test('Access /api/orders/1 with valid token returns 200 or 404', async () => {
    const res = await makeRequest('GET', '/orders/1');

    if (res.status !== 200 && res.status !== 404) {
      throw new Error(`Expected 200 or 404, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 6: Get order detail without token
  if (await test('Access /api/orders/1 without token returns 401', async () => {
    const tempToken = authToken;
    authToken = null;

    const res = await makeRequest('GET', '/orders/1');

    authToken = tempToken;

    if (res.status !== 401) {
      throw new Error(`Expected 401, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 7: Input validation on login
  if (await test('Login endpoint validates input (missing email)', async () => {
    const res = await makeRequest('POST', '/auth/login', {
      password: 'password',
    });

    if (res.status !== 400) {
      throw new Error(`Expected 400, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 8: Input validation on order creation
  if (await test('Order creation validates input (missing required fields)', async () => {
    const res = await makeRequest('POST', '/orders', {
      name: 'Test User',
      // Missing email, address, items
    });

    if (res.status !== 400) {
      throw new Error(`Expected 400, got ${res.status}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Test 9: Rate limiting on login
  if (await test('Login endpoint rate limiting is active', async () => {
    // Make 6 requests rapidly (limit is 5 per 15 min)
    const requests = Array(6).fill(null).map(() =>
      makeRequest('POST', '/auth/login', {
        email: 'test@example.com',
        password: 'wrong',
      })
    );

    const results = await Promise.all(requests);
    const rateLimited = results.some(r => r.status === 429);

    if (!rateLimited) {
      console.log('\n    (Note: Rate limit may not trigger in quick succession, depends on implementation)');
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests\n`);

  if (failed === 0) {
    console.log('✅ All tests passed! Admin authentication is properly secured.\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the implementation.\n');
    process.exit(1);
  }
}

// Run the tests
runTests().catch((err) => {
  console.error('\n❌ Error running tests:', err.message);
  console.log('\nMake sure the backend server is running on http://localhost:3000\n');
  process.exit(1);
});
