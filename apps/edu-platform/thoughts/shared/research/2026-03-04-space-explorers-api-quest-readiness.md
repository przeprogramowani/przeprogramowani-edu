---
date: 2026-03-04T00:00:00+01:00
researcher: Claude Code
git_commit: 8f2d86059c9eb1f366a54bf7dfb32f315044b3f0
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "Is the game ready for first api-based quest?"
tags: [research, game, api, quest, explorers]
status: complete
last_updated: 2026-03-04
last_updated_by: Claude Code
---

# Research: Game Readiness for First API-Based Quest

**Date**: 2026-03-04
**Researcher**: Claude Code
**Git Commit**: `8f2d8605`
**Branch**: master

## Research Question

In the context of the Space Explorers External API plan, the player can now generate a token via `/support` and sees the link to the repo. Is the game ready for the first api-based quest?

## Summary

**Infrastructure: fully implemented.** All 6 phases of the plan are done — API endpoints, token manager, rate limiter, SmartTerminal command, Supabase migration. One production config item is pending (KV namespace ID placeholder).

**Content: missing.** No `api-answer` quest is defined in any level manifest. The system is wired up and waiting for the first actual quest to be authored.

**Verdict: Not yet ready. One quest definition needs to be added to a level manifest.**

---

## Detailed Findings

### What IS implemented (all phases complete)

| Component | File | Status |
|-----------|------|--------|
| `ApiAnswerQuest` type | `src/explorers/systems/QuestManager.ts:45-51` | ✅ |
| `getAllQuests()` helper | `src/explorers/levels/index.ts:22-30` | ✅ |
| `apiTokenManager.ts` | `src/server/game/apiTokenManager.ts` | ✅ |
| `kvRateLimiter.ts` | `src/server/kvRateLimiter.ts` | ✅ |
| `GET /api/game/token` | `src/pages/api/game/token.ts` | ✅ |
| `GET /api/game/mission` | `src/pages/api/game/mission.ts` | ✅ |
| `POST /api/game/submit` | `src/pages/api/game/submit.ts` | ✅ |
| `/support` command | `src/explorers/SmartTerminal.svelte:166-240` | ✅ |
| Supabase migration | `supabase/migrations/20260304000000_game_api_tokens.sql` | ✅ |
| `GAME_API_TOKENS` KV binding declared | `wrangler.toml:6-12` | ⚠️ placeholder ID |

### What's blocking the first api-based quest

#### 1. No `api-answer` quest defined — CRITICAL

All 4 level manifests were checked:

| Level | Quests | api-answer? |
|-------|--------|-------------|
| `m0-awakening/manifest.ts` | none | ❌ |
| `m0-crew-room/manifest.ts` | none | ❌ |
| `m0-exam-room/manifest.ts` | 1 (`EventQuest` — `q-pass-exams`) | ❌ |
| `m0-core-ai/manifest.ts` | none | ❌ |

To enable the first API quest, add an `ApiAnswerQuest` to an appropriate level manifest with:
- `completionType: 'api-answer'`
- `answerHash`: SHA-256 hex of the canonical answer (trimmed + lowercased)
- `hint`: Polish-language hint for wrong answers
- `rewards.xp` and `rewards.flags`

#### 2. `GAME_API_TOKENS` KV namespace ID — production config

`wrangler.toml:11` has `id = "REPLACE_WITH_REAL_KV_ID"`. This must be replaced with the real Cloudflare KV namespace ID before the submit/mission endpoints work in production (they require `ENV === 'PROD'` and KV to be available).

### `/support` command flow

The command has a gate: `m0-support-calibrated` flag must be set.
- Without flag → shows "Uplink nie skalibrowany" error
- With flag → shows GitHub repo URL (`github.com/przeprogramowani/10x-explorers-hq`) + fetches token from `/api/game/token`

Since the player can already see the token and repo link, the flag is set and the full flow works.

---

## Code References

- `src/explorers/systems/QuestManager.ts:45-51` — `ApiAnswerQuest` interface definition
- `src/explorers/levels/index.ts:22-30` — `getAllQuests()` helper
- `src/explorers/levels/m0-exam-room/manifest.ts:6-41` — only level with quests (EventQuest)
- `src/pages/api/game/mission.ts` — returns active quest if `completionType === 'api-answer'`
- `src/pages/api/game/submit.ts` — SHA-256 answer validation + state update
- `src/server/game/apiTokenManager.ts` — token generation & KV resolution
- `wrangler.toml:11` — placeholder KV ID that needs replacing

---

## What Needs To Happen Next

1. **Author first `ApiAnswerQuest`** in one of the level manifests — this is the only content gap.
   Example skeleton:
   ```typescript
   {
     id: 'q-hq-first-contact',
     completionType: 'api-answer',
     title: 'Pierwszy kontakt z HQ',
     briefing: 'Połącz się z repozytorium HQ i wykonaj pierwszą misję nawigacyjną.',
     answerHash: '<sha256 of canonical answer>',
     hint: 'Sprawdź plik README w repozytorium HQ.',
     rewards: { xp: 20, flags: ['m0-hq-contacted'] },
   }
   ```

2. **Replace KV namespace ID** in `wrangler.toml` (if not already done in CF dashboard).

3. Make the quest `active` in game state for the player (either via quest activation logic or manual KV edit for testing).

---

## Open Questions

- Which level should host the first `api-answer` quest? `m0-core-ai` seems thematically appropriate (after the player calibrates the uplink).
- Is the HQ GitHub repository (`10x-explorers-hq`) set up with the quest content/README the player needs to interact with?
- Has `GAME_API_TOKENS` KV namespace been created in the Cloudflare dashboard and the real ID substituted?
