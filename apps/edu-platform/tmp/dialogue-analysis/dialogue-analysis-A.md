# Space Explorers — Dialogue Style, Tone & Writing Recipe (Modules m0 & m1)

A reproducible specification of the voice, tone, and prose style of the m0 (Awakening / ship) and m1 (Moon 1) dialogues — everything a writer needs to produce indistinguishable new material.

---

## 1. Speakers & voice

Observed roster and EXACT string labels used:

| Speaker string | Role | Mode(s) | Voice |
|---|---|---|---|
| `system` | Diegetic UI / narration / status readouts | `system`, `cinematic` | Terminal-flavored, clipped, ALL-CAPS headers |
| `astronaut` | The player character ("Dexo") | `monologue`, `dialogue`, `cinematic` | Introspective, wry, detective-minded |
| `CORE AI` | Ship AI | `dialogue`, `cinematic` | Formal, precise, self-referential about its own damage/blindness |
| `inżynier Moreau` / `Moreau` | Engineer NPC | `dialogue`, `cinematic` | Warm, sardonic, coffee-obsessed, deflecting |
| `oficer Harris` | Training officer NPC | `dialogue` | Reassuring, cryptic, authoritative |
| `dr Kern` | Geologist NPC | `dialogue` | Excitable, uncannily certain, emotionally invested in rock |
| `Floobert` | Comic alien | `dialogue` | Pure nonsense syllables + emoji |
| `Świerszcz` | Drone ("cricket") | `dialogue` | Onomatopoeic chirps + parenthetical stage directions |

Note: the SAME character can appear under two label strings across contexts — `inżynier Moreau` (m0 crew room, first meeting) vs bare `Moreau` (m1, once established). Full-title on introduction, short form thereafter.

### 1.1 `system` voice
- ALL-CAPS section headers and labels: `TABLICA INFORMACYJNA`, `WERYFIKACJA PAMIĘCI: ZALICZONA`, `DOKOWANIE ZAKOŃCZONE — ODYSSEY, POKŁAD GŁÓWNY`, `SENSORS: ONLINE`.
- Colon-delimited key/value status: `Status rdzenia: ████ KRYTYCZNY ████`, `Ładownia: Synaptit, 14 kg`, `Power 100%`.
- Uses box-drawing/typographic glyphs as ornament: `═════════════════════════════` (separators), `▓▓▓▓▓▓▓▓▓▓ 100%`, `████` (redaction/critical blocks), `▸` (bullet/prompt), `◆` (new-mission marker).
- New-mission lines are stereotyped: `◆ NOWA MISJA: <name> — <one-line objective>.` / `◆ NEW MISSION: …`.
- Terminal command references inline: `/me`, `/quest`, `/navi`, `/support`, `/badges`, `/bookmarks`, `/solve`, `earthctl`. Slash-prefixed, monospace-implied, never translated.

### 1.2 `astronaut` (Dexo) voice
- First-person present tense. Two registers: `monologue` (private thought, no listener) vs `dialogue` (spoken aloud to an NPC/AI).
- Detective instinct: reframes clues, distrusts easy answers. `„Nadpisany"... Nie uszkodzony. Nadpisany. Ktoś to zrobił celowo.` / `"Overwritten"... Not damaged. Overwritten. Someone did this deliberately.`
- Dry, self-deprecating humor: `Tak, tak, "gleebok". Świetnie. Idę dalej.` / `Yes, yes, "gleebok". Great. Moving on.`
- Frequent rhetorical questions to himself: `Ale dlaczego akurat moje dane są uszkodzone? Tylko moje?`
- Sensory, tactile description when surveying: `Ciężka jak obietnica.` / `Heavy as a promise.`; `Kadłub jakiejś maszyny, wrośnięty w poszycie.`

### 1.3 `CORE AI` voice
- Formal, complete sentences; first-person, refers to itself as blind/damaged and to its "cores", "sectors", "memory": `Jestem w łączu twojego skafandra, ale sensory wciąż mam martwe.`
- Recurring self-identification as machine that must be described-to: `Jesteś moim jedynym czujnikiem.` / `You are my only sensor.`
- Verbs of recording: `Zapisane.` / `Recorded.`; `Zapisuję jako anomalię.` / `Logging it as an anomaly.`; `Zapisuję i zostawiam otwarte.` / `I log it and leave it open.` — a signature tic (the "log it and leave it open/unexplained" formula recurs).
- Grammatical gender note (PL): CORE AI refers to itself in NEUTER (`jestem ślepe`, not `ślepy`), marking it as non-human. This is deliberate and consistent.
- Delivers objectives in a "simple to say, hard to do" cadence: `Cel Księżyca 1 jest prosty do wypowiedzenia i trudny do wykonania: …`.
- The climactic minimalism: two-line reveal `Widzę.` / `I see.` then `…i widzę, jak wiele mi umykało.` / `…and I see how much was slipping past me.`

### 1.4 Moreau voice
- Comic leitmotif: **coffee** (`Kawy dalej nie ma — nie pytaj.`; pays off in `Kawa. Prawdziwa. Zaparzyłam ją…`).
- Deflecting/nervous tells rendered as self-interrupting speech with em-dash: `Stara skała. Na pewno. — Mówię to trochę za szybko, sama słyszę.`
- Grammatical gender: Moreau speaks in FEMININE PL forms (`Zaparzyłam`, `Widziałam`, `sama słyszę`) — Moreau is a woman.
- Blunt affection: `Nie wiem, czy jestem dumna, czy przerażona.`

### 1.5 Harris voice
- Authoritative but withholding; speaks in short imperative pairs: `Najpierw egzaminy. Potem odpowiedzi. Obiecuję.`
- Plants mystery: `powiedzmy, że przewidzieliśmy pewne komplikacje. Nie wszystkie.`
- Addresses player by codename `Dexo`.

### 1.6 Kern voice
- Emotional over geology, voice literally breaking: `To on. To Synaptit! — Przepraszam, głos mi się łamie.`
- Uncanny foreknowledge (a plot thread): `Czysta żyła jest w prawej górnej komorze, przy ścianie. Wiem to.` immediately flagged by Moreau's suspicion `...Skąd ona to wiedziała?` — the writing deliberately seeds this.
- Feminine PL forms (`Czekałam`).

### 1.7 Floobert voice
- 100% invented syllables, no semantic content, exclamatory, emoji-tailed: `Mrrpfff! Gleebok spznx!`, `Bzzzt! Floof floof! Mrrphh! ✨`, `Gleebok! Gleebok! 🐾`. Emoji used ONLY here and only for the alien (`✨ 🐾 ⭐ 💫`). CAPS for excitement (`BZZZT!`).

### 1.8 Świerszcz (drone) voice
- Onomatopoeia + parenthetical STAGE DIRECTION describing emotional/telemetric state: `cyk-cyk-cyk-cyk! (częstotliwość rośnie)` / `chirp-chirp-chirp-chirp! (frequency rising)`.
- Volume/agitation encoded in CAPS and repetition: calm `cyk… … cyk… (równy, spokojny rytm)`; alarmed `CYK-CYK-CYK-CYK-CYK! (ostro, nerwowo)`.
- CORE AI "translates" the drone in the following line — a fixed call-and-response pattern (drone chirps → CORE AI interprets).

---

## 2. Length & rhythm

- **Per-line length:** `system` lines are shortest (2–12 words; often a label). `monologue`/`dialogue` lines run longer. Typical spoken line ≈ 15–45 words. Longest single lines (CORE AI exposition, return-from-moon cinematics) reach ~60–70 words but are the exception and always load-bearing.
- **Sentence structure:** heavy use of SHORT fragment sentences, often verbless, especially in monologue and system text. Example fragment chains: `Ból głowy. Pulsujący, tępy.` / `Headache. Throbbing, dull.`; `Twardo, zimno... i te rysy na szkle.`
- **Rhythm device — triadic lists / rule-of-three** is pervasive: `Model, narzędzia, pętla działania.`; `Namiot, generator, stół.`; `najpierw badasz, potem budujesz; najpierw pytasz, potem działasz.`; `Trzy opisy, trzy krawędzie mapy.`; `Smooth, cold, without a single seam.`
- **Cadence:** a longer explanatory sentence is routinely followed by a short punch: `Da się to złożyć — jeśli będzie z czego dać mu prąd.` / clipped closer `Jeden gotowy.` / `Jeszcze nie.`
- **Pacing per node group:** a beat = usually 1–3 lines. Quest hubs run 3–4 lines (`system` setup → `CORE AI` instruction → `astronaut`/`system` acknowledgment → `◆ NEW MISSION` line). Cinematics run 3–7 lines, auto-timed: separator rules and terse status flash briefly, standard readouts hold a moment, weighty reveal lines hold longest. Character speech is never auto-timed — the player advances it.
- **The terse/verbose contract:** status / "already" / "revisit" / "inert" states stay to 1–2 short lines; only cinematic intros, reveals, and quest-completions earn length.

---

## 3. Tone & register

- **Overall:** noir mystery-thriller in a sci-fi shell, leavened with dry comedy (Moreau's coffee, Floobert). Constant undertone of dread ("sabotage", "someone did this deliberately", "someone had been watching us").
- **Formality gradient:** CORE AI (high/formal) > Harris (formal-cryptic) > Kern (formal but emotional) > astronaut (mid, wry) > Moreau (colloquial) > Floobert (nonsense).
- **Humor is dry and situational**, never slapstick except Floobert. Delivered via understatement (`Nie wiem, czy jestem dumna, czy przerażona.`) and self-aware asides.
- **Tension escalation** is structural: m0 seeds "corrupted logs / scratches from inside / unauthorized modification"; m1 escalates to named antagonists ENTROPY / VOID and the closing gut-punch. The prose stays restrained even at climax — the biggest reveal is the two-word `Widzę. / I see.`
- **Educational payload is dressed, never bare.** The course concepts (agentic systems, EPIC/plan-first workflow, context engineering, tool use, safe operations, external memory/journaling, verification chains) are always in-fiction:
  - Exam completions are framed as "MEMORY VERIFICATION: PASSED" and recalled as the astronaut's forgotten profession.
  - m1's five "Expedition Protocols" ARE the pedagogy: `„NAJPIERW PYTANIA”` (questions first), `„NARZĘDZIA”` (tools), `„BEZPIECZNE OPERACJE”` (safe operations / least privilege / sandbox), `„DZIENNIK ZEWNĘTRZNY”` (external journal / memory), `„ŁAŃCUCH”` (verification chain). Each is "recovered from CORE AI's damaged memory".
  - Gameplay mechanics map to concepts: "describe survey points" = observe-before-act; "isolate nodes, don't destroy" = least-privilege/sandbox; "reconstruct order via /solve" = tool procedure; "cross-verify calibration key with Earth" = verification loop.

---

## 4. Diction & vocabulary

- **Sci-fi hardware jargon (PL/EN):** `firmware`, `uplink`, `sensory` / `sensors`, `rdzeń` / `core`, `węzeł` / `node`, `sygnatura` / `signature`, `telemetria`, `pylon`, `tablica sensorów` / `sensor array`, `radiolatarnie` / `beacons`, `skafander`, `ładownia` / `cargo bay`, `pole komory` / `chamber field`.
- **Invented proper nouns (fixed spellings):**
  - `Synaptit` — the McGuffin mineral (glows blue; "enough for one chip").
  - `ENTROPY` and `VOID` — antagonist signatures, ALWAYS uppercase in EN and usually in PL system text.
  - `Odyssey` (the ship), `Odyssey-P` (probe series).
  - `CORE AI`, `SmartTerminal`, `earthctl`, `HQ`.
  - Character names: `Dexo`, `Moreau`, `Harris`, `Kern`, `Floobert`, `Świerszcz`.
- **Metaphor register — organic/architectural for alien tech, mechanical for the mundane:**
  - Jungle: `dach bioluminescencyjnej dżungli` / `bioluminescent jungle canopy`; `Pnącza grube jak liny cumownicze` / `Vines thick as mooring lines`; `Dżungla przerobiła go na doniczkę` / `the jungle turned it into a planter`.
  - Ravine as sacred space: `Wchodzę w wąwóz jak do katedry` / `into the ravine as if into a cathedral`; `mineralna krypta` / `mineral crypt`.
  - Memory as broken object: `Wspomnienia wracają... fragmentami, jak potłuczone lustro.` / `like a shattered mirror`.
  - Weight/value: `Ciężka jak obietnica.` / `Heavy as a promise.`; ore is `zaledwie błąd zaokrąglenia` / `barely a rounding error`.
- **Recurring motif words:** "eyes / sight / blind / sensor" (CORE AI's blindness is the m1 spine: `ślepe`, `oczami`, `czujnik`, `widzę`); "log / record / anomaly"; "coffee"; "chirp/cricket"; "someone did this / deliberately / on purpose".
- **Concept-in-fiction dressing:** technical ideas surface as recovered memory or crew doctrine, e.g. `To nie były tylko prompty. To była cała procedura działania.` / `These were not just prompts. This was an entire operating procedure.`

---

## 5. Punctuation & typography

- **Ellipsis `...`** — the single most characteristic mark. Used for: hesitation (`Gdzie ja... jestem?`), trailing thought, signal dropout (`...//szum//... ...na...igator...`), and dramatic pause before a reveal (`KALIBRACJA UPLINKU... ZAKOŃCZONA.`). Both `...` (three dots) and the ellipsis char `…` appear; `…` is favored in later/m1 stage directions and lead-in reveals (`…i widzę, jak wiele mi umykało.`). Extremely high frequency.
- **Em-dash `—`** — second signature mark. Uses:
  1. Appositive/interruption inside a spoken line: `Stara skała. Na pewno. — Mówię to trochę za szybko…`.
  2. Self-correction mid-thought: `Nie było jej tu wcześniej — a raczej: była…`.
  3. In `system` headers as a separator: `DOKOWANIE ZAKOŃCZONE — ŁADOWNIA: SZTABY SYNAPTITU, 212 KG`.
  Note: real em-dash `—` (not hyphen).
- **Polish quotation marks:** in-fiction quoted terms use the low-high Polish quotes `„ … "`: `„Komora #3"`, `„GitHub"`, `„Dexo"`, `„SYNCHRONIZACJA NEURONALNA — PRZERWANA"`. EN counterparts use straight `"…"`. This PL `„"` vs EN `"` convention is consistent.
- **CAPS:** reserved for (a) `system` headers/labels/status, (b) proper-noun signatures ENTROPY/VOID, (c) shouted emphasis in speech (`CO TO JEST?!`, and the `CYK-CYK` alarm chirps). Not used for ordinary emphasis in prose.
- **Glyph ornaments (system only):** `═` separators, `▓`/`█` progress & redaction blocks, `▸` prompt bullet, `◆` mission marker, `#` for pod numbers, hex like `0x7F`.
- **Numbers/units:** spelled inline with units, PL decimal comma vs EN period: `CZYSTOŚĆ 99,4%` / `PURITY 99.4%`; thousands `4 748` (PL space) / `4,748` (EN comma). Cargo masses `14 kg`, `212 KG`, `480 KG`.
- **Emoji:** ONLY Floobert (`✨ 🐾 ⭐ 💫`). Never anywhere else.
- **No markdown, no bold/italic markup** inside text strings — emphasis is lexical/structural, not typographic.

---

## 6. Bilingual conventions (pl ↔ en)

- **Every line exists in both Polish and English.** Never one-only.
- Relationship is **faithful adaptation, not word-for-word**: meaning, tone, register, and sentence count are preserved; idiom is localized.
  - Idiom localized: PL `nie rób z polany kryminału` → EN `don't turn the clearing into a murder mystery`.
  - EN contractions used naturally (`I'm`, `don't`, `won't`, `you're`); PL stays grammatical without slang inflation.
  - Fragment structure is mirrored across languages (`Ból głowy. Pulsujący, tępy.` ↔ `Headache. Throbbing, dull.`).
- **Proper nouns are NOT translated:** `Synaptit`, `ENTROPY`, `VOID`, `Odyssey`, `CORE AI`, `Świerszcz` (kept Polish even in EN — the cricket's name stays `Świerszcz` in English lines), command names (`/support`, `earthctl`).
- **Register parity:** if PL is formal/neuter (CORE AI) the EN is correspondingly formal; if PL is colloquial (Moreau) EN is colloquial. Gender that PL grammar encodes (Moreau/Kern feminine) is simply unmarked in EN.
- **Typographic locale swap:** PL `„ "` quotes + comma decimals + space thousands; EN straight quotes + period decimals + comma thousands (see §5).
- **Length parity:** PL and EN are close in length; neither pads nor abridges relative to the other.

---

## 7. Choices / interactivity patterns

- **There are NO in-dialogue choices.** No branching trees, no player-selected replies, no conditional lines inside a sequence. Every sequence plays start-to-finish, linearly.
- **Interactivity lives OUTSIDE the dialogue text**, expressed two ways:
  1. **Sequence selection by game state** — the writing provides many small sibling sequences for the same object keyed on progress. The suffix vocabulary is systematic and predictable: `-intro` (cinematic first entry), `-start` (quest hub activation), `-waiting` (quest incomplete reminder), `-post` / `-complete` / `-done` (resolution), `-already` (repeat, terse), `-revisit` (return visit), `-locked` (barrier/door), `-inert` / `-sealed` (not-yet-actionable object), `-isolate` / `-extract` / `-set` (action beats). The engine picks which sequence to play; each sequence is itself linear. So "branching" is authored as SEPARATE named sequences, not as choices within one.
  2. **Terminal commands** — the player acts by typing `/me`, `/quest`, `/support`, `/solve`, etc. Dialogue TELLS the player which command to use (`Wpisz /quest, aby sprawdzić postęp misji.`) but does not present it as a menu.
- **Convergence:** all state-variant sequences converge narratively — e.g. wrong-order node attempts (`-warning`) are explicitly "recoverable, only costs time", never a dead end or failure branch.
- **Objective delivery pattern (fixed 3–4 line template):** `system` header (station online) → `CORE AI` explains the why + constraint → optional `astronaut`/NPC reaction → `◆ NOWA MISJA: <name> — <objective>.` closing `system` line.

---

## 8. Concrete quotable exemplars

- **Cold-open fragment style** — `m0-awakening` / `system`: `Ból głowy. Pulsujący, tępy. Jakby ktoś wyrył coś w czaszce od środka.` / `Headache. Throbbing, dull. Like something carved into the skull from inside.`
- **Astronaut detective register** — `m0-crew-room` / `astronaut`: `„Nadpisany"... Nie uszkodzony. Nadpisany. Ktoś to zrobił celowo.` / `"Overwritten"... Not damaged. Overwritten. Someone did this deliberately.`
- **CORE AI blindness spine** — `m1-landing-pad` / `CORE AI`: `Nie widzę tego księżyca — widzisz go ty. Opisz mi ten świat, cierpliwie, jak dziecku bez oczu. Jesteś moim jedynym czujnikiem.` / `…Describe this world to me, patiently, like to a child with no eyes. You are my only sensor.`
- **CORE AI "log and leave open" tic** — `m1-profile-vault` / `CORE AI`: `Zapisuję jako anomalię. Nie mam kim ani czym tego wyjaśnić. Jeszcze nie.` / `I log it as an anomaly. I have no one and nothing to explain it with. Not yet.`
- **Moreau comic warmth + deflection** — `m1-landing-pad`: `A ja jestem twoim jedynym namiotem, zdrowym rozsądkiem i — niestety — brakiem kawy…`; and `Stara skała. Na pewno. — Mówię to trochę za szybko, sama słyszę.`
- **Kern uncanny certainty (seeded suspicion)** — `m1-profile-vault`: Kern `Czysta żyła jest w prawej górnej komorze, przy ścianie. Wiem to.` → Moreau `...Skąd ona to wiedziała? Skan jeszcze nawet nie ruszył.` → CORE AI `(nikt nie odpowiada)`.
- **The two-line climax** — `m1-uplink-bay` / `CORE AI` (cinematic): `Widzę.` / `I see.` then `…i widzę, jak wiele mi umykało.` / `…and I see how much was slipping past me.`
- **Educational concept in fiction** — `m0-exam-room`: `To nie były tylko prompty. To była cała procedura działania.` / `These were not just prompts. This was an entire operating procedure.`
- **Rule-of-three closer** — `m1-echo-depths` / `astronaut`: `Entropia. Więc „sabotaż" to za wąskie słowo. Ma imię — a na obudowach węzłów wytłoczono drugie: VOID.`
- **Alien nonsense + emoji** — `m0-crew-room` / `Floobert`: `Bzzzt! Floof floof! Mrrphh! ✨`.
- **Drone onomatopoeia + stage direction** — `m1-echo-depths` / `Świerszcz`: `CYK-CYK-CYK-CYK-CYK! (ostro, nerwowo)` / `CHIRP-CHIRP-CHIRP-CHIRP-CHIRP! (sharp, agitated)`.
- **System status readout aesthetic** — `m0-core-ai`: `Status rdzenia: ████ KRYTYCZNY ████`, `Pamięć długoterminowa:  USZKODZONA`, framed by `═════════════════════════════`.

---

## 9. Anti-patterns (what these dialogues NEVER do)

1. **Never present player choices / branching inside a sequence.** No option menus, no "if the player chose X". Variation is authored as separate state-gated sequences.
2. **Never dump raw pedagogy.** No lecture voice, no "In this lesson you will learn…". Concepts arrive only as recovered memory, crew doctrine ("Expedition Protocols"), or mechanic framing.
3. **Never break character register.** CORE AI never gets slangy; Moreau never gets clinical; Floobert never says a real word; the drone never speaks language (only chirps + stage directions).
4. **Never use emoji outside Floobert.** No decorative emoji in system/CORE AI/astronaut text.
5. **Never resolve the core mysteries prematurely.** Anomalies (old burn line, fresh sample marks, the ancient portal, the double-ACK echo, Kern's foreknowledge, the light orb) are logged and "left open / for another time" — deliberately NOT explained within the beat.
6. **Never make wrong player actions fatal or shaming.** Out-of-order / early attempts get a gentle `-warning` sequence framed as "recoverable, only costs time".
7. **Never overwrite the terse/verbose contract:** status/"already"/"revisit"/"inert" states stay to 1–2 short lines; only intros, reveals, and quest-completions earn length.
8. **Never use markdown emphasis (`**`, `_`, backticks) inside text.** Emphasis is lexical, CAPS (system), or punctuation (— / …).
9. **Never translate proper nouns or command names** across pl/en (`Synaptit`, `Świerszcz`, `VOID`, `/support` stay identical).
10. **Never write flat, symmetrical prose.** Sentences are deliberately uneven — a long observational clause is almost always chased by a short fragment.

---

### Quick "fingerprint" checklist for producing an indistinguishable new dialogue
- [ ] Linear sequences; no choices — variation via separate state-keyed sibling sequences.
- [ ] System/cinematic lines auto-timed (brief for status, longer for reveals); character lines player-advanced.
- [ ] Correct per-character voice, register, and PL grammatical gender (CORE AI neuter; Moreau/Kern feminine).
- [ ] Fragments + rule-of-three + long-then-short cadence.
- [ ] `…`/`...` and `—` heavily; PL `„ "` quotes; caps only for system/signatures/shouts.
- [ ] Concept dressed as memory/doctrine/mechanic, never lectured.
- [ ] Anomalies logged and left open. Proper nouns untranslated. Emoji only for Floobert.
- [ ] Every line in both pl and en, faithful-but-idiomatic, equal length and register.
