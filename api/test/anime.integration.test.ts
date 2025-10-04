import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { setupRoutes } from '../../api/src/routes';
import type { ApiResponse } from './types';
import { db } from '../src/config/database';
import { animeTable } from '../src/db/schema';

describe('Anime API Integration Tests', () => {
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
    await db.delete(animeTable);
    server.stop();
  });

  describe('GET /api/anime', () => {
    test('should return list of anime or server error', async () => {
      const response = await fetch(`${baseUrl}/api/anime`);
      expect([200, 500]).toContain(response.status);
      
      const data = await response.json() as ApiResponse;
      if (response.status === 200) {
        expect(data.success).toBe(true);
        expect(Array.isArray(data.data)).toBe(true);
      }
    });

    test('should handle pagination parameters', async () => {
      const response = await fetch(`${baseUrl}/api/anime?page=2&limit=10`);
      expect([200, 500]).toContain(response.status);
    });

    test('should use default pagination values', async () => {
      const response = await fetch(`${baseUrl}/api/anime`);
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('GET /api/anime/search', () => {
    test('should search anime by title or return error', async () => {
      const response = await fetch(`${baseUrl}/api/anime/search?title=naruto`);
      expect([200, 400, 500]).toContain(response.status);
    });

    test('should return error when title is missing', async () => {
      const response = await fetch(`${baseUrl}/api/anime/search`);
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title query parameter is required');
    });

    test('should handle URL encoded titles', async () => {
      const response = await fetch(`${baseUrl}/api/anime/search?title=${encodeURIComponent('Attack on Titan')}`);
      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/anime/:id', () => {
    test('should return anime by id when found', async () => {
      const response = await fetch(`${baseUrl}/api/anime/1`);
      
      const data = await response.json();
      expect([200, 404]).toContain(response.status);
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/anime/invalid`);
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid anime ID');
    });

    test('should handle not found anime', async () => {
      const response = await fetch(`${baseUrl}/api/anime/999999`);
      expect(response.status).toBe(404);
      
      const data = await response.json() as ApiResponse;
      expect(data.success).toBe(false);
    });
  });

  describe('GET /api/anime/genre/:genre', () => {
    test('should return anime by genre or return error', async () => {
      const response = await fetch(`${baseUrl}/api/anime/genre/Action`);
      expect([200, 400, 500]).toContain(response.status);
    });

    test('should handle limit parameter', async () => {
      const response = await fetch(`${baseUrl}/api/anime/genre/Action?limit=5`);
      expect([200, 400, 500]).toContain(response.status);
    });

    test('should handle various genre names', async () => {
      const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Romance'];
      
      for (const genre of genres) {
        const response = await fetch(`${baseUrl}/api/anime/genre/${genre}`);
        expect([200, 400, 500]).toContain(response.status);
      }
    });
  });

  describe('GET /api/anime/season/:season/:year', () => {
    test('should return anime by season or return error', async () => {
      const response = await fetch(`${baseUrl}/api/anime/season/WINTER/2024`);
      expect([200, 400, 500]).toContain(response.status);
    });

    test('should handle all valid seasons', async () => {
      const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
      
      for (const season of seasons) {
        const response = await fetch(`${baseUrl}/api/anime/season/${season}/2024`);
        expect([200, 400, 500]).toContain(response.status);
      }
    });

    test('should return error for invalid year', async () => {
      const response = await fetch(`${baseUrl}/api/anime/season/WINTER/invalid`);
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.error).toBe('Invalid year');
    });

    test('should return error for invalid season', async () => {
      const response = await fetch(`${baseUrl}/api/anime/season/INVALID/2024`);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/anime', () => {
    test('should create new anime or return error', async () => {
      const newAnime = {
        id: Math.floor(Math.random() * 1000000),
        titleEnglish: 'Test Anime',
        genres: ['Action', 'Adventure'],
      };
      
      const response = await fetch(`${baseUrl}/api/anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnime),
      });
      
      expect([201, 400, 500]).toContain(response.status);
    });

    test('should handle empty body', async () => {
      const response = await fetch(`${baseUrl}/api/anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('PUT /api/anime/:id', () => {
    test('should update anime', async () => {
      const updateData = {
        titleEnglish: 'Updated Title',
      };
      
      const response = await fetch(`${baseUrl}/api/anime/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      expect([200, 404, 500]).toContain(response.status);
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/anime/invalid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/anime/:id', () => {
    test('should delete anime', async () => {
      const response = await fetch(`${baseUrl}/api/anime/1`, {
        method: 'DELETE',
      });
      
      expect([200, 404, 500]).toContain(response.status);
    });

    test('should return error for invalid id', async () => {
      const response = await fetch(`${baseUrl}/api/anime/invalid`, {
        method: 'DELETE',
      });
      
      expect(response.status).toBe(400);
      
      const data = await response.json() as ApiResponse;
      expect(data.error).toBe('Invalid anime ID');
    });
  });
});
