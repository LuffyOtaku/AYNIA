import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getAllUsers() {
    const users = await this.repository.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  async getUserById(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  async createUser(data: any) {
    const existingEmail = await this.repository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await this.repository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const user = await this.repository.create(data);
    return this.sanitizeUser(user);
  }

  async updateUser(id: number, data: any) {
    const user = await this.repository.update(id, data);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  async deleteUser(id: number) {
    const user = await this.repository.delete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
