#!/bin/bash

# KILIL Education Platform - Development Setup Script

set -e

echo "🚀 Setting up KILIL Education Platform development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node --version)"
    exit 1
fi

# Enable Corepack if not already enabled
if ! corepack enable 2>/dev/null; then
    echo "⚠️  Could not enable Corepack. Trying to install pnpm directly..."
    npm install -g pnpm@9
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Start Docker services
echo "🐳 Starting Docker services..."
cd infra
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
until docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 2
done

# Check if Redis is ready
until docker-compose exec redis redis-cli ping > /dev/null 2>&1; do
    echo "⏳ Waiting for Redis to be ready..."
    sleep 2
done

echo "✅ Development environment is ready!"
echo ""
echo "🌐 Services are running at:"
echo "   📊 PostgreSQL: localhost:5432 (Database: et_univ)"
echo "   🔴 Redis: localhost:6379"
echo ""
echo "🚀 To start development:"
echo "   pnpm dev"
echo ""
echo "🔍 To run health checks:"
echo "   ./scripts/health-check.sh"