#!/bin/bash

# Branch-based deployment script
# Usage: ./deploy-branch-based.sh

set -e

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Determine stage based on branch
if [ "$CURRENT_BRANCH" = "main" ]; then
    STAGE="dev"
    echo "📦 Deploying to DEV stage"
elif [ "$CURRENT_BRANCH" = "production" ]; then
    STAGE="prod"
    echo "🚀 Deploying to PRODUCTION stage"
else
    echo "❌ Unknown branch: $CURRENT_BRANCH"
    echo "   Supported branches: main, production"
    exit 1
fi

# Build and deploy
echo "🔨 Building for $STAGE stage..."
pnpm run build:lambda

echo "🚀 Deploying to AWS Lambda ($STAGE)..."
AWS_PROFILE=lambda-deploy serverless deploy --stage $STAGE

echo "✅ Deployment complete!"
echo "🌐 API URL: https://4nw09b6sn2.execute-api.us-east-1.amazonaws.com/$STAGE/"
echo "📊 Stage: $STAGE"
echo "🌿 Branch: $CURRENT_BRANCH"
