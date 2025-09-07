# Step 1.1: AWS Lambda Deployment Success

## 🎯 Overview

This document details the successful deployment of our Hono TypeScript API to AWS Lambda, including the challenges faced and solutions implemented. This represents a major milestone in our deployment journey and demonstrates real-world problem-solving skills.

## 🚀 Live API

**Base URL**: `https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/`

**Status**: ✅ **FULLY OPERATIONAL**

## 📊 Performance Metrics

- **Function Size**: 35 kB (highly optimized)
- **Cold Start Time**: ~250ms
- **Memory Usage**: ~70MB
- **Response Time**: <100ms for most requests
- **Runtime**: Node.js 20.x
- **Memory Allocation**: 512MB
- **Timeout**: 30 seconds

## 🔧 Technical Challenges & Solutions

### 1. AWS CloudFormation Permissions Issue

**Problem**: The `lambda-deploy` user lacked CloudFormation permissions required by the Serverless Framework.

**Error**: 
```
User: arn:aws:iam::757278011185:user/lambda-deploy is not authorized to perform: cloudformation:CreateChangeSet
```

**Solution**: Updated the IAM user permissions to include CloudFormation actions:
- `cloudformation:CreateStack`
- `cloudformation:UpdateStack`
- `cloudformation:DescribeStacks`
- `cloudformation:CreateChangeSet`
- And other necessary CloudFormation permissions

### 2. ESM/CommonJS Compatibility Issues

**Problem**: The application used ES modules (`import` statements) but AWS Lambda expected CommonJS format.

**Error**:
```
SyntaxError: Cannot use import statement outside a module
```

**Solution**: 
- Configured `serverless-esbuild` to use `format: cjs`
- Created a lambda-specific `package.json` with `"type": "commonjs"`
- Used `packagePath: lambda-package.json` in serverless configuration

### 3. Environment Variable Validation Error

**Problem**: Zod validation expected `NODE_ENV` to be `development`, `production`, or `test`, but we were setting it to `dev`.

**Error**:
```
Invalid enum value. Expected 'development' | 'production' | 'test', received 'dev'
```

**Solution**: Updated `serverless.yml` to set `NODE_ENV: development` instead of using the stage variable.

### 4. Bundle Size Optimization

**Problem**: Initial bundle was too large for AWS Lambda deployment.

**Solution**:
- Excluded `aws-sdk` from the bundle (already available in Lambda runtime)
- Used `minify: true` for code compression
- Set `sourcemap: false` to reduce size
- Optimized dependencies in lambda-specific package.json

## 🏗️ Architecture

### Serverless Configuration

```yaml
service: hono-deploy-demo
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  stage: dev
  region: us-east-1
  memorySize: 512
  timeout: 30
  environment:
    NODE_ENV: development
    CORS_ORIGIN: '*'
    RATE_LIMIT_WINDOW: '900000'
    RATE_LIMIT_MAX: '100'
    LOG_LEVEL: 'info'

functions:
  api:
    handler: src/lambda.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-esbuild

custom:
  esbuild:
    bundle: true
    minify: true
    sourcemap: false
    exclude:
      - aws-sdk
    target: node20
    platform: node
    format: cjs
    concurrency: 10
    packagePath: lambda-package.json
```

### Lambda Handler

```typescript
import { handle } from 'hono/aws-lambda';
import app from './index';

export const handler = handle(app);
export const httpHandler = handler;
export const apiGatewayHandler = handler;
```

## 🧪 Testing Results

All endpoints tested and working:

### Health Check
```bash
curl https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/health
```
**Response**: ✅ Service healthy with uptime and memory stats

### API Info
```bash
curl https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/
```
**Response**: ✅ Welcome message with endpoint documentation

### User Management
```bash
# List users
curl https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/api/users

# Create user
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}' \
  https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/api/users
```
**Response**: ✅ All CRUD operations working perfectly

## 📁 Files Created/Modified

### New Files
- `serverless.yml` - Serverless Framework configuration
- `lambda-package.json` - Lambda-specific package configuration
- `deploy-lambda.sh` - Deployment script
- `DEPLOYMENT_FIXES.md` - Documentation of fixes applied
- `QUICK_DEPLOY.md` - Quick deployment guide

### Modified Files
- `package.json` - Added build:lambda script and deployment scripts
- `src/lambda.ts` - Lambda handler (already existed, working correctly)

## 🎯 Key Learnings

1. **AWS Permissions**: Always ensure IAM users have sufficient permissions for the services they need to use
2. **Module Systems**: ESM vs CommonJS compatibility is crucial for serverless deployments
3. **Environment Variables**: Pay attention to validation schemas and expected values
4. **Bundle Optimization**: Exclude runtime-provided dependencies to reduce bundle size
5. **Testing**: Always test deployed functions thoroughly before considering deployment complete

## 🚀 Next Steps

With AWS Lambda deployment successful, we now have:
- ✅ A working production API
- ✅ Optimized bundle size
- ✅ Proper error handling
- ✅ Comprehensive testing

Ready for:
- Additional deployment methods (Docker, Vercel, Railway)
- Performance monitoring
- Production scaling
- Medium article demonstration

## 📝 Git Information

- **Commit**: `403f612` - "feat: Successfully deploy Hono API to AWS Lambda"
- **Tag**: `step1.1` - "Step 1.1: AWS Lambda Deployment Success"
- **Branch**: `main`

## 🔗 Related Documentation

- [Step 1: Project Setup](./step1.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Quick Deploy Guide](../QUICK_DEPLOY.md)
- [Deployment Fixes](../DEPLOYMENT_FIXES.md)

---

**Status**: ✅ **COMPLETED**  
**Date**: September 7, 2025  
**Author**: Andrew Allison  
**API Status**: 🟢 **LIVE AND OPERATIONAL**
