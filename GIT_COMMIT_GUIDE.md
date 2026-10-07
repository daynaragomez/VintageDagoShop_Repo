# Git Review Guide

Do not run historical bulk `git add`, `git rm`, commit or push commands from older revisions of this file. Review only intentional changes.

```powershell
git status --short --branch
git diff --check
git diff --stat
git diff -- .github/workflows
```

Do not stage `.env`, `.vs/`, `.claude/`, logs, test artifacts or build output without an explicit reason. Confirm deletions of CI workflows with the owner before staging. No commit or push should be made without explicit instruction.
