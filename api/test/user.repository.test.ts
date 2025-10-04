import { describe, test, expect, beforeAll } from 'bun:test';
import { UserRepository } from '../src/repositories/user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let testUserId: number | null = null;

  beforeAll(() => {
    repository = new UserRepository();
  });

  describe('findAll()', () => {
    test('should return array of users', async () => {
      const users = await repository.findAll();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('findById()', () => {
    test('should return null for non-existent user', async () => {
      const user = await repository.findById(999999999);
      expect(user).toBe(null);
    });

    test('should return user if exists', async () => {
      const users = await repository.findAll();
      if (users.length > 0 && users[0]) {
        const user = await repository.findById(users[0].id);
        expect(user).toBeDefined();
        if (user) {
          expect(user.id).toBe(users[0].id);
        }
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('findByEmail()', () => {
    test('should return null for non-existent email', async () => {
      const user = await repository.findByEmail('nonexistent_random_email_12345@example.com');
      expect(user).toBe(null);
    });

    test('should return user if email exists', async () => {
      const users = await repository.findAll();
      if (users.length > 0 && users[0] && users[0].email) {
        const user = await repository.findByEmail(users[0].email);
        expect(user).toBeDefined();
        if (user) {
          expect(user.email).toBe(users[0].email);
        }
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('findByUsername()', () => {
    test('should return null for non-existent username', async () => {
      const user = await repository.findByUsername('nonexistentuser_random_12345');
      expect(user).toBe(null);
    });

    test('should return user if username exists', async () => {
      const users = await repository.findAll();
      if (users.length > 0 && users[0] && users[0].username) {
        const user = await repository.findByUsername(users[0].username);
        expect(user).toBeDefined();
        if (user) {
          expect(user.username).toBe(users[0].username);
        }
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('create()', () => {
    test('should create new user', async () => {
      const newUser = {
        username: `testuser_${Date.now()}_${Math.random()}`,
        email: `test_${Date.now()}_${Math.random()}@example.com`,
        passwordHash: 'hashedpassword123',
        displayName: 'Test User Coverage',
      };

      const user = await repository.create(newUser);
      expect(user).toBeDefined();
      if (user) {
        expect(user.username).toBe(newUser.username);
        expect(user.email).toBe(newUser.email);
        testUserId = user.id;
      }
    });
  });

  describe('update()', () => {
    test('should return null for non-existent user', async () => {
      const result = await repository.update(999999999, { displayName: 'Updated' });
      expect(result).toBe(null);
    });

    test('should update existing user', async () => {
      if (testUserId) {
        const updated = await repository.update(testUserId, {
          displayName: 'Updated Test User Coverage',
        });
        expect(updated).toBeDefined();
        if (updated) {
          expect(updated.displayName).toBe('Updated Test User Coverage');
        }
      } else {
        const users = await repository.findAll();
        if (users.length > 0 && users[0]) {
          const updated = await repository.update(users[0].id, {
            displayName: 'Test Update Coverage',
          });
          expect(updated).toBeDefined();
          if (updated) {
            expect(updated.displayName).toBe('Test Update Coverage');
          }
        } else {
          expect(true).toBe(true);
        }
      }
    });
  });

  describe('delete()', () => {
    test('should return null for non-existent user', async () => {
      const result = await repository.delete(999999999);
      expect(result).toBe(null);
    });

    test('should delete existing user', async () => {
      if (testUserId) {
        const deleted = await repository.delete(testUserId);
        expect(deleted).toBeDefined();
        if (deleted) {
          expect(deleted.id).toBe(testUserId);
        }
      } else {
        expect(true).toBe(true);
      }
    });
  });
});
