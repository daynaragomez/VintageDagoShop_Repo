# Deployment Notes & Post-Deploy Verification

These notes list manual steps to deploy to staging/production and the basic verification plan.

1. Prepare environment variables in target host/CI
   - JWT_SECRET
   - DB credentials
   - FRONTEND env (VITE_API_BASE_URL)

2. Deploy to staging
   - Clone repo on staging host
   - Create .env file from .env.example and set real values
   - Run: docker compose -f docker-compose.prod.yml up -d --build
   - Confirm backend health: curl http://localhost:3000/api/health

3. Run smoke tests locally against staging URL
   - export STAGING_URL=https://staging.myproject.example
   - npx playwright test --grep "@smoke"

4. Post-deploy verification
   - Create test order via UI
   - Confirm DB order exists
   - Confirm admin endpoints are inaccessible without admin token
   - Confirm logs show no errors
   - Confirm backup scheduled

5. If failure
   - Rollback: docker compose -f docker-compose.prod.yml down; docker image rollback
   - Investigate logs

---

Note: For automated deploy to cloud provider, replace placeholder in .github/workflows/deploy.yml with provider-specific steps (SSH, scp, kubectl, etc.)
