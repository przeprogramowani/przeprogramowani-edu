# Space Explorers Localization — Content Migration Remediation Plan

## Context

The original plan `2026-04-28-explorers-localization-en-pl.md` was marked as Phase 3 complete, but Phase 2 (bilingual content schema migration) was never implemented. This plan picks up the unfinished content-layer work.

## What Was Done (Do Not Re-do)

- `src/explorers/utils/locale.ts` — locale store, `getLocale()`, `setLocale()`, `toggleLocale()`
- `src/explorers/events/GameEvents.ts` — `LOCALE_CHANGED` event
- `src/explorers/PhaserGame.svelte` — store → bus wiring
- `src/explorers/GameHud.svelte` — PL/EN toggle button
- `src/explorers/i18n/` — all UI chrome dictionaries (`hud`, `scene`, `exam`, `arcade`, `terminal`, `preview`, `grant`) with full English translations
- `src/explorers/i18n/types.ts` — `BilingualText` type + `localized()` helper (defined but unused outside i18n/)
- `src/explorers/i18n/strings.test.ts` — parity tests for UI chrome modules (already passes)
- Scene extractions + LOCALE_CHANGED wiring in ExamScene, ArcadeScene, GameScene, DialogueScene
- Svelte shell extractions (SmartTerminal, PreviewOverlay, GrantNotification, TerminalLockScreen, etc.)

## What Was Not Done

Phase 2 of the original plan was skipped:

- `DialogueLine.text` is still `text: string` — should be `text: BilingualText`
- `ExamDefinition.title/description`, `ExamQuestion.text`, `ExamOption.text` — still `string`
- `BaseQuestDefinition.title/briefing/hints[]`, `EventObjective.label` — still `string`
- `RANK_FLAVOR` in `config/ranks.ts` — still `Record<number, string>`
- All content files (`levels/m0-*/dialogues.ts`, `exams.ts`, `quests.ts`) — still plain string literals
- Read paths: `DialogueBar.ts:113` (`line.text`), `ExamScene.ts:146,228` (`question.text`), `commandHandler.ts:168,170,181,183,209,211,203` (`quest.title/briefing/label`) — all read raw strings with no `localized()` call
- Bilingual content parity test (`levelLoader.test.ts` extension)

## Scope

### Content files to migrate (with line counts)
- `levels/m0-awakening/dialogues.ts` — 41 dialogue lines
- `levels/m0-core-ai/dialogues.ts` — 72 dialogue lines
- `levels/m0-exam-room/dialogues.ts` — 41 dialogue lines
- `levels/m0-crew-room/dialogues.ts` — 51 dialogue lines
- `levels/m0-exam-room/exams.ts` — 3 exams, 9 questions, 36 options (+ 3 titles + 3 descriptions)
- `levels/m0-exam-room/quests.ts` — 1 quest, 3 objective labels
- `levels/m0-core-ai/quests.ts` — 1 quest
- `config/ranks.ts` — 6 RANK_FLAVOR strings

### Read paths to fix
| File | Current | Fix |
|------|---------|-----|
| `ui/DialogueBar.ts:113` | `line.text` | `localized(line.text)` |
| `scenes/ExamScene.ts:84,146,228` | `exam.title`, `question.text` | `localized(exam.title)`, `localized(question.text)` |
| `scenes/ExamScene.ts` (option loop) | `option.text` | `localized(option.text)` |
| `terminal/commandHandler.ts:168,170,181,183,209,211,203` | `quest.title`, `quest.briefing`, `objective.label` | `localized(...)` on each |
| `config/ranks.ts:105` | `RANK_FLAVOR[rank.tier]` | `localized(RANK_FLAVOR[rank.tier])` |

### DialogueEffect fields to migrate
- `DialogueEffect.openUrlTitle?: string` → `BilingualText | undefined`
- `DialogueEffect.addBookmark.title: string` → `BilingualText`
- `DialogueManager.ts:112-113` reads these at `PREVIEW_SHOW` emit — use `localized()` there

---

## Phase A: Type migration + read-path fixes + content codemod

**Goal**: Game compiles and plays identically in both locales. All content files use `{ pl: '...', en: '...' }` shape with `en === pl` as placeholders. No visible change for players.

### A1. Update type definitions

**`src/explorers/systems/DialogueTypes.ts`**
- `DialogueLine.text: string` → `text: BilingualText`
- `DialogueEffect.openUrlTitle?: string` → `openUrlTitle?: BilingualText`
- `DialogueEffect.addBookmark.title: string` → `title: BilingualText`

**`src/explorers/systems/ExamTypes.ts`**
- `ExamDefinition.title: string` → `BilingualText`
- `ExamDefinition.description: string` → `BilingualText`
- `ExamQuestion.text: string` → `BilingualText`
- `ExamOption.text: string` → `BilingualText`

**`src/explorers/systems/QuestManager.ts`** — `BaseQuestDefinition`:
- `title: string` → `BilingualText`
- `briefing: string` → `BilingualText`
- `hints: string[]` → `BilingualText[]`

**`src/explorers/systems/QuestManager.ts`** — `EventObjective`:
- `label: string` → `BilingualText`

**`src/explorers/config/ranks.ts`**:
- `RANK_FLAVOR: Record<number, string>` → `Record<number, BilingualText>`

All import `BilingualText` from `'../i18n/types'`.

### A2. Fix read paths

Import `localized` from `'../i18n/types'` in each file that reads bilingual content.

**`src/explorers/ui/DialogueBar.ts:113`**
```ts
this.typewriter.start(localized(line.text), ...);
```

**`src/explorers/scenes/ExamScene.ts`** — wherever `question.text`, `option.text`, `exam.title`, `exam.description` are read for rendering:
```ts
localized(question.text)
localized(option.text)
localized(exam.title)   // includes t('exam.titlePrefix', { title: localized(exam.title) })
```

**`src/explorers/terminal/commandHandler.ts`** — lines 168, 170, 181, 183, 203, 209, 211:
```ts
localized(quest.title)
localized(quest.briefing)
localized(objective.label)
```

**`src/explorers/config/ranks.ts:105`**:
```ts
localized(RANK_FLAVOR[rank.tier] ?? { pl: '', en: '' })
```

**`src/explorers/systems/DialogueManager.ts:112-113`** (PREVIEW_SHOW emit):
```ts
title: effects.openUrlTitle ? localized(effects.openUrlTitle) : undefined
```
And for `addBookmark`:
```ts
addBookmark(game, bus, effects.addBookmark.url, localized(effects.addBookmark.title))
```

Check `BookmarkManager.ts` to see if `title` type needs updating there too.

### A3. Content codemod — convert all content files

For each content file listed above, mechanically transform:
- `text: 'some text'` → `text: { pl: 'some text', en: 'some text' }`
- `title: 'some text'` → `title: { pl: 'some text', en: 'some text' }`
- `description: 'some text'` → `description: { pl: 'some text', en: 'some text' }`
- `briefing: 'some text'` → `briefing: { pl: 'some text', en: 'some text' }`
- `hints: ['a', 'b']` → `hints: [{ pl: 'a', en: 'a' }, { pl: 'b', en: 'b' }]`
- `label: 'some text'` → `label: { pl: 'some text', en: 'some text' }`

In `config/ranks.ts`, RANK_FLAVOR entries:
```ts
const RANK_FLAVOR: Record<number, BilingualText> = {
  2: { pl: 'Systemy pokładowe...', en: 'Systemy pokładowe...' },
  // etc.
};
```

Also update `buildRankUpDialogues()` lines to use `BilingualText`:
```ts
{ speaker: 'system', text: { pl: '═══ AWANS ═══', en: '═══ AWANS ═══' }, ... }
{ speaker: 'system', text: { pl: `Nowa ranga: ${rank.name}`, en: `New rank: ${rank.name}` }, ... }
{ speaker: 'system', text: RANK_FLAVOR[rank.tier] ?? { pl: '', en: '' }, ... }
```

### Success Criteria — Phase A

- [x] `npm run build --workspace=projects/edu-platform` passes
- [x] `npm run test --workspace=projects/edu-platform` passes (1 pre-existing failure in generatedLessonHtml.test.ts, unrelated to game localization)
- [ ] Game plays identically in `pl` mode — no crashes, no changed visible text
- [ ] Game plays identically in `en` mode — same Polish text (placeholders), no crashes

---

## Phase B: English translations + bilingual content parity test

**Goal**: All `en` values in content files replaced with reviewed English. A Vitest test blocks CI on placeholder drift.

### B1. Translate content files

Using the voice brief below, fill in real `en` values in all 8 content files.

**Voice brief:**
- Setting: sci-fi crash-on-Moon awakening; player is an astronaut with wiped memory on a damaged ship in 2126
- Astronaut narrator: terse, bewildered, interior monologue — short punchy sentences
- Floobert: eccentric crew member, dry humour (appears in m0-crew-room)
- inżynier/Engineer Moreau: practical, slightly evasive
- Officer Harris: formal/military
- System messages: clinical, all-caps headers, no contractions
- Name policy: keep `Floobert`, `Moreau`, `Harris`, `Dexo` unchanged; translate titles: `inżynier` → `Engineer`, `oficer` → `Officer`
- Rank `name` fields stay English in both locales (already English)
- RANK_FLAVOR localizes; flavour text should be short and confident

**Term glossary:**
| Polish | English |
|--------|---------|
| synchronizacja neuronalna | neural synchronisation |
| pokład | deck / ship |
| sygnał z Ziemi | signal from Earth |
| inteligencja agentowa | agentic intelligence |
| notatki z podróży | travel notes |
| ranga | rank |
| misja | mission |
| awans | promotion / rank-up |
| baza HQ | HQ base |
| centrum wsparcia | support centre |
| komora hibernacyjna | hibernation pod |
| CORE AI | CORE AI (keep as-is) |
| SmartTerminal | SmartTerminal (keep as-is) |
| uplink | uplink (keep as-is) |

**Translate in this order (easiest to hardest):**
1. `config/ranks.ts` RANK_FLAVOR (6 strings, narrative flavour)
2. `levels/m0-exam-room/quests.ts` (1 quest, 3 objective labels)
3. `levels/m0-core-ai/quests.ts` (1 quest)
4. `levels/m0-exam-room/exams.ts` (3 titles, 3 descriptions, 9 questions, 36 options)
5. `levels/m0-awakening/dialogues.ts` (41 lines — cinematic + NPC Moreau intro)
6. `levels/m0-exam-room/dialogues.ts` (41 lines)
7. `levels/m0-core-ai/dialogues.ts` (72 lines — includes CORE AI diagnostic + firmware)
8. `levels/m0-crew-room/dialogues.ts` (51 lines — includes Floobert + Harris)

**Line-length note:** English runs ~10–15% longer than Polish on average. Dialogue lines with `autoAdvance` timing are especially sensitive — verify no line feels rushed or drags.

### B2. Bilingual content parity test

**File**: `src/explorers/levels/levelLoader.test.ts` (extend or create)

```ts
import { describe, it, expect } from 'vitest';
import { getAllDialogues } from './levelLoader';
import { getAllExams } from './levelLoader';     // verify export exists or use direct import
import { getAllQuests } from './levelLoader';     // same
import type { BilingualText } from '../i18n/types';

function isBilingual(v: unknown): v is BilingualText {
  return typeof v === 'object' && v !== null && 'pl' in v && 'en' in v;
}

function checkBilingual(value: BilingualText, path: string) {
  expect(value.pl, `${path}: pl must be non-empty`).not.toBe('');
  expect(value.en, `${path}: en must be non-empty`).not.toBe('');
  expect(value.pl, `${path}: en must differ from pl (placeholder check)`).not.toBe(value.en);
}

describe('bilingual content parity', () => {
  it('all dialogue lines have non-empty, distinct pl and en', () => {
    const dialogues = getAllDialogues();
    for (const [seqId, seq] of dialogues) {
      seq.lines.forEach((line, i) => {
        checkBilingual(line.text, `${seqId}[${i}].text`);
      });
    }
  });

  it('all exam fields have non-empty, distinct pl and en', () => {
    // import exams directly from content files and check
    // ...
  });

  it('all quest fields have non-empty, distinct pl and en', () => {
    // ...
  });

  it('RANK_FLAVOR has non-empty, distinct pl and en for all tiers', () => {
    // ...
  });
});
```

Extend the whitelist as needed for intentionally identical values (e.g., proper nouns that don't translate, CORE AI, SmartTerminal).

### Success Criteria — Phase B

- [x] `npm run test --workspace=projects/edu-platform` passes including bilingual content parity test
- [ ] `npm run build --workspace=projects/edu-platform` passes
- [ ] In `en` mode, all visible content reads natural English (spot-check: CORE AI diagnostic dialogue, exam questions, quest briefings, rank-up flavour)
- [ ] Character voices are consistent (Moreau dry/evasive, Harris formal, astronaut terse)
- [ ] No proper nouns changed (Floobert, Moreau, Harris, Dexo)
- [ ] Titles consistently `Engineer`/`Officer`
- [ ] Rank names unchanged (`Space Adept`, `Moon Engineer`, etc.)

---

## Phase C: Full regression + final verification

**Goal**: Build and all tests pass; original plan's Phase 5 QA can proceed.

- [x] `npm run build --workspace=projects/edu-platform` succeeds
- [x] `npm run test --workspace=projects/edu-platform` — all tests pass (1 pre-existing failure in generatedLessonHtml.test.ts, unrelated)
- [x] `npm run lint` — no new errors (1 pre-existing panelLeft error in ExamScene.ts, not introduced by this work)
- [x] Manual smoke test: toggle locale mid-dialogue → Polish text swaps correctly
- [x] Manual smoke test: run exam in `en` mode → English questions and options render
- [x] Manual smoke test: `/quest` command in `en` mode → English title/briefing
- [x] Update `2026-04-28-explorers-localization-en-pl.md` plan status to reflect that Phase 2 is now actually done

---

## References

- Parent plan: `thoughts/shared/plans/2026-04-28-explorers-localization-en-pl.md`
- `BilingualText` + `localized()`: `src/explorers/i18n/types.ts`
- UI chrome parity test (already passing): `src/explorers/i18n/strings.test.ts`
- Read-path entry points: `src/explorers/ui/DialogueBar.ts:113`, `src/explorers/scenes/ExamScene.ts:84,146,228`, `src/explorers/terminal/commandHandler.ts:168-211`

<!-- PLAN COMPLETED: 2026-04-29 -->
