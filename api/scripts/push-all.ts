import { config } from 'dotenv';
import { $ } from 'bun';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
config({ path: envPath });

const isDevelopment = process.env.NODE_ENV === 'development';

async function pushSchema(dbName: string) {
  console.log(`Pushing schema to ${dbName}...`);
  
  try {
    const env = {
      ...process.env,
      TARGET_DB: dbName.includes('_test') ? 'test' : 'main',
    };

    await $`drizzle-kit push`.env(env);
    console.log(`✓ Schema pushed to ${dbName}`);
  } catch (error) {
    console.error(`✗ Error pushing to ${dbName}:`, error);
    throw error;
  }
}

async function main() {
  try {
    const mainDb = process.env.POSTGRES_DB!;
    await pushSchema(mainDb);

    if (isDevelopment) {
      const testDb = `${mainDb}_test`;
      await pushSchema(testDb);
    }

    console.log('All schemas pushed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Push failed:', error);
    process.exit(1);
  }
}

main();
