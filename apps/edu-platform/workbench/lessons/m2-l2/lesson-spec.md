# Lesson Spec: m2-l2 — Architektura z Agentami: od roadmapy do pierwszego działającego streamu

## Schema Context

- Course: 10xdevs-3
- Module: 10xDevs Workflow (m2)
- Position: moduleOrder 2 / globalOrder 7
- Depends on: m2-l1 (Plan MVP: milestony, zależności i bezwzględne priorytety)
- Prepares for: m2-l3 (Solo Code Review: weryfikuj kod AI szybko i skutecznie)
- Schema note: `lessons-schema.json` został uzupełniony o groundingSources dla tej lekcji. Pełna synchronizacja pól `owns`/`learningOutcomes` z nowym podziałem l2/l3 nadal wymaga osobnego passu po akceptacji specu.

## Prework Continuity

- Relevant prework lessons: [3.2] Wzorce i antywzorce promptowania, [3.3] Cykl życia wątku i zarządzanie kontekstem, [1.2] Chatbot vs Agent vs Harness, [4.2] Dobry i zły projekt kursowy
- Assumed from prework: prompt jako kontrakt, cykl eksploracja → plan → implementacja → weryfikacja, agent = tool use in harness, MVP jako najmniejszy działający przepływ, context engineering Write/Select/Compress/Isolate
- Deepened here: szablon "implementacja po planie" z preworku staje się konkretnym workflowem na roadmapzie 10xCards; MVP z [4.2] staje się strumieniem `F-01 → S-01 → S-02 → S-03`; context engineering z [3.3] zostaje operacjonalizowany jako praca na artefaktach `roadmap.md`, `change.md`, `plan.md`, `plan-brief.md`, `## Progress`
- Avoid repeating: definicje agenta/harnessu, lista antywzorców promptowania, teoria context engineering, ogólna argumentacja "dlaczego warto planować"

## Lesson Job

Lekcja startuje po m2-l1: kursant ma roadmapę 10xCards z foundationami, slice'ami, statusami, `Unknowns`, `Risk` i streamami. Zamiast uczyć abstrakcyjnej kaskady `frame → research → plan`, lekcja pokazuje pierwszy praktyczny przebieg: wybrać Stream A z roadmapy, zrozumieć big picture całego modułu, a potem poprowadzić CRUD/generation path przez `/10x-plan`, `/10x-plan-review` i `/10x-implement`. Po drodze lekcja nazywa szerszy pattern widoczny w narzędziach typu Cursor/Claude Code/Codex: planowanie jako oddzielny tryb pracy zwiększa kontrolę, przewidywalność i możliwość zatrzymania agenta przed dużą zmianą. Celem nie jest zbudowanie całego produktu w tekście lekcji. Celem jest pokazanie, jak agentowy workflow zamienia roadmapę w działający fragment systemu i jak elastycznie dobierać research/frame tylko wtedy, gdy complexity lub unknowns tego wymagają.

## Thesis

Plan jest domyślnym routerem niepewności po roadmapie i główną powierzchnią kontroli nad agentem. Nie zaczynasz od rytuału `frame + research`; zaczynasz od slice'a i `/10x-plan`, a dopiero complexity, unknowns i ryzyko decydują, czy potrzebujesz dodatkowego researchu albo framingu. W pierwszym streamie 10xCards pokazujemy prostą, pragmatyczną ścieżkę: roadmapa → plan → review → implementacja fazami.

## Learning Outcomes

- Kursant czyta roadmapę 10xCards jako mapę streamów, a nie checklistę do liniowego wykonania: rozpoznaje Stream A (`F-01 → S-01 → S-02 → S-03 / S-04`), Stream B compliance i Stream C deploy.
- Kursant wybiera zakres m2-l2: CRUD/generation path (`F-01`, `S-01`, `S-02`, opcjonalnie checkpoint `S-03`) i rozumie, że m2-l4 przejmuje SRS (`S-04`), a compliance (`S-05`) zostaje świadomie pominięte.
- Kursant uruchamia `/10x-plan` na roadmap itemie i rozumie, że `Unknowns`, `Blockers` i `Risk` są materiałem wejściowym planu, nie osobnym etapem do ręcznego "wyczyszczenia".
- Kursant rozpoznaje planowanie jako szerszy agentowy pattern: tryb planowania, reviewable plan i ewentualny podział architekt/koder zwiększają kontrolę, ale nie są obowiązkowym rytuałem dla każdego taska.
- Kursant stosuje gradację complexity: `none → plan`, `research → plan`, `frame → plan`, `frame + research → plan`, bez traktowania frame/research jako obowiązkowego rytuału.
- Kursant uruchamia `/10x-plan-review` jako lekką bramkę readiness przed kodem i decyduje, czy plan jest wystarczająco dobry do implementacji.
- Kursant uruchamia `/10x-implement` na wybranej fazie i obserwuje verification gate, manual gate, commit ritual oraz `## Progress` jako single source of truth.
- Kursant odróżnia "demo workflowu" od "budowania fiszek e2e w jednej lekcji": część pracy może wydarzyć się w video, a część jako checkpoint/continuation artifact.

## Audience Starting Point

Kursant ma:
- `context/foundation/roadmap.md` po m2-l1
- świadomość, że roadmapa nie jest planem implementacji
- podstawowy model pracy z agentem, promptem-kontraktem i cyklem wątku z preworku
- prawdopodobny instynkt: "wybierzmy wszystko ze Stream A i każmy agentowi budować" albo przeciwny: "przed każdym slice'em muszę zrobić frame i research"

Kursant nie wie jeszcze:
- jak z roadmapy wybrać realistyczny zakres lekcji/pracy
- kiedy `/10x-plan` wystarczy sam, a kiedy warto poprzedzić go `/10x-research` albo `/10x-frame`
- jak `Unknowns` z roadmapy naturalnie przechodzą do pytań planu
- jak wygląda minimalny cykl plan → review → implement na realnym slice'u

## Behavioral Change

Kursant po roadmapie nie odpala mechanicznie całej kaskady narzędzi. Najpierw wybiera stream i slice, ocenia complexity, domyślnie zaczyna od `/10x-plan`, a dopiero potem eskaluje do research/frame, jeśli plan potrzebuje uziemienia albo framing jest podejrzany.

## Owned Concepts

- Roadmap stream selection: wybór Stream A jako głównej ścieżki m2-l2 oraz zapowiedź, że SRS (`S-04`) przechodzi do m2-l4, a compliance (`S-05`) zostaje poza głównym torem.
- Big-picture workflow across m2-l2/m2-l4: m2-l2 = CRUD/generation path, m2-l4 = SRS path, m2-l3 = review wygenerowanego kodu.
- `/10x-plan` jako domyślny router niepewności po roadmapie: `Unknowns`, `Blockers`, `Risk` są inputem planu.
- Change-id jako uchwyt pracy: krótki refresher `/10x-new`, czyli dlaczego roadmap item dostaje własny change folder i jak ten identyfikator przechodzi przez `/10x-plan`, `/10x-plan-review` i `/10x-implement`.
- Plan mode jako pattern kontroli: najpierw reviewable plan i decyzje, potem kod; analogicznie do wbudowanych Plan Mode w narzędziach agentowych, ale realizowane przez trwały artifact `plan.md`.
- Model-role split: architekt/koder albo mocniejszy model do planowania i tańszy/szybszy do wykonania jako opcjonalny wzorzec organizacji pracy, nie wymóg kursu.
- Complexity gradation: `none / research / frame / frame+research` jako decyzja przed planem, nie obowiązkowa sekwencja.
- First vertical execution loop: `/10x-plan → /10x-plan-review → /10x-implement` na `F-01`, `S-01`, `S-02` albo ich wybranym fragmencie.
- `plan.md` i `plan-brief.md` jako kontrakt implementacji: fazy, Intent + Contract per file, Success Criteria, `## Progress`.
- `/10x-plan-review` jako lekka bramka readiness w tym workflowie, bez deep dive w pełną metodologię review.
- `/10x-implement` jako wykonanie fazy: verification gate, manual gate, commit ritual, SHA write-back do Progress.
- Checkpoint-based teaching: lekcja może pokazać część pracy w video, a resztę zostawić jako stan końcowy/checkpoint, bo celem jest workflow, nie kompletna produkcja fiszek.

## References Only

- Szczegółowe tworzenie roadmapy i derisking milestone'ów (m2-l1)
- Pełna mechanika `/10x-frame` i reframing problemu (m2-l2 pokazuje tylko jako escalation path; jeśli wymaga osobnego opisu, powinien być krótki)
- Głębokie codebase research z sub-agentami (pokazywane tylko wtedy, gdy wybrany slice tego wymaga)
- SRS library choice, `ReviewState`, rating scale i review-session UX (m2-l4)
- Pełna implementacyjna dyscyplina context assessment między fazami (m2-l4 może ją rozwinąć, m2-l2 pokazuje tylko pierwszy kontakt)
- Code review wygenerowanego kodu i triage findings (m2-l3)
- Równoległa egzekucja wielu streamów, worktrees i headless agents (m2-l5)
- Test-first development i osobna strategia testów (m3-l1/m3-l2)

## Must Not Cover

- Nie implementować compliance streamu `S-05` w tej lekcji; można wspomnieć, że jest świadomie pominięty.
- Nie robić pełnego deploy line `F-02` jako głównego demo; można pokazać jako równoległy Stream C.
- Nie sugerować, że każdy slice wymaga `/10x-frame` albo `/10x-research`.
- Nie robić szczegółowego wyboru SRS library; to centralny problem m2-l4.
- Nie uczyć code review po implementacji; `/10x-impl-review` należy do m2-l3.
- Nie budować całego 10xCards e2e w jednej lekcji; priorytetem jest workflow i decyzje, nie kompletność produktu.
- Nie powtarzać preworkowych definicji agenta, promptu, harnessu ani ogólnej teorii context engineering.

## Required Example Or Demo

Demo bazuje na roadmapzie `/Users/psmyrdek/dev/10x-Cards-original/10xCardsOriginal/context/foundation/roadmap.md`.

Zakres m2-l2:
- **Big picture:** pokazać Streams A/B/C i ustalić: m2-l2 robi CRUD/generation path, m2-l4 robi SRS, compliance skipujemy.
- **Minimum demo:** `F-01 gate-product-routes` jako mały plan-only foundation oraz `S-01 first-gated-generation` albo `S-02 atomic-save-to-deck` jako główny slice.
- **Checkpoint końcowy:** po lekcji projekt ma mieć zaplanowany i częściowo/całościowo zaimplementowany przepływ umożliwiający zapis kart do decku. `S-03 deck-edit-delete` może być pokazany jako continuation checkpoint, nie pełne live coding.

Rekomendowany przebieg video:
1. Otworzyć roadmapę i zakreślić Stream A oraz przyszły SRS branch.
2. Zrobić 2-3 minutowy refresher change-id: jeśli change folder nie istnieje, `/10x-new <roadmap-item>` tworzy uchwyt pracy; jeśli istnieje po m2-l1, tylko pokazujemy, gdzie leży i jak będzie użyty.
3. Uruchomić `/10x-plan gate-product-routes` jako przykład niskiej complexity bez frame/research.
4. Uruchomić `/10x-plan first-gated-generation` lub `/10x-plan atomic-save-to-deck`, pokazując jak roadmap `Unknowns` przechodzą w pytania planu.
5. Uruchomić `/10x-plan-review` krótko, żeby potwierdzić readiness.
6. Uruchomić `/10x-implement <change-id> phase 1`, pokazać verification/manual gate i `## Progress`.

## Structural Logic Map

**Beat 1 — Roadmapa jako mapa streamów, nie lista zadań**
- Question answered: Co właściwie dostałem po m2-l1 i jak mam to czytać?
- Introduces: Streams A/B/C z 10xCards, north star `S-04`, zależność `S-04` od `S-02`.
- Depends on: m2-l1 roadmap output.
- Sets up: decyzję zakresu m2-l2/m2-l4.
- Diagram opportunity: Mermaid dependency graph `F-01 → S-01 → S-02 → S-03/S-04`, z `F-02` i `S-05` jako boczne strumienie.
- Risk: Powtórzenie m2-l1. Unikać generowania roadmapy; czytamy istniejącą roadmapę jako input.

**Beat 2 — Zakres modułu: l2 CRUD, l3 SRS**
- Question answered: Które elementy roadmapy robimy teraz, a które później?
- Introduces: m2-l2 = `F-01/S-01/S-02` plus opcjonalny `S-03` checkpoint; m2-l4 = `S-04`; `S-05` compliance skip.
- Depends on: Beat 1 stream map.
- Sets up: wybór pierwszego change-id.
- Diagram opportunity: Tabela `Roadmap item → lesson → role`.
- Risk: Sugerowanie, że S-03 jest wymagany dla SRS. Doprecyzować: S-04 zależy od S-02, S-03 jest równoległy.

**Beat 3 — Change-id: uchwyt pracy między roadmapą a planem**
- Question answered: Co dokładnie podaję do `/10x-plan` i dlaczego wszędzie pojawia się `<change-id>`?
- Introduces: `/10x-new` jako krótki refresher z m2-l1: tworzy/nazywa change folder dla roadmap itemu; `change-id` jest stabilnym uchwytem dla planu, review, implementacji i checkpointów.
- Depends on: Beat 2 scope split.
- Sets up: pierwszy `/10x-plan`.
- Diagram opportunity: roadmap item → `/10x-new`/change folder → `plan.md` → `## Progress`.
- Risk: Zrobienie z tego powtórki m2-l1. Trzymać do 2-3 minut: nazwa, lokalizacja, po co, jak przechodzi przez kolejne komendy.

**Beat 4 — Plan jako default i powierzchnia kontroli**
- Question answered: Czy przed planem muszę robić frame i research?
- Introduces: plan jako oddzielny tryb pracy: reviewable artifact przed kodem, kontrola zakresu, możliwość korekty zanim agent dotknie plików. Complexity gradation: none/research/frame/frame+research. Plan pasuje wszędzie; upstream dobieramy do ryzyka.
- Depends on: wybrany stream.
- Sets up: pierwszy `/10x-plan`.
- Diagram opportunity: decision table: clear problem + known code → plan; clear problem + unknown code → research/plan; unclear problem → frame; optional architect/coder split for higher-risk work.
- Risk: Za mocne uproszczenie. Dodać, że `/10x-plan` sam robi research, a osobny `/10x-research` jest tylko wtedy, gdy warto utrwalić głębsze ustalenia.

**Beat 4 — Open Questions jako input do planu**
- Question answered: Co robię z `Unknowns` i `Risk` z roadmapy?
- Introduces: `Unknowns` nie są osobnym pre-workiem; `/10x-plan` rozstrzyga plan-time decisions, eskaluje blockers i może zawęzić research.
- Depends on: Beat 3.
- Sets up: planowanie `F-01`/`S-01`/`S-02`.
- Diagram opportunity: Flow: roadmap fields → `/10x-plan` → questions/decisions/risks in plan.
- Risk: Przerobienie wszystkich Open Questions z roadmapy w tekście. Pokazać tylko te, które dotyczą Stream A.

**Beat 5 — Mały foundation: plan-only na F-01**
- Question answered: Jak wygląda low-complexity item bez research/frame?
- Introduces: `/10x-plan gate-product-routes`, niski koszt, jasny zakres, auth scaffold already present.
- Depends on: Beat 3-4.
- Sets up: kontrast z trudniejszym slice'em.
- Diagram opportunity: none.
- Risk: Za nudne demo. Trzymać krótko: ma pokazać, że `none → plan` jest pełnoprawną ścieżką.

**Beat 6 — Główny slice CRUD/generation: plan z roadmapy**
- Question answered: Jak plan bierze większy slice z unknowns i zamienia go w fazy?
- Introduces: `/10x-plan first-gated-generation` lub `/10x-plan atomic-save-to-deck`; `plan.md`, `plan-brief.md`, complexity questions, Intent + Contract per file.
- Depends on: Beat 5.
- Sets up: review i implementację.
- Diagram opportunity: plan output structure: phases → success criteria → progress.
- Risk: Ucieczka w szczegóły domeny fiszek. Fokus na mechanice planowania i decyzjach, nie na kompletnym projekcie danych.

**Beat 7 — Readiness gate przed kodem**
- Question answered: Skąd wiem, że plan można dać agentowi do implementacji?
- Introduces: `/10x-plan-review` jako szybka bramka: czy plan ma substance, feasibility, powierzchnie kontraktu i poprawny `## Progress`.
- Depends on: Beat 6.
- Sets up: implementację fazy.
- Diagram opportunity: none.
- Risk: Wejście w pełny m2-l3-style review. Trzymać jako pre-code readiness, nie code review.

**Beat 8 — Implementacja jednej fazy**
- Question answered: Jak wygląda pierwsze wykonanie planu?
- Introduces: `/10x-implement <change-id> phase 1`, verification gate, manual gate, touched-file set, commit, Progress SHA.
- Depends on: Beat 7.
- Sets up: checkpoint końcowy.
- Diagram opportunity: phase loop: implement → verify → manual gate → commit → progress.
- Risk: Przejęcie całej m2-l4. Pokazać mechanikę wystarczająco, ale nie robić deep dive w context assessment/drift.

**Beat 9 — Checkpoint zamiast kompletnego e2e**
- Question answered: Co jest sukcesem lekcji, jeśli nie budujemy całych fiszek do końca?
- Introduces: checkpoint artifact: plan/review/implemented phase; S-03 jako optional continuation; SRS bridge do m2-l4.
- Depends on: Beat 8.
- Sets up: m2-l4.
- Diagram opportunity: before/after roadmap: items done/in progress/next.
- Risk: Poczucie niedokończenia. Powiedzieć wprost: celem jest opanowanie workflowu na realnym streamie, nie live-building całego produktu.

## Failure Mode To Disarm

**Rytuał zamiast decyzji:** kursant zakłada, że po roadmapie zawsze musi zrobić `frame + research + plan + review + implement`, niezależnie od complexity. Lekcja rozbraja to przez kontrast `F-01` (plan-only), Stream A slice (plan z ewentualnym research w ramach planu) i przyszły `S-04` (research-backed path w m2-l4). Frame/research są eskalacją, nie opłatą wejściową.

**Overbuilding demo:** kursant albo prowadzący próbuje w jednej lekcji zbudować całe 10xCards. Spec wymusza checkpoint: pokazujemy workflow i wybrany fragment CRUD/generation, a nie kompletne fiszki e2e.

## Suggested Structure

1. **Roadmapa po m2-l1** — odczyt Streams A/B/C i zależności.
   ```text
   m2-l1 roadmap -> this section -> scope split:
   Czytamy roadmapę, nie tworzymy jej ponownie.
   ```

2. **Zakres l2/l3** — l2 CRUD/generation, l3 SRS, compliance skip.
   ```text
   Stream map -> this section -> skill routing:
   Ustala granice lekcji, zanim wejdą narzędzia.
   ```

3. **Change-id primer** — krótki refresher `/10x-new` i change folder.
   ```text
   Scope split -> this section -> skill routing:
   Łączy roadmap item z konkretnym artifactem pracy.
   ```

4. **Skill routing by complexity** — plan jako default, research/frame jako escalation.
   ```text
   Change-id -> this section -> planning demo:
   Najpierw reguła decyzyjna, potem komenda.
   ```

5. **F-01 jako plan-only** — mały foundation bez ceremonii.
   ```text
   Skill routing -> this section -> larger slice:
   Kontrastuje low complexity z większym slice'em.
   ```

6. **S-01/S-02 jako główny slice** — `/10x-plan`, pytania, `plan.md`, `plan-brief.md`.
   ```text
   Foundation -> this section -> readiness:
   Tu powstaje właściwy kontrakt implementacji.
   ```

7. **Plan review przed kodem** — szybka walidacja planu.
   ```text
   Plan -> this section -> implementation:
   Bramka readiness, nie pełna lekcja review.
   ```

8. **Implementacja fazy** — `/10x-implement` i pierwszy commit/progress.
   ```text
   Readiness -> this section -> checkpoint:
   Pokazuje wykonanie, ale nie próbuje domknąć całego produktu.
   ```

9. **Checkpoint i bridge do SRS** — co jest gotowe, co przechodzi do m2-l4.
   ```text
   Implemented phase -> this section -> m2-l4:
   Zamyka lekcję jako workflow, nie jako kompletne 10xCards.
   ```

## Video Placeholders

- **Video 1: Roadmap to CRUD stream** — prowadzący otwiera roadmapę, pokazuje Streams A/B/C, wybiera `F-01 → S-01 → S-02`, oznacza `S-04` jako temat m2-l4 i `S-05` jako pominięty compliance stream.
- **Video 2: Plan-only foundation + larger slice** — `/10x-plan gate-product-routes`, potem `/10x-plan first-gated-generation` albo `/10x-plan atomic-save-to-deck`; komentarz o tym, które roadmap Unknowns wchodzą jako pytania planu.
- **Video 3: Readiness + first implementation phase** — `/10x-plan-review`, następnie `/10x-implement <change-id> phase 1`; pokaz verification/manual gate i `## Progress`.
- **Optional checkpoint artifact** — gotowy stan po lekcji pokazujący, co zostało zaplanowane/zaimplementowane, a co jest kontynuacją (`S-03`) lub tematem m2-l4 (`S-04`).

## Bridge In

Kursant wchodzi z m2-l1 z:
- `context/foundation/roadmap.md`
- rozumieniem statusów `ready/proposed/blocked`, dependency graph, streams i Parked
- świadomością, że roadmapa mówi "co i w jakiej kolejności", ale nie mówi "jak zmienić pliki"

Lekcja zaczyna się od: "Masz roadmapę. Teraz wybieramy pierwszy stream i przepuszczamy go przez workflow, ale nie robimy z każdego slice'a ceremonii."

## Bridge Out

Kursant wychodzi z:
- zrozumieniem, że m2-l2 zrealizowało CRUD/generation path albo jego reprezentatywny checkpoint
- `plan.md`/`plan-brief.md` i przynajmniej jedną fazą implementacji zaktualizowaną w `## Progress`
- jasnym mostem: `S-04 srs-review-session` jest kolejnym streamem i wymaga research-backed planning, bo wybór biblioteki SRS determinuje `ReviewState`, rating scale i edit policy

M2-l3 startuje od SRS branch po `S-02`: mamy karty w decku, teraz trzeba zdecydować, jak system wybiera due cards i zapisuje review state.

## Open Questions

- Który slice jest głównym live demo: `S-01 first-gated-generation` czy `S-02 atomic-save-to-deck`? Rekomendacja: `S-02`, jeśli przed lekcją mamy przygotowany rezultat `S-01`; w przeciwnym razie `S-01`.
- Ile implementacji pokazać live, a ile jako checkpoint? Rekomendacja: live tylko pierwsza faza, reszta jako artifact/checkpoint.
- Czy `S-03 deck-edit-delete` ma być częścią m2-l2 outputu, czy tylko optional continuation? Rekomendacja: optional continuation/checkpoint, bo nie jest prerequisite dla m2-l4.
- Schema sync: zaktualizować `lessons-schema.json` po akceptacji tej wersji specu.

## Side-Effect Ledger

New claims introduced:
- m2-l2 jako pierwszy end-to-end stream, nie tylko lekcja planowania.
- `/10x-plan` jako domyślny router niepewności po roadmapie.
- Change-id jako uchwyt pracy między roadmap itemem a artefaktami `plan.md`/`## Progress`, z krótkim refresherem `/10x-new`.
- Planowanie jako szerszy pattern kontroli agentów: reviewable plan przed kodem, podobny do wbudowanych Plan Mode.
- Architekt/koder albo mocniejszy model do planowania jako opcjonalny model-role split, nie wymóg workflowu.
- Gradacja `none / research / frame / frame+research` jako decyzja przed planem.
- `F-01 → S-01 → S-02` jako minimum m2-l2, `S-03` jako optional checkpoint, `S-04` jako m2-l4.
- Compliance `S-05` świadomie skipowane w głównym torze.

Claims removed:
- Pełna kaskada `frame.md → research.md → plan.md` jako centralna struktura lekcji.
- Obowiązkowe demo `/10x-frame` w m2-l2.
- Założenie, że m2-l2 kończy się wyłącznie `plan.md` bez implementacji.

Neighboring lesson references changed:
- m2-l1: bridge in pozostaje roadmapą, ale m2-l2 czyta ją jako mapę streamów.
- m2-l4: bridge out zmienia się z "implementuj plan z m2-l2" na "zastosuj workflow do SRS branch z research-backed planning".
- m2-l3: nadal przejmuje review wygenerowanego kodu, nie pre-code plan review.

Prework references used:
- [3.2] prompt jako kontrakt i implementacja po planie.
- [3.3] cykl wątku i context engineering jako tło dla artifact-driven workflow.
- [1.2] agent w harnessie jako wykonawca celów z granicami.
- [4.2] MVP jako pierwszy działający przepływ.

Prework concepts repeated intentionally:
- MVP/first path tylko jako most do roadmap Stream A, bez ponownej lekcji o wyborze projektu.

Potential duplicates:
- `/10x-plan-review` i `/10x-implement` mogą zahaczyć o m2-l4. Granica: m2-l2 pokazuje je jako pierwszy minimalny loop; m2-l4 pogłębia je na trudniejszym SRS streamie.
- Skill routing może zahaczyć o dawną wersję m2-l2. Nowy spec trzyma się elastyczności, nie kaskady.

Unsupported facts:
- Dokładny stan checkpointu po video zależy od nagrania/demo repo.

Video/text mismatches:
- Ryzyko: video może zaimplementować więcej niż spec obiecuje. Jeśli tak, tekst musi jasno nazwać część jako optional continuation.

Needs human decision:
- Potwierdzić główny slice demo (`S-01` vs `S-02`).
- Potwierdzić zakres `S-03`.
- Po akceptacji zaktualizować `lessons-schema.json`.
