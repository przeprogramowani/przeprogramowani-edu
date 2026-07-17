# XP / Rank Balance Review

## Context

This note reviews the current progression system after adding arcade mini-games and compares it with the intended structure of the game:

- intro chapter (`Milestone 0`)
- 5 main modules / moons

The goal is to answer 3 questions:

1. How ranks work today
2. How much XP the player can gain now
3. How to make the system scalable for intro + 5 modules

## 2026-03-25 implementation update

Arcade progression has since been shipped with a different runtime model than the one analyzed below:

- arcade stations no longer grant repeatable runtime XP
- first clear now sets a station-scoped flag derived from `mapKey + zoneId + arcadeGameId`
- first clear can trigger one-time dialogue and emit enriched `ARCADE_COMPLETED` payloads for quest matching
- replay remains available, but it is progression-neutral

The detailed XP formulas later in this note are kept as historical analysis of the pre-change implementation.

---

## 1. How ranks work today

Ranks are fully derived from total XP in [`src/explorers/config/ranks.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/config/ranks.ts).

Current thresholds:

| Tier | Name | Min XP | Delta from previous |
|------|------|--------|---------------------|
| 1 | `???` | 0 | - |
| 2 | `Space Scout` | 100 | 100 |
| 3 | `Moon Engineer` | 1000 | 900 |
| 4 | `Solar Builder` | 2000 | 1000 |
| 5 | `Stellar Explorer` | 3000 | 1000 |
| 6 | `Cosmic Architect` | 4000 | 1000 |
| 7 | `Deep Space Pioneer` | 5000 | 1000 |

Important properties of the current system:

- Rank is not stored separately. Only `state.xp` is stored.
- Rank-up is detected from `XP_GAINED` events in [`src/explorers/PhaserGame.svelte`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/PhaserGame.svelte).
- Rank-up dialogues are global and generated from the rank table in [`src/explorers/config/ranks.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/config/ranks.ts).
- The CORE AI door already depends on hitting `Space Scout` (`100 XP`) plus exam flags, so tier 2 is part of the intro flow.

### Structural mismatch

The current rank table implicitly assumes a very large amount of XP:

- from intro completion (`220 XP` currently) to max rank (`5000 XP`) there are `4780 XP` left
- with only 5 future modules, that means an average of `956 XP per module`

That number is too high for the current content model, where normal quest and exam rewards are tens or low hundreds of XP.

---

## 2. Current XP sources

### Intended one-time XP in intro

From current content files:

| Source | XP | File | Repeatability in practice |
|------|----:|------|----------------------------|
| Exam: agent systems | 30 | [`src/explorers/levels/m0-exam-room/exams.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-exam-room/exams.ts) | one-time |
| Exam: workflow | 30 | [`src/explorers/levels/m0-exam-room/exams.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-exam-room/exams.ts) | one-time |
| Exam: context engineering | 30 | [`src/explorers/levels/m0-exam-room/exams.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-exam-room/exams.ts) | one-time |
| Quest: pass exams | 20 | [`src/explorers/levels/m0-exam-room/quests.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-exam-room/quests.ts) | one-time |
| Quest: earth signal | 100 | [`src/explorers/levels/m0-core-ai/quests.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-core-ai/quests.ts) | intended one-time |

Current intro total:

- `30 + 30 + 30 + 20 + 100 = 210 XP`

This means that without any arcade play:

- the player ends intro at `210 XP`
- the player already clears tier 2 (`100 XP`)
- the player is already `21%` of the way to tier 3 (`1000 XP`)

### Arcade XP

Arcade XP is granted in [`src/explorers/scenes/ArcadeScene.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/scenes/ArcadeScene.ts) with:

```ts
xpReward = baseXp + floor(score * scoreMultiplier)
```

Defined games in [`src/explorers/levels/m0-crew-room/games.ts`](/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/src/explorers/levels/m0-crew-room/games.ts):

| Game | Formula | Repeatable | Practical ceiling |
|------|---------|------------|-------------------|
| Asteroid Range | `5 + floor(score * 0.1)` | yes | effectively uncapped for progression purposes |
| Memory Matrix | `8 + floor(score * 0.5)` | yes | `73 XP` on a perfect run |
| Oscilloscope | `10 + floor(score * 0.15)` | yes | `25 XP` on a perfect run |

Notes:

- `Memory Matrix` max score is effectively `130`, so max XP is `8 + floor(130 * 0.5) = 73`
- `Oscilloscope` max score is `100`, so max XP is `10 + floor(100 * 0.15) = 25`
- `Asteroid Range` has no score cap and no reward cap

### Why Asteroid Range is dangerous

The asteroid game has:

- `SHOT_COOLDOWN_MS = 200`
- duration `60s`
- max value asteroid = `50 points`

That means a mechanical upper bound of roughly:

- `300 shots` per run
- `300 * 50 = 15000 score`
- `5 + floor(15000 * 0.1) = 1505 XP`

So a single extremely strong run can exceed the full `1000 XP` threshold for tier 3 by itself.

### XP totals with current content

Safe bounded total if the player completes intro and then plays one perfect run of the bounded arcade games:

- intro static XP: `210`
- perfect Memory Matrix: `73`
- perfect Oscilloscope: `25`
- total: `308`

The asteroid game blows this up completely because it is repeatable and uncapped.

---

## 3. Current exploit paths

### Repeatable arcade XP with no cap

Arcade rewards are currently:

- fully repeatable
- counted in the same XP currency as story progression
- not capped per game, per day, per chapter, or per best score

Result:

- optional practice content can dominate main progression
- future rank balancing becomes impossible because the same currency is used for both chapter completion and infinite training

---

## 4. What the scalable model should optimize for

For intro + 5 modules, the progression system should do 4 things:

1. Intro should give the first rank cleanly and predictably
2. Each main module should move the player roughly one rank forward
3. Optional / repeatable practice should never let the player skip the chapter arc
4. Reward claiming must be idempotent

The current system only satisfies point 1 partially.

---

## 5. Recommended direction

## Option A: Keep one XP currency, but split reward types operationally

This is the smallest scalable change.

### Rule set

- `story XP`:
  - quests
  - exams
  - one-time narrative milestones
  - counts toward ranks
- `practice XP`:
  - arcade
  - repeatable drills
  - should be heavily capped or converted to first-clear / best-score rewards

### Required system changes

1. Add reward idempotency
2. Convert arcade from infinite linear XP to milestone-based XP

### Suggested implementation shape

Add a reward claim registry to game state, for example:

```ts
claimedRewards: string[];
```

Every XP grant should have a stable `rewardId`, and the runtime should grant it only once unless the reward explicitly declares itself repeatable.

This is more scalable than relying on a mix of flags, completed quests, and scene-specific logic.

---

## 6. Recommended rank pacing for intro + 5 modules

The current `0 / 100 / 1000 / 2000 / ... / 5000` table does not fit the planned structure.

There are exactly 6 progression arcs:

1. Intro
2. Module 1
3. Module 2
4. Module 3
5. Module 4
6. Module 5

There are also exactly 6 rank-ups available:

1. `???` -> `Space Scout`
2. `Space Scout` -> `Moon Engineer`
3. `Moon Engineer` -> `Solar Builder`
4. `Solar Builder` -> `Stellar Explorer`
5. `Stellar Explorer` -> `Cosmic Architect`
6. `Cosmic Architect` -> `Deep Space Pioneer`

That means the cleanest design is:

- intro = first rank-up
- each of the 5 modules = one more rank-up

### Recommended chapter-budgeted thresholds

One workable example:

| Tier | Name | Suggested Min XP |
|------|------|------------------|
| 1 | `???` | 0 |
| 2 | `Space Scout` | 100 |
| 3 | `Moon Engineer` | 250 |
| 4 | `Solar Builder` | 450 |
| 5 | `Stellar Explorer` | 700 |
| 6 | `Cosmic Architect` | 1000 |
| 7 | `Deep Space Pioneer` | 1350 |

Why this shape:

- the first rank-up stays fast for onboarding and the current door gate
- later ranks still require more effort
- full game total is realistic for intro + 5 modules
- it no longer forces roughly `951 XP` out of every future module

This table only works well if intro rewards are also reduced and normalized.

---

## 7. Recommended intro budget

Intro should probably end near `100 XP`, not `210 XP`.

That gives:

- a clean `Space Scout` unlock
- a meaningful sense of progress
- room for module 1 to own the next rank-up

### Suggested intro rebalance

Proposed mandatory intro rewards:

| Source | Suggested XP |
|------|--------------:|
| Exam 1 | 20 |
| Exam 2 | 20 |
| Exam 3 | 20 |
| Quest: pass exams | 20 |
| Quest: earth signal | 20 |
| **Total** | **100** |

Reasoning:

- exams and quests are the clearest progression anchors
- `100 XP` maps exactly to `Space Scout`

If some optional intro content should still reward exploration, it should unlock:

- cosmetics
- codex / lore entries
- bookmarks
- training credits

not raw rank XP.

---

## 8. Recommended arcade redesign

Arcade is good as repeatable practice, but bad as infinite rank progression.

### Best scalable model

Arcade should not grant linear infinite rank XP.

Instead use:

- first clear reward
- best-score milestone reward
- tiny practice reward with a hard cap

### Example

For each arcade game:

- first completion: `+10 rank XP`
- bronze / silver / gold thresholds: `+5 / +10 / +15 rank XP`, claim once each
- repeat plays after all milestones:
  - `0 rank XP`
  - optionally give non-rank currency

This preserves replay value without destroying chapter pacing.

### If we want to keep some repeatable XP

Then at minimum:

- cap repeatable arcade rank XP per chapter
- cap repeatable arcade rank XP per game per day
- use diminishing returns

Example:

- 1st play today: 100%
- 2nd play today: 50%
- 3rd play today: 25%
- 4th+ play today: 0%

Even this is weaker than milestone rewards, but far safer than the current linear model.

---

## 9. Immediate fixes to make now

### Must-fix progression bugs

1. Stop arcade from granting uncapped progression XP

### Good follow-up fixes

1. Add `rewardId` / `claimedRewards` support
2. Turn arcade rewards into first-clear / threshold rewards
3. Revisit rank thresholds after locking chapter XP budgets

---

## 10. Recommended product decision

The cleanest long-term approach is:

- ranks should measure chapter progression
- repeatable practice should not be the main source of rank XP
- each chapter should have an intentional XP budget
- rewards should be explicitly claimable once

In practice:

- rebalance intro to about `100 XP`
- compress the rank thresholds to fit 6 arcs
- move arcade to milestone rewards or separate practice currency
- add idempotent reward claiming at the system level

That gives a progression model that matches the actual game structure instead of fighting it.
