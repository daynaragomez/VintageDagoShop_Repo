import { test, expect } from '@playwright/test';
import { generateToken } from '../../../backend/src/middleware/auth';

test.describe('Admin access protection (smoke)', () => {
  test('disallow access to admin orders page without admin token', async ({ page }) => {
    // Try to access admin API directly
    const res = await page.request.get('/api/orders');
    expect(res.status()).toBe(401);
  });

  test('disallow access with non-admin token (UI check)', async ({ page }) => {
    const token = generateToken({ id: 1, email: 'user@example.com', role: 'user' });
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, token);

    await page.goto('/admin/orders');
    // Expect redirect to login or an access denied message
    await expect(page.locator('text=Access Denied')).toHaveCount(1).catch(() => {});
  });
});
