# KILIL Education Platform - Developer Quickstart

## Prerequisites

- **Docker** and Docker Compose (for local infrastructure)
- **Node.js** 20+ with Corepack enabled
- **pnpm** 9+ (managed by Corepack)

## Local Infrastructure Setup

1. Start local infrastructure:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d keycloak postgres redis
   ```

2. Check service readiness:
   ```bash
   # Check Keycloak
   docker-compose -f infra/docker-compose.yml exec keycloak curl -fsS http://localhost:8080/realms/et-univ/.well-known/openid-configuration
   
   # Check PostgreSQL
   docker-compose -f infra/docker-compose.yml exec postgres pg_isready -U postgres
   
   # Check Redis
   docker-compose -f infra/docker-compose.yml exec redis redis-cli ping
   ```

3. Access Keycloak admin console:
   - URL: http://localhost:8080/admin
   - Realm: et-univ
   - Admin credentials: admin/admin (dev only)
   - Optional: Change client secrets in the web-portal and bff clients

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

To test authentication:
1. Navigate to http://localhost:3000/api/auth/signin
2. Login with test user: sara / Passw0rd!
3. Visit the protected page at http://localhost:3000/protected

### BFF Service (NestJS)
```bash
pnpm --filter @kilil/bff dev
```
Health Check: http://localhost:4000/health
GraphQL Endpoint: http://localhost:4000/graphql

Example authenticated GraphQL query:
```bash
# First, get an access token by logging in via the web portal
# Then use it in the Authorization header:
curl -X POST http://localhost:4000/graphql \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ me { sub email preferredUsername roles } securePing }"}'
```

### Billing Service (NestJS)
```bash
pnpm --filter @kilil/billing-service dev
```
Health Check: http://localhost:4001/health

### Payments Adapter Service (NestJS)
```bash
pnpm --filter @kilil/payments-adapter-service dev
```
Health Check: http://localhost:4002/health

## Payment E2E Flow (Minimal Stub)

1. Start all required services:
   ```bash
   # In separate terminals:
   pnpm --filter @kilil/billing-service dev
   pnpm --filter @kilil/payments-adapter-service dev
   pnpm --filter @kilil/bff dev
   pnpm --filter @kilil/web-portal dev
   ```

2. Create a test account and seed a charge:
   ```bash
   # Create a charge for account "ACC-123"
   curl -X POST http://localhost:4001/billing/charges \
     -H "Content-Type: application/json" \
     -d '{"accountId": "ACC-123", "amountCents": 50000, "type": "tuition"}'
   ```

3. Test the payment flow:
   - Visit http://localhost:3000/billing
   - Enter "ACC-123" as the Account ID
   - Click "Fetch" to see the balance and receipts
   - Enter an amount and select a payment channel
   - Click "Initiate" to create a payment intent
   - Click "Simulate webhook" to settle the payment
   - Click "Fetch" again to see the updated balance and new receipt

## Environment Variables

Each service has example environment files:
- BFF: `apps/bff/.env.example`
- Web Portal: `apps/web-portal/.env.local.example`
- Billing Service: `services/billing-service/.env.example`
- Payments Adapter: `services/payments-adapter-service/.env.example`

Copy these to `.env` or `.env.local` files respectively to use them locally.

## Common Issues and Fixes

### Port Conflicts
If you see "port already allocated" errors:
1. Check what's using the ports:
   ```bash
   netstat -ano | findstr :8080
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

### Keycloak Not Starting
If Keycloak fails to start:
1. Check the logs: `docker-compose -f infra/docker-compose.yml logs keycloak`
2. Ensure the realm-export.json file is properly formatted
3. Verify the file path in the docker-compose.yml volume mapping

## Accessibility Testing

The project includes jest-axe for accessibility testing. Tests are run as part of the normal test suite:
```bash
pnpm --filter @kilil/web-portal test
```