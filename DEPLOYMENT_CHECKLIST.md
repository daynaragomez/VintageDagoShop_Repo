# Deployment Checklist (Staging / Production)

This checklist is intended to guide a safe staging and production deployment for VintageDagoShop.

## Pre-deployment
- [ ] Confirm environment variables set in CI/staging: JWT_SECRET, DB credentials, S3 keys (if any)
- [ ] Run integration tests: `npm test` (backend) and `npm run test:integration`
- [ ] Run Playwright smoke tests: `npx playwright test --grep "@smoke"`
- [ ] Ensure backups configured for DB
- [ ] Obtain TLS certs for domain
- [ ] Configure DNS and load balancer

## Build
- [ ] Build backend image: `docker build -t vintagedago-backend ./backend`
- [ ] Build frontend image: `docker build -t vintagedago-frontend .`
- [ ] Tag images and push to registry

## Deploy (staging)
- [ ] Deploy docker-compose.prod.yml to staging host with env values
- [ ] Start services and confirm health endpoints
- [ ] Run Playwright smoke tests against STAGING_URL
- [ ] Verify logs for errors

## Deploy (production)
- [ ] Promote images from staging or rebuild for prod
- [ ] Fill production secrets in CI/CD
- [ ] Run DB migrations (if any)
- [ ] Start services behind load balancer
- [ ] Run full test suite and smoke tests

## Post-deploy
- [ ] Monitor logs for 24h
- [ ] Verify order placement and checkout flows
- [ ] Verify admin permissions and deny anonymous access
- [ ] Ensure backups are scheduled

## Rollback
- [ ] If critical failures, rollback to previous image tag
- [ ] Investigate and fix issues, then redeploy

---

Keep this file updated after each deployment.
