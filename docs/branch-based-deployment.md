# Branch-Based Deployment Strategy

## 🌿 **Overview**

This document outlines the branch-based deployment strategy for the Hono TypeScript API, allowing automatic deployments to different environments based on git branches.

## 🎯 **Deployment Strategy**

### **Branch Mapping**
- `main` branch → `dev` stage (Development environment)
- `production` branch → `prod` stage (Production environment)

### **URLs**
- **Development**: `https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/`
- **Production**: `https://vox774lqe0.execute-api.us-east-1.amazonaws.com/prod/`

## 🚀 **Deployment Methods**

### **1. Manual Deployment Script**

```bash
# Deploy based on current branch
./deploy-branch-based.sh

# Or use npm script
pnpm run deploy:branch
```

**What it does:**
- Detects current git branch
- Maps branch to appropriate stage
- Builds the application
- Deploys to AWS Lambda
- Shows deployment URL

### **2. GitHub Actions (Automatic)**

The `.github/workflows/deploy.yml` workflow automatically deploys when:
- Code is pushed to `main` branch → Deploys to `dev` stage
- Code is pushed to `production` branch → Deploys to `prod` stage

**Features:**
- Runs tests before deployment
- Builds the application
- Deploys to appropriate stage
- Comments deployment URL on PRs

## 🔧 **Configuration Files**

### **Branch Detection Script** (`deploy-branch-based.sh`)

```bash
#!/bin/bash
# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Determine stage based on branch
if [ "$CURRENT_BRANCH" = "main" ]; then
    STAGE="dev"
elif [ "$CURRENT_BRANCH" = "production" ]; then
    STAGE="prod"
else
    echo "❌ Unknown branch: $CURRENT_BRANCH"
    exit 1
fi

# Deploy to determined stage
AWS_PROFILE=lambda-deploy serverless deploy --stage $STAGE
```

### **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)

```yaml
name: Deploy Hono API

on:
  push:
    branches: [ main, production ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to DEV
        if: github.ref == 'refs/heads/main'
        run: npx serverless deploy --stage dev
      
      - name: Deploy to PROD
        if: github.ref == 'refs/heads/production'
        run: npx serverless deploy --stage prod
```

## 📊 **Environment Comparison**

| Aspect | Development (`main`) | Production (`production`) |
|--------|---------------------|---------------------------|
| **Stage** | `dev` | `prod` |
| **URL** | `/dev/` | `/prod/` |
| **API Gateway ID** | `4nw09b6sn2` | `vox774lqe0` |
| **Purpose** | Testing, development | Live production |
| **Deployment** | Automatic on push | Manual merge to production |

## 🛠️ **Usage Examples**

### **Development Workflow**

```bash
# 1. Work on main branch
git checkout main
git pull origin main

# 2. Make changes
# ... code changes ...

# 3. Deploy to dev
./deploy-branch-based.sh
# or
pnpm run deploy:branch

# 4. Test dev environment
curl https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/dev/health
```

### **Production Workflow**

```bash
# 1. Merge changes to production
git checkout production
git merge main

# 2. Deploy to production
./deploy-branch-based.sh
# or
pnpm run deploy:branch

# 3. Test production environment
curl https://vox774lqe0.execute-api.us-east-1.amazonaws.com/prod/health
```

## 🔒 **Security Considerations**

### **AWS Credentials**
- Development: Uses `lambda-deploy` profile
- Production: Should use separate production AWS credentials
- GitHub Actions: Uses repository secrets

### **Environment Variables**
- Each stage can have different environment variables
- Production should have stricter security settings
- Consider using AWS Parameter Store or Secrets Manager

## 📈 **Benefits**

1. **Environment Isolation**: Clear separation between dev and prod
2. **Automatic Deployment**: GitHub Actions handle deployments
3. **Branch Protection**: Production requires explicit merge
4. **Easy Testing**: Quick deployment to dev for testing
5. **Rollback Capability**: Easy to revert to previous versions

## 🚨 **Best Practices**

1. **Never push directly to production**: Always merge from main
2. **Test in dev first**: Always test changes in dev before production
3. **Use feature branches**: Create feature branches from main
4. **Monitor deployments**: Check logs and health endpoints
5. **Version tagging**: Tag production releases for easy rollback

## 🔄 **Workflow Diagram**

```
main branch ──→ dev stage ──→ https://...amazonaws.com/dev/
     │
     └─→ merge to production ──→ prod stage ──→ https://...amazonaws.com/prod/
```

## 📝 **Troubleshooting**

### **Common Issues**

1. **Wrong branch detected**: Check `git branch --show-current`
2. **Deployment fails**: Check AWS credentials and permissions
3. **Environment variables**: Verify stage-specific configurations
4. **API not responding**: Check CloudWatch logs for errors

### **Debug Commands**

```bash
# Check current branch
git branch --show-current

# Check deployment status
serverless info --stage dev
serverless info --stage prod

# View logs
serverless logs --function api --stage dev
serverless logs --function api --stage prod
```

## 🎯 **Next Steps**

1. **Add staging environment**: Create `staging` branch for pre-production testing
2. **Environment-specific configs**: Different settings for each stage
3. **Database per environment**: Separate databases for dev/prod
4. **Monitoring**: Add CloudWatch alarms and metrics
5. **Blue-green deployment**: Zero-downtime production deployments

---

**Status**: ✅ **IMPLEMENTED**  
**Last Updated**: September 7, 2025  
**Author**: Andrew Allison
