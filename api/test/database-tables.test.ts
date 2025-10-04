import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { config } from 'dotenv';
import { Pool } from 'pg';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';
const mainDbName = process.env.POSTGRES_DB!;
const testDbName = `${mainDbName}_test`;

const expectedTables = [
  'anime',
  'studios',
  'anime_studios',
  'users',
  'user_anime_list',
  'user_anime_rating',
  'user_preferences',
];

async function checkTablesExist(pool: Pool): Promise<string[]> {
  const result = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
       OR (table_schema = 'drizzle' AND table_name = '__drizzle_migrations')
    ORDER BY table_name
  `);
  
  return result.rows.map(row => {
    if (row.table_name === '__drizzle_migrations') {
      return 'drizzle.__drizzle_migrations';
    }
    return row.table_name;
  });
}

describe('Database Tables Tests - Main Database', () => {
  let mainPool: Pool;

  beforeAll(() => {
    mainPool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: mainDbName,
    });
  });

  afterAll(async () => {
    await mainPool.end();
  });

  it('should have all expected tables in main database', async () => {
    const tables = await checkTablesExist(mainPool);
    
    for (const expectedTable of expectedTables) {
      const tableName = expectedTable.replace('drizzle.', '');
      expect(tables).toContain(tableName);
    }
  });
});

if (isDevelopment) {
  describe('Database Tables Tests - Test Database', () => {
    let testPool: Pool;

    beforeAll(() => {
      testPool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: testDbName,
      });
    });

    afterAll(async () => {
      await testPool.end();
    });

    it('should have all expected tables in test database', async () => {
      const tables = await checkTablesExist(testPool);
      
      for (const expectedTable of expectedTables) {
        const tableName = expectedTable.replace('drizzle.', '');
        expect(tables).toContain(tableName);
      }
    });

    it('should have the same schema in both databases', async () => {
      const mainPool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: mainDbName,
      });

      const mainTables = await checkTablesExist(mainPool);
      const testTables = await checkTablesExist(testPool);

      await mainPool.end();

      expect(mainTables.sort()).toEqual(testTables.sort());
    });
  });
}
