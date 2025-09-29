# KILIL Education Platform

[![CI](https://github.com/rick1330/kilil-edu-platform/workflows/ci/badge.svg)](https://github.com/rick1330/kilil-edu-platform/actions)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue.svg)](https://www.typescriptlang.org/)

> **Multi-university, multi-campus platform for Ethiopia (Ministry-grade)**

## 🌍 Overview

KILIL is an enterprise-grade education platform designed specifically for Ethiopia's higher education system. Built with modern technologies and Ethiopia-specific requirements, it enables multiple universities to operate on a shared infrastructure while maintaining data isolation and compliance.

### ✨ Key Features

- **🇪🇹 Ethiopia-First Design**: Amharic language support, Ethiopian calendar integration, and local payment systems
- **🏫 Multi-Tenant Architecture**: Support for multiple universities with complete data isolation
- **📱 Mobile-First**: Progressive Web App with USSD/SMS fallback for low-connectivity areas
- **🔒 Enterprise Security**: OIDC/SAML authentication, RBAC, and comprehensive audit logging
- **💳 Integrated Payments**: Telebirr and M-Pesa mobile money integration
- **♿ Accessibility**: WCAG 2.2 AA compliant with full keyboard navigation

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    KILIL Platform Architecture                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web       │  │     BFF     │  │   Domain    │            │
│  │  Portal     │◄─┤  (GraphQL)  ├─►│  Services   │            │
│  │ (Next.js)   │  │   (NestJS)  │  │  (NestJS)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Data Layer (PostgreSQL + Redis)                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ with Corepack enabled
- **pnpm** 9+ (managed by Corepack)
- **Docker** and Docker Compose
- **Git** with configured user settings

### Installation

```bash
# Clone the repository
git clone https://github.com/rick1330/kilil-edu-platform.git
cd kilil-edu-platform

# Install dependencies
pnpm install

# Start development environment
./scripts/dev-setup.sh

# Start all services
pnpm dev
```

### Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Build all projects
pnpm build

# Run health checks
./scripts/health-check.sh
```

## 📁 Project Structure

```
kilil-edu-platform/
├── apps/
│   ├── web-portal/          # Next.js frontend application
│   └── bff/                 # Backend for Frontend (GraphQL)
├── services/                # Domain microservices
│   ├── enrollment/          # Student enrollment service
│   ├── billing/             # Billing and invoicing service
│   ├── payments-adapter/    # Payment gateway integration
│   ├── notifications/       # Email/SMS notification service
│   ├── ussd-sms/           # USSD/SMS gateway service
│   └── degree-audit-stub/   # Degree audit service
├── packages/               # Shared libraries
│   ├── i18n/               # Internationalization utilities
│   └── ethiopian-calendar/ # Ethiopian calendar utilities
├── infra/                  # Infrastructure configuration
├── scripts/                # Development and deployment scripts
└── docs/                   # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **next-intl** - Internationalization
- **Noto Sans Ethiopic** - Amharic font support

### Backend
- **NestJS** - Enterprise Node.js framework
- **Apollo GraphQL** - GraphQL server
- **Prisma** - Modern database toolkit
- **PostgreSQL 15** - Relational database
- **Redis 7** - Caching and sessions

### Infrastructure
- **Nx Monorepo** - Efficient code sharing and builds
- **Docker** - Containerized deployment
- **GitHub Actions** - CI/CD pipeline
- **pnpm** - Fast, disk-space efficient package manager

## 🇪🇹 Ethiopia-Specific Features

### Localization
- **Amharic Language**: Full RTL support with native typography
- **Ethiopian Calendar**: Built-in EC/GC conversion utilities
- **Currency**: Birr (ETB) support throughout the platform

### Mobile Integration
- **Telebirr**: Ethio Telecom mobile money integration
- **M-Pesa**: Cross-border mobile payment support
- **USSD Fallback**: Low-data connectivity support for rural areas

### Academic Calendar
- **Ethiopian Academic Year**: September to August cycle
- **Semester System**: Two main semesters plus summer
- **Holiday Integration**: Ethiopian national holidays

## 🔐 Security

### Authentication & Authorization
- **Keycloak Integration**: OIDC/SAML support
- **Multi-Factor Authentication**: SMS-based 2FA
- **Role-Based Access Control**: University-specific permissions
- **Audit Logging**: Comprehensive access tracking

### Data Protection
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **Row-Level Security**: PostgreSQL RLS for multi-tenancy
- **Regular Security Audits**: Automated vulnerability scanning

## 📊 Monitoring & Observability

### Development
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control
- **Jest**: Unit testing framework
- **jest-axe**: Accessibility testing

### Production
- **OpenTelemetry**: Distributed tracing
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **CodeQL**: Security vulnerability scanning

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in CI mode
pnpm test:ci

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch

# Run specific project tests
nx test web-portal
nx test bff
```

## 📱 Mobile Support

### Progressive Web App
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Service worker implementation
- **Push Notifications**: Real-time updates
- **App-like Experience**: Native app feel

### USSD/SMS Integration
- **Low-Bandwidth Support**: Text-based interface
- **Feature Phone Compatibility**: Basic mobile phone support
- **Offline Capability**: No internet required for basic functions
- **Local Language Support**: Amharic USSD menus

## 🤝 Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Documentation

- [**Architecture**](docs/ARCHITECTURE.md) - System design and technical architecture
- [**Build Log**](docs/BUILDLOG.md) - Development progress and decisions
- [**Roadmap**](docs/ROADMAP.md) - Project timeline and milestones
- [**API Documentation**](docs/API.md) - API specifications and examples
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment instructions

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethiopian Ministry of Education** - For their guidance and requirements
- **Ethio Telecom** - For Telebirr integration support
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has contributed to this project

## 📞 Support

- **Technical Issues**: [Create GitHub Issue](https://github.com/rick1330/kilil-edu-platform/issues)
- **Security Concerns**: See [SECURITY.md](SECURITY.md) for reporting guidelines
- **General Questions**: Contact the development team

---

<div align="center">
  <p><strong>KILIL Education Platform</strong> - Empowering Ethiopian Higher Education</p>
  <p>
    <a href="https://github.com/rick1330/kilil-edu-platform">GitHub</a> • 
    <a href="docs/ARCHITECTURE.md">Architecture</a> • 
    <a href="docs/ROADMAP.md">Roadmap</a>
  </p>
</div>