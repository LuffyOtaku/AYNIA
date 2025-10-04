import { describe, it, expect, beforeAll } from 'bun:test';
import { config } from 'dotenv';
import { Pool } from 'pg';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';
const mainDbName = process.env.POSTGRES_DB!;
const testDbName = `${mainDbName}_test`;

describe('Complete Database Setup Integration Test', () => {
  describe('Environment Configuration', () => {
    it('should have required environment variables', () => {
      expect(process.env.POSTGRES_USER).toBeDefined();
      expect(process.env.POSTGRES_PASSWORD).toBeDefined();
      expect(process.env.POSTGRES_HOST).toBeDefined();
      expect(process.env.POSTGRES_PORT).toBeDefined();
      expect(process.env.POSTGRES_DB).toBeDefined();
      expect(process.env.NODE_ENV).toBeDefined();
    });
  });

  describe('Database Connectivity', () => {
    it('should connect to PostgreSQL server', async () => {
      const pool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: 'postgres',
      });

      const result = await pool.query('SELECT version()');
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].version).toContain('PostgreSQL');
      
      await pool.end();
    });
  });

  describe('Database Creation Verification', () => {
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

    it('should have main database created', async () => {
      const result = await adminPool.query(
        'SELECT datname FROM pg_database WHERE datname = $1',
        [mainDbName]
      );
      expect(result.rows.length).toBe(1);
    });

    if (isDevelopment) {
      it('should have test database in development', async () => {
        const result = await adminPool.query(
          'SELECT datname FROM pg_database WHERE datname = $1',
          [testDbName]
        );
        expect(result.rows.length).toBe(1);
      });
    }
  });

  describe('Schema Validation', () => {
    const validateSchema = async (dbName: string) => {
      const pool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: dbName,
      });

      const expectedTables = [
        'anime',
        'studios',
        'anime_studios',
        'users',
        'user_anime_list',
        'user_anime_rating',
        'user_preferences',
      ];

      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      const tables = result.rows.map(row => row.table_name);

      for (const table of expectedTables) {
        expect(tables).toContain(table);
      }

      await pool.end();
    };

    it('should have correct schema in main database', async () => {
      await validateSchema(mainDbName);
    });

    if (isDevelopment) {
      it('should have correct schema in test database', async () => {
        await validateSchema(testDbName);
      });

      it('should have identical schemas in both databases', async () => {
        const getSchema = async (dbName: string) => {
          const pool = new Pool({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            database: dbName,
          });

          const result = await pool.query(`
            SELECT 
              table_name,
              column_name,
              data_type,
              is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position
          `);

          await pool.end();
          return result.rows;
        };

        const mainSchema = await getSchema(mainDbName);
        const testSchema = await getSchema(testDbName);

        expect(mainSchema).toEqual(testSchema);
      });
    }
  });

  describe('Data Operations', () => {
    it('should be able to insert and query data in main database', async () => {
      const pool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: mainDbName,
      });

      await pool.query('BEGIN');
      
      try {
        const insertResult = await pool.query(`
          INSERT INTO studios (name) 
          VALUES ('Test Studio Integration') 
          RETURNING id, name
        `);

        expect(insertResult.rows.length).toBe(1);
        expect(insertResult.rows[0].name).toBe('Test Studio Integration');

        const selectResult = await pool.query(
          'SELECT * FROM studios WHERE name = $1',
          ['Test Studio Integration']
        );

        expect(selectResult.rows.length).toBe(1);
        expect(selectResult.rows[0].name).toBe('Test Studio Integration');

        await pool.query('ROLLBACK');
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      } finally {
        await pool.end();
      }
    });

    if (isDevelopment) {
      it('should be able to insert and query data in test database', async () => {
        const pool = new Pool({
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          database: testDbName,
        });

        await pool.query('BEGIN');
        
        try {
          const insertResult = await pool.query(`
            INSERT INTO studios (name) 
            VALUES ('Test Studio Integration Test DB') 
            RETURNING id, name
          `);

          expect(insertResult.rows.length).toBe(1);
          expect(insertResult.rows[0].name).toBe('Test Studio Integration Test DB');

          await pool.query('ROLLBACK');
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        } finally {
          await pool.end();
        }
      });
    }
  });
});
