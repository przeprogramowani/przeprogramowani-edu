---
bootstrapped_at: 2026-05-10T11:42:07Z
starter_id: 10x-astro-starter
starter_name: Astro minimal with Tailwind
project_name: 10xCards
language_family: typescript
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: npm audit
---

## Hand-off

```yaml
starter_id: 10x-astro-starter
bootstrapper_confidence: first-class
path_taken: standard
has_auth: true
has_ai: true
has_payments: false
deployment_target: cloudflare-pages
```

### Why this stack

PRD specifies a multi-page web app with auth, AI-powered flashcard generation, and Cloudflare Pages deployment. Astro with server-side rendering and Svelte islands matches the product type (content-heavy with interactive pockets), the deployment target (first-class Cloudflare adapter), and the timeline (one-week MVP).

## Pre-scaffold verification

| Signal | Value | Severity | Notes |
| --- | --- | --- | --- |
| npm package | create-astro v5.0.10 published 2026-03-14 | stale | Last publish 57 days ago — outside 30-day freshness window |
| GitHub repo | withastro/astro last pushed 2026-05-09 | fresh | Active development continues on main |

> ⚠️ **WARNED — starter package stale.** The `create-astro` npm package was last published 57 days ago. The GitHub repo is actively developed, so this likely reflects a release cadence gap rather than abandonment. Recommendation: proceed, but verify generated `package.json` versions against current Astro releases after scaffold.

## Scaffold log

**Resolved invocation**: `npm create astro@latest -- --template minimal --no-install`
**Strategy**: subdir-then-move
**Exit code**: 0
**Files moved**: 14
**Conflicts (.scaffold siblings)**: none
**.gitignore handling**: append-merged
**.bootstrap-scaffold cleanup**: deleted

## Post-scaffold audit

**Tool**: npm audit
**Summary**: 0 CRITICAL, 0 HIGH, 2 MODERATE, 1 LOW

**Direct vs transitive**: 0/0/1/0 direct of total 0/0/2/1

#### CRITICAL findings

(none)

#### HIGH findings

(none)

#### MODERATE findings

1. **postcss** v8.4.31 — ReDoS in CSS parsing (GHSA-7fh5-64p2-3v2j). Fix: upgrade to >=8.4.32. Transitive via `astro > vite > postcss`.
2. **undici** v5.28.3 — HTTP request smuggling via malformed headers (GHSA-3787-6prn-h9w3). Fix: upgrade to >=5.28.4. Direct dependency via `astro`.

#### LOW / INFO findings

1. **semver** v7.5.4 — ReDoS on untrusted input (GHSA-c2qf-rxjj-qqgw). Fix: upgrade to >=7.5.5. Transitive via `npm > @npmcli/metavuln-calculator > semver`.

> ⚠️ **WARNED — 2 moderate findings.** No critical or high severity issues. Moderate findings are in widely-used transitive dependencies with known fixes. These do not block development but should be tracked for resolution before production deployment or CI/CD setup (M1L5).

## Hints recorded but not acted on

| Hint | Value |
| --- | --- |
| bootstrapper_confidence | first-class |
| quality_override | false |
| path_taken | standard |
| has_auth | true |
| has_ai | true |
| has_payments | false |
| deployment_target | cloudflare-pages |
| ci_provider | null |
| ci_default_flow | null |
| team_size | 1 |

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified — happy hacking.

Useful manual steps in the meantime:
- `git init` (if you have not already) to start your own repo history.
- Review any `.scaffold` siblings the conflict policy created and decide which version of each file to keep.
- Address audit findings per your project's risk tolerance — the full breakdown is in this log.
