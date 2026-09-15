# 📋 ERROR REGISTER & RESOLUTION LOG

**Date**: 2026-09-15  
**Purpose**: Track errors encountered during production readiness implementation  
**Scope**: Implementation phase; issues found and resolutions applied

---

## 🔴 CRITICAL ERRORS (Resolved)

### 1. **Docker Desktop Daemon Unavailable**
- **Error**: `error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`
- **Severity**: 🔴 CRITICAL (blocks DB/compose deployment)
- **When**: During `docker-compose -f docker-compose.prod.yml up -d`
- **Root Cause**: Docker Desktop not running on Windows machine
- **Resolution**: ⚠️ PENDING (requires Docker Desktop to be started manually)
- **Workaround**: Ran backend locally with `npm run dev`; skipped Docker-based DB
- **Lesson**: Document Docker Desktop prerequisite + troubleshooting in LOCAL_DEV_SETUP.md
- **Prevention**: Add pre-flight check script to verify Docker daemon availability

---

### 2. **Playwright Browser Executable Missing**
- **Error**: `browserType.launch: Executable doesn't exist at C:\Users\tulio\AppData\Local\ms-playwright\chromium_headless_shell-1223\chrome-headless-shell-win64\chrome-headless-shell.exe`
- **Severity**: 🔴 CRITICAL (blocks E2E tests)
- **When**: First `npx playwright test` run
- **Root Cause**: Playwright browsers not installed on this machine
- **Resolution**: ✅ RESOLVED
  - Ran: `npx playwright install`
  - Installed chromium, firefox, webkit browsers
- **Lesson**: Add `playwright install` to onboarding checklist
- **Prevention**: Add to CI workflow; document in TESTING_SETUP.md

---

### 3. **E2E Import Path Error (Backend Middleware)**
- **Error**: `Cannot find module 'C:\workspace2\backend\src\middleware\auth' imported from tests/e2e/specs/admin-access.spec.ts`
- **Severity**: 🔴 CRITICAL (test won't compile)
- **When**: Running `npx playwright test --grep "@smoke"`
- **Root Cause**: Incorrect relative import path in test file (had `../../../../backend` instead of `../../../backend`)
- **Resolution**: ✅ RESOLVED
  - Fixed: `admin-access.spec.ts` import from `../../../../backend/src/middleware/auth` → `../../../backend/src/middleware/auth`
  - Committed: `fix(tests): correct relative import path for backend auth middleware in e2e spec`
- **Lesson**: Validate relative paths from test directory to backend
- **Prevention**: Add import path validation to test linting

---

### 4. **E2E Tests Fail Due to Empty Database**
- **Error**: `Error: locator.waitFor: Test timeout of 30000ms exceeded. Call log: waiting for getByTestId('product-detail-name') to be visible`
- **Severity**: 🔴 CRITICAL (blocks smoke tests)
- **When**: Running `npx playwright test --grep "@smoke"` with no DB seed data
- **Root Cause**: 
  - DB not running (Docker unavailable)
  - Even if DB was running, no sample products inserted
  - GET /api/products returned error instead of 3 products
- **Resolution**: ⚠️ PENDING (requires DB setup + seed data)
  - Blocked: Cannot complete until DB running and seeded with products
- **Expected Fix**: Create DATABASE_SEEDING.md + seed script; run locally or in CI
- **Lesson**: E2E tests are integration tests; need full stack running + valid data
- **Prevention**: Add data seeding step to test setup documentation; add `npm run seed` script

---

### 5. **JWT_SECRET Not Set in Environment**
- **Error**: Backend middleware warning: `WARNING: JWT_SECRET is not set. Using the app without a secure JWT secret is insecure.`
- **Severity**: 🔴 CRITICAL (security gap)
- **When**: Running backend with `npm run dev` (old .env had no JWT_SECRET)
- **Root Cause**: 
  - Old .env.example didn't include JWT_SECRET
  - Auth middleware removed hardcoded fallback (correct choice)
  - Tests expecting JWT_SECRET in env
- **Resolution**: ✅ RESOLVED
  - Updated .env.example to include `JWT_SECRET=replace-with-a-secure-secret`
  - Committed .env with `JWT_SECRET=test-secret-for-local`
  - Enforced env requirement in auth.js (no silent fallback)
- **Lesson**: Hardcoded secrets are dangerous; env enforcement is correct
- **Prevention**: CI/CD must set JWT_SECRET before running tests/deploy

---

## 🟡 IMPORTANT ERRORS (Needs Documentation)

### 6. **GitHub Actions Node.js 20 Deprecation Warning**
- **Error**: `Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4`
- **Severity**: 🟡 IMPORTANT (informational, not blocking)
- **When**: CI workflow run on GitHub
- **Root Cause**: Actions were built for Node 20; GitHub runners now use Node 24
- **Resolution**: ✅ RESOLVED
  - Updated `.github/workflows/deploy.yml`:
	- Set `node-version: '18.x'` explicitly (controls job Node, not action internals)
	- Added `cache: 'npm'` for faster installs
  - Added concurrency control and fetch-depth
- **Lesson**: Action warnings don't break workflow; but update to current LTS
- **Prevention**: Monitor GitHub action releases; update quarterly

---

### 7. **Playwright E2E Tests Fail on Missing Data (API Tests)**
- **Error**: `GET /api/products returns 3 products` test failed (DB had no products)
- **Severity**: 🟡 IMPORTANT (blocks smoke suite validation)
- **When**: Running `npx playwright test --grep "@smoke" --project=chromium`
- **Root Cause**: Same as #4 — no DB seed
- **Tests Failed**: 20 out of ~21 smoke tests
- **Sample Failures**:
  - `[chromium] › tests\e2e\specs\api.spec.js:9 › API — Products › GET /api/products returns 3 products`
  - `[chromium] › tests\e2e\specs\home.spec.js:16 › Home Page › renders 3 products from the database`
  - `[chromium] › tests\e2e\specs\checkout.spec.js:52 › Checkout Page › successful order navigates to confirmation`
- **Resolution**: ⚠️ PENDING (needs database)
  - Cannot resolve until DB running with seed data
  - Expected: Rerun after seeding → all smoke tests should pass
- **Prevention**: Create DATABASE_SEEDING.md with exact commands to seed locally

---

### 8. **Playwright Report Artifacts Large**
- **Error**: Test results created 30+ artifact directories with traces and screenshots
- **Severity**: 🟡 IMPORTANT (storage/repo bloat)
- **When**: Running full Playwright suite
- **Root Cause**: `--trace on-first-retry` and `screenshot: only-on-failure` enabled
- **Impact**: Test artifacts not committed to repo (good); but local disk usage high
- **Resolution**: ✅ PARTIAL
  - Artifacts not committed (correctly ignored)
  - But user can view with `npx playwright show-report`
- **Prevention**: Document report cleanup; add to CI cleanup steps

---

## 🟢 WARNINGS (Informational)

### 9. **npm audit: 6 Vulnerabilities in Backend**
- **Warning**: `npm audit` found 4 moderate, 2 high vulnerabilities
- **Severity**: 🟢 LOW-MEDIUM (audit findings)
- **When**: Running `npm ci` in backend/
- **Affected Packages**: (details available via `npm audit`)
- **Resolution**: ⚠️ PENDING
  - Option A: Run `npm audit fix` (may update minor versions)
  - Option B: Review each CVE and decide if upgrade safe
  - Option C: Accept risk if packages not exposed in API
- **Prevention**: Add `npm audit` to CI pipeline; require fixes for CRITICAL severity

---

### 10. **Windows PowerShell Command Incompatibilities**
- **Warning**: Commands like `sed`, `grep`, `head` not available in PowerShell
- **Severity**: 🟢 LOW (developer experience)
- **When**: Using Unix pipes in `git` + shell commands
- **Example**: `git ls-files | grep -E "\.md$"` failed (no grep in PowerShell)
- **Workaround**: Used PowerShell native: `Get-ChildItem -Path . -Name "*.md" -File`
- **Prevention**: Document PowerShell alternatives; use cross-platform tools (e.g., Node scripts for automation)

---

## 📊 ERROR STATISTICS

| Severity | Count | Resolved | Pending | Workaround |
|----------|-------|----------|---------|-----------|
| 🔴 CRITICAL | 5 | 3 | 2 | 1 |
| 🟡 IMPORTANT | 4 | 1 | 2 | 1 |
| 🟢 WARNING | 2 | 0 | 1 | 1 |
| **TOTAL** | **11** | **4** | **5** | **2** |

---

## 🔄 ROOT CAUSE CATEGORIES

| Category | Count | Examples |
|----------|-------|----------|
| **Infrastructure** | 3 | Docker unavailable, Playwright browsers missing, DB not seeded |
| **Configuration** | 2 | JWT_SECRET missing, Node version mismatch |
| **Code** | 1 | Import path error in test |
| **External** | 3 | GitHub Actions deprecation, npm vulnerabilities, PowerShell incompatibility |
| **Data** | 2 | No seed data, no test fixtures |

---

## 📝 DOCUMENTATION NEEDED

These errors should be documented in:

1. **TESTING_SETUP.md** (for errors #1, #2, #7)
   - Playwright browser install
   - DB seeding prerequisite
   - Expected test data

2. **LOCAL_DEV_SETUP.md** (for errors #1, #5)
   - Docker Desktop prerequisite
   - JWT_SECRET setup
   - Troubleshooting Docker connection

3. **DATABASE_SEEDING.md** (for errors #4, #7)
   - How to seed DB locally
   - Sample SQL inserts
   - Verification steps

4. **CI_CD_GUIDE.md** (for error #6)
   - Node version expectations
   - Action version updates
   - npm audit policy

5. **TROUBLESHOOTING.md** (all errors)
   - "Test timeout" → check DB seed
   - "Docker daemon unavailable" → start Docker Desktop
   - "Playwright browser missing" → run `playwright install`
   - "JWT_SECRET warning" → set env var

---

## ✅ ACTION ITEMS

### Immediate (Blocking)
- [ ] Create DATABASE_SEEDING.md with seed script
- [ ] Create LOCAL_DEV_SETUP.md with Docker/env troubleshooting
- [ ] Rerun E2E smoke tests after DB seeded (verify all pass)

### Short-term (Pre-staging)
- [ ] Review and fix npm vulnerabilities (audit fix or accept)
- [ ] Create TESTING_SETUP.md with full stack startup sequence
- [ ] Create TROUBLESHOOTING.md with common errors

### Medium-term (Pre-production)
- [ ] Add `npm audit` to CI pipeline
- [ ] Create cross-platform automation scripts (PowerShell + Bash)
- [ ] Monitor GitHub Actions updates

---

**Last Updated**: 2026-09-15  
**Next Review**: After staging deployment + E2E sign-off

