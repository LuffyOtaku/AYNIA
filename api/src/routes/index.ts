import { Router } from '../core/router';
import { setupUserRoutes } from './user.routes';
import { ResponseBuilder } from '../utils/response';

export function setupRoutes(): Router {
  const router = new Router();

  router.get('/', () => {
    return ResponseBuilder.success({
      message: 'AYNIA API',
      version: '0.0.1',
      endpoints: {
        users: '/api/users',
      }
    });
  });

  router.get('/health', () => {
    return ResponseBuilder.success({ status: 'ok', timestamp: new Date().toISOString() });
  });

  setupUserRoutes(router);

  return router;
}
