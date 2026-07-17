# Lesson Spec: m2-l1 — Roadmapa MVP: Technical Project Manager, milestony i backlog dla agenta

## Schema Context

- Course: 10xdevs-3
- Module: m2 — 10xDevs Workflow
- Position: 1/5 (module), 6 (global)
- Depends on: m1-l5 — Od localhosta na produkcję
- Prepares for: m2-l2 — Architektura z Agentami: zaplanuj pracę, zanim wygenerujesz kod

## Prework Continuity

- Relevant prework lessons: [1.2] Chatbot vs Agent vs Harness; [2.4] Agent-Native IDE; [3.2] Wzorce i antywzorce promptowania; [3.3] Cykl życia wątku i zarządzanie kontekstem; [4.2] Dobry i zły projekt kursowy
- Assumed from prework: agent realizuje cele przez narzędzia w kontrolowanym harnessie; prompt do agenta jest kontraktem; dobry projekt kursowy ma małe MVP, konkretny przepływ użytkownika, dane, logikę biznesową i test użytkownika
- Deepened here: kursant przestaje myśleć jak wykonawca pojedynczych zadań i zaczyna prowadzić projekt jak technical project manager: definiuje milestony, wybiera sekwencję pracy, ujawnia ryzyka i przekłada roadmapę na backlog dostępny dla człowieka oraz agenta
- Avoid repeating: definicji agenta/harnessu, ogólnych zasad promptowania, kryteriów dobrego projektu kursowego i pełnej mechaniki context engineering

## Lesson Job

M2-l1 otwiera właściwy 10xDevs Workflow. Kursant ma już po module 1 łańcuch artefaktów: `shape-notes.md`, `prd.md`, `tech-stack.md`, repo po bootstrapie, reguły dla agenta, `infrastructure.md`, `deploy-plan.md` i działającą aplikację na produkcji. Ta lekcja nie zaczyna od kodowania. Najpierw zmienia rolę kursanta: z programisty czekającego na listę ticketów w technical project managera, który potrafi zaplanować serię milestone'ów dla siebie, zespołu i agenta.

Lekcja ma zbudować trzy fundamenty:

1. **Part 1 — Technical Project Manager mindset:** kto to jest, co robi, jak wpływa na projekt i dlaczego programista pracujący z agentem musi poznać ten skill.
2. **Part 2 — Roadmapowanie MVP:** jak planować roadmapę jako solo-dev i w zespole, jak użyć skilla `~/dev/10x-toolkit/packages/ai-artifacts/skills/10x-roadmap`, dlaczego domyślną jednostką pracy są vertical slices i kiedy krótki horizontal enabler ma sens.
3. **Part 3 — Backlog projektowy z MCP:** jak podłączyć agenta do Jiry / Linear przez MCP i przełożyć roadmapę na backlog, do którego dostęp ma człowiek i agent.

## Thesis

Agent nie potrzebuje chaotycznej listy zadań ani jednego promptu "zbuduj mi aplikację". Potrzebuje prowadzenia projektowego: jasnego celu, sekwencji pionowych milestone'ów, widocznych zależności, jawnych ryzyk i backlogu, który jest wspólnym źródłem prawdy dla człowieka oraz agenta. Horizontal work jest dopuszczalny tylko wtedy, gdy odblokowuje nazwany vertical milestone, redukuje blocking unknown albo tworzy infrastrukturę weryfikacji.

## Learning Outcomes

- Kursant wyjaśnia, czym różni się rola programisty-wykonawcy od roli technical project managera w pracy z agentami.
- Kursant potrafi nazwać obowiązki TPM-a: priorytetyzacja, sequencing, zarządzanie ryzykiem, dependency management, kontrola zakresu, synchronizacja pracy człowieka i agenta.
- Kursant odróżnia `prd.md`, `tech-stack.md`, `roadmap.md`, backlog item i `context/changes/<change-id>/plan.md`.
- Kursant uruchamia `10x-roadmap` na projekcie z `context/foundation/prd.md` i interpretuje wynikowy `context/foundation/roadmap.md`.
- Kursant wyjaśnia, dlaczego vertical slices są domyślnym sposobem roadmapowania pracy z agentem AI.
- Kursant rozpoznaje uzasadniony horizontal enabler: krótki foundation/spike/test-harness work, który odblokowuje konkretny vertical milestone.
- Kursant planuje roadmapę inaczej dla solo-deva i inaczej dla zespołu: uwzględnia capacity, specjalizacje, ownership, dependency bottlenecks i możliwość równoległej pracy.
- Kursant rozumie, jak MCP pozwala agentowi pracować z Jira / Linear jako narzędziem projektowym, a nie tylko z lokalnym repozytorium.
- Kursant potrafi przełożyć `roadmap.md` na backlog: epiki/milestone'y, issues, dependencies, statusy, acceptance criteria, `change-id` i zadania gotowe do dalszego `/10x-plan <change-id>`.

## Audience Starting Point

Kursant ma domknięty sprint zero: PRD, wybrany stack, uruchomione repo, reguły dla agenta i aplikację na produkcji. Czuje pokusę, żeby wrzucić PRD do agenta i poprosić o zbudowanie całej aplikacji. Rozumie już, że agent działa lepiej z kontraktami i kontekstem, ale może jeszcze nie widzieć, że największą zmianą w pracy z agentami nie jest szybsze pisanie kodu, tylko przejęcie odpowiedzialności za planowanie i sterowanie projektem.

## Behavioral Change

Kursant przestaje pytać agenta "co teraz zakodować?" i zaczyna prowadzić projekt przez milestony: wybiera cel, rozbija MVP na roadmapę, decyduje o kolejności, ujawnia blokady i synchronizuje backlog, z którego korzysta zarówno człowiek, jak i agent.

## Owned Concepts

- technical project manager jako rola łącząca produkt, technologię, ryzyko i egzekucję
- różnica między developer execution a project orchestration w pracy z agentami
- roadmapa MVP jako kontrakt między foundation docs, backlogiem i per-change planningiem (`shape-notes.md` -> `prd.md` -> `tech-stack.md` -> `roadmap.md` -> Jira/Linear -> `context/changes/<change-id>/plan.md`)
- milestone jako jednostka wartości lub postępu technicznego, którą można świadomie zatwierdzić, zaplanować i delegować
- vertical slices: user-visible outcome przechodzący przez UI, dane, logikę i integracje
- vertical-first roadmap: seria user-visible milestone'ów jako domyślny model pracy z agentami AI
- ewolucja workflow 10xDevs: wcześniejsze edycje kursu mogły naturalnie iść bardziej warstwowo/horizontal, ale potencjał agentów typu Claude Code i Codex w 2026 faworyzuje mniejsze, weryfikowalne vertical milestones
- horizontal enablers: krótkie, ograniczone warstwy techniczne typu data model, auth scaffold, test harness, observability spike lub integration spike
- zasada "no orphan horizontal work": każdy horizontal enabler musi wskazywać vertical milestone, który odblokowuje
- roadmapowanie solo-dev vs zespół: capacity, ownership, równoległość, bottlenecks i koszt synchronizacji
- `10x-roadmap` jako skill dekompozycji i sequencing, nie szczegółowego planowania implementacji
- `change-id` jako stabilny identyfikator jednej zmiany, który łączy backlog item, folder `context/changes/<change-id>/`, `plan.md`, `plan-brief.md` i późniejsze `/10x-implement <change-id> phase 1`
- `/10x-plan <change-id>` jako downstream consumer wybranego milestone'u, nie generator roadmapy i nie zamiennik backlogu
- MCP jako warstwa narzędziowa, która pozwala agentowi czytać i aktualizować backlog projektowy
- Jira / Linear jako shared project memory: status, owner, dependency, acceptance criteria, link do roadmapy i link do planu zmiany

## References Only

- PRD authoring i user stories (m1-l1)
- tech-stack selection i skille jako mechanizm proceduralny (m1-l2)
- bootstrap repo i Plan Mode (m1-l3)
- AGENTS.md / agent onboarding / reguły projektu (m1-l4)
- `infrastructure.md`, `deploy-plan.md` i production URL z m1-l5
- pełna architektura pojedynczego slice'a (m2-l2)
- implementacja slice'a, kontrola kontekstu i 80% ready challenge (m2-l4)
- review kodu AI (m2-l3)
- wielowątkowa praca agentów i równoległe wdrożenia (m2-l5)

## Must Not Cover

- szczegółowego projektowania architektury rozwiązania dla konkretnego milestone'u (m2-l2)
- pisania implementacyjnego planu krok po kroku dla jednego slice'a (`/10x-plan`, m2-l2/m2-l4)
- implementowania kodu albo debugowania agent-generated code (m2-l4)
- code review i QA wygenerowanych zmian (m2-l3)
- orkiestracji wielu agentów/worktrees jako głównego tematu (m2-l5)
- pełnego tutoriala administracyjnego Jiry / Linear
- zaawansowanej konfiguracji MCP serverów, OAuth scopes i permission modelu poza minimum potrzebnym do mental modelu lekcji
- szczegółowego procesu Scrum/Kanban, story points, sprint velocity i ceremonii zespołowych
- traktowania vertical i horizontal slicing jako równorzędnych strategii roadmapowania
- projektowania szerokich horizontal tracks typu "najpierw cała baza, potem całe API, potem cały UI"

## Required Example Or Demo

Projekt 10xCards po module 1: istnieje `context/foundation/shape-notes.md`, `context/foundation/prd.md`, `context/foundation/tech-stack.md`, `context/foundation/infrastructure.md`, `context/deployment/deploy-plan.md`, aplikacja działa na produkcji, ale MVP nie ma jeszcze uporządkowanej ścieżki rozwoju.

Demo powinno pokazać trzy przejścia:

1. **Z programisty w TPM-a:** prowadzący pokazuje zły prompt "zbuduj mi aplikację z tego PRD" i zamienia go na pytania TPM-a: jaki jest cel, co ma dać pierwszy milestone, gdzie jest największe ryzyko, kto ma capacity, co blokuje start.
2. **Od PRD i tech-stacku do roadmapy:** prowadzący pokazuje, że `/10x-prd` wyprodukował produktowy `context/foundation/prd.md`, a `10x-tech-stack-selector` wyprodukował techniczny hand-off `context/foundation/tech-stack.md`. Następnie uruchamia `/10x-roadmap` na `prd.md`, komentuje baseline probe, wykorzystanie `tech-stack.md` jako kontekstu foundation, interview i wynikowy `context/foundation/roadmap.md`. W demo trzeba pokazać roadmapę vertical-first oraz jeden mały horizontal enabler, który jawnie odblokowuje konkretny vertical milestone.
3. **Od roadmapy do backlogu i change-id:** prowadzący pokazuje przykładowe podłączenie agenta do Linear albo Jiry przez MCP, a potem przekłada 2-3 pozycje z roadmapy na issues z acceptance criteria, dependencies, labels/statusami, linkiem do `roadmap.md` i stabilnym `change-id`, np. `first-card-flow`.

## 10xCards Roadmap Example

Źródłowy PRD do przykładu: `/Users/psmyrdek/dev/10x-Cards-original/10xCardsOriginal/context/foundation/prd.md`.

PRD 10xCards definiuje bardzo silny north star: **learner pastes source text -> gets AI-generated candidate flashcards -> explicitly accepts/rejects each candidate -> saves accepted cards atomically -> accepted cards are immediately available in a flat deck and later reviewable by SRS**.

To nie jest projekt "zrób CRUD fiszek". Wedge produktu polega na tym, że karty są jednocześnie AI-generated i human-gated. Roadmapa demo musi to pokazać już w pierwszych milestone'ach.

### Recommended Roadmap Bias

- **Main goal:** market feedback / low complexity. PRD ma `mvp_weeks: 1`, `after_hours_only: true`, `target_scale.users: small`, więc roadmapa powinna ciąć zakres agresywnie.
- **North star story:** `US-01: Learner generates a card batch from pasted material and saves the keepers`.
- **Primary metric:** ≥ 75% AI-generated flashcard candidates are accepted by learners.
- **Guardrails:** privacy of pasted source material, visible generation feedback, no UI freeze beyond the 30-second soft target.

### Example Vertical-First Sequence

**S-01 — First gated generation loop** (`change-id: first-gated-generation`)
- **Outcome:** Signed-in learner pastes text, requests a preferred number of cards, receives persisted draft candidates, explicitly accepts/rejects each one, and finalizes accepted cards into the deck.
- **PRD refs:** US-01, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012.
- **Why first:** this is the product wedge and the only path that can test the primary metric.
- **Possible enabler:** `F-01 minimal-persistence-and-auth` if the baseline lacks account/session/data scaffolding.
- **Backlog issue:** "Create first gated generation flow".
- **Acceptance criteria:** over-cap input is rejected before LLM call; generation failure shows explicit error; every candidate requires accept/reject; finalize atomically promotes accepted drafts; pending/rejected drafts do not enter deck.
- **Ready for `/10x-plan`:** yes, if OpenRouter privacy/config and minimal persistence are resolved.

**S-02 — Deck management for saved cards** (`change-id: deck-management`)
- **Outcome:** Learner sees saved flashcards in a flat deck, can edit front/back, and can delete a saved card.
- **PRD refs:** FR-013, FR-014, FR-015.
- **Why second:** S-01 creates real cards; S-02 gives the learner control after acceptance without bloating candidate review.
- **Prerequisite:** S-01 or at least the Flashcard entity from its enabler.
- **Acceptance criteria:** deck distinguishes AI-generated origin; list remains usable with pagination/search; edit policy does not silently corrupt review state; delete is explicit.

**S-03 — Review session with SRS state** (`change-id: srs-review-session`)
- **Outcome:** Learner starts a review session, rates due cards according to the chosen SRS library, and the system updates review state.
- **PRD refs:** FR-016, FR-017.
- **Why third:** review is necessary for the product promise, but the PRD leaves SRS-library details downstream; planning this before the deck exists would create premature architecture work.
- **Blocking unknown:** chosen SRS library contract, including rating labels and edit-vs-review-state behavior.
- **Possible enabler:** `F-02 srs-library-spike` if the library choice is not already settled by `tech-stack.md` or downstream planning.

**S-04 — Account lifecycle and privacy hardening** (`change-id: account-privacy-lifecycle`)
- **Outcome:** Learner can register/sign in/sign out, client-side caches are cleared on sign-out, and account deletion follows the 30-day retention rule.
- **PRD refs:** FR-001, FR-002, FR-003, FR-005, privacy guardrail.
- **Why not necessarily first:** auth may be a foundation requirement, but full account deletion can wait until core generation/deck flows prove value. Split into an early enabler only if authentication blocks S-01.
- **Acceptance criteria:** user can only see own data; sign-out clears learner-data caches; deletion marks account inactive immediately and later hard-deletes owned data.

### Horizontal Enablers In This Example

Horizontal work is allowed only when it unlocks one of the vertical milestones above:

- `F-01 minimal-persistence-and-auth` -> unlocks S-01 if the project has no account/session/data baseline.
- `F-02 openrouter-privacy-spike` -> unlocks S-01 if provider training/retention config is not confirmed.
- `F-03 srs-library-spike` -> unlocks S-03 because PRD explicitly defers rating labels and review-state contract.
- `F-04 test-harness-for-generation-flow` -> unlocks S-01/S-02 if there is no way to verify draft persistence, atomic finalize, and deck read path.

Anything broader, such as "build the whole database schema", "implement all auth", "create all API endpoints", or "design the entire deck UI", should be shown as a bad horizontal-first decomposition. It delays the first proof that the AI-generated + human-gated loop works.

## Structural Logic Map

**Beat 1 — Bridge in: sprint zero jest domknięty, ale projekt nie jest jeszcze prowadzony**
- **Question answered:** "Skoro mam produkcję i PRD, czemu nie od razu kodować?"
- **Introduces:** M2 jako przejście z setupu środowiska do prowadzenia egzekucji
- **Depends on:** m1-l5 (`infrastructure.md`, `deploy-plan.md`, działający URL)
- **Sets up:** potrzebę roli TPM-a
- **Diagram opportunity:** M1 artifacts -> TPM decision layer -> roadmap/backlog -> implementation workflow
- **Risk:** nie powtarzać deploymentu z m1-l5; produkcja jest punktem startowym, nie tematem

**Beat 2 — Antywzorzec: programista jako prompt dispatcher**
- **Question answered:** "Co jest złego w delegowaniu całego PRD agentowi?"
- **Introduces:** failure mode large ambiguous delegation; agent wykonuje zbyt szeroki cel bez widocznej sekwencji i bez zarządzania ryzykiem
- **Depends on:** prework 3.2 i 1.2
- **Sets up:** zmianę roli z wykonawcy na TPM-a
- **Diagram opportunity:** "PRD -> one giant prompt" kontra "PRD -> roadmap -> backlog -> one planned change"
- **Risk:** nie sugerować, że problemem jest słabość agenta; problemem jest brak sterowania projektem

**Beat 3 — Part 1: Kim jest Technical Project Manager**
- **Question answered:** "W czyje buty mam wejść jako programista pracujący z agentem?"
- **Introduces:** TPM jako osoba, która przekłada cel produktu na techniczną sekwencję pracy
- **Depends on:** Beat 2
- **Sets up:** konkretne obowiązki TPM-a
- **Diagram opportunity:** cztery obszary TPM: goal, sequence, risk, coordination
- **Risk:** nie zrobić ogólnej lekcji o management; wszystko musi wracać do pracy z agentem

**Beat 4 — Co TPM robi w praktyce**
- **Question answered:** "Jak TPM wpływa na projekt dzień po dniu?"
- **Introduces:** priorytetyzacja, dependency management, scope control, risk surfacing, statusy, ownership, decyzje człowieka
- **Depends on:** Beat 3
- **Sets up:** roadmapę jako narzędzie TPM-a
- **Diagram opportunity:** tabela "Developer asks" vs "TPM decides"
- **Risk:** nie opisywać TPM-a jako osoby od spotkań; nacisk na decyzje techniczne i sequencing

**Beat 5 — Dlaczego programista z agentem musi znać skill TPM-a**
- **Question answered:** "Dlaczego to jest moja odpowiedzialność, skoro agent pisze kod?"
- **Introduces:** agent zwiększa throughput, więc błędna sekwencja pracy szybciej produkuje dług, niespójność i pozorny postęp
- **Depends on:** Beat 4
- **Sets up:** potrzebę roadmapy jako kontrolowanej dekompozycji
- **Diagram opportunity:** throughput bez kierunku -> waste; throughput z roadmapą -> controlled execution
- **Risk:** nie demonizować szybkości; chodzi o sterowanie szybkością

**Beat 6 — Part 2: Łańcuch artefaktów przed roadmapą**
- **Question answered:** "Czym właściwie jest roadmapa w tym workflow?"
- **Introduces:** `/10x-shape` zbiera decyzje do `shape-notes.md`; `/10x-prd` generuje produktowy `prd.md` i route'uje braki do `Open Questions`; `10x-tech-stack-selector` czyta PRD i zapisuje `tech-stack.md`; roadmapa dopiero potem mówi w jakiej kolejności budować vertical milestones; backlog operacjonalizuje; `/10x-plan` planuje pojedynczą zmianę
- **Depends on:** Beat 5
- **Sets up:** vertical-first slicing i ograniczone horizontal enablers
- **Diagram opportunity:** `shape-notes.md` -> `prd.md` -> `tech-stack.md` -> `roadmap.md` -> Jira/Linear issue + `change-id` -> `context/changes/<change-id>/plan.md`
- **Risk:** zbyt meta; pokazać od razu, który skill pisze który plik i czego nie wolno mieszać między artefaktami

**Beat 7 — Roadmapowanie solo-dev vs zespół**
- **Question answered:** "Czy ta sama roadmapa działa dla jednej osoby i dla zespołu?"
- **Introduces:** capacity, specjalizacja, ownership, równoległość, komunikacja, dependency bottlenecks
- **Depends on:** Beat 6
- **Sets up:** vertical-first jako domyślną strategię slicing
- **Diagram opportunity:** solo-dev: jedna kolejka zależności; zespół: kilka strumieni z ownership i sync points
- **Risk:** nie wchodzić w pełny proces delivery management

**Beat 8 — Vertical slices jako default**
- **Question answered:** "Dlaczego roadmapa dla agenta powinna domyślnie iść przez działające przepływy użytkownika?"
- **Introduces:** user-visible outcome przechodzący przez UI, API, dane, auth/integracje; szybka walidacja, wcześniejsza integracja, lepsza weryfikowalność pracy agenta i mniej fałszywego postępu; krótki komentarz historyczny, że 10xDevs 1.0/2.0 mogły planować bardziej warstwowo, ale 2026 agentic workflow przesuwa rekomendację w stronę vertical-first
- **Depends on:** Beat 7
- **Sets up:** pytanie, kiedy mimo wszystko potrzebny jest horizontal enabler
- **Diagram opportunity:** przekrój aplikacji przez warstwy
- **Risk:** nie projektować jeszcze architektury slice'a; to należy do m2-l2

**Beat 9 — Horizontal enablers, nie alternatywna roadmapa**
- **Question answered:** "Kiedy krótka praca techniczna przed vertical milestone'em jest uzasadniona?"
- **Introduces:** data model, auth scaffold, test harness, design system primitives, observability, integration spike, migration, permissions; sensowne użycie horizontal work jako enablera
- **Depends on:** Beat 8
- **Sets up:** regułę, że horizontal work musi odblokowywać nazwany vertical milestone
- **Diagram opportunity:** F-01 jako mały enabler -> S-01 jako pierwszy user-visible vertical milestone
- **Risk:** nie wrócić do starego modelu "najpierw cała baza, potem całe API, potem cały UI"; horizontal bez downstream verticala trafia do Parked

**Beat 10 — Decision rule: vertical-first, horizontal only when it unlocks**
- **Question answered:** "Jak zdecydować, czy horizontal work jest potrzebny, czy jest tylko odwlekaniem pierwszego działającego przepływu?"
- **Introduces:** decision rule i trade-off matrix
- **Depends on:** Beat 8 i Beat 9
- **Sets up:** `10x-roadmap` jako narzędzie do sequencing pionowych milestone'ów i wymaganych enablerów
- **Diagram opportunity:** tabela:
  - vertical default: szybki sygnał, integracja wcześnie, lepsza weryfikacja, mniej fałszywego postępu; minusy: czasem wymaga minimalnego fundamentu albo może powielać wzorce zanim się ustabilizują
  - horizontal enabler: redukuje blocking unknowns, tworzy test harness, przygotowuje minimalny scaffold; minusy: późny feedback użytkownika, ryzyko przeinżynierowania, trudniej ocenić realny postęp
- **Risk:** nie dać prostego dogmatu "nigdy horizontal"; właściwa reguła brzmi: vertical-first, horizontal tylko z nazwanym downstream vertical milestone'em

**Beat 11 — `10x-roadmap`: inputy, interview i output**
- **Question answered:** "Jak skill pomaga TPM-owi, zamiast go zastępować?"
- **Introduces:** skill `~/dev/10x-toolkit/packages/ai-artifacts/skills/10x-roadmap`; inputy: `prd.md`, baseline kodu, `tech-stack.md`, `infrastructure.md`, `deploy-plan.md`; interview: goal, north star, capacity, investment areas, blocker. Podkreślić: PRD jest produktem, `tech-stack.md` jest technicznym hand-offem, roadmapa nie wybiera frameworków ani nie pisze implementacyjnego planu.
- **Depends on:** Beat 10
- **Sets up:** czytanie `roadmap.md`
- **Diagram opportunity:** PRD + baseline + TPM interview -> `roadmap.md`
- **Risk:** nie robić samej instrukcji obsługi skilla; skill ma utrwalić mental model

**Beat 12 — Anatomia `roadmap.md`**
- **Question answered:** "Jak czytać roadmapę i wybrać następny milestone?"
- **Introduces:** Vision recap, North star, Baseline, Foundations, Slices, Open Roadmap Questions, Parked, Done; fields: Outcome, PRD refs, Prerequisites, Parallel with, Blockers, Unknowns, Risk, Status
- **Depends on:** Beat 11
- **Sets up:** przełożenie na backlog
- **Diagram opportunity:** mini dependency graph między F-01, S-01, S-02
- **Risk:** nie przeciążyć polami; przejść po jednym konkretnym przykładzie

**Beat 13 — Part 3: Backlog jako shared project memory**
- **Question answered:** "Po co mi Jira / Linear, skoro mam plik `roadmap.md`?"
- **Introduces:** backlog jako operacyjna pamięć projektu: status, owner, dependency, acceptance criteria, decision log, linki do planów i PR-ów
- **Depends on:** Beat 12
- **Sets up:** MCP
- **Diagram opportunity:** `roadmap.md` jako source of strategy; backlog jako source of execution state
- **Risk:** nie sprzedawać toolingu dla samego toolingu; chodzi o wspólny dostęp człowieka i agenta

**Beat 14 — MCP: agent dostaje dostęp do Jiry / Linear**
- **Question answered:** "Jak agent ma pracować z backlogiem, a nie tylko z plikami?"
- **Introduces:** MCP jako standardowy sposób wystawienia narzędzi projektowych agentowi; read operations, create/update issue, comment, change status, link dependency
- **Depends on:** Beat 13
- **Sets up:** zasady bezpieczeństwa i workflow
- **Diagram opportunity:** Agent harness -> MCP server -> Jira/Linear API -> project backlog
- **Risk:** nie wchodzić w wrażliwe tokeny i pełną konfigurację produkcyjną; pokazać mental model i minimalny flow

**Beat 15 — Od roadmapy do issues**
- **Question answered:** "Jak konkretnie zamienić milestone na backlog?"
- **Introduces:** mapowanie:
  - roadmap milestone -> epic/project/milestone
  - slice/foundation -> issue
  - prerequisites/blockers -> dependencies
  - unknowns -> discovery tasks lub blocked issue
  - acceptance criteria -> warunek gotowości do `/10x-plan <change-id>`
  - issue slug -> `change-id`, np. Linear `TEN-14 Create first card flow` -> `first-card-flow`
  - status -> backlog/ready/blocked/in-progress/done
- **Depends on:** Beat 14
- **Sets up:** wybór pierwszego milestone'u i przygotowanie `change-id` do m2-l2
- **Diagram opportunity:** przykład issue z polami: title, acceptance criteria, roadmap link, dependencies, `change-id`
- **Risk:** nie rozpisywać implementacyjnych subtasks; to dopiero następna lekcja

**Beat 16 — Bridge out: pierwszy backlog item + change-id jako wejście do `/10x-plan`**
- **Question answered:** "Co dalej z wybranym milestone'em?"
- **Introduces:** m2-l2 bierze konkretny backlog item / roadmap slice oraz jego `change-id` jako wejście. `/10x-plan <change-id>` tworzy lub używa `context/changes/<change-id>/`, zapisuje `plan.md` i `plan-brief.md`, a po planie naturalnym następnym krokiem jest `/10x-implement <change-id> phase 1`.
- **Depends on:** Beat 15
- **Sets up:** downstream workflow: `/10x-plan`, `/10x-implement`, review
- **Diagram opportunity:** Jira/Linear issue -> `change-id` -> `/10x-plan <change-id>` -> `context/changes/<change-id>/plan.md` + `plan-brief.md` -> `/10x-implement <change-id> phase 1`
- **Risk:** nie zapowiadać zbyt szeroko m2-l4/m2-l3/m2-l5

## Suggested Structure

1. **Wstęp: Produkcja to dopiero start prowadzenia projektu** — most z m1-l5, ustawienie problemu "co budować najpierw?"
   ```text
   Previous beat -> this beat -> next beat:
   Production URL z m1-l5 -> potrzeba sterowania projektem -> wejście w rolę TPM-a.
   Must not introduce yet: szczegóły skilla, MCP, backlog tooling.
   ```

2. **Part 1: Programista jako Technical Project Manager** — kto to jest, co robi i dlaczego agent wymusza tę rolę
   ```text
   Previous beat -> this beat -> next beat:
   "Zbuduj mi apkę" jest zbyt szerokie -> TPM kontroluje cel, sekwencję i ryzyko -> roadmapa jako narzędzie TPM-a.
   Must not introduce yet: pełne pola roadmapy, konfiguracja Jiry/Linear.
   ```

3. **Part 2: Roadmapa MVP i vertical-first slicing** — łańcuch `shape-notes.md` -> `prd.md` -> `tech-stack.md` -> `roadmap.md`, solo-dev vs zespół, horizontal enablers, `10x-roadmap`
   ```text
   Previous beat -> this beat -> next beat:
   TPM potrzebuje sekwencji pracy -> roadmapa opisuje milestone'y i dependencies na bazie PRD oraz tech-stacku -> backlog operacjonalizuje roadmapę przez issues i change-id.
   Must not introduce yet: implementacyjny plan jednego milestone'u.
   ```

4. **Demo: `10x-roadmap` na 10xCards** — inputy, baseline probe, interview, wygenerowany `roadmap.md`
   ```text
   Previous beat -> this beat -> next beat:
   Teoria roadmapowania -> realny output skilla -> mapowanie roadmapy do backlogu.
   Must not introduce yet: kodowanie pierwszego slice'a.
   ```

5. **Part 3: Jira / Linear + MCP jako backlog dla człowieka i agenta** — shared project memory, minimum konfiguracji, zasady bezpiecznego użycia
   ```text
   Previous beat -> this beat -> next beat:
   Roadmapa powstała -> backlog staje się operacyjną pamięcią projektu -> agent może czytać i aktualizować pracę przez MCP, a `change-id` łączy issue z lokalnym `context/changes/<change-id>/`.
   Must not introduce yet: zaawansowana administracja narzędzi i proces Scrum.
   ```

6. **Outro: Pierwszy issue + change-id jako kontrakt dla następnej lekcji** — bridge do m2-l2
   ```text
   Previous beat -> this beat -> next beat:
   Backlog wskazuje następny milestone -> człowiek zatwierdza wybór i change-id -> m2-l2 uruchamia `/10x-plan <change-id>` i planuje architekturę tej zmiany.
   Must not introduce yet: implementacja i wielowątkowa praca agentów.
   ```

## Video Placeholders

- **Video 1 — Z programisty w TPM-a:** Prowadzący pokazuje stan po M1 i antywzorzec "wrzuć PRD do agenta". Następnie wprowadza rolę TPM-a: cel, sekwencja, ryzyko, capacity, dependency management.
- **Video 2 — Vertical-first, horizontal tylko jako enabler:** Prowadzący pokazuje, dlaczego 10xCards powinno iść przez pierwszy działający przepływ użytkownika, a nie przez szeroką warstwę techniczną. Następnie pokazuje jeden krótki foundation/spike, który ma sens tylko dlatego, że odblokowuje pierwszy vertical milestone.
- **Video 3 — Uruchomienie `10x-roadmap`:** Prowadzący pokazuje upstream artifacts (`shape-notes.md`, `prd.md`, `tech-stack.md`, `infrastructure.md`, `deploy-plan.md`), uruchamia `/10x-roadmap` na `context/foundation/prd.md`, komentuje baseline probe i wyjaśnia, które decyzje pochodzą z PRD, a które z `tech-stack.md`. Odpowiada na pytania o goal/north star/capacity/#1 blocker.
- **Video 4 — Roadmapa do backlogu przez MCP:** Prowadzący pokazuje przykładowe połączenie agenta z Linear albo Jira, a potem tworzy lub aktualizuje issues na podstawie `roadmap.md`. Każde issue dostaje acceptance criteria, dependencies, link do `roadmap.md` i proponowany `change-id`.
- **Video 5 — Wybór pierwszego issue do `/10x-plan`:** Prowadzący wskazuje backlog item, który jest ready, ma acceptance criteria i stabilny `change-id`, np. `first-card-flow`. Kończy pokazem komendy `/10x-plan first-card-flow` jako wejścia do m2-l2, bez pisania planu w tej lekcji.

## Bridge In

M1-l5 zamknęło środowisko: projekt jest wdrożony, agent ma kontekst, a decyzje infrastrukturalne są zapisane. M2-l1 zaczyna od tego stanu i mówi: teraz nie chodzi o kolejne narzędzie ani pierwszy losowy feature, tylko o wejście w rolę osoby prowadzącej projekt. Kursant ma już `shape-notes.md`, produktowe `prd.md`, techniczne `tech-stack.md`, produkcję i `deploy-plan.md`, ale potrzebuje roadmapy oraz backlogu, żeby nie stracić kontroli nad zakresem, zależnościami i ryzykiem.

## Bridge Out

Kursant wychodzi z `context/foundation/roadmap.md`, backlogiem w Jira / Linear oraz wybranym pierwszym issue albo milestone'em z konkretnym `change-id`. M2-l2 bierze ten element jako wejście i uruchamia `/10x-plan <change-id>`, które tworzy lub wykorzystuje `context/changes/<change-id>/`, zapisuje `plan.md` i `plan-brief.md`, a dopiero potem przygotowuje wejście do implementacji. Roadmapa i backlog nie zastępują planu implementacji — zawężają problem tak, żeby plan był możliwy.

## Failure Mode To Disarm

Kursant traktuje agenta jak szybszego juniora i oddaje mu całe PRD jednym promptem albo rozpisuje backlog jako luźne taski techniczne bez zależności. Efekt: agent produkuje pozorny postęp, ale projekt nie ma sekwencji, pierwszy działający przepływ pojawia się za późno, ryzyka są ukryte, a człowiek traci zdolność kontroli. Lekcja disarmuje to przez TPM mindset, vertical-first roadmap, ograniczone horizontal enablers oraz backlog dostępny przez MCP.

## Open Questions

### Resolved (from research.md — 2026-05-11)

- ~~Jaki ma być główny bias demo 10xCards?~~ → **Speed** (najostrzejszy kontrast z antywzorcem "zbuduj mi całą apkę"). Source: research.md § Closed Decisions.
- ~~Jeden kanoniczny wariant `roadmap.md` vs kontrastowy horizontal-first?~~ → **Jeden kanoniczny + 2-zdaniowy callout**: "Gdybyś wybrał quality zamiast speed, slice'y 2 i 3 zamieniłyby się miejscami." Source: research.md § Closed Decisions.

### Still Open

- Czy oficjalne demo ma używać Linear czy Jira jako głównego narzędzia backlogowego? Linear będzie prostszy wizualnie, Jira będzie bardziej rozpoznawalna w zespołach enterprise.
- Czy w lekcji pokazujemy realną konfigurację MCP servera, czy tylko koncepcyjny flow plus gotowy przykład połączenia w środowisku prowadzącego?
- Czy backlog ma być tworzony przez agenta automatycznie z `roadmap.md`, czy prowadzący najpierw pokazuje ręczne mapowanie jednego milestone'u, a dopiero potem deleguje resztę agentowi?
- Jaki format `change-id` pokazać w demo: slug niezależny od Jira/Linear (`first-card-flow`) czy powiązany z ticketem (`ten-14-first-card-flow`)?
- Jak szeroko omawiać permissions: czy agent może sam zmieniać statusy issues, czy tylko komentować i proponować zmiany do zatwierdzenia przez człowieka?

## Provisional Schema Proposal

```json
{
  "lessonId": "m2-l1",
  "owns": [
    "technical project manager jako rola programisty pracującego z agentem",
    "roadmapa MVP jako kontrakt między foundation docs, backlogiem i per-change planningiem (`shape-notes.md` -> `prd.md` -> `tech-stack.md` -> `roadmap.md` -> Jira/Linear -> `context/changes/<change-id>/plan.md`)",
    "vertical-first roadmap jako domyślny model pracy z agentami AI",
    "vertical slices jako user-visible milestones przechodzące przez UI, dane, logikę i integracje",
    "horizontal enablers jako krótkie foundation/spike/test-harness work odblokowujące konkretny vertical milestone",
    "zasada no orphan horizontal work: horizontal bez downstream verticala trafia do Parked",
    "roadmapowanie solo-dev vs zespół: capacity, ownership, dependency bottlenecks i równoległość",
    "`10x-roadmap` jako skill dekompozycji i sequencing",
    "`change-id` jako stabilny identyfikator jednej zmiany łączący backlog item z `context/changes/<change-id>/plan.md` i `/10x-implement <change-id> phase 1`",
    "`/10x-plan <change-id>` jako downstream consumer wybranego milestone'u",
    "MCP jako sposób podłączenia agenta do Jira / Linear",
    "backlog projektowy jako shared project memory dla człowieka i agenta"
  ],
  "referencesOnly": [
    "PRD authoring i user stories (m1-l1)",
    "tech-stack selection i skille jako mechanizm proceduralny (m1-l2)",
    "bootstrap repo i Plan Mode (m1-l3)",
    "AGENTS.md / agent onboarding (m1-l4)",
    "`infrastructure.md`, `deploy-plan.md` i production URL z m1-l5",
    "pełna architektura pojedynczego slice'a (m2-l2)",
    "implementacja slice'a, kontrola kontekstu i 80% ready challenge (m2-l4)",
    "review kodu AI (m2-l3)",
    "wielowątkowa praca agentów i równoległe wdrożenia (m2-l5)"
  ],
  "mustNotCover": [
    "szczegółowe projektowanie architektury rozwiązania dla konkretnego milestone'u (m2-l2)",
    "pisanie implementacyjnego planu krok po kroku dla jednego slice'a (`/10x-plan`, m2-l2/m2-l4)",
    "implementowanie kodu albo debugowanie agent-generated code (m2-l4)",
    "code review i QA wygenerowanych zmian (m2-l3)",
    "orkiestracja wielu agentów/worktrees jako główny temat (m2-l5)",
    "pełny tutorial administracyjny Jiry / Linear",
    "zaawansowana konfiguracja MCP serverów i permission modelu",
    "pełny proces Scrum/Kanban, story points, sprint velocity i ceremonie zespołowe"
  ],
  "learningOutcomes": [
    "Kursant wyjaśnia, dlaczego programista pracujący z agentem musi wejść w rolę technical project managera.",
    "Kursant odróżnia `prd.md`, `tech-stack.md`, `roadmap.md`, backlog item i `context/changes/<change-id>/plan.md`.",
    "Kursant opisuje pełny łańcuch artefaktów: `shape-notes.md` -> `prd.md` -> `tech-stack.md` -> `roadmap.md` -> backlog issue -> `context/changes/<change-id>/plan.md`.",
    "Kursant używa `10x-roadmap` do wygenerowania `context/foundation/roadmap.md`.",
    "Kursant wyjaśnia, dlaczego vertical-first jest preferowanym modelem roadmapowania pracy z agentami AI.",
    "Kursant rozpoznaje, kiedy horizontal enabler jest uzasadniony i jak powiązać go z downstream vertical milestone'em.",
    "Kursant przekłada roadmapę na backlog w Jira / Linear, dostępny dla człowieka i agenta przez MCP.",
    "Kursant wybiera pierwszy backlog item i nadaje mu `change-id` jako wejście do `/10x-plan <change-id>`."
  ]
}
```

## Side-Effect Ledger

New claims introduced:
- M2-l1 jest lekcją o wejściu w rolę Technical Project Managera, nie tylko o wygenerowaniu roadmapy.
- Horizontal slicing nie jest równorzędną strategią roadmapowania; może być sensowny tylko jako krótki enabler przy wysokiej technicznej niepewności albo braku infrastruktury weryfikacji.
- Jira / Linear przez MCP są częścią workflow jako shared project memory dla człowieka i agenta.
- Backlog jest operacyjną reprezentacją roadmapy, ale nie zastępuje `roadmap.md` ani `/10x-plan`.
- 10xDevs 3.0 świadomie odchodzi od bardziej horizontalnego planowania znanego z wcześniejszych edycji w stronę vertical-first, bo agenci typu Claude Code i Codex lepiej pracują na małych, weryfikowalnych, end-to-end taskach.
- `change-id` jest dodany jako brakujące ogniwo między backlog itemem a lokalnym folderem `context/changes/<change-id>/`, który konsumuje `/10x-plan`.

Claims changed:
- Poprzednia wersja sugerowała wybór między vertical i horizontal slicing. Nowa wersja ustawia vertical-first jako domyślny model, a horizontal work ogranicza do enablerów.
- Poprzednia wersja kończyła się wyborem milestone'u z `roadmap.md`. Nowa wersja dodaje etap przełożenia roadmapy na backlog projektowy i `change-id` przed m2-l2.

Neighboring lesson references changed:
- m1-l5: nadal bridge-in przez production URL i deployment artifacts.
- m2-l2: teraz otrzymuje nie tylko wybrany slice z roadmapy, ale konkretny Jira/Linear issue i `change-id` jako wejście do `/10x-plan <change-id>`.
- m2-l5: parallel work pozostaje tylko teaserem; zespół i capacity są omawiane na poziomie roadmapy, nie orkiestracji wielu agentów.

Potential duplicates:
- `/10x-plan` może duplikować m2-l2, więc m2-l1 kończy się na wyborze backlog itemu i `change-id`; nie projektuje implementacji ani nie zapisuje `plan.md`.
- MCP może duplikować przyszłe lekcje o narzędziach agentów, więc tutaj zostaje ograniczone do backlogu Jira / Linear.
- Zespół/capacity może wejść w delivery management; trzeba utrzymać fokus na roadmapie i agentic workflow.
- Horizontal enablers mogą zostać odebrane jako furtka do warstwowego waterfallu; trzeba stale wymagać linku do downstream vertical milestone'u.

Unsupported facts / Needs verification before drafting:
- Aktualny, kanoniczny output `10x-roadmap` trzeba sprawdzić bezpośrednio w `~/dev/10x-toolkit/packages/ai-artifacts/skills/10x-roadmap/SKILL.md` przed pisaniem lekcji.
- Dostępne MCP serwery dla Jira / Linear w środowisku demo trzeba potwierdzić przed nagraniem.
- Należy zdecydować, czy schema enrichment ma zostać przeniesiony do `lessons-schema.json`.
