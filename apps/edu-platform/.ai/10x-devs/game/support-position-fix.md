# Support Runbook: Player Position Fix

Use this when a player reports being stuck outside the map or in an unreachable location.

## Prerequisites

- `wrangler` CLI installed and authenticated to the Cloudflare account
- Player's account email address

## Step 1: Read current KV state

```bash
wrangler kv key get \
  --binding GAME_STATE \
  "v1-game-state-{player-email}" \
  --namespace-id 20d16620dfdb441a99454c15fea0dc09 \
  --text
```

Copy the full JSON output into `patched-state.json`.

## Step 2: Edit the state

Preserve the full existing JSON object. Change only these fields:

```json
{
  "needsPositionReset": true,
  "currentMap": "m0-awakening",
  "position": { "x": 128, "y": 256 }
}
```

**Safe spawn coordinates per map** (tile × 64px):

| Map          | Safe position               |
|--------------|-----------------------------|
| m0-awakening | `{"x":128,"y":256}` (tile 2×4) |
| m0-crew-room | `{"x":128,"y":128}` (tile 2×2) |
| m0-exam-room | `{"x":128,"y":128}` (tile 2×2) |
| m0-core-ai   | `{"x":128,"y":128}` (tile 2×2) |

If the player's `currentMap` is correct but their position is wrong, keep their map and only override `position` (plus set `needsPositionReset: true`).

Do not replace the state with only the snippet above. The player state also contains progress fields such as `flags`, `quests`, `xp`, `commandHistory`, and `bookmarks`; those must remain in the JSON.

## Step 3: Write the patched state back

```bash
wrangler kv key put \
  --binding GAME_STATE \
  "v1-game-state-{player-email}" \
  --path patched-state.json \
  --namespace-id 20d16620dfdb441a99454c15fea0dc09
```

## Step 4: Instruct the player to reload

Tell the player to hard-reload the game (Ctrl+Shift+R / Cmd+Shift+R). On next load, the game detects `needsPositionReset: true`, places them at the corrected position, and immediately writes the cleared flag back to KV.

## Verification

After the player confirms they can move freely, the fix is complete. No manual Supabase update is needed; the boot-time state save mirrors the corrected state through the normal game-state sync path.
