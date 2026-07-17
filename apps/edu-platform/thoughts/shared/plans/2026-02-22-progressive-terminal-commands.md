# Progressive Terminal Commands Implementation Plan

## Overview

Refactor SmartTerminal to support progressive command unlocking via flags. Remove all commands from being available by default after terminal unlock, keeping only a new `/time` command (current hour in year 2126 with ASCII art). Other commands unlock as the player advances through the story, gated by flags. Locked commands behave as if they don't exist (unknown command message). Autocomplete only shows unlocked commands.

## Current State Analysis

The terminal currently has 9 hardcoded commands (`help`, `status`, `quest`, `scan`, `log`, `solve`, `hint`, `save`, `map`) all available immediately after terminal unlock. Only `/map` has flag-gating (requires `quest-1-complete`). The command list is duplicated between `ALL_COMMANDS` array in `SmartTerminal.svelte` (line 30) and the `switch` statement in `commandHandler.ts` (lines 24-45).

### Key Discoveries:

- `30:30:src/explorers/SmartTerminal.svelte` — hardcoded `ALL_COMMANDS` array drives autocomplete
- `24:45:src/explorers/terminal/commandHandler.ts` — switch statement dispatches all commands
- `48:68:src/explorers/terminal/commandHandler.ts` — `/help` dynamically shows `/map` status but all other commands are always listed
- `157:160:src/explorers/terminal/commandHandler.ts` — `/map` is the only flag-gated command (inline check)
- `93:95:src/explorers/terminal/commandHandler.ts` — `/status` triggers quest-1-activation side effect on first use

## Desired End State

After implementation:
1. Terminal unlocks with code `0451` — only `/time` is available
2. `/time` shows current hour with year 2126 in a compact ASCII art display
3. All other commands are locked and return generic "unknown command" message
4. A command registry maps each command to an optional `requiredFlag`
5. `/help` dynamically lists only unlocked commands
6. Autocomplete (`ALL_COMMANDS`) is computed reactively from state flags
7. When a flag unlocks a new command, a notification line appears in the terminal
8. Quest system (`QuestManager`, quest definitions, `/solve`, `/hint`, `/quest`) remains intact — just gated

### Suggested Unlock Progression (configurable via registry):

| Command | Required Flag | When It Unlocks |
|---------|--------------|-----------------|
| `/time` | *(none)* | Always available after terminal boot |
| `/help` | *(none)* | Always available after terminal boot |
| `/status` | `cmds:status` | Story event after first-contact dialogue (to be wired later) |
| `/quest` | `cmds:quest` | When first quest activates |
| `/solve` | `cmds:quest` | Same as `/quest` — needed together |
| `/hint` | `cmds:quest` | Same as `/quest` — needed together |
| `/scan` | `cmds:scan` | Story event (to be wired later) |
| `/log` | `cmds:log` | Story event (to be wired later) |
| `/save` | `cmds:save` | Story event (to be wired later) |
| `/map` | `quest-1-complete` | After quest-1 completion (existing behavior) |

> **Note**: `/help` is kept always-available alongside `/time` so the player has a way to discover new commands. It will initially show only `/time` and `/help`, then expand as commands unlock.

## What We're NOT Doing

- Not changing the quest system (QuestManager, quest definitions, solution validation)
- Not changing the terminal unlock flow (code 0451, boot sequence)
- Not modifying existing command implementations (just gating access to them)
- Not wiring specific story events to set `cmds:*` flags — that's a separate story authoring task
- Not adding visual lock indicators to autocomplete (user chose "only unlocked" approach)

## Implementation Approach

Create a centralized command registry that maps command names to their handler functions, descriptions, and required flags. The `handleCommand` dispatcher checks this registry before executing. SmartTerminal derives the autocomplete list reactively from the registry + current flags.

## Critical Implementation Details

### State Management Sequencing

- Command registry is a static data structure (no runtime state)
- Flag checks happen synchronously during command dispatch — no async concerns
- Autocomplete list recomputes via Svelte reactive block whenever `gameState` changes (already has `STATE_CHANGED` listener)
- New command notifications fire in the existing `FLAG_SET` event handler

### User Experience Specification

- Locked commands return: `Nieznana komenda: /<cmd>. Wpisz /help, aby zobaczyć dostępne komendy.` (same as truly unknown commands)
- `/help` lists only unlocked commands with descriptions
- When a new command unlocks, terminal shows: `▸ Nowa komenda dostępna: /<cmd> — <description>`
- `/time` ASCII art is compact (fits small terminal), uses current real time with year set to 2126

### Timing & Lifecycle Considerations

**N/A**: All changes are synchronous flag checks with no lifecycle concerns.

### Performance & Optimization Strategy

**N/A**: Registry is a small static array, flag checks are O(n) on a tiny set.

### Debug & Observability Plan

- `/help` serves as the primary verification tool — lists all unlocked commands
- Existing flag system logging (via `FLAG_SET` events) tracks unlock progression
- Manual testing: set flags via browser console to verify each command gates correctly

---

## Phase 1: Create Command Registry and `/time` Command

### Overview

Create a centralized command registry data structure and implement the new `/time` command. Refactor `handleCommand` to use the registry for dispatch and flag-gating.

### Changes Required:

#### 1. New file: Command Registry

**File**: `src/explorers/terminal/commandRegistry.ts`

```typescript
export interface CommandEntry {
  name: string;
  description: string;
  requiredFlag?: string;
}

export const COMMAND_REGISTRY: CommandEntry[] = [
  { name: 'time', description: 'Chronometr pokładowy' },
  { name: 'help', description: 'Dostępne komendy' },
  { name: 'status', description: 'Diagnostyka systemów statku', requiredFlag: 'cmds:status' },
  { name: 'quest', description: 'Aktualny briefing misji', requiredFlag: 'cmds:quest' },
  { name: 'solve', description: 'Wyślij odpowiedź na misję', requiredFlag: 'cmds:quest' },
  { name: 'hint', description: 'Wskazówka do aktywnej misji', requiredFlag: 'cmds:quest' },
  { name: 'scan', description: 'Skanuj okolicę', requiredFlag: 'cmds:scan' },
  { name: 'log', description: 'Dziennik aktywności', requiredFlag: 'cmds:log' },
  { name: 'save', description: 'Zapisz stan gry', requiredFlag: 'cmds:save' },
  { name: 'map', description: 'Mapa holograficzna', requiredFlag: 'quest-1-complete' },
];

export function getAvailableCommands(flags: string[]): CommandEntry[] {
  return COMMAND_REGISTRY.filter(
    (cmd) => !cmd.requiredFlag || flags.includes(cmd.requiredFlag)
  );
}

export function isCommandAvailable(name: string, flags: string[]): boolean {
  const entry = COMMAND_REGISTRY.find((cmd) => cmd.name === name);
  if (!entry) return false;
  return !entry.requiredFlag || flags.includes(entry.requiredFlag);
}
```

#### 2. New `/time` command handler

**File**: `src/explorers/terminal/commandHandler.ts`
**Add** `cmdTime()` function:

```typescript
function cmdTime(): CommandResult {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');

  return {
    output: [
      'CHRONOMETR POKŁADOWY',
      '═══════════════════════════',
      '',
      `    ██  ${h} : ${m} : ${s}  ██`,
      '',
      `    Data: 2126.${month}.${day}`,
      '    Cykl: ' + (now.getHours() >= 6 && now.getHours() < 22 ? 'DZIENNY' : 'NOCNY'),
      '    Strefa: UTC+0 (pokładowy)',
      '',
      '═══════════════════════════',
    ],
  };
}
```

#### 3. Refactor `handleCommand` to use registry gating

**File**: `src/explorers/terminal/commandHandler.ts`

Import `isCommandAvailable` from the registry. Before the switch statement, check if the command is available:

```typescript
import { isCommandAvailable } from './commandRegistry';

export function handleCommand(
  raw: string,
  state: DemoGameState,
  questManager?: QuestManager
): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/')) {
    return { output: ['Nieznana komenda. Wpisz /help, aby zobaczyć dostępne komendy.'] };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Check if command is available (flag-gated)
  if (!isCommandAvailable(cmd, state.flags)) {
    return { output: [`Nieznana komenda: /${cmd}. Wpisz /help, aby zobaczyć dostępne komendy.`] };
  }

  switch (cmd) {
    case 'time':
      return cmdTime();
    case 'help':
      return cmdHelp(state);
    // ... rest unchanged
  }
}
```

#### 4. Refactor `/help` to use registry

**File**: `src/explorers/terminal/commandHandler.ts`

Replace hardcoded help output with dynamic listing from registry:

```typescript
import { getAvailableCommands } from './commandRegistry';

function cmdHelp(state: DemoGameState): CommandResult {
  const available = getAvailableCommands(state.flags);
  const lines = available.map(
    (cmd) => `/${cmd.name.padEnd(10)} ${cmd.description}`
  );

  return {
    output: [
      'UPLINK TERMINAL — Dostępne komendy',
      '───────────────────────────────────',
      ...lines,
    ],
  };
}
```

#### 5. Remove inline `/map` flag check

**File**: `src/explorers/terminal/commandHandler.ts`

The `cmdMap` function currently has its own `state.flags.includes('quest-1-complete')` check (line 158). Since the registry now gates access, remove the inline check — if `cmdMap` executes, the flag is guaranteed to be set.

```typescript
function cmdMap(state: DemoGameState): CommandResult {
  // Flag check removed — handled by command registry gating
  return {
    output: [
      'MAPA HOLOGRAFICZNA — Odyssey',
      // ... rest unchanged
    ],
  };
}
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] After terminal unlock, only `/time` and `/help` work
- [ ] `/time` shows current time with year 2126 and ASCII art
- [ ] `/help` shows only `/time` and `/help`
- [ ] All other commands return "Nieznana komenda" message
- [ ] Tab autocomplete only shows `time` and `help`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Phase 2: Update SmartTerminal.svelte for Dynamic Autocomplete and Unlock Notifications

### Overview

Replace the hardcoded `ALL_COMMANDS` array with a reactive computation from the command registry. Add terminal notification when new commands unlock via flags.

### Changes Required:

#### 1. Dynamic autocomplete list

**File**: `src/explorers/SmartTerminal.svelte`

Replace:
```typescript
const ALL_COMMANDS = ['help', 'status', 'quest', 'scan', 'log', 'solve', 'hint', 'save', 'map'];
```

With reactive computation:
```typescript
import { getAvailableCommands } from './terminal/commandRegistry';

$: availableCommands = gameState
  ? getAvailableCommands(gameState.flags).map((c) => c.name)
  : ['time', 'help'];
```

Update the autocomplete reactive block to use `availableCommands` instead of `ALL_COMMANDS`:
```typescript
$: {
  if (commandInput.startsWith('/')) {
    const typed = commandInput.slice(1).toLowerCase();
    if (typed === '') {
      suggestions = availableCommands;
    } else {
      suggestions = availableCommands.filter((c) => c.startsWith(typed));
    }
    if (suggestions.length === 1 && `/${suggestions[0]}` === commandInput) {
      suggestions = [];
    }
  } else {
    suggestions = [];
  }
}
```

#### 2. Command unlock notifications

**File**: `src/explorers/SmartTerminal.svelte`

In the existing `FLAG_SET` handler (line 190), add detection for `cmds:*` flags:

```typescript
import { COMMAND_REGISTRY } from './terminal/commandRegistry';

const onFlagSet = (payload: { flag: string }) => {
  if (payload.flag === 'keycode-found') pulseCode = true;

  // Notify about newly unlocked commands
  const unlocked = COMMAND_REGISTRY.filter((cmd) => cmd.requiredFlag === payload.flag);
  if (unlocked.length > 0 && bootDone) {
    for (const cmd of unlocked) {
      terminalLines = [
        ...terminalLines,
        `▸ Nowa komenda dostępna: /${cmd.name} — ${cmd.description}`,
      ];
    }
    terminalLines = [...terminalLines, ''];
    scrollToBottom();
  }
};
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`

#### Manual Verification:

- [ ] Tab autocomplete shows only `time` and `help` after boot
- [ ] Setting a flag (e.g., `cmds:status` via console) makes `/status` appear in autocomplete
- [ ] Terminal shows "▸ Nowa komenda dostępna: /status — Diagnostyka systemów statku" when flag is set
- [ ] Previously locked commands become usable after their flag is set

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Testing Strategy

### Manual Testing Steps:

1. Start fresh game → unlock terminal with 0451
2. Verify only `/time` and `/help` work
3. Verify `/time` displays correct current time with year 2126
4. Verify `/help` shows only 2 commands
5. Try locked commands (`/status`, `/quest`, etc.) → should show "Nieznana komenda"
6. Open console, run: `game.events.emit('flag:set', { flag: 'cmds:status' })` and also set it in state
7. Verify `/status` now works and appears in autocomplete
8. Verify notification line appeared in terminal
9. Full quest flow: unlock all commands progressively → complete quest-1 → verify `/map` unlocks

### Regression Checks:

- Quest-1 flow still works when `/status` is unlocked
- Quest completion dialogue chains still fire correctly
- Terminal state persists across page reload
- Boot sequence animation unchanged

## Performance Considerations

None — registry is a small static array, flag checks are O(n) on a tiny set (< 15 flags).

## Migration Notes

- Existing saved games with `terminalUnlocked: true` will see the reduced command set on next load. This is intentional — commands they previously used will appear locked until the flags are set.
- To smooth this for existing players: either reset saved state, or have the story re-grant flags on load (separate concern, not in scope).

## References

- Command handler: `src/explorers/terminal/commandHandler.ts`
- SmartTerminal: `src/explorers/SmartTerminal.svelte`
- Flag system: `src/explorers/state/flagManager.ts`
- Quest system: `src/explorers/systems/QuestManager.ts`
- Game state types: `src/explorers/state/types.ts`
