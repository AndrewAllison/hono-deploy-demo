# Deployment Guide

This guide covers multiple deployment strategies for the Hono TypeScript API, from serverless to containerized solutions.

## 🚀 Deployment Options Overview

| Platform | Type | Best For | Cost | Complexity |
|----------|------|----------|------|------------|
| AWS Lambda | Serverless | Variable traffic, cost optimization | Pay-per-request | Low |
| AWS ECS Fargate | Container | Consistent traffic, microservices | Pay-per-resource | Medium |
| Docker | Container | Any platform, hybrid cloud | Infrastructure dependent | Low |
| Traditional Server | VM/Bare Metal | Full control, legacy systems | Fixed cost | High |

## 📋 Prerequisites

### Required Tools
- Node.js 20+
- pnpm (recommended) or npm
- Docker (for containerized deployments)
- AWS CLI (for AWS deployments)
- Git

### AWS Prerequisites
- AWS Account
- AWS CLI configured with appropriate permissions
- CDK Bootstrap (for ECS deployment)

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
# Install project dependencies
pnpm install

# Install global tools (if not already installed)
npm install -g aws-cdk serverless
```

### 2. Environment Variables

Create a `.env` file for local development:

```bash
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=*
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

## 🚀 Deployment Methods

### 1. AWS Lambda (Serverless)

**Best for:** Variable traffic, cost optimization, event-driven applications

#### Setup

1. **Configure AWS CLI:**
   ```bash
   aws configure
   ```

2. **Install Serverless Framework:**
   ```bash
   npm install -g serverless serverless-esbuild
   ```

3. **Deploy:**
   ```bash
   pnpm run deploy:lambda
   ```

#### Configuration

The `deployment/serverless.yml` file contains:
- Lambda function configuration
- API Gateway setup
- Environment variables
- IAM permissions

#### Benefits
- ✅ Pay-per-request pricing
- ✅ Automatic scaling
- ✅ No server management
- ✅ Built-in monitoring
- ✅ Cold start optimization

#### Limitations
- ❌ Cold start latency
- ❌ 15-minute execution limit
- ❌ Limited file system access
- ❌ Vendor lock-in

### 2. AWS ECS with Fargate (Containerized)

**Best for:** Consistent traffic, microservices, containerized workloads

#### Setup

1. **Bootstrap CDK (first time only):**
   ```bash
   cdk bootstrap
   ```

2. **Deploy ECS stack:**
   ```bash
   cd deployment
   cdk deploy
   ```

#### Configuration

The CDK stack (`deployment/cdk-stack.ts`) creates:
- VPC with public/private subnets
- ECS Fargate cluster
- Application Load Balancer
- CloudWatch logging
- Auto-scaling configuration

#### Benefits
- ✅ Container-based deployment
- ✅ Managed infrastructure
- ✅ Auto-scaling capabilities
- ✅ Load balancing included
- ✅ Health checks
- ✅ Rolling deployments

#### Limitations
- ❌ Higher cost for low traffic
- ❌ More complex setup
- ❌ AWS-specific

### 3. Docker (Any Platform)

**Best for:** Multi-cloud, hybrid environments, consistent deployments

#### Setup

1. **Build Docker image:**
   ```bash
   docker build -f deployment/Dockerfile -t hono-demo .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 hono-demo
   ```

#### Docker Compose

Create `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: deployment/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Benefits
- ✅ Platform agnostic
- ✅ Consistent environment
- ✅ Easy local development
- ✅ Can deploy anywhere
- ✅ Version control for infrastructure

#### Limitations
- ❌ Requires container orchestration
- ❌ Additional complexity
- ❌ Resource overhead

### 4. Traditional Server

**Best for:** Full control, legacy systems, specific requirements

#### Setup

1. **Build application:**
   ```bash
   pnpm run build
   ```

2. **Start server:**
   ```bash
   pnpm start
   ```

#### Process Management

Use PM2 for production:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/index.js --name "hono-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Benefits
- ✅ Full control
- ✅ No vendor lock-in
- ✅ Custom configurations
- ✅ Direct server access

#### Limitations
- ❌ Manual scaling
- ❌ Server management
- ❌ No built-in monitoring
- ❌ Higher operational overhead

## 🔍 Monitoring and Observability

### Built-in Features

All deployments include:
- Health check endpoint (`/health`)
- Structured logging
- Error tracking
- Request/response logging

### AWS CloudWatch (Lambda/ECS)

- Automatic log collection
- Metrics and alarms
- Distributed tracing
- Performance insights

### Custom Monitoring

Add monitoring tools:
- **APM**: New Relic, DataDog, AppDynamics
- **Logs**: ELK Stack, Splunk, Fluentd
- **Metrics**: Prometheus, Grafana
- **Tracing**: Jaeger, Zipkin

## 🔒 Security Considerations

### Production Security

1. **Environment Variables:**
   - Use AWS Secrets Manager
   - Encrypt sensitive data
   - Rotate credentials regularly

2. **Network Security:**
   - VPC configuration (ECS)
   - Security groups
   - WAF rules

3. **Application Security:**
   - Input validation
   - Rate limiting
   - CORS configuration
   - HTTPS enforcement

4. **Infrastructure Security:**
   - IAM roles and policies
   - Least privilege access
   - Regular security updates

## 📊 Performance Optimization

### Lambda Optimization

- **Cold Start Reduction:**
  - Provisioned concurrency
  - Optimized bundle size
  - Connection pooling

- **Memory Configuration:**
  - Right-size memory allocation
  - Monitor performance metrics

### ECS Optimization

- **Resource Allocation:**
  - CPU and memory tuning
  - Auto-scaling policies
  - Load balancer configuration

- **Container Optimization:**
  - Multi-stage builds
  - Layer caching
  - Image size reduction

### General Optimization

- **Caching:**
  - Redis for session storage
  - CDN for static assets
  - Application-level caching

- **Database:**
  - Connection pooling
  - Query optimization
  - Read replicas

## 🚨 Troubleshooting

### Common Issues

1. **Lambda Cold Starts:**
   - Use provisioned concurrency
   - Optimize bundle size
   - Implement warming strategies

2. **ECS Service Issues:**
   - Check task definition
   - Verify security groups
   - Review CloudWatch logs

3. **Docker Issues:**
   - Check container logs
   - Verify port mappings
   - Ensure proper networking

4. **General Issues:**
   - Check environment variables
   - Verify dependencies
   - Review error logs

### Debugging Commands

```bash
# Check application logs
docker logs <container-id>

# Test health endpoint
curl http://localhost:3000/health

# Check AWS resources
aws ecs list-services --cluster hono-cluster
aws lambda list-functions

# Monitor performance
docker stats
```

## 📈 Scaling Strategies

### Horizontal Scaling

- **Lambda:** Automatic scaling
- **ECS:** Auto-scaling groups
- **Docker:** Container orchestration (Kubernetes)

### Vertical Scaling

- **Lambda:** Increase memory allocation
- **ECS:** Increase task resources
- **Docker:** Increase container resources

### Database Scaling

- **Read Replicas:** For read-heavy workloads
- **Sharding:** For large datasets
- **Caching:** For frequently accessed data

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      - name: Deploy to AWS
        run: pnpm run deploy:lambda
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📚 Additional Resources

- [Hono Documentation](https://hono.dev/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Serverless Framework](https://www.serverless.com/framework/docs/)
- [AWS CDK](https://docs.aws.amazon.com/cdk/)

---

**Happy Deploying! 🚀**
