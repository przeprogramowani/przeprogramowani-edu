# Lesson Spec: m2-l5 — Innovate: Więcej ficzerów, mniej czekania - wielowątkowa praca z Agentami

## Schema Context

- Course: 10xdevs-3
- Module: 10xDevs Workflow (m2)
- Position: moduleOrder 5 / globalOrder 10
- Depends on: m2-l3 (Solo Code Review: weryfikuj kod AI szybko i skutecznie)
- Prepares for: m3-l1 (Plan testów z AI: quality gates, testing guide i priorytety)

## Prework Continuity

- Relevant prework lessons: [2.4] Agent-Native IDE — równoległa praca, worktrees, delegowanie w tle; [3.3] Cykl życia wątku — context isolation; [1.2] Chatbot vs Agent vs Harness
- Assumed from prework: worktrees jako koncept (2.4), równoległa praca jako możliwość (2.4), context isolation (3.3), agent = tool use in harness (1.2)
- Deepened here: worktrees z 2.4 → operacjonalizacja: `git worktree add` + fresh `claude -p` per worktree jako mechanizm izolacji; parallel work z 2.4 → orchestracja: headless execution + multi-session tools jako kompletny parallel pipeline
- Avoid repeating: definicja worktrees (2.4), teoria context engineering (3.3), interactive implementation (m2-l4), interactive review (m2-l3)

## Lesson Job

Kursant przeszedł pełny single-change cycle (m2-l1→m2-l3) na S-01. Teraz musi zobaczyć, że ten cykl SKALUJE SIĘ: te same kroki, ale na wielu slice'ach jednocześnie. Lekcja operacjonalizuje parallel work: worktrees dają izolację, `/goal` i Ralph Wiggum loop dają goal-directed/headless execution, multi-session tools (Superset, Conductor, Antigravity, Agent View) dają orkiestrację wielu sesji. Dwa tryby pracy: interaktywny (jak w m2-l4) dla złożonych zmian, bez rozmowy (goal-directed) dla prostych. Ale throughput ma sufit — review capacity kursanta. Lekcja zamyka M2 i otwiera M3: kursant shipuje szybciej, ale widzi quality gap (brak testów, brak quality gates) → naturalna motywacja do M3.

## Thesis

Cykl M2 (plan → implement → review) to twoja jednostka pracy. Skalowanie nie polega na uruchamianiu więcej agentów na jednym slice'u — polega na prowadzeniu więcej cykli równolegle z izolacją kontekstu. Masz dwa tryby: interaktywny (złożone zmiany) i bez rozmowy (proste, dobrze zaplanowane). Ale throughput ma sufit: twoja capacity do review. Więcej agentów bez review = więcej nierecenzowanego kodu.

## Learning Outcomes

- Kursant konfiguruje parallel agent workflow: dwa worktrees, dwa agenty, dwie niezależne zmiany implementowane równolegle.
- Kursant wybiera tryb pracy pasujący do zadania: interaktywny `/10x-implement` dla złożonych zmian, `/goal` lub headless `claude -p` dla prostych.
- Kursant rozumie Ralph Wiggum loop jako uniwersalny wzorzec autonomicznej pętli i identyfikuje analogię w narzędziach spoza Claude Code.
- Kursant orientuje się w ekosystemie multi-session tools (Superset, Conductor, Antigravity, Agent View) i rozumie wspólny wzorzec: izoluj, deleguj, reviewuj.
- Kursant doświadcza natural quality pain: "szybciej shipuję, ale skąd wiem, że to działa?" — rozumie, dlaczego M3 zaczyna od planowania testów.

## Audience Starting Point

Kursant ma:
- Completed single-change cycle na S-01: roadmap → plan → implement → review → merged code
- Doświadczenie z interactive `/10x-implement` i interactive `/10x-impl-review` (m2-l4, m2-l3)
- Roadmapę 10xCards z 7 slice'ami, dependency graph, statusami
- Kilka slice'ów z `status: ready` lub `proposed` do zaadresowania

Kursant prawdopodobnie:
- Chce "odpalić 5 agentów naraz" — instynkt over-parallelization
- Nie zna `git worktree add` operacyjnie (prework 2.4 wspomniał konceptualnie)
- Nie widział headless `claude -p` execution

## Behavioral Change

Kursant patrzy na roadmapę, identyfikuje niezależne slice'y, uruchamia 2-3 równolegle na worktrees — interaktywnie lub goal-directed — reviewuje PRy i skaluje throughput do swojej review capacity, nie powyżej.

## Owned Concepts

- Parallel agent workflows: multiple terminals, git worktrees jako izolacja kodu, fresh context per agent
- Goal-directed delegation: `/goal` w Claude Code, headless `claude -p`, Ralph Wiggum loop jako uniwersalny wzorzec autonomicznej pętli
- Multi-session tools ecosystem: Superset, Conductor, Antigravity, VS Code Agent View jako narzędzia orkiestracji równoległych sesji
- Two execution modes: interactive `/10x-implement` dla złożonych zmian, goal-directed delegation dla prostych zadań
- Context isolation across parallel sessions: each worktree = own context, own agent, own conversation
- Complete M2 cycle jako repeatable workflow: roadmap → frame/research/plan → implement → review dla wielu slice'ów
- Hybrid Innovate format: short intro + guided first parallel run, then independent challenge na dodatkowych slice'ach

## References Only

- Completed single-change cycle: m2-l1 (roadmap), m2-l2 (planning), m2-l4 (implementation), m2-l3 (review)
- `plan.md` i `## Progress` section (m2-l2/m2-l4)
- `/10x-impl-review` interactive triage (m2-l3 — referenced only, not taught here)
- `/10x-lesson` i failure-modes.md (m1-l4)
- Git worktrees concept (prework 2.4, taught in prose here)
- Context engineering Write/Select/Compress/Isolate (prework 3.3)
- CI/CD jako pierwsza produkcyjna pętla feedbacku (m1-l5)
- `/10x-new` dla tworzenia change folder (m2-l1)
- `/10x-archive` (introduced in earlier lessons, not repeated here)

## Must Not Cover

- Tworzenie roadmapy i wybór slice'a (m2-l1)
- Planning pipeline: frame, research, plan creation (m2-l2)
- Interactive single-change implementation — `/10x-implement` (m2-l4)
- Interactive code review methodology — `/10x-impl-review` (m2-l3)
- Planowanie testów i quality gates (m3-l1)
- Pisanie testów i TDD (m3-l2)
- Team-shared agent infrastructure i shared AI registry (m5)
- Budowanie własnych serwerów MCP (future module)
- Debugowanie jako samodzielny temat (m3-l5)

## Required Example Or Demo

**Guided parallel run:** Prowadzący tworzy dwa worktrees z 10xCards, uruchamia `/goal` na S-05 (auth compliance) i headless `claude -p "/goal ..."` na S-06 (UX improvements). Komentuje izolację kontekstu, wspomina Ralph Wiggum loop i Codex jako wzorce transferowalne.

**Multi-session tools overview:** Prowadzący krótko pokazuje Superset/Conductor/Antigravity/Agent View jako narzędzia orkiestracji wielu sesji. Akcentuje wspólny wzorzec: izoluj, deleguj, reviewuj.

**Quality pain moment:** Po kilku zmianach prowadzący zauważa brak testów i quality gates. "Szybciej shipuję — ale skąd wiem, że to działa?" Bridge do M3.

**Independent challenge:** Kursant powtarza na swoim projekcie z 2-3 slice'ami z roadmapy.

## Structural Logic Map

**Beat 1 — Hook: "Jeden slice gotowy — roadmap ma jeszcze 6"**
- Question answered: Przeszedłem cały cykl na S-01. Jak przyspieszyć resztę?
- Introduces: Problem throughput — sequential execution na 6 slice'ach = 6× czas. Parallel execution jako odpowiedź.
- Depends on: m2-l3 bridge (completed single-change cycle)
- Sets up: Worktrees i context isolation
- Diagram opportunity: Roadmap 10xCards dependency graph z kolorowaniem: S-05 + S-06 jako parallelizable pair.
- Risk: Powtórzenie roadmapy z m2-l1. Unikać: jedna tabela/diagram, "te dwa mogą biec równolegle", dalej.

**Beat 2 — Worktrees: izolacja kontekstu per agent**
- Question answered: Jak uruchomić dwa agenty bez konfliktu?
- Introduces: `git worktree add` jako mechanizm izolacji. Każdy worktree = własne repozytorium robocze, własny `claude -p`, własna konwersacja. Koncept transferowalny: w Codex to sandbox, w Cursor to folder.
- Depends on: Beat 1 (motywacja do parallel work)
- Sets up: Headless execution (Beat 3)
- Diagram opportunity: Mermaid: main repo → worktree A (agent 1, S-05) + worktree B (agent 2, S-06).
- Risk: Zbyt deep dive w git worktrees. Unikać: jedno polecenie, koncept > mechanizm.

**Beat 3 — Dwa tryby: rozmowa albo delegowanie**
- Question answered: Jak uruchomić agenta w worktree — interaktywnie czy bez rozmowy?
- Introduces: Dwa tryby pracy: interaktywny `/10x-implement` (jak m2-l4) dla złożonych zmian, `/goal` + headless `claude -p` + Ralph Wiggum loop dla prostych. Wzorzec delegowania celu jest uniwersalny — działa w Claude Code, Codex, OpenCode, Aider.
- Depends on: Beat 2 (worktrees gotowe)
- Sets up: Multi-session tools (Beat 4)
- Diagram opportunity: —
- Risk: "Headless = brak weryfikacji." Unikać: weryfikacja przenosi się na PR review.

**Beat 4 — Wiele sesji, jedno biurko**
- Question answered: Jak zarządzać wieloma agentami jednocześnie?
- Introduces: Superset, Conductor, Antigravity, VS Code Agent View. Wspólny wzorzec: izoluj kontekst, deleguj cel, reviewuj w jednym miejscu.
- Depends on: Beat 3 (agenty działają)
- Sets up: Independent challenge (Beat 5)
- Diagram opportunity: —
- Risk: Recenzja produktów zamiast wzorca. Unikać: krótko, wzorzec > narzędzie.

**Beat 5 — Independent challenge + quality pain bridge**
- Question answered: Co robię na swoim projekcie? I co dalej?
- Introduces: Checklist do samodzielnej pracy. Quality pain: "szybciej shipuję, ale skąd wiem, że to działa?" Bridge do M3.
- Depends on: Beat 1-4
- Sets up: M3-l1
- Diagram opportunity: —
- Risk: Za mało instrukcji / bait-and-switch z quality pain. Unikać: dać checklist; quality pain wynika z doświadczenia.

**Beat 6 — Over-parallelization (Deep Dive)**
- Question answered: Ile agentów mogę uruchomić jednocześnie?
- Introduces: Failure mode: over-parallelization. Bottleneck = review capacity. Heurystyka: paralelizuj tyle, ile zdążysz zreviewować w jednej sesji.
- Depends on: Beat 1-5 (kursant rozumie pipeline)
- Sets up: —
- Diagram opportunity: —
- Risk: "Ale ja dam radę 5." Unikać: nie zabraniać, zachęcić do eksperymentu.

## Failure Mode To Disarm

**Over-parallelization:** Kursant widzi 5 ready slice'ów i uruchamia 5 agentów. Traci kontrolę: 5 PRs do review, nie nadąża, merge'uje bez review. Lekcja adresuje to przez:
1. Heurystykę: "paralelizuj tyle, ile zdążysz zreviewować w jednej sesji" (Beat 6)
2. Bottleneck framing: throughput ograniczony review capacity, nie generation
3. Quality pain (Beat 5): konsekwencja → nierecenzowany kod bez testów → bridge do M3

## Suggested Structure

1. **"Jeden slice gotowy — roadmap ma jeszcze 6"** (Beat 1) — Hook. Throughput.
   ```
   m2-l3 bridge → this beat → worktrees:
   Nie powtarzać dependency graph z m2-l1. Jedna tabela, dalej.
   ```

2. **Worktrees: izolacja kontekstu** (Beat 2) — `git worktree add`, koncept transferowalny.
   ```
   Hook → this beat → headless:
   Jedno polecenie, nie git tutorial.
   ```

3. **Dwa tryby: rozmowa albo delegowanie** (Beat 3) — `/goal`, Ralph Wiggum loop, headless `claude -p`.
   ```
   Worktrees → this beat → multi-session tools:
   Dwa tryby, nie recenzja narzędzi. Wzorzec > feature.
   ```

4. **Wiele sesji, jedno biurko** (Beat 4) — Superset, Conductor, Antigravity, Agent View.
   ```
   Dwa tryby → this beat → challenge:
   Wspólny wzorzec: izoluj, deleguj, reviewuj. Krótko.
   ```

5. **Independent challenge + quality pain bridge** (Beat 5) — Checklist + bridge do M3.
   ```
   Multi-session tools → this beat → M3:
   Checklist, nie tutorial. Quality pain wynika z doświadczenia.
   ```

## Video Placeholders

- **Video 1: Guided parallel run** — Prowadzący tworzy dwa worktrees, uruchamia `/goal` i headless `claude -p "/goal ..."` na S-05 i S-06, komentuje izolację kontekstu, wspomina Ralph Wiggum loop i Codex jako wzorce transferowalne.
- **Video 2: Multi-session tools overview** — Prowadzący krótko pokazuje Superset/Conductor/Antigravity/Agent View jako narzędzia orkiestracji wielu sesji.
- **Video 3: Quality pain bridge** — Prowadzący przegląda PRy i wyniki po kilku równoległych zmianach, zauważa brak testów i quality gates, zamyka lekcję pytaniem prowadzącym do M3.

## Bridge In

Kursant wchodzi z m2-l3 z:
- Completed single-change cycle na S-01 (roadmap → plan → implement → review → merged)
- Reviewed + merged code z verdiktem
- Surfaced patterns (lessons, contracts) z triage
- Roadmapą 10xCards z remaining slice'ami

Lekcja startuje: "Jeden slice gotowy. Roadmap ma jeszcze 6. Jak przyspieszyć?"

## Bridge Out

Kursant wychodzi z:
- Doświadczeniem parallel workflow: worktrees + goal-directed delegation + multi-session tools
- Rozumieniem dwóch trybów: interaktywny vs bez rozmowy
- Natural quality pain: "szybciej shipuję, ale skąd wiem, że to działa?"
- Nawykiem skalowania throughput do review capacity

M3-l1 startuje od quality pain → planowanie testów i quality gates.

## Open Questions

- Czy S-05 i S-06 będą wystarczająco gotowe do parallel demo?
- Split-screen format dla headless demo video — dwa terminale jednocześnie.
- Multi-session tools: aktualne URL-e do zweryfikowania przed publikacją.

### Closed Questions

- Demo slices: S-05 (auth compliance) + S-06 (UX improvements).
- Failure mode: over-parallelization (bottleneck = review capacity).
- Format: hybrid (guided + independent challenge).
- Worktrees: koncept w prozie, nie dedykowany skill.

## Side-Effect Ledger

New claims introduced:
- "Skaluj cykl, nie agenty" — throughput z parallel cycles, nie parallel agents na jednym slice'u.
- Review capacity jako bottleneck throughput — heurystyka: paralelizuj tyle, ile zdążysz zreviewować.
- Ralph Wiggum loop jako uniwersalny wzorzec autonomicznej pętli (Stop hook, while true, completion promise).
- Multi-session tools (Superset, Conductor, Antigravity, VS Code Agent View) jako ekosystem orkiestracji.
- Dwa tryby pracy: interaktywny vs goal-directed — wybór zależy od dojrzałości planu.
- Quality pain jako naturalny efekt skalowania bez quality gates — bridge do M3.
- Over-parallelization jako failure mode.

Claims removed:
- `/10x-impl-review-ci` jako automated PR review (per lesson-todo.md).
- `/10x-archive` jako lifecycle closure (per lesson-todo.md).
- `/10x-status` jako dashboard (nie obsługuje worktrees, usunięty z lekcji).

Neighboring lesson references changed:
- m2-l3: bridge in — completed single-change cycle jako prerequisite.
- m3-l1: bridge out — quality pain jako motywacja M3.

Prework references used:
- [2.4] worktrees i parallel work → operacjonalizowane jako `git worktree add` + `claude -p`
- [3.3] context isolation → każdy worktree = własny agent, własny kontekst
- [1.2] delegowanie celów → parallel: delegowanie wielu celów wielu agentom

Prework concepts repeated intentionally:
(none)

Potential duplicates:
- Worktrees vs prework 2.4. Granica: prework = koncept, m2-l5 = operacjonalizacja.
- Multi-session tools vs prework 2.4 Agent-Native IDE. Granica: prework = przegląd narzędzi, m2-l5 = orkiestracja w kontekście parallel workflow.

Unsupported facts:
- Learner-facing CLI ref (`m2l5`) wymaga potwierdzenia w course-content wiring.
- URL-e produktów (Superset, Conductor, Antigravity) mogą się zmienić przed publikacją.

Video/text mismatches:
- p2 (CI review + archive) wymaga przebudowy na multi-session tools overview.
- p3 — `/10x-status` usunięty, quality pain bridge oparty na git log/PR.

Needs human decision:
- Video p2: przebudować na multi-session tools overview
- S-05 + S-06 demo readiness
- Kanoniczny heading Zadania praktyczne: dodany w drafcie
