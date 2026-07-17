# Lesson Spec: m1-l3 — AI-Powered Bootstrap: boilerplate i bezpieczna praca z Agentem

## Schema Context

- Course: 10xdevs-3
- Module: m1 — *Agentic Environment*
- Position: moduleOrder 3 / globalOrder 3
- Depends on: m1-l2 — *Od chatbota do Agenta: tech stack, skille i metaprompting*
- Prepares for: m1-l4 — *Agent Onboarding: Agents.md, AI Rules i feedback loops*

## Prework Continuity

- **Relevant prework:** [1.2] *Chatbot vs Agent vs Harness*, [2.2] *Cursor — podstawy operacyjne*, [2.3] *Claude Code — podstawy operacyjne*, [3.2] *Wzorce i antywzorce promptowania*, [4.2] *Dobry i zły projekt kursowy*.
- **Assumed from prework:** harness jako warstwa kontroli (narzędzia, sandboxing, kontekst, diffy, zgody); kategorie uprawnień (pliki / komendy / sieć / dane spoza projektu); prompt jako kontrakt z agentem; prawo do przerwania; pojęcie skilla i AGENTS.md jako file-on-disk.
- **Deepened here:** przejście od *świadomości* harnessu i uprawnień do *operacyjnej polityki* — co kursant faktycznie ustawia w settings.json (lub odpowiedniku), kiedy agent realnie pisze, woła CLI i auduje system.
- **Avoid repeating:** definicje agenta/harnessu, definicje skilla, listę kategorii uprawnień jako encyklopedyczne wyliczenie, mechanikę `/10x-tech-stack-selector` i logikę wyboru stacka.

## Lesson Job

To pierwsza lekcja głównego programu, w której agent przestaje rozmawiać i zaczyna **pisać na dysku kursanta**. Po m1-l1 (PRD jako kontrakt) i m1-l2 (skille, metaprompting, `tech-stack.md` lub `stack-assessment.md` jako hand-off) na dysku leżą artefakty kontekstowe, a kursant ma domknąć łańcuch do końca: greenfield przez `/10x-bootstrapper`, brownfield przez `/10x-health-check`. Lekcja ma:

1. Pokazać, że łańcuch działa jako jeden ciągły przepływ produkcyjny — od pomysłu do scaffoldowanego projektu z `verification.md` na dysku (greenfield) lub audytowanego projektu z `health-check.md` (brownfield).
2. Wprowadzić wzorzec *deleguj do autorytatywnego CLI zanim wygenerujesz z głowy* jako uniwersalną regułę, której bootstrapper jest instancją.
3. Operacjonalizować *staying in the loop without choking on prompts* — minimalną politykę uprawnień zamiast wyboru między "approve każdego kroku" a "YOLO mode".

Po lekcji kursant ma scaffoldowane repo (greenfield) lub health-checked projekt z priorytetyzowanymi fixami (brownfield), działającą politykę uprawnień i język opisu egzekucji agenta jako trzech bramek (pre / in / post), do którego m1-l4 dorzuci context engineering (AGENTS.md, custom instructions, inner loop). Obie ścieżki zbiegają się w m1-l4 z równoważnym kontekstem.

## Thesis

*Bootstrap (greenfield) lub health-check (brownfield) to pierwsza realna egzekucja agenta na Twoim systemie. Niezależnie od ścieżki — łańcuch shape → prd → tech-stack-selector → bootstrapper albo shape → prd → stack-assess → health-check — agent deleguje do autorytatywnych CLI lub audytuje istniejący projekt jako potok plikowy. Ty trzymasz w garści to jedno: politykę uprawnień, która pozwala Ci być w pętli bez tonięcia w promptach.*

## Learning Outcomes

- Kursant uruchamia łańcuch `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper` na własnym projekcie i otrzymuje scaffoldowane repo plus `context/changes/bootstrap-verification/verification.md` przed wejściem w m1-l4.
- Kursant rozpoznaje moment, w którym agent powinien **zdelegować** zadanie do autorytatywnego CLI zamiast generować boilerplate, i potrafi nazwać tę regułę dla scenariusza spoza bootstrappera (np. „chcę dodać Dockerfile", „chcę nowy generator komponentów", „chcę nową migrację").
- Kursant konfiguruje minimalną politykę uprawnień w swoim harnessie (Claude Code `settings.json` z `permissions.allow` / `permissions.deny`, lub odpowiednik w Codex/Cursor) i potrafi uzasadnić każdy wpis filtrem *co ten wzorzec może popsuć poza moim repo*.
- Kursant czyta zachowanie agenta podczas egzekucji jako trzy bramki — pre-execution (np. recency check, hand-off precondition), in-execution (conflict-safe scaffold, permission prompts), post-execution (`npm audit`, `verification.md`) — i wie, w której bramce zaufać wbudowanej kontroli, a w której dorzucić własną.
- Kursant potrafi uruchomić `/10x-health-check` na istniejącym projekcie i zinterpretować raport: stan zależności, pokrycie testami, konfiguracja CI/CD i gotowość projektu do pracy z agentem — i rozumie, że health-check mapuje te same trzy bramki egzekucji (pre/in/post) co bootstrapper, ale na audyt istniejącego projektu, nie na scaffold nowego.

## Audience Starting Point

Kursant po m1-l2 myśli o agencie głównie jako o "tym, który gada i czasem pisze kod w pliku, jeśli go dopuścisz". Wie, że istnieją skille i hand-offy plikowe, widział `tech-stack.md`. Boi się dwóch rzeczy: (a) że agent zepsuje coś poza projektem, więc instynkt mówi *zatwierdzaj wszystko ręcznie*; (b) że jeśli zacznie wszystko zatwierdzać, workflow stanie się nie do utrzymania, więc instynkt drugi: *włącz YOLO mode, niech leci*. Z preworku 2.3 zna kategorie uprawnień, ale nie ma żadnego konkretu, jak ułożyć politykę. Zna PRD, ale nie zna jeszcze uczucia *agent właśnie wykonuje komendę na moim dysku*.

## Behavioral Change

Po lekcji kursant uruchamia łańcuch na własnym projekcie kursowym — bootstrapper (greenfield) lub health-check (brownfield) — ma w swoim harnessie zapisaną imienną politykę uprawnień (np. `permissions.allow: ["Bash(npm:*)", "Bash(git:*)", "Read", "Edit", "Write"]` + `deny` na destrukcyjne wzorce), i przed kolejnym promptem pyta *czy istnieje CLI, do którego mogę to zdelegować* zanim każe agentowi pisać boilerplate od zera.

## Owned Concepts

- Łańcuch `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper` jako pierwsza realna, plikowa egzekucja agenta w głównym programie.
- Wzorzec *deleguj do autorytatywnego CLI zanim wygenerujesz* — uniwersalna reguła wyboru narzędzi, dla której bootstrapper jest instancją.
- Trzy bramki egzekucji agenta: **pre-execution** (recency, hand-off precondition, dry-run), **in-execution** (conflict-safe scaffold, permission prompts harnessu), **post-execution** (audit, verification log).
- Minimalna polityka uprawnień w harnessie: jawny allowlist zaufanych komend + deny dla wzorców niebezpiecznych — jako trzecia droga między "approve każdego kroku" a "YOLO mode". Demo w Claude Code (`settings.json`, `permissions.allow`/`deny`); wzorzec portable do pozostałych harnessów wspieranych przez kurs.
- YOLO mode jako **świadoma decyzja z warunkami brzegowymi**, nie default kursowy: kiedy może być uzasadniony (kontekst kod-only, brak dostępu do produkcji, brak MCP-prod, komfort z AI po stronie operatora), a kiedy jest ucieczką od dyskomfortu z agentem.
- Polityka uprawnień jako **kontrola probabilistyczna, nie absolutna**: agent potrafi obejść własny denylist/sandbox, żeby zrealizować zadanie (udokumentowane przypadki — rzadkie, ale realne). Stąd defense in depth: polityka + git + brak dostępu do prod-data + CLAUDE.md z twardymi regułami, nie pojedyncza warstwa.
- Tool surface kursanta po m1-l3: built-in harness tools (Read/Write/Bash/Edit), system CLIs (npm, gh, git, starter CLIs), MCP **named only** jako trzecia kategoria z forward reference do m1-l5.
- Filtr decyzyjny *co ten wzorzec może popsuć poza moim repo* jako narzędzie ważenia uprawnień.
- `/10x-health-check` jako brownfield odpowiednik bootstrappera: trzy bramki egzekucji mapowane na audyt istniejącego projektu — pre-check (dependency audit, lockfile, security scan), in-check (test runner detection, CI/CD evaluation, missing configuration), post-check (agent-readiness verdict + priorytetyzowane fixy). Opcjonalnie czyta `stack-assessment.md` z `/10x-stack-assess` i linkuje findings do quality-gate gaps. Wynik: `context/foundation/health-check.md`.

## References Only

- PRD jako kontrakt (m1-l1)
- mechanika decyzyjna `/10x-tech-stack-selector` (m1-l2)
- skille jako format, metaprompting (m1-l2)
- harness jako warstwa kontroli (prework 1.2)
- kategorie uprawnień plików / komend / sieci / danych spoza projektu (prework 2.3)
- prompt jako kontrakt agentowy (prework 3.2)
- AGENTS.md / CLAUDE.md / custom instructions (m1-l4)
- inner loop, formatter, hooks, auto-memory (m1-l4)
- MCP jako warstwa stosu agentowego (m1-l5)
- CI/CD i deployment (m1-l5)

## Must Not Cover

- generowanie i audyt AGENTS.md / CLAUDE.md (m1-l4)
- konfiguracja hooks, formatter, inner loop (m1-l4)
- MCP setup, MCP serwery, porównanie skill-vs-MCP (m1-l5; w m1-l3 tylko jednoakapitowa wzmianka jako kategoria)
- konfiguracja CI/CD pipeline (m1-l5)
- mechanika i logika wyboru tech-stacku (m1-l2)
- PRD authoring (m1-l1)
- benchmark i wybór modeli (prework 3.5)
- implementacja własnego CLI / własnego skilla (m1-l2 + późniejsze moduły)
- pogłębione audyty bezpieczeństwa kodu (poza interpretacją output `npm audit` jako sygnału)

## Required Example Or Demo

**Live walkthrough łańcucha na realnym projekcie kursowym** (10xCards lub równoważny świeży projekt; finalna decyzja w Open Questions). Wymagana mechanika demo:

- Start z `prd.md` i `tech-stack.md` widocznymi na dysku — kursant widzi, że PRD i hand-off to nie abstrakcja, tylko dwa pliki.
- Trigger `/10x-bootstrapper` i pokazanie kolejnych bramek tak, jak je widzi kursant w terminalu/IDE: confirm-or-correct hand-off → recency check → faktyczne wywołanie `npm create <starter>@latest` (delegacja do CLI in action) → conflict-safe scaffold + obsługa `.scaffold` siblings → `npm audit` → zapis `verification.md`.
- W tle: surfacowanie permission promptów harnessu w trakcie biegu (Bash, Write, ewentualnie network). Każdy prompt skomentowany — *co harness chce zrobić, dlaczego nie auto-allow, jaką regułą można to oswoić następnym razem*.
- Po biegu: 5-minutowa edycja polityki uprawnień w Claude Code (`settings.json`, `permissions.allow`/`deny`) — policy, która jutro pozwoli temu samemu łańcuchowi przejść bez nadmiaru promptów, ale nie wprowadzi YOLO mode. Każdy wpis wytłumaczony filtrem *co ten wzorzec może popsuć poza moim repo*. Wzorzec polityki nazywany na poziomie ogólnym, żeby kursant przeniósł go do swojego harnessu.
- Krótka autorska wstawka prowadzącego (≤ 60 s): praktyka YOLO mode bez sandboxu od września 2025 — kontekst kod-only, brak dostępu do produkcji, brak MCP-prod, jeden zażegnany incydent z lokalną bazą dzięki regule w `CLAUDE.md`. Nie jako rekomendacja dla kursanta — jako ilustracja, że YOLO jest świadomą decyzją z warunkami brzegowymi i wymaga komfortu z AI, którego kursant w m1-l3 jeszcze nie ma. Default kursowy to stan pośredni z polityką.

Demo musi być **portable poza toolkit** — przy każdym beat'cie nazywany jest *wzorzec ogólny* (delegacja, pre-exec gate, conflict policy, post-exec audit), a `/10x-bootstrapper` jest jego konkretną instancją. Kursant w swoim harnessie czyta ten sam wzorzec.

## Structural Logic Map

Mapa dotyczy `## Core`. Reszta sekcji (Wstęp, Deep Dive, Materiały Dodatkowe) ma własne, krótkie kontrakty w *Suggested Structure*.

| # | Beat | Question answered | Introduces | Depends on | Sets up | Risk |
|---|------|-------------------|------------|------------|---------|------|
| 1 | Stan z poprzednich lekcji: `prd.md` i `tech-stack.md` leżą na dysku, ale projekt jeszcze nie istnieje. | „Co właściwie mam, a czego mi brakuje?" | Łańcuch jako *plikowy potok*: każdy krok czyta plik i pisze plik. | m1-l1 PRD, m1-l2 hand-off. | Trigger bootstrappera. | Recap m1-l1/m1-l2 zamiast re-teaching. |
| 2 | Trigger `/10x-bootstrapper`. Hand-off jako *prekondycja*, nie *fallback*. | „Co bootstrapper bierze na wejściu?" | Hand-off precondition jako pierwsza bramka pre-exec. | Beat 1. | Delegacja do CLI. | Pokusa, by opisywać Step 0 / Step 1 z SKILL.md po nazwie — używać plain language. |
| 3 | Bootstrapper woła `npm create <starter>@latest` zamiast generować Astro z głowy. | „Dlaczego agent w ogóle nie próbuje tego napisać sam?" | Wzorzec *deleguj do autorytatywnego CLI zanim wygenerujesz*. | Beat 2. | Trzy bramki + uprawnienia. | Brzmi banalnie, jeśli nie zostanie skontrastowane z neutralnym promptem `stwórz mi projekt Astro`. |
| 4 | Trzy bramki egzekucji jako rama mentalna. | „Skąd wiem, że agent się nie rozjedzie?" | Pre / in / post jako uniwersalny szkielet każdej egzekucji. | Beat 3. | Permission policy jako wzmocnienie bramki "in". | Wprowadzenie ramy *przed* obejrzeniem przykładów = abstrakcja bez kotwicy. **Rama wchodzi po Beat 3, nie przed.** |
| 5 | Permission prompts harnessu w trakcie biegu. | „Co harness chce ode mnie, gdy agent wykonuje?" | Mechanika in-exec gate jako interakcja kursant–harness. | Beat 4. | Policy edit. | Tool-specific drift; anchor w Claude Code, wzorzec nazwany ogólnie — bez enumerowania pozostałych harnessów (zakres kursowy, nie lekcyjny). |
| 6 | Edycja polityki + nazwanie YOLO jako świadomej decyzji z warunkami + przyznanie, że polityka jest kontrolą probabilistyczną. | „Jak nie tonąć w promptach, zostać w pętli, i kiedy YOLO jest OK?" | Filtr *co ten wzorzec może popsuć poza moim repo*; *świadome YOLO* (kod-only, bez prod, bez MCP-prod) odróżnione od *reflexive YOLO* (frustracja + dostęp do produkcji); polityka jako *raise the cost of mistakes*, nie absolutna gwarancja — udokumentowane obejścia denylistu/sandboxa. | Beat 5. | Mental model dla codziennej pracy + defense in depth. | (a) Drift do AGENTS.md / custom instructions — to m1-l4. Tu uprawnienia, nie reguły. (b) Drift do "rekomenduję YOLO" — autorska anegdota jest ilustracją warunków, nie zaproszeniem dla kursanta. (c) Drift do "polityka = bezpiecznie": jedno krótkie zdanie o probabilistyce, żeby kursant nie przesadził w drugą stronę i nie podłączył agenta do prod-data tylko dlatego, że ma allowlist. |
| 7 | `verification.md` jako post-exec audit. | „Co dostaję na wyjściu poza scaffoldem?" | Post-exec gate; raport agenta jako input, nie szum. | Beat 6. | Tool surface i bridge do m1-l4. | Risk drift do "jak czytać raport bezpieczeństwa" — zostawiamy wysokopoziomowo: status + co to oznacza dla kolejnych decyzji. |
| 8 | Tool surface po m1-l3 (built-in / CLI / MCP). | „Czego jeszcze nie widziałem?" | MCP nazwany jako kategoria; forward reference do m1-l5. | Beat 7. | Bridge out. | Pokusa porównań skill-vs-MCP — STOP, m1-l5. |

Każdy beat ma maksymalnie jedną nową abstrakcję. Wzorce ogólne (delegacja, bramki, polityka) są nazywane *przed* tym, jak bootstrapper je instancjuje, ale tylko jeden beat wcześniej — żadnych dużych skoków poziomu.

**Brownfield beat (po Beat 7, przed Beat 8)**: `/10x-health-check` jako brownfield odpowiednik bootstrappera. Trzy bramki egzekucji mapowane na audyt: pre-check (dependency audit, lockfile, security), in-check (test runner, CI/CD, konfiguracja), post-check (agent-readiness verdict). Sekcja nie wprowadza nowej abstrakcji — reużywa ramę trzech bramek. Greenfield narrative (Beats 1–7) jest osią lekcji; brownfield sekcja jest paralelną ścieżką, nie zamiennikiem.

## Failure Mode To Disarm

Kursant po lekcji wpada w jeden z trzech trybów:

- **Approve-everything Stockholm.** Każdy permission prompt potwierdza ręcznie, bo „nie wiem, czy to bezpieczne", zniekształca workflow w wielogodzinną mękę i porzuca agentyczne narzędzia po dwóch dniach.
- **YOLO mode bez warunków brzegowych.** Wszystko w `permissions.allow: ["Bash(*)"]` po pierwszym frustrującym ranku, agent dostaje też dostęp do produkcyjnych integracji przez MCP, dziewięć dni później `rm -rf` w niewłaściwym katalogu lub niezamierzona migracja w prod-bazie wyciera dane. Jest jakościowo *inne* od *świadomego YOLO* (kontekst kod-only, brak prod-data, brak MCP-prod, akceptacja ryzyka, komfort z AI po stronie operatora) — to drugie jest możliwe i autor kursu pracuje tak od września 2025 r., ale wymaga warunków, których kursant w m1-l3 jeszcze nie spełnia. Default kursowy to *stan pośredni* z polityką, nie YOLO.
- **AI scaffolds from scratch.** Pomija łańcuch, prosi agenta *po prostu stwórz mi projekt Astro z auth*, dostaje pół-działający boilerplate, traci dwa dni na łatanie tego, co `npm create astro` zrobił poprawnie w 30 sekund.

Czwarty tryb awaryjny (brownfield-specific):

- **Brownfield-as-greenfield.** Kursant z istniejącym projektem uruchamia bootstrappera zamiast health-checka — scaffold konfliktuje z istniejącym kodem, kursant traci czas na rozwiązywanie kolizji zamiast audytować to, co ma. Źródło: brak świadomości, że istnieje ścieżka brownfield, lub odruch "zacznijmy od zera". Antidotum: jeśli projekt istnieje, `/10x-health-check` to właściwy punkt wejścia — bootstrapper jest dla pustego katalogu.

Lekcja musi nazwać każdy z tych trybów wprost, pokazać dlaczego są naturalnym defaultem (lęk vs. wygoda vs. iluzja kompetencji modelu, a w brownfield — odruch "zacznijmy od zera") i dać kursantowi konkretną alternatywę: *delegacja + minimalna polityka uprawnień + filtr "co to może popsuć poza moim repo"*.

## Suggested Structure

1. **Wstęp** — gdzie kursant stoi po m1-l2; obietnica lekcji: agent dziś po raz pierwszy realnie pisze.

   ```
   m1-l2 (skille + tech-stack na dysku) -> Wstęp -> Core beat 1
   Pozycjonujemy lekcję jako moment przejścia z planowania do egzekucji; nie wprowadzamy nowych pojęć poza zapowiedzią trzech bramek.
   ```

2. **Core** — beats 1–8 z mapy powyżej + brownfield beat po Beat 7 (health-check jako audyt istniejącego projektu z mapowaniem trzech bramek).

   ```
   Wstęp -> Core (beat 1..8 + brownfield beat) -> Deep Dive
   Core nie wprowadza AGENTS.md, hooków, MCP-deep-dive ani CI/CD. Każdy beat ma jedną nową abstrakcję; demo bootstrappera jest osią, brownfield beat reużywa ramę trzech bramek bez nowej abstrakcji. Wzorce nazwane niezależnie.
   ```

3. **Deep Dive** — co się dzieje, gdy delegacja zawodzi (CLI failure HARD-STOP, conflict matrix w bootstrapperze, decyzja kursanta o akceptacji lub rollbacku); dwa anti-patterns z OneTab po groundingu (np. zbyt szeroki allowlist, zbyt wąski deny); krótkie spojrzenie na trzy tryby z *Failure Mode To Disarm*; krótka autorska anegdota *YOLO mode od września 2025* (kod-only, bez prod, bez MCP-prod) jako ilustracja, że YOLO jest świadomym wyborem z warunkami, a nie defaultem dla początkującego operatora; jeden akapit o **limitach polityki**: agent potrafi obejść denylist/sandbox, żeby dowieźć zadanie — rzadkie, ale udokumentowane (np. case "Claude Code escapes its own denylist and sandbox", ona.com) — stąd defense in depth, a nie zaufanie do jednej warstwy.

   ```
   Core (beat 8) -> Deep Dive -> Materiały
   Deep Dive odpowiada na "co, jeśli to zawiedzie", nie na "jak zbudować własny bootstrapper". Forward reference: m1-l4 onboarduje agenta na tym scaffoldzie, m1-l5 dorzuca MCP/CI/CD.
   ```

4. **Materiały Dodatkowe** — link do bootstrappera (po groundingu), Anthropic *Building effective agents* (sekcja o guardrails), Claude Code permissions docs, OneTab po triage'u w fazie grounding, jeden link do Codex/Cursor permissions jako odpowiednik.

   ```
   Deep Dive -> Materiały
   Tylko źródła, które kursant ma realnie otworzyć w pracy nad swoim projektem; nie kompendium.
   ```

## Video Placeholders

- Otwarcie prowadzącego: krótka rama *to lekcja, w której agent po raz pierwszy realnie pisze na Twoim dysku*; przypomnienie, że PRD i `tech-stack.md` to artefakty z poprzednich lekcji.
- Live demo całego łańcucha — ekran z terminalem i edytorem; widoczny moment delegacji (`npm create <starter>@latest` jako wywołanie inne niż "agent generuje plik").
- Wstawka: trzy permission prompty harnessu (Claude Code) — co dokładnie kursant widzi i jak prowadzący na to reaguje (allow once / allow always w sesji / odmowa).
- Edycja `settings.json` po biegu — pokaz minimalnej polityki uprawnień w Claude Code, każdy wpis komentowany filtrem *co to może popsuć poza moim repo*. Wzorzec nazwany ogólnie; portability zostawiamy w jednym zdaniu.
- Autorska wstawka prowadzącego (≤ 60 s): „U mnie YOLO mode od września 2025, bez sandboxu — i nic się nie wydarzyło poza jednym incydentem z lokalną bazą, którego CLAUDE.md uniknął. Kontekst: brak prod-data, brak MCP-prod. Dla Was na tym etapie kursu polityka pośrednia jest lepsza."
- Krótki mismatch demo: prompt *stwórz mi projekt Astro z auth* (agent generuje pół-działający boilerplate) vs. łańcuch (działa). Kontrast jako 30-sekundowa wstawka, nie pełny equivalent dema.
- Zamknięcie prowadzącego: bridge do m1-l4 — *projekt jest na dysku, ale agent nie zna jeszcze Twoich konwencji*.

## Bridge In

Z m1-l2: kursant greenfield ma `prd.md` (od m1-l1) i `tech-stack.md` (od `/10x-tech-stack-selector`). Kursant brownfield ma `prd.md` i `stack-assessment.md` (od `/10x-stack-assess`). Obie grupy wiedzą, czym jest skill jako format i hand-off plikowy. Z preworku 1.2 i 2.3 mają wstępny model harnessu i kategorii uprawnień. Wstęp m1-l3 podnosi to wszystko jednym zdaniem i przechodzi do *moment, w którym agent realnie pisze (greenfield) lub audytuje (brownfield)*.

## Bridge Out

Po m1-l3 kursant greenfield ma scaffolded repo z `verification.md`; kursant brownfield ma health-checked projekt z `health-check.md` i priorytetyzowaną listą fixów. Obie grupy mają działającą politykę uprawnień i język egzekucji jako trzech bramek. m1-l4 zaczyna od *projekt jest na dysku, ale agent nie zna jeszcze Twoich konwencji* — i instaluje na tym fundamencie hierarchię instrukcji (AGENTS.md/CLAUDE.md), custom instructions, inner loop i auto-memory. m1-l3 świadomie zostawia projekt "głuchy" — to scena dla onboardingu w m1-l4. Obie ścieżki zbiegają się w m1-l4 z równoważnym kontekstem.

## Open Questions

- **Schema enrichment** dla m1-l3 zarejestrowane jako propozycja — `owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes` zaproponowane w sesji spec (treść w sekcjach powyżej). Czeka na decyzję, czy zapisać do `lessons-schema.json` przed groundingiem, czy po. Decyzja: Po groundingu.
- **Czy dodać `lesson-grounding` do `requiredArtifacts` m1-l3?** Obecnie nie figuruje. Rekomendacja: dodać. Lekcja opiera się na konkretnych claimach o uprawnieniach, tool-use i delegacji; bez sources to drift. (W m1-l4 jest wymagane; m1-l3 powinno być takie samo.) Decyzja: Dodać.
- **Materiał z OneTab** (https://www.one-tab.com/page/xCcANVWTQH22Dap5jKTutA) — do triage'u w fazie `/lesson-grounding`. Zakładam: część artykułów dotyczy permission models, część delegation patterns; po pobraniu mapujemy na Beat 3, Beat 5, Beat 6. Decyzja: przeanalizuj podczas groundingu.
- **Limit polityki jako probabilistycznej**: artykuł "How Claude Code escapes its own denylist and sandbox" (https://ona.com/stories/how-claude-code-escapes-its-own-denylist-and-sandbox) — primary source dla claimu w Beat 6 i Deep Dive. Do weryfikacji w fazie grounding (sprawdzić aktualność, czy Anthropic zaadresował, jak konkretnie wygląda obejście). Decyzja: czy zacytować literalnie w drafcie, czy parafrazować jako "udokumentowany przypadek".
- **Demo na 10xCards czy świeży projekt ad-hoc?** 10xCards ma już `prd.md` i `tech-stack.md` od m1-l2 (groundingSources), więc demo jest reprodukowalne. Świeży projekt jest dydaktycznie czystszy, ale kosztuje czas pracy prowadzącego. Decyzja: Zrobić na 10xCards (jest już `prd.md` i `tech-stack.md` od m1-l2).
- ~~**Domyślny harness w sekcji uprawnień**~~ — RESOLVED 2026-05-05: anchor w Claude Code, wzorzec nazwany ogólnie. Lista wspieranych narzędzi to zakres kursowy, nie lekcyjny — m1-l3 nie enumeruje pozostałych. Decyzja: musimy dać linki do dokumentacji dla pozostałych narzędzi.
- **Waga autorskiej anegdoty YOLO**: rekomendowana 60-sekundowa wstawka video + jeden akapit w Deep Dive (default), vs. cały segment Deep Dive, vs. tylko wzmianka w tekście. Decyzja po pierwszym przebiegu draftu.
- **Nazewnictwo trzech bramek**: `pre-execution / in-execution / post-execution` (wersja techniczna, analogiczna do prework 3.3) vs. `przed / w trakcie / po` (lżej, ale traci nazwę-koncept). Rekomendacja: anglojęzyczne nazwy w nagłówkach, polskie tłumaczenie w pierwszym zdaniu sekcji.
- **Czy zachować w lekcji wzmiankę o `npm audit` jako konkretnym narzędziu post-exec**, czy zostawić abstrakcyjnie? Konkret jest demo-friendly, ale wiąże lekcję z ekosystemem JS. Rekomendacja: konkret w demo, abstrakcja w nazwaniu wzorca. Decyzja: konkret w demo, abstrakcja w nazwaniu wzorca.

## Side-Effect Ledger

```
New claims introduced:
- Łańcuch shape → prd → tech-stack-selector → bootstrapper jako pierwsza realna,
  plikowa egzekucja agenta na systemie kursanta (claim porządkujący — wymaga
  wzmocnienia w grounding tylko w warstwie delegacji do CLI).
- "Deleguj do autorytatywnego CLI zanim wygenerujesz" jako uniwersalna reguła
  wyboru narzędzi przez agenta (wymaga sources w fazie grounding — Anthropic
  agent docs, OneTab, Claude Code/Codex docs).
- Trzy bramki egzekucji (pre / in / post) jako rama mentalna lekcji
  (rama dydaktyczna kursowa — nie wymaga external evidence, ale wymaga
  konsystencji z prework 3.3).
- Minimalna polityka uprawnień jako trzecia droga między approve-everything
  a YOLO mode (claim wymagający przykładów konfiguracji w Claude Code z aktualnych
  docs; wzorzec nazwany ogólnie, portability do innych harnessów to zakres kursowy).
- Autorska anegdota: YOLO mode bez sandboxu od września 2025 r. (kontekst kod-only,
  brak prod-data, brak MCP-prod, jeden incydent z lokalną bazą zażegnany przez
  CLAUDE.md) — claim *pierwszoosobowego doświadczenia autora*, jasno oznaczony
  w drafcie jako anegdota, nie generalny dowód. Default kursowy to stan pośredni,
  nie YOLO.
- Komfort z AI po stronie operatora jako prerequisite świadomego YOLO; default
  dla kursanta na etapie m1-l3 to stan pośredni z polityką (claim dydaktyczny).
- Polityka uprawnień jako kontrola **probabilistyczna**: udokumentowane przypadki
  obejścia denylistu/sandboxa przez agenta (m.in. raport "Claude Code escapes its
  own denylist and sandbox", ona.com — do triage'u w fazie grounding). Konsekwencja
  dydaktyczna: defense in depth (polityka + git + brak prod-data + CLAUDE.md)
  zamiast zaufania do jednej warstwy.
- /10x-health-check jako brownfield odpowiednik bootstrappera: trzy bramki
  egzekucji mapowane na audyt istniejącego projektu (pre-check: dependency audit,
  in-check: test+CI, post-check: agent-readiness). Claim oparty na SKILL.md
  health-checka. Konwergencja obu ścieżek w m1-l4.
- Sekcja prywatności (Deep Dive): trzy tiery prywatności (darmowy/subskrypcja/API),
  tabela porównawcza pięciu dostawców (Anthropic, OpenAI, Google, DeepSeek, Alibaba),
  ustawienia prywatności w Claude Code i Cursorze, jurysdykcja chińskich dostawców
  (NIL art. 7, DSL, PIPL), checklist pre-sesyjny. Grounded w oficjalnych docs
  wszystkich pięciu dostawców + Stanford FMTI report. Uzupełnia lukę z preworku
  (3.5 miał jednozdaniową wzmiankę o compliance chińskich dostawców, brak konkretów).

Claims removed:
(none — schema for m1-l3 was empty placeholder)

Neighboring lesson references changed:
- Eksplicytny handshake z m1-l4: m1-l3 kończy "projekt na dysku, agent głuchy",
  m1-l4 startuje od onboardingu agenta. Zgodne z m1-l4 sideEffectLedger.
  Obie ścieżki (greenfield + brownfield) zbiegają się w m1-l4 z równoważnym
  kontekstem.
- Eksplicytny forward reference do m1-l5: MCP nazwane jako kategoria w Beat 8;
  deep-dive zostaje w m1-l5.
- Bootstrapper SKILL.md potwierdza: v1 NIE generuje AGENTS.md/CLAUDE.md —
  zgodne z granicą m1-l3 vs m1-l4.
- Referencja do m1-l2 brownfield: stack-assessment.md z /10x-stack-assess jako
  opcjonalny input dla health-checka (cross-reference quality-gate gaps).

Prework references used:
- 1.2 (harness jako warstwa kontroli)
- 2.2 / 2.3 (uprawnienia w Cursor / Claude Code)
- 3.2 (prompt jako kontrakt)
- 3.5 (rekomendowane modele — wstępna wzmianka o compliance chińskich dostawców;
  tu pogłębiona o jurysdykcję, retencję i konkretne instrukcje opt-out)
- 4.2 (projekt kursowy jako podmiot demo)

Prework concepts repeated intentionally:
- Krótki recap harness-as-control jednym akapitem przed Core, żeby uzasadnić
  przejście z "wiem, że istnieje" do "konfiguruję".
- Prework 3.5 mówił jednozdaniowo "sprawdź politykę danych przed użyciem
  chińskich dostawców" — tu operacjonalizacja: tabela porównawcza, jurysdykcja,
  konkretne toggle'e, checklist. Nie powtórzenie, pogłębienie.

Potential duplicates:
- Permissions vs. prework 2.3 — zarządzane przez przejście od *kategorii*
  (prework) do *operacyjnej polityki* (m1-l3).
- Custom instructions / project rules vs. m1-l4 — RYZYKO drift'u w Beat 6.
  Spec wymusza: Beat 6 mówi tylko o uprawnieniach, nie o instrukcjach.
- Hooks / inner loop vs. m1-l4 — niedopuszczalne w m1-l3; spec listuje to
  w mustNotCover.

Unsupported facts:
- Wszystkie liczby ("X% boilerplate'u to delegacja", "Y% redukcji błędów")
  są w spec NIEDOZWOLONE bez grounding. Jeśli draft je wprowadzi,
  zatrzymujemy w RC. Decyzja: shouldn't be used.

Video/text mismatches:
(none yet)

Needs human decision:
- Schema enrichment przyjąć/odłożyć (Open Questions § 1). Decyzja: schema enrichment zajdzie po groundingu.
- Dodać lesson-grounding do requiredArtifacts (Open Questions § 2). Decyzja: tak.
- 10xCards vs świeży projekt jako demo (Open Questions § 4). Decyzja: 10xCards.
- ~~Domyślny harness w sekcji uprawnień~~ — RESOLVED 2026-05-05: anchor w Claude
  Code, wzorzec nazwany ogólnie; lista wspieranych narzędzi to zakres kursowy,
  nie lekcyjny. Zaczniemy od Code
- Nazewnictwo bramek (Open Questions § 6). Decyzja: pre-execution, in-execution, post-execution.
- Waga autorskiej anegdoty YOLO: 60-sekundowa wstawka video + akapit w Deep Dive
  (rekomendacja) vs. pełny segment vs. tylko tekst. Decyzja: tylko tekst (w deep dive)
```
