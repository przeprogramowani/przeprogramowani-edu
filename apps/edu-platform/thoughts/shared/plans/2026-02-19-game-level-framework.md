# Unified Level-Building Framework Implementation Plan

## Overview

Replace the current scattered 11-step, 8+ file process for adding a game level with a **Level Manifest pattern**. Each level becomes a self-contained directory under `src/explorers/levels/` with a manifest that declares map identity, dialogues, interaction routes, quests, and quest completion wiring. A runtime level loader auto-discovers manifests, registers all content globally, and provides route resolution for `GameScene`. The `DialogueEffect` type is expanded from the `setFlag`/`setFlag2` hack to a proper `setFlags: string[]` array.

## Current State Analysis

Adding a new level today requires editing **11 different locations across 8+ files**:

1. Create Tiled JSON map file in `public/game/maps/`
2. Register display name in `mapRegistry.ts`
3. Add to `KNOWN_TARGET_MAPS` in `editorConstants.ts`
4. Create dialogue JSON files in `data/dialogues/`
5. Add static imports to `DialogueManager.ts`
6. Register dialogues in `DialogueManager.loadAllDialogues()`
7. Create quest JSON in `data/quests/`
8. Add static imports to `QuestManager.ts`
9. Add quest→dialogue mapping to `QUEST_COMPLETION_DIALOGUES` constant
10. Add hardcoded `if`/`else` in `GameScene.handleInteraction()` for flag-gated dialogues
11. Add event IDs to `KNOWN_EVENT_IDS` in `editorConstants.ts`

### Key Discoveries:

- **Hardcoded dialogue routing in GameScene** (`GameScene.ts:339-363`): `handleInteraction()` has explicit `if (obj.objectId === 'holo-projector')` branches for 2 objects. Every new flag-gated interaction requires more branching here.
- **Static imports in DialogueManager** (`DialogueManager.ts:6-12`): 7 static imports — every new dialogue JSON requires a new import + registration line.
- **Static imports in QuestManager** (`QuestManager.ts:4-5`): 2 static imports + hardcoded `QUEST_COMPLETION_DIALOGUES` map (`QuestManager.ts:23-27`).
- **DialogueEffect hack** (`DialogueTypes.ts:10-16`): `setFlag2` field exists solely because the original design only supported one flag per completion. Used in `quest-2-complete.json`.
- **Editor constants manual sync** (`editorConstants.ts:1-20`): 18 hardcoded event IDs. `KNOWN_TARGET_MAPS` already derives from `mapRegistry`, but event IDs are fully manual.
- **4 existing maps**: `m0-001-ship`, `ship-hibernation`, `ship-corridor`, `ship-bridge` — all in `public/game/maps/` with display names in `mapRegistry.ts`.
- **Cinematic intro hardcoded** (`GameScene.ts:279`): `if (this.mapKey === 'm0-001-ship')` — future levels with intro sequences would need more hardcoding.

## Desired End State

After this plan is complete:

1. **Adding a new level = adding a directory** under `src/explorers/levels/<level-id>/` with:
   - `manifest.ts` — single source of truth for the level
   - `dialogues.ts` — all dialogue sequences for the level
   - `quests.ts` — quest definitions (optional)

2. **Zero runtime files need editing** — no more touching `GameScene.ts`, `DialogueManager.ts`, `QuestManager.ts`, `mapRegistry.ts`, or `editorConstants.ts` when adding content.

3. **DialogueEffect supports arrays** — `setFlags: string[]` replaces `setFlag`/`setFlag2`.

4. **Editor constants auto-derive** from loaded manifests.

5. **Verification**: `npm run build` succeeds, all existing game behavior is identical (same dialogue sequences, same flag gating, same quest flow, same cinematic intro).

### Key Discoveries:

- `DialogueManager.applyEffects()` (`DialogueManager.ts:108-126`) will need to handle both old `setFlag`/`setFlag2` during migration transition, then only `setFlags[]`.
- `BaseScene.hasFlag()` (`BaseScene.ts:43-45`) provides O(1) lookups via cached Set — route resolution can safely call this in the hot path.
- `getMapAssets()` (`AssetManifest.ts:23-31`) already derives map URL from key by convention — manifest doesn't need to duplicate the path.
- Zones in Tiled maps already have `requiredFlag` property (`InteractiveObject.ts:51-53`) — the `interactionRoutes` in manifests handle the *dialogue variant* selection, not the zone visibility.
- `GameScene.ts:279`: cinematic intro check is map-key-specific — manifest `introDialogue` + `introFlag` fields generalize this.
- `commandHandler.ts:48-98`: `/help` and `/status` commands reference `quest-1-complete` flag directly — these remain hardcoded for now (out of scope; terminal command extensibility is a separate concern).

## What We're NOT Doing

- **Moving map JSON files** — maps stay in `public/game/maps/`, referenced by key convention
- **Building a manifest editor UI** — editor remains a pure map editor
- **Dynamic code-splitting** — all manifests loaded statically at boot (4 maps today, trivial size)
- **Terminal command extensibility** — `commandHandler.ts` flag references stay as-is
- **Changing quest validation logic** — `QuestManager.validate()` unchanged
- **Changing dialogue display system** — `DialogueScene`, `DialogueBar`, `TypewriterEffect` untouched
- **Changing zone parsing** — `GameScene` Tiled zone parsing loop unchanged
- **Changing state shape** — `DemoGameState` unchanged

## Implementation Approach

All level manifests are **loaded at boot** and their content (dialogues, quests) is **registered globally**. This avoids per-map loading complexity and allows cross-level dialogue references. The level loader provides a `getInteractionRoutes(mapKey)` function that `GameScene` calls to resolve flag-gated dialogues.

The migration is incremental: each phase produces a working game. Phases 1-2 add new code alongside existing code. Phase 3 wires the new code. Phase 4 removes the old code. Phase 5 adds editor integration.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Boot-time loading**: Level manifests are loaded in `levelLoader.loadAll()` called from `BootScene.create()`, before any game scene starts. This guarantees all dialogues and quests are registered before the first interaction.
- **Scene restart safety**: `GameScene` restarts on map transitions (`TransitionScene` calls `scene.start(SceneKey.GAME, { mapKey, ... })`). The level loader is initialized once and survives scene restarts since it lives on the game-level event bus / module scope.
- **No race conditions**: Loading is synchronous (static imports compiled by bundler). No async loading or dynamic `import()`.

### State Management Sequencing

- **Route resolution order**: `interactionRoutes.flagVariants` are checked in array order — **first matching flag wins**. This means more specific flags (e.g. `quest-2-complete`) should be listed before more general ones. The `defaultDialogue` is the fallback when no flag matches.
- **Existing event flow unchanged**: `handleInteraction()` → `startDialogue()` → `DIALOGUE_SHOW` → `DialogueScene` → `DialogueManager.advance()` → `applyEffects()` — the only change is how `dialogueId` is determined in `handleInteraction()`.

### User Experience Specification

- **No visible change**: The game plays identically before and after migration. Same dialogues, same flag gating, same quest flow, same cinematic.
- **No loading screens**: All content is bundled statically — zero runtime fetching.

### Performance & Optimization Strategy

**N/A**: With 4 levels and ~25 dialogue sequences total, there is no meaningful performance concern. All data is loaded once at boot.

### Debug & Observability Plan

- **Level loader logging**: `devLog` messages listing how many levels, dialogues, quests, and routes were registered at boot.
- **Route resolution logging**: `devLog` in `handleInteraction()` showing which route was matched and which dialogue was selected.
- **Manifest validation**: A build-time check that all dialogue IDs referenced in `interactionRoutes` and `questCompletionDialogues` exist in the level's `dialogues` export.

---

## Phase 1: Foundation — Types & DialogueEffect Expansion

### Overview

Create the `LevelManifest` type system and expand `DialogueEffect` to support flag arrays. This phase produces no behavioral changes — only new types and a backward-compatible effect handler.

### Changes Required:

#### 1. Create `src/explorers/levels/types.ts`

**File**: `src/explorers/levels/types.ts` (new)
**Changes**: Define `LevelManifest`, `InteractionRoute`, and `LevelDialogues` types.

```typescript
import type { DialogueSequence } from '../systems/DialogueTypes';
import type { QuestDefinition } from '../systems/QuestManager';

export interface InteractionRoute {
  /** Matches zone objectId in Tiled map */
  zoneId: string;
  /** Default dialogue ID when no flag variant matches */
  defaultDialogue: string;
  /** Flag-gated dialogue variants, checked in order — first match wins */
  flagVariants?: {
    flag: string;
    dialogue: string;
  }[];
}

export interface LevelManifest {
  /** Map key — must match Tiled JSON filename in public/game/maps/ */
  id: string;
  /** Polish display name for HUD */
  displayName: string;

  /** All dialogue sequences for this level (keyed by dialogue ID) */
  dialogues: Record<string, DialogueSequence>;

  /** Dialogue routing — replaces hardcoded if/else in GameScene */
  interactionRoutes: InteractionRoute[];

  /** Quest definitions for this level (optional) */
  quests?: QuestDefinition[];

  /** Quest completion → dialogue mapping (optional) */
  questCompletionDialogues?: Record<string, string>;

  /** Intro dialogue played on first visit (optional) */
  introDialogue?: string;
  /** Flag to mark intro as seen — prevents replay (optional) */
  introFlag?: string;
}
```

#### 2. Expand `DialogueEffect` in `DialogueTypes.ts`

**File**: `src/explorers/systems/DialogueTypes.ts`
**Changes**: Add `setFlags?: string[]` field. Keep `setFlag` and `setFlag2` temporarily for backward compat during migration.

```typescript
export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  /** @deprecated Use setFlags instead */
  setFlag?: string;
  /** @deprecated Use setFlags instead */
  setFlag2?: string;
  /** Flags to set on dialogue completion */
  setFlags?: string[];
  triggerEvent?: string;
}
```

#### 3. Update `DialogueManager.applyEffects()`

**File**: `src/explorers/systems/DialogueManager.ts`
**Changes**: Handle `setFlags[]` array in addition to legacy `setFlag`/`setFlag2`.

Replace `applyEffects` method (lines 108-126):

```typescript
private applyEffects(effects?: DialogueEffect): void {
  if (!effects) return;

  // New array-based flags
  if (effects.setFlags) {
    for (const flag of effects.setFlags) {
      this.bus.emit(GameEvents.FLAG_SET, { flag });
    }
  }
  // Legacy single-flag fields (backward compat during migration)
  if (effects.setFlag) {
    this.bus.emit(GameEvents.FLAG_SET, { flag: effects.setFlag });
  }
  if (effects.setFlag2) {
    this.bus.emit(GameEvents.FLAG_SET, { flag: effects.setFlag2 });
  }
  if (effects.activateQuest) {
    this.bus.emit(GameEvents.QUEST_ACTIVATED, { questId: effects.activateQuest, title: '' });
  }
  if (effects.completeQuest) {
    this.bus.emit(GameEvents.QUEST_COMPLETED, { questId: effects.completeQuest, rewards: { xp: 0, flags: [] } });
  }
  if (effects.triggerEvent) {
    this.bus.emit(effects.triggerEvent);
  }
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] `LevelManifest` type is importable from `src/explorers/levels/types.ts`
- [x] `DialogueEffect` accepts both `setFlag` and `setFlags` properties

#### Manual Verification:

- [ ] Game plays identically — no behavior change in this phase
- [ ] Quest 2 completion still sets both `quest-2-complete` and `demo-complete` flags (via legacy `setFlag`/`setFlag2`)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Create Level Manifests

### Overview

Create the `src/explorers/levels/` directory structure with manifest + dialogue + quest files for all 4 existing maps. Dialogues are migrated to the new `setFlags` format. At the end of this phase, the new files exist alongside the old ones — nothing reads from them yet.

### Changes Required:

#### 1. Dialogue-to-Level Assignment

Based on the Tiled map zones and the demo milestone spec, dialogues are assigned to levels:

| Level | Interaction Dialogues | Story Dialogues | Quest Dialogues |
|-------|----------------------|-----------------|-----------------|
| `m0-001-ship` | `examine-pod`, `dead-screen`, `notice-board`, `find-keycode` | `awakening-monologue` | — |
| `ship-hibernation` | `examine-pod`, `dead-screen`, `notice-board`, `find-keycode` | — | — |
| `ship-corridor` | `damaged-panel`, `oxygen-tank`, `window-1`, `window-2` | — | — |
| `ship-bridge` | `terminal-first-use`, `holo-projector-off`, `holo-projector-on`, `captain-chair`, `station-nav`, `station-comms`, `station-eng`, `data-console`, `star-map-off` | `first-contact`, `quest-1-activation`, `quest-1-complete`, `quest-2-complete` | `demo-quest-1`, `demo-quest-2` |

Note: `m0-001-ship` and `ship-hibernation` share the same interaction objects since both are hibernation rooms. The `awakening-monologue` belongs to `m0-001-ship` because the cinematic intro fires there. Dialogue IDs must remain globally unique — shared dialogues are defined in ONE level and referenced by ID from other levels.

**Decision**: Shared hibernation dialogues (`examine-pod`, `dead-screen`, `notice-board`, `find-keycode`) are defined in `m0-001-ship` (the primary starting map) and referenced by `ship-hibernation` via the same dialogue IDs. Since all dialogues are registered globally, `ship-hibernation` can reference them without redefinition.

#### 2. Create level directories

**Directory structure** (new files):

```
src/explorers/levels/
├── types.ts                          # (created in Phase 1)
├── index.ts                          # Exports all manifests
├── levelLoader.ts                    # (created in Phase 3)
├── m0-001-ship/
│   ├── manifest.ts
│   └── dialogues.ts
├── ship-hibernation/
│   ├── manifest.ts
│   └── dialogues.ts
├── ship-corridor/
│   ├── manifest.ts
│   └── dialogues.ts
└── ship-bridge/
    ├── manifest.ts
    ├── dialogues.ts
    └── quests.ts
```

#### 3. `src/explorers/levels/m0-001-ship/dialogues.ts`

**File**: `src/explorers/levels/m0-001-ship/dialogues.ts` (new)

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  'awakening-monologue': {
    id: 'awakening-monologue',
    lines: [
      { speaker: 'astronaut', text: 'Systemy offline. CORE nie odpowiada.', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Jak długo byłem nieprzytomny?', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Terminal jest zablokowany... Gdzieś na statku musi być kod awaryjny.', mode: 'monologue' },
    ],
  },
  'examine-pod': {
    id: 'examine-pod',
    lines: [{ speaker: 'astronaut', text: 'Tu się obudziłem... Maszyna jeszcze ciepła.', mode: 'monologue' }],
  },
  'dead-screen': {
    id: 'dead-screen',
    lines: [{ speaker: 'system', text: 'Ekran offline. Brak zasilania.', mode: 'system', autoAdvance: 2000 }],
  },
  'notice-board': {
    id: 'notice-board',
    lines: [{ speaker: 'astronaut', text: 'Stare notatki załogi... listy kontrolne... Nic przydatnego do odblokowania terminala.', mode: 'monologue' }],
  },
  'find-keycode': {
    id: 'find-keycode',
    lines: [
      { speaker: 'astronaut', text: 'Szafka awaryjna... Zobaczmy co tu jest.', mode: 'monologue' },
      { speaker: 'astronaut', text: 'Procedury awaryjne... jest!', mode: 'monologue' },
      { speaker: 'astronaut', text: '"W przypadku blokady systemów użyj kodu: 0451."', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'To musi być kod do terminala.', mode: 'monologue' },
    ],
    onComplete: { setFlags: ['keycode-found'] },
  },
};
```

#### 4. `src/explorers/levels/m0-001-ship/manifest.ts`

**File**: `src/explorers/levels/m0-001-ship/manifest.ts` (new)

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'm0-001-ship',
  displayName: 'Pokój hibernacyjny',
  dialogues,
  interactionRoutes: [
    { zoneId: 'examine-pod', defaultDialogue: 'examine-pod' },
    { zoneId: 'dead-screen', defaultDialogue: 'dead-screen' },
    { zoneId: 'notice-board', defaultDialogue: 'notice-board' },
    { zoneId: 'find-keycode', defaultDialogue: 'find-keycode' },
  ],
  introDialogue: 'awakening-monologue',
  introFlag: 'intro-seen',
};
```

#### 5. `src/explorers/levels/ship-hibernation/dialogues.ts`

**File**: `src/explorers/levels/ship-hibernation/dialogues.ts` (new)

Note: `ship-hibernation` shares the same interaction objects as `m0-001-ship`. Since dialogues are registered globally, it references the same IDs — no need to redefine them. An empty dialogues map means it contributes no NEW dialogues.

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

// ship-hibernation shares interaction dialogues with m0-001-ship
// (examine-pod, dead-screen, notice-board, find-keycode)
// All are registered globally from m0-001-ship's dialogues.
export const dialogues: Record<string, DialogueSequence> = {};
```

#### 6. `src/explorers/levels/ship-hibernation/manifest.ts`

**File**: `src/explorers/levels/ship-hibernation/manifest.ts` (new)

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'ship-hibernation',
  displayName: 'Kwatera hibernacyjna',
  dialogues,
  interactionRoutes: [
    // References dialogues defined in m0-001-ship (globally registered)
    { zoneId: 'examine-pod', defaultDialogue: 'examine-pod' },
    { zoneId: 'dead-screen', defaultDialogue: 'dead-screen' },
    { zoneId: 'notice-board', defaultDialogue: 'notice-board' },
    { zoneId: 'find-keycode', defaultDialogue: 'find-keycode' },
  ],
};
```

#### 7. `src/explorers/levels/ship-corridor/dialogues.ts`

**File**: `src/explorers/levels/ship-corridor/dialogues.ts` (new)

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  'damaged-panel': {
    id: 'damaged-panel',
    lines: [{ speaker: 'system', text: 'Panel nawigacyjny — uszkodzony. CORE mógł to naprawić.', mode: 'system', autoAdvance: 2000 }],
  },
  'oxygen-tank': {
    id: 'oxygen-tank',
    lines: [{ speaker: 'astronaut', text: 'Zapas tlenu. Jeszcze wystarczy na dłużej.', mode: 'monologue' }],
  },
  'window-1': {
    id: 'window-1',
    lines: [{ speaker: 'astronaut', text: 'Gwiazdy... Daleko od domu.', mode: 'monologue' }],
  },
  'window-2': {
    id: 'window-2',
    lines: [{ speaker: 'astronaut', text: 'Ciemność i cisza. Tylko statek dryfuje.', mode: 'monologue' }],
  },
};
```

#### 8. `src/explorers/levels/ship-corridor/manifest.ts`

**File**: `src/explorers/levels/ship-corridor/manifest.ts` (new)

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'ship-corridor',
  displayName: 'Korytarz główny',
  dialogues,
  interactionRoutes: [
    { zoneId: 'damaged-panel', defaultDialogue: 'damaged-panel' },
    { zoneId: 'oxygen-tank', defaultDialogue: 'oxygen-tank' },
    { zoneId: 'window-1', defaultDialogue: 'window-1' },
    { zoneId: 'window-2', defaultDialogue: 'window-2' },
  ],
};
```

#### 9. `src/explorers/levels/ship-bridge/dialogues.ts`

**File**: `src/explorers/levels/ship-bridge/dialogues.ts` (new)

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  // Zone interaction dialogues
  'terminal-first-use': {
    id: 'terminal-first-use',
    lines: [{ speaker: 'system', text: 'Terminal aktywny. Użyj panelu po prawej.', mode: 'system', autoAdvance: 2000 }],
  },
  'holo-projector-off': {
    id: 'holo-projector-off',
    lines: [{ speaker: 'system', text: 'Projektor holograficzny — wyłączony.', mode: 'system', autoAdvance: 2000 }],
  },
  'holo-projector-on': {
    id: 'holo-projector-on',
    lines: [{ speaker: 'astronaut', text: 'Mapa holograficzna aktywna. Użyj /map w terminalu.', mode: 'monologue' }],
  },
  'captain-chair': {
    id: 'captain-chair',
    lines: [{ speaker: 'astronaut', text: 'Fotel kapitana. Ktoś tu siedział, ktoś prowadził. Teraz zostałem tylko ja.', mode: 'monologue' }],
  },
  'station-nav': {
    id: 'station-nav',
    lines: [{ speaker: 'system', text: 'Stacja nawigacyjna — offline.', mode: 'system', autoAdvance: 2000 }],
  },
  'station-comms': {
    id: 'station-comms',
    lines: [{ speaker: 'system', text: 'Stacja komunikacyjna — offline.', mode: 'system', autoAdvance: 2000 }],
  },
  'station-eng': {
    id: 'station-eng',
    lines: [{ speaker: 'system', text: 'Stacja inżynieryjna — offline.', mode: 'system', autoAdvance: 2000 }],
  },
  'data-console': {
    id: 'data-console',
    lines: [{ speaker: 'astronaut', text: 'Logi systemowe... Ostatni wpis sprzed tygodni. Potem cisza.', mode: 'monologue' }],
  },
  'star-map-off': {
    id: 'star-map-off',
    lines: [{ speaker: 'system', text: 'Duży ekran ścienny. Ciemny.', mode: 'system', autoAdvance: 2000 }],
  },

  // Story/quest dialogues (triggered programmatically)
  'first-contact': {
    id: 'first-contact',
    lines: [
      { speaker: 'astronaut', text: 'Nawigator? Ktoś jest po drugiej stronie...', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Nie wiem kim jesteś, ale potrzebuję twojej pomocy.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Ten terminal to nasze jedyne łącze. Uplink — awaryjne połączenie kwantowe z Ziemią.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Jeśli mnie słyszysz... wpisz /help i zobaczmy co mamy do dyspozycji.', mode: 'dialogue' },
    ],
  },
  'quest-1-activation': {
    id: 'quest-1-activation',
    lines: [
      { speaker: 'astronaut', text: 'Nawigacja nie działa. Nawet mapa holograficzna się nie włącza.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Jeśli nie widzimy gdzie jesteśmy, lecimy na ślepo.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Nawigatorze, dasz radę uruchomić projektor holograficzny?', mode: 'dialogue' },
      { speaker: 'system', text: '◆ Nowa misja: Przywróć mapę holograficzną', mode: 'system', autoAdvance: 4000 },
    ],
    onComplete: { setFlags: ['quest-1-active'], activateQuest: 'demo-quest-1' },
  },
  'quest-1-complete': {
    id: 'quest-1-complete',
    lines: [
      { speaker: 'system', text: 'Projektor holograficzny: ONLINE', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'Mapa... działa! Widzę całą trasę.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Pięć księżyców. To nasza misja.', mode: 'dialogue' },
      { speaker: 'system', text: 'Nowa komenda dostępna: /map', mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: '◆ Nowa misja: Wyznacz aktualną pozycję', mode: 'system', autoAdvance: 4000 },
    ],
    onComplete: { setFlags: ['quest-1-complete'], completeQuest: 'demo-quest-1', activateQuest: 'demo-quest-2' },
  },
  'quest-2-complete': {
    id: 'quest-2-complete',
    lines: [
      { speaker: 'system', text: 'Pozycja potwierdzona. Mapa zaktualizowana.', mode: 'system', autoAdvance: 2000 },
      { speaker: 'astronaut', text: 'Oto my. Dryfujemy między niczym a wszystkim.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Pięć księżyców przed nami. Daleka droga.', mode: 'dialogue' },
      { speaker: 'astronaut', text: 'Ale Nawigatorze... z tobą po drugiej stronie Uplinku, chyba damy radę.', mode: 'dialogue' },
    ],
    onComplete: { setFlags: ['quest-2-complete', 'demo-complete'], completeQuest: 'demo-quest-2', triggerEvent: 'demo-end-screen' },
  },
};
```

#### 10. `src/explorers/levels/ship-bridge/quests.ts`

**File**: `src/explorers/levels/ship-bridge/quests.ts` (new)

```typescript
import type { QuestDefinition } from '../../systems/QuestManager';

export const quests: QuestDefinition[] = [
  {
    id: 'demo-quest-1',
    title: 'Przywróć mapę holograficzną',
    briefing: 'Projektor holograficzny na mostku jest wyłączony. Systemy diagnostyczne wskazują, że kluczowy moduł wymaga ponownej kalibracji. Użyj danych z terminala, aby przywrócić projektor.',
    inputPayload: '{"projector":"holo-mk3","status":"offline","errorCode":"CAL-7031","requiredAction":"recalibrate"}',
    hints: [
      'Sprawdź kod błędu CAL-7031. Co oznacza \'recalibrate\'?',
      'Spróbuj wysłać komendę kalibracji — odpowiedź to słowo \'recalibrate\' oraz kod błędu.',
      'Wpisz w terminalu: /solve recalibrate-CAL-7031',
    ],
    solution: 'recalibrate-cal-7031',
    validation: 'exact-lowercase',
    rewards: { xp: 75, flags: ['quest-1-complete'] },
  },
  {
    id: 'demo-quest-2',
    title: 'Wyznacz aktualną pozycję',
    briefing: 'Mapa holograficzna działa, ale statek nie zna swojej pozycji. Sensory wykryły sygnał nawigacyjny — zdekoduj go, aby wyznaczyć koordynaty Odyssey.',
    inputPayload: '{"signal":"TmF2UG9pbnQ6IFNlY3Rvci03LVguIENvb3JkczogMTQuNy4yNg==","encoding":"base64","beacon":"NAV-BEACON-7X"}',
    hints: [
      'Sygnał jest zakodowany w base64. Zdekoduj go.',
      'Zdekodowany sygnał zawiera koordynaty. Wyodrębnij je.',
      'Wpisz w terminalu: /solve 14.7.26',
    ],
    solution: '14.7.26',
    validation: 'exact-trim',
    rewards: { xp: 100, flags: ['quest-2-complete'] },
  },
];
```

#### 11. `src/explorers/levels/ship-bridge/manifest.ts`

**File**: `src/explorers/levels/ship-bridge/manifest.ts` (new)

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'ship-bridge',
  displayName: 'Mostek',
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'holo-projector',
      defaultDialogue: 'holo-projector-off',
      flagVariants: [
        { flag: 'quest-1-complete', dialogue: 'holo-projector-on' },
      ],
    },
    {
      zoneId: 'star-map-display',
      defaultDialogue: 'star-map-off',
      flagVariants: [
        { flag: 'quest-2-complete', dialogue: 'star-map-on' },
      ],
    },
    { zoneId: 'captain-chair', defaultDialogue: 'captain-chair' },
    { zoneId: 'station-nav', defaultDialogue: 'station-nav' },
    { zoneId: 'station-comms', defaultDialogue: 'station-comms' },
    { zoneId: 'station-eng', defaultDialogue: 'station-eng' },
    { zoneId: 'data-console', defaultDialogue: 'data-console' },
  ],
  quests,
  questCompletionDialogues: {
    'demo-quest-1': 'quest-1-complete',
    'demo-quest-2': 'quest-2-complete',
  },
};
```

Note: `terminal-first-use` is NOT listed in `interactionRoutes` because terminal interactions are handled separately in `handleInteraction()` (they don't go through the route system). The terminal case in `handleInteraction` will continue to use the dialogue ID directly.

#### 12. `src/explorers/levels/index.ts`

**File**: `src/explorers/levels/index.ts` (new)

```typescript
import type { LevelManifest } from './types';
import { manifest as m0001Ship } from './m0-001-ship/manifest';
import { manifest as shipHibernation } from './ship-hibernation/manifest';
import { manifest as shipCorridor } from './ship-corridor/manifest';
import { manifest as shipBridge } from './ship-bridge/manifest';

/** All level manifests, keyed by map ID */
export const ALL_LEVELS: ReadonlyMap<string, LevelManifest> = new Map([
  [m0001Ship.id, m0001Ship],
  [shipHibernation.id, shipHibernation],
  [shipCorridor.id, shipCorridor],
  [shipBridge.id, shipBridge],
]);

/** Get a level manifest by map key */
export function getLevel(mapKey: string): LevelManifest | undefined {
  return ALL_LEVELS.get(mapKey);
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] All 4 manifest files export valid `LevelManifest` objects
- [x] `ALL_LEVELS` map has 4 entries
- [x] All dialogue IDs referenced in `interactionRoutes` exist in the level's `dialogues` or another level's `dialogues`

#### Manual Verification:

- [ ] Game plays identically — new files exist but are not wired yet
- [ ] No console errors related to level imports

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Level Loader & Runtime Wiring

### Overview

Create the `levelLoader` module and refactor `DialogueManager`, `QuestManager`, `GameScene`, and `mapRegistry` to use manifests as their source of truth. This is the core migration phase — old static imports are replaced with manifest-driven loading.

### Changes Required:

#### 1. Create `src/explorers/levels/levelLoader.ts`

**File**: `src/explorers/levels/levelLoader.ts` (new)

```typescript
import type { DialogueSequence } from '../systems/DialogueTypes';
import type { QuestDefinition } from '../systems/QuestManager';
import type { InteractionRoute, LevelManifest } from './types';
import { ALL_LEVELS } from './index';
import { devLog } from '../utils/logger';

/** Flattened global registries built from all level manifests */
let allDialogues: Map<string, DialogueSequence>;
let allQuests: Map<string, QuestDefinition>;
let allQuestCompletionDialogues: Record<string, string>;
let routesByMap: Map<string, InteractionRoute[]>;
let displayNames: Record<string, string>;

let loaded = false;

/** Load all level manifests and build global registries. Call once at boot. */
export function loadAllLevels(): void {
  if (loaded) return;

  allDialogues = new Map();
  allQuests = new Map();
  allQuestCompletionDialogues = {};
  routesByMap = new Map();
  displayNames = {};

  for (const [mapKey, manifest] of ALL_LEVELS) {
    // Register dialogues
    for (const [id, seq] of Object.entries(manifest.dialogues)) {
      allDialogues.set(id, seq);
    }

    // Register quests
    if (manifest.quests) {
      for (const quest of manifest.quests) {
        allQuests.set(quest.id, quest);
      }
    }

    // Register quest completion dialogues
    if (manifest.questCompletionDialogues) {
      Object.assign(allQuestCompletionDialogues, manifest.questCompletionDialogues);
    }

    // Register interaction routes
    routesByMap.set(mapKey, manifest.interactionRoutes);

    // Register display name
    displayNames[mapKey] = manifest.displayName;
  }

  loaded = true;
  devLog(`[LevelLoader] Loaded ${ALL_LEVELS.size} levels, ${allDialogues.size} dialogues, ${allQuests.size} quests`);
}

/** Get all dialogue sequences (global registry) */
export function getAllDialogues(): Map<string, DialogueSequence> {
  return allDialogues;
}

/** Get all quest definitions (global registry) */
export function getAllQuests(): Map<string, QuestDefinition> {
  return allQuests;
}

/** Get quest completion → dialogue mappings (global registry) */
export function getQuestCompletionDialogues(): Record<string, string> {
  return allQuestCompletionDialogues;
}

/** Get interaction routes for a specific map */
export function getInteractionRoutes(mapKey: string): InteractionRoute[] {
  return routesByMap.get(mapKey) ?? [];
}

/** Get map display names (global registry) */
export function getMapDisplayNames(): Record<string, string> {
  return displayNames;
}

/** Get intro config for a map (if any) */
export function getIntroConfig(mapKey: string): { dialogueId: string; flag: string } | null {
  const manifest = ALL_LEVELS.get(mapKey);
  if (!manifest?.introDialogue || !manifest?.introFlag) return null;
  return { dialogueId: manifest.introDialogue, flag: manifest.introFlag };
}
```

#### 2. Refactor `DialogueManager.ts` — Remove static imports

**File**: `src/explorers/systems/DialogueManager.ts`
**Changes**: Remove all static dialogue JSON imports. Load dialogues from `levelLoader` instead.

Replace the entire file:

```typescript
import { GameEvents } from '../events/GameEvents';
import { devLog, devWarn } from '../utils/logger';
import type { DialogueSequence, DialogueLine, DialogueEffect } from './DialogueTypes';
import { getAllDialogues } from '../levels/levelLoader';

export class DialogueManager {
  private sequences = new Map<string, DialogueSequence>();
  private currentSequence: DialogueSequence | null = null;
  private currentLineIndex = 0;
  private bus: Phaser.Events.EventEmitter;

  constructor(bus: Phaser.Events.EventEmitter) {
    this.bus = bus;
    this.loadAllDialogues();
  }

  private loadAllDialogues(): void {
    const dialogues = getAllDialogues();
    for (const [id, seq] of dialogues) {
      this.sequences.set(id, seq);
    }
    devLog(`[DialogueManager] Loaded ${this.sequences.size} dialogue sequences`);
  }

  hasDialogue(id: string): boolean {
    return this.sequences.has(id);
  }

  startDialogue(id: string): DialogueLine | null {
    const seq = this.sequences.get(id);
    if (!seq) {
      devWarn(`[DialogueManager] Unknown dialogue: ${id}`);
      return null;
    }

    this.currentSequence = seq;
    this.currentLineIndex = 0;
    return this.getCurrentLine();
  }

  getCurrentLine(): DialogueLine | null {
    if (!this.currentSequence) return null;
    if (this.currentLineIndex >= this.currentSequence.lines.length) return null;
    return this.currentSequence.lines[this.currentLineIndex];
  }

  advance(): DialogueLine | null {
    if (!this.currentSequence) return null;

    this.currentLineIndex++;

    if (this.currentLineIndex >= this.currentSequence.lines.length) {
      this.applyEffects(this.currentSequence.onComplete);
      const completedId = this.currentSequence.id;
      this.currentSequence = null;
      this.currentLineIndex = 0;
      devLog(`[DialogueManager] Sequence complete: ${completedId}`);
      return null;
    }

    return this.getCurrentLine();
  }

  isActive(): boolean {
    return this.currentSequence !== null;
  }

  skip(): void {
    if (!this.currentSequence) return;
    this.applyEffects(this.currentSequence.onComplete);
    devLog(`[DialogueManager] Sequence skipped: ${this.currentSequence.id}`);
    this.currentSequence = null;
    this.currentLineIndex = 0;
  }

  private applyEffects(effects?: DialogueEffect): void {
    if (!effects) return;

    if (effects.setFlags) {
      for (const flag of effects.setFlags) {
        this.bus.emit(GameEvents.FLAG_SET, { flag });
      }
    }
    if (effects.activateQuest) {
      this.bus.emit(GameEvents.QUEST_ACTIVATED, { questId: effects.activateQuest, title: '' });
    }
    if (effects.completeQuest) {
      this.bus.emit(GameEvents.QUEST_COMPLETED, { questId: effects.completeQuest, rewards: { xp: 0, flags: [] } });
    }
    if (effects.triggerEvent) {
      this.bus.emit(effects.triggerEvent);
    }
  }
}
```

Note: The legacy `setFlag`/`setFlag2` handling is removed here because Phase 2 already migrated all dialogues to `setFlags[]`.

#### 3. Refactor `QuestManager.ts` — Remove static imports and hardcoded mapping

**File**: `src/explorers/systems/QuestManager.ts`
**Changes**: Remove static quest JSON imports and `QUEST_COMPLETION_DIALOGUES` constant. Load from `levelLoader`.

Replace lines 1-27 (imports + constants):

```typescript
import { GameEvents } from '../events/GameEvents';
import { devLog } from '../utils/logger';
import type { DemoGameState } from '../state/types';
import { getAllQuests, getQuestCompletionDialogues } from '../levels/levelLoader';

export interface QuestDefinition {
  id: string;
  title: string;
  briefing: string;
  inputPayload: string;
  hints: string[];
  solution: string;
  validation: 'exact-lowercase' | 'exact-trim';
  rewards: { xp: number; flags: string[] };
}
```

Replace `QUEST_DEFS` usage — change from module-level constant to constructor initialization:

In `QuestManager` class, add a `questDefs` field and `questCompletionDialogues` field:

```typescript
export class QuestManager {
  private bus: Phaser.Events.EventEmitter;
  private getState: () => DemoGameState;
  private setState: (updater: (prev: DemoGameState) => Partial<DemoGameState>) => void;
  private questDefs: Map<string, QuestDefinition>;
  private questCompletionDialogues: Record<string, string>;

  constructor(
    bus: Phaser.Events.EventEmitter,
    getState: () => DemoGameState,
    setState: (updater: (prev: DemoGameState) => Partial<DemoGameState>) => void
  ) {
    this.bus = bus;
    this.getState = getState;
    this.setState = setState;
    this.questDefs = getAllQuests();
    this.questCompletionDialogues = getQuestCompletionDialogues();
  }
```

Update all references from `QUEST_DEFS` to `this.questDefs` and from `QUEST_COMPLETION_DIALOGUES` to `this.questCompletionDialogues`:
- `getActiveQuest()` line 47: `QUEST_DEFS.get(...)` → `this.questDefs.get(...)`
- `getQuestDef()` line 51: `QUEST_DEFS.get(...)` → `this.questDefs.get(...)`
- `activateQuest()` line 55: `QUEST_DEFS.get(...)` → `this.questDefs.get(...)`
- `completeQuest()` line 110: `QUEST_COMPLETION_DIALOGUES[...]` → `this.questCompletionDialogues[...]`

#### 4. Refactor `mapRegistry.ts` — Derive from manifests

**File**: `src/explorers/config/mapRegistry.ts`
**Changes**: Replace hardcoded object with `levelLoader` derivation.

```typescript
import { getMapDisplayNames } from '../levels/levelLoader';

export const MAP_DISPLAY_NAMES = getMapDisplayNames();

export type MapKey = string;
```

Note: `MapKey` changes from a union literal type to `string`. This is acceptable because the game already casts it in several places (`as Record<string, string>`). If strict typing is needed, a helper type can be added later.

#### 5. Refactor `GameScene.handleInteraction()` — Use interaction routes

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Replace hardcoded if/else with route resolution from manifest.

Add import at top:
```typescript
import { getInteractionRoutes, getIntroConfig } from '../levels/levelLoader';
```

Replace `handleInteraction()` method (lines 339-363):

```typescript
private handleInteraction(obj: InteractiveObject): void {
  devLog(`[GameScene] Interaction: ${obj.objectId} (${obj.objectType})`);

  switch (obj.objectType) {
    case 'trigger': {
      const dialogueId = this.resolveDialogueId(obj);
      this.startDialogue(dialogueId);
      break;
    }
    case 'terminal':
      devLog(`[GameScene] Terminal interaction: ${obj.objectId}`);
      this.startDialogue('terminal-first-use');
      break;
  }
}

/** Resolve dialogue ID for a trigger interaction using manifest routes */
private resolveDialogueId(obj: InteractiveObject): string {
  const routes = getInteractionRoutes(this.mapKey);
  const route = routes.find((r) => r.zoneId === obj.objectId);

  if (!route) {
    // No route defined — fall back to eventId (backward compat)
    return obj.eventId;
  }

  // Check flag variants in order — first match wins
  if (route.flagVariants) {
    for (const variant of route.flagVariants) {
      if (this.hasFlag(variant.flag)) {
        devLog(`[GameScene] Route resolved: ${obj.objectId} → ${variant.dialogue} (flag: ${variant.flag})`);
        return variant.dialogue;
      }
    }
  }

  devLog(`[GameScene] Route resolved: ${obj.objectId} → ${route.defaultDialogue} (default)`);
  return route.defaultDialogue;
}
```

#### 6. Refactor cinematic intro — Use manifest intro config

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Replace hardcoded `m0-001-ship` check with manifest-driven intro.

Replace line 279 (`if (this.mapKey === 'm0-001-ship' && !this.gameState.introSeen)`):

```typescript
// Cinematic intro from level manifest
const introConfig = getIntroConfig(this.mapKey);
if (introConfig && !this.hasFlag(introConfig.flag)) {
  this.playCinematicIntro(introConfig);
}
```

Update `playCinematicIntro` signature and the intro completion callback:

Change `private playCinematicIntro(): void` to `private playCinematicIntro(introConfig: { dialogueId: string; flag: string }): void`.

In the tween completion callback (around line 495-500), replace:
```typescript
this.setFlag('intro-seen');
this.updateState((s) => ({ introSeen: true }));
saveState(this.gameState);
this.startDialogue('awakening-monologue');
```

With:
```typescript
this.setFlag(introConfig.flag);
this.updateState((s) => ({ introSeen: true }));
saveState(this.gameState);
this.startDialogue(introConfig.dialogueId);
```

Note: `introSeen` state field is kept for backward compat with existing saved games. The flag-based check (`hasFlag('intro-seen')`) is the primary gate.

#### 7. Initialize level loader at boot

**File**: `src/explorers/scenes/BootScene.ts`
**Changes**: Call `loadAllLevels()` at the start of `create()`.

Add to the top of `BootScene.create()`:
```typescript
import { loadAllLevels } from '../levels/levelLoader';

// In create():
loadAllLevels();
```

This must happen before any scene that uses `MAP_DISPLAY_NAMES`, `DialogueManager`, or `QuestManager` is started.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] No references to old dialogue/quest JSON imports in `DialogueManager.ts` or `QuestManager.ts`
- [x] `GameScene.handleInteraction()` contains no hardcoded object ID checks

#### Manual Verification:

- [ ] Game starts correctly — cinematic intro plays on `m0-001-ship`
- [ ] `awakening-monologue` plays after cinematic
- [ ] Navigating to `ship-corridor` via door works — corridor dialogues play correctly
- [ ] Navigating to `ship-bridge` — all zone interactions produce correct dialogues
- [ ] Holo-projector shows `holo-projector-off` before quest 1 completion
- [ ] After completing quest 1, holo-projector shows `holo-projector-on`
- [ ] Star map display shows `star-map-off` before quest 2 completion
- [ ] Quest 1 and Quest 2 flow works end-to-end (activate → solve → complete dialogue → effects)
- [ ] Demo end screen appears after quest 2 completion
- [ ] Terminal commands (`/help`, `/status`, `/quest`, `/map`, `/solve`, `/hint`) work correctly
- [ ] HUD displays correct map names
- [ ] State saves/loads correctly (existing save files still work)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Editor Integration — Auto-derive Constants

### Overview

Refactor `editorConstants.ts` to derive `KNOWN_EVENT_IDS` from loaded level manifests instead of a hardcoded array. `KNOWN_TARGET_MAPS` already derives from `mapRegistry` which now derives from manifests.

### Changes Required:

#### 1. Refactor `editorConstants.ts`

**File**: `src/explorers/editor/editorConstants.ts`
**Changes**: Derive `KNOWN_EVENT_IDS` from all dialogue IDs across all level manifests.

```typescript
import { ALL_LEVELS } from '../levels/index';

// Derive all known event/dialogue IDs from level manifests
export const KNOWN_EVENT_IDS: string[] = (() => {
  const ids = new Set<string>();
  for (const [, manifest] of ALL_LEVELS) {
    for (const dialogueId of Object.keys(manifest.dialogues)) {
      ids.add(dialogueId);
    }
  }
  return [...ids].sort();
})();

// Derive target maps from level manifests
export const KNOWN_TARGET_MAPS: string[] = [...ALL_LEVELS.keys()];
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] `KNOWN_EVENT_IDS` contains all 18+ dialogue IDs from the current hardcoded list
- [x] `KNOWN_TARGET_MAPS` contains all 4 map keys

#### Manual Verification:

- [ ] Map editor at `/explorers-editor` loads correctly
- [ ] Event ID dropdown in zone properties shows all known dialogue IDs
- [ ] Target map dropdown in door properties shows all 4 maps

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Cleanup & Validation

### Overview

Remove old scattered data files and unused imports. Remove deprecated `setFlag`/`setFlag2` fields from `DialogueEffect`. Verify no orphaned references remain.

### Changes Required:

#### 1. Remove old dialogue JSON files

Delete:
- `src/explorers/data/dialogues/awakening-monologue.json`
- `src/explorers/data/dialogues/find-keycode.json`
- `src/explorers/data/dialogues/first-contact.json`
- `src/explorers/data/dialogues/quest-1-activation.json`
- `src/explorers/data/dialogues/quest-1-complete.json`
- `src/explorers/data/dialogues/quest-2-complete.json`
- `src/explorers/data/dialogues/ship-interactions.json`

Keep `src/explorers/data/dialogues/terminal-boot.json` — this is consumed directly by `SmartTerminal.svelte` (not by `DialogueManager`) and doesn't belong to the level manifest system.

#### 2. Remove old quest JSON files

Delete:
- `src/explorers/data/quests/demo-quest-1.json`
- `src/explorers/data/quests/demo-quest-2.json`

#### 3. Remove deprecated `DialogueEffect` fields

**File**: `src/explorers/systems/DialogueTypes.ts`

Remove `setFlag` and `setFlag2` fields:

```typescript
export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  /** Flags to set on dialogue completion */
  setFlags?: string[];
  triggerEvent?: string;
}
```

#### 4. Verify no orphaned imports

Search the codebase for any remaining references to:
- `../data/dialogues/` imports
- `../data/quests/` imports
- `setFlag2` references
- Hardcoded dialogue IDs in `GameScene.ts` (like `'holo-projector'`, `'star-map-display'`)
- Hardcoded `QUEST_COMPLETION_DIALOGUES`

#### 5. Clean up empty directories

If `src/explorers/data/dialogues/` and `src/explorers/data/quests/` are empty after deletion, remove them. Keep `src/explorers/data/dialogues/terminal-boot.json` if it exists (do NOT delete the directory if this file remains).

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] No references to deleted files: `grep -r "data/dialogues/" src/explorers/ --include="*.ts"` returns only `terminal-boot.json` reference
- [x] No references to `setFlag2`: `grep -r "setFlag2" src/explorers/ --include="*.ts"` returns nothing
- [x] No references to deleted quest JSONs: `grep -r "data/quests/" src/explorers/ --include="*.ts"` returns nothing

#### Manual Verification:

- [ ] Full game playthrough: intro → explore → quest 1 → quest 2 → demo end screen
- [ ] All dialogue sequences display correct text
- [ ] All flag gating works (holo-projector, star map, terminal commands)
- [ ] Map editor still works at `/explorers-editor`
- [ ] No console errors or warnings

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the full game playthrough was successful.

---

## Testing Strategy

### Unit Tests:

No new unit tests required — the level framework is a structural refactoring. Existing behavior is preserved 1:1.

### Integration Tests:

- [ ] Verify `loadAllLevels()` registers the expected number of dialogues (25+), quests (2), and routes
- [ ] Verify `getInteractionRoutes('ship-bridge')` returns routes for `holo-projector` and `star-map-display` with correct flag variants
- [ ] Verify `getIntroConfig('m0-001-ship')` returns `{ dialogueId: 'awakening-monologue', flag: 'intro-seen' }`
- [ ] Verify `getIntroConfig('ship-bridge')` returns `null`

### Manual Testing Steps:

1. **Fresh game start**: Delete localStorage, load game. Verify cinematic → awakening monologue → explore.
2. **Find keycode**: Interact with emergency locker in hibernation room. Verify `keycode-found` flag is set.
3. **Terminal unlock**: Use code at terminal. Verify boot sequence.
4. **First status**: Run `/status`. Verify quest 1 activation dialogue plays.
5. **Quest 1 solve**: Run `/solve recalibrate-cal-7031`. Verify completion dialogue, holo-projector switches to `on` state.
6. **Quest 2 solve**: Run `/solve 14.7.26`. Verify completion dialogue, demo end screen.
7. **All zone interactions**: Walk through all 3+ maps, interact with every zone. Verify correct dialogues.
8. **Existing save compatibility**: Load a save from before migration. Verify game continues correctly.
9. **Map editor**: Open `/explorers-editor`, verify event ID and target map dropdowns are populated.

## Performance Considerations

Negligible. All level data is statically imported and bundled. The level loader runs once at boot, iterating 4 manifests with ~25 dialogues and 2 quests. Route resolution per interaction is O(n) where n = number of routes for the current map (max ~10) × number of flag variants per route (max ~2). This is equivalent to the current hardcoded if/else performance.

## Migration Notes

### Existing Save Compatibility

No migration needed. `DemoGameState` is unchanged — same fields, same flag names, same quest IDs. Existing localStorage saves work without modification.

### Adding a New Level After This Migration

To add a new level "engine-room":

1. Create `public/game/maps/engine-room.json` (via editor)
2. Create `src/explorers/levels/engine-room/` directory
3. Create `dialogues.ts` with all dialogue sequences
4. Create `quests.ts` if the level has quests
5. Create `manifest.ts` tying everything together
6. Add import to `src/explorers/levels/index.ts`

That's **4-5 files in one directory + 1 import line** — down from 11 steps across 8 files.

## References

- Research: `thoughts/shared/research/2026-02-19-game-level-framework.md`
- Game spec: `.ai/10x-devs/game/10x-explorers-spec.md`
- Demo milestone spec: `.ai/10x-devs/game/demo-milestone-spec.md`
- Architecture plan: `thoughts/shared/plans/2026-02-18-clean-phaser-architecture.md`
- Engine cookbook: `.ai/10x-devs/game/cookbook.md`
- Storyline: `.ai/10x-devs/game/storyline.md`
- Map editor plan: `thoughts/shared/plans/2026-02-19-explorers-map-editor.md`
