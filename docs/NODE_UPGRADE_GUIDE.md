# Node.js Upgrade Guide - v14 to v18 LTS
**Target:** Upgrade from Node.js v14.18.1 to v18 LTS  
**Reason:** Vitest 1.0.4 requires Node.js 18+ (node:timers/promises dependency)  
**Date:** 2026-05-27

---

## ⚠️ CURRENT ISSUE

**Problem:** Cannot run `npm run test:coverage` - Vitest fails with:
```
Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: node:timers/promises
```

**Root Cause:** Node.js v14.18.1 installed, but Vitest 1.0.4 requires Node.js 18+

---

## 📋 UPGRADE STEPS

### Option A: Using Node Version Manager (NVM) - Recommended

**1. Check if NVM is installed:**
```powershell
nvm version
```

**If NVM is installed:**
```powershell
# Install Node.js 18 LTS
nvm install 18

# Use Node.js 18
nvm use 18

# Verify version
node --version
# Should output: v18.x.x
```

**If NVM is NOT installed:**
- **Windows:** Download nvm-windows from https://github.com/coreybutler/nvm-windows/releases
- **Mac/Linux:** Install nvm from https://github.com/nvm-sh/nvm

---

### Option B: Direct Installation (Without NVM)

**1. Download Node.js 18 LTS:**
- Visit: https://nodejs.org/en/download/
- Select: **18.x.x LTS** (Long Term Support)
- Choose: **Windows Installer (.msi)** for Windows

**2. Run Installer:**
- Close all terminals and IDEs
- Run the .msi installer
- Follow installation wizard
- Restart computer after installation

**3. Verify Installation:**
```powershell
node --version
# Should output: v18.x.x

npm --version
# Should output: 9.x.x or 10.x.x
```

---

## 🔄 POST-UPGRADE STEPS

### 1. Navigate to Project Directory
```powershell
cd C:\workspace2\VintageDagoShop
```

### 2. Clean Old Dependencies
```powershell
# Remove node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### 3. Reinstall Dependencies
```powershell
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 4. Verify Vitest Works
```powershell
# Try running tests
npm test

# Try running coverage
npm run test:coverage
```

---

## ✅ VERIFICATION CHECKLIST

After upgrade, verify:

- [ ] `node --version` shows v18.x.x
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts frontend successfully
- [ ] `docker-compose up -d` starts backend successfully
- [ ] `npm test` runs without Node.js module errors
- [ ] `npm run test:coverage` generates coverage report

---

## 🚨 TROUBLESHOOTING

### Issue: `npm install` fails with permission errors
**Solution:** Run PowerShell as Administrator

### Issue: `node --version` still shows v14
**Solution:** 
1. Close ALL terminal windows
2. Restart Visual Studio
3. Open new terminal and verify again

### Issue: Vitest still fails with different error
**Solution:** 
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Docker containers won't start after upgrade
**Solution:** Node.js version doesn't affect Docker containers - restart Docker Desktop

---

## 📊 EXPECTED OUTCOME

After successful upgrade, you should be able to run:

```powershell
npm run test:coverage
```

And see output like:

```
 RUN  v1.0.4

 ✓ tests/unit/context/CartContext.test.jsx (X tests) XXms
 ✓ tests/unit/components/HomePage.test.jsx (X tests) XXms
 ✓ tests/integration/cart-flow.test.jsx (X tests) XXms

 Test Files  3 passed (3)
	  Tests  X passed (X)
   Duration  XXXms

 % Coverage report from c8
------------------------------------
File                | % Stmts | % Branch | % Funcs | % Lines
------------------------------------
All files           |   XX.XX |    XX.XX |   XX.XX |   XX.XX
 CartContext.jsx    |   XX.XX |    XX.XX |   XX.XX |   XX.XX
 HomePage.jsx       |   XX.XX |    XX.XX |   XX.XX |   XX.XX
 ...
------------------------------------
```

---

## 🔄 ROLLBACK (If Needed)

If upgrade causes issues and you need to revert:

**Using NVM:**
```powershell
nvm use 14
```

**Without NVM:**
- Reinstall Node.js v14.18.1 from https://nodejs.org/dist/v14.18.1/
- Run `npm install` again

---

## 📝 NEXT STEPS AFTER UPGRADE

Once Node.js 18 is installed and tests run successfully:

1. ✅ Run `npm run test:coverage` and capture baseline metrics
2. ✅ Document coverage percentage in `docs/TESTING.md`
3. ✅ Update `docs/PROJECT_STATUS.md` to mark Gap #5 as resolved
4. ✅ Add coverage threshold to `vite.config.js` (target: 80%)
5. ✅ Continue with Phase 1 completion

---

**Need Help?** 
- Node.js Documentation: https://nodejs.org/docs/latest-v18.x/api/
- NVM Windows: https://github.com/coreybutler/nvm-windows
- Vitest Documentation: https://vitest.dev/
