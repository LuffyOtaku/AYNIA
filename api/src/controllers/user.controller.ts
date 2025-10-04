import { UserService } from '../services/user.service';
import { ResponseBuilder } from '../utils/response';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAll = async (req: Request): Promise<Response> => {
    try {
      const users = await this.service.getAllUsers();
      return ResponseBuilder.success(users);
    } catch (error) {
      return ResponseBuilder.serverError((error as Error).message);
    }
  };

  getById = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('User ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid user ID');
      }

      const user = await this.service.getUserById(id);
      return ResponseBuilder.success(user);
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };

  create = async (req: Request): Promise<Response> => {
    try {
      const data = await req.json();
      const user = await this.service.createUser(data);
      return ResponseBuilder.created(user, 'User created successfully');
    } catch (error) {
      return ResponseBuilder.error((error as Error).message);
    }
  };

  update = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('User ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid user ID');
      }

      const data = await req.json();
      const user = await this.service.updateUser(id, data);
      return ResponseBuilder.success(user, 'User updated successfully');
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };

  delete = async (req: Request, params: Record<string, string>): Promise<Response> => {
    try {
      if (!params.id) {
        return ResponseBuilder.error('User ID is required');
      }
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return ResponseBuilder.error('Invalid user ID');
      }

      await this.service.deleteUser(id);
      return ResponseBuilder.success(null, 'User deleted successfully');
    } catch (error) {
      return ResponseBuilder.notFound((error as Error).message);
    }
  };
}
