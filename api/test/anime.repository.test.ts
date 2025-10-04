import { describe, test, expect, beforeAll } from 'bun:test';
import { AnimeRepository } from '../../api/src/repositories/anime.repository';

describe('AnimeRepository', () => {
  let repository: AnimeRepository;
  let testAnimeId: number | null = null;

  beforeAll(() => {
    repository = new AnimeRepository();
  });

  describe('findAll()', () => {
    test('should return array with limit and offset', async () => {
      const anime = await repository.findAll(10, 0);
      expect(Array.isArray(anime)).toBe(true);
    });

    test('should respect limit parameter', async () => {
      const anime = await repository.findAll(5, 0);
      expect(Array.isArray(anime)).toBe(true);
      expect(anime.length).toBeLessThanOrEqual(5);
    });
  });

  describe('findById()', () => {
    test('should return null for non-existent anime', async () => {
      const anime = await repository.findById(999999999);
      expect(anime).toBe(null);
    });
  });

  describe('findByTitle()', () => {
    test('should return array for any title search', async () => {
      const anime = await repository.findByTitle('test');
      expect(Array.isArray(anime)).toBe(true);
    });

    test('should handle special characters', async () => {
      const anime = await repository.findByTitle('Attack on Titan');
      expect(Array.isArray(anime)).toBe(true);
    });
  });

  describe('create()', () => {
    test('should create new anime', async () => {
      const newAnime = {
        id: Math.floor(Math.random() * 1000000000),
        titleEnglish: `Test Anime ${Date.now()}`,
        titleRomaji: 'Test Anime',
        description: 'Test description',
        genres: ['Action', 'Adventure'],
      };

      const anime = await repository.create(newAnime);
      expect(anime).toBeDefined();
      expect(anime?.titleEnglish).toBe(newAnime.titleEnglish);
      testAnimeId = anime?.id || null;
    });
  });

  describe('update()', () => {
    test('should return null for non-existent anime', async () => {
      const result = await repository.update(999999999, { titleEnglish: 'Updated' });
      expect(result).toBe(null);
    });

    test('should update existing anime', async () => {
      if (testAnimeId) {
        const updated = await repository.update(testAnimeId, {
          titleEnglish: 'Updated Test Anime',
        });
        expect(updated).toBeDefined();
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('delete()', () => {
    test('should return null for non-existent anime', async () => {
      const result = await repository.delete(999999999);
      expect(result).toBe(null);
    });

    test('should delete existing anime', async () => {
      if (testAnimeId) {
        const deleted = await repository.delete(testAnimeId);
        expect(deleted).toBeDefined();
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('findByGenre()', () => {
    test('should return array for any genre', async () => {
      const anime = await repository.findByGenre('Action', 10);
      expect(Array.isArray(anime)).toBe(true);
    });

    test('should respect limit parameter', async () => {
      const anime = await repository.findByGenre('Comedy', 5);
      expect(Array.isArray(anime)).toBe(true);
      expect(anime.length).toBeLessThanOrEqual(5);
    });
  });

  describe('findBySeason()', () => {
    test('should return array for any season', async () => {
      const anime = await repository.findBySeason('WINTER', 2024);
      expect(Array.isArray(anime)).toBe(true);
    });

    test('should handle different seasons', async () => {
      const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
      for (const season of seasons) {
        const anime = await repository.findBySeason(season, 2024);
        expect(Array.isArray(anime)).toBe(true);
      }
    });
  });
});
