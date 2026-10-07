import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';

process.env.JWT_SECRET = 'unit-test-jwt-secret';

const require = createRequire(import.meta.url);
const { authenticateToken, generateToken, requireRole } = require('../../backend/src/middleware/auth');

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

describe('admin authentication middleware', () => {
  it('rejects missing and non-Bearer credentials', () => {
    for (const authorization of [undefined, 'Basic token']) {
      const response = createResponse();
      const next = vi.fn();

      authenticateToken({ headers: { authorization } }, response, next);

      expect(response.statusCode).toBe(401);
      expect(next).not.toHaveBeenCalled();
    }
  });

  it('accepts a valid Bearer token and attaches its user payload', () => {
    const token = generateToken({ id: 1, email: 'admin@example.com', role: 'admin' });
    const request = { headers: { authorization: `Bearer ${token}` } };
    const response = createResponse();
    const next = vi.fn();

    authenticateToken(request, response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(request.user).toMatchObject({ id: 1, role: 'admin' });
  });

  it('rejects invalid tokens and non-admin roles', () => {
    const invalidResponse = createResponse();
    authenticateToken(
      { headers: { authorization: 'Bearer invalid-token' } },
      invalidResponse,
      vi.fn()
    );
    expect(invalidResponse.statusCode).toBe(403);

    const roleResponse = createResponse();
    const next = vi.fn();
    requireRole('admin')({ user: { role: 'user' } }, roleResponse, next);
    expect(roleResponse.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});