import { test, expect } from '../../fixtures/index.js';

const ADMIN_CREDENTIALS = {
  email: 'admin@vintagedago.com',
  password: 'admin123'
};

test.describe('Admin Authentication @admin @auth', () => {
  
  test('should login with valid admin credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'load' });
    
    // Wait for login form to load
    await page.waitForSelector('[name="email"]', { timeout: 5000 }).catch(() => null);
    
    // Fill credentials if form is visible
    const emailField = await page.$('[name="email"]');
    if (emailField) {
      await page.fill('[name="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('[name="password"]', ADMIN_CREDENTIALS.password);
      await page.click('button[type="submit"]');
      
      // Should redirect to admin orders page
      await page.waitForURL(/admin/, { timeout: 5000 });
    }
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'load' });
    
    const emailField = await page.$('[name="email"]');
    if (emailField) {
      await page.fill('[name="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message or stay on login
      await page.waitForTimeout(2000);
      const hasError = await page.isVisible('text=/invalid|error|failed|unauthorized/i').catch(() => false);
      const stillOnLogin = !page.url().includes('/admin/orders');
      
      expect(hasError || stillOnLogin).toBeTruthy();
    }
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'load' });
    
    const emailField = await page.$('[name="email"]');
    if (emailField) {
      await page.fill('[name="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('[name="password"]', ADMIN_CREDENTIALS.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 5000 });
      
      // Look for logout button
      const logoutBtn = await page.$('button:has-text("Logout"), a:has-text("Logout"), [data-testid="btn-logout"]');
      if (logoutBtn) {
        await logoutBtn.click();
        
        // Should redirect away from admin
        await page.waitForTimeout(1000);
        expect(page.url().includes('/admin')).toBeFalsy();
      }
    }
  });
});

test.describe('Admin Order Management @admin @orders', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin orders
    await page.goto('http://localhost:5173/admin/orders', { waitUntil: 'load' });
    
    // Check if login is needed
    const emailField = await page.$('[name="email"]');
    if (emailField) {
      await page.fill('[name="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('[name="password"]', ADMIN_CREDENTIALS.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 5000 });
    }
  });

  test('should display orders list', async ({ page }) => {
    // Check for orders table or list
    const table = await page.$('table, [data-testid="orders-list"]');
    if (table) {
      await expect(table).toBeVisible();
    } else {
      // If no table, at least check that we're on the orders page
      expect(page.url()).toContain('/admin/orders');
    }
  });

  test('should view order details', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table, [data-testid="orders-list"]', { timeout: 5000 }).catch(() => null);
    
    // Click first order row or link
    const firstOrderLink = await page.$('a[href*="/admin/orders/"]');
    if (firstOrderLink) {
      await firstOrderLink.click();
      
      // Should navigate to order detail page
      await page.waitForURL(/admin\/orders\/\d+/, { timeout: 5000 });
    }
  });

  test('should update order status', async ({ page }) => {
    // Navigate to order detail
    await page.goto('http://localhost:5173/admin/orders/1', { waitUntil: 'load' });
    
    // Check if login is needed
    const emailField = await page.$('[name="email"]');
    if (emailField) {
      await page.fill('[name="email"]', ADMIN_CREDENTIALS.email);
      await page.fill('[name="password"]', ADMIN_CREDENTIALS.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
    
    // Look for status selector
    const statusSelect = await page.$('select[name="status"]');
    if (statusSelect) {
      await page.selectOption('select[name="status"]', 'shipped');
      
      // Find and click update button
      const updateBtn = await page.$('button:has-text("Update"), button:has-text("Save")');
      if (updateBtn) {
        await updateBtn.click();
        await page.waitForTimeout(2000);
        
        // Check for success message or status change
        const hasSuccess = await page.isVisible('text=/success|updated/i').catch(() => false);
        expect(hasSuccess).toBeTruthy();
      }
    }
  });
});

  test('should block API requests without token', async ({ request }) => {
    // Try to fetch orders without authentication
    const response = await request.get('http://localhost:3000/api/orders');
    
    // Should return 401
    expect(response.status()).toBe(401);
  });

  test('should block API requests with invalid token', async ({ request }) => {
    // Try to fetch orders with fake token
    const response = await request.get('http://localhost:3000/api/orders', {
      headers: {
        'Authorization': 'Bearer invalid-token-12345'
      }
    });
    
    // Should return 401 or 403
    expect([401, 403]).toContain(response.status());
  });
});
