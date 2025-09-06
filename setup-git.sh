#!/bin/bash

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
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

# Show git status
git status

# Show commit log
git log --oneline
