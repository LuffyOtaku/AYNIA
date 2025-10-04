import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
config({ path: envPath });

const isTest = process.env.NODE_ENV === 'test';

const getDbName = () => {
  if (isTest) {
    return `${process.env.POSTGRES_DB}_test`;
  }
  return process.env.POSTGRES_DB;
};

const dbUrl = process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${getDbName()}`;

const pool = new Pool({
  connectionString: dbUrl,
});

export const db = drizzle(pool, { schema });

export const getTestDbUrl = () => {
  return `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}_test`;
};

export const getMainDbUrl = () => {
  return process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
};
