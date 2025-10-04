#!/usr/bin/env bun
import { $ } from 'bun';
import { config } from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';

console.log('🚀 AYNIA Database Setup\n');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Main Database: ${process.env.POSTGRES_DB}`);

if (isDevelopment) {
  console.log(`Test Database: ${process.env.POSTGRES_DB}_test`);
}

console.log('\n📦 Checking database connection...\n');

try {
  const { Pool } = await import('pg');
  
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: 'postgres',
  });

  await pool.query('SELECT 1');
  console.log('✓ Database connection successful\n');

  const mainDbResult = await pool.query(
    'SELECT datname FROM pg_database WHERE datname = $1',
    [process.env.POSTGRES_DB]
  );

  if (mainDbResult.rows.length > 0) {
    console.log(`✓ Main database "${process.env.POSTGRES_DB}" exists`);
  } else {
    console.log(`✗ Main database "${process.env.POSTGRES_DB}" not found`);
  }

  if (isDevelopment) {
    const testDbName = `${process.env.POSTGRES_DB}_test`;
    const testDbResult = await pool.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [testDbName]
    );

    if (testDbResult.rows.length > 0) {
      console.log(`✓ Test database "${testDbName}" exists`);
    } else {
      console.log(`✗ Test database "${testDbName}" not found`);
    }
  }

  await pool.end();

  console.log('\n📋 Applying migrations to database(s)...\n');
  await $`bun run db:migrate:all`;

  console.log('\n✅ Database setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run tests: bun test');
  console.log('  2. Start the server: bun run dev\n');

  process.exit(0);
} catch (error) {
  console.error('\n❌ Database setup failed:', error);
  console.error('\nTroubleshooting:');
  console.error('  1. Ensure Docker containers are running: docker compose up -d');
  console.error('  2. Check .env file configuration');
  console.error('  3. Wait a few seconds for database to be ready\n');
  process.exit(1);
}
