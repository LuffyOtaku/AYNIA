import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '../.env' });

const isTest = process.env.TARGET_DB === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';

const getDbName = () => {
  if (isTest && isDevelopment) {
    return `${process.env.POSTGRES_DB}_test`;
  }
  return process.env.POSTGRES_DB;
};

const dbUrl = process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${getDbName()}`;

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
});
