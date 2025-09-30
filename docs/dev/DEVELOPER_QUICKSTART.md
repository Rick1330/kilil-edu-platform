# KILIL Education Platform - Developer Quickstart

## Prerequisites

- **Docker** and Docker Compose (for local infrastructure)
- **Node.js** 20+ with Corepack enabled
- **pnpm** 9+ (managed by Corepack)

## Local Infrastructure Setup

1. Start local infrastructure:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d postgres redis
   ```

2. Check service readiness:
   ```bash
   # Check PostgreSQL
   docker-compose -f infra/docker-compose.yml exec postgres pg_isready -U postgres
   
   # Check Redis
   docker-compose -f infra/docker-compose.yml exec redis redis-cli ping
   ```

## Development Commands

### Install Dependencies
```bash
pnpm install
```

### Run Linting
```bash
pnpm -w lint
```

### Run Type Checking
```bash
pnpm -w typecheck
```

### Run Tests
```bash
pnpm -w test
```

### Build All Projects
```bash
pnpm -w build
```

## Development Servers

### Web Portal (Next.js)
```bash
pnpm --filter @kilil/web-portal dev
```
URL: http://localhost:3000

### BFF Service (NestJS)
```bash
pnpm --filter @kilil/bff dev
```
Health Check: http://localhost:4000/health
GraphQL Endpoint: http://localhost:4000/graphql

Example GraphQL query:
```
{
  hello {
    message
  }
}
```

## Environment Variables

Each service has example environment files:
- BFF: `apps/bff/.env.example`
- Web Portal: `apps/web-portal/.env.local.example`

Copy these to `.env` or `.env.local` files respectively to use them locally.

## Common Issues and Fixes

### Port Conflicts
If you see "port already allocated" errors:
1. Check what's using the ports:
   ```bash
   netstat -ano | findstr :5432
   netstat -ano | findstr :6379
   ```
2. Either stop the conflicting services or modify the ports in `infra/docker-compose.yml`

### pnpm Version Issues
If you see "Unsupported environment" errors:
```bash
npm install -g pnpm@9
```

### BFF Service Not Starting
Make sure all required files are present:
- `apps/bff/src/main.ts`
- `apps/bff/src/app.module.ts`
- `apps/bff/src/health.controller.ts`
- `apps/bff/src/hello.resolver.ts`

## Accessibility Testing

The project includes jest-axe for accessibility testing. Tests are run as part of the normal test suite:
```bash
pnpm --filter @kilil/web-portal test
```