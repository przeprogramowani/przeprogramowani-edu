# 06. Jak zapisać pracę (commit AI-generated code)?

**Problem:** "AI wygenerował dużo zmian (10+ plików). Nie wiem jak to commitnąć. Czy jeden duży commit czy wiele małych? Jak opisać że to AI pomógł?"

---

## 🎯 Kiedy użyć tej checklisty?

Użyj tej checklisty gdy:
- ✅ AI wygenerował kod i **jesteś gotowy do commita**
- ✅ Masz **dużo zmian** (multiple files) i nie wiesz jak podzielić na commity
- ✅ Nie wiesz **jak opisać commit message** dla AI-generated kodu
- ✅ Senior powiedział "użyj atomic commits" ale nie wiesz co to znaczy
- ✅ Chcesz nauczyć się **professional git workflow**

**Ile czasu to zajmie:** 10-15 min per commit session

---

## 😤 Typowe frustracje (to co czujesz w głowie)

> **"AI zmienił 15 plików... commit wszystko naraz?"**

> **"Senior review mój PR i mówi 'too many changes in one commit'..."**

> **"Nie wiem jak opisać commit - 'AI code' wystarczy?"**

> **"Co jeśli AI wygenerował kod + testy + docs? Jeden commit czy trzy?"**

> **"Widziałem 'Conventional Commits' ale nie rozumiem jak to stosować..."**

> **"Jak commitnąć tylko część zmian z pliku?"**

**Good news!** Professional git workflow to **konkretne, nawiązujące reguły** których możesz się nauczyć.

**Ta checklist da Ci step-by-step proces commitowania kodu.**

---

## ✅ Pre-Commit Checklist (ALWAYS run before commit!)

**Before `git commit`, ZAWSZE sprawdź:**

### 📍 Step 1: Code Quality (5 min)

- [ ] **Kod kompiluje się**
  ```bash
  npm run build
  # or: tsc --noEmit
  ```

- [ ] **Testy przechodzą**
  ```bash
  npm test
  ```

- [ ] **Linter pass**
  ```bash
  npm run lint
  # If errors: npm run lint -- --fix
  ```

- [ ] **Type checker pass** (TypeScript)
  ```bash
  npm run type-check
  ```

- [ ] **No console.log left** (remove debug logs)
  ```bash
  grep -r "console.log" src/
  # Remove any debug logs
  ```

**Jeśli ANY z powyższych fails → DON'T commit. Fix first.**

---

### 📍 Step 2: Security Check (2 min)

- [ ] **No secrets committed** (API keys, passwords, tokens)
  ```bash
  # Check staged files
  git diff --staged

  # Look for:
  # - API_KEY = "sk-..."
  # - PASSWORD = "..."
  # - .env files
  ```

- [ ] **No sensitive data** (customer emails, phone numbers)

- [ ] **.gitignore is updated** (if adding new file types)
  ```
  # Add to .gitignore:
  .env
  .env.local
  *.log
  node_modules/
  ```

**If secrets found → STOP. Remove secrets, use environment variables.**

---

### 📍 Step 3: Code Review Self-Check (3 min)

- [ ] **Review your changes** (`git diff`)
  ```bash
  git diff  # unstaged changes
  git diff --staged  # staged changes
  ```

- [ ] **Remove unnecessary changes**
  - Formatting changes in unrelated files?
  - Debug code leftover?
  - Commented-out code?

- [ ] **Verify business logic** (does code do what it should?)

**See also:** `04-czy-ten-kod-jest-ok.md` for detailed code review.

---

## 💡 Atomic Commits: Jeden concern = Jeden commit

### ❌ BAD: Giant commit (everything at once)

```bash
git add .
git commit -m "add user dashboard"

# Changed files (15):
# - Dashboard component
# - User API endpoints
# - Database migrations
# - Tests for everything
# - Documentation
# - Unrelated: fixed typo in HomePage
# - Unrelated: updated README
```

**Problem:**
- Hard to review (too many changes)
- Hard to revert (if one part has bug)
- Hard to understand what changed (commit is too broad)

---

### ✅ GOOD: Atomic commits (split by concern)

```bash
# Commit 1: Database
git add src/db/migrations/add-user-stats-table.sql
git commit -m "feat: add user stats database table"

# Commit 2: API
git add src/api/user-stats.ts
git commit -m "feat: add user stats API endpoint"

# Commit 3: Component
git add src/components/UserDashboard.tsx
git commit -m "feat: add UserDashboard component"

# Commit 4: Integration
git add src/pages/dashboard.tsx
git commit -m "feat: integrate UserDashboard into dashboard page"

# Commit 5: Tests
git add src/components/UserDashboard.test.tsx
git add src/api/user-stats.test.ts
git commit -m "test: add tests for user dashboard feature"

# Commit 6: Docs
git add README.md
git commit -m "docs: document user dashboard feature"
```

**Benefits:**
- ✅ Easy to review (one concern per commit)
- ✅ Easy to revert (if just API has bug, revert only commit 2)
- ✅ Clear history (git log shows progression)

---

## 🛠️ How to: Interactive Staging (git add -p)

**Problem:** "AI changed 10 files but I want to commit only 3."

**Solution:** Interactive staging.

### Basic: Stage entire files

```bash
# See what changed
git status

# Stage specific files
git add src/components/Dashboard.tsx
git add src/api/users.ts

# Commit
git commit -m "feat: add user dashboard"
```

---

### Advanced: Stage PARTS of files (git add -p)

**Scenario:** File has 2 changes:
1. Bug fix (want to commit now)
2. New feature (want to commit separately)

```bash
# Interactive staging
git add -p src/utils/pricing.ts

# Git will show hunks (chunks of changes)
# For each hunk:
# y = stage this hunk
# n = don't stage
# s = split hunk into smaller parts
# q = quit
```

**Example session:**
```
diff --git a/src/utils/pricing.ts
@@ -10,7 +10,7 @@ function calculateDiscount(price, tier) {
-  if (tier = 'premium') {  // BUG: = instead of ===
+  if (tier === 'premium') {  // FIXED
     return price * 0.8;
   }
Stage this hunk [y,n,q,a,d,s,e,?]? y

@@ -20,0 +21,5 @@ function calculateDiscount(price, tier) {
+// NEW FEATURE: VIP tier
+  if (tier === 'vip') {
+    return price * 0.5;
+  }
Stage this hunk [y,n,q,a,d,s,e,?]? n
```

**Result:**
- Bug fix is staged → commit it
- New feature is NOT staged → commit later

```bash
git commit -m "fix: use === instead of = in tier comparison"

# Later:
git add -p src/utils/pricing.ts
# Stage the VIP feature
git commit -m "feat: add VIP tier with 50% discount"
```

---

## 📝 Conventional Commits: Professional commit messages

### Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types (use these!):

| Type | Use When | Example |
|------|----------|---------|
| `feat` | Adding new feature | `feat: add dark mode toggle` |
| `fix` | Fixing a bug | `fix: prevent race condition in auth` |
| `refactor` | Code refactoring (no behavior change) | `refactor: extract validation to utils` |
| `test` | Adding/updating tests | `test: add edge cases for payment` |
| `docs` | Documentation only | `docs: update API docs for /users` |
| `chore` | Maintenance (deps, config) | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize database queries` |
| `style` | Code style (formatting, not CSS) | `style: format with Prettier` |

---

### Examples: Bad vs Good

#### ❌ BAD commit messages:
```
fix bug
update stuff
changes
WIP
asdf
done
final version
final version 2
final final version
```

**Problems:** Not descriptive, hard to search, unprofessional.

---

#### ✅ GOOD commit messages:
```
fix: prevent race condition in user authentication flow

feat: add dark mode toggle to user settings
- Add toggle switch in SettingsPage
- Store preference in localStorage
- Apply theme on app load

refactor: extract email validation to utility function

test: add edge cases for discount calculation
- Test negative prices
- Test zero discount
- Test > 100% discount

docs: update README with installation instructions
```

**Why good:**
- ✅ Type prefix (feat, fix, etc.)
- ✅ Descriptive (says WHAT changed)
- ✅ Optional body (explains WHY)
- ✅ Easy to search (`git log --grep="feat:"`)

---

## 💡 Real-World Example: Junior Kasia commits AI code

**Situation:** AI helped Kasia add "forgot password" feature.

**Changes (10 files):**
- `src/pages/forgot-password.tsx` (new page)
- `src/api/auth.ts` (added reset endpoint)
- `src/db/schema.sql` (added reset_tokens table)
- `src/utils/email.ts` (added sendResetEmail)
- `src/components/ResetPasswordForm.tsx` (new component)
- `src/api/auth.test.ts` (tests)
- `src/components/ResetPasswordForm.test.tsx` (tests)
- `README.md` (docs)
- `src/pages/home.tsx` (unrelated: fixed typo)
- `src/utils/validation.ts` (unrelated: formatting)

---

### ❌ Kasia's first attempt (bad):
```bash
git add .
git commit -m "add forgot password feature"
```

**Problems:**
- Too many changes in one commit (10 files!)
- Includes unrelated changes (typo fix, formatting)
- Commit message not descriptive enough

---

### ✅ Kasia's second attempt (good):

**Step 1: Separate unrelated changes**
```bash
# Commit unrelated typo fix first
git add src/pages/home.tsx
git commit -m "fix: correct typo in HomePage component"

# Commit unrelated formatting
git add src/utils/validation.ts
git commit -m "style: format validation utils with Prettier"
```

**Step 2: Split feature into atomic commits**
```bash
# 1. Database schema
git add src/db/schema.sql
git commit -m "feat: add reset_tokens table for password reset"

# 2. Email utility
git add src/utils/email.ts
git commit -m "feat: add sendResetEmail utility function"

# 3. API endpoint
git add src/api/auth.ts
git commit -m "feat: add password reset API endpoint"

# 4. UI Component
git add src/components/ResetPasswordForm.tsx
git commit -m "feat: add ResetPasswordForm component"

# 5. Page
git add src/pages/forgot-password.tsx
git commit -m "feat: add forgot password page"

# 6. Tests
git add src/api/auth.test.ts src/components/ResetPasswordForm.test.tsx
git commit -m "test: add tests for password reset feature"

# 7. Documentation
git add README.md
git commit -m "docs: document password reset flow"
```

**Result:**
- 7 atomic commits (easy to review, easy to revert)
- Clear progression (DB → util → API → UI → page → tests → docs)
- Professional git history

---

## ⚠️ Common Pitfalls & How to Avoid

### 🚨 Pitfall 1: Committing too often

```bash
git commit -m "add button"
git commit -m "fix button color"
git commit -m "fix button text"
git commit -m "fix button again"
```

**Problem:** Too granular, pollutes git history.

**Fix:** Use local commits during dev, then squash before push:
```bash
# During development (feature branch)
git commit -m "WIP: add button"
git commit -m "WIP: fix styles"
git commit -m "WIP: final touches"

# Before pushing (squash into one)
git rebase -i HEAD~3
# Mark last 2 commits as "squash"
# Result: 1 commit "feat: add subscribe button with styling"
```

---

### 🚨 Pitfall 2: Vague commit messages

```
git commit -m "update code"
git commit -m "fix"
git commit -m "changes"
```

**Fix:** Ask yourself:
1. WHAT changed? (which component/file)
2. WHY changed? (what problem does this solve)

```
# Better:
git commit -m "fix: prevent null error in UserProfile when user has no avatar"
```

---

### 🚨 Pitfall 3: Mixing concerns in one commit

```bash
# One commit with:
# - New feature (dashboard)
# - Bug fix (login)
# - Refactor (utils)
```

**Fix:** Separate commits:
```bash
git add src/pages/dashboard.tsx
git commit -m "feat: add user dashboard"

git add src/auth/login.ts
git commit -m "fix: handle expired tokens in login"

git add src/utils/
git commit -m "refactor: extract common utils to separate module"
```

---

## 🎯 Template: Commit Message

**Save this template:**

```markdown
<type>: <short description (50 chars max)>

<Body: Explain WHY this change, not just WHAT>
- Detail 1
- Detail 2
- Detail 3

<Footer: Optional>
Fixes #123
Co-Authored-By: AI Assistant
```

**Examples:**

```
feat: add dark mode toggle to user settings

Users requested ability to switch between light and dark themes.
This commit adds:
- Toggle switch in SettingsPage
- Theme state management using Zustand
- CSS variables for theme colors
- Persistence in localStorage

Fixes #456
```

```
fix: prevent race condition in authentication flow

Users occasionally saw "already logged in" error when clicking
login button multiple times. This was due to:
- No request deduplication
- Button not disabled during request

Fix:
- Disable button on first click
- Add loading state
- Debounce click handler

Fixes #789
```

---

## 📚 Quick Reference: Git Workflow Cheat Sheet

```bash
# 1. Check status
git status

# 2. Review changes
git diff

# 3. Stage specific files
git add <file1> <file2>

# 4. Or stage interactively
git add -p

# 5. Review staged changes
git diff --staged

# 6. Commit with message
git commit -m "feat: add user dashboard"

# 7. Or commit with editor (for longer messages)
git commit
# Editor opens → write message → save

# 8. Amend last commit (if needed)
git commit --amend

# 9. Push to remote
git push origin <branch-name>
```

---

## 🔗 Powiązane checklisty

**Previous steps:**
- [ ] `04-czy-ten-kod-jest-ok.md` - code review przed commitem
- [ ] `05-ai-zepsul-testy.md` - fix tests przed commitem

**Templates:**
- [ ] `templates/pre-commit-checklist.md` - checklist przed każdym commitem

---

## 📚 Gdzie dowiedzieć się więcej?

**Advanced reading:**
- `backup/.../01-core-principles.md` § Git history (linie 940-1005)
- `backup/.../01-core-principles.md` § Conventional Commits (linie 962-999)

**External resources:**
- Conventional Commits: conventionalcommits.org
- Git interactive staging: git-scm.com/book/en/v2/Git-Tools-Interactive-Staging
- Atlassian Git tutorial: atlassian.com/git/tutorials

---

## ✅ Self-assessment

Odznacz gdy poczujesz się komfortowo:

- [ ] Zawsze używam pre-commit checklist (build, test, lint)
- [ ] Rozumiem atomic commits (jeden concern = jeden commit)
- [ ] Potrafię używać `git add -p` (interactive staging)
- [ ] Znam Conventional Commits format (feat, fix, refactor, etc.)
- [ ] Piszę descriptive commit messages (WHAT + WHY)
- [ ] Rozdzielam unrelated changes na osobne commity
- [ ] Przeprowadziłem conajmniej **5 proper commit sessions** używając tej checklisty

**Jeśli wszystko odznaczone:** 🎉 Congratulations! Ukończyłeś wszystkie checklisty!

---

## 💬 FAQ

**Q: Czy powinienem oznaczać w commit message że AI pomógł?**
A: Optional. Możesz dodać w footer: `Co-Authored-By: AI Assistant`. Ale ważniejsze jest WHAT changed, nie WHO helped.

**Q: Jak długi powinien być commit message?**
A: Subject line: max 50 chars. Body: optional, unlimited (ale bądź zwięzły).

**Q: Czy mogę commitnąć z failing tests?**
A: NO! (except: WIP commits in feature branch, with clear "WIP:" prefix).

**Q: Co jeśli zapomniałem dodać plik do commita?**
A: Użyj `git commit --amend` (if not pushed yet) or make new commit.

**Q: Jak często powinienem commitować?**
A: Feature branch: often (WIP commits OK). Main branch: only complete, working code.

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Źródło: `01-core-principles.md` (linie 940-1005, 1513-1525)
- Długość: ~550 linii
- Czas przeczytania: 30-40 min
- Metodologia: Sense-Making (Situation → Gap → Help)
