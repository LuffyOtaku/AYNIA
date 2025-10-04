import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/db/schema';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';

async function runMigrations(dbName: string) {
  const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${dbName}`;
  
  const pool = new Pool({ connectionString: dbUrl });
  const db = drizzle(pool, { schema });

  console.log(`Running migrations for ${dbName}...`);
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log(`✓ Migrations completed for ${dbName}`);
  } catch (error) {
    console.error(`✗ Error migrating ${dbName}:`, error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    const mainDb = process.env.POSTGRES_DB!;
    await runMigrations(mainDb);

    if (isDevelopment) {
      const testDb = `${mainDb}_test`;
      await runMigrations(testDb);
    }

    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
