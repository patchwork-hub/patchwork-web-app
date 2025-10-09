# Patchwork Web App

![Build Status](https://github.com/patchwork-hub/patchwork-web-app/workflows/CI/badge.svg)
![CodeQL](https://github.com/patchwork-hub/patchwork-web-app/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Tests](https://github.com/patchwork-hub/patchwork-web-app/workflows/Tests/badge.svg)
![License](https://img.shields.io/github/license/patchwork-hub/patchwork-web-app)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

**A revolutionary social media platform built on Mastodon's open-source foundation, designed to empower communities and organizations with their own branded social media experience.**

---

## 🌟 What is Patchwork?

Patchwork is a powerful, white-label social media app that puts control back in the hands of communities. Built around your content and community, Patchwork connects you with a global movement working for positive social change.

### ✨ Key Features

- 🚀 **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS v4
- ⚡ **Lightning Fast**: Turbopack for instant development builds
- 🔒 **Security First**: CodeQL scanning, automated security updates
- 🌍 **Global Ready**: Multi-language support (8 languages)
- 🔗 **Federated**: Connect with Mastodon, Pixelfed, Bluesky, and more
- 🧪 **Well Tested**: Comprehensive test suite with 39+ tests

---

## 📋 Prerequisites

This project requires three main components to be set up:

1. **Mastodon Instance** - The federated social network backend
2. **Patchwork Dashboard** - Admin dashboard for managing the platform
3. **Patchwork Web App** - This frontend application

### **System Requirements**
- **Node.js** 18.x or 20.x
- **Package Manager**: npm, yarn, or pnpm
- **Docker** (for Patchwork Dashboard)
- **Git** for version control

---

## 🚀 Complete Setup Guide

### **Step 1: Set Up Mastodon Instance**

Patchwork requires a Mastodon instance as the backend. You have two options:

#### **Option A: Use Existing Mastodon Instance**
- Use a public instance like `mastodon.social` or `channel.org`
- Create an account and proceed to OAuth setup

#### **Option B: Self-Host Mastodon (Recommended for Production)**

Follow the official Mastodon documentation:

```bash
# Follow the complete installation guide
# https://docs.joinmastodon.org/admin/install/
```

**Key steps:**
1. **Server Setup**: Ubuntu 22.04 LTS with at least 2GB RAM
2. **Dependencies**: Install Ruby, Node.js, PostgreSQL, Redis, Nginx
3. **Mastodon Installation**: Clone and configure Mastodon
4. **Domain Configuration**: Set up SSL certificates
5. **Admin Account**: Create initial admin user

**📖 Official Guide**: [Mastodon Installation Documentation](https://docs.joinmastodon.org/admin/install/)

### **Step 2: Set Up Patchwork Dashboard**

The Patchwork Dashboard provides admin functionality for managing your platform.

#### **Using Docker (Recommended)**

```bash
# Pull the latest Patchwork Dashboard image
docker pull patchworkhub/patchwork-dashboard:latest

# Run the dashboard container
docker run -d \
  --name patchwork-dashboard \
  -p 8080:80 \
  -e API_URL=https://your-mastodon-instance.com \
  -e DASHBOARD_SECRET=your-secret-key \
  patchworkhub/patchwork-dashboard:latest
```

**📖 Dashboard Repository**: [patchwork-hub/patchwork_dashboard](https://github.com/patchwork-hub/patchwork_dashboard)

### **Step 3: Configure OAuth Application**

Create an OAuth application in your Mastodon instance:

1. **Log in** to your Mastodon instance
2. **Go to**: Preferences → Development → New Application
3. **Configure**:
   - **Application name**: `Patchwork Web App`
   - **Website**: `https://your-domain.com`
   - **Redirect URI**: `https://your-domain.com/auth/sign-in`
   - **Scopes**: `read write follow push`
4. **Save** and note the **Client ID** and **Client Secret**

### **Step 4: Set Up Patchwork Web App**

#### **Development Setup**

```bash
# Clone this repository
git clone https://github.com/patchwork-hub/patchwork-web-app.git
cd patchwork-web-app

# Install dependencies (choose one)
npm install
# or
yarn install
# or
pnpm install

# Copy environment template
cp .env.sample .env.local

# Edit environment variables (see configuration below)
nano .env.local

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

#### **Production Setup**

```bash
# Clone and install
git clone https://github.com/patchwork-hub/patchwork-web-app.git
cd patchwork-web-app

# Install dependencies
npm ci --production
# or
yarn install --production
# or
pnpm install --production

# Copy and configure environment
cp .env.sample .env
nano .env

# Build the application
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm start
# or
yarn start
# or
pnpm start
```

---

## ⚙️ Environment Configuration

### **Required Environment Variables**

Copy the sample environment file:

```bash
cp .env.sample .env.local  # For development
# or
cp .env.sample .env        # For production
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` / `yarn dev` / `pnpm dev` | Start development server |
| `npm run build` / `yarn build` / `pnpm build` | Build for production |
| `npm start` / `yarn start` / `pnpm start` | Start production server |
| `npm run lint` / `yarn lint` / `pnpm lint` | Run ESLint |
| `npm test` / `yarn test` / `pnpm test` | Run test suite |
| `npm run type-check` / `yarn type-check` / `pnpm type-check` | TypeScript checking |

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Patchwork      │    │    Mastodon      │    │   Patchwork     │
│  Web App        │◄──►│    Instance      │◄──►│   Dashboard     │
│  (Frontend)     │    │   (Backend)      │    │   (Admin)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

- **Patchwork Web App**: Next.js frontend application (this repository)
- **Mastodon Instance**: Federated social network backend
- **Patchwork Dashboard**: Admin interface for platform management

---

## 🔧 Deployment

### **Development**
```bash
# Start all services locally
npm run dev        # Web app on :3000
# Mastodon on :3000 (if self-hosted)
# Dashboard on :8080
```

### **Production**

#### **Option 1: Vercel (Recommended for Web App)**
```bash
npm i -g vercel
vercel --prod
```

#### **Option 2: Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  web-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  
  dashboard:
    image: patchworkhub/patchwork-dashboard:latest
    ports:
      - "8080:80"
```

#### **Option 3: Manual Deployment**
```bash
# Build and deploy manually
npm run build
npm start
```

---

## 🧪 Testing

```bash
# Run all tests
npm test
# or
yarn test
# or
pnpm test

# Run tests with ui
npm run test:ui
# or
yarn test:ui
# or
pnpm test:ui
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📄 License

Patchwork is an open source project, licensed under AGPL-3.0. Have fun!

---

## 🙏 Acknowledgments

- **Mastodon**: For the federated social network foundation
- **Next.js Team**: For the incredible React framework
- **Open Source Community**: For the amazing tools and libraries

---

<div align="center">

**Built with ❤️ by the Patchwork Community**

[Website](https://patchwork.app) • [Dashboard Repo](https://github.com/patchwork-hub/patchwork_dashboard) • [Documentation](./docs/) • [Community](https://github.com/patchwork-hub/patchwork-web-app/discussions)

</div>
