#!/usr/bin/env bun
import { config } from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { readdir, readFile } from 'fs/promises';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ name, status, message });
}

async function getMigrationFiles(): Promise<string[]> {
  try {
    const migrationsDir = path.resolve(__dirname, '../drizzle');
    const files = await readdir(migrationsDir);
    return files.filter(f => f.endsWith('.sql')).sort();
  } catch (error) {
    return [];
  }
}

async function getAppliedMigrations(pool: Pool): Promise<string[]> {
  try {
    const schemaExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.schemata 
        WHERE schema_name = 'drizzle'
      )
    `);

    if (!schemaExists.rows[0].exists) {
      return [];
    }

    const result = await pool.query(`
      SELECT hash, created_at 
      FROM drizzle.__drizzle_migrations 
      ORDER BY created_at
    `);

    return result.rows.map(r => r.hash);
  } catch (error) {
    return [];
  }
}

async function getMigrationHash(filePath: string): Promise<string> {
  const content = await readFile(filePath, 'utf-8');
  const hash = await Bun.hash(content);
  return hash.toString(16);
}

async function checkEnvironmentVariables() {
  const requiredVars = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DB',
    'NODE_ENV',
  ];

  let allPresent = true;
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      allPresent = false;
      missing.push(varName);
    }
  }

  if (allPresent) {
    addResult('Environment Variables', 'pass', 'All required variables are set');
  } else {
    addResult('Environment Variables', 'fail', `Missing: ${missing.join(', ')}`);
  }

  return allPresent;
}

async function checkDatabaseConnection() {
  try {
    const pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: 'postgres',
    });

    await pool.query('SELECT 1');
    await pool.end();
    
    addResult('Database Connection', 'pass', 'Successfully connected to PostgreSQL');
    return true;
  } catch (error) {
    addResult('Database Connection', 'fail', `Connection failed: ${error}`);
    return false;
  }
}

async function checkDatabaseExists(dbName: string) {
  try {
    const pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: 'postgres',
    });

    const result = await pool.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [dbName]
    );

    await pool.end();

    if (result.rows.length > 0) {
      addResult(`Database: ${dbName}`, 'pass', 'Database exists');
      return true;
    } else {
      addResult(`Database: ${dbName}`, 'fail', 'Database does not exist');
      return false;
    }
  } catch (error) {
    addResult(`Database: ${dbName}`, 'fail', `Check failed: ${error}`);
    return false;
  }
}

async function checkSchema(dbName: string) {
  try {
    const pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: dbName,
    });

    const tablesResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tableCount = Number(tablesResult.rows[0].count);

    const migrationsResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'drizzle' 
        AND table_name = '__drizzle_migrations'
      )
    `);

    const hasMigrationsTable = migrationsResult.rows[0].exists;

    if (tableCount === 0) {
      addResult(`Schema: ${dbName}`, 'warning', 'No tables found - run db:migrate:all');
      await pool.end();
      return false;
    }

    if (!hasMigrationsTable) {
      addResult(`Schema: ${dbName}`, 'pass', `${tableCount} tables found (using db:push)`);
      await pool.end();
      return true;
    }

    const migrationFiles = await getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(pool);

    await pool.end();

    if (migrationFiles.length === 0) {
      addResult(`Schema: ${dbName}`, 'warning', `${tableCount} tables, no migration files found`);
      return true;
    }

    if (appliedMigrations.length === 0) {
      addResult(`Schema: ${dbName}`, 'warning', `${tableCount} tables, no migrations applied yet`);
      return false;
    }

    if (appliedMigrations.length < migrationFiles.length) {
      const pending = migrationFiles.length - appliedMigrations.length;
      addResult(
        `Schema: ${dbName}`, 
        'warning', 
        `${appliedMigrations.length}/${migrationFiles.length} migrations applied (${pending} pending)`
      );
      return false;
    }

    addResult(
      `Schema: ${dbName}`, 
      'pass', 
      `${tableCount} tables, ${appliedMigrations.length} migrations applied`
    );
    return true;

  } catch (error) {
    addResult(`Schema: ${dbName}`, 'fail', `Schema check failed: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🔍 AYNIA Database Environment Check\n');
  console.log(`Environment: ${process.env.NODE_ENV}\n`);

  await checkEnvironmentVariables();
  
  const canConnect = await checkDatabaseConnection();
  
  if (canConnect) {
    const mainDb = process.env.POSTGRES_DB!;
    const mainExists = await checkDatabaseExists(mainDb);
    
    if (mainExists) {
      await checkSchema(mainDb);
    }

    if (isDevelopment || isTest) {
      const testDb = `${mainDb}_test`;
      const testExists = await checkDatabaseExists(testDb);
      
      if (testExists) {
        await checkSchema(testDb);
      } else if (isDevelopment) {
        addResult('Test Database', 'warning', 'Expected in development but not found');
      }
    }
  }

  console.log('Results:\n');
  
  let hasFailures = false;
  let hasWarnings = false;

  for (const result of results) {
    let icon = '✓';
    let color = '\x1b[32m';
    
    if (result.status === 'fail') {
      icon = '✗';
      color = '\x1b[31m';
      hasFailures = true;
    } else if (result.status === 'warning') {
      icon = '⚠';
      color = '\x1b[33m';
      hasWarnings = true;
    }

    console.log(`${color}${icon}\x1b[0m ${result.name}: ${result.message}`);
  }

  console.log('');

  if (hasFailures) {
    console.log('\x1b[31m❌ Some checks failed\x1b[0m');
    console.log('\nSuggested actions:');
    console.log('  1. Ensure .env file is configured correctly');
    console.log('  2. Start Docker containers: docker compose up -d');
    console.log('  3. Wait for database to be ready (check: docker compose logs aynia-db)');
    console.log('  4. Run migrations: bun run db:migrate:all\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('\x1b[33m⚠️  Some checks have warnings\x1b[0m');
    console.log('\nSuggested actions:');
    console.log('  1. If you have pending migrations: bun run db:migrate:all');
    console.log('  2. If you modified schema: bun run db:generate && bun run db:migrate:all');
    console.log('  3. Or for quick dev: bun run db:push:all\n');
    process.exit(0);
  } else {
    console.log('\x1b[32m✅ All checks passed!\x1b[0m\n');
    process.exit(0);
  }
}

main();
