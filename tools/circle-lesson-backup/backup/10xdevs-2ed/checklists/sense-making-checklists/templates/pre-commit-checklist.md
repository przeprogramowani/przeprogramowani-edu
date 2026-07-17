# Pre-Commit Checklist

**Use this checklist BEFORE every `git commit`.**

Print this out or save as IDE snippet to use daily.

---

## ✅ Quick Checklist (5 min - minimum viable)

**Before committing, ALWAYS check:**

- [ ] **Code compiles**
  ```bash
  npm run build
  # or: tsc --noEmit
  ```

- [ ] **Tests pass**
  ```bash
  npm test
  ```

- [ ] **No obvious errors in browser/terminal**
  - Open app in browser
  - Check console for errors
  - Try basic user flows

- [ ] **Reviewed my changes**
  ```bash
  git diff --staged
  ```

- [ ] **No secrets/sensitive data**
  - No API keys, passwords, tokens
  - No customer emails, phone numbers
  - Check .env is in .gitignore

**If ANY fails → DON'T commit. Fix first.**

---

## ✅ Full Checklist (15 min - recommended for important commits)

### Section 1: Code Quality

- [ ] **Build succeeds**
  ```bash
  npm run build
  ```

- [ ] **All tests pass**
  ```bash
  npm test
  ```

- [ ] **Linter passes**
  ```bash
  npm run lint
  # Auto-fix: npm run lint -- --fix
  ```

- [ ] **Type checker passes** (TypeScript)
  ```bash
  npm run type-check
  # or: tsc --noEmit
  ```

- [ ] **No console.log left** (remove debug logs)
  ```bash
  grep -r "console.log" src/
  ```

---

### Section 2: Security & Safety

- [ ] **No secrets committed**
  - API keys (STRIPE_SECRET_KEY, OPENAI_API_KEY, etc.)
  - Passwords
  - Database credentials
  - JWT secrets
  - .env files

  ```bash
  # Check staged changes
  git diff --staged | grep -i "api_key\|password\|secret"
  ```

- [ ] **No sensitive customer data**
  - Customer emails
  - Phone numbers
  - Credit card info
  - Personal data (GDPR!)

- [ ] **.gitignore is up-to-date**
  ```
  .env
  .env.local
  *.log
  node_modules/
  dist/
  .DS_Store
  ```

---

### Section 3: Code Review (self)

- [ ] **Reviewed ALL changes**
  ```bash
  git diff --staged
  ```

- [ ] **No unnecessary changes**
  - Removed debug code
  - Removed commented-out code
  - No formatting changes in unrelated files

- [ ] **Code is clean**
  - Variable names are descriptive
  - Functions do ONE thing
  - No magic numbers (use named constants)

- [ ] **Edge cases handled**
  - Null/undefined checks
  - Empty arrays/strings
  - Error handling (try-catch)

---

### Section 4: Tests & Documentation

- [ ] **Existing tests still pass** (no regressions)
  ```bash
  npm test
  ```

- [ ] **New code has tests** (if applicable)
  - Unit tests for new functions
  - Integration tests for new APIs
  - Component tests for new UI

- [ ] **Comments added** (where needed)
  - Why (not what) - explain reasoning
  - Complex logic explained
  - TODO/FIXME with context

- [ ] **Documentation updated** (if needed)
  - README updated
  - API docs updated
  - Inline JSDoc for public APIs

---

### Section 5: Git Hygiene

- [ ] **Commit message is ready**
  - Conventional Commits format: `type: description`
  - Subject < 50 chars
  - Descriptive (WHAT and WHY)

  ```
  ✅ Good: feat: add dark mode toggle to settings
  ❌ Bad:  update code
  ```

- [ ] **Atomic commit** (one concern only)
  - Not mixing: feature + bug fix + refactor
  - Split large changes into multiple commits

- [ ] **Only related files staged**
  ```bash
  git status  # Check what's staged
  ```

---

## 🚨 Red Flags (STOP if you see these)

**DON'T commit if:**

- ❌ Build fails
- ❌ Tests are red
- ❌ Linter has errors (warnings OK)
- ❌ You see `console.log` in production code
- ❌ You see hardcoded secrets (API_KEY = "sk-...")
- ❌ You haven't reviewed the diff
- ❌ Commit message is "WIP" or "fix" (unless feature branch)

**Fix these issues FIRST, then commit.**

---

## 📋 Printable Checklist (stick on your monitor!)

```
┌─────────────────────────────────────────────┐
│         PRE-COMMIT CHECKLIST                │
│─────────────────────────────────────────────│
│  Before every git commit:                   │
│                                             │
│  ☐ npm run build  (compiles)               │
│  ☐ npm test       (all green)              │
│  ☐ npm run lint   (passes)                 │
│  ☐ git diff --staged (reviewed)            │
│  ☐ No secrets     (API keys, passwords)    │
│  ☐ No console.log (removed debug)          │
│  ☐ Clean commit message (conventional)     │
│                                             │
│  If ANY fails → DON'T commit!              │
└─────────────────────────────────────────────┘
```

---

## How to Use This Checklist

### Option 1: Manual (print this page)
1. Print this checklist
2. Stick on monitor
3. Go through items before each commit

### Option 2: IDE Snippet
1. Save as snippet in your IDE
2. Type `precommit` + Tab
3. Checklist expands

### Option 3: Git Hook (automated!)
1. Create `.git/hooks/pre-commit` file
2. Add checks (build, test, lint)
3. Git runs automatically before commit

**Example pre-commit hook:**
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# 1. Run tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix before committing."
  exit 1
fi

# 2. Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linter failed. Run 'npm run lint -- --fix'"
  exit 1
fi

# 3. Check for secrets
if git diff --staged | grep -qi "api_key\|password\|secret_key"; then
  echo "⚠️  WARNING: Possible secret detected!"
  echo "Review staged changes before committing."
  exit 1
fi

echo "✅ All checks passed. Proceeding with commit..."
exit 0
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Related Checklists

- `04-czy-ten-kod-jest-ok.md` - Detailed code review checklist
- `05-ai-zepsul-testy.md` - What to do if tests fail
- `06-jak-zapisac-prace.md` - How to write good commit messages

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Use: Before EVERY commit
- Time: 5 min (quick) / 15 min (full)
- Copy-paste ready: YES
