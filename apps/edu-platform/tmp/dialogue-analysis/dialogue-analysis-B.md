# Space Explorers — Dialogue Style, Tone & Writing Recipe (Modules m0 & m1)

A reproducible specification of the voice, tone, and prose style of the m0/m1 dialogues — everything a writer needs to produce indistinguishable new material. Quotes are cited by sequence + speaker.

---

## 1. Speakers & voice

`speaker` is a display string. The recurring cast, with exact string tokens observed:

### `system` (ubiquitous)
The ship/console/HUD voice. Two sub-registers:
1. **Machine printout** — ALL-CAPS labels, colon-aligned status tables, box-drawing dividers. E.g. `'CORE AI — SYSTEM DIAGNOSTICS'`, `'Moduły sensoryczne:    OFFLINE'`, `'═════════════════════════════'`, `'▓▓▓▓▓▓▓▓▓▓ 100% — AKTUALIZACJA ZAKOŃCZONA'`.
2. **Terse scene-setting** — sentence fragments for ambient narration in cinematics: `'Cisza.'` / `'Silence.'`, `'Bright light cuts through my eyelids. Too bright. Unnatural.'`
- New mission announcements use a fixed template: `'◆ NOWA MISJA: <name> — <one-line objective>.'` / `'◆ NEW MISSION: …'`.
- Terminal hints use `'▸ '` prefix: `'▸ Naciśnij Ctrl+\` , aby otworzyć SmartTerminal.'`, `'▸ Nowy moduł terminala: /bookmarks'`.

### `astronaut` (the protagonist "Dexo")
The player character. Speaks in `monologue` (private interior thought) or `dialogue` (aloud, to an NPC). Voice:
- **Interior detective.** Constantly interrogating anomalies, re-reading words: `'„Nadpisany"... Nie uszkodzony. Nadpisany. Ktoś to zrobił celowo.'` (m0-board-nav-revisit). Amnesiac reconstructing identity: `'Nie pamiętam... nic. Nawet jak się nazywam.'`
- **Dry, wry, self-aware.** `'Oczywiście. Obce istoty wiedzą wszystko. Czemu miałoby być inaczej.'` (npc-floobert-keycode-found); `'Tak, tak, "gleebok". Świetnie. Idę dalej.'`
- **Grounded resolve at beat-ends.** Often closes a sequence with a short declarative next-step: `'Muszę się rozejrzeć.'`, `'Teraz na grań.'`, `'Da się zapamiętać.'`
- Grows across m1 from passive observer to someone who asserts agency: `'Nie. Przygotuj wszystko. Ostatni krok robię ja. Zatwierdzam ja.'` (q-m1-cricket-complete).

### `CORE AI` (the ship's AI; string is exactly `'CORE AI'`)
The deuteragonist of m1. Voice:
- **Calm, precise, first-person, self-diagnosing.** Uses the grammatically neuter self in Polish ("jestem ślepe", "dopóki jestem ślepe") — it refers to itself as a machine, neuter gender. This is a deliberate, consistent tic: `'Dopóki jestem ślepe, jego uszy są naszym sonarem.'`
- **The "blind AI" conceit drives its diction:** *widzieć / ślepy / oczy / sensor / opisz mi* (see / blind / eyes / sensor / describe to me). `'Nie widzę tego księżyca — widzisz go ty. Opisz mi ten świat, cierpliwie, jak dziecku bez oczu.'` (m1-landing-intro).
- **Logs everything as evidence:** repeated verbs *Zapisane / Zapisuję / Logging / Zapisuję jako anomalię / Zapisuję i zostawiam otwarte* ("Recorded / I log it as an anomaly / I log it and leave it open"). This is a signature CORE AI cadence recurring across m1.
- **Restrained wonder.** Its emotional peaks are minimalist: `'Widzę.'` / `'I see.'` then `'…i widzę, jak wiele mi umykało.'` (q-m1-calibration-complete). And `'Nie wiem, jak to nazwać. Może przyjaźnią.'`
- Occasionally wry in the same deadpan key as the astronaut: `'Żywy księżyc rzadko bywa pułapką. Zapamiętaj to zdanie, może się jeszcze zemści.'` (m1-survey-wall) — later literally paid off in m1-silence-intro: `'Pamiętasz, co mówiłem o żywym ekosystemie? Cofam to.'`

### Named human NPCs (`speaker` is the display name)
- **`inżynier Moreau`** (m0) / **`Moreau`** (m1) — note the string changes between modules: formal title in m0 first meeting, bare surname once familiar in m1. Voice: brusque, deflecting, comic through exhaustion and a running **coffee gag** (`'Ja potrzebuję kawy.'` → in m1 the coffee arc resolves: `'Kawa. Prawdziwa. Zaparzyłam ją, kiedy maszyna wreszcie przejrzała na oczy. Zasłużyłeś.'`). In m1 Moreau is written **female** in Polish (past-tense verb gender: "Zaparzyłam", "Widziałam", "bałam się") — a fixed grammatical fact of the character. Emotional undertone of guilt/fear beneath the banter re: the burn marks.
- **`oficer Harris`** (m0) / **`Officer Harris`** — the deferring mentor. Speaks in clipped promises: `'Krok po kroku, Dexo. Najpierw egzaminy. Potem odpowiedzi. Obiecuję.'` Foreshadows conspiracy: `'…zrozumiesz, dlaczego cię wybrali. I dlaczego to musi być właśnie ty.'` Withholds ("Not all of them.").
- **`dr Kern`** (m1) — geologist, guiding by voice from orbit. Voice: **rapturous specialist**, emotionally invested in minerals, unnervingly certain (a plot seed): `'To on. To Synaptit! — Przepraszam, głos mi się łamie. Czekałam na ten obraz pół kariery.'` Her over-certainty is deliberately flagged by others: `'...Skąd ona to wiedziała? Skan jeszcze nawet nie ruszył.'` (Moreau).

### Non-human "speakers" (voice = untranslatable sound)
- **`Floobert`** — comic alien; speaks pure nonsense syllables + emoji: `'Mrrpfff! Gleebok spznx!'`, `'Bzzzt! Floof floof! Mrrphh! ✨'`, `'Gleebok! Fnk fnk fnk! ⭐'`. Emoji (✨ 🐾 💫 ⭐) appear ONLY in Floobert's lines and nowhere else in the corpus.
- **`Świerszcz`** (the cricket-drone; string exactly `'Świerszcz'` in both pl and en display) — speaks in onomatopoeia with a **stage-direction parenthetical** describing the sound state: `'cyk-cyk-cyk-cyk! (częstotliwość rośnie)'` / `'chirp-chirp-chirp-chirp! (frequency rising)'`. Volume encodes meaning: lowercase `cyk` = calm, ALL-CAPS `CYK-CYK-CYK!` = alarm/wrong-order warning. Silence is itself a "line": `'(...cisza. Trzy pełne sekundy. Żadnego ćwierku.)'`.

**Speaker-string discipline:** the exact casing/wording of a speaker is a stable identifier (`'CORE AI'`, `'dr Kern'`, `'oficer Harris'`, `'inżynier Moreau'`, `'Świerszcz'`, `'Floobert'`, `'Moreau'`, `'astronaut'`, `'system'`). Match existing strings exactly; do not invent variants.

---

## 2. Length & rhythm

- **Line length:** most lines are **1–3 sentences**. System status lines are often a single fragment. Character/monologue lines run longer; the longest, most "literary" lines are intro cinematics and CORE AI's set-piece speeches (m1-landing-intro, m1-vein-intro) — rare and always load-bearing.
- **Sequence length:** one-line sequences are the norm for terse "already done / revisit / inert" states; 2–4 lines is the default for interactions, survey beats, NPC exchanges and quest hubs; 7–9 lines for NPC back-and-forth conversations; the longest sequences are reserved for cinematic set-pieces and diagnostic "printouts".
- **Sentence structure:** heavy use of **short, clipped declaratives and fragments**, frequently stacked: `'Ból głowy. Pulsujący, tępy.'`; `'Twardo, zimno... i te rysy na szkle.'`; `'Odcięty, nietknięty.'`. Fragments carry the noir/tension rhythm.
- **The rule of three** is pervasive as a rhythmic and structural device: three survey points, three nodes, three descriptors. Prose mirrors it: `'Trzy opisy, trzy krawędzie mapy.'`; `'Namiot, generator, stół.'`; `'Model, narzędzia, pętla działania.'`; `'Statek to pole minowe, kanał to cudze pióro, pościg jest podwójny.'`
- **Pacing within a sequence:** typical cadence is *system stamp → character reaction → (optional second reaction / partner line)*. Quest hubs follow *system(online) → CORE AI(objective) → astronaut(acknowledge) → system(◆ NEW MISSION)*. Reveal sequences build with a run of short auto-timed system lines, then break into 2–4 slower monologue lines. System/ambient text auto-advances (dividers flash briefly, weighty reveals hold longer); character speech waits for the player.
- **Beat-final "button" lines:** sequences very often end on a short, resonant closer — a resolved image or a hook: `'To nie awaria. To sabotaż.'`; `'Teraz na grań.'`; `'Ktoś to tu przyniósł.'`; `'…prawdziwa gra dopiero się zaczyna.'`

---

## 3. Tone & register

- **Baseline: taut sci-fi mystery** — amnesia, sabotage, an unseen antagonist (ENTROPY / VOID), sealed crew members. The mood is investigative and faintly ominous, punctuated by warmth (Moreau's coffee, Świerszcz's friendship) and comic relief (Floobert).
- **The educational layer is fully diegetic.** Real course concepts are never named as "lessons"; they surface as recovered memories, ship protocols, or operating procedures:
  - Agentic systems → `'Model, narzędzia, pętla działania.'` (m0-exam-agent-systems-done)
  - The EPIC/explore-plan-implement-verify workflow → `'Najpierw eksploracja, potem plan, implementacja i weryfikacja...'` (m0-exam-operational-procedures-done)
  - Context engineering → `'Właściwe informacje we właściwym momencie.'` (m0-exam-context-engineering-done)
  - m1's five "Expedition Protocols" each encode a real practice: I "Questions First" (investigate before building), II "Tools" (right tool + clear task + verify output), III "Safe Operations" (isolate/sandbox/least-access), IV "External Journal" (persist findings outside your head), V "The Chain" (reconcile + verify at every link).
- **Formality:** mid-register, contemporary, never archaic. Characters use contractions and colloquialisms in speech ("No dobrze", "Da się zapamiętać", "don't ask"), formal register only in `system` printouts.
- **Humor** is dry and situational, never zany except Floobert. It never undercuts a genuine emotional or plot beat — comic lines and dramatic lines are segregated by sequence.
- **Technical density** is moderate and always fictionalized: "firmware", "uplink calibration", "memory sectors", "sandbox", "least access" appear but dressed as ship operations, not tutorials.

---

## 4. Diction & vocabulary

Recurring lexical fields (each a deliberate motif):

- **Sight / blindness** (the m1 through-line): *widzieć, ślepy/ślepe, oczy, sensor, zmysł, opisz mi, patrzeć, po omacku, pingi.* Payoff line: `'Widzę.'`
- **Memory / erasure** (the m0 through-line): *pamięć, wspomnienia, nadpisany, uszkodzony, USZKODZONE, synchronizacja neuronalna, hibernacja, „zero".* Key distinction hammered: **nadpisany (overwritten) ≠ uszkodzony (damaged)** = intentionality = sabotage.
- **Logging / evidence:** *zapisuję, zapisane, log, anomalia, pewnik, zostawiam otwarte.*
- **Sabotage/antagonist proper nouns (ALL CAPS):** `ENTROPY`, `VOID`, `Odyssey`, `Synaptit`, `Odyssey-P`. Proper nouns for the mystery are consistently uppercase in system lines.
- **Coffee** (Moreau's leitmotif), **cricket/chirp** (Świerszcz), **the rule of three**.

**Metaphor style:** concrete, physical, often a single vivid simile per line, never purple:
- `'jak potłuczone lustro'` (memories returning like a shattered mirror)
- `'Wchodzę w wąwóz jak do katedry'` (into the ravine as into a cathedral)
- `'Ciężka jak obietnica.'` (heavy as a promise — the first ore)
- `'Dżungla przerobiła go na doniczkę.'` (the jungle turned it into a planter)
- `'jak dziecku bez oczu'` (describe it like to a child with no eyes)
- `'Powietrze pachnie jak coś, co żyje i nie pyta o pozwolenie.'`

Metaphors are drawn from the immediate physical scene (rock, jungle, wreckage, sound) — never abstract or ornamental. One striking simile per line is the ceiling; lines rarely stack two.

**How technical concepts get "dressed":** a real practice is renamed as a ship artifact and given a physical action. "Don't destroy the malware; sandbox it" becomes `'Odetnij im zasilanie i zostaw całe. Zbadamy je później…'` plus the Protocol III recap `'izoluj i zostaw całe; sięgaj po minimum dostępu; obcy materiał trzymaj w piaskownicy.'` The lesson is legible to a practitioner but never breaks fiction.

---

## 5. Punctuation & typography

- **Ellipsis `...`** is the single most characteristic mark. Uses: (a) amnesiac trailing-off / hesitation (`'Gdzie ja... jestem?'`, `'Nie pamiętam... nic.'`); (b) dramatic pause before a reveal (`'KALIBRACJA UPLINKU... ZAKOŃCZONA.'`); (c) mid-thought realization (`'Zaraz... miałem z nimi pracować.'`). Also used as a **leading** ellipsis for a beat that starts mid-thought or interrupts: `'...normalne.'`, `'...Skąd ona to wiedziała?'`, `'…i widzę, jak wiele mi umykało.'` Note both `...` (three dots) and the single-glyph `…` appear; `…` trends in the newer/weightier m1 lines.
- **Em-dash `—`** (spaced: ` — `) is heavily used for: appositive elaboration (`'liście świecą własnym, chłodnym światłem'`), a turn/self-correction (`'Stara skała. Na pewno. — Mówię to trochę za szybko'`), and dramatic dashes in system printouts (`'v2.1 → v3.0'` uses `→`; status uses `—`). The spaced em-dash is the workhorse connective for the "and here's the twist" clause.
- **Polish typographic quotes** for in-world text and quoted words: `„…"` (lower-opening, upper-closing). E.g. `'„Komora #3"'`, `'„Nadpisany"...'`, `'„GitHub"...?'`. English versions use straight `"…"`. This pl/en quote convention is consistent.
- **ALL-CAPS** for: system labels/headers, status values (`OFFLINE`, `KRYTYCZNY`, `USZKODZONA`), proper-noun antagonists (`ENTROPY`, `VOID`), and Świerszcz's alarm chirps. Never for ordinary emphasis in character speech.
- **Box-drawing & block glyphs** in system printouts: `═════════════════════════════` (divider), `▓▓▓▓▓▓▓▓▓▓` (progress bar), `████` (redaction/critical bars), `▸` (terminal-hint bullet), `◆` (new-mission bullet). These are fixed iconography — reuse the same glyphs for the same purposes.
- **Bracketed redaction** for corrupted/sealed data: `[DANE USZKODZONE — SEKTOR PAMIĘCI 0x7F NADPISANY]`, `[WPIS ZAPIECZĘTOWANY]`, `[ZAPIECZĘTOWANY]`. Hex addresses (`0x7F`) add machine texture.
- **Parentheticals** exclusively for non-verbal stage directions on sound "speakers": `'(częstotliwość rośnie)'`, `'(ostro, nerwowo)'`, `'(nikt nie odpowiada)'`. Never for character asides.
- **Emoji** only in Floobert lines.
- **Numbers:** in-world quantities use locale formatting in pl (`212 KG`, `99,4%`, `4 748` with space separator and comma decimal) vs en (`212 KG`, `99.4%`, `4,748`). Keep pl/en number formatting locale-correct.

---

## 6. Bilingual conventions (pl ↔ en)

- **Every line exists in both Polish and English.** Neither is ever omitted or left equal-by-accident.
- **Relationship: faithful but idiomatic, not word-for-word.** en re-renders the sense with native idiom rather than calquing Polish. Examples:
  - `'Da się zapamiętać.'` → `'I can remember that.'`
  - `'nie rób z polany kryminału'` → `'don't turn the clearing into a murder mystery'`
  - `'Kawy dalej nie ma — nie pytaj.'` → `'Still no coffee — don't ask.'`
  - `'Ciężka jak obietnica.'` → `'Heavy as a promise.'`
- **Tone parity is strict:** register, humor, fragment rhythm, and punctuation intent are preserved across languages. If pl clips into fragments, en clips too. If pl trails off with `...`, en trails off with `...`.
- **British-leaning en spelling** in system/technical text: `synchronisation`, `stabilised`, `Unauthorised`, `centre`, `analysing`. Keep en spelling British-consistent.
- **Proper nouns are invariant** across languages: `Synaptit`, `ENTROPY`, `VOID`, `Odyssey`, `Świerszcz` (the cricket's name keeps its Polish diacritics even in en text), `Dexo`, `CORE AI`. `Świerszcz` is NOT translated to "Cricket" in the en display name (though the common-noun simile is glossed: "chirps like a cricket").

---

## 7. Choices / interactivity patterns

**Critical structural fact: these dialogues contain NO in-dialogue branching or choice menus.** Every sequence is a linear playback. Player agency is expressed entirely through mechanisms *outside* the dialogue tree:

1. **Terminal commands referenced in prose.** The dialogue tells the player to act in the SmartTerminal: `'Wpisz /me, aby sprawdzić status astronauty.'`, `'Wpisz /quest…'`, `'…podaj ją przez /solve.'`, `'…prześle klucz kalibracji przez earthctl.'`, `'Użyj komendy /support…'`. Commands referenced: `/me`, `/quest`, `/navi`, `/support`, `/badges`, `/bookmarks`, `/solve`, `earthctl`. Newly unlocked commands are announced with a `▸` system line.
2. **Game state chooses WHICH sequence fires.** Branching is achieved by authoring **multiple sibling sequences** for one interactable and selecting among them by game state. The canonical pattern is a family of variants per object:
   - `-start` / `-waiting` / `-post` (quest hub: not-started / mid-quest / done)
   - `-inert` / `-warning` / `-isolate` / `-done` (a node before activation / wrong-order attempt / success / revisit)
   - `-early` vs `-read` vs `-revisit` (m0 support manual before/at/after the gating event)
   - `-done` vs `-already` (exam just-passed vs previously-passed)
   - `-locked` (door shown when a prerequisite is unmet)
   - `<npc>-default` and evolved states (`m1-moreau-default` → `-burns` → `-camp` → `-cricket` → `-ore` → `-sensors` → `-epilogue`, tracking mission progress)

So when authoring "interactivity", you do NOT write choice trees; you write **a set of short linear sequences keyed to states**, plus prose that points the player at a terminal command or a physical action.

---

## 8. Concrete quotable exemplars (the style in a bottle)

- **Amnesiac noir opener** — `m0-awakening-intro`, system: `'Ból głowy. Pulsujący, tępy. Jakby ktoś wyrył coś w czaszce od środka.'` / `'Headache. Throbbing, dull. Like something carved into the skull from inside.'`
- **The sabotage turn (re-reading a word)** — `m0-board-nav-revisit`, astronaut: `'„Nadpisany"... Nie uszkodzony. Nadpisany. Ktoś to zrobił celowo.'`
- **The one-line thesis** — `m0-core-ai-malfunction`, astronaut: `'„Nieautoryzowana modyfikacja"... To nie awaria. To sabotaż.'` / `'This is not a failure. This is sabotage.'`
- **CORE AI's core conceit** — `m1-landing-intro`: `'Nie widzę tego księżyca — widzisz go ty. Opisz mi ten świat, cierpliwie, jak dziecku bez oczu. Jesteś moim jedynym czujnikiem.'`
- **CORE AI logging + wry setup/payoff** — `m1-survey-wall`: `'Bioluminescencja oznacza żywy ekosystem — dobrze. Żywy księżyc rzadko bywa pułapką. Zapamiętaj to zdanie, może się jeszcze zemści.'`
- **The payoff, one moon later** — `m1-silence-intro`: `'Pamiętasz, co mówiłem o żywym ekosystemie? Cofam to.'`
- **Minimalist emotional peak** — `q-m1-calibration-complete`, CORE AI: `'Widzę.'` → `'…i widzę, jak wiele mi umykało.'`
- **Player asserting agency** — `q-m1-cricket-complete`, astronaut: `'Nie. Przygotuj wszystko. Ostatni krok robię ja. Zatwierdzam ja.'` CORE AI: `'Przyjęte. Przygotowane. Twój ruch.'`
- **Moreau banter + guilt** — `m1-moreau-sensors`: `'Zbyłam to, bo bałam się, że mam rację.'` / `'I brushed it off because I was afraid I was right.'`
- **Kern the rapturous specialist (plot seed)** — `m1-synaptit-outcrop`: `'To on. To Synaptit! — Przepraszam, głos mi się łamie. Czekałam na ten obraz pół kariery.'`
- **Comic register (Floobert)** — `npc-floobert`, astronaut: `'Nie rozumiem ani słowa. Ale chyba jest szczęśliwe? Jak... szczeniak. Kosmiczny szczeniak.'`
- **Sound-as-speaker with stage direction** — `m1-node-north-warning`, Świerszcz: `'CYK-CYK-CYK-CYK-CYK! (ostro, nerwowo)'`; and silence as a line — `q-m1-silence-complete`: `'(...cisza. Trzy pełne sekundy. Żadnego ćwierku.)'`
- **System printout aesthetic** — `m0-core-ai-malfunction`: `'Status rdzenia: ████ KRYTYCZNY ████'`, `'Pamięć długoterminowa:  USZKODZONA'`, framed by `═════════════════════════════`.
- **Diegetic lesson recap** — `m0-exam-operational-procedures-done`: `'Najpierw eksploracja, potem plan, implementacja i weryfikacja... właśnie tak miałem pracować z CORE AI.'` then `'To nie były tylko prompty. To była cała procedura działania.'`

---

## 9. Anti-patterns (what these dialogues NEVER do)

1. **No in-dialogue choice menus / branching.** Ever. State-based variants + terminal commands only.
2. **No fourth-wall breaks / no naming the course.** Never says "lesson", "module of the 10xDevs course", "quiz", "in real programming…". Concepts stay diegetic (memories, protocols, ship ops). The one meta-ish exception is deliberately in-world irony: `'Kosmos to jeden wielki terminal programistyczny...'`
3. **No lecturing / no bullet-point tutorials in a character's mouth.** Technical content is compressed into an image or a triad, not explained. CORE AI states a protocol as a recovered memory, it doesn't teach it.
4. **No purple prose, no stacked metaphors.** One concrete simile per line maximum; adjectives come in twos (`'Twardo, zimno'`, `'Pulsujący, tępy'`), not lush strings. No abstractions like "the vast tapestry of the cosmos".
5. **No emoji outside Floobert.** No exclamation-mark spam; exclamation points are reserved for genuine alarm, discovery, or Floobert/Świerszcz sounds.
6. **No speaker-string drift.** Don't write `'Core AI'`, `'CoreAI'`, `'Dr Kern'`, `'Cricket'`, or `'Officer Harris'` in Polish text — use the established exact strings.
7. **No modern-Earth idiom that breaks the amnesiac/deep-space frame** (no brand names except the in-world `GitHub` gag, which is explicitly framed as a half-remembered mystery word: `'„GitHub"...? To słowo brzmi znajomo, ale nie wiem skąd.'`).
8. **No resolved mysteries dumped as exposition.** Anomalies are logged and left open (`'Zapisuję i zostawiam otwarte.'`); the writing plants and defers rather than explains. Reveals are earned and minimalist, never monologued.
9. **No gender drift on Polish past-tense verbs.** CORE AI = neuter (`ślepe`), Moreau = feminine (`zaparzyłam`, `bałam się`), astronaut/Dexo = masculine (`zdałeś`, `trafiłem`). These are fixed per character.

---

### One-paragraph summary for a writer

Write each sequence as a **short linear run of lines** — no choices, no branching — with system/ambient lines auto-timed and character lines advancing on player input. Keep it **taut sci-fi noir**: short clipped fragments, the rule of three, one concrete simile per line, dry deadpan humor quarantined from dramatic beats. Voice the **amnesiac astronaut (Dexo)** as an interior detective re-reading anomalies; voice **CORE AI** as a calm, neuter-gendered, sight-obsessed machine that logs everything and peaks in minimalist awe (`'Widzę.'`); give **Moreau** coffee and guilt (feminine verbs), **Kern** rapturous over-certainty, **Harris** deferring promises, **Świerszcz** volume-coded chirps with parenthetical stage directions, and **Floobert** emoji nonsense. Dress real course concepts as recovered memories and ship "protocols," never as lessons. Achieve interactivity through **state-keyed sibling sequences** (`-start/-waiting/-post`, `-inert/-warning/-isolate/-done`, `-locked`, `-done/-already`) and **terminal-command prompts** (`/quest`, `/solve`, `earthctl`) — never in-dialogue choice trees. Use `„…"` quotes and `═`/`▓`/`████`/`▸`/`◆` glyphs in pl system printouts, British-spelled idiomatic en that mirrors the pl tone exactly, and always both languages, always equal.
