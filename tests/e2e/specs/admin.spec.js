import { test, expect } from '@playwright/test';

test.describe('Admin Authentication @admin @auth', () => {
  test('should login with valid admin credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/orders');
    
    // Assuming there will be a login form or redirect
    await page.fill('[name="email"]', 'admin@vintagedago.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Should redirect to admin dashboard after successful login
    await expect(page).toHaveURL(/admin\/orders/);
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/orders');
    
    await page.fill('[name="email"]', 'admin@vintagedago.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=/invalid|error|failed/i')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5173/admin/orders');
    await page.fill('[name="email"]', 'admin@vintagedago.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/admin\/orders/);
    
    // Logout
    await page.click('text=/logout/i');
    
    // Should redirect to login or home
    await expect(page).not.toHaveURL(/admin\/orders/);
  });
});

test.describe('Admin Order Management @admin @orders', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:5173/admin/orders');
    await page.fill('[name="email"]', 'admin@vintagedago.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/admin\/orders/);
  });

  test('should display orders list', async ({ page }) => {
    // Check for orders table or list
    await expect(page.locator('table, [data-testid="orders-list"]')).toBeVisible();
    
    // Should show order columns
    await expect(page.locator('text=/order.*id|customer|total|status/i')).toBeVisible();
  });

  test('should view order details', async ({ page }) => {
    // Click first order
    await page.click('tr:has-text("pending, confirmed, shipped") >> nth=0, a >> nth=0');
    
    // Should navigate to order detail page
    await expect(page).toHaveURL(/admin\/orders\/\d+/);
    
    // Should show order details
    await expect(page.locator('text=/customer|address|items/i')).toBeVisible();
  });

  test('should update order status', async ({ page }) => {
    // Navigate to order detail
    await page.goto('http://localhost:5173/admin/orders/1');
    
    // Select new status
    await page.selectOption('select[name="status"]', 'shipped');
    await page.click('button:has-text("Update Status")');
    
    // Should show success message
    await expect(page.locator('text=/success|updated/i')).toBeVisible();
    
    // Status should be updated
    await expect(page.locator('text=/shipped/i')).toBeVisible();
  });
});

test.describe('Protected Routes @admin @security', () => {
  test('should redirect unauthenticated users from admin pages', async ({ page }) => {
    // Clear any existing auth
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    
    // Try to access admin page
    await page.goto('http://localhost:5173/admin/orders');
    
    // Should redirect to login or show unauthorized
    await expect(page).not.toHaveURL(/admin\/orders/);
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
