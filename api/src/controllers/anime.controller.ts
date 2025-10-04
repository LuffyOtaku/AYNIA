import { AnimeService } from '../services/anime.service';
import { ResponseBuilder } from '../utils/response';

export class AnimeController {
  private service: AnimeService;

  constructor() {
    this.service = new AnimeService();
  }

  getAll = async (req: Request): Promise<Response> => {
    try {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const anime = await this.service.getAllAnime(page, limit);
      return ResponseBuilder.success(anime);
    } catch (error) {
      return ResponseBuilder.serverError((error as Error).message);
    }
  };

  getById = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('Anime ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid anime ID');
      }

      const anime = await this.service.getAnimeById(id);
      return ResponseBuilder.success(anime);
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };

  search = async (req: Request): Promise<Response> => {
    try {
      const url = new URL(req.url);
      const title = url.searchParams.get('title');

      if (!title) {
        return ResponseBuilder.error('Title query parameter is required');
      }

      const anime = await this.service.searchAnime(title);
      return ResponseBuilder.success(anime);
    } catch (error) {
      return ResponseBuilder.error((error as Error).message);
    }
  };

  getByGenre = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.genre) {
        return ResponseBuilder.error('Genre is required');
      }
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const anime = await this.service.getAnimeByGenre(params.genre, limit);
      return ResponseBuilder.success(anime);
    } catch (error) {
      return ResponseBuilder.error((error as Error).message);
    }
  };

  getBySeason = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.season || !params.year) {
        return ResponseBuilder.error('Season and year are required');
      }
      const year = parseInt(params.year);
      if (isNaN(year)) {
        return ResponseBuilder.error('Invalid year');
      }

      const anime = await this.service.getAnimeBySeason(params.season, year);
      return ResponseBuilder.success(anime);
    } catch (error) {
      return ResponseBuilder.error((error as Error).message);
    }
  };

  create = async (req: Request): Promise<Response> => {
    try {
      const data = await req.json();
      const anime = await this.service.createAnime(data);
      return ResponseBuilder.created(anime, 'Anime created successfully');
    } catch (error) {
      return ResponseBuilder.error((error as Error).message);
    }
  };

  update = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('Anime ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid anime ID');
      }

      const data = await req.json();
      const anime = await this.service.updateAnime(id, data);
      return ResponseBuilder.success(anime, 'Anime updated successfully');
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };

  delete = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('Anime ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid anime ID');
      }

      await this.service.deleteAnime(id);
      return ResponseBuilder.success(null, 'Anime deleted successfully');
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };
}
