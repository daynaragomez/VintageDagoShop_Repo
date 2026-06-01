# 📚 Documentation Index

**Last Updated**: 2026-06-01  
**Status**: Active documentation refreshed  
**Language Policy**: Active documentation should remain in English

---

## 🚀 Quick Start

### If you have 5 minutes ⏱️
Read: [../README.md](../README.md)

### If you have 15 minutes ⏱️
Read: [../ROADMAP.md](../ROADMAP.md) and [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md)

### If you want full navigation 📖
**👉 [Go to DOCUMENTATION_INDEX_BY_ROLE.md](./DOCUMENTATION_INDEX_BY_ROLE.md)**

---

## 📖 All Documentation by Category

### 🏢 PROJECT MANAGEMENT
| Document | Purpose |
|----------|---------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current development phase, scores, roadmap |
| [PRD.md](PRD.md) | Product requirements & acceptance criteria |
| [TRACEABILITY.md](TRACEABILITY.md) | Requirements ↔ Code ↔ Tests mapping |

### 🏗️ ARCHITECTURE & DESIGN
| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, layers, patterns |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Folder organization |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST endpoints & contracts |
| [DATABASE.md](DATABASE.md) | Schema & operations |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Code conventions & patterns |

### 🧪 QUALITY ASSURANCE
| Document | Purpose |
|----------|---------|
| [TESTING.md](TESTING.md) | Test strategy, frameworks, CI/CD |
| [framework/IMPLEMENTATION_PLAN.md](framework/IMPLEMENTATION_PLAN.md) | Playwright framework roadmap (Phases 1-5) |
| [framework/FRAMEWORK_ANALYSIS.md](framework/FRAMEWORK_ANALYSIS.md) | Framework evaluation & architecture |
| [framework/FRAMEWORK_INDEX.md](framework/FRAMEWORK_INDEX.md) | Framework quick reference |
| [framework/ARCHITECTURE_DIAGRAMS.md](framework/ARCHITECTURE_DIAGRAMS.md) | Visual diagrams |
| [framework/REFACTORING_EXAMPLES.md](framework/REFACTORING_EXAMPLES.md) | Code examples & patterns |

### 🚀 DEPLOYMENT & OPERATIONS
| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment strategy |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |

### 🧭 ROOT-LEVEL IMPLEMENTATION GUIDES
| Document | Purpose |
|----------|---------|
| [../ROADMAP.md](../ROADMAP.md) | Current implementation status vs missing work |
| [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md) | Week-by-week production plan |
| [../DECISION_FRAMEWORK.md](../DECISION_FRAMEWORK.md) | Decision support |
| [../FOLDER_EXPANSION_PLAN.md](../FOLDER_EXPANSION_PLAN.md) | Testing structure expansion plan |
| [../IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) | Consolidation and implementation history |

### 📚 COMPLIANCE & GOVERNANCE
| Document | Purpose |
|----------|---------|
| [SDD-AUDIT-REPORT.md](SDD-AUDIT-REPORT.md) | Compliance audit |
| [ai-audit-prompt.md](ai-audit-prompt.md) | SDD audit framework instructions |

### 📦 ARCHIVED (Historical Reference)
Located in `archive/` subfolders:
- **[archive/audits/](archive/audits/)** - Historical audit reports
- **[archive/sessions/](archive/sessions/)** - Session summaries & handoff notes
- **[archive/logs/](archive/logs/)** - Documentation update logs

---

## ✅ Documentation Quick Reference

### For Developers
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Project Structure:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **API Contracts:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Database:** [DATABASE.md](DATABASE.md)
- **Coding Standards:** [CODING_STANDARDS.md](CODING_STANDARDS.md)
- **Roadmap:** [../ROADMAP.md](../ROADMAP.md)
- **Production Plan:** [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md)

### For QA/SDET
- **Test Strategy:** [TESTING.md](TESTING.md)
- **Test Architecture:** [TESTING.md](TESTING.md#architecture-rules)
- **CI/CD Pipeline:** [TESTING.md](TESTING.md#ci)
- **QA Audit:** [SDD-AUDIT-REPORT.md](SDD-AUDIT-REPORT.md)
- **Framework Plan:** [framework/IMPLEMENTATION_PLAN.md](framework/IMPLEMENTATION_PLAN.md)
- **Structure Expansion:** [../FOLDER_EXPANSION_PLAN.md](../FOLDER_EXPANSION_PLAN.md)

### For Product / PM
- **PRD:** [PRD.md](PRD.md)
- **Requirements Traceability:** [TRACEABILITY.md](TRACEABILITY.md)
- **Implementation Status:** [../ROADMAP.md](../ROADMAP.md)
- **Production Plan:** [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md)
- **Project Status:** [PROJECT_STATUS.md](PROJECT_STATUS.md)

### For DevOps
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Deployment Checklist:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Docker Setup:** [DATABASE.md](DATABASE.md#start)
- **CI/CD Pipeline:** `.github/workflows/e2e.yml`
- **Release Plan:** [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md)

### For Architects
- **System Design:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Design:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Database Schema:** [DATABASE.md](DATABASE.md#schema)
- **Compliance:** [SDD-AUDIT-REPORT.md](SDD-AUDIT-REPORT.md)

---

## 📊 Current Documentation Health

**Coverage:** Strong for active technical and product documentation  
**Quality:** Good, with some older root documents still pending archival cleanup  
**Completeness:** Core active documentation exists for product, architecture, testing, deployment, and roadmap

**Gap Summary:**
- ✅ Technical specifications: Present
- ✅ Product requirements: Present
- ✅ Implementation planning: Present
- ✅ Deployment strategy: Present
- 🟠 Some historical files still reference superseded documents

See [../IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) for consolidation context.

---

## 🛠️ Document Maintenance

**Update Frequency:**
- **PROJECT_STATUS.md:** After each milestone or monthly
- **Technical Docs:** When architecture/API/schema changes
- **Audit Reports:** Quarterly or after major changes
- **PRD/Requirements:** When scope changes
- **Root navigation docs:** When priorities or active entry points change

**Document Owners:**
- Product docs (PRD, requirements): Product Manager
- Technical docs (Architecture, API): Tech Lead
- Test docs: QA Lead / SDET
- Audit/Compliance: Senior Architect

---

## 🤖 For AI Assistants

**When starting a new session on this project:**

1. **Read [PROJECT_STATUS.md](PROJECT_STATUS.md) first** - Current phase and context
2. **Check [../ROADMAP.md](../ROADMAP.md)** - What's implemented vs missing
3. **Check [../PRODUCTION_READINESS_PLAN.md](../PRODUCTION_READINESS_PLAN.md)** - Current execution plan
4. **Review relevant technical docs** - Based on the task at hand
5. **Update PROJECT_STATUS.md when appropriate** - After meaningful milestones
6. **Follow SDD principles** - Requirements → Spec → Implementation → Tests

**Key Context:**
- Backend admin JWT protection exists
- Frontend admin auth flow still needs completion
- Framework plan is preserved in `framework/IMPLEMENTATION_PLAN.md`
- Active documentation should stay in English

---

**Last Updated:** 2026-06-01  
**Maintained By:** Tech Lead / Project Manager
