#!/bin/bash

echo "🚀 Deploying Hono API to AWS Lambda..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not installed. Installing..."
    npm install -g serverless serverless-esbuild
fi

# Build the project
echo "📦 Building project..."
pnpm run build

# Deploy to Lambda
echo "🚀 Deploying to AWS Lambda..."
AWS_PROFILE=lambda-deploy serverless deploy

echo "✅ Deployment complete!"
echo "🌐 Your API is now live on AWS Lambda!"
