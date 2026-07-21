# M1 Narrative Bible — "Księżyc 1: Strefa wydobywcza VOID"

Continuity/style contract for the full m1 rewrite. Every rewrite agent follows this exactly.
Spec commentary in English; all player-facing text bilingual (pl + en), Polish is the primary creative voice, English is a faithful translation (not word-for-word stiff).

## 1. Why the rewrite

M0 built: personal voice (Dexo's monologues), explicit scaffolding (protocols, NPCs who explain),
humor, and open mystery threads. Current M1 is terse tech-speak with implicit worldbuilding.
The rewrite makes M1 feel like the same game: **explain everything on screen** — where we are,
why we came, who is talking, what's blocking us, what just happened, and what it means.

## 2. Canon bridge from M0 (must be stated explicitly in m1-landing-pad intro and reinforced elsewhere)

1. After the Earth-signal handoff (end of m0), Earth HQ ran a remote mitigation of CORE AI.
   Result: **CORE AI is back in degraded "field mode"** — voice and terminal interface only.
   Sensors, planning, self-diagnostics, long-term memory, comms array: still offline/damaged.
   This is why CORE AI can now speak (it couldn't in m0). CORE AI knows and admits its limits.
2. Odyssey flew from Earth orbit to the Main Belt and reached **Moon 1**. For the transit,
   **Moreau and Harris returned to hibernation** — the ship in emergency power mode cannot
   sustain a waking crew. Wake cycles are rationed. (This resolves the m0 contradiction where
   both were awake.)
3. **Dexo descends to the moon alone** (with CORE AI in the suit/terminal uplink), because Dexo
   is the AI-systems specialist — callback to Harris in m0: "you will understand why they chose
   you and why it has to be you."
4. The moon's surface holds an **abandoned VOID extraction facility** overgrown by jungle.
   REVEAL (landing pad): VOID didn't just destroy Earth's Synaptit — they came to the Belt
   first, to control the off-world supply. The facility is deserted; only their machines remain.
5. Mission objective of Moon 1, stated plainly and repeated: **(a) confirm a Synaptit deposit,
   (b) restore CORE AI's basic sensors** using VOID's own infrastructure and Earth HQ support.

## 3. The module's explicit spine

- **VOID operator certification.** VOID machines obey anyone carrying valid operator
  certificates. The certification terminals still work. So Dexo passes VOID's own captured
  operator tests ("Przechwycony test VOID") to make the facility cooperate. State this rule
  out loud in m1-landing-pad (CORE AI explains it) — currently it's only implied.
- **HQ missions = the Navigator working at Earth HQ.** The api-answer quests are performed in
  the real world by the **Navigator** (the player-programmer on Earth, established in m0
  "first-contact"). Dialogue must say explicitly: "to zadanie dla Nawigatora — łącze /support,
  Earth HQ". Dexo waits on the moon; results come back over the uplink.
- **Entropy's signature (recurring motif, named explicitly by CORE AI in shaft-control):**
  the virus doesn't destroy systems — it **removes their guardrails and overwrites what
  identifies people**. Evidence across rooms: Dexo's memory sector 0x7F OVERWRITTEN (m0),
  the PRD archive scrambled (landing pad), the shaft controller's permission policy stripped
  to "allow everything" (shaft control), the recall code bound to Harris (profile vault).

## 4. Threads carried from m0 (do not resolve, escalate)

- Who erased Dexo's memory and why only Dexo's? (Profile vault adds: VOID's copy of Dexo's
  profile carries an instruction marker to overwrite sector 0x7F — someone flagged Dexo
  *before launch*.)
- Scratches on the hibernation pod / pods #1 and #2 elsewhere — do NOT explain, may echo once.
- VOID / Entropy / Voronov ("Null"). Voronov's key appears at the very end (uplink reply).
- Harris "przewidzieliśmy komplikacje" (m0) → profile vault discovers the Entropy recall code
  bound to Harris's wake circuit → "nie budźcie Harrisa".
- New thread opened by m1: the beacon told VOID that Odyssey is here (shaft control).

## 5. Cast & voices (speaker strings EXACTLY as listed)

- `astronaut` — Dexo. Monologues: dry, curious, a little scared, wry. Mirrors m0 voice
  ("Okej, potrzebuję kartki i ołówka...", "I tak mam dość problemów."). Never lore-dumps;
  reacts like a person.
- `CORE AI` — new speaking character. Weakened, precise, deadpan; self-aware about running in
  degraded mode (may once self-describe as "autouzupełnianie z ambicjami" — a dry nod to its
  own state). Explains plans and reasons clearly: it is the module's explicit narrator.
  Occasionally admits: "nie widzę" (no sensors) — that ache is the emotional engine of Moon 1.
- `system` — terse diegetic UI lines, ALL-CAPS headers, same style as m0.
- `inżynier Moreau` — same person as m0: warm, jokey, deflects with humor (coffee, the
  dentist week). When woken in profile vault he keeps that voice, sobered by what he learns.
- VOID units (NPC robots). Keep designations, give one-line personalities; each introduces
  itself ("Jednostka ... Kolektywu VOID") the first time:
  - `Scout R-4` (landing pad) — polite, eager-to-serve scout with a damaged index; slightly
    apologetic.
  - `Surveyor C-7` (landing pad) — matter-of-fact canopy surveyor; counts everything.
  - `Echo Mapper E-2` (echo depths) — lonely acoustic cartographer; speaks in echoes/measures,
    quietly glad to have a listener again.
  - `S-03` (shaft control) — dutiful custodian of Shaft 03; janitor's pride in "his" shaft.
  - `Sentinel P-9` (shaft control) — pedantic policy auditor; checklist zealot (comic contrast
    with S-03).
  - `Archive Echo` (profile vault) — a looping playback of a long-gone VOID archivist; eerie,
    fragmentary, half-aware it's a recording.
  - `Vault Indexer V-6` (profile vault) — fussy librarian; hates redundancy.
  - `Relay Tender T-8` (uplink bay) — patient old lineman of the relay; respects the human
    boundary rule as sacred.
  The units serve whoever holds valid operator certificates — they are not friends, they are
  *infrastructure*, and Dexo can find that unsettling (a monologue may note it).

## 6. Glossary (bilingual, use consistently)

- Kolektyw VOID / the VOID Collective; wirus Entropia / the Entropy virus ("Entropia" alone ok).
- Synaptit / Synaptit. CORE AI / CORE AI. Nawigator / the Navigator. Earth HQ / Earth HQ.
- certyfikat operatora VOID / VOID operator certificate; "Przechwycony test VOID" (exam titles
  stay as-is, exams.ts is untouched).
- misja HQ / HQ mission (api-answer quests); terminal certyfikacyjny / certification terminal.
- tryb awaryjny (CORE AI field mode) / degraded field mode.
- sensory podstawowe / basic sensors (Moon 1 target subsystem).

## 7. Hard technical constraints (NON-NEGOTIABLE)

- Do NOT touch: `map.level.yaml`, `exams.ts`, dialogue IDs, zone IDs, `interactionRoutes`
  wiring, quest IDs, `completionType`, `answerHash`, `matchPayload`, `requireFlag`, rewards
  (XP + flags), `onComplete` effects (setFlags/activateQuest must keep exactly the same values),
  `speaker` category strings (`astronaut`, `system`, `CORE AI`, `inżynier Moreau`, NPC
  designations as listed above).
- Rewrite ONLY: `text` values of dialogue lines (you may add/remove/reorder LINES within a
  sequence freely), quest `title`? — NO, keep quest titles verbatim (HQ docs reference them);
  rewrite quest `briefing`, `hint`, `hints` PHRASING while preserving every factual
  instruction (file paths like PROMPT_ECHOTRACE.md, answer formats/order, token rules,
  fresh-session advice, terminal locations). Objective `label` text may be polished.
- Every `text`/`briefing`/`hint` stays bilingual `{ pl, en }`, non-empty, `pl !== en`
  (except pure `═` separators). No Floobert-style identical strings.
- `autoAdvance` only on `system`/`cinematic` lines (match m0 pacing: 1500–3500ms; scale with
  line length). `monologue`/`dialogue` lines have no autoAdvance.
- Keep file structure: same imports, same export shape, English code comments.
- Manifests: the ONLY allowed change is adding `introCinematicTitle` / `introCinematicSubtitle`
  (plain Polish strings, matching the landing-pad convention) where specified below.

## 8. Explicitness checklist (each level must satisfy)

1. Intro states: where we are, how we got here, what we're after, what stands in the way.
2. Every quest-activation dialogue states the fiction AND the concrete task AND who does it
   (Dexo on the moon vs Navigator at Earth HQ).
3. Every locked-door dialogue says exactly what to do to open it.
4. Every completion dialogue states what changed and points at the next step.
5. First encounter with each NPC includes a one-line introduction of who/what it is.
6. Big reveals get a Dexo monologue reaction (like m0's "To nie awaria. To sabotaż.").

## 9. Per-level beats

### m1-landing-pad — "Zarośnięte Lądowisko"
Intro (expand to ~8-9 lines, cinematic → dialogue): landing card already exists; recap bridge
(crew hibernating, CORE AI field-mode via HQ mitigation, why Dexo alone), the overgrown dome,
the reveal "to instalacja VOID — byli tu przed nami", objective (Synaptit + sensors), first
directive: the operation archive. CORE AI introduces the operator-certificate rule here.
- operation-archive-start: corrupted PRD (Entropy scrambled it — say so), why the contract
  matters, quest activation (certification terminal in the south).
- inactive-drone: dread flavor (four dead guard drones) + one wry Dexo line.
- disabled-scout / canopy-surveyor: introduce R-4 and C-7 as VOID units that answer to
  certificates; they explain their broken indexes in character.
- echo-door-locked: explicit: "zdaj test Kontrakt PRD w terminalu na południu".
- exam done: certificate → machines now obey Dexo; irony beat (Dexo formally a VOID operator);
  explicit unlock of the eastern gallery; nudge toward Echo Depths.
Manifest: keep existing cinematic title/subtitle.

### m1-echo-depths — "Rozpadlina Echa"
Intro: three sealed cavities over hollow ground; walking in = death; CORE AI has no sensors →
"we must build a sense we don't have" — explicit statement that this is the Navigator's HQ
mission (a reusable EchoTrace procedure/skill).
- echo-console-start: explain token/auth (HQ scans are protected), why one-off calls are not
  enough (three cavities today, more moons tomorrow), activation.
- cavity dialogues: pre-scan = readable trace cards + short Dexo/system beats; post-scan =
  results WITH emotional color: ALPHA collapsed tunnel (relief we didn't walk in), BETA pure
  Synaptit (the "this is why we flew" beat — biggest emotional high of the module so far),
  GAMMA artificial shaft + active substation (dread, VOID is still switched on).
- echo-mapper (E-2): introduce; spatial guidance; post-state points at eastern gate.
- shaft-door-locked: explicit requirement (classify all three cavities via EchoTrace).
- echotrace-complete: state what we gained (a repeatable sense, /scan) and the decision to
  enter Substation 03.
- exam-agent-skills-done: tie certificate to what was just built.
Manifest: add introCinematicTitle 'Księżyc 1 — Rozpadlina Echa',
introCinematicSubtitle 'Trzy zapieczętowane komory'.

### m1-shaft-control — "Podstacja Szybu 03"
Intro: first ACTIVE VOID facility; the GAMMA signal source; east hatch blocks the way to the
profile archive.
- shaft-controller-start: the controller obeys EVERYTHING — CORE AI names the Entropy MO
  explicitly ("Entropia nie niszczy systemów. Zdejmuje im zabezpieczenia.") and links it to
  Dexo's overwritten memory sector — same signature. Plan: pass safe-bootstrap cert → terminal
  applies approved policy → safe restart → hatch opens.
- bootloader-core / custodian S-03 / sentinel P-9: introductions + the fix-the-smallest-broken-
  part reasoning, in character (S-03 proud, P-9 pedantic checklist).
- signature-beacon-dormant: a transmitter wired into the controller, waiting. Ominous.
- exam done (this is the twist beat): certificate granted, hatch opens, THEN the beacon fires:
  ODYSSEY signature transmitted, recipient acknowledged. CORE AI: the open policy was bait —
  a trap for whoever fixed it. Dexo monologue: "Zrobiliśmy wszystko dobrze. I właśnie dlatego
  nas usłyszeli." VOID now knows the crew is here.
- signature-beacon-active / custodian-done / sentinel-done: post-state reinforcing the trap
  reading; push toward the archive (answers about how VOID knows our signature).
- profile-door-locked: explicit instruction.
Manifest: add introCinematicTitle 'Księżyc 1 — Podstacja Szybu 03',
introCinematicSubtitle 'Aktywna instalacja VOID'.

### m1-profile-vault — "Magazyn Profili"
The module's biggest reveal room. Intro: VOID stored copies of ODYSSEY crew profiles —
dated BEFORE launch. Dexo monologue: someone inside Project Odyssey fed them everything;
that's how Entropy got aboard.
- profile-cache-start: 200 rules / 3 genuine signatures / 197 noise; Moreau (asleep on the
  ship) is the radio specialist we need awake; explicit: HQ mission for the Navigator — build
  a MINIMAL onboarding packet (context engineering made literal). Explain WHY minimal: a
  waking mind drowning in noise makes mistakes (mirror of agent onboarding).
- moreau-profile: what Moreau knows vs lacks; small warm beat (his dentist joke may echo here:
  his file lists "tydzień jako dentysta" incident — one wink max).
- recall-code (pre): an encrypted third signature bound to... unknown. Unsettling.
- Dexo's own profile hook: in cache-start or a monologue, the vault's copy of Dexo's profile
  carries a foreign marker: sector 0x7F flagged for overwrite. Callback to m0. Do not resolve.
- wake-relay / archive-echo / vault-indexer: introduce Archive Echo (looping recording) and
  V-6 (anti-redundancy librarian); both teach the "difference, not a copy" principle in voice.
- moreau-onboarding-complete: Moreau wakes with his m0 voice ("Obudziliście mnie... mam
  nadzieję, że jest kawa."), then sobers: the third signature is an Entropy recall code bound
  to Harris. "Nie budźcie go." CORE AI quarantines Harris's wake circuit. Uplink bay opens.
- exam-agent-onboarding-done: certificate beat; "dobry kontekst to różnica, nie kopia".
- uplink-door-locked: explicit.
Manifest: add introCinematicTitle 'Księżyc 1 — Magazyn Profili',
introCinematicSubtitle 'Archiwum danych załogi ODYSSEY'.

### m1-uplink-bay — "Rezerwowa Zatoka Uplink"
Intro: last room of Moon 1. Goal explicit: transmit the sensor-calibration package and our
coordinates to Earth HQ to finish restoring CORE AI's basic sensors. Three routes, real
trade-offs, and one rule above all: **a machine may prepare the transmission, only a human
may authorize it** — CORE AI itself insists on this (it remembers what happens when machines
hold every permission — Entropy's whole point).
- uplink-console-start: explain the three routes exist because VOID built redundancy; the
  Navigator's HQ mission: pick route + minimal payload, adversarial review, stop at the human
  boundary.
- route dialogues: keep the trade-off data but render as readable system cards + one short
  CORE AI or Dexo line each (not bare metadata).
- human-auth (pre/post): the emotional core — Dexo's hand on the physical switch; responsibility
  stays human.
- relay-tender T-8: introduce; walk-all-three-routes guidance; the boundary rule as his creed.
- uplink-decision-complete (module finale, expand ~8-10 lines): transmission confirmed; CORE AI
  sensor package RESTORED — give CORE AI a genuine emotional beat ("Widzę. Pierwszy raz od
  przebudzenia — widzę."); then the sting: HQ's reply signed with a key outside the crew
  registry, resembling **Voronov's** key; Dexo monologue wrap-up of Moon 1 (Synaptit found,
  sensors back, VOID knows we're here, and someone is inside our channel) + hook to Moon 2
  (planning module next).
- moon-two-locked: explicit (finish the transmission / wait for stage 2).
- exam-authorization-boundary-done: keep the CV joke (it's good, in-voice).
Manifest: add introCinematicTitle 'Księżyc 1 — Rezerwowa Zatoka Uplink',
introCinematicSubtitle 'Ostatni krok do odzyskania sensorów'.

## 10. Verification per level

After edits run from projects/edu-platform:
`npx vitest run src/explorers/levels/contentValidation.test.ts src/explorers/levels/bilingualParity.test.ts`
Both must pass. Do not run levels:build (no YAML changes).

## 11. Execution context for a fresh session (read before writing anything)

Required reading, in this order:
1. This file, fully.
2. `.ai/10x-devs/game/backstory.md` and `.ai/10x-devs/game/storyline.md` — canon.
3. All four m0 dialogue files (`src/explorers/levels/m0-*/dialogues.ts`) — this is the voice
   and formatting reference (line shape, autoAdvance pacing, monologue/system/dialogue mix).
4. `src/explorers/m1-quest-interface.md` — the stable level surface: preserved zone IDs,
   flags, doors, and the api-answer cross-system contract. Treat it as binding.
5. The current five m1 levels (`src/explorers/levels/m1-*/{dialogues,quests,manifest}.ts`) —
   the structures being rewritten.
6. `src/explorers/config/flags.ts` — all flags referenced in m1 files already exist; add none.

Files to MODIFY (nothing else):
- `src/explorers/levels/m1-landing-pad/dialogues.ts` + `quests.ts`
- `src/explorers/levels/m1-echo-depths/dialogues.ts` + `quests.ts`
- `src/explorers/levels/m1-shaft-control/dialogues.ts` + `quests.ts`
- `src/explorers/levels/m1-profile-vault/dialogues.ts` + `quests.ts`
- `src/explorers/levels/m1-uplink-bay/dialogues.ts` + `quests.ts`
- The four manifests listed in §9 — ONLY to add `introCinematicTitle`/`introCinematicSubtitle`.

Files that must NOT change: `map.level.yaml`, `exams.ts`, `public/game/maps/*`, anything in m0,
`flags.ts`, `levels/index.ts`, `navigationDestinations.ts`.

Suggested workflow: one level at a time in map order (landing-pad → echo-depths →
shaft-control → profile-vault → uplink-bay), running the §10 tests after each level, then a
final full read-through of all five dialogue files in sequence to check voice/terminology
drift and thread continuity (§4).
