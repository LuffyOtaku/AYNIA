import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { AnimeService } from '../src/services/anime.service';
import { db } from '../src/config/database';
import { animeTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const createdAnimeIds: number[] = [];

async function cleanupTestAnime() {
  if (createdAnimeIds.length > 0) {
    for (const id of createdAnimeIds) {
      try {
        await db.delete(animeTable).where(eq(animeTable.id, id));
      } catch (error) {
        console.error(`Failed to delete anime ${id}:`, error);
      }
    }
    createdAnimeIds.length = 0;
  }
}

describe('AnimeService - Real Database Tests', () => {
  const service = new AnimeService();

  beforeAll(async () => {
    await cleanupTestAnime();
  });

  afterAll(async () => {
    await cleanupTestAnime();
  });
  describe('Complete CRUD Flow', () => {
    let createdAnimeId: number;
    let secondAnimeId: number;

    test('should create a new anime', async () => {
      const animeData = {
        id: 999990000 + Math.floor(Math.random() * 10000),
        titleEnglish: `Test Anime ${Date.now()}`,
        titleRomaji: `Test Anime Romaji ${Date.now()}`,
        titleNative: 'テストアニメ',
        description: 'A test anime for integration testing',
        format: 'TV',
        status: 'FINISHED',
        episodes: 12,
        duration: 24,
        season: 'WINTER',
        seasonYear: 2024,
        genres: ['Action', 'Adventure'],
        averageScore: 85,
        popularity: 1000,
        favourites: 50,
        isAdult: false,
      };

      const result = await service.createAnime(animeData);

      expect(result).toBeDefined();
      expect(result!.id).toBeDefined();
      expect(result!.titleEnglish).toBe(animeData.titleEnglish);
      expect(result!.genres).toEqual(animeData.genres);

      createdAnimeId = result!.id;
      createdAnimeIds.push(createdAnimeId);
    });

    test('should create a second anime for list tests', async () => {
      const animeData = {
        id: 999990000 + Math.floor(Math.random() * 10000),
        titleEnglish: `Test Anime 2 ${Date.now()}`,
        titleRomaji: `Test Anime 2 Romaji ${Date.now()}`,
        genres: ['Comedy', 'Slice of Life'],
        averageScore: 78,
        popularity: 800,
        season: 'SPRING',
        seasonYear: 2024,
      };

      const result = await service.createAnime(animeData);

      expect(result).toBeDefined();
      expect(result!.id).toBeDefined();

      secondAnimeId = result!.id;
      createdAnimeIds.push(secondAnimeId);
    });

    test('should retrieve anime by ID', async () => {
      const result = await service.getAnimeById(createdAnimeId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdAnimeId);
      expect(result.titleEnglish).toBeDefined();
      expect(result.genres).toBeDefined();
    });

    test('should retrieve all anime', async () => {
      const result = await service.getAllAnime();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);

      const createdAnimeInList = result.find((a: any) => a.id === createdAnimeId);
      expect(createdAnimeInList).toBeDefined();
    });

    test('should handle custom pagination', async () => {
      const result = await service.getAllAnime(1, 5);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    test('should update anime', async () => {
      const updateData = {
        titleEnglish: 'Updated Test Anime Title',
        averageScore: 95,
      };

      const result = await service.updateAnime(createdAnimeId, updateData);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdAnimeId);
      expect(result.titleEnglish).toBe(updateData.titleEnglish);
      expect(result.averageScore).toBe(updateData.averageScore);
    });

    test('should verify update persisted', async () => {
      const result = await service.getAnimeById(createdAnimeId);

      expect(result.titleEnglish).toBe('Updated Test Anime Title');
      expect(result.averageScore).toBe(95);
    });

    test('should delete anime', async () => {
      const result = await service.deleteAnime(createdAnimeId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdAnimeId);

      const index = createdAnimeIds.indexOf(createdAnimeId);
      if (index > -1) {
        createdAnimeIds.splice(index, 1);
      }
    });

    test('should verify anime was deleted', async () => {
      await expect(service.getAnimeById(createdAnimeId)).rejects.toThrow('Anime not found');
    });

    test('should delete second anime', async () => {
      const result = await service.deleteAnime(secondAnimeId);

      expect(result).toBeDefined();
      expect(result.id).toBe(secondAnimeId);

      const index = createdAnimeIds.indexOf(secondAnimeId);
      if (index > -1) {
        createdAnimeIds.splice(index, 1);
      }
    });
  });

  describe('Search and Filter Tests', () => {
    let searchTestAnimeId: number;

    test('should create anime for search tests', async () => {
      const animeData = {
        id: 999990000 + Math.floor(Math.random() * 10000),
        titleEnglish: `Unique Search Title ${Date.now()}`,
        titleRomaji: `Yuniiku Saachi Taitoru ${Date.now()}`,
        genres: ['Action', 'Fantasy'],
        season: 'SUMMER',
        seasonYear: 2023,
        averageScore: 88,
        popularity: 1500,
      };

      const result = await service.createAnime(animeData);
      searchTestAnimeId = result!.id;
      createdAnimeIds.push(searchTestAnimeId);

      expect(result).toBeDefined();
    });

    test('should search anime by title', async () => {
      const anime = await service.getAnimeById(searchTestAnimeId);
      const titleWords = anime.titleEnglish?.split(' ') || [];
      const searchTerm = titleWords[2] || titleWords[0] || 'Unique';
      
      const result = await service.searchAnime(searchTerm);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      const foundAnime = result.find((a: any) => a.id === searchTestAnimeId);
      expect(foundAnime).toBeDefined();
    });

    test('should throw error when search title is empty', async () => {
      await expect(service.searchAnime('')).rejects.toThrow('Search title is required');
    });

    test('should throw error when search title is whitespace', async () => {
      await expect(service.searchAnime('   ')).rejects.toThrow('Search title is required');
    });

    test('should get anime by genre', async () => {
      const result = await service.getAnimeByGenre('Action');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const foundAnime = result.find((a: any) => a.id === searchTestAnimeId);
      expect(foundAnime).toBeDefined();
      expect(foundAnime!.genres).toContain('Action');
    });

    test('should handle custom limit for genre search', async () => {
      const result = await service.getAnimeByGenre('Action', 5);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    test('should throw error when genre is empty', async () => {
      await expect(service.getAnimeByGenre('')).rejects.toThrow('Genre is required');
    });

    test('should throw error when genre is whitespace', async () => {
      await expect(service.getAnimeByGenre('   ')).rejects.toThrow('Genre is required');
    });

    test('should get anime by season', async () => {
      const result = await service.getAnimeBySeason('SUMMER', 2023);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const foundAnime = result.find((a: any) => a.id === searchTestAnimeId);
      expect(foundAnime).toBeDefined();
      expect(foundAnime!.season).toBe('SUMMER');
      expect(foundAnime!.seasonYear).toBe(2023);
    });

    test('should handle all valid seasons', async () => {
      const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

      for (const season of seasons) {
        const result = await service.getAnimeBySeason(season, 2023);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      }
    });

    test('should handle lowercase season names', async () => {
      const result = await service.getAnimeBySeason('summer', 2023);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should throw error for invalid season', async () => {
      await expect(service.getAnimeBySeason('INVALID', 2023)).rejects.toThrow(
        'Invalid season. Must be one of: WINTER, SPRING, SUMMER, FALL'
      );
    });

    test('cleanup search test anime', async () => {
      await service.deleteAnime(searchTestAnimeId);
      const index = createdAnimeIds.indexOf(searchTestAnimeId);
      if (index > -1) {
        createdAnimeIds.splice(index, 1);
      }
    });
  });

  describe('Error Handling', () => {
    test('should throw error when getting non-existent anime by ID', async () => {
      await expect(service.getAnimeById(999999999)).rejects.toThrow('Anime not found');
    });

    test('should throw error when updating non-existent anime', async () => {
      await expect(service.updateAnime(999999999, { titleEnglish: 'Test' })).rejects.toThrow('Anime not found');
    });

    test('should throw error when deleting non-existent anime', async () => {
      await expect(service.deleteAnime(999999999)).rejects.toThrow('Anime not found');
    });
  });
});
