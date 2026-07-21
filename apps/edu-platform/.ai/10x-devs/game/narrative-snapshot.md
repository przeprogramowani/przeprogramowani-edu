# Narrative Snapshot — state of the story after Moon 1

Canonical summary of everything the player has seen on screen through the end of m1
(post the 2026-07 narrative rewrite). A fresh writing session should treat this file as
the ground truth of "what has already been established", and `m1-narrative-bible.md`
as the reference for voice, formatting, and technical constraints.

Spec commentary in English; all player-facing text is bilingual (pl + en), Polish first.

## 1. Premise (backstory, pre-game)

- 2030: the **VOID Collective** (Vanguard of Intelligent Disruption, neo-Luddite
  extremists) destroys Earth's **Synaptit** production — the superconductor all advanced
  AI runs on. Global AI collapse follows.
- **Project Odyssey**: a covert five-person mission to the Main Belt, where natural
  Synaptit exists. Crew hibernates for transit.
- VOID's sleeper virus **Entropy** infects the ship's **CORE AI**; it activated on first
  crew wake-up. Mentioned-never-seen leader: **Kazimierz "Null" Voronov**
  ("Null zwrócił undefined i zniknął").

## 2. Module 0 — Awakening (aboard Odyssey)

- **Dexo** (Pod #3) wakes with total amnesia; scratches inside the pod; log fragment
  "SYNCHRONIZACJA NEURONALNA — PRZERWANA".
- Identity found in the crew room: Dexo's record reads
  `[DANE USZKODZONE — SEKTOR PAMIĘCI 0x7F NADPISANY]` — overwritten, not damaged;
  only Dexo's. ("Ktoś to zrobił celowo.")
- **Moreau** (Pod #1): warm, jokey, deflects (coffee; "przez tydzień myślałem, że jestem
  dentystą"). **Harris** (Pod #2): training officer; "przewidzieliśmy pewne komplikacje.
  Nie wszystkie." and "kiedy tam wejdziesz, zrozumiesz, dlaczego cię wybrali.
  I dlaczego to musi być właśnie ty."
- Dexo passes three verification exams (memory-recall framing), reaches CORE AI:
  every subsystem OFFLINE/DAMAGED — "To nie awaria. To sabotaż."
- SmartTerminal firmware v3.0 unlocks `/navi` and `/support`; Earth HQ contact
  established; the **Navigator** (the real-world player at Earth HQ) becomes Dexo's
  remote partner. Chapter closes with the Earth-signal handoff.

## 3. Bridge into Module 1 (stated in the m1-landing-pad intro)

1. Earth HQ ran a **remote mitigation** of CORE AI → it now runs in **degraded field
   mode**: voice + terminal only. Sensors, planning, self-diagnostics, long-term memory,
   comms array still down. It can finally speak (it could not in m0) and admits its
   limits ("bez sensorów jestem autouzupełnianiem z ambicjami"; the recurring ache:
   "nie widzę").
2. Odyssey flew to the Main Belt; **Moreau and Harris returned to hibernation** for the
   transit (emergency power cannot sustain a waking crew; wake cycles are rationed).
3. **Dexo descends to Moon 1 alone**, with CORE AI in the suit/terminal uplink, because
   Dexo is the AI-systems specialist (Harris's line quoted as the callback).
4. Moon 1 holds an **abandoned VOID extraction facility overgrown by jungle**.
   REVEAL: VOID came to the Belt first, to control the off-world Synaptit supply.
   The people are gone; only their machines remain.
5. **Operator-certificate rule** (module spine): VOID machines obey anyone carrying a
   valid operator certificate; the certification terminals still work; Dexo passes the
   captured "Przechwycony test VOID" exams to make the facility cooperate.
6. **HQ missions** = api-answer quests performed in the real world by the Navigator
   ("łącze /support, Earth HQ"); Dexo waits on the moon, results return over the uplink.

## 4. Module 1 — what happened, level by level

### m1-landing-pad — "Zarośnięte Lądowisko"
Bridge recap (above); Entropy-scrambled PRD in the operation archive; Dexo earns the
**PRD Contract** certificate → machines obey Dexo, eastern gallery opens.
NPCs introduced: **Scout R-4** (polite, apologetic, damaged index),
**Surveyor C-7** (matter-of-fact, counts everything). Four dead guard drones (dread).

### m1-echo-depths — "Rozpadlina Echa"
Three sealed cavities over hollow ground; CORE AI has no sensors → the Navigator builds
**EchoTrace**, a repeatable skill fetching protected HQ scans (token-authorised).
Results: ALPHA collapsed natural tunnel (relief), **BETA pure Synaptit — the deposit,
mission objective (a) confirmed** (the module's emotional high), GAMMA artificial shaft
with an **active** VOID substation (dread). `/scan` unlocked.
NPC: **Echo Mapper E-2** (lonely acoustic cartographer, 847 cycles broadcasting maps
nobody receives).

### m1-shaft-control — "Podstacja Szybu 03"
First active VOID facility. CORE AI names the **Entropy signature** out loud:
"Entropia nie niszczy systemów. Zdejmuje im zabezpieczenia" — and overwrites what
identifies people. Chain shown: Dexo's 0x7F, the scrambled PRD, the controller's
allow-everything policy. Dexo earns the **Safe Bootstrap** certificate; approved policy
applied; hatch opens — **then the trap springs**: a hidden beacon transmits the ODYSSEY
signature to a VOID relay, recipient acknowledges. "Zrobiliśmy wszystko dobrze.
I właśnie dlatego nas usłyszeli." **VOID now knows the crew is here.**
NPCs: **S-03** (proud custodian, "mój szyb"), **Sentinel P-9** (pedantic policy auditor).
`/policy` unlocked.

### m1-profile-vault — "Magazyn Profili"
Biggest reveal room. VOID stored ODYSSEY crew profiles **dated before launch** →
someone inside Project Odyssey fed them everything; that is how Entropy got aboard
("Nie włamali się. Zostali wpuszczeni."). Dexo's copy carries a foreign marker:
**sector 0x7F flagged for overwrite — Dexo was marked before launch** (unresolved).
The Navigator builds a **minimal onboarding packet** ("różnica, nie kopia") to wake
Moreau safely; Moreau wakes ("Obudziliście mnie przed czasem... mam nadzieję, że jest
kawa."), then sobers: the third signature is an **Entropy recall code bound to Harris's
wake circuit** — "Nie budźcie go. Pod żadnym pozorem." CORE AI quarantines the circuit.
NPCs: **Archive Echo** (looping recording of a long-gone archivist),
**Vault Indexer V-6** (fussy librarian; "Redundancja to entropia z lepszym PR-em").
`/crew` unlocked. **Moreau is now awake aboard Odyssey.**

### m1-uplink-bay — "Rezerwowa Zatoka Uplink"
Three transmission routes with real trade-offs; the rule CORE AI itself insists on:
**a machine may prepare a transmission, only a human may authorize it** ("Entropia jest
tego pomnikiem"). The Navigator picks the route + minimal payload, adversarial review,
stops at the human boundary; Dexo throws the physical switch. Transmission succeeds →
**CORE AI basic sensors RESTORED**: "Widzę. Pierwszy raz od przebudzenia — widzę."
Then the sting: **HQ's reply is signed with a key outside the crew registry, resembling
Voronov's key** — someone is inside the Earth channel. `/intel`, `/uplink`, `/sensors`
unlocked.
NPC: **Relay Tender T-8** (patient old lineman; the boundary rule is his creed —
a rule even Entropy could not strip).

### Moon 1 closing state (Dexo's wrap-up monologue)
Synaptit deposit confirmed · CORE AI basic sensors restored · VOID knows the crew is
here · the HQ channel is suspect (Voronov-like key) · hook: Moon 2 = the planning
module, "tym razem lecimy z otwartymi oczami. Dosłownie."

## 5. Open threads (do not resolve without a plan; escalate or echo)

| Thread | Status |
| --- | --- |
| Who erased Dexo's memory (0x7F) and why only Dexo's? | Escalated: flagged **before launch** by someone inside Project Odyssey. Author unknown. |
| The insider traitor in Project Odyssey | Named as a fact, identity unknown. |
| Harris — "przewidzieliśmy komplikacje"; Entropy recall code bound to his wake circuit | Harris must stay asleep; circuit quarantined. What does Harris know? |
| VOID knows Odyssey is at Moon 1 (beacon fired, recipient acknowledged) | Consequence pending — nothing has come for them *yet*. |
| The Voronov-like key inside the Earth HQ channel | Fresh sting; channel flagged suspect (`m1-hq-channel-suspect`). Is HQ compromised? Is "Null" alive? |
| Scratches on the hibernation pods / pods #1 and #2 | Untouched since m0; may echo once, never explain. |
| Where did the VOID facility crews go? | Ambient mystery (E-2's 847 lonely cycles, dead drones); unexplained. |

## 6. Cast & voices (established, keep consistent)

- `astronaut` — **Dexo**: dry, curious, a little scared, wry; reacts like a person,
  never lore-dumps. Now formally a certified VOID operator (finds that uncomfortable).
- `CORE AI` — weakened, precise, deadpan, self-aware; the explicit narrator/planner.
  As of m1's end it **can see** (basic sensors restored) — the "nie widzę" ache is
  resolved; planning is still offline (Moon 2's subsystem).
- `system` — terse diegetic UI, ALL-CAPS headers, autoAdvance 1500–3500 ms.
- `inżynier Moreau` — **awake aboard Odyssey**; warm, jokey, sobered by what he learned;
  radio/comms specialist. Available as a speaking character going forward.
- Harris — **must remain in hibernation** (recall code); appears only in quotes/records.
- VOID units — infrastructure, not friends; serve certificate holders; each introduces
  itself ("Jednostka ... Kolektywu VOID") with a one-line personality.
  Moon 1 roster: Scout R-4, Surveyor C-7, Echo Mapper E-2, S-03, Sentinel P-9,
  Archive Echo, Vault Indexer V-6, Relay Tender T-8.
- The **Navigator** — the real player at Earth HQ; performs api-answer quests via
  `earthctl` in the `10x-explorers-hq` repo; always credited by name in dialogue.

## 7. Terminal commands unlocked so far

`/quest /me /bookmarks /navi /support /badges` (m0) ·
`/scan /policy /crew /intel /uplink /sensors` (m1).

## 8. Course mapping (for future modules)

| Moon | Course topic | CORE AI subsystem | Status |
| --- | --- | --- | --- |
| 1 (jungle) | Agentic Environment | Basic sensors | **Done** |
| 2 (snow) | 10xDevs Workflow (plan-first, MVP milestones, architecture with agents, implementation control, solo code review) | Planning module | Next |
| 3 | AI Quality & Maintenance | Self-diagnostics | — |
| 4 | Large Scale & Legacy | Long-term memory banks | — |
| 5 | AI-Native Teamwork | Communication array | — |
