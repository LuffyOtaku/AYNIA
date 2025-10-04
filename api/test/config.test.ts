import { describe, test, expect } from 'bun:test';
import { env } from '../src/config/env';

describe('Configuration', () => {
  describe('Environment Variables', () => {
    test('should have PORT defined', () => {
      expect(env.PORT).toBeDefined();
      expect(typeof env.PORT === 'number' || typeof env.PORT === 'string').toBe(true);
    });

    test('should have NODE_ENV defined', () => {
      expect(env.NODE_ENV).toBeDefined();
      expect(typeof env.NODE_ENV).toBe('string');
    });

    test('should have default PORT value', () => {
      expect(env.PORT).toBeTruthy();
    });

    test('should have default NODE_ENV value', () => {
      expect(env.NODE_ENV).toBeTruthy();
    });

    test('should have database configuration types', () => {
      expect(typeof env.POSTGRES_USER === 'string' || env.POSTGRES_USER === undefined).toBe(true);
      expect(typeof env.POSTGRES_PASSWORD === 'string' || env.POSTGRES_PASSWORD === undefined).toBe(true);
      expect(typeof env.POSTGRES_HOST === 'string' || env.POSTGRES_HOST === undefined).toBe(true);
      expect(typeof env.POSTGRES_PORT === 'string' || env.POSTGRES_PORT === undefined).toBe(true);
      expect(typeof env.POSTGRES_DB === 'string' || env.POSTGRES_DB === undefined).toBe(true);
    });
  });
});
