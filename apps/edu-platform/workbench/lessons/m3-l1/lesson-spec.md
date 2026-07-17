# Lesson Spec: m3-l1 — Plan testów z AI: quality gates, test-plan i priorytety

## Schema Context

- Course: 10xdevs-3
- Module: m3 — AI Development Quality & Maintenance
- Position: moduleOrder 1 / globalOrder 11
- Depends on: m2-l5 (parallel agents, faster throughput, `/10x-status`, `/10x-archive`)
- Prepares for: m3-l2 (unit/integration tests from risk), m3-l3 (hooks), m3-l4 (E2E + MCP + multimodal), m3-l5 (debug-as-test)

## Lesson Job

Otworzyć M3 jako moduł jakościowy. Zamienić quality pain po M2 w pierwszy realny rollout testów. Lekcja uczy `/10x-test-plan` jako warstwy orkiestracji nad znanym cyklem `/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement`.

Lekcja jasno pokazuje, że nie wymyślamy nowego procesu implementacji testów. Gdy wiemy, co testować, research-plan-implement pozostaje właściwą ścieżką. Nowy skill działa poziom wyżej: analizuje projekt, proponuje risk map, dzieli pracę na kolejne fazy i prowadzi użytkownika przez handoffy.

## Thesis

Plan testów z AI nie powinien być ani statycznym `testing-guide.md`, ani promptem "write tests for this file". W 10xDevs jest to `context/foundation/test-plan.md`: trwały artefakt łączący strategię, risk map, stan rollout'u i rosnący cookbook. `/10x-test-plan` nie pisze testów — orkiestruje ich dowiezienie przez istniejący research-plan-implement cycle, pilnując, żeby zacząć od ważnego ryzyka, a nie od wygodnego pliku.

## Prework Continuity

- Relevant prework: 1.3 (nie akceptuj bez zrozumienia / korepetytor), 3.2 (prompt jako kontrakt), 3.3 (Write/Select/Compress/Isolate i świeże sesje per handoff).
- Assumed: kursant rozumie pracę ze skillami, `/clear`, artefakty projektowe oraz różnicę między agentem in-repo a LLM-em z dużym kontekstem.
- Deepened here: jak z artefaktów M1/M2 zrobić risk-first rollout jakości i jak nie mieszać strategicznego sygnału z researchową wiedzą o kodzie.

## Audience Starting Point

Kursant po M2 ma PRD, stack, bootstrap, AGENTS.md, deploy pipeline, roadmapę, kilka zarchiwizowanych slice'ów i doświadczenie z parallel agents. Może nie mieć żadnych testów albo mieć tylko przypadkowe testy. Najczęstsze przekonania na starcie M3:

- "Testy dodam, jak będzie czas."
- "Agent może wygenerować testy dla każdego pliku."
- "Skoro mam review w CI, to wystarczy."
- "Plan testów to dokument dla dużego zespołu, nie dla solo deva."

Lekcja rozbraja te przekonania przez workflow, a nie moralizowanie.

## Behavioral Change

Po lekcji kursant nie pyta agenta "write tests for this file". Uruchamia `/10x-test-plan`, broni risk map, akceptuje rollout fazowy i rozumie, że dowiezienie idzie przez znany cykl M2. Rozumie też, że `test-plan.md` jest warstwą strategiczną, a nie zamiennikiem researchu, planu czy implementacji.

## Owned Concepts

- `/10x-test-plan` jako canonical learner-facing skill dla M3-l1, który tworzy i utrzymuje `context/foundation/test-plan.md` oraz orkiestruje handoffy do cyklu M2.
- `context/foundation/test-plan.md` jako trwały dokument-strategia + stan rollout'u, czytany przez skill przy każdym uruchomieniu i pełniący rolę pamięci procesu zamiast jednorazowego dokumentu.
- Greenfield gate: jeśli projekt to PRD i notatki bez kodu, skill zatrzymuje się i przekierowuje do `/10x-shape` / `/10x-prd` — test-plan żywi się tym, co istnieje w repo.
- Pozycjonowanie skilla jako warstwy orkiestracji nad cyklem M2, wizualizowane diagramem pętli (Test Plan → kolejna faza → `/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement` → aktualizacja planu).
- Risk-first prioritization: 5-7 failure scenarios w języku użytkownika/biznesu, ocenionych przez impact × likelihood, z traceability do źródła.
- Źródła sygnału: `context/foundation/prd.md`, `context/foundation/roadmap.md`, `context/archive/*/plan.md`, `context/foundation/tech-stack.md`, `AGENTS.md`/`CLAUDE.md`, istniejąca konfiguracja testów, historia GITa i wywiad z kursantem.
- Scope confirmation dla hot-spot scan: skill proponuje workspaces i wykluczenia (np. `dist`, `coverage`, fixtures, lockfile, snapshoty) i prosi o korektę zanim ruszy ze skanem — żeby churn lockfile'a nie zatopił prawdziwego sygnału.
- Adaptywny wywiad: skill dostosowuje pytania do stanu projektu — w greenfield pomija pytanie "co czujesz, że jest niedotestowane", w projekcie ze sparse suite pyta "gdzie jest największa dziura".
- Wywiad-jako-źródło: obawy kursanta, miejsca wcześniejszych awarii i kod-bez-pewności są równoprawnym sygnałem ryzyka, nie miękkim dodatkiem.
- Test-budget exclusions: ostatnie pytanie wywiadu ("na co NIE chciałbyś, żeby poszedł budżet testowy?") trafia do osobnej sekcji wykluczeń w planie — z powodem, żeby decyzja przetrwała rotację zespołu.
- Granica sygnał kontra wiedza: `test-plan.md` zostaje na poziomie failure scenarios i kategorii ryzyka; `/10x-research` dopiero ustala file:line, call graph i najtańszą warstwę testu.
- Problem wyroczni (oracle problem) — sekcja "Zielony test, który niczego nie chroni": test musi znać oczekiwany wynik z niezależnego źródła (wymagania, kontrakt, zdrowy rozsądek), a nie z testowanej implementacji. Przykład `calculateDiscount` + cztery linie obrony (przestrzeń na interpretację założeń, czytanie asercji zamiast paska pokrycia, sprawdzenie czy test potrafi zawieść — z zapowiedzią rozwinięcia w m3-l2, ostrożność wobec presji zielonego). m3-l1 wprowadza pojęcie; m3-l2 je operacjonalizuje przez research.
- Skill aktywnie pilnuje granicy: ryzyko sformułowane implementacyjnie ("brak retry w `session.ts`") zostaje przeformułowane na scenariusz awarii użytkownika; nazwa pliku w kolumnie źródła zostaje zastąpiona numerem pytania z wywiadu, linią z PRD lub katalogiem z największym churnem.
- Dwukierunkowość rollout'u: kiedy `/10x-research` odkryje, że awaria mieszka w innym miejscu niż wskazywał hot-spot, kolejne uruchomienie `/10x-test-plan` proponuje korektę istniejącej fazy ("research wskazał poprawkę do §2, dopisać teraz czy zostawić do następnej rewizji?").
- §6 Cookbook Patterns: na starcie placeholder ("TBD — see §3 Phase 1"), każda dowieziona faza dopisuje konkretny przepis (lokalizacja testów, polityka mockowania, test referencyjny, lokalna komenda).
- Operational modes: `/10x-test-plan --status` (krótka tabela faz: zamknięte, w toku, następna komenda) i `/10x-test-plan --refresh` (świeża runda analizy, gdy plan się zestarzał).
- 7 pytań kontraktowych, na które `context/foundation/test-plan.md` musi odpowiedzieć po lekcji (ryzyka, źródła, profil testów, fazy, typy testów, rola AI w jakości, cookbook).
- Repomix / GitIngest jako wzmianka w Materiałach dodatkowych — narzędzia do pakowania repo jako briefu dla zewnętrznego LLM-a.

## References Only

- Hierarchia rules-files: AGENTS.md/CLAUDE.md (m1-l4, prework 3.2) jako tło — test-plan.md nie jest tu kolejnym rules-file, jest osobnym żywym dokumentem w `context/foundation/`.
- PRD jako źródło ryzyk biznesowych (m1-l1).
- tech-stack.md jako wejście do realiów stacku (m1-l2).
- Roadmap i zarchiwizowane slice'y jako wejście do likelihood (m2-l1, m2-l5).
- CI/CD jako infrastruktura quality gates (m1-l5).
- `/10x-impl-review-ci` jako jeden z automated review gates, nie substytut testów (m2-l5).
- `/10x-new`, `/10x-research`, `/10x-plan`, `/10x-implement` jako downstream cykl M2, do którego skill przekazuje handoffy.
- `/10x-status` jako miejsce, w którym po M2 widać brak warstwy jakości (m2-l5).
- Write/Select/Compress/Isolate (prework 3.3) jako uzasadnienie świeżych sesji per handoff i trwałego planu w repo.
- Prompt jako kontrakt (prework 3.2) jako model mentalny dla `context/foundation/test-plan.md`.
- Klasyczny Test Plan jako historyczny punkt odniesienia, nie konkurujący artefakt.

## Must Not Cover

- Pisanie unit testów, konfiguracja Vitest, Testing Library, MSW i mockowanie zależności (m3-l2).
- Konfiguracja hooków, hook lifecycle, debugging i konkretne skrypty PostToolUse (m3-l3).
- Konfiguracja Playwright MCP lub innych MCP-ów, Playwright API, kod e2e, scenariusze multimodalne (m3-l4).
- Debugowanie od stack trace'a do fixa i pełny debug-as-test workflow (m3-l5).
- Research kodu na poziomie file:line, call graph, granic API — to robi dopiero `/10x-research` w fazie rollout'u (m2).
- Pełny tutorial `/10x-new`, `/10x-research`, `/10x-plan`, `/10x-implement` — m3-l1 tylko pokazuje pozycjonowanie cyklu jako downstream.
- Code review podczas implementacji slice'a i interactive triage findingów (m2-l3).
- Tworzenie CI/CD pipeline od zera, GitHub Actions YAML, sekrety i deployment config (m1-l5, m2-l5).
- Budowa AGENTS.md/CLAUDE.md od zera lub pełna architektura reguł projektu (m1-l4).
- Wybór tech stacku aplikacji albo bootstrap projektu (m1-l2, m1-l3, prework 4.1).
- Tabela klasycznych warstw testów (unit/integration/contract/e2e/visual/a11y/manual) z mapowaniem ryzyk — m3-l1 nie wchodzi w ten poziom granularności w prozie.
- Tabela AI-native quality forms z polem "kiedy NIE używać" per pozycja (post-edit hooks, QA MCP, multimodal e2e, debug-as-test, vision fallback) — m3-l1 nazywa tylko ogólnie warstwę AI; szczegółowe pozycje wchodzą w m3-l3 / m3-l4 / m3-l5.
- Rekomendowany JS/TS stack default (Vitest + Testing Library + MSW + Playwright + axe-core) wymieniony z nazwy w prozie — m3-l1 zostaje agnostyczny stack-wise.
- Tabela quality gates required/recommended/optional przypiętych do faz rollout'u — m3-l1 wspomina o sekcji gates, ale nie rozpisuje jej w prozie.
- Performance / load testing jako osobna głębia.
- Security / pen-testing jako osobny temat.
- Boilerplate template `test-plan.md` poza skillem — drafter nie powiela treści szablonu.

## Learning Outcomes

- Kursant uruchamia `/10x-test-plan` i rozumie, że wynikowy `context/foundation/test-plan.md` jest jednocześnie strategią, stanem rollout'u i cookbookiem.
- Kursant rozpoznaje greenfield gate: bez kodu w repo skill świadomie cofa go do `/10x-shape` / `/10x-prd`, zamiast generować plan w próżni.
- Kursant odróżnia risk map od listy testów: formułuje 5-7 failure scenarios w języku użytkownika/biznesu i broni ich źródeł (PRD, roadmap, archive, hot-spot, interview).
- Kursant rozumie granicę sygnał kontra wiedza: zostawia file:line anchors dla `/10x-research`, a sam test-plan trzyma na poziomie failure scenarios; rozumie, że skill aktywnie przeformułowuje ryzyka opisane implementacyjnie.
- Kursant weryfikuje hot-spot scan jako likelihood evidence, potwierdza zakres skanowania (workspaces + wykluczenia) i nie traktuje hot-spotu jako dowodu na lokalizację buga.
- Kursant odpowiada na wywiad świadomie — własne obawy, miejsca wcześniejszych awarii i kod-bez-pewności traktuje jako równoprawne źródło ryzyka; ostatnie pytanie o test-budget exclusions traktuje jako kontrakt na przyszłość.
- Kursant rozumie, że `/10x-test-plan` orkiestruje istniejący cykl M2 (`/10x-new` → `/10x-research` → `/10x-plan` → `/10x-implement`) zamiast go zastępować, i wie, że pliki na dysku są pamięcią rollout'u.
- Kursant przyjmuje dwukierunkowość: jeśli research wskaże, że awaria mieszka gdzie indziej niż hot-spot, plan przyjmuje korektę warstwy, która zna kod lepiej.
- Kursant rozumie sekcję Cookbook Patterns: placeholder na start, realne wzorce po dowiezieniu faz.
- Kursant wie, kiedy użyć `/10x-test-plan --status` (powrót po przerwie, krótka tabela), a kiedy `/10x-test-plan --refresh` (plan się zestarzał, nowa runda analizy).

## Required Example Or Demo

Demo prowadzącego w projekcie kursanta po M2. Sekwencja:

1. `/10x-status` po M2 pokazuje zarchiwizowane slice'y i brak testów; bridge do M3.
2. `/10x-test-plan` startuje, czyta artefakty z `context/foundation/` + `context/archive/` + AGENTS.md, proponuje zakres hot-spot scan z konkretnymi workspaces i wykluczeniami — prowadzący koryguje zakres.
3. Krótki wywiad z prowadzącym, w tym pytanie o test-budget exclusions.
4. Skill generuje risk map; prowadzący próbuje wpisać "brak retry w `session.ts`" i dostaje przeformułowanie na user-felt scenario; nazwa pliku w kolumnie źródła znika.
5. Skill zapisuje `context/foundation/test-plan.md`, prowadzący ogląda placeholder w §6 Cookbook.
6. `/10x-test-plan --status` raportuje stan; pokazany handoff do cyklu M2 (bez pełnego demo czterech kroków — to terytorium M2 / kolejnych lekcji M3).

Demo nie używa fikcyjnego running scenario — projekt prowadzącego jest jedynym źródłem.

## Structural Logic Map

```text
Beat 1 — Bridge z M2 i pytanie "co naprawdę musi być chronione?"
  Question answered: dlaczego M3 nie zaczyna się od `npx vitest`?
  Introduces: szybciej dowozisz, ale nie wiesz, co nadal działa; teatralność coverage'u dla helperów.
  Sets up: potrzebę risk-first decyzji przed jakąkolwiek konfiguracją testów.

Beat 2 — Test plan w epoce AI
  Question answered: czym /10x-test-plan różni się od jednorazowego dokumentu?
  Introduces: `context/foundation/test-plan.md` jako żywy plik; pliki jako pamięć rollout'u; greenfield gate; pętla nad cyklem M2.
  Sets up: skąd skill bierze priorytety.

Beat 3 — Najpierw ryzyka
  Question answered: skąd skill wie, co priorytetyzować?
  Introduces: źródła sygnału (PRD, roadmap, archive, tech-stack, AGENTS.md, testy, git, wywiad), scope confirmation dla hot-spot scan, adaptywny wywiad, test-budget exclusions, risk map (impact × likelihood).
  Sets up: granicę między ryzykiem a kodem.

Beat 4 — Sygnał, nie diagnoza
  Question answered: dlaczego risk map nie wskazuje file:line?
  Introduces: skill aktywnie przeformułowuje ryzyka implementacyjne; evidence zastępuje nazwy plików; /10x-research jako warstwa wiedzy o kodzie; dwukierunkowość plan↔research.
  Sets up: cookbook jako efekt rollout'u.

Beat 5 — Cookbook zamiast pamięci w głowie
  Question answered: jak wiedza z rollout'u zostaje w projekcie?
  Introduces: §6 Cookbook Patterns, placeholder, wzorzec wypełniany po dowiezionej fazie.
  Sets up: powroty do planu.

Beat 6 — Powroty do test-planu nie bolą
  Question answered: jak wrócić po dwóch tygodniach?
  Introduces: --status (tabela faz), --refresh (świeża runda analizy).
  Sets up: kontrakt wyjściowy lekcji.

Beat 7 — Artefakty po tej lekcji
  Question answered: co konkretnie powinno być w repo?
  Introduces: 7 pytań, na które test-plan.md musi odpowiedzieć.
  Sets up: zadania praktyczne.

Beat 8 — Praktyka, odznaka, Deep Dive
  Question answered: co kursant ma teraz zrobić?
  Introduces: 3 zadania (pierwsze uruchomienie, obrona risk map, sprawdzenie dopasowania); kryteria odznaki; Deep Dive: risk-based testing bez AI, sygnał vs wiedza.
```

## Video Placeholders

Lekcja używa jednego osadzonego nagrania w sekcji "Sygnał, nie diagnoza" (po treści, przed cookbookiem). Scenariusz powinien pokazać całą koncepcję posługiwania się skillem — od bridge'u z M2 do pierwszego handoffu — w jednej spójnej demonstracji.

Sugerowane beaty nagrania:

- Quality pain po M2: `/10x-status`, brak testów, naturalne wejście w M3.
- Aktywacja: `/10x-test-plan`, skill czyta artefakty, proponuje zakres hot-spot scan z konkretnymi workspaces i wykluczeniami, prowadzący koryguje.
- Wywiad: skill zadaje pytania dopasowane do stanu projektu, finalne pytanie o test-budget exclusions.
- Risk map: prowadzący próbuje wpisać ryzyko implementacyjne i widzi przeformułowanie; evidence w kolumnie źródła nie ma file:line.
- Pierwszy handoff: skill kieruje do cyklu M2 (bez wchodzenia w sam cykl — to terytorium M2).
- Powrót: `/10x-test-plan --status` raportuje stan po przerwie.

## Side-Effect Ledger

New claims introduced:
- `/10x-test-plan` orkiestruje istniejący cykl M2 zamiast go zastępować.
- `context/foundation/test-plan.md` żyje w `context/foundation/` i jest jednocześnie strategią i pamięcią rollout'u.
- Greenfield gate: brak kodu blokuje skill i wraca do `/10x-shape` / `/10x-prd`.
- Scope confirmation dla hot-spot scan jest wymaganym krokiem — z konkretnymi przykładami workspaces i wykluczeń.
- Adaptywny wywiad: pytania dostosowują się do greenfield vs sparse suite.
- Test-budget exclusions trafiają do osobnej sekcji planu z uzasadnieniem.
- Skill aktywnie przeformułowuje ryzyka opisane implementacyjnie i usuwa nazwy plików z kolumny źródła.
- Dwukierunkowość: research może skorygować istniejącą fazę planu.
- §6 Cookbook startuje jako placeholder i rośnie po dowiezionych fazach.
- `--status` i `--refresh` to dwa tryby operacyjne skilla.
- Pliki na dysku są pamięcią rollout'u — nie historia czatu.

Claims removed:
- Tabela klasycznych warstw testów (unit/integration/contract/e2e/visual/a11y/manual) w prozie m3-l1.
- Tabela AI-native quality forms z polem "kiedy NIE używać" per pozycja w prozie m3-l1.
- Rekomendowany JS/TS stack default (Vitest + Testing Library + MSW + Playwright + axe-core) wymieniony z nazwy w prozie.
- Tabela quality gates required/recommended/optional przypiętych do faz w prozie.
- Phased Rollout statuses (not started / change opened / researched / planned / implementing / complete) enumerowane w prozie.
- Pełny step-by-step handoff loop `/10x-test-plan → /10x-new → /clear → /10x-research → /clear → /10x-plan → /clear → /10x-implement`.
- 10xcards / fiszki z AI jako running scenario przez całą lekcję.
- Cost × signal jako explicit reguła wyboru warstwy testu w prozie.
- Repomix / GitIngest jako sekcja Deep Dive (pozostają tylko w Materiałach dodatkowych).
- Preworkowe odwołania do 3.5 (modele multimodalne) i 4.2 (CI/CD jako minimum) — draft ich nie aktywuje.
- "8 pytań kontraktowych" — draft ma 7 pytań.

Neighboring lesson references changed:
- m2-l5 bridge-out pozostaje bridge-in dla m3-l1.
- m3-l2 startuje od pierwszej fazy rollout'u z `context/foundation/test-plan.md`.
- m3-l3 / m3-l4 / m3-l5 implementują warstwy nazwane ogólnie w m3-l1; szczegółowe katalogowanie warstw zostaje przesunięte do tych lekcji.

Prework references used:
- 1.3 (korepetytor — obrona risk map), 3.2 (prompt jako kontrakt — test-plan.md), 3.3 (świeże sesje, trwały plan w repo).

Prework references no longer used:
- 3.5, 4.2 (były w poprzedniej wersji spec; draft ich nie wprowadza).

Potential duplicates:
- Rules-file hierarchy z m1-l4 — granica utrzymana: test-plan.md nie jest rules-file.
- CI/CD z m1-l5 — granica utrzymana: m3-l1 nie wchodzi w pipeline.
- Cykl M2 z m2 — granica utrzymana: tylko pozycjonowanie skilla nad cyklem, bez tutorialu.
- Testowanie z m3-l2 — granica utrzymana: nie ma pisania testów ani konfiguracji.
- MCP / multimodal z m3-l4 — granica utrzymana: draft nawet nie nazywa warstwy AI-native szczegółowo.

Unsupported facts:
- Czy `/10x-test-plan --status` i `--refresh` to finalne nazwy flag w wydanym skillu — draft używa ich konsekwentnie.
- Czy katalog `context/foundation/` jest kursowo-standardowy czy specyficzny dla projektów na cyklu /10x.
- Czy domyślny zakres hot-spot scan (draft sugeruje "ostatnie 30 dni" w schemacie, w prozie nie pada konkretna liczba) jest zgodny z wydanym skillem.

Video/text mismatches:
- (none) — scenariusz nagrania nie jest jeszcze sfinalizowany; uzgadniamy go w fazie video-scenario.

Needs human decision:
- Czy `/10x-test-plan` i `context/foundation/test-plan.md` to finalne kanoniczne nazwy w wydanym toolkicie.
- Czy świadomie zostawiamy m3-l1 bez tabel klasycznych warstw / AI-native / quality gates / JS-TS stack, czy chcemy odzyskać część tej zawartości przed RC.
- Czy dodać 8. pytanie kontraktowe (np. o quality gates), żeby symetria z requiredFragments była zachowana, czy zaakceptować 7.
- Czy Deep Dive zostaje na 2 sekcjach (risk-based testing bez AI; sygnał vs wiedza), czy dosypujemy multimodal-jako-suplement i brief-from-outside.
- Czy ostateczna nazwa lekcji w nawigacji zostaje "Plan testów z AI: quality gates, test-plan i priorytety", skoro "quality gates" nie pojawia się jako rozbudowana sekcja w prozie.
