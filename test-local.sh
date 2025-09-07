#!/bin/bash

echo "🧪 Testing Hono API locally..."

# Build the project
echo "📦 Building project..."
pnpm run build

# Start the server in the background
echo "🚀 Starting server..."
PORT=3000 node dist/index.js &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test health endpoint
echo "❤️  Testing health endpoint..."
curl -s http://localhost:3000/health | jq '.' || echo "Health check failed"

# Test users endpoint
echo "👥 Testing users endpoint..."
curl -s http://localhost:3000/api/users | jq '.' || echo "Users endpoint failed"

# Test API docs
echo "📚 Testing API docs..."
curl -s http://localhost:3000/api/docs | jq '.data.title' || echo "API docs failed"

# Stop the server
echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✅ Local testing complete!"

