# Deployment Issues & Solutions

## Issues Identified

### 1. AWS Lambda Deployment Issues
- **ESM/CommonJS Format Conflict**: Serverless-esbuild using CJS but code uses `import.meta`
- **AWS Permissions**: User lacks CloudFormation permissions for stack management

### 2. Solutions Implemented

#### Option 1: Docker Deployment (Recommended - No AWS Required)
```bash
# Build and run with Docker
docker build -t hono-demo .
docker run -p 3000:3000 hono-demo

# Test the API
curl http://localhost:3000/health
```

#### Option 2: Local Development Server
```bash
# Run locally for testing
pnpm run build
PORT=3000 node dist/index.js

# Test the API
curl http://localhost:3000/health
```

#### Option 3: Fixed AWS Lambda (Requires AWS Permissions)
```bash
# First, ensure you have proper AWS permissions
# Add CloudFormation permissions to your IAM user/role

# Then deploy
pnpm run deploy:lambda
```

## AWS Permissions Required

For AWS Lambda deployment, your IAM user needs these permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*",
                "iam:*",
                "lambda:*",
                "apigateway:*",
                "logs:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## Quick Test Commands

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test users endpoint
curl http://localhost:3000/api/users

# Test API documentation
curl http://localhost:3000/api/docs

# Run full demo
API_URL=http://localhost:3000 pnpm run demo
```

## Alternative Deployment Platforms

### 1. Vercel (Easiest)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### 2. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. Render
- Connect your GitHub repository
- Select "Web Service"
- Use the Dockerfile
- Deploy automatically

## Current Status

✅ **Working**: Docker deployment, local development
❌ **Issues**: AWS Lambda (permissions), Serverless Framework (ESM/CJS conflict)

## Recommended Next Steps

1. **Use Docker** for immediate testing and development
2. **Fix AWS permissions** if you need Lambda deployment
3. **Consider Vercel/Railway** for easier serverless deployment
4. **Test all endpoints** to ensure functionality

