import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';

config({ path: '../../.env' });

const dbUrl = process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export const db = drizzle(dbUrl, { schema });
