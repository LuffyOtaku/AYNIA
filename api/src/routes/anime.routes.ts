import { Router } from '../core/router';
import { AnimeController } from '../controllers/anime.controller';

export function setupAnimeRoutes(router: Router): void {
  const controller = new AnimeController();

  router.get('/api/anime', controller.getAll);
  router.get('/api/anime/search', controller.search);
  router.get('/api/anime/genre/:genre', controller.getByGenre);
  router.get('/api/anime/season/:season/:year', controller.getBySeason);
  router.get('/api/anime/:id', controller.getById);
  router.post('/api/anime', controller.create);
  router.put('/api/anime/:id', controller.update);
  router.delete('/api/anime/:id', controller.delete);
}
