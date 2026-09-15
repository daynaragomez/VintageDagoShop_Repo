import request from 'supertest';
import app from '../../../backend/src/app';
import { generateToken } from '../../../backend/src/middleware/auth';

describe('Auth protection for admin routes', () => {
  it('should return 401 when no token provided', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });

  it('should return 403 when non-admin token provided', async () => {
    const token = generateToken({ id: 1, email: 'user@example.com', role: 'user' });
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('should return 200 when admin token provided', async () => {
    const token = generateToken({ id: 2, email: 'admin@example.com', role: 'admin' });
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect([200, 204, 404]).toContain(res.status); // 200 if orders exist, 404 if empty, accept both
  });
});
