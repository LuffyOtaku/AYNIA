import { Router } from '../core/router';
import { UserController } from '../controllers/user.controller';

export function setupUserRoutes(router: Router): void {
  const controller = new UserController();

  router.get('/api/user', controller.getAll);
  router.get('/api/user/:id', controller.getById);
  router.post('/api/user', controller.create);
  router.put('/api/user/:id', controller.update);
  router.delete('/api/user/:id', controller.delete);
}
