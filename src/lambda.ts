import { handle } from 'hono/aws-lambda';
import app from './index';

/**
 * AWS Lambda handler for Hono application
 * This file is used when deploying to AWS Lambda
 */
export const handler = handle(app);

// Export for different Lambda event types
export const httpHandler = handler;
export const apiGatewayHandler = handler;
