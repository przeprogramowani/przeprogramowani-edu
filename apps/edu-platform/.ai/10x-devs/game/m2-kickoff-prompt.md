# Kickoff prompt — Module 2: "Księżyc 2: Śnieżna kraina" (planning module)

Paste the prompt below into a fresh session to start Moon 2 work.

---

Read `.ai/10x-devs/game/narrative-snapshot.md` (ground truth of the story so far) and
`.ai/10x-devs/game/m1-narrative-bible.md` (voice, formatting, and technical-constraint
reference), then `.ai/10x-devs/game/cookbook.md` (map authoring pipeline) and
`.ai/10x-devs/game/storyline.md` + `player-progression.md`.

Task: design and write **Module 2 — Moon 2, a snow/ice world** where Dexo repairs
CORE AI's **planning module**. Course topic: **10xDevs Workflow** — plan-first
development, MVP milestones, architecture with agents, implementation control, solo
code review. Work in two phases:

**Phase 1 — narrative bible first.** Produce `.ai/10x-devs/game/m2-narrative-bible.md`
modeled on the m1 bible's structure (canon bridge, module spine, threads, cast, per-level
beats, explicitness checklist, hard constraints, verification). Requirements:

- Setting: a frozen VOID installation on Moon 2 — snow, ice, whiteout, cold as a
  narrative device (systems dormant/preserved rather than overgrown; the jungle moon
  reclaimed VOID's machines, the snow moon *froze them mid-task*).
- Canon bridge from m1, stated explicitly in the first level's intro: sensors restored
  ("CORE AI now sees" — let it comment on seeing snow for the first time), Synaptit
  deposit confirmed and awaiting extraction planning, Moreau awake aboard Odyssey
  (available on comms as a recurring voice), Harris still in quarantined hibernation,
  VOID aware of the crew's presence (the beacon), and the suspect HQ channel signed
  with a Voronov-like key — decide and state how the crew communicates with Earth HQ
  now that the channel is compromised (this should shape the module's HQ missions).
- Module spine: pick an explicit, repeated rule equivalent to m1's operator-certificate
  rule, themed around **planning** (e.g. frozen VOID systems only act on an approved
  plan artifact; nothing moves without a reviewed plan — make it diegetic and stated
  out loud by CORE AI in level 1).
- Escalate, do not resolve: the insider who flagged Dexo before launch; Harris;
  the Voronov key; VOID's response to the beacon (Moon 2 may show the first *reaction*
  — e.g. something arrives, wakes, or redirects — but no confrontation yet).
- Keep the established voices (snapshot §6). New VOID units get the
  "Jednostka ... Kolektywu VOID" introduction pattern with one-line personalities,
  cold-themed. Moreau now exists as a live comms character — use him sparingly and warm.
- Structure: five levels mirroring the m1 arc (entry level with the bridge recap →
  three teaching rooms → finale that repairs the planning module and lands a sting),
  mixing in-game certificate exams with Navigator HQ missions (api-answer) exactly like
  m1 (2 event quests + 3 HQ missions). First map key must be `m2-planning` (the
  moon-two-door in m1-uplink-bay already targets it). Map each level to one workflow
  lesson (plan-first, MVP milestones, architecture with agents, implementation control,
  solo code review).

Stop after Phase 1 and present the bible for approval before writing any game content.

**Phase 2 — implementation (after approval).** Build the five levels end to end:
`map.level.yaml` sources (compiled with `npm run levels:build` — never edit the JSON),
manifests, dialogues, quests, exams, new FLAGS entries, `levels/index.ts` and
`navigationDestinations.ts` registration, and the HQ side (prompts + inputs +
`QUEST_INDEX.csv` rows in `~/dev/10x-explorers-hq/module-002-*`, static files only —
no runners or validators). All player-facing text bilingual (pl + en, Polish primary);
autoAdvance only on system/cinematic lines (1500–3500 ms); satisfy the m1 bible's §8
explicitness checklist in every level. After each level run
`npx vitest run src/explorers/levels/contentValidation.test.ts src/explorers/levels/bilingualParity.test.ts`
plus `npm run levels:check`, and finish with the full vitest suite. Do not commit.

---

## Context notes for the session (not part of the prompt)

- `FLAGS.SYS_COURSE_M2_AVAILABLE` already exists and gates the m1 → m2 door together
  with `m1-uplink-done`; new m2 progression/exam flags must be added to `flags.ts`.
- The m1 finale's last line promises: "Przed nami Księżyc 2 i moduł planowania.
  Tym razem lecimy z otwartymi oczami. Dosłownie." — the m2 intro should pay that off.
- Retired quest IDs that must not be reused: `q-synaptit-prd-audit`, `q-echotrace-skill`,
  `q-shaft-controller-policy`, `q-moreau-context`, `q-uplink-to-earth`.
- api-answer quests are a cross-system contract (quest ID ↔ answerHash ↔ HQ inputs ↔
  `earthctl` submission) — design the canonical answers before hashing.
