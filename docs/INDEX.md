# KILIL Education Platform - Documentation Index

Welcome to the KILIL Education Platform documentation. This enterprise-grade multi-university platform is designed specifically for Ethiopia's higher education system.

## 📋 Project Overview

**Project Name**: kilil-edu-platform  
**Purpose**: Multi-university, multi-campus platform for Ethiopia (Ministry-grade)  
**Technology Stack**: Nx monorepo, TypeScript, Next.js, NestJS, PostgreSQL, Redis  
**Target Users**: Universities, students, faculty, Ministry of Education  

## 📚 Documentation Structure

### Core Documents
- [**Architecture**](ARCHITECTURE.md) - System design, technical architecture, and implementation strategy
- [**Build Log**](BUILDLOG.md) - Development progress, decisions, risks, and mitigations  
- [**Roadmap**](ROADMAP.md) - 90-day milestones, quarterly goals, and project timeline
- [**Phase 0 Summary**](PHASE0_SUMMARY.md) - Foundation implementation details
- [**Phase 1 Summary**](PHASE1_SUMMARY.md) - Identity & Authentication implementation details
- [**Phase 2 Summary**](PHASE2_SUMMARY.md) - Payments E2E implementation details

### Developer Documentation
- [**Developer Quickstart**](dev/DEVELOPER_QUICKSTART.md) - Getting started guide for developers
- [**Environment Variables**](dev/ENV_VARS.md) - Environment variable reference

### Quick Links
- 🏗️ [Architecture Overview](ARCHITECTURE.md#overview) - High-level system design
- 🔧 [Technology Stack](ARCHITECTURE.md#technology-stack) - Detailed tech specifications  
- 🎯 [First 90 Days](ROADMAP.md#first-90-days-milestones) - Immediate priorities
- ⚠️ [Risk Assessment](BUILDLOG.md#risks-and-mitigations) - Known risks and solutions
- 🇪🇹 [Ethiopia-Specific Features](ARCHITECTURE.md#ethiopia-specific-considerations) - Local requirements

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ with Corepack enabled
- pnpm 9+ (managed by Corepack)
- Docker and Docker Compose
- Git with configured user settings

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd kilil-edu-platform

# Install dependencies
pnpm install

# Start development environment
./scripts/dev-setup.sh

# Run health checks
./scripts/health-check.sh
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Run linting
pnpm -w lint

# Run type checking  
pnpm -w typecheck

# Run tests
pnpm -w test

# Build all projects
pnpm -w build
```

## 🏗️ Project Structure

```
kilil-edu-platform/
├── apps/
│   ├── web-portal/          # Next.js frontend application
│   └── bff/                 # Backend for Frontend (NestJS + GraphQL)
├── services/                # Domain microservices
│   ├── enrollment/          # Student enrollment service
│   ├── billing/             # Billing and invoicing service
│   ├── payments-adapter/    # Payment gateway integration
│   ├── notifications/       # Email/SMS notification service
│   ├── ussd-sms/           # USSD/SMS gateway service
│   └── degree-audit-stub/   # Degree audit service (placeholder)
├── packages/               # Shared libraries
│   ├── i18n/               # Internationalization utilities
│   └── ethiopian-calendar/ # Ethiopian calendar utilities
├── infra/                  # Infrastructure configuration
│   └── docker-compose.yml  # Local development services
├── scripts/                # Development and deployment scripts
├── docs/                   # Additional documentation
└── .github/                # GitHub configuration (workflows, etc.)
```

## 🌍 Ethiopia-Specific Features

### Localization
- **Amharic Language**: Full RTL support with Noto Sans Ethiopic font
- **Ethiopian Calendar**: Built-in EC/GC conversion utilities
- **Currency**: Birr (ETB) support throughout the platform

### Mobile Integration
- **Telebirr**: Ethio Telecom mobile money integration
- **M-Pesa**: Cross-border mobile payment support
- **USSD Fallback**: Low-data connectivity support for rural areas

### Accessibility
- **WCAG 2.2 AA Compliance**: Full accessibility support
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Complete keyboard accessibility

## 🔧 Technology Highlights

### Frontend
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible component library

### Backend  
- **NestJS**: Enterprise-grade Node.js framework
- **Apollo GraphQL**: Flexible API layer
- **Prisma**: Modern database toolkit
- **PostgreSQL**: Robust relational database

### Infrastructure
- **Nx Monorepo**: Efficient code sharing and build optimization
- **Docker**: Containerized development and deployment
- **GitHub Actions**: Automated CI/CD pipeline
- **Redis**: High-performance caching and sessions

## 📊 Monitoring & Observability

### Development
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality control
- **Jest**: Unit testing framework

### Production
- **OpenTelemetry**: Distributed tracing
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **CodeQL**: Security vulnerability scanning

## 🔐 Security Features

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

## 🎉 Phase 1 Complete (2025-10-01). Next: Phase 2 — Payments E2E

### Implementation Preview
1. **Keycloak Integration**: Realm et-univ with web-portal (public, PKCE) and bff (confidential) clients ✅
2. **Role Management**: Student, faculty, staff, advisor, registrar, bursar, librarian, sponsor roles ✅
3. **Shared Auth Package**: Client/server helpers with principal shape definition ✅
4. **OIDC Flow**: Login/logout functionality in web portal with JWT guards in BFF ✅
5. **Protected Resources**: Sample protected GraphQL resolver with role-based access control ✅

## 🎉 Phase 2 Complete (2025-10-02) — Minimal Payments E2E ✅

### Implementation Complete
1. **Payments Adapter Service**: New NestJS service with idempotent `/payments/initiate` endpoint ✅
2. **Webhook Integration**: `/payments/webhooks/:provider` endpoint forwarding to billing service ✅
3. **Billing Service Verification**: Confirmed existing `/internal/payment-received` endpoint is idempotent ✅
4. **BFF GraphQL Extension**: Added `myBilling` query and `initiatePayment` mutation ✅
5. **Web Portal Billing Page**: React/Next.js UI for payment simulation with balance/receipts display ✅
6. **Testing**: Unit tests for payments adapter and integration tests for billing service ✅
7. **Documentation**: Payments reconciliation spec and environment variable updates ✅

## 🎯 Next: Phase 3 — Core Academic Services

### Implementation Plan
1. **Student Enrollment System**: Course registration and academic planning
2. **Course Catalog Management**: University course offerings and scheduling
3. **Academic Calendar Integration**: Ethiopian calendar utilities with GC/EC conversion
4. **Notification System**: Email/SMS communication for students and faculty
5. **Testing**: Comprehensive integration tests with Testcontainers
6. **Documentation**: Academic services specification and API documentation

See [Roadmap](ROADMAP.md) for complete Phase 3 details.

## 🤝 Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Technical Issues**: Create a GitHub issue
- **Security Concerns**: See [SECURITY.md](SECURITY.md) for reporting guidelines
- **General Questions**: Contact the development team

---

**📌 Note**: This is Phase 2 of the KILIL Education Platform. Identity & Authentication and Minimal Payments E2E have been completed with enterprise-grade practices and Ethiopia-specific requirements. 

**Next Step**: Proceed to Phase 3 (Core Academic Services) implementation.

**Last Updated**: 2025-10-02  
**Version**: 0.3.0 (Phase 2 Complete)