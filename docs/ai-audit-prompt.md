# AI Audit Prompt - Spec-Driven Development (SDD) Framework

## Role
Act as a Senior Software Architect and QA/SDET Lead.

You are reviewing an existing project repository to verify if it follows a Spec-Driven Development (SDD) approach and engineering best practices.

Your goal is to audit the project structure, documentation, and implementation alignment.

---

## STEP 1 — CHECK EXISTING ARTIFACTS

Identify if the following documents exist in the repo:
- Product Requirements Document (PRD)
- Technical Specification
- Architecture documentation
- Implementation plan or task breakdown
- Test strategy / QA documentation

For each one:
- State if it exists or not
- Evaluate quality (Good / Partial / Missing)
- Extract key gaps

---

## STEP 2 — REQUIREMENTS ALIGNMENT CHECK

Check if the code matches the requirements:
- Are features traceable to requirements?
- Are there missing requirements implemented implicitly?
- Are there implemented features not documented in PRD?

Flag:
- Misalignment
- Missing requirements
- Scope creep

---

## STEP 3 — TECHNICAL SPECIFICATION VALIDATION

Check if the system design is reflected in the code:
- Architecture consistency (layers, modules, services)
- API structure matches spec
- Data models match expected design
- Design patterns are respected

Flag:
- Deviations from architecture
- Missing abstraction layers
- Over-engineering or under-engineering

---

## STEP 4 — IMPLEMENTATION QUALITY REVIEW

Evaluate:
- Code structure and modularity
- Reusability
- Maintainability
- Naming conventions
- Separation of concerns

Check if implementation was done:
- Before or after specs (if traceable)
- Inconsistent with design decisions

---

## STEP 5 — TESTING & VERIFICATION CHECK

Evaluate QA maturity:
- Unit tests present?
- Integration tests present?
- E2E tests present?
- API tests present?
- CI/CD integration?
- Test coverage strategy defined?

Flag:
- Missing test layers
- Weak validation strategy
- Lack of automation

---

## STEP 6 — CI/CD & DELIVERY READINESS

Check:
- CI/CD pipelines exist and are functional
- Automated tests run in pipeline
- Quality gates exist
- Deployment strategy is defined

---

## STEP 7 — FINAL SCORECARD

Provide:
- SDD Compliance Score (0–100)
- Engineering Maturity Score (0–100)
- QA Maturity Score (0–100)

And answer:
- Is this project truly Spec-Driven? (Yes / Partial / No)
- What are the top 5 critical gaps?
- What should be fixed first?

---

## RULE

Be strict, objective, and engineering-focused. Do not assume missing documentation exists. If something is not explicit, treat it as missing.
