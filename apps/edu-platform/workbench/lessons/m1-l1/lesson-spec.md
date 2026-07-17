# Lesson Spec: m1-l1 — Od pomysłu do PRD: Metoda Sokratejska z Agentem

## Schema Context

- Course: 10xdevs-3
- Module: Agentic Environment
- Position: 1 / 1 (pierwsza lekcja kursu)
- Depends on: none
- Prepares for: m1-l2 — Od chatbota do Agenta: tech stack, skille i metaprompting

## Prework Continuity

- Relevant prework lessons: [4.2] Dobry i zły projekt kursowy, [1.2] Chatbot vs Agent vs Harness, [3.2] Wzorce i antywzorce promptowania
- Assumed from prework: kryteria dobrego projektu kursowego ([4.2]), różnica chatbot/Agent/harness ([1.2]), prompt-jako-kontrakt z agentem ([3.2])
- Deepened here: prework opisuje koncepty statycznie — ta lekcja składa je w jeden konkretny workflow `sesja /10x-shape → artefakt /10x-prd`. Prompt-jako-kontrakt z [3.2] rozszerza się do "cała sesja jako kontrakt"; Agent egzekwuje kryteria z [4.2] przez dialog, nie listę.
- Avoid repeating: definicja Agenta i harnessu, pełna lista kryteriów MVP (wystarczy odwołanie), patterny promptowania (m1-l2 jest właścicielem deep-dive)

## Lesson Job

To pierwsza lekcja kursu. Jej zadaniem jest przestawienie kursanta z trybu "mam pomysł, zaczynam kodować" na tryb "mam pomysł, najpierw sesja sokratejska z Agentem, potem zapisany kontrakt." Lekcja dostarcza dwa konkretne narzędzia (skille `/10x-shape` i `/10x-prd` w 10xCLI) oraz dwa konkretne artefakty (`shape-notes.md` jako zapis sesji, `prd.md` jako kontrakt). Oś narracyjna to zmiana nastawienia: Agent zadaje pytania, których kursant sam by sobie nie zadał, i robi to bez litości — a potem ustalenia trafiają do dokumentu, którego kursant nie odpuści przez kolejny tydzień iteracji.

## Thesis

Zanim napiszesz pierwszą linię kodu — czy startujesz od zera, czy zmieniasz istniejący system — przeprowadź sesję `/10x-shape` (Agent wymusza precyzję) i wygeneruj PRD przez `/10x-prd` (zapis ustaleń). Nie dlatego, że dialog albo dokument są celami same w sobie — tylko dlatego, że razem stanowią kontrakt, którego twoje kolejne prompty już nie podważą. Skill auto-wykrywa kontekst: w pustym katalogu prowadzi sesję greenfield; w katalogu z istniejącym projektem przełącza się na tryb brownfield, w którym pytania dotyczą bólu obecnego systemu, zachowanych zachowań i najmniejszej wartościowej zmiany.

## Learning Outcomes

- Kursant potrafi uruchomić skill `/10x-shape` w 10xCLI i przejść pełną sesję sokratejską od mglistego pomysłu do `shape-notes.md` (z fazami: vision, persona+access control, MVP discipline, FRs+user stories, business logic+data, product framing).
- Kursant potrafi wygenerować PRD przez `/10x-prd`, rozpoznać hollow PRD (gapy zafiksowane jako `## Open Questions` zamiast podjętych decyzji) i wrócić do sesji shape, zamiast iść w kod z dziurawym kontraktem.
- Kursant rozpoznaje, czy pomysł ma konkretnego użytkownika, problem, pierwszy przepływ, jednozdaniową business logic, granice MVP, jawne non-goals i kryterium sukcesu — używając tej listy zarówno przy starcie projektu, jak i przy każdej większej funkcji.
- Kursant traktuje PRD jako kontrakt wejściowy dla downstream agentowych kroków (m1-l2 wybór tech-stacku, m1-l3 bootstrap projektu na bazie PRD i stacku, dalsze etapy implementacji), a nie formalny dokument PM-a do szuflady.
- Kursant potrafi uruchomić `/10x-shape` w istniejącym projekcie — skill auto-wykrywa kontekst brownfield, a sesja sokratejska skupia się na bólu obecnego systemu, zachowanych zachowaniach i najmniejszej wartościowej zmianie zamiast budowania od zera.
- Kursant potrafi wygenerować brownfield PRD przez `/10x-prd` — dokument opisuje obecny system, zakres zmiany i ograniczenia kompatybilności zamiast pełnej wizji produktowej od zera.

## Audience Starting Point

Developer, który właśnie zaczął kurs i ma mglisty pomysł na projekt kursowy albo istniejący projekt (side-project, wewnętrzne narzędzie z pracy), w którym chce zrealizować konkretną zmianę. Zna pojęcie PRD z nazwy, ale nigdy go nie pisał albo pisał mechanicznie i schował. Używa AI do generowania kodu, nie do planowania. Może mieć przekonanie, że "pisanie dokumentów" to strata czasu i że szybciej wejść w kod. Z preworku wynosi: kryteria projektu kursowego, mental model Agenta z toolami i harnessem, świadomość że prompt to kontrakt — ale jeszcze nie wie, jak to złożyć w pierwszy konkretny ruch. Prework [4.2] explicite wspiera obie ścieżki: *"Akceptowane są różne ścieżki: własna aplikacja z logiką biznesową lub rozbudowanie istniejącego projektu o nowy moduł."*

## Behavioral Change

Po lekcji kursant odruchowo uruchamia `/10x-shape` przed każdym nowym projektem, przed każdą większą funkcją i przed każdą znaczącą zmianą w istniejącym systemie — i traktuje wygenerowany PRD (greenfield lub brownfield) jako żywy kontrakt, do którego wraca przy każdej wątpliwości, zamiast generować kolejne prompty z wieczornych zachcianek.

## Owned Concepts

- Dialog sokratejski z Agentem jako technika wydobywania i weryfikowania wymagań *(operacjonalizowana przez skill `/10x-shape`)*
- PRD jako kontrakt wejściowy dla kolejnych agentowych kroków, nie formalny dokument PM-a *(produkowany przez skill `/10x-prd`)*
- Kryteria gotowości pomysłu do kodowania: użytkownik, problem, pierwszy przepływ, jednozdaniowa business logic, granice MVP, non-goals, kryterium sukcesu
- Minimalne uruchomienie 10x-cli (`npx @przeprogramowani/10x-cli@latest`, `10x auth`, `10x get m1l1`) jako prerequisite dla skilli `/10x-shape` i `/10x-prd` (deep-dive toolkitu należy do m1-l2)
- Rozpoznawanie hollow PRD i powrót do sesji shape jako pętla naprawcza
- Dialog sokratejski z Agentem w trybie brownfield: odkrycie bólu istniejącego systemu, zachowanych zachowań i najmniejszej zmiany zamiast startu od zera *(operacjonalizowany przez brownfield mode w `/10x-shape`)*
- Brownfield PRD jako kontrakt delta-zmiany *(produkowany przez `/10x-prd` z zestawem 12 sekcji brownfield: Current System, Scope of Change, Constraints & Compatibility zamiast 11 sekcji greenfield Vision → FRs)*
- Praktyczna rekomendacja modeli i narzędzi AI na potrzeby kursu: architekci/myśliciele (Opus, Sonnet) do zadań analitycznych w M1 vs implementatorzy (DeepSeek, Qwen, MiniMax) do pętli kodowania w M2; subskrypcje Anthropic/OpenAI jako domyślna ścieżka, OpenRouter + OpenCode jako alternatywa *(deep-dive, zakotwiczone w danych z 10x-evals)*

## References Only

- Kryteria dobrego projektu kursowego z preworku [4.2] — używane jako tło dla pytań w sesji shape, bez powtarzania pełnej listy
- Różnica chatbot/Agent/harness z preworku [1.2] — Agent dostaje pierwsze konkretne zadanie, bez powtarzania definicji
- Prompt agenta jako kontrakt z preworku [3.2] — sesja shape rozszerza tę intuicję do "cała sesja jako kontrakt"
- Głęboka analiza toolkitu, skilli, metapromptingu i wybór tech-stacku — m1-l2 jest właścicielem (m1-l2 jest pierwszym realnym konsumentem PRD: stack-selector czyta PRD)
- 10x-evals benchmark (22 modele, 3 warunki planowania, scorecard v6) jako wewnętrzne dane wspierające rekomendacje modeli w deep-dive
- Bootstrap projektu na bazie PRD i wybranego stacku — m1-l3 jest właścicielem
- Downstream chain (tech-stack-selector w m1-l2, bootstrapper w m1-l3, technical-roadmap i dalsze etapy) jako konsumenci PRD poza m1-l1 — wzmianka, że PRD wpada do dalszej pętli, bez opisu mechaniki

## Must Not Cover

- Konfiguracja środowiska agentowego poza minimalnym uruchomieniem 10x-cli (`10x auth` + `10x get`)
- Głęboka analiza toolkitu, skilli, metapromptingu oraz wybór tech-stacku (m1-l2)
- Bootstrap projektu na bazie PRD i wybranego stacku (m1-l3)
- Formalna struktura PRD jako korporacyjnego dokumentu PM-a
- Tech / test plan / deploy w PRD (deferred do downstream skilli po trim 2026-05-03 — w PRD ich nie ma i lekcja tego nie obiecuje)
- Cytowanie dokładnego schema PRD (7 frontmatter + 11 sekcji) jako kontraktu — lekcja opisuje *ducha* (jakie rzeczy są w PRD), nie pola, żeby przeżyć ewolucję skilli

## Required Example Or Demo

Live walkthrough na pomyśle "aplikacja do tworzenia i powtarzania fiszek z AI" (kontynuacja przykładu z preworku [4.2]):

1. **Setup**: 10x-cli uruchomione przez `npx @przeprogramowani/10x-cli@latest`, `10x auth` + `10x get m1l1` pobiera skille do projektu.
2. **Sesja `/10x-shape`**: Agent prowadzi przez fazy vision → persona+access → MVP discipline → FRs+user stories → business logic+data → product framing. Po drodze wymusza:
   - **konkretnego użytkownika** ("dla kogo dokładnie? junior dev uczący się po pracy?"),
   - **MVP-in-three-weeks** (jeśli pierwszy przepływ wymaga > trzech tygodni, Agent surfaces anti-pattern),
   - **empty-CRUD detection** (jeśli business logic to "user dodaje rekordy", Agent wymusza regułę: rekomendacja, walidacja, klasyfikacja),
   - **per-FR Socratic challenge** ("co musiałoby być prawdą, żeby ten FR był błędny?"),
   - **closing soft-gate** — lista 6 elementów (access control, data, business logic, project artifacts, MVP-in-three-weeks, non-goals).
3. **`/10x-prd`**: konsumuje `shape-notes.md`, generuje `prd.md` (vision, persona, success criteria, user stories, FRs, NFRs, business logic, data model, access control, non-goals, open questions). Hollow input → ostrzeżenie i propozycja powrotu do shape.
4. **Kontrola**: kursant porównuje "przed sesją" (jedno zdanie) z "po sesji" (PRD jako pierwsza wersja kontraktu) i widzi, że to nie jest pisanie dokumentu — to jest robienie decyzji.

## Failure Mode To Disarm

Dwa złączone failure modes:

1. **Sesja jednorazowa.** Kursant traktuje `/10x-shape` jako rytuał przed kursem i wraca do starego nawyku (kod bez dialogu) przy każdej kolejnej funkcji. Lekcja musi explicite pokazać, że workflow shape→prd dotyczy też większych ficzerów i modułów.
2. **Hollow PRD.** Kursant uruchamia `/10x-prd` na zbyt cienkich notatkach, dostaje PRD z dużą sekcją `## Open Questions`, traktuje gapy jako "Agent nie wiedział" zamiast "ja jeszcze nie zdecydowałem", i idzie kodować. Lekcja musi pokazać, że gapy w PRD to twoje nieskończone decyzje — wracasz do shape, a nie do kodu.
3. **Pominięcie brownfield.** Kursant z istniejącym projektem uruchamia `/10x-shape` w pustym katalogu i tworzy greenfield PRD, zamiast dać Agentowi kontekst istniejącego systemu. Lekcja musi explicite pokazać, że `/10x-shape` w katalogu projektu auto-wykrywa brownfield i prowadzi sesję skupioną na zmianie, nie na starcie od zera.

## Suggested Structure

1. **Wejście: developer bez kontraktu** — pierwsza pułapka (kod bez wiedzy, dla kogo); reset nastawienia. Krótkie nawiązanie do preworku [4.2] i [1.2].
2. **Czym jest sesja sokratejska z Agentem** — jedna definicja, bez historii filozofii. Agent jako partner wymuszający precyzję, nie producent tekstu z prawdopodobnych założeń. Wskazanie `/10x-shape` jako konkretnego narzędzia tej techniki.
3. **Minimalne uruchomienie: `npx @przeprogramowani/10x-cli@latest` + `10x auth` + `10x get m1l1`** — tylko tyle, ile potrzeba, żeby `/10x-shape` ruszył. Deep-dive toolkitu w m1-l2.
4. **Live walkthrough sesji `/10x-shape`** — od mglistej idei przez fazy; pokazane Socratic challenge i empty-CRUD detection; closing soft-gate jako check.
5. **Od `shape-notes.md` do PRD: `/10x-prd`** — generator dokumentu zgodnego z duchem schemy. Hollow PRD jako sygnał powrotu do shape, nie do kodu.
6. **PRD jako żywy kontrakt** — krótkie ramy: PRD wpada do downstream chain (m1-l2 wybór tech-stacku, m1-l3 bootstrap projektu na bazie PRD i stacku, dalsze etapy); workflow shape→prd dotyczy też większych ficzerów. Failure mode "sesja jednorazowa" rozbrojona explicite.

## Video Placeholders

- Powitanie w pierwszej lekcji głównego programu — przypomnienie o preworku jako fundamencie kursu: zachęta do wypełnienia quizu i przerobienia czterech modułów preworku (chatbot vs Agent vs harness, tooling, jak to działa pod maską, przygotowania do projektu) przed dalszą pracą z m1-l1.
- Wprowadzenie prowadzącego do celu lekcji — efektem pracy jest PRD, ale sednem jest zmiana nastawienia.
- Pokaz sesji `/10x-shape` na żywo — ekran z 10xCLI, widoczne pytania Agenta, ewolucja odpowiedzi kursanta, moment Socratic challenge i empty-CRUD detection.
- Opcjonalnie: pokaz końcowego `prd.md` jako artefaktu po `/10x-prd` (bez pełnego scenariusza wideo) i krótki kontrast hollow PRD.
- Opcjonalnie: krótki pokaz auto-detekcji brownfield w `/10x-shape` — terminal z istniejącym projektem, propozycja trybu, potwierdzenie.

## Bridge In

Pierwsza lekcja kursu. Kursant przychodzi z preworku — zakładamy znajomość kryteriów dobrego projektu kursowego ([4.2]), różnicy chatbot/Agent/harness ([1.2]), promptu jako kontraktu ([3.2]). Lekcja natychmiast operacjonalizuje wszystkie trzy: kryteria z [4.2] stają się fazami sesji shape, Agent z [1.2] dostaje pierwsze konkretne zadanie (poprowadzić sesję), kontrakt z [3.2] rozszerza się z pojedynczego promptu do całej sesji.

## Bridge Out

Lekcja kończy się gotowym `prd.md`. m1-l2 ("toolkit, skille, metaprompting + wybór tech-stacku") robi dwie rzeczy: zagląda pod maskę toolkitu, którego m1-l1 użyło minimalnie (skille, metaprompting, struktura projektu agentowego), oraz konsumuje PRD jako wejście do tech-stack-selectora — to tam product/business shape z PRD spotyka decyzję techniczną. m1-l3 bierze PRD razem z wybranym stackiem i uruchamia bootstrap projektu — to lekcja, w której agentowe kroki realnie zamieniają kontrakt w pierwsze pliki. Workflow `/10x-shape → /10x-prd → wybór stacku → bootstrap` rozkłada się na trzy lekcje, ale jest jednym ciągiem konsumującym PRD od m1-l2 wzwyż.

## Open Questions

(none)

## Resolved Questions

- Czy lekcja powinna explicite nazwać 7 frontmatter fields i 11 sekcji PRD (precyzja), czy zostać na poziomie ducha (odporność na ewolucję)? — **Resolved: spirit-only, confirmed in draft and RC review.** Draft lists PRD contents by concept (wizja, persona, kryteria sukcesu...), not by field/section names.

## Resolved Decisions

- Preset 10x-cli w minimalnym uruchomieniu m1-l1: **pomijamy presety**. m1-l1 pokazuje `npx @przeprogramowani/10x-cli@latest` + `10x auth` + `10x get m1l1` bez nazywania wariantu (`learner` / `dev` / `full`); pełny przegląd presetów należy do m1-l2. Invokacja przez `npx @latest` zamiast globalnej instalacji — kursant zawsze dostaje najnowszą wersję bez ręcznego update'u.
- Hollow PRD jako failure mode w wideo: **zostaje tylko w tekście**. Lekcja opisuje ścieżkę cienkie notatki → ostrzeżenie z `/10x-prd` → powrót do `/10x-shape` w prozie; osobny demo w wideo nie jest wymagany.
- Boundary m1-l2 / m1-l3 (korekta 2026-05-03): wybór tech-stacku należy do **m1-l2** (razem z toolkit/skille/metaprompting), bootstrap projektu na bazie PRD i wybranego stacku należy do **m1-l3**. Wcześniejsze wpisy przypisujące stack do m1-l3 zostały poprawione w spec, draft, grounding i schema.

## Side-Effect Ledger

```
New claims introduced:
- Skille /10x-shape i /10x-prd są dwoma osobnymi skillami w łańcuchu — /10x-shape robi dialog sokratejski, /10x-prd zapisuje ustalenia jako PRD.
- PRD ma zdefiniowany kształt (7 frontmatter + 11 sekcji) skoncentrowany na product/business shape — tech, test plan i deploy nie są w PRD, lecz w downstream skillach (po scope trim 2026-05-03).
- 10x-cli (`npx @przeprogramowani/10x-cli@latest`) jest prerequisite dostarczającym skille do projektu; invokacja przez npx @latest zamiast globalnej instalacji zapewnia najnowszą wersję.
- Hollow PRD (gapy zafiksowane jako ## Open Questions) jest sygnałem powrotu do sesji shape, nie do kodu.
- /10x-shape auto-wykrywa kontekst brownfield z markerów projektu (package.json, Cargo.toml itp.) i przełącza sesję na pytania o istniejący system, zachowane zachowania i najmniejszą zmianę.
- /10x-prd przełącza na zestaw 12 sekcji brownfield (Current System, Scope of Change, Constraints & Compatibility itd.) na podstawie context_type z shape-notes.md — oba zestawy sekcji żyją w jednym prd-schema.md.
- Brownfield PRD opisuje deltę zmiany, nie pełną wizję produktową od zera.

Claims removed:
- "Skill /10x-prd przeprowadza sesję sokratejską" — błędne przypisanie; sesję robi /10x-shape.
- "Format PRD nie jest zweryfikowany" — zweryfikowany przez sesję 10xCards 2026-05-03; lekcja świadomie zostaje na poziomie ducha schemy ze względu na odporność na ewolucję, nie na brak weryfikacji.
- "m1-l3 jako pierwszy realny konsument PRD (stack + bootstrap)" — błędne przypisanie po korekcie 2026-05-03: pierwszym konsumentem PRD jest m1-l2 (tech-stack-selector); m1-l3 konsumuje PRD razem z wybranym stackiem do bootstrapu.
- "Wybór stacku technologicznego należy do m1-l3" — błędne; należy do m1-l2.

Neighboring lesson references changed:
- m1-l2 jest pierwszym realnym konsumentem PRD: oprócz deep-dive toolkitu (skille, metaprompting) prowadzi wybór tech-stacku, w którym PRD jest wejściem do decyzji technicznej.
- m1-l3 bierze PRD i wybrany stack jako wejście do bootstrapu projektu; nie jest już właścicielem wyboru stacku.

Prework references used:
- [4.2] Dobry i zły projekt kursowy — kryteria MVP jako pytania w sesji shape (operacjonalizacja).
- [1.2] Chatbot vs Agent vs Harness — Agent dostaje pierwsze konkretne zadanie.
- [3.2] Wzorce i antywzorce promptowania — prompt-jako-kontrakt rozszerzony do "sesja jako kontrakt".

Prework concepts repeated intentionally:
- Krótkie nawiązanie do kryteriów z [4.2] w kontekście dialogu sokratejskiego — operacjonalizacja, nie repetycja.

Potential duplicates:
- Ryzyko częściowego pokrycia z m1-l2, jeśli minimalne uruchomienie 10x-cli rozrośnie się do tutoriala — trzymać do `npx @latest` + `10x auth` + `10x get`, resztę zostawić m1-l2.
- Ryzyko, że "kontrola po sesji" (rozpoznawanie hollow PRD) zacznie zachodzić na closing soft-gate /10x-shape — pokazać soft-gate jako część sesji, kontrolę po PRD jako sprawdzenie *po* generacji.

Unsupported facts:
(none po 2026-05-03 — sesja 10xCards potwierdza syntax, format i workflow; szczegóły dla lesson-grounding do zaktualizowania)

Video/text mismatches:
(none zidentyfikowanych na tym etapie — wymaga przeglądu po napisaniu video scenario)

Needs human decision:
(none — all resolved)

Resolved human decisions:
- Schema enrichment: applied to `lessons-schema.json` — all provisional owns/referencesOnly/mustNotCover/learningOutcomes promoted to canonical schema fields.
- Preset 10x-cli: pomijamy presety w m1-l1. Przegląd należy do m1-l2.
- Hollow PRD demo: zostaje tylko w tekście, nie w wideo.
- Spirit vs schema precision: spirit-only — draft lists PRD contents by concept, not field names.
- CLI invocation: `npx @przeprogramowani/10x-cli@latest` zamiast globalnej instalacji — kursant zawsze ma najnowszą wersję.
```
