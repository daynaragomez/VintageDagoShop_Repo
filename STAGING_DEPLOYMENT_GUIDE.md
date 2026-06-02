# 🚀 STAGING DEPLOYMENT & E2E VALIDATION GUIDE

**Purpose**: Deploy VintageDagoShop to staging environment and validate all critical user flows  
**Timeline**: 2-4 hours (includes deployment + full test cycle)  
**Target**: Achieve 100% critical path coverage before production release  
**Last Updated**: 2026-06-01  

---

## ⚡ QUICK RUN (Windows + PowerShell)

```powershell
# 1) Start Docker Desktop first

# 2) Start local staging stack
npm run staging:up

# 3) Follow logs
npm run staging:logs

# 4) Run E2E against staging
$env:STAGING_URL='http://localhost:5173'
npm run test:e2e:staging

# 5) Stop staging stack
npm run staging:down
```

## ⚡ QUICK RUN (macOS/Linux)

```bash
npm run staging:up
npm run staging:logs
STAGING_URL=http://localhost:5173 npm run test:e2e:staging
npm run staging:down
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] All commits pushed to `master` branch
- [ ] `npm run build` passes without errors
- [ ] `npm run lint` shows no errors
- [ ] `npm run test:coverage` passes with >85% coverage
- [ ] Latest DEPLOYMENT.md reviewed
- [ ] Staging environment credentials prepared (.env.staging)
- [ ] Slack webhook URL configured for notifications
- [ ] Team notified of staging deployment window

---

## 🌍 ENVIRONMENT OPTIONS

Choose deployment platform based on team preference:

### **Option A: Heroku (Fastest - 20 min)**
- Free tier available for testing
- Automatic HTTPS/SSL
- Easy rollback
- **Recommended for quick staging validation**

### **Option B: AWS (Production-grade - 30 min)**
- More control and scalability
- Auto-scaling available
- CloudWatch monitoring
- **Recommended for realistic load testing**

### **Option C: Docker Compose (Local - 10 min)**
- No cloud provider needed
- Full control over environment
- Portable and reproducible
- **Recommended if deploying internally**

### **Option D: DigitalOcean (Balanced - 25 min)**
- Simple droplet deployment
- Affordable pricing
- Good Docker support
- **Recommended for medium deployments**

---

## 🔧 OPTION A: HEROKU DEPLOYMENT

### Step 1: Prepare Heroku Environment

```bash
# Install Heroku CLI (if not already installed)
# macOS: brew install heroku
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Linux: curl https://cli.tools.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create staging app (use unique name)
heroku create vintagedago-staging

# View app info
heroku apps:info vintagedago-staging
```

### Step 2: Configure Environment Variables

```bash
# Set production environment variables
heroku config:set \
  NODE_ENV=staging \
  JWT_SECRET=your-super-secret-key-for-staging \
  DATABASE_URL=your-database-url \
  MYSQL_HOST=your-db-host.cleardb.net \
  MYSQL_USER=your_db_user \
  MYSQL_PASSWORD=your_db_pass \
  MYSQL_DATABASE=heroku_db_name \
  CORS_ORIGIN=https://vintagedago-staging.herokuapp.com \
  API_PORT=process.env.PORT || 5000 \
  --app vintagedago-staging

# Verify configuration
heroku config --app vintagedago-staging
```

### Step 3: Deploy Application

```bash
# Add Heroku remote if not already added
git remote add heroku https://git.heroku.com/vintagedago-staging.git

# Deploy master branch
git push heroku master

# View logs during deployment
heroku logs --tail --app vintagedago-staging

# After deployment, verify app is running
curl -s https://vintagedago-staging.herokuapp.com/api/health | jq
```

### Step 4: Database Migrations (if needed)

```bash
# Run database setup scripts
heroku run "mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < database/schema.sql" \
  --app vintagedago-staging

# Optional: Seed with test data
heroku run "mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < database/seeds.sql" \
  --app vintagedago-staging

# Create test admin user
heroku run "bash database/create-test-admin.sh" \
  --app vintagedago-staging
```

---

## 🐳 OPTION C: DOCKER COMPOSE (Local Staging Simulation)

Perfect for testing before cloud deployment.

### Step 1: Create Staging Docker Compose File

Create `docker-compose.staging.yml`:

```yaml
version: '3.8'

services:
  frontend-staging:
    build:
      context: .
      target: production
    ports:
      - "80:5173"
    environment:
      VITE_API_URL: http://localhost:5000
      NODE_ENV: staging
    networks:
      - staging-network

  backend-staging:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:3000"
    environment:
      NODE_ENV: staging
      DATABASE_URL: mysql://staging_user:staging_pass@db-staging:3306/vintagedago_staging
      JWT_SECRET: test-secret-key-do-not-use-in-production
      CORS_ORIGIN: http://localhost
    depends_on:
      - db-staging
    networks:
      - staging-network

  db-staging:
    image: mysql:8.0
    ports:
      - "3307:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: vintagedago_staging
      MYSQL_USER: staging_user
      MYSQL_PASSWORD: staging_pass
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
      - ./database/seeds.sql:/docker-entrypoint-initdb.d/02-seeds.sql:ro
      - staging-db-volume:/var/lib/mysql
    networks:
      - staging-network

volumes:
  staging-db-volume:

networks:
  staging-network:
    driver: bridge
```

### Step 2: Deploy Locally

```bash
# Build and start staging environment
docker-compose -f docker-compose.staging.yml up -d --build

# Wait for services to start (30 seconds)
sleep 30

# Verify frontend is running
curl http://localhost | grep -q "VintageDagoShop" && echo "✅ Frontend OK" || echo "❌ Frontend Failed"

# Verify backend is running
curl -s http://localhost:5000/api/health | jq && echo "✅ Backend OK" || echo "❌ Backend Failed"
```

### Step 3: Check Logs

```bash
# View all logs
docker-compose -f docker-compose.staging.yml logs -f

# View specific service
docker-compose -f docker-compose.staging.yml logs backend-staging
```

### Step 4: Cleanup (if needed)

```bash
# Stop all services
docker-compose -f docker-compose.staging.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.staging.yml down -v
```

---

## ✅ HEALTH CHECK & VERIFICATION

After deployment to any platform, verify deployment succeeded:

### Check Backend Health Endpoint

```bash
# Staging URL: Replace with your actual staging URL
STAGING_URL="https://vintagedago-staging.herokuapp.com"

# Check system health
curl -s $STAGING_URL/api/health | jq .

# Expected response:
# {
#   "status": "healthy",
#   "uptime": 234.567,
#   "environment": "staging",
#   "database": "connected",
#   "metrics": { ... }
# }
```

### Check Frontend Access

```bash
# Should return HTML and redirect appropriately
curl -s $STAGING_URL | head -20

# Check specific paths
curl -s $STAGING_URL/admin/login -w "Status: %{http_code}\n"
```

### Verify SSL/TLS

```bash
# Check certificate
openssl s_client -connect vintagedago-staging.herokuapp.com:443 -brief

# Should show "OK" and certificate details
```

---

## 🧪 E2E TEST EXECUTION

Run comprehensive end-to-end tests against staging environment.

### Step 1: Configure Test Environment

Create `.env.staging` for tests:

```bash
# tests/.env.staging
STAGING_URL=https://vintagedago-staging.herokuapp.com
API_BASE_URL=https://vintagedago-staging.herokuapp.com/api
TEST_ADMIN_EMAIL=admin@vintagedago.com
TEST_ADMIN_PASSWORD=admin123
ADMIN_PASSWORD_HASH=$2b$10$YIjlrHnEU8m9tN0Wm2gVq.YJVT0nC/zN5Ky2mZ9kL3x8fJ9pP0Tq
HEADLESS=false
```

### Step 2: Run Full E2E Suite

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run ALL E2E tests against staging
STAGING_URL=https://vintagedago-staging.herokuapp.com \
npx playwright test \
  --project=chromium \
  --config=playwright.config.js \
  tests/e2e/specs/

# Run tests in headed mode (see browser actions)
STAGING_URL=https://vintagedago-staging.herokuapp.com \
npx playwright test \
  --project=chromium \
  --headed \
  tests/e2e/specs/
```

### Step 3: Run Specific Critical Paths

```bash
# Test authentication flow
npx playwright test admin.spec.js --grep "@auth"

# Test product browsing
npx playwright test home.spec.js product.spec.js --grep "@search"

# Test cart and checkout
npx playwright test cart.spec.js checkout.spec.js --grep "@checkout"

# Test complete e2e flow
npx playwright test e2e-flow.spec.js --grep "@critical"
```

### Step 4: Generate Test Report

```bash
# Run tests with HTML report
STAGING_URL=https://vintagedago-staging.herokuapp.com \
npx playwright test tests/e2e/specs/ --reporter=html

# View report
npx playwright show-report

# JSON report for CI/CD integration
STAGING_URL=https://vintagedago-staging.herokuapp.com \
npx playwright test tests/e2e/specs/ --reporter=json > test-results.json
```

---

## 📊 KEY TEST SCENARIOS

### 1. **Authentication Flow** ✅
- [ ] Navigate to `/admin/login`
- [ ] Enter valid credentials (admin@vintagedago.com / admin123)
- [ ] Verify redirect to `/admin/orders`
- [ ] Verify JWT token stored in localStorage
- [ ] Verify Authorization header in API calls
- [ ] Test logout button redirects to login

### 2. **Product Browsing** ✅
- [ ] Load homepage
- [ ] Search for products (e.g., "vintage")
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Paginate through results
- [ ] View product details
- [ ] Verify images load correctly

### 3. **Shopping Cart** ✅
- [ ] Add product to cart
- [ ] View cart
- [ ] Update quantity
- [ ] Remove from cart
- [ ] Verify cart total calculations
- [ ] Verify cart persists on page reload

### 4. **Checkout Process** ✅
- [ ] Enter guest/customer info
- [ ] Enter shipping address
- [ ] Select shipping method
- [ ] Enter payment details
- [ ] Submit order
- [ ] Verify order confirmation
- [ ] Verify order appears in admin panel

### 5. **Admin Order Management** ✅
- [ ] See all pending orders
- [ ] View order details
- [ ] Update order status (Pending → Processing → Shipped)
- [ ] See order history
- [ ] Verify status changes reflect in database

### 6. **Error Handling** ✅
- [ ] Test network errors (disable network, verify retry/error message)
- [ ] Test invalid inputs (negative price, missing fields)
- [ ] Test 404 errors (navigate to invalid product)
- [ ] Test 500 errors (verify error page loads)
- [ ] Test rate limiting (rapid repeated requests)

### 7. **Performance Metrics** ✅
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms (p95)
- [ ] No JavaScript errors in console
- [ ] Images optimized (< 100KB each)
- [ ] CSS/JS properly minified

### 8. **Security Validations** ✅
- [ ] HTTPS/TLS working
- [ ] Security headers present (X-Frame-Options, CSP, etc.)
- [ ] No sensitive data in cookies/localStorage (only JWT)
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities in forms
- [ ] CORS properly restricted

---

## 📈 PERFORMANCE BASELINE TESTING

Establish baseline metrics for production comparison:

### Backend Metrics

```bash
# Check response times via health endpoint
curl -s https://vintagedago-staging.herokuapp.com/api/health | jq '.metrics'

# Expected metrics:
# {
#   "totalRequests": 2543,
#   "totalErrors": 2,
#   "avgResponseTime": 145,
#   "minResponseTime": 23,
#   "maxResponseTime": 2341,
#   "slowRequests": 12
# }

# Record these for comparison:
echo "Response Time: 145ms"
echo "Error Rate: 0.08%"
echo "Slow Requests: 12 out of 2543"
```

### Frontend Metrics

Check Performance API data:

```javascript
// In browser console on staging site:
console.log(window.performanceMetrics);

// Should show:
// {
//   pageLoadStart: 1622547892000,
//   domContentLoaded: 1234,
//   pageLoadComplete: 2456,
//   apiCalls: [
//     { endpoint: "/api/products", duration: 234 },
//     ...
//   ]
// }
```

### Load Testing (Optional)

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://vintagedago-staging.herokuapp.com/

# Using wrk (more advanced)
wrk -t12 -c400 -d30s https://vintagedago-staging.herokuapp.com/

# Expected results:
# - Requests/sec > 100
# - Error rate < 1%
# - Response time p95 < 500ms
```

---

## 🔄 MONITORING & ALERTS

Set up real-time monitoring during staging validation:

### Monitor Backend Logs

```bash
# Heroku
heroku logs --tail -n 100 --app vintagedago-staging | grep -E "ERROR|WARN"

# Docker
docker-compose -f docker-compose.staging.yml logs --tail=100 backend-staging | grep -E "ERROR|WARN"
```

### Monitor Database Connections

```bash
# Check active connections
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD -e \
  "SHOW PROCESSLIST; SELECT COUNT(*) as 'Active Connections' FROM INFORMATION_SCHEMA.PROCESSLIST;"
```

### Check Error Rates

```bash
# From metrics endpoint
METRICS=$(curl -s https://vintagedago-staging.herokuapp.com/api/health | jq '.metrics')
ERROR_RATE=$(echo $METRICS | jq '.totalErrors / .totalRequests * 100')
echo "Error Rate: $ERROR_RATE%"

# Alert if > 1%
if (( $(echo "$ERROR_RATE > 1" | bc -l) )); then
  echo "⚠️ Warning: Error rate too high!"
fi
```

---

## ✅ SIGN-OFF CRITERIA

All of the following must be **PASS** before promoting to production:

| Criterion | Pass/Fail | Evidence |
|-----------|-----------|----------|
| All E2E tests pass | [ ] | Test report filename: `___________` |
| No critical/high security findings | [ ] | npm audit log: `___________` |
| Frontend load time < 3s | [ ] | Staging URL: `___________` |
| API response time p95 < 500ms | [ ] | From /api/health endpoint |
| Error rate < 1% | [ ] | Metrics screenshot: `___________` |
| No JavaScript console errors | [ ] | Browser DevTools verified |
| Database connection healthy | [ ] | `SHOW PROCESSLIST` output |
| HTTPS/SSL working | [ ] | Certificate verified |
| Admin auth flow complete | [ ] | Tested login → view orders → logout |
| Product checkout works end-to-end | [ ] | Test order ID: `___________` |
| Monitoring alerts configured | [ ] | Slack webhook tested |

---

## 🚨 ROLLBACK PROCEDURES

If critical issues found:

### Heroku Rollback

```bash
# View deployment history
heroku apps:releases --app vintagedago-staging

# Rollback to previous version
heroku apps:releases:rollback v5 --app vintagedago-staging

# Verify rollback succeeded
curl -s https://vintagedago-staging.herokuapp.com/api/health
```

### Docker Rollback

```bash
# Stop current containers
docker-compose -f docker-compose.staging.yml down

# Checkout previous git commit
git checkout HEAD~1

# Restart with previous version
docker-compose -f docker-compose.staging.yml up -d --build
```

### Immediate Actions if Critical Issue

```bash
# 1. Stop traffic
# → Heroku: heroku ps:stop web
# → Docker: docker-compose pause

# 2. Investigate
tail -f logs/error.log | grep -A5 "ERROR"

# 3. Check database
mysql -h $HOST -u $USER -p -e "SELECT * FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR);"

# 4. Decide: Fix & redeploy OR rollback
# If fix < 30 min: Fix and redeploy
# If fix > 30 min: Rollback and investigate offline
```

---

## 📝 POST-DEPLOYMENT VALIDATION CHECKLIST

After successful staging deployment:

- [ ] Email team with staging URL and test credentials
- [ ] Document any issues found and create tasks for fixes
- [ ] Generate test report and attach to deployment log
- [ ] Update ROADMAP.md with completion status
- [ ] Record performance baselines for production comparison
- [ ] Archive staging logs for future reference
- [ ] Schedule production deployment window
- [ ] Prepare rollback plan for production

---

## 🎉 NEXT STEPS (After Staging Sign-Off)

1. **Production Deployment** (see DEPLOYMENT.md)
   - Use same procedures with production credentials
   - Enable enhanced monitoring (Datadog, New Relic)
   - Configure automatic backups
   - Set up status page (if using external service)

2. **Phase 4 Development** (if no critical issues)
   - User account management
   - Customer order history
   - Guest checkout vs registered user flows

3. **Phase 5 Development**
   - Email notifications (order confirmation, tracking updates)
   - Push notifications (if mobile app planned)

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**"Connection refused" on /api/health**
```bash
# Check if backend is running
docker-compose logs backend-staging
# Or check Heroku logs
heroku logs --app vintagedago-staging
```

**"Database connection failed"**
```bash
# Verify database credentials
heroku config --app vintagedago-staging | grep MYSQL

# Test connection directly
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD -e "SELECT 1;"
```

**"Tests timing out"**
```bash
# Increase timeout and run with debugging
PLAYWRIGHT_TIMEOUT=30000 DEBUG=pw:api npx playwright test --headed
```

**"SSL certificate error"**
```bash
# For Heroku: certificates auto-renew
# For self-signed: Add to .env
REJECT_UNAUTHORIZED=0  # ⚠️ DEV ONLY!
```

---

**Last reviewed**: 2026-06-01  
**Status**: Ready for staging deployment  
**Questions?** Refer to DEPLOYMENT.md or docs/ARCHITECTURE.md
