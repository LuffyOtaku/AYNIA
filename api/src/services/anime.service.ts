import { AnimeRepository } from '../repositories/anime.repository';

export class AnimeService {
  private repository: AnimeRepository;

  constructor() {
    this.repository = new AnimeRepository();
  }

  async getAllAnime(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    return await this.repository.findAll(limit, offset);
  }

  async getAnimeById(id: number) {
    const anime = await this.repository.findById(id);
    if (!anime) {
      throw new Error('Anime not found');
    }
    return anime;
  }

  async searchAnime(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error('Search title is required');
    }
    return await this.repository.findByTitle(title);
  }

  async getAnimeByGenre(genre: string, limit: number = 50) {
    if (!genre || genre.trim().length === 0) {
      throw new Error('Genre is required');
    }
    return await this.repository.findByGenre(genre, limit);
  }

  async getAnimeBySeason(season: string, year: number) {
    const validSeasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    if (!validSeasons.includes(season.toUpperCase())) {
      throw new Error('Invalid season. Must be one of: WINTER, SPRING, SUMMER, FALL');
    }
    return await this.repository.findBySeason(season.toUpperCase(), year);
  }

  async createAnime(data: any) {
    return await this.repository.create(data);
  }

  async updateAnime(id: number, data: any) {
    const anime = await this.repository.update(id, data);
    if (!anime) {
      throw new Error('Anime not found');
    }
    return anime;
  }

  async deleteAnime(id: number) {
    const anime = await this.repository.delete(id);
    if (!anime) {
      throw new Error('Anime not found');
    }
    return anime;
  }
}
