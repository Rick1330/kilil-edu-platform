# KILIL Education Platform - Identity Plan

## Overview

This document outlines the identity and authentication implementation plan for Phase 1 of the KILIL Education Platform. The plan focuses on integrating Keycloak for OIDC/SAML authentication, implementing role-based access control, and establishing a shared authentication library.

## Keycloak Configuration

### Realm
- **Name**: et-univ
- **Purpose**: Single realm for all universities in the platform
- **Tenancy**: Logical separation through claims rather than separate realms

### Clients

#### Web Portal Client
- **Client ID**: web-portal
- **Type**: Confidential client (in dev)
- **Authentication**: Client secret
- **Redirect URIs**: 
  - http://localhost:3000/api/auth/callback/*
  - http://localhost:3000/*
- **Web Origins**: 
  - http://localhost:3000

#### BFF Client
- **Client ID**: bff
- **Type**: Confidential client
- **Authentication**: Client secret
- **Redirect URIs**: []
- **Web Origins**: []

### Roles

#### System Roles
- **super-admin**: Platform administrator with full access
- **support**: Customer support personnel
- **auditor**: Compliance and audit personnel

#### University Roles
- **student**: Registered student at a university
- **faculty**: Teaching faculty member
- **staff**: Administrative staff member
- **advisor**: Academic advisor
- **registrar**: Registrar office staff
- **bursar**: Financial office staff
- **librarian**: Library staff
- **sponsor**: External sponsor or donor

#### Role Hierarchy
```
super-admin
├── support
├── auditor
└── university-admin
    ├── registrar
    ├── bursar
    ├── librarian
    ├── faculty
    ├── advisor
    ├── staff
    └── student
```

### Test Users
- **Username**: sara
- **Password**: Passw0rd!
- **Role**: student
- **Email**: sara@example.com

## Tokens

### ID Token
- **Purpose**: User identity information
- **Claims**:
  - `sub`: User identifier
  - `preferred_username`: Display name
  - `email`: User email address
  - `given_name`: First name
  - `family_name`: Last name
  - `roles`: User roles
  - `tenant_id`: University identifier (placeholder in dev)
  - `campus_id`: Campus identifier (placeholder in dev)

### Access Token
- **Purpose**: API authorization
- **Claims**:
  - `sub`: User identifier
  - `roles`: User roles
  - `tenant_id`: University identifier
  - `campus_id`: Campus identifier
  - `aud`: Audience (bff)
  - `exp`: Expiration time
  - `iat`: Issued at time

### Refresh Token
- **Purpose**: Token refresh without re-authentication
- **Lifetime**: 30 days (configurable)
- **Rotation**: Enabled for security

## Authentication Flows

### Web Portal Flow (Authorization Code + PKCE)
1. User navigates to web portal
2. Web portal redirects to Keycloak login via NextAuth
3. User authenticates with credentials
4. Keycloak redirects back to web portal with authorization code
5. NextAuth exchanges code for tokens
6. Tokens stored in secure HTTP-only cookies
7. User session established

### BFF/API Flow (Bearer JWT)
1. Web portal includes access token in Authorization header
2. BFF validates JWT signature and claims using JWKS
3. BFF extracts user context from token
4. BFF enforces role-based access control
5. BFF processes request and returns response

### Logout Flow
1. User initiates logout from web portal
2. Web portal clears local session via NextAuth
3. NextAuth redirects to Keycloak logout endpoint
4. Keycloak invalidates user session
5. User redirected to post-logout URL

## Environment Variables

### Web Portal
```bash
# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=devsecret

# Keycloak configuration
KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/et-univ
KEYCLOAK_WEB_CLIENT_ID=web-portal
KEYCLOAK_WEB_CLIENT_SECRET=CHANGE_ME_IN_REAL_KEYCLOAK
```

### BFF Service
```bash
# Keycloak configuration
KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/et-univ
KEYCLOAK_REALM=et-univ
KEYCLOAK_CLIENT_ID=bff
KEYCLOAK_AUDIENCE=bff
```

### Keycloak (Infrastructure)
```bash
# Admin credentials (dev only)
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

## Shared Authentication Package

### Package Structure
```
packages/shared-auth/
├── src/
│   ├── types.ts
│   ├── parse.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Principal Shape
```typescript
export type Principal = {
  sub: string;
  email?: string;
  preferredUsername?: string;
  roles: string[];
  tenantId?: string;
  campusId?: string;
};
```

## Security Considerations

### Transport Security
- **HTTPS Required**: All non-local environments must use HTTPS
- **HSTS**: HTTP Strict Transport Security headers
- **Certificate Pinning**: For mobile clients

### Token Security
- **Secure Cookies**: HTTP-only, Secure, SameSite flags
- **Token Storage**: No localStorage for tokens in web portal
- **Short Lifetimes**: Access tokens expire in 15 minutes

### Session Management
- **Idle Timeout**: 30-minute idle timeout
- **Absolute Timeout**: 8-hour absolute session limit
- **Concurrent Sessions**: Limited to 5 active sessions

### CSRF Protection
- **State Parameter**: OAuth2 state parameter for CSRF protection
- **SameSite Cookies**: Cookies with SameSite=Lax attribute
- **Custom Headers**: X-Requested-With header for AJAX requests

### Audit Logging
- **Login Events**: Successful and failed login attempts
- **Token Events**: Token issuance and refresh
- **Role Changes**: Role assignment and revocation
- **Access Events**: Sensitive resource access

## Implementation Phases

### Phase 1: Core Identity (Week 1)
1. Keycloak in docker-compose (dev use)
2. Realm et-univ with base configuration
3. Clients: web-portal (confidential), bff (confidential)
4. Base roles implementation
5. packages/shared-auth creation

### Phase 2: Integration (Week 1-2)
1. Web portal NextAuth login/logout implementation
2. BFF JWT guard implementation with JWKS validation
3. /me resolver returning principal claims
4. User badge showing preferred_username

### Phase 3: Authorization (Week 2)
1. Protect one GraphQL resolver by role
2. Sample Nest guard in one service
3. Role-based UI elements in web portal
4. Documentation and runbooks

## Testing Strategy

### Unit Tests
- JWT validation logic
- Role guard functionality
- Session management
- Principal extraction

### Integration Tests
- Full OIDC flow
- Token refresh
- Logout flow
- Role-based access control

### Security Tests
- Token manipulation attempts
- CSRF attack simulations
- Session fixation tests
- Brute force protection

## Monitoring and Observability

### Metrics
- Authentication success/failure rates
- Token issuance/refresh rates
- Session duration statistics
- Role distribution metrics

### Logging
- Structured audit logs
- Error and exception logging
- Performance tracing
- Security event logging

### Alerts
- High authentication failure rates
- Suspicious login patterns
- Token abuse detection
- System health monitoring

## Admin Access

### Local Development
- **Admin Console**: http://localhost:8080/admin
- **Admin Username**: admin
- **Admin Password**: admin
- **Realm**: et-univ

### Managing Users and Roles
1. Navigate to http://localhost:8080/admin
2. Login with admin/admin
3. Select the "et-univ" realm
4. Go to "Users" to manage users
5. Go to "Roles" to manage roles
6. Assign roles to users in the "Role Mappings" tab of each user