#!/bin/bash

echo "🐳 Deploying Hono API with Docker..."

# Build the project
echo "📦 Building project..."
pnpm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t hono-demo .

# Run container
echo "🚀 Starting container..."
docker run -d -p 3000:3000 --name hono-api hono-demo

echo "✅ Deployment complete!"
echo "🌐 Your API is running at http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/api/docs"
echo "❤️  Health Check: http://localhost:3000/health"
echo ""
echo "To stop the container: docker stop hono-api"
echo "To remove the container: docker rm hono-api"

