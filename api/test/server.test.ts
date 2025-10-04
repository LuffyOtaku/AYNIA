import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { setupRoutes } from '../src/routes';
import type { ApiResponse } from './types';

describe('Bun Runtime Tests', () => {
  test('can check if using Bun', () => {
    expect(Bun).toBeDefined();
  });

  test('can make a fetch() request', async () => {
    const response = await fetch('https://example.com/');
    expect(response.ok).toBe(true);
  });
});

describe('API Server Tests', () => {
  let server: ReturnType<typeof Bun.serve>;
  let baseUrl: string;

  beforeAll(() => {
    const router = setupRoutes();
    server = Bun.serve({
      port: 0,
      async fetch(req) {
        const response = await router.handle(req);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
      },
    });
    baseUrl = `http://localhost:${server.port}`;
  });

  afterAll(() => {
    server.stop();
  });

  describe('Root Endpoints', () => {
    test('GET / returns API info', async () => {
      const response = await fetch(`${baseUrl}/`);
      expect(response.status).toBe(200);
      const data = await response.json() as ApiResponse<any>;
      expect(data.success).toBe(true);
      expect(data.data.message).toBe('AYNIA API');
      expect(data.data.version).toBe('0.0.2');
      expect(data.data.endpoints).toBeDefined();
    });

    test('GET /health returns health status', async () => {
      const response = await fetch(`${baseUrl}/health`);
      expect(response.status).toBe(200);
      const data = await response.json() as ApiResponse<any>;
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('ok');
      expect(data.data.timestamp).toBeDefined();
    });
  });

  describe('404 Not Found', () => {
    test('GET /nonexistent returns 404', async () => {
      const response = await fetch(`${baseUrl}/nonexistent`);
      expect(response.status).toBe(404);
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not found');
    });

    test('POST /invalid/route returns 404', async () => {
      const response = await fetch(`${baseUrl}/invalid/route`, {
        method: 'POST',
      });
      expect(response.status).toBe(404);
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
    });
  });

  describe('CORS Headers', () => {
    test('Response includes CORS headers', async () => {
      const response = await fetch(`${baseUrl}/health`);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Headers')).toContain('Content-Type');
    });
  });
});
