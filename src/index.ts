import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { EnvSchema } from '@/types';
import { applyMiddleware } from '@/middleware';
import users from '@/routes/users';

/**
 * Main Hono application
 */
const app = new Hono();

// Parse and validate environment variables
const env = EnvSchema.parse(process.env);

// Apply middleware
applyMiddleware(app, env);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Service is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: env.NODE_ENV,
    },
  });
});

// API routes
app.route('/api/users', users);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Hono API Demo',
    data: {
      version: '1.0.0',
      endpoints: {
        health: '/health',
        users: '/api/users',
        docs: '/api/docs',
      },
      environment: env.NODE_ENV,
    },
  });
});

// API documentation endpoint
app.get('/api/docs', (c) => {
  return c.json({
    success: true,
    message: 'API Documentation',
    data: {
      title: 'Hono API Demo',
      version: '1.0.0',
      description: 'A comprehensive Hono TypeScript API demonstrating best practices',
      endpoints: {
        health: {
          method: 'GET',
          path: '/health',
          description: 'Health check endpoint',
        },
        users: {
          method: 'GET',
          path: '/api/users',
          description: 'Get all users with pagination',
          query: {
            page: 'number (default: 1)',
            limit: 'number (default: 10, max: 100)',
          },
        },
        searchUsers: {
          method: 'GET',
          path: '/api/users/search',
          description: 'Search users by name or email',
          query: {
            q: 'string (required)',
            page: 'number (default: 1)',
            limit: 'number (default: 10, max: 100)',
          },
        },
        userStats: {
          method: 'GET',
          path: '/api/users/stats',
          description: 'Get user statistics',
        },
        getUser: {
          method: 'GET',
          path: '/api/users/:id',
          description: 'Get user by ID',
        },
        createUser: {
          method: 'POST',
          path: '/api/users',
          description: 'Create a new user',
          body: {
            name: 'string (required)',
            email: 'string (required, valid email)',
            age: 'number (optional, 0-150)',
          },
        },
        updateUser: {
          method: 'PUT',
          path: '/api/users/:id',
          description: 'Update user by ID',
          body: {
            name: 'string (optional)',
            email: 'string (optional, valid email)',
            age: 'number (optional, 0-150)',
          },
        },
        deleteUser: {
          method: 'DELETE',
          path: '/api/users/:id',
          description: 'Delete user by ID',
        },
      },
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'Not Found',
      error: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404
  );
});

// Export the app for different deployment targets
export default app;

// Start server if running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = env.PORT;
  const host = env.HOST;

  console.log(`🚀 Server starting on ${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
  console.log(`❤️  Health Check: http://${host}:${port}/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);

  serve({
    fetch: app.fetch,
    port,
    hostname: host,
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
  });
}
