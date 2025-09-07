#!/bin/bash

echo "🚀 Deploying Hono API to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building project..."
pnpm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your API is now live on Vercel!"
echo "📚 Check the output above for your API URL"
