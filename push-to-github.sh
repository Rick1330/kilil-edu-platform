#!/bin/bash

# Push KILIL Education Platform to GitHub

echo "🚀 Pushing code to GitHub..."

# Configure git
git config --global user.name "rick(elshaday)"
git config --global user.email "elishum8@gmail.com"

# Initialize repository
git init --initial-branch=main

# Add remote
git remote add origin https://github.com/Rick1330/kilil-edu-platform.git

# Create curated commits
echo "📦 Creating curated commits..."

# First commit - workspace metadata and policies
git add LICENSE README.md CODEOWNERS .gitignore .gitattributes .editorconfig .nvmrc package.json nx.json tsconfig.base.json .eslintrc.json .prettierrc
git commit -m "chore(repo): initialize workspace metadata and policies

- Add Apache 2.0 license
- Create comprehensive README.md
- Set up CODEOWNERS for review requirements
- Configure gitignore and gitattributes
- Add editorconfig for consistent formatting
- Set Node.js version to 20"

# Second commit - tooling configuration
git add .github/workflows/ci.yml

# Create the workflow file first
cat > .github/workflows/ci.yml << 'EOF'
name: ci
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

permissions:
  contents: read
  security-events: write

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: et_univ
        ports: ['5432:5432']
        options: >-
          --health-cmd="pg_isready -U postgres"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
      redis:
        image: redis:7
        ports: ['6379:6379']
        options: >-
          --health-cmd="redis-cli ping || exit 1"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      POSTGRES_HOST: 127.0.0.1
      POSTGRES_PORT: 5432
      POSTGRES_DB: et_univ
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:5432/et_univ?schema=public
      REDIS_URL: redis://127.0.0.1:6379
      NEXT_PUBLIC_BFF_URL: http://localhost:4000/graphql
      FRONTEND_URL: http://localhost:3000
      ETH_LANGS: am,en
      NEXT_RUNTIME: nodejs
      CI: true
      RUN_MIGRATIONS: "false"

    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Enable pnpm via Corepack
        run: |
          corepack enable
          corepack prepare pnpm@9 --activate
          pnpm -v

      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Prepare CI env files
        run: |
          mkdir -p apps/web-portal
          cat > apps/web-portal/.env.ci <<'EOF'
          NEXT_RUNTIME=nodejs
          NEXT_PUBLIC_APP_NAME=KILIL University
          NEXT_PUBLIC_BFF_URL=http://localhost:4000/graphql
          FRONTEND_URL=http://localhost:3000
          EOF
          cp apps/web-portal/.env.ci apps/web-portal/.env.local || true

          mkdir -p apps/bff
          cat > apps/bff/.env.ci <<'EOF'
          PORT=4000
          CERBOS_URL=
          OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
          EOF
          cp apps/bff/.env.ci apps/bff/.env || true

      - name: Lint
        run: pnpm -w lint

      - name: Typecheck
        run: pnpm -w typecheck

      - name: Unit tests
        run: pnpm -w test -- --ci

      - name: Build
        run: pnpm -w build

      - name: Secrets scan (non-blocking, working tree only)
        continue-on-error: true
        run: |
          echo 'title = "gitleaks config (docs allowlist)"' > .gitleaks.toml
          printf "[allowlist]\npaths = [\n  '''README\\.md''',\n  '''ARCHITECTURE\\.md''',\n  '''BUILDLOG\\.md''',\n  '''ROADMAP\\.md''',\n  '''INDEX\\.md''',\n  '''docs/''',\n  '''adr/'''\n]\n" >> .gitleaks.toml
          pnpm dlx gitleaks detect --source . --no-git --config .gitleaks.toml -v || true

      - name: Trivy scan (non-blocking)
        continue-on-error: true
        run: pnpm dlx trivy fs --exit-code 0 --severity HIGH,CRITICAL .

  codeql:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
      - uses: github/codeql-action/analyze@v3
EOF

git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions ci.yml (use Corepack pnpm; Postgres/Redis services; non-blocking scans; CodeQL)"

# Third commit - architecture documentation
git add ARCHITECTURE.md BUILDLOG.md ROADMAP.md INDEX.md
git commit -m "docs(architecture): add ARCHITECTURE.md, BUILDLOG.md, ROADMAP.md, INDEX.md"

# Fourth commit - project scaffolding
git add apps/ packages/ services/
git commit -m "feat(scaffold): add web-portal, bff, service stubs, packages"

# Fifth commit - infrastructure
git add infra/ scripts/
git commit -m "feat(infra): add docker-compose + scripts"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📊 Repository Information:"
echo "   URL: https://github.com/Rick1330/kilil-edu-platform"
echo "   Branch: main"
echo "   Status: Private"
echo ""
echo "🔍 Last 5 commits:"
git log --oneline -5