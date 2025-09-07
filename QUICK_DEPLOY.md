# Quick Deployment Guide

## Prerequisites

### AWS Lambda Deployment
1. **Install Serverless Framework globally:**
   ```bash
   npm install -g serverless serverless-esbuild
   ```

2. **Configure AWS CLI:**
   ```bash
   aws configure
   ```

3. **Deploy to Lambda (Option 1 - Simple):**
   ```bash
   ./deploy-lambda.sh
   ```

4. **Deploy to Lambda (Option 2 - Manual):**
   ```bash
   pnpm run deploy:lambda
   ```

### AWS ECS Deployment
1. **Install AWS CDK globally:**
   ```bash
   npm install -g aws-cdk
   ```

2. **Bootstrap CDK (first time only):**
   ```bash
   cdk bootstrap
   ```

3. **Deploy to ECS:**
   ```bash
   pnpm run deploy:ecs
   ```

### Docker Deployment
1. **Deploy with Docker (Option 1 - Simple):**
   ```bash
   ./deploy-docker.sh
   ```

2. **Deploy with Docker (Option 2 - Manual):**
   ```bash
   docker build -t hono-demo .
   docker run -p 3000:3000 hono-demo
   ```

## Troubleshooting

### Serverless Framework Issues
- Make sure you're in the project root directory
- Ensure AWS CLI is configured with proper credentials
- Check that the `serverless.yml` file exists in the `deployment/` directory

### CDK Issues
- Make sure you're in the `deployment/` directory when running CDK commands
- Ensure AWS CLI is configured
- Run `cdk bootstrap` if it's your first time using CDK

### Docker Issues
- Make sure Docker is running
- Check that the Dockerfile exists in the root directory
- Ensure all dependencies are installed (`pnpm install`)

## Environment Variables

Set these environment variables for production:

```bash
export NODE_ENV=production
export CORS_ORIGIN=https://yourdomain.com
export RATE_LIMIT_WINDOW=900000
export RATE_LIMIT_MAX=100
export LOG_LEVEL=info
```

## Testing Deployment

After deployment, test your API:

```bash
# Test health endpoint
curl https://your-api-url/health

# Test users endpoint
curl https://your-api-url/api/users

# Run demo script
API_URL=https://your-api-url pnpm run demo
```
