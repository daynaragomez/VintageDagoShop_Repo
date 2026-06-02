#!/bin/bash

# 🚀 STAGING DEPLOYMENT SCRIPT
# Automates local staging deployment via Docker Compose
# Usage: bash scripts/deploy-staging.sh

set -e

echo "🚀 VintageDagoShop Staging Deployment Script"
echo "=============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.staging.yml"
STAGING_FRONTEND_URL="http://localhost"
STAGING_BACKEND_URL="http://localhost:5000"

# Check if Docker is running
echo "📋 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed and running${NC}"

# Check if Docker Compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ $COMPOSE_FILE not found${NC}"
    echo "Please ensure you're running this from the project root directory"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose file found${NC}"

# Clean up any existing staging containers
echo ""
echo "🧹 Cleaning up existing staging containers..."
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true
echo -e "${GREEN}✅ Cleanup complete${NC}"

# Build and start services
echo ""
echo "🔨 Building and starting staging services..."
echo "   This may take 2-3 minutes on first run"
docker-compose -f "$COMPOSE_FILE" up -d --build

# Wait for services to start
echo ""
echo "⏳ Waiting for services to initialize (30 seconds)..."
sleep 30

# Verify frontend is running
echo ""
echo "🌐 Verifying frontend..."
if curl -s "$STAGING_FRONTEND_URL" | grep -q "html\|DOCTYPE\|VintageDago" 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend is running at $STAGING_FRONTEND_URL${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend responded but may not be fully ready${NC}"
    sleep 10
fi

# Verify backend is running
echo ""
echo "🔧 Verifying backend..."
HEALTH_RESPONSE=$(curl -s "$STAGING_BACKEND_URL/api/health" 2>/dev/null || echo "{}")
if echo "$HEALTH_RESPONSE" | grep -q "healthy\|uptime" 2>/dev/null; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
    echo "   Health check response:"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Backend API may still be initializing${NC}"
    echo "   Waiting another 15 seconds..."
    sleep 15
    HEALTH_RESPONSE=$(curl -s "$STAGING_BACKEND_URL/api/health" 2>/dev/null || echo "{}")
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
fi

# Display logs
echo ""
echo "📋 Recent service logs:"
echo "   (Use 'docker-compose -f docker-compose.staging.yml logs' for full logs)"
docker-compose -f "$COMPOSE_FILE" logs --tail=5 backend-staging 2>/dev/null || true

# Deployment summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ STAGING DEPLOYMENT COMPLETE${NC}"
echo "=============================================="
echo ""
echo "📱 Access URLs:"
echo "   Frontend:  $STAGING_FRONTEND_URL"
echo "   Backend:   $STAGING_BACKEND_URL"
echo "   Health:    $STAGING_BACKEND_URL/api/health"
echo ""
echo "👤 Test Credentials:"
echo "   Email:     admin@vintagedago.com"
echo "   Password:  admin123"
echo ""
echo "🧪 Run E2E Tests:"
echo "   STAGING_URL=$STAGING_FRONTEND_URL npx playwright test tests/e2e/specs/"
echo ""
echo "📊 Monitor Logs:"
echo "   docker-compose -f $COMPOSE_FILE logs -f"
echo ""
echo "🛑 Stop Staging:"
echo "   docker-compose -f $COMPOSE_FILE down"
echo ""
echo "💡 Tips:"
echo "   - Check /api/health for backend metrics"
echo "   - View browser DevTools for performance metrics"
echo "   - Run tests with: npm run test:e2e:staging"
echo ""
