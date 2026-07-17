# Lesson Spec: m2-l3 — Solo Code Review: weryfikuj kod AI szybko i skutecznie

## Schema Context

- Course: 10xdevs-3
- Module: 10xDevs Workflow (m2)
- Position: moduleOrder 3 / globalOrder 8
- Depends on: m2-l2 (Architektura z Agentami: od roadmapy do pierwszego działającego streamu)
- Prepares for: m2-l4 (Implementacja z AI: SRS jako trudniejszy stream po CRUD)

## Prework Continuity

- Relevant prework lessons: [3.2] Wzorce i antywzorce promptowania, [1.3] Jak uczyć się i rozwijać z AI, [2.4] Agent-Native IDE
- Assumed from prework: code review jako koncept i szablon pracy (3.2), ryzyka nadmiernego zaufania agentowi (2.4), generation-then-comprehension workflow (1.3)
- Deepened here: szablon "code review" z 3.2 → pełna operacjonalizacja: systematyczny 6-wymiarowy scorecard + interactive triage zamiast ad-hoc scanning; ryzyko "approve bez obrony" z 1.3 → triage loop jako mechanizm wymuszający świadome decyzje per finding
- Avoid repeating: definicja code review (3.2), lista ryzyk agent-native IDE (2.4), teoria nauki z AI (1.3)

## Lesson Job

Kursant ma zaimplementowany kod z m2-l2 — commity per faza, `## Progress` complete. Przed merge potrzebuje bramy jakości: systematycznego review, który łapie drift, safety issues, pattern violations i scope creep. Ale brama nie znaczy "napraw wszystko" — kursant musi ocenić IMPACT każdego finding i podjąć świadomą decyzję: fix, skip, accept risk, zarejestrować jako recurring rule albo disagree. Lekcja uczy NAWYKU (review zawsze przed merge) i JUDGMENTU (co fixować, co odpuścić, co zamienić w project memory).

## Thesis

Review kodu AI nie jest approve/reject — to brama jakości, przez którą MUSI przejść każda zmiana. Ale brama nie znaczy "napraw wszystko." Severity mówi ci, jak zły jest problem. Impact mówi ci, ile wysiłku wymaga decyzja. Triage judgment — umiejętność odróżnienia fix-worthy findings od szumu — to skill, którego ta lekcja uczy.

## Learning Outcomes

- Kursant uruchamia `/10x-impl-review` na implementacji z m2-l2, odczytuje 6-wymiarowy scorecard i identyfikuje findings ordered by severity.
- Kursant prowadzi interactive triage loop: finding-by-finding decyzja z uzasadnieniem (fix, skip, accept risk, accept as rule, disagree).
- Kursant stosuje diff-reading strategies: wie, co priorytetyzować w review kodu wygenerowanego przez agenta vs kodu pisanego ręcznie.
- Kursant odróżnia review jako quality gate (approve/request changes/block) od code review jako pair programming.

## Audience Starting Point

Kursant ma:
- Zaimplementowany kod z commitami per faza (m2-l2)
- `## Progress` z `[x]` i SHA per step (m2-l2)
- `plan.md` jako referencję do sprawdzenia driftu (m2-l2)
- Doświadczenie z lekcji o regułach m1-l4: `/10x-lesson` jako sposób zamiany powtarzalnego incydentu w wpis `lessons.md`, plus `failure-modes.md` jako rejestr błędów agentowych

Kursant prawdopodobnie:
- Traktuje review jako "przeczytaj diff, powiedz ok" — brak systematyki
- Nie wie, jak odróżnić szum od krytycznych findings w AI-generated diff
- Chce "naprawić wszystko" co agent zgłosi — instynkt overcorrection
- Nie myśli o review jako o momencie budowania project memory (lessons)

## Behavioral Change

Kursant po każdej implementacji uruchamia `/10x-impl-review` jako stały krok przed merge, triaguje finding-by-finding z impact assessment, i świadomie odpuszcza trivial findings zamiast fixować wszystko.

## Owned Concepts

- `/10x-impl-review` jako metodologia review kodu AI: 6-wymiarowy scorecard (Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, Success Criteria)
- Interactive triage loop: finding-by-finding decyzja (fix / skip / accept risk / accept as rule / disagree)
- Fix jako triage outcome: agent naprawia finding w miejscu na podstawie review
- Accept-as-rule / `/10x-lesson` jako triage outcome: recurring pattern → `lessons.md`. To jest reinforcement z lekcji o regułach m1-l4, gdzie `/10x-lesson` pojawia się pierwszy raz jako mechanizm zamiany incydentu w trwałą regułę projektu.
- Diff-reading strategies dla AI-generated code: co priorytetyzować, jak odróżnić szum od krytycznych zmian
- Review jako quality gate przed merge: review report, verdict (approve / request changes / block)
- Disagree jako triage outcome: agent reasoning był błędny, finding odrzucony z uzasadnieniem

## References Only

- Implemented code z `## Progress` complete (m2-l2)
- `plan.md` jako referencja do sprawdzania driftu (m2-l2)
- Lekcja o regułach m1-l4: `/10x-lesson` introduced there as incident → recurring rule → `lessons.md`; m2-l3 only reuses it as "accept as rule" triage outcome
- `failure-modes.md` i AGENTS.md / reguły projektu (m1-l4)
- Testing strategies i coverage (m3-l1/m3-l2 — forward ref)
- CI/CD automated review i `/10x-impl-review-ci` (M3 — forward ref)

## Must Not Cover

- Implementacja kodu i phase-by-phase execution (m2-l2)
- Planowanie architektoniczne i tworzenie plan.md (m2-l2)
- CI/CD automated review na PR-ach — `/10x-impl-review-ci` (M3)
- Planowanie testów i strategia testowa (m3-l1)
- Pisanie testów i TDD (m3-l2)
- Hooki i triggery automatyczne jako system (m3-l3)
- Testy E2E (m3-l4)
- Debugowanie jako samodzielny temat (m3-l5)
- Team review process i multi-person review (m5)

## Required Example Or Demo

Kontynuacja 10xCards z m2-l2 — prowadzący uruchamia `/10x-impl-review` na implementacji slice'a S-01 (Generation, candidate review, atomic save). Pełny pipeline: scorecard → findings → triage. Prowadzący triaguje 3-4 findings: fixuje CRITICAL, robi accept-as-rule na WARNING z recurring pattern (→ `/10x-lesson` → `lessons.md`), skip na OBSERVATION + LOW impact (anti-overcorrection), disagree na finding z błędnym reasoningiem.

## Structural Logic Map

**Beat 1 — Hook: "Kod działa — ale czy jest gotowy do merge?"**
- Question answered: Implementacja z m2-l2 przeszła verification gates. Czy mogę merge'ować?
- Introduces: Review jako brama jakości — step między implementation a merge. "Kod działa" ≠ "kod jest ready."
- Depends on: m2-l2 bridge (kursant ma zaimplementowany kod)
- Sets up: Dlaczego ad-hoc scanning nie wystarczy → potrzeba systematyki
- Diagram opportunity: —
- Risk: Moralizowanie "rób review." Unikać: od razu przejść do "jak robić review DOBRZE."

**Beat 2 — 6-wymiarowy scorecard: systematyka zamiast gut-feel**
- Question answered: Jak systematycznie sprawdzić kod AI? Na co patrzeć?
- Introduces: `/10x-impl-review` i 6 wymiarów. Verdicts per dimension (PASS/WARNING/FAIL). Overall verdict (APPROVED/NEEDS ATTENTION/REJECTED).
- Depends on: Beat 1 (motywacja do systematyki)
- Sets up: Findings i triage (Beat 3-4)
- Diagram opportunity: Tabela 6 wymiarów z krótkim opisem — pomaga zapamiętać framework.
- Risk: Feature tour 6 wymiarów. Unikać: overview, nie deep dive. Kursant widzi wymiary w report.

**Beat 3 — Severity × Impact: co fixować, co odpuścić**
- Question answered: Agent zgłosił 5 findings. Które fixuję, a które odpuszczam?
- Introduces: Severity (CRITICAL/WARNING/OBSERVATION) × Impact (LOW/MEDIUM/HIGH) jako matryca triage. Failure mode: "fix all" overcorrection.
- Depends on: Beat 2 (scorecard wygenerował findings)
- Sets up: Triage loop (Beat 4)
- Diagram opportunity: Matryca severity × impact z przykładami per kwadrant.
- Risk: Matryca jest uproszczeniem. Unikać: powiedzieć wprost, że to heurystyka.

**Beat 4 — Interactive triage: finding-by-finding decyzja**
- Question answered: Jak przechodzę przez findings?
- Introduces: Triage loop. 4 grupy outcomes: napraw, nie naprawiaj teraz, buduj project memory, odrzuć.
- Depends on: Beat 3 (kursant wie, co priorytetyzować)
- Sets up: Project memory outcomes (Beat 5)
- Diagram opportunity: Mermaid decision tree: finding → severity × impact → 4 grupy outcomes.
- Risk: 8 outcomes = choice paralysis. Unikać: grupować w 4 grupy.

**Beat 5 — Triage outcomes: budowanie project memory**
- Question answered: Co to znaczy "accept as rule"?
- Introduces: Reinforces from m1-l4: `/10x-lesson` → `lessons.md` jako znany już mechanizm zapisywania powtarzalnych reguł. Review jako moment nauki projektu.
- Depends on: Beat 4 (triage loop)
- Sets up: Diff-reading (Beat 6)
- Diagram opportunity: —
- Risk: Side quest feeling. Unikać: framing "review to nie tylko naprawianie."

**Beat 6 — Diff-reading: co priorytetyzować w AI-generated code**
- Question answered: Czym różni się review kodu agenta od review kodu ludzkiego?
- Introduces: 3-4 heurystyki: safety boundaries first, scope creep, pattern compliance, success criteria.
- Depends on: Beat 2-4 (kursant rozumie scorecard i triage)
- Sets up: Bridge out
- Diagram opportunity: —
- Risk: Może brzmieć generycznie. Unikać: kotwić w findings z demo.

**Beat 7 — Bridge out: reviewed code → m2-l5**
- Question answered: Co mam po lekcji i co dalej?
- Introduces: Review zamyka single-change cycle. m2-l5 paralelizuje pracę, ale bez przejmowania `/10x-impl-review-ci`; automatyczne review wraca w M3.
- Depends on: Beat 1-6
- Sets up: m2-l5
- Diagram opportunity: —
- Risk: Pominięcie kontekstu m2-l5.

## Failure Mode To Disarm

**"Fix all" overcorrection:** Kursant widzi findings i instynktownie chce naprawić KAŻDY — włącznie z OBSERVATION + LOW impact. Spędza 2h naprawiając trivial findings zamiast ocenić, czy mają znaczenie. Lekcja adresuje to przez:
1. Severity × Impact matrycę (Beat 3) — narzędzie do odróżnienia signal od noise
2. Explicit "skip" i "accept risk" jako valid triage outcomes (Beat 4) — normalizuje odpuszczanie
3. Demo, gdzie prowadzący świadomie skipuje OBSERVATION (Beat 4) — modeluje zachowanie

## Suggested Structure

1. **Kod działa — ale czy jest ready?** (Beat 1) — Review jako brama.
   ```
   m2-l2 bridge → this beat → scorecard:
   Nie moralizować. Od razu: "jak robić review dobrze."
   ```

2. **Scorecard: 6 wymiarów review** (Beat 2) — `/10x-impl-review`, verdicts, verdict.
   ```
   Hook → this beat → severity × impact:
   Overview scorecarda. Nie deep dive w każdy wymiar.
   ```

3. **Severity × Impact: co fixować** (Beat 3) — Matryca, failure mode overcorrection.
   ```
   Scorecard → this beat → triage loop:
   Główna sekcja judgmentu. Matryca + overcorrection.
   ```

4. **Interactive triage: finding-by-finding** (Beat 4) — 4 grupy outcomes, demo.
   ```
   Severity × impact → this beat → project memory:
   Mechanika triage. 4 grupy, nie 8 opcji.
   ```

5. **Budowanie project memory** (Beat 5) — lessons.md.
   ```
   Triage loop → this beat → diff-reading:
   Nie side quest — review to moment nauki projektu.
   ```

6. **Diff-reading: co priorytetyzować** (Beat 6) — Heurystyki dla AI-generated code.
   ```
   Project memory → this beat → bridge out:
   Supporting beat. 3-4 heurystyki.
   ```

7. **Co dalej** (Beat 7) — Reviewed code → m2-l5.
   ```
   Diff-reading → this beat → m2-l5:
   Review zamyka single-change cycle. m2-l5 paralelizuje, a `/10x-impl-review-ci` zostaje na M3.
   ```

## Video Placeholders

- **Video 1: Pełny review z triage** — Prowadzący uruchamia `/10x-impl-review` na implementacji z m2-l2, przechodzi 6-wymiarowy scorecard i findings. Triaguje 3-4 findings: fix (CRITICAL), accept-as-rule (→ `/10x-lesson`), skip (OBSERVATION + LOW impact — anti-overcorrection), disagree.
- **Video 2 (opcjonalny)**: Disagree — finding, z którym prowadzący się nie zgadza. Może być częścią Video 1.

## Bridge In

Kursant wchodzi z m2-l2 z:
- Zaimplementowanym kodem z commitami per faza
- `## Progress` z `[x]` i SHA per step
- `plan.md` jako referencją do sprawdzenia driftu
- Doświadczeniem z lekcji o regułach m1-l4: `/10x-lesson` jako mechanizmem dopisywania powtarzalnych lekcji do `lessons.md` oraz `failure-modes.md` jako rejestrem incydentów

Lekcja startuje: "Kod działa, testy przechodzą, commity są czyste. Ale czy jest gotowy do merge?"

## Bridge Out

Kursant wychodzi z:
- Reviewed code z verdiktem (APPROVED / NEEDS ATTENTION)
- Surfaced patterns: nowe entries w `lessons.md`
- Nawykiem: review ZAWSZE przed merge
- Judgmentem: severity × impact → triage decision

M2-l5 startuje od completed single-change cycle i paralelizuje go: headless implementation, archive, multiple slices. `/10x-impl-review-ci` wraca dopiero w M3.

## Open Questions

- Czy disagree powinno mieć osobne video, czy wystarczy jako część głównego triage demo?

### Closed Questions

- Demo slice: S-01 (Generation, candidate review, atomic save) z 10xCards roadmapy.
- Failure mode: "fix all" overcorrection (nie "rubber stamp").
- Wymiary scorecardu: zweryfikowane z SKILL.md `/10x-impl-review` — Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, Success Criteria.

## Side-Effect Ledger

New claims introduced:
- Severity × Impact jako matryca triage judgment — severity ≠ impact, obie osie potrzebne.
- 4 grupy triage outcomes (napraw / nie naprawiaj / buduj memory / odrzuć) jako uproszczenie 8 opcji.
- "Fix all" overcorrection jako failure mode (inverse of rubber stamp).
- Review jako moment budowania project memory (lessons.md).

Claims removed:
(none)

Neighboring lesson references changed:
- m2-l2: bridge in — implemented code z commitami per faza jako input.
- m2-l5: bridge out — reviewed + merged code, surfaced patterns jako input.
- m1-l4 lekcja o regułach: `/10x-lesson` introduced there as incident → recurring lesson → `lessons.md`; m2-l3 reinforces it as "accept as rule" triage outcome, not as a new skill.

Prework references used:
- [3.2] szablon "code review" → operacjonalizowany jako scorecard + triage
- [1.3] "approve bez obrony" → triage loop jako mechanizm świadomych decyzji
- [2.4] ryzyka mniejszej widoczności kodu → diff-reading strategies

Prework concepts repeated intentionally:
(none)

Potential duplicates:
- `/10x-lesson` w triage vs m1-l4. Granica: m1-l4 wprowadza `/10x-lesson` po raz pierwszy jako zapis powtarzalnej lekcji; m2-l3 używa go tylko w kontekście review triage.
- Review vs quality gates (m3-l1). Granica: m2-l3 = human review, m3-l1 = automated quality gates.

Unsupported facts:
(none — learner-facing CLI ref `m2l3` approved as planned course-content wiring)

Video/text mismatches:
(none)

Needs human decision:
- Disagree: osobne video czy część głównego demo
