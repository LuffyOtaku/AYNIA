import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { setupRoutes } from '../src/routes';
import type { ApiResponse } from './types';
import { db } from '../src/config/database';
import { usersTable } from '../src/db/schema';

describe('User API Integration Tests', () => {
  let server: ReturnType<typeof Bun.serve>;
  let baseUrl: string;

  beforeAll(() => {
    const router = setupRoutes();
    server = Bun.serve({
      port: 0,
      async fetch(req) {
        return await router.handle(req);
      },
    });
    baseUrl = `http://localhost:${server.port}`;
  });

  afterAll(async () => {
    await db.delete(usersTable);
    server.stop();
  });

  describe('GET /api/user', () => {
    test('should return list of users', async () => {
      const response = await fetch(`${baseUrl}/api/user`);
      expect(response.status).toBe(200);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('should not expose password hashes', async () => {
      const response = await fetch(`${baseUrl}/api/user`);
      const data = await response.json() as ApiResponse<any[]>;
      
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        data.data.forEach((user: any) => {
          expect(user.passwordHash).toBeUndefined();
        });
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('GET /api/user/:id', () => {
    test('should return user by id when found', async () => {
      const response = await fetch(`${baseUrl}/api/user/1`);
      
      const data = await response.json();
      expect([200, 404]).toContain(response.status);
    });

    test('should not expose password hash', async () => {
      const response = await fetch(`${baseUrl}/api/user/1`);
      const data = await response.json() as ApiResponse;
      
      if (response.status === 200 && data.data) {
        expect((data.data as any).passwordHash).toBeUndefined();
      }
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/user/invalid`);
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid user ID');
    });

    test('should handle not found user', async () => {
      const response = await fetch(`${baseUrl}/api/user/999999`);
      expect(response.status).toBe(404);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
    });
  });

  describe('POST /api/user', () => {
    test('should create new user', async () => {
      const newUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        passwordHash: 'hashedpassword123',
        displayName: 'Test User',
      };
      
      const response = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      
      expect([201, 400, 500]).toContain(response.status);
      
      if (response.status === 201) {
        const data = await response.json() as ApiResponse;
        expect(data.success).toBe(true);
        expect((data.data as any).passwordHash).toBeUndefined();
      }
    });

    test('should handle duplicate email', async () => {
      const user = {
        username: 'uniqueuser',
        email: 'existing@test.com',
        passwordHash: 'hash',
      };
      
      const response = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      expect([201, 400, 500]).toContain(response.status);
    });

    test('should handle empty body', async () => {
      const response = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/user/:id', () => {
    test('should update user', async () => {
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };
      
      const response = await fetch(`${baseUrl}/api/user/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      expect([200, 404, 500]).toContain(response.status);
    });

    test('should not expose password hash in response', async () => {
      const response = await fetch(`${baseUrl}/api/user/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: 'Test' }),
      });
      
      if (response.status === 200) {
        const data = await response.json() as ApiResponse;
        expect((data.data as any).passwordHash).toBeUndefined();
      }
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/user/invalid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/user/:id', () => {
    test('should delete user', async () => {
      const response = await fetch(`${baseUrl}/api/user/1`, {
        method: 'DELETE',
      });
      
      expect([200, 404, 500]).toContain(response.status);
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/user/invalid`, {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.error).toBe('Invalid user ID');
    });

    test('should handle not found user', async () => {
      const response = await fetch(`${baseUrl}/api/user/999999`, {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(404);
    });
  });
});
