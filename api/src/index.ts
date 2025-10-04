import { config } from 'dotenv';
import { setupRoutes } from './routes';
import { env } from './config/env';

config({ path: '../../.env' });

const router = setupRoutes();

const server = Bun.serve({
  port: env.PORT,
  async fetch(req) {
    const response = await router.handle(req);

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  },
  error(error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  },
});

console.log(` Server running at http://localhost:${server.port}`);
