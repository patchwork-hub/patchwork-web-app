# Deployment Guide

This guide covers various deployment strategies for the Channels application, from local development to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### System Requirements

- **Node.js**: 18.x or higher
- **Package Manager**: Yarn (recommended) or npm
- **Memory**: Minimum 2GB RAM for development, 4GB+ for production
- **Storage**: 10GB+ available disk space
- **Network**: HTTPS support for production deployments

### Development Tools

- **Git**: Version control
- **Docker**: For containerized deployments (optional)
- **Docker Compose**: For multi-service deployments (optional)

## ⚙️ Environment Configuration

### Environment Variables

Create a `.env.local` file for local development or set environment variables in your deployment platform:

```bash
# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# API Configuration
NEXT_PUBLIC_API_URL=https://channel.org
NEXT_PUBLIC_DASHBOARD_API_URL=https://dashboard.channel.org

# OAuth Configuration
NEXT_PUBLIC_CLIENT_ID=your_mastodon_client_id
NEXT_PUBLIC_CLIENT_SECRET=your_mastodon_client_secret

# Firebase Configuration (for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.com

# Optional: Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1
```

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Cloud Messaging

2. **Generate VAPID Keys**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login and generate VAPID key
   firebase login
   firebase projects:list
   firebase messaging:generate-vapid-key --project your-project-id
   ```

3. **Configure Service Worker**
   - The `public/firebase-messaging-sw.js` file is already configured
   - Update with your Firebase config if needed

## 🛠️ Local Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/channel-web.git
cd channel-web

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
yarn dev
```

### Development Scripts

```bash
# Start development server with Turbopack
yarn dev

# Start with debugging enabled
yarn dev:debug

# Build for production
yarn build

# Start production server
yarn start

# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Generate test coverage
yarn coverage

# Lint code
yarn lint
```

### Development Features

- **Hot Reload**: Automatic page refresh on file changes
- **Fast Refresh**: React components update without losing state
- **TypeScript**: Real-time type checking
- **Turbopack**: Fast bundling and hot module replacement

## 🐳 Docker Deployment

### Basic Docker Setup

The project includes a production-ready Dockerfile:

```bash
# Build the Docker image
docker build -t channels-web .

# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://your-api.com \
  channels-web
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  channels-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://channel.org
      - NEXT_PUBLIC_CLIENT_ID=${CLIENT_ID}
      - NEXT_PUBLIC_CLIENT_SECRET=${CLIENT_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
  # Optional: Add nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - channels-web
    restart: unless-stopped
```

### Multi-stage Docker Build

The Dockerfile uses multi-stage builds for optimization:

```dockerfile
# Dependencies stage
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Builder stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --force
RUN yarn build

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

## 🚀 Production Deployment

### Build Optimization

```bash
# Install dependencies (production only)
yarn install --production --frozen-lockfile

# Build the application
yarn build

# Start production server
yarn start
```

### Next.js Configuration

Ensure your `next.config.ts` is optimized for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*"
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://your-api-server.com/:path*',
      },
    ];
  },
};

export default nextConfig;
```

### Nginx Configuration

Example nginx configuration for production:

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream channels_app {
        server channels-web:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        location / {
            proxy_pass http://channels_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Cache static assets
        location /_next/static/ {
            proxy_pass http://channels_app;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

## ☁️ Cloud Platforms

### Vercel Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Use Vercel's environment variable encryption for secrets

3. **Deploy**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

### Netlify Deployment

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "yarn build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Environment Variables**
   - Set environment variables in Netlify dashboard

### AWS Deployment

#### Using AWS Amplify

1. **Connect Repository**
   - Connect GitHub repository to AWS Amplify
   - Configure build settings

2. **Build Specification**
   ```yaml
   # amplify.yml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - yarn install --frozen-lockfile
           build:
             commands:
               - yarn build
         artifacts:
           baseDirectory: .next
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```

#### Using EC2 with Docker

1. **Launch EC2 Instance**
   - Choose appropriate instance size (t3.medium or larger)
   - Configure security groups (ports 80, 443, 22)

2. **Install Docker**
   ```bash
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/channel-web.git
   cd channel-web
   
   # Build and run
   docker build -t channels-web .
   docker run -d -p 80:3000 \
     --name channels-app \
     --restart unless-stopped \
     -e NODE_ENV=production \
     channels-web
   ```

### Google Cloud Platform

#### Using Cloud Run

1. **Build Container**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/channels-web
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy channels-web \
     --image gcr.io/PROJECT-ID/channels-web \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Digital Ocean App Platform

1. **Create App Spec**
   ```yaml
   # .do/app.yaml
   name: channels-web
   services:
   - name: web
     source_dir: /
     github:
       repo: your-org/channel-web
       branch: main
     run_command: yarn start
     build_command: yarn build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     env:
     - key: NODE_ENV
       value: "production"
   ```

## 📊 Monitoring & Maintenance

### Health Checks

Create a health check endpoint:

```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
}
```

### Logging

```typescript
// utils/logger.ts
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta,
    }));
  },
};
```

### Performance Monitoring

```typescript
// utils/analytics.ts
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_TRACKING_ID', {
      page_path: url,
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Backup Strategy

1. **Database Backups** (if applicable)
   - Regular automated backups
   - Point-in-time recovery

2. **Static Assets**
   - CDN with multiple regions
   - S3 bucket versioning

3. **Configuration**
   - Environment variables backup
   - Infrastructure as Code (Terraform/CDK)

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
yarn install

# Check Node.js version
node --version  # Should be 18.x or higher
```

#### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" yarn build
```

#### Docker Issues

```bash
# Check Docker logs
docker logs channels-web

# Access container shell
docker exec -it channels-web sh

# Check container resources
docker stats channels-web
```

### Performance Issues

1. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npx @next/bundle-analyzer
   ```

2. **Memory Profiling**
   ```bash
   # Start with memory profiling
   NODE_OPTIONS="--inspect" yarn dev
   ```

3. **Lighthouse Audits**
   - Run regular Lighthouse audits
   - Monitor Core Web Vitals
   - Optimize images and fonts

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] Dependencies updated
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation in place

### Monitoring Checklist

- [ ] Health checks configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] SSL certificate monitoring

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

For questions about deployment or if you encounter issues not covered in this guide, please open an issue on GitHub or reach out to the development team.
