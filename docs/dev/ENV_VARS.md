# KILIL Education Platform - Environment Variables

## Overview

This document lists the environment variables used across the KILIL Education Platform. During development, these variables are typically not required as services use default configurations. For production deployments, these variables must be properly configured.

## Web Portal (@kilil/web-portal)

| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| NEXT_PUBLIC_API_URL | BFF service endpoint | http://localhost:4000 | API client configuration |
| NEXT_PUBLIC_APP_ENV | Application environment | development | Feature flags, logging |
| NEXT_PUBLIC_BASE_PATH | Base path for application | / | Routing configuration |
| NEXT_RUNTIME | Node.js runtime environment | nodejs | Next.js runtime |
| NEXT_PUBLIC_APP_NAME | Application name | KILIL University | UI display |
| NEXT_PUBLIC_BFF_URL | BFF GraphQL endpoint | http://localhost:4000/graphql | GraphQL client |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | CORS configuration |

## BFF Service (@kilil/bff)

| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 4000 | Server configuration |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/et_univ | Database connection |
| REDIS_URL | Redis connection string | redis://localhost:6379 | Cache, sessions |
| JWT_SECRET | Secret for JWT signing | development-secret | Authentication |
| LOG_LEVEL | Logging level | debug | Logger configuration |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | CORS configuration |
| KEYCLOAK_ISSUER_URL | Keycloak issuer URL | http://localhost:8080/realms/et-univ | OIDC configuration |
| KEYCLOAK_REALM | Keycloak realm name | et-univ | OIDC configuration |
| KEYCLOAK_CLIENT_ID | Keycloak client ID | bff | OIDC configuration |
| KEYCLOAK_AUDIENCE | Keycloak audience | bff | OIDC configuration |

## Service Packages

### Enrollment Service (@kilil/enrollment-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3001 | Server configuration |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/et_univ | Database connection |

### Billing Service (@kilil/billing-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3002 | Server configuration |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/et_univ | Database connection |

### Payments Adapter Service (@kilil/payments-adapter-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3003 | Server configuration |
| TELEBIRR_API_KEY | Telebirr API key | (none) | Telebirr integration |
| MPESA_API_KEY | M-Pesa API key | (none) | M-Pesa integration |

### Notifications Service (@kilil/notifications-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3004 | Server configuration |
| SMTP_HOST | SMTP server host | (none) | Email notifications |
| SMTP_PORT | SMTP server port | 587 | Email notifications |
| SMTP_USER | SMTP username | (none) | Email notifications |
| SMTP_PASS | SMTP password | (none) | Email notifications |

### USSD/SMS Service (@kilil/ussd-sms-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3005 | Server configuration |
| USSD_GATEWAY_URL | USSD gateway endpoint | (none) | USSD integration |
| SMS_GATEWAY_URL | SMS gateway endpoint | (none) | SMS integration |

### Degree Audit Stub Service (@kilil/degree-audit-stub-service)
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| PORT | HTTP server port | 3006 | Server configuration |

## Shared Packages

### i18n (@kilil/i18n)
No environment variables required.

### Ethiopian Calendar (@kilil/ethiopian-calendar)
No environment variables required.

## Infrastructure

### PostgreSQL
| Variable | Purpose | Default | Where Used |
|----------|---------|---------|------------|
| POSTGRES_DB | Database name | et_univ | Database initialization |
| POSTGRES_USER | Database user | postgres | Database initialization |
| POSTGRES_PASSWORD | Database password | postgres | Database initialization |

### Redis
No environment variables required for basic operation.

## Security Notes

- Never commit actual secrets to the repository
- Use .env files for local development (not committed to git)
- Use secret management systems for production deployments
- Rotate secrets regularly according to security policies