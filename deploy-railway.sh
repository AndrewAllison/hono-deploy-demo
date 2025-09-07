#!/bin/bash

echo "🚀 Deploying Hono API to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not installed. Installing..."
    npm install -g @railway/cli
fi

# Build the project
echo "📦 Building project..."
pnpm run build

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize Railway project
echo "🚀 Initializing Railway project..."
railway init

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your API is now live on Railway!"
echo "📚 Check the output above for your API URL"
