# Deployment Guide

**Last Updated**: 2026-06-01  
**Version**: 1.0.0

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Steps](#deployment-steps)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Procedure](#rollback-procedure)
6. [Monitoring & Alerting](#monitoring--alerting)

---

## Pre-Deployment Checklist

Before deploying to production, verify the following:

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Code coverage >80%: `npm run test:coverage`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Documentation updated

### Security
- [ ] All credentials removed from code
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] No exposed secrets in git history: `git log -S password --all`

### Performance
- [ ] Frontend build size <500KB (gzip)
- [ ] API response time <500ms (p95)
- [ ] Page load time <2s (p95)
- [ ] Database queries optimized
- [ ] Caching enabled where appropriate

### Database
- [ ] Backup created
- [ ] Migration script tested
- [ ] Rollback procedure documented
- [ ] Database capacity verified

### Infrastructure
- [ ] Server capacity verified
- [ ] Load balancer configured
- [ ] Auto-scaling enabled
- [ ] Monitoring and alerting configured
- [ ] Logging enabled

---

## Environment Configuration

### 1. Backend Environment Variables

Create `.env.production` in the `backend/` directory:

```bash
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DB_HOST=prod-db.example.com
DB_PORT=3306
DB_NAME=vintagedago_prod
DB_USER=vdago_user
DB_PASSWORD=${VAULT_DB_PASSWORD}

# JWT
JWT_SECRET=${VAULT_JWT_SECRET}
JWT_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=https://vintagedago.com,https://www.vintagedago.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5

# Monitoring
SENTRY_DSN=${VAULT_SENTRY_DSN}
NEW_RELIC_LICENSE_KEY=${VAULT_NR_LICENSE_KEY}
```

### 2. Frontend Environment Variables

Create `.env.production` in the root directory:

```bash
VITE_API_BASE_URL=https://api.vintagedago.com
VITE_APP_ENV=production
VITE_ANALYTICS_ID=${VAULT_ANALYTICS_ID}
```

### 3. Deploy to Vault/Secrets Manager

Use your deployment platform's secrets management:

**AWS Secrets Manager:**
```bash
aws secretsmanager create-secret \
  --name vintagedago/prod/db-password \
  --secret-string "your-secure-password"
```

**GitHub Secrets:**
1. Go to Settings → Secrets and variables → Actions
2. Add each secret individually

**Heroku Config Vars:**
```bash
heroku config:set \
  DB_PASSWORD=xxx \
  JWT_SECRET=xxx \
  --app vintagedago-prod
```

---

## Deployment Steps

### Option 1: Docker Compose (Development/Staging)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify health
curl http://localhost:3000/api/health
curl http://localhost:5173
```

### Option 2: Heroku (Recommended for Small Apps)

```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create vintagedago-prod

# Add database add-on
heroku addons:create cleardb:spark --app vintagedago-prod

# Push code
git push heroku main

# Run migrations
heroku run "npm run db:migrate" --app vintagedago-prod

# View logs
heroku logs --tail --app vintagedago-prod
```

### Option 3: AWS (Scalable)

```bash
# Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t vintagedago-backend ./backend
docker tag vintagedago-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/vintagedago-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/vintagedago-backend:latest

# Deploy to ECS
aws ecs update-service \
  --cluster vintagedago-prod \
  --service vintagedago-backend \
  --force-new-deployment
```

### Option 4: Google Cloud Run (Serverless)

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/vintagedago-backend ./backend

# Deploy
gcloud run deploy vintagedago-backend \
  --image gcr.io/PROJECT_ID/vintagedago-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production
```

---

## Post-Deployment Verification

### 1. Health Check

```bash
# Check API health
curl https://api.vintagedago.com/api/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2026-06-01T12:00:00Z",
#   "uptime": 45.123,
#   "metrics": {...}
# }
```

### 2. Functional Tests

```bash
# Run E2E tests against production
npm run test:e2e -- --baseURL=https://vintagedago.com

# Manual checks:
# - Visit https://vintagedago.com
# - Browse products
# - Add item to cart
# - Complete checkout
# - Admin: login and view orders
```

### 3. Performance Verification

```bash
# Check page load time
curl -w "Total: %{time_total}s\n" \
  https://vintagedago.com

# Check API response time
curl -w "Total: %{time_total}s\n" \
  https://api.vintagedago.com/api/products
```

### 4. Security Verification

```bash
# Check HTTPS is enforced
curl -I https://vintagedago.com
# Should redirect http -> https

# Check security headers
curl -I https://api.vintagedago.com/api/health
# Should include: X-Frame-Options, X-Content-Type-Options, etc.

# Check CORS
curl -H "Origin: https://example.com" \
  https://api.vintagedago.com/api/health
# Should reject unauthorized origins
```

---

## Rollback Procedure

### If Critical Issues Occur:

```bash
# Get previous deployment version
git log --oneline | head -5

# Revert to previous commit
git revert <commit-hash>
git push origin main

# Heroku rollback
heroku releases --app vintagedago-prod
heroku rollback v123 --app vintagedago-prod

# Docker/manual rollback
docker pull vintagedago-backend:previous-tag
docker stop current-container
docker run -d vintagedago-backend:previous-tag
```

### Database Rollback:

```bash
# Backup current data
mysqldump -h prod-db.example.com -u user -p vintagedago_prod > backup-$(date +%s).sql

# Restore from backup
mysql -h prod-db.example.com -u user -p vintagedago_prod < backup-<timestamp>.sql

# Or use database snapshots (AWS RDS, Google Cloud SQL)
```

---

## Monitoring & Alerting

### 1. Application Monitoring

**New Relic** (Recommended)
```bash
npm install newrelic --save
# Add to top of backend/src/server.js:
# require('newrelic');
```

**Datadog Alternative:**
```bash
npm install dd-trace --save
```

### 2. Error Tracking

**Sentry**
```bash
npm install @sentry/node
# Backend: require('@sentry/node').init({dsn: process.env.SENTRY_DSN})
# Frontend: require('@sentry/react').init({dsn: process.env.VITE_SENTRY_DSN})
```

### 3. Logging

**CloudWatch** (AWS)
```bash
# Logs automatically streamed from containers
# View in AWS Console → CloudWatch → Log Groups
```

**Google Cloud Logging** (GCP)
```bash
# Logs automatically available in Cloud Logging
# Filter: resource.type="cloud_run_revision"
```

### 4. Uptime Monitoring

**UptimeRobot** (Free)
- Monitor: https://vintagedago.com
- Monitor: https://api.vintagedago.com/api/health
- Alert on: 5 minute outage, any down notification

### 5. Performance Alerts

Alert (via Slack/Email) when:
- Frontend load time > 2000ms
- API response time > 500ms
- Error rate > 5%
- Server CPU > 80%
- Server memory > 85%
- Database query time > 1000ms

---

## Incident Response

**If site is down:**

1. Check status page: https://status.vintagedago.com
2. Check logs: `heroku logs --tail` or CloudWatch
3. Check metrics: New Relic / Datadog dashboard
4. Run rollback if needed
5. Email customers if outage >30 minutes
6. Post-incident: analyze root cause, update runbooks

---

## Useful Commands

```bash
# SSH into production
heroku ps:exec --app vintagedago-prod

# View real-time logs
heroku logs --tail --app vintagedago-prod

# Scale dynos
heroku ps:scale web=2 --app vintagedago-prod

# Database backup
heroku pg:backups:capture --app vintagedago-prod

# Run one-off command
heroku run "node backend/src/scripts/seed.js" --app vintagedago-prod
```

---

## Support & Escalation

- **On-call**: See #oncall in Slack
- **War room**: https://zoom.us/j/incident-room
- **Status page**: https://status.vintagedago.com
- **Customer support**: support@vintagedago.com
