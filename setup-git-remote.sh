#!/bin/bash

echo "Setting up git repository with remote origin..."

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files
echo "Adding all files to git..."
git add .

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit."
else
    echo "Creating initial commit..."
    git commit -m "feat: initial Hono TypeScript API with comprehensive features

- Add complete Hono API with CRUD operations for users
- Implement Zod validation for all endpoints
- Add comprehensive middleware (CORS, logging, security headers)
- Create multiple deployment configurations (Lambda, ECS, Docker)
- Add comprehensive testing with Vitest
- Include Cursor optimization files (.cursorignore, .cursorrules)
- Add detailed documentation and deployment guides
- Implement proper TypeScript types and error handling
- Add API documentation endpoint
- Include demo script for testing all endpoints

Features:
- User management (create, read, update, delete)
- Search functionality with pagination
- User statistics and analytics
- Health check endpoint
- Comprehensive error handling
- Production-ready configuration"
fi

# Add remote origin
echo "Adding remote origin..."
git remote add origin git@github.com:AndrewAllison/hono-deploy-demo.git

# Check remote configuration
echo "Remote configuration:"
git remote -v

# Set default branch to main
echo "Setting default branch to main..."
git branch -M main

# Push to remote repository
echo "Pushing to remote repository..."
git push -u origin main

echo "Git setup complete!"
