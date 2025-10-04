import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { config } from 'dotenv';
import { Pool } from 'pg';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';
const mainDbName = process.env.POSTGRES_DB!;
const testDbName = `${mainDbName}_test`;

describe('Database Creation Tests', () => {
  let adminPool: Pool;

  beforeAll(() => {
    adminPool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: 'postgres',
    });
  });

  afterAll(async () => {
    await adminPool.end();
  });

  it('should have created the main database', async () => {
    const result = await adminPool.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [mainDbName]
    );
    
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].datname).toBe(mainDbName);
  });

  if (isDevelopment) {
    it('should have created the test database in development mode', async () => {
      const result = await adminPool.query(
        "SELECT datname FROM pg_database WHERE datname = $1",
        [testDbName]
      );
      
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].datname).toBe(testDbName);
    });
  }
});
