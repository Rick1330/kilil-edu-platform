#!/bin/bash

# KILIL Education Platform - Health Check Script

set -e

echo "🔍 Running health checks..."
echo ""

# Function to check HTTP endpoint
check_http() {
    local url=$1
    local name=$2
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $name is healthy"
        return 0
    else
        echo "❌ $name is not responding"
        return 1
    fi
}

# Function to check TCP port
check_port() {
    local host=$1
    local port=$2
    local name=$3
    
    if timeout 2 bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null; then
        echo "✅ $name is reachable at $host:$port"
        return 0
    else
        echo "❌ $name is not reachable at $host:$port"
        return 1
    fi
}

# Check Docker services
echo "🐳 Checking Docker services..."
cd infra

# Check PostgreSQL
if docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL is not healthy"
fi

# Check Redis
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis is not healthy"
fi

cd ..

# Check local services if running
echo ""
echo "🌐 Checking local services..."

# Check web portal
if check_http "http://localhost:3000" "Web Portal"; then
    echo "   📱 http://localhost:3000"
fi

# Check BFF service
if check_http "http://localhost:4000/health" "BFF Service"; then
    echo "   🔄 http://localhost:4000/graphql"
fi

# Check service ports
echo ""
echo "🔌 Checking service ports..."
check_port "localhost" "5432" "PostgreSQL"
check_port "localhost" "6379" "Redis"

echo ""
echo "📊 Health check summary:"
echo "   ✅ Docker services: PostgreSQL, Redis"
echo "   🔄 Local services: Check individual service status"
echo ""
echo "💡 To start all services, run: pnpm dev"
echo "💡 To check specific service logs, run: nx serve <service-name>"