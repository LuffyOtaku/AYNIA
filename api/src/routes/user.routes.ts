import { Router } from '../core/router';
import { UserController } from '../controllers/user.controller';

export function setupUserRoutes(router: Router): void {
  const controller = new UserController();

  router.get('/api/users', controller.getAll);
  router.get('/api/users/:id', controller.getById);
  router.post('/api/users', controller.create);
  router.put('/api/users/:id', controller.update);
  router.delete('/api/users/:id', controller.delete);
}
