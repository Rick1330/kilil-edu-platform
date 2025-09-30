# KILIL Education Platform - Architecture

## Overview

KILIL is a multi-university, multi-campus education platform designed for Ethiopia's higher education system. The platform supports multiple universities with shared infrastructure while maintaining data isolation and compliance with Ethiopian education standards.

## System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                    Ministry of Education                        │
│                    Regulatory Compliance                        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                  KILIL Platform                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    API Gateway (BFF)                        │ │
│  │                  GraphQL + REST Hybrid                      │ │
│  └─────────────────────┬───────────────────────────────────────┘ │
│                        │                                       │
│  ┌─────────────────────▼───────────────────────────────────────┐ │
│  │                  Domain Services                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │ Enrollment  │  │  Billing    │  │  Payments   │        │ │
│  │  │  Service    │  │  Service    │  │  Adapter    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │Notification │  │  USSD/SMS   │  │Degree Audit │        │ │
│  │  │  Service    │  │  Service    │  │   Stub      │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────┬───────────────────────────────────────┘ │
│                        │                                       │
│  ┌─────────────────────▼───────────────────────────────────────┐ │
│  │                   Data Layer                                 │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │ PostgreSQL  │  │    Redis    │  │  Prisma     │        │ │
│  │  │   (Multi-   │  │   (Cache/   │  │  (ORM)      │        │ │
│  │  │  Tenant)    │  │  Session)   │  │             │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                   External Systems                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Telebirr    │  │   M-Pesa    │  │  SMS/USSD   │            │
│  │ Mobile Money│  │ Mobile Money│  │ Aggregator  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Current Implementation Status

- [x] Nx monorepo scaffolded
- [x] Web portal shell (Next.js 14, Tailwind, shadcn/ui, next‑intl, Noto Sans Ethiopic)
- [x] BFF (NestJS) boots with /health and GraphQL hello
- [x] Service stubs present (enrollment, billing, payments‑adapter, notifications, ussd‑sms, degree‑audit‑stub)
- [x] Local infra: Postgres 15, Redis 7 (docker-compose)
- [x] CI: Node 20 + Corepack pnpm 9; Postgres/Redis services; non‑blocking scans; CodeQL
- [x] Env examples for web and bff
- [x] Basic a11y test wired (jest-axe)

## Container Diagram (Level 2)

### Web Portal Container
```
┌─────────────────────────────────────────────────────────────┐
│                    Web Portal (Next.js)                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Presentation Layer                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │   Header    │  │Navigation   │  │   Footer    │    │ │
│  │  │(Amharic/En) │  │(Responsive) │  │             │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │              Main Content Area                   │   │ │
│  │  │  ┌─────────────┐  ┌─────────────┐              │   │ │
│  │  │  │  Dashboard  │  │ Course List │              │   │ │
│  │  │  │   Widgets   │  │   (Cards)   │              │   │ │
│  │  │  └─────────────┘  └─────────────┘              │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Infrastructure                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │   next-intl │  │Tailwind CSS │  │shadcn/ui    │    │ │
│  │  │(i18n)       │  │(Styling)    │  │(Components) │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### BFF (Backend for Frontend) Container
```
┌─────────────────────────────────────────────────────────────┐
│                      BFF Service                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   API Layer                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │ GraphQL     │  │   REST      │  │WebSocket    │    │ │
│  │  │  Endpoint   │  │  Fallback   │  │(Real-time)  │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                Service Mesh                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │   Service   │  │   Service   │  │   Service   │    │ │
│  │  │ Discovery   │  │  Registry   │  │   Mesh      │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Health Check                          │ │
│  │  ┌─────────────┐                                        │ │
│  │  │ /health     │                                        │ │
│  │  └─────────────┘                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                    Trust Boundary: Browser                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Web Portal (Next.js)                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTPS/TLS
┌─────────────────▼───────────────────────────────────────────────┐
│              Trust Boundary: BFF/API Layer                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      BFF Service                            │ │
│  │  ┌─────────────┐  ┌─────────────┐                          │ │
│  │  │ GraphQL     │  │JWT Guards   │                          │ │
│  │  │  Endpoint   │  │(Phase 1)    │                          │ │
│  │  └─────────────┘  └─────────────┘                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────────────┘
                  │ Internal Network (mTLS planned)
┌─────────────────▼───────────────────────────────────────────────┐
│           Trust Boundary: Service Mesh (Future)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Enrollment  │  │  Billing    │  │  Payments   │            │
│  │  Service    │  │  Service    │  │  Adapter    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Notification │  │  USSD/SMS   │  │Degree Audit │            │
│  │  Service    │  │  Service    │  │   Stub      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│              Trust Boundary: Data Stores                        │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ PostgreSQL  │  │    Redis    │                              │
│  │   (Multi-   │  │   (Cache/   │                              │
│  │  Tenant)    │  │  Session)   │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

## Multi-Tenancy Strategy

### Shared Schema with Row Level Security (RLS)
- **Tenant Identification**: Each record includes `tenant_id` and `campus_id`
- **PostgreSQL RLS**: Policies enforce data isolation at database level
- **Application Enforcement**: Services always include tenant context in queries

### Tenant Context Flow
```
User Request → Authentication → Tenant Resolution → Service Layer → Database (RLS)
```

## Domain-Driven Design (DDD) Boundaries

### Core Domains
1. **Enrollment Management**
   - Student registration and course enrollment
   - Academic period management
   - Prerequisite validation

2. **Financial Management**
   - Billing and invoicing
   - Payment processing
   - Financial reporting

3. **Communication Hub**
   - Notification delivery
   - SMS/USSD integration
   - Multi-channel messaging

4. **Academic Records**
   - Degree audit and tracking
   - Transcript generation
   - Academic history

## API Strategy

### GraphQL at BFF Layer
- **Client-Facing**: Single endpoint for all client requests
- **Schema Federation**: Combine multiple service schemas
- **Performance**: Query optimization and caching
- **Current Status**: Hello world endpoint operational at /graphql

### REST for Internal Communication
- **Service-to-Service**: Standard REST APIs
- **Webhook Support**: Event-driven integrations
- **Documentation**: OpenAPI/Swagger specs

## Data Architecture

### PostgreSQL 15 (Multi-Tenant)
- **Shared Database**: Cost-effective for Ethiopian universities
- **Schema Design**: Normalized academic data model
- **Performance**: Indexed on tenant_id, campus_id
- **Backup**: Point-in-time recovery enabled

### Redis 7 (Caching & Sessions)
- **Session Storage**: User authentication sessions
- **Cache Layer**: API response caching
- **Rate Limiting**: API throttling per tenant

## Security Posture

### Identity & Access Management
- **Keycloak Integration**: OIDC/SAML support
- **Multi-Factor Authentication**: SMS-based 2FA
- **Role-Based Access**: University-specific roles

### Data Protection
- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **Audit Logging**: Comprehensive access logs

## Ethiopia-Specific Considerations

### Localization
- **Amharic Support**: Full RTL language support
- **Ethiopian Calendar**: EC/GC conversion utilities
- **Currency**: Birr (ETB) support

### Mobile Integration
- **Telebirr Integration**: Mobile money payments
- **M-Pesa Support**: Cross-border mobile payments
- **USSD Fallback**: Low-data connectivity support

### Regulatory Compliance
- **Data Residency**: Ethiopian data sovereignty
- **Ministry Integration**: MoE reporting requirements
- **Academic Standards**: Ethiopian higher education framework

## Observability Plan

### Monitoring Stack
- **OpenTelemetry**: Distributed tracing
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Loki**: Log aggregation
- **Tempo**: Trace storage

### Key Metrics
- **Performance**: Response times, throughput
- **Business**: Enrollment rates, payment success
- **Infrastructure**: Resource utilization, errors

## Event-Driven Architecture

### Event Taxonomy (Placeholder)
- **Domain Events**: EnrollmentCompleted, PaymentProcessed
- **Integration Events**: StudentRegistered, CourseCompleted
- **System Events**: ServiceHealthCheck, ConfigurationChanged

## Non-Functional Requirements

### Performance
- **Response Time**: < 200ms for critical operations
- **Throughput**: Support 10,000 concurrent users
- **Availability**: 99.9% uptime SLA

### Scalability
- **Horizontal Scaling**: Container-based deployment
- **Database Sharding**: By university/region
- **CDN Integration**: Static asset delivery

### Accessibility
- **WCAG 2.2 AA Compliance**: Full accessibility support
- **Screen Reader Support**: Semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Internationalization**: next-intl
- **Typography**: Noto Sans Ethiopic

### Backend
- **Framework**: NestJS
- **API**: Apollo GraphQL + REST
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7

### Development
- **Monorepo**: Nx
- **Package Manager**: pnpm 9
- **Language**: TypeScript
- **Testing**: Jest, Playwright, jest-axe

## Deployment Strategy

### Container-Based
- **Docker**: All services containerized
- **Orchestration**: Kubernetes-ready
- **Environment**: Development, Staging, Production

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Code Quality**: ESLint, Prettier, TypeScript
- **Security**: CodeQL, dependency scanning
- **Testing**: Unit, integration, e2e tests

## Phase 1 Preview: Identity & Auth

- Keycloak realm et‑univ; clients: web‑portal (public, PKCE), bff (confidential)
- Roles: student, faculty, staff, advisor, registrar, bursar, librarian, sponsor
- packages/shared-auth helpers
- OIDC login/logout (web); JWT guards (BFF/services)
- Protected resolver example + simple role check
