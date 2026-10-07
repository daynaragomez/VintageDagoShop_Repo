import { test, expect } from '@playwright/test';

test.describe('Admin access protection (smoke)', () => {
  test('disallow access to admin orders page without admin token', async ({ page }) => {
    // Try to access admin API directly without token
    const res = await page.request.get('http://localhost:3000/api/orders');
    expect(res.status()).toBe(401);
  });

  test('disallow access with non-admin token (UI check)', async ({ page }) => {
    // Use an invalid/malformed token to test access denial
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIifQ.invalidSignature';
    
    await page.addInitScript((token) => {
      window.localStorage.setItem('auth_token', token);
    }, fakeToken);

    await page.goto('http://localhost:5173/admin/orders');
    
    // Should either redirect or show access denied
    // Check if redirected away from admin page
    const url = page.url();
    const isRedirected = !url.includes('/admin/orders');
    
    // If still on page, should show error message
    if (!isRedirected) {
      const errorVisible = await page.locator('text=/Access Denied|Unauthorized|401/i').isVisible().catch(() => false);
      expect(isRedirected || errorVisible).toBeTruthy();
    } else {
      expect(isRedirected).toBe(true);
    }
  });
});
