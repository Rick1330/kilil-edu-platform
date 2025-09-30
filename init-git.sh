#!/bin/bash

# Initialize git repository with curated commits
echo "🚀 Initializing git repository..."

# Initialize git
git init --initial-branch=main

# Configure user
git config user.name "rick(elshaday)"
git config user.email "elishum8@gmail.com"

# Create initial commits with conventional commits
echo "📦 Creating curated commit history..."

# First commit - workspace metadata and policies
git add LICENSE README.md CODEOWNERS .gitignore .gitattributes .editorconfig .nvmrc
git commit -m "chore(repo): initialize workspace metadata and policies

- Add Apache 2.0 license
- Create comprehensive README.md
- Set up CODEOWNERS for review requirements
- Configure gitignore and gitattributes
- Add editorconfig for consistent formatting
- Set Node.js version to 20"

# Second commit - tooling configuration
git add package.json nx.json tsconfig.base.json .eslintrc.json .prettierrc
git commit -m "chore(tooling): configure pnpm/Nx/ESLint/Prettier/commitlint/Husky/tsconfig.base

- Set up Nx monorepo with pnpm workspaces
- Configure TypeScript with path mapping
- Add ESLint and Prettier configurations
- Set up conventional commits structure
- Configure build and development scripts"

# Third commit - architecture documentation
git add docs/ARCHITECTURE.md docs/BUILDLOG.md docs/ROADMAP.md docs/INDEX.md
git commit -m "docs(architecture): add ARCHITECTURE.md, BUILDLOG.md, ROADMAP.md, INDEX.md

- Comprehensive system architecture documentation
- Build log with assumptions and risk assessment
- 90-day roadmap with milestones and gates
- Documentation index with quick start guide"

# Fourth commit - project scaffolding
git add apps/ packages/ services/
git commit -m "feat(scaffold): add web-portal, bff, service stubs, packages

- Next.js web portal with Ethiopian localization
- NestJS BFF with Apollo GraphQL
- Domain service stubs (enrollment, billing, payments, notifications, ussd-sms, degree-audit)
- Shared packages (i18n, ethiopian-calendar)
- Basic project structure and configuration"

# Fifth commit - infrastructure
git add infra/ scripts/
git commit -m "feat(infra): add docker-compose + scripts

- Docker compose for PostgreSQL and Redis
- Development setup script with health checks
- Health check script for services
- Local development environment configuration"

# Sixth commit - CI/CD pipeline
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions ci.yml (use Corepack pnpm; Postgres/Redis services; non-blocking scans; CodeQL)

- GitHub Actions workflow for CI/CD
- PostgreSQL and Redis service containers
- Automated testing and building
- Security scanning with CodeQL
- Secrets scanning with gitleaks
- Vulnerability scanning with Trivy"

echo "✅ Git repository initialized with curated commits!"
echo ""
echo "📊 Commit history:"
git log --oneline -6