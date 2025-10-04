import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { UserService } from '../src/services/user.service';
import { db } from '../src/config/database';
import { usersTable } from '../src/db/schema';
import { eq } from 'drizzle-orm';

// Armazena IDs de usuários criados para limpeza
const createdUserIds: number[] = [];

// Função para limpar usuários de teste
async function cleanupTestUsers() {
  if (createdUserIds.length > 0) {
    for (const id of createdUserIds) {
      try {
        await db.delete(usersTable).where(eq(usersTable.id, id));
      } catch (error) {
        console.error(`Failed to delete user ${id}:`, error);
      }
    }
    createdUserIds.length = 0;
  }
}

describe('UserService - Real Database Tests', () => {
  const service = new UserService();
  
  // Limpa antes de começar os testes
  beforeAll(async () => {
    await cleanupTestUsers();
  });

  // Limpa após todos os testes
  afterAll(async () => {
    await cleanupTestUsers();
  });

  describe('Complete CRUD Flow', () => {
    let createdUserId: number;
    let secondUserId: number;

    test('should create a new user', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        passwordHash: 'hashed_password_123',
        displayName: 'Test User',
      };

      const result = await service.createUser(userData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
      expect(result.displayName).toBe(userData.displayName);
      expect(result.passwordHash).toBeUndefined(); // Should be sanitized

      createdUserId = result.id;
      createdUserIds.push(createdUserId);
    });

    test('should create a second user for getAllUsers test', async () => {
      const userData = {
        username: `testuser2_${Date.now()}`,
        email: `test2_${Date.now()}@example.com`,
        passwordHash: 'hashed_password_456',
        displayName: 'Test User 2',
      };

      const result = await service.createUser(userData);
      
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      
      secondUserId = result.id;
      createdUserIds.push(secondUserId);
    });

    test('should retrieve user by ID', async () => {
      const result = await service.getUserById(createdUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdUserId);
      expect(result.username).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.passwordHash).toBeUndefined(); // Should be sanitized
    });

    test('should retrieve user by email', async () => {
      // First get the user to know the email
      const user = await service.getUserById(createdUserId);
      const result = await service.getUserByEmail(user.email);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdUserId);
      expect(result.email).toBe(user.email);
      expect(result.passwordHash).toBeUndefined();
    });

    test('should retrieve all users', async () => {
      const result = await service.getAllUsers();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);

      // Verify all users have sanitized passwords
      result.forEach((user: any) => {
        expect(user.passwordHash).toBeUndefined();
        expect(user.id).toBeDefined();
        expect(user.username).toBeDefined();
        expect(user.email).toBeDefined();
      });

      // Verify our created users are in the list
      const createdUserInList = result.find((u: any) => u.id === createdUserId);
      expect(createdUserInList).toBeDefined();
    });

    test('should update user', async () => {
      const updateData = {
        displayName: 'Updated Display Name',
      };

      const result = await service.updateUser(createdUserId, updateData);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdUserId);
      expect(result.displayName).toBe(updateData.displayName);
      expect(result.passwordHash).toBeUndefined();
    });

    test('should verify update persisted', async () => {
      const result = await service.getUserById(createdUserId);

      expect(result.displayName).toBe('Updated Display Name');
    });

    test('should delete user', async () => {
      const result = await service.deleteUser(createdUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdUserId);
      expect(result.passwordHash).toBeUndefined();

      // Remove from cleanup list since it's already deleted
      const index = createdUserIds.indexOf(createdUserId);
      if (index > -1) {
        createdUserIds.splice(index, 1);
      }
    });

    test('should verify user was deleted', async () => {
      await expect(service.getUserById(createdUserId)).rejects.toThrow('User not found');
    });

    test('should delete second user', async () => {
      const result = await service.deleteUser(secondUserId);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(secondUserId);

      // Remove from cleanup list
      const index = createdUserIds.indexOf(secondUserId);
      if (index > -1) {
        createdUserIds.splice(index, 1);
      }
    });
  });

  describe('Error Handling', () => {
    test('should throw error when getting non-existent user by ID', async () => {
      await expect(service.getUserById(999999)).rejects.toThrow('User not found');
    });

    test('should throw error when getting non-existent user by email', async () => {
      await expect(service.getUserByEmail('nonexistent@example.com')).rejects.toThrow('User not found');
    });

    test('should throw error when updating non-existent user', async () => {
      await expect(service.updateUser(999999, { displayName: 'Test' })).rejects.toThrow('User not found');
    });

    test('should throw error when deleting non-existent user', async () => {
      await expect(service.deleteUser(999999)).rejects.toThrow('User not found');
    });
  });

  describe('Validation Tests', () => {
    let testUserId: number;

    test('should throw error when creating user with duplicate email', async () => {
      const userData = {
        username: `uniqueuser_${Date.now()}`,
        email: `duplicate_${Date.now()}@example.com`,
        passwordHash: 'password123',
      };

      const firstUser = await service.createUser(userData);
      testUserId = firstUser.id;
      createdUserIds.push(testUserId);

      const duplicateData = {
        username: `differentuser_${Date.now()}`,
        email: userData.email, // Same email
        passwordHash: 'password456',
      };

      await expect(service.createUser(duplicateData)).rejects.toThrow('Email already exists');
    });

    test('should throw error when creating user with duplicate username', async () => {
      const user = await service.getUserById(testUserId);
      
      const duplicateData = {
        username: user.username, // Same username
        email: `different_${Date.now()}@example.com`,
        passwordHash: 'password789',
      };

      await expect(service.createUser(duplicateData)).rejects.toThrow('Username already exists');
    });

    test('cleanup validation test user', async () => {
      await service.deleteUser(testUserId);
      const index = createdUserIds.indexOf(testUserId);
      if (index > -1) {
        createdUserIds.splice(index, 1);
      }
    });
  });

  describe('Sanitization Tests', () => {
    let sanitizationTestUserId: number;

    test('should never expose passwordHash in any operation', async () => {
      const userData = {
        username: `sanitizetest_${Date.now()}`,
        email: `sanitize_${Date.now()}@example.com`,
        passwordHash: 'super_secret_password',
      };

      // Create
      const created = await service.createUser(userData);
      expect(created.passwordHash).toBeUndefined();
      sanitizationTestUserId = created.id;
      createdUserIds.push(sanitizationTestUserId);

      // Get by ID
      const byId = await service.getUserById(sanitizationTestUserId);
      expect(byId.passwordHash).toBeUndefined();

      // Get by Email
      const byEmail = await service.getUserByEmail(userData.email);
      expect(byEmail.passwordHash).toBeUndefined();

      // Get all
      const all = await service.getAllUsers();
      const userInList = all.find((u: any) => u.id === sanitizationTestUserId);
      expect(userInList?.passwordHash).toBeUndefined();

      // Update
      const updated = await service.updateUser(sanitizationTestUserId, { displayName: 'Test' });
      expect(updated.passwordHash).toBeUndefined();

      // Delete
      const deleted = await service.deleteUser(sanitizationTestUserId);
      expect(deleted.passwordHash).toBeUndefined();

      // Remove from cleanup list
      const index = createdUserIds.indexOf(sanitizationTestUserId);
      if (index > -1) {
        createdUserIds.splice(index, 1);
      }
    });
  });
});
