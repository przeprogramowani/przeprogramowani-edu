# "Coming Soon" Cinematic After q-earth-signal — Implementation Plan

## Overview

Append a cinematic "coming soon" message to the end of the `m0-earth-signal-complete` dialogue, shown after the player completes the `q-earth-signal` quest. The message tells players the mission prep is complete and the next chapter unlocks on May 18 for 10xdevs.pl 3.0 participants.

## Current State Analysis

- Quest `q-earth-signal` is defined in `src/explorers/levels/m0-core-ai/quests.ts`
- The manifest (`src/explorers/levels/m0-core-ai/manifest.ts`, line 48) maps quest completion to dialogue `m0-earth-signal-complete`
- That dialogue lives in `src/explorers/levels/m0-core-ai/dialogues.ts` (lines 388–486)
- It currently ends with three astronaut monologue lines and `onComplete: { setFlags: [FLAGS.CMDS_BADGES] }`

## Desired End State

After the player answers the `q-earth-signal` quest correctly, the existing completion dialogue plays (chapter complete, virus reveal, /badges hint), then three additional cinematic lines appear with the "coming soon" message before the dialogue ends.

## What We're NOT Doing

- No new flags, quests, or dialogues
- No changes to the manifest or quest definitions
- No new files

## Implementation Approach

Add three `cinematic` mode lines at the end of the `m0-earth-signal-complete` dialogue's `lines` array, before the `onComplete` effect. The lines use `autoAdvance` for pacing.

## Phase 1: Add Cinematic Lines

### Changes Required

**File**: `src/explorers/levels/m0-core-ai/dialogues.ts`

Append three lines to the `m0-earth-signal-complete.lines` array, after the last monologue line (`'Odpowiedzi przyjdą z czasem...'`) and before the closing `]`:

```typescript
      {
        speaker: 'system',
        text: '═════════════════════════════',
        mode: 'cinematic',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: 'Przygotowania do misji zakończone.',
        mode: 'cinematic',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: 'Ciąg dalszy 18 maja — pełna zawartość zostanie odblokowana dla uczestników szkolenia 10xdevs.pl 3.0',
        mode: 'cinematic',
        autoAdvance: 5000,
      },
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles: `npm run build` (from edu-platform workspace)
- [ ] Tests pass: `npm run test`

#### Manual Verification

- [ ] Complete `q-earth-signal` quest in-game and confirm the full dialogue plays including the new cinematic lines at the end
- [ ] Confirm the /badges command still unlocks after the dialogue

## References

- Dialogue file: `src/explorers/levels/m0-core-ai/dialogues.ts:388-486`
- Manifest mapping: `src/explorers/levels/m0-core-ai/manifest.ts:48`
- Quest definition: `src/explorers/levels/m0-core-ai/quests.ts`
- Cookbook (cinematic mode docs): `.ai/10x-devs/game/cookbook.md:188`
