# Hono TypeScript API Demo

A comprehensive Hono TypeScript project demonstrating best practices for API development and multiple deployment strategies. This project showcases how to build a modern, scalable API using Hono with TypeScript, and deploy it across various platforms including AWS Lambda, ECS, and traditional servers.

## 🚀 Features

- **Modern TypeScript API** built with Hono framework
- **Comprehensive validation** using Zod schemas
- **Multiple deployment options** (Lambda, ECS, Docker)
- **Production-ready** with proper error handling, logging, and security
- **Well-tested** with comprehensive test coverage
- **Cursor-optimized** with proper configuration for AI assistance
- **Performance optimized** with proper middleware and caching

## 📁 Project Structure

```
hono-deploy/
├── src/
│   ├── routes/           # API route handlers
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── index.ts         # Main application entry point
│   └── lambda.ts        # AWS Lambda handler
├── deployment/          # Deployment configurations
│   ├── Dockerfile       # Docker configuration
│   ├── serverless.yml   # Serverless Framework config
│   ├── cdk-stack.ts     # AWS CDK ECS stack
│   └── cdk-app.ts       # CDK application
├── .cursorignore        # Cursor ignore patterns
├── .cursorrules         # Cursor AI rules
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Hono 4.6.3
- **Language**: TypeScript 5.7.2
- **Validation**: Zod 3.23.8
- **Testing**: Vitest 2.1.8
- **Linting**: ESLint 9.17.0
- **Package Manager**: pnpm (preferred)
- **Build Tool**: esbuild 0.24.2

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm
- Docker (for containerized deployment)
- AWS CLI (for AWS deployments)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd hono-deploy
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Build for production:**
   ```bash
   pnpm build
   ```

4. **Run tests:**
   ```bash
   pnpm test
   ```

5. **Run linting:**
   ```bash
   pnpm lint
   ```

## 📚 API Documentation

The API provides comprehensive endpoints for user management:

### Base URL
- Development: `http://localhost:3000`
- Production: Depends on deployment platform

### Endpoints

#### Health Check
- **GET** `/health` - Service health status

#### Users API
- **GET** `/api/users` - Get all users (with pagination)
- **GET** `/api/users/search` - Search users by name or email
- **GET** `/api/users/stats` - Get user statistics
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

#### API Documentation
- **GET** `/api/docs` - Interactive API documentation

### Example Usage

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users?page=1&limit=10

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'

# Search users
curl http://localhost:3000/api/users/search?q=John

# Get user statistics
curl http://localhost:3000/api/users/stats
```

## 🚀 Deployment Options

### 1. AWS Lambda (Serverless)

Deploy using Serverless Framework:

```bash
# Install Serverless Framework
npm install -g serverless serverless-esbuild

# Deploy to AWS
pnpm run deploy:lambda
```

**Benefits:**
- Pay-per-request pricing
- Automatic scaling
- No server management
- Built-in monitoring

### 2. AWS ECS with Fargate (Containerized)

Deploy using AWS CDK:

```bash
# Install CDK
npm install -g aws-cdk

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy ECS stack
cd deployment
cdk deploy
```

**Benefits:**
- Container-based deployment
- Managed infrastructure
- Auto-scaling capabilities
- Load balancing included

### 3. Docker (Any Platform)

Build and run with Docker:

```bash
# Build image
docker build -f deployment/Dockerfile -t hono-demo .

# Run container
docker run -p 3000:3000 hono-demo
```

**Benefits:**
- Platform agnostic
- Consistent environment
- Easy local development
- Can deploy anywhere

### 4. Traditional Server

Run directly on a server:

```bash
# Build the application
pnpm run build

# Start the server
pnpm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `CORS_ORIGIN` | `*` | CORS allowed origins |
| `RATE_LIMIT_WINDOW` | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `LOG_LEVEL` | `info` | Logging level |

### Cursor Configuration

This project is optimized for Cursor AI with:

- **`.cursorignore`** - Excludes unnecessary files from AI indexing
- **`.cursorrules`** - Provides context and coding standards
- **Well-documented code** - Helps AI understand the codebase
- **TypeScript types** - Improves AI suggestions and error detection

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test --watch
```

### Test Structure

- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **Mocked dependencies** for isolated testing
- **High coverage** requirements (80%+)

## 📊 Performance & Monitoring

### Built-in Features

- **Request logging** with structured data
- **Rate limiting** to prevent abuse
- **CORS protection** for security
- **Health checks** for monitoring
- **Error handling** with proper HTTP status codes

### Production Considerations

- **Database integration** (replace in-memory storage)
- **Caching layer** (Redis recommended)
- **Monitoring** (CloudWatch, DataDog, etc.)
- **Log aggregation** (ELK stack, Splunk, etc.)
- **Security scanning** (SAST, DAST tools)

## 🔒 Security

### Implemented Security Features

- **Input validation** with Zod schemas
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Security headers** via Hono middleware
- **Error sanitization** in production

### Additional Recommendations

- **Authentication** (JWT, OAuth2, etc.)
- **Authorization** (RBAC, ABAC)
- **HTTPS enforcement** in production
- **API key management** for external access
- **Audit logging** for compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Use conventional commits
- Maintain code coverage above 80%

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - The amazing web framework
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Vitest](https://vitest.dev/) - Fast unit testing framework
- [AWS CDK](https://aws.amazon.com/cdk/) - Infrastructure as code
- [Serverless Framework](https://www.serverless.com/) - Serverless deployment

## 📞 Support

For questions or issues:

1. Check the [API documentation](http://localhost:3000/api/docs)
2. Review the [test files](src/routes/users.test.ts)
3. Open an issue on GitHub
4. Check the [Hono documentation](https://hono.dev/)

---

**Happy coding! 🚀**
