# Game Position Reset — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-30-game-position-reset-support.md`

## What & Why

A player's character ended up outside the map boundaries due to a game bug. The server-side KV state has the correct map but a wrong position. Patching KV alone doesn't fix it because the client merge rule (`mergeServerProgressIntoLocal`) always treats localStorage as authoritative for `position`, `currentMap`, and `facing` — so the corrupted local value overwrites any KV fix on the next load. We need a mechanism to let a KV edit "win" over localStorage for exactly one load cycle.

## Starting Point

`GameState` (version 2) is persisted in both Cloudflare KV (`v1-game-state-{email}`) and localStorage (`space-explorers-state-v2`). During login merge, navigation fields (position/map/facing) come from localStorage; progress fields (XP/flags/quests) are unioned. Client-side spawn validation (`resolveSafeSpawnPosition`) exists but runs after the bad local position has already been loaded.

## Desired End State

Support edits the player's KV entry with wrangler CLI, setting `needsPositionReset: true` plus corrected coordinates. On the player's next game load, the merge logic detects the flag and takes the server's navigation state as authoritative. The flag clears automatically after the first load and the player's state is healthy in both KV and localStorage.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
|---|---|---|
| Support trigger mechanism | Wrangler CLI direct KV edit | No new endpoint needed; support already has KV access |
| Override mechanism | `needsPositionReset?: boolean` flag in GameState | Self-cleaning, works within existing merge flow, no extra KV namespace |
| Fix scope | `position` + `currentMap` only (`facing` optional) | Surgical — preserves all progress; covers the reported bug |
| Safe position source | Support sets coords manually | No server-side tile scanning needed; support knows the target position |
| Player notification | Silent | No notification layer changes needed |
| Future prevention | Out of scope | Smaller scope; ships faster |
| Manual Supabase sync | Out of scope | Boot-time state save after consuming the reset flag restores consistency through the normal sync path |

## Scope

**In scope:**
- `needsPositionReset?: boolean` field added to `GameState` interface
- `mergeServerProgressIntoLocal()` updated to honour the flag
- Unit tests for the new merge paths
- Support runbook (wrangler CLI steps + safe spawn table)

**Out of scope:**
- Admin API endpoint
- Position boundary validation on PUT
- Player-visible notification
- Supabase manual sync

## Architecture / Approach

Pure client-side mechanism. The flag travels from KV → `GET /api/game/state` response → merge function → cleared before being saved back through the existing state API. No server-side computation of valid positions. The existing loose validator (`isValidGameState`) already passes unknown fields through, so no API changes are needed.

```
Support patches KV: needsPositionReset=true, position={x,y}, currentMap=...
         ↓
Player reloads → GET /api/game/state → state with needsPositionReset=true
         ↓
mergeServerProgressIntoLocal: flag detected → server position wins, flag cleared
         ↓
saveState → localStorage: needsPositionReset=false
         ↓
boot-time PUT /api/game/state when reset was consumed → KV updated, flag gone
```

## Phases at a Glance

| Phase | What it delivers | Key risk |
|---|---|---|
| 1. Extend GameState type | `needsPositionReset?: boolean` in interface | None — additive, optional field |
| 2. Update merge logic | Flag honoured; local nav overridden when set | Existing "local wins" test must stay green |
| 3. Add tests | Explicit coverage of new merge paths | — |
| 4. Support runbook | Wrangler CLI steps + safe spawn coords | Spawn coords need manual verification per map |

**Prerequisites:** None — no migrations, no new secrets, no infra changes  
**Estimated effort:** ~1 session, 3 code files + 1 doc file

## Open Risks & Assumptions

- Safe spawn coordinates listed in the runbook are approximate and should be verified in the game editor before the runbook goes live
- If the player has no local state (first-ever load on a new device), the flag still clears correctly on load — covered by the `localState: null` test case
- Consuming `needsPositionReset: true` must trigger an immediate boot-time `PUT /api/game/state`, even when there are no pending grants
- `needsPositionReset: false` will appear explicitly in KV/localStorage after the fix is applied — this is intentional and harmless

## Success Criteria (Summary)

- Support can patch a player's KV state and the player's next reload places them at the correct position
- No player progress (XP, quests, flags) is lost by the fix
- `needsPositionReset` does not persist past the first load cycle
