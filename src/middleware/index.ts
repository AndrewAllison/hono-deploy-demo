import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
// Note: rate-limiter is not available in current Hono version
// import { rateLimiter } from 'hono/rate-limiter';
import { Env } from '@/types';

/**
 * CORS middleware configuration
 */
export const corsMiddleware = (env: Env) =>
  cors({
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

/**
 * Rate limiting middleware (placeholder - implement custom rate limiting)
 */
export const rateLimitMiddleware = (env: Env) => {
  // Custom rate limiting implementation would go here
  return async (c: any, next: any) => {
    // For now, just pass through
    await next();
  };
};

/**
 * Error handling middleware
 */
export const errorHandler = () => {
  return async (err: Error, c: any) => {
    console.error('Error:', err);
    
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      },
      500
    );
  };
};

/**
 * Request logging middleware
 */
export const requestLogger = (env: Env) => {
  return logger((message, ...rest) => {
    if (env.LOG_LEVEL === 'debug') {
      console.log(message, ...rest);
    }
  });
};

/**
 * Health check middleware
 */
export const healthCheck = () => {
  return async (c: any, next: any) => {
    if (c.req.path === '/health') {
      return c.json({
        success: true,
        message: 'Service is healthy',
        data: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.env.npm_package_version || '1.0.0',
        },
      });
    }
    await next();
  };
};

/**
 * Apply all middleware to the app
 */
export const applyMiddleware = (app: Hono, env: Env) => {
  // Security headers
  app.use('*', secureHeaders());
  
  // CORS
  app.use('*', corsMiddleware(env));
  
  // Rate limiting
  app.use('*', rateLimitMiddleware(env));
  
  // Request logging
  app.use('*', requestLogger(env));
  
  // Pretty JSON in development
  if (env.NODE_ENV === 'development') {
    app.use('*', prettyJSON());
  }
  
  // Health check
  app.use('*', healthCheck());
  
  // Error handling (must be last)
  app.onError(errorHandler());
};
