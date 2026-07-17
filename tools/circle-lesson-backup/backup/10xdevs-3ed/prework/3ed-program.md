# Program 10xDevs — edycja 3.0

---

## Prework — Efektywna praca z Gen AI

### Cele

- Poznasz fundamenty generative AI dla programisty (tokeny, okna kontekstowe, promptowanie)
- Efektywnej obslugi narzedzi AI w IDE i CLI dla 10xDeva
- Jak wybrac model do programowania pod katem jakosci i kosztow
- Jak pracowac z rekomendowanym i wlasnym stackiem technologicznym

### Lekcje

#### 1. DEMO: LEKCJA SPECJALNA — Wykorzystanie Agenta AI w sandboxie

- TO BE DECIDED
- Przykladowo: issue w Mattermost z wykorzystaniem research/plan/implement

#### 2. Przeglad ekosystemu LLMow i toolingu AI

- Tooling how to part 1 — Cursor (IDE)
- Tooling how to part 2 — Claude Code (CLI)
- Przeglad i wybor modeli do programowania

#### 3. Context Engineering 101

- Tokeny
- Okna kontekstowe
- Anatomia prompta
- Context Drift
- Thread Management — Compaction, Summaries, ratowanie problematycznych konwersacji
- Kluczowe pliki kontekstowe: CLAUDE/Agents.md/Rules for AI (basics)
- Jezyk komunikacji, jezyk vs koszt
- Nauka z LLM, jak sie rozwijac kiedy AI robi "robote"

#### 4. Mindset 10xDeva

- Nauka nowych technologii z wykorzystaniem potencjalu AI
- Kodowanko vs mindset produktowy / biznesowy, stakeholder management
- Jak podejsc do review generowanego kodu

#### 5. Wprowadzenie do kursowego stacku technologicznego

---

## Modul 1 — Agentic Environment

### Cele

- Dokonasz fundamentalnej zmiany podejscia: przestaniesz "czatowac", a zaczniesz delegowac cale procesy do agenta wyposażonego w narzedzia.
- Zbudujesz wlasne, spersonalizowane srodowisko pracy: 10xToolkit, integrujac agenta z lokalnymi plikami, gitem i systemem operacyjnym.
- Nauczysz sie konfigurowac uprawnienia i bezpieczne srodowisko pracy (Sandboxing, Git Worktrees), pozwalajac Agentowi na duza autonomie bez ryzyka dla glownego systemu.
- Nauczysz sie planowac projekty w sposob zrozumialy dla AI, tworzac dokumenty kontekstowe PRD i wykorzystujac techniki anty-konfirmacyjne.
- Zrozumiesz i wdrozysz standardy MCP (Model Context Protocol) oraz Agent Skills, aby wyposażyc AI w dostep do uslug i wiedze domenowa.
- Stworzysz mechanizmy samouczace sie dla projektu (AGENTS.md, Rules), dzieki ktorym agent rozumie Twoj projekt i nie popelnia tych samych bledow.

### Lekcje

#### 1. Planowanie projektu — koncepcja, prompting

- Planowanie projektu
- Brainstorming i eksploracja rozwiazan
- Metoda Sokratejska
- Anti-Confirmation Bias Prompting
- PRD (tylko produktowe / biznesowe)

#### 2. Setup repo i osobisty tool belt z Agentem AI

- Jak uczyc agenta nowych rzeczy
- Jak przyspieszac swoj workflow
- Delegowanie pracy — sprawczy byt do pracy dla ciebie (delegujesz zbyt malo)
- Chatbot vs Agent
- Przeglad / demko narzedzi wbudowanych
- Obsluga i tworzenie wlasnych narzedzi
- Scenariusz na prompt z narzedziami (Todo, AskUser, Fetch) — reusable bootstrap `/bootstrap-astro`
- Actions: 10x-astro-starter
- Omowienie GHA z deploymentem on demand
- Bootstrap z AI vs non-AI (zrob oba i wyciagnij wnioski)
- Inicjalizacja gita

#### 3. Uprawnienia, sandboxy, git worktrees, bezpieczenstwo

- Agent pracuje w sposob bezpieczny, dostosowany do indywidualnych potrzeb developera
- Jak uruchamiac "bezpiecznie" w trybie niebezpiecznym :)

#### 4. Nowa wiedza Agenta (knowledge)

- Skills
- Memory
- MCP / etc.
- Instrukcje i kontekst projektowy — self learning, Primer/10xRules 2.0/10xEnv
- Naucz sie sprawdzac agenta czy aplikacja sie buduje
- Naucz agenta advanced bash commands, etc.
- Cleanup folderow pomocniczych, kopiowanie plikow, etc.

#### 5. Innovate: Evale na stacku — projekt z lukami, na przykladzie Astro

### Czego sie nauczysz

- Budowy Agenta (Setup & Tooling): Konfiguracji srodowiska, w ktorym AI ma dostep do terminala, systemu plikow i Gita, co znacznie przyspiesza prace.
- Delegowania sprawczego: Jak przestac wykonywac brudna robote i skutecznie zlecac zadania end-to-end do agenta.
- Bezpieczenstwa operacyjnego: Izolowania pracy Agenta za pomoca Sandboxow, zarzadzania uprawnieniami i pracy na osobnych git worktrees dla zachowania czystosci repozytorium.
- Wykorzystania MCP w praktyce: Rozszerzania wiedzy i mozliwosci Agenta poprzez podlaczanie zewnetrznych zrodel danych.
- Projektowania "pamieci projektu": Tworzenia plikow kontekstowych (PRD, Agents.md, Rules), ktore ewoluuja wraz z projektem i sluza jako "long-term memory" dla agenta.
- Uruchamiania autonomicznego i sprawczego Agenta w bezpiecznym, izolowanym srodowisku.
- Metody Sokratejskiej i Anti-Confirmation Bias: Technik promptowania, ktore zmuszaja AI do korzystania z Twojej wiedzy i krytycznej analizy pomyslow zamiast slepego potakiwania.
- Przeprowadzania "Evali": Techniki oceny pracy modeli w stacku technologicznym poprzez identyfikacje luk w kodzie generowanym przez AI.

### Co zbudujesz

- Osobisty "Toolkit" i reużywalny bootstrap: Wlasny zestaw narzedzi i skryptow startowych, ktore w kilka minut stawiaja w pelni skonfigurowane srodowisko projektowe gotowe do pracy z AI.
- Architekture pamieci projektu (Context Stack): System plikow kontekstowych, ktore dzialaja jak "zewnetrzny dysk twardy" dla Agenta, eliminujac problem zapominania ustalen i konwencji.
- Dokumentacje Decyzyjna: Profesjonalne dokumenty wymagan (PRD) przy uzyciu Metody Sokratejskiej, ktore stana sie kluczowym punktem odniesienia dla Agenta.
- Integracje MCP i Agent Skills: Podlaczysz Agenta do zewnetrznych danych i umiejetnosci, wyposażajac go w "nowe zmysly" wykraczajace poza standardowa wiedze modelu.
- System Evali i Feedback Loops: Mechanizmy weryfikacji, ktore pozwola Ci oceniac jakosc pracy Agenta i automatycznie korygowac jego zachowania w przyszlych zadaniach.

### Innovate

- Agent Skills — SKILL.md, komponowanie skilli
- Subagents — parallel execution, wzorce syntezy informacji
- Ekosystem MCP
- Prompt Crafting z LLMami

### Questy

- Skonfiguruj srodowisko pracy z AI
- Zrealizuj pierwsze zadanie z workflow: R-P-I
- Zbuduj wlasne Agent skills, ktore rozszerza mozliwosci AI
- Wykorzystaj Subagents do omijania ograniczen okna kontekstowego modelu
- Uzyj MCP do poszerzenia wiedzy modelu o technologii i projekcie
- Zdefiniuj Rules for AI dopasowane do potrzeb Twojego stacku technologicznego

---

## Modul 2 — 10xDevs Workflow

### Cele

- Wejdziesz w role Technical Project Managera: nauczysz sie planowac roadmape od 0 do MVP, definiowac kamienie milowe i bezwzglednie priorytetyzowac zadania (priorytety vs nice-to-have).
- Opanujesz sztuke 10xWorkflow z podzialem na role: LLM jako Architekt (planowanie) oraz LLM jako Coder (implementacja).
- Zrozumiesz, jak przelamac bariere "ostatnich 20%" implementacji, zarzadzajac iteracjami, debugowaniem i ograniczeniami kontekstowymi agenta.
- Opanujesz sztuke Solo Code Review: nauczysz sie blyskawicznie weryfikowac, akceptowac lub odrzucac kod AI, uzywajac technik git diff i dedykowanych skilli.
- Zoptymalizujesz swoj Inner Loop (cykl kodowania) i Outer Loop (integracje), eliminujac waskie gardla przy wspolpracy z modelem.
- Skalujesz swoja produktywnosc poprzez "Multi-agent workflows": nauczysz sie zarzadzac kolejka zadan dla wielu agentow jednoczesnie, eliminujac puste przebiegi.

### Lekcje

#### 1. Technical Project Management — from 0 to MVP

- Milestones, roadmapping, backlog, priorytety, kolejnosc, zaleznosci
- Within one week, constraints, P0 vs nice to have etc., kryteria certyfikacji (kontekst)

#### 2. Feature Delivery I (Plan)

- Planning, review, enhancements, commits, etc.
- LLM-as-Architect, LLM-as-a-Coder
- Co robic z powstajacymi plikami markdown (plany, statusy itd.)
- Korzystanie z subagentow aby omijac ograniczenia kontekstu (kosztem $ i czasu)

#### 3. Feature Delivery II (Implement)

- 80%-readiness challenge
- Iteracje, side-taski, kolejka zadan na pozniej
- Konflikty, kontrola okna i kontekstu

#### 4. Solo Code Review

- Jak efektywnie sprawdzac kod implementowany przez AI
- Intuicje, workflow
- Skill lub hooki do review, git diff review, etc.
- Inner / Outer Loop (DX terminologia)

#### 5. Podaz ficzerow (backlog velocity) vs execution velocity

- Jak radzic sobie z czasem oczekiwania na ficzer
- Jak zarzadzac praca na kilku watkach/sesjach
- Intro to multi-agent workflows, todo, agent backlogs
- 10x-status

### Czego sie nauczysz

- Pracy w 10xWorkflow: Jak w tydzien przejsc od pomyslu do dzialajacego produktu, wykorzystujac 100% potencjalu agentow AI.
- Zarzadzania artefaktami projektu: Jak utrzymywac i aktualizowac pliki planow, statusow i decyzji (markdown), aby Agent nie gubil sie w trakcie rozwoju aplikacji.
- Pracy z Subagentami: Delegowania zadan do osobnych watkow w celu oszczedzania kontekstu glownego "mozgu" operacji.
- Technik "80% Challenge": Sposobow na radzenie sobie z halucynacjami i petlami bledow, ktore pojawiaja sie przy finalizacji skomplikowanych funkcjonalnosci.
- Efektywnego Solo Code Review: Technik i narzedzi (np. custom skills i hooks) do szybkiego wylapywania bledow logicznych i bezpieczenstwa w kodzie AI.
- Zarzadzania Backlog Velocity vs Execution Velocity: Jak balansowac miedzy planowaniem nowych funkcji a tempem ich wdrazania przez AI.
- Asynchronicznej pracy wielowatkowej: Technik pracy na kilku sesjach rownolegle, aby czas generowania kodu przez AI wykorzystac na code review lub planowanie innej funkcji.

### Co zbudujesz

- Roadmape i Backlog MVP: Profesjonalny plan projektu z jasno zdefiniowanymi kamieniami milowymi i kryteriami akceptacji.
- Pipeline dostarczania funkcji (10xWorkflow): Powtarzalny proces, w ktorym AI przechodzi od roli Architekta (planowanie) do Programisty (implementacja) przy Twoim nadzorze.
- System "Zywej Dokumentacji": Repozytorium plikow Markdown (plany, statusy, decyzje), ktore stanowia zewnetrzna pamiec i kontekst dla Twoich Agentow.
- System "Solo Reviewer": Zestaw narzedzi i nawykow (np. checklista, skrypty git), ktore pozwola Ci bezpiecznie merge'owac kod generowany przez AI.
- Funkcjonalne MVP (Feature by Feature): Dzialajaca aplikacje, funkcjonalnosc po funkcjonalnosci, przechodzac przez pelny cykl Plan → Review → Implement.

### Innovate

- AI-Powered Prototyping (v0.dev / Bolt.new)
- Streamowanie logow z produkcji do Agenta AI
- Programatyczne sterowanie wieloma Agentami do budowy aplikacji

### Questy

- Zaprojektuj i zaimplementuj schemat bazy
- Zintegruj zewnetrzne API z aplikacja
- Zdeplojuj dzialajace MVP

---

## Modul 3 — AI Development Quality & Maintenance

### Cele

- Zaprojektujesz i wdrozysz system Quality Gates: automatycznych bramek (testy jednostkowe, integracyjne, e2e), ktore fizycznie blokuja wdrozenie wadliwego kodu, wymuszajac na Agencie poprawki.
- Zautomatyzujesz zachowania Agenta (Agent Behavior) przy uzyciu Hookow, tworzac petle zwrotne (Feedback Loops), gdzie AI samo diagnozuje i naprawia bledy wykryte przez testy.
- Wykorzystasz Playwright MCP i multimodalnosci, aby Agent mogl "widziec" aplikacje i przeprowadzac wstepne testy E2E.
- Stworzysz "QA Spec": dokumentacje i instrukcje (Testing Guide), ktore naucza Twojego Agenta specyficznych standardow testowania w Twoim projekcie.
- Zintegrujesz proces testowania z nawykiem Solo Code Review, uzywajac AI do wstepnej walidacji logiki i bezpieczenstwa przed Twoim ostatecznym spojrzeniem.

### Lekcje

#### 1. Test plan / QA Spec i testing guide

- Natural language specs, BDD
- Techniczne wskazowki jak pisac testy
- Quality gates
- Infrastruktura pod 1 test, ktory potwierdza/blokuje deployment apki
- Backlog priorytetyzacji

#### 2. Implementacja testow jednostkowych / integracyjnych

#### 3. Automatyzacja, triggery, eventy Agenta (behavior)

- Hooks
- Polaczenie ze skillem do solo code review
- Feedback Loop

#### 4. Implementacja testow e2e

- Playwright MCP
- Multimodalnosc w testowaniu

#### 5. Debugowanie aplikacji z Agentem AI

- Rozne inputy — kod, logi, ticket, testy regresji

### Czego sie nauczysz

- Tworzenia Quality Gates: Jak definiowac krytyczne punkty kontrolne w procesie CI/CD, ktore Agent musi "zaliczyc", by kod trafil dalej.
- Pisania "Testing Guide": Tworzenia kontekstu dla AI, ktory eliminuje zgadywanie i wymusza stosowanie konkretnych bibliotek oraz konwencji testowych.
- Priorytetyzacji QA: Zarzadzania backlogiem dlugu technologicznego i decydowania, co testowac w pierwszej kolejnosci (Risk-based testing).
- Orkiestracji Agenta przez Hooki: Konfiguracji triggerow i zdarzen, dzieki ktorym Agent automatycznie reaguje na bledy w testach lub linterze.
- Testowania z uzyciem MCP: Wykorzystania Model Context Protocol do sterowania przegladarka (Playwright) i wykonywania scenariuszy E2E.
- Multimodalnego debugowania: Technik laczenia analizy kodu, logow i wizualnego obrazu aplikacji (screenshoty/wideo) w celu szybkiego namierzania bledow (Regression Testing).

### Co zbudujesz

- Inteligentny Pipeline Testowy: Zestaw skryptow i konfiguracji, ktory uruchamia testy i automatycznie przekazuje wyniki do Agenta w celu analizy.
- Custom QA Agent: Wyspecjalizowany zestaw instrukcji (Testing Guide) i narzedzi, przeksztalcajacy ogolnego model w eksperta od jakosci Twojego projektu.
- Infrastrukture "Self-Healing": Prosty mechanizm oparty na hookach, ktory pozwala Agentowi podejmowac proby samodzielnej naprawy kodu po nieudanym tescie.
- Suite Testow E2E z MCP: Zestaw scenariuszy testowych wykorzystujacych Playwright, ktore Agent moze uruchamiac i modyfikowac w razie zmian w UI.
- System Raportowania Bledow: Workflow, w ktorym Agent analizuje logi i stack trace'y, a nastepnie proponuje gotowe fixy.

### Innovate

- Playwright MCP
- Agent Browser (debugowanie, e2e review)
- Testy regresji z modelami multimodalnymi
- Test-Driven Generation (TDG) — ewolucja TDD dla ery AI

### Questy

- Stworz Testing Guide dla AI, aby generowalo spojne testy
- Zbuduj kompletna piramide testow dla aplikacji fullstack
- Skonfiguruj Playwright MCP i zbuduj workflow self-healing e2e tests
- Zaimplementuj multimodalne testy regresji z Gemini 3

---

## Modul 4 — Large scale & legacy projects

### Cele

- Nauczysz sie blyskawicznie wprowadzac Agenta w skomplikowane projekty Legacy, tworzac dla niego "Mape Repozytorium" i "Mental Model" systemu.
- Zrozumiesz, jak skalowac kontekst w duzych aplikacjach poprzez hierarchiczna strukture wiedzy (zagniezdzone pliki PRD i Agents.md).
- Opanujesz proces "Feature-oriented research": glebokiej analizy konkretnej funkcjonalnosci przed zmianami, wykorzystujac historyczne tickety i szczatkowa dokumentacje.
- Przeprowadzisz modernizacje architektury (DDD) i refaktoryzacje kodu w taki sposob, aby stal sie on "Agent-friendly" (czytelny i modyfikowalny dla AI).
- Zaplanujesz i wykonasz bezpieczna migracje technologiczna (np. update frameworka) w oparciu o powtarzalne playbooki i testy.

### Lekcje

#### 1. Onboarding do repo

- High-level mental model — o czym jest projekt, moduly, jak uruchomic, first steps z projektem
- Mapa repozytorium dla agenta
- NEXT PROBLEM TO SOLVE = realizacja zadania w repo

#### 2. Feature-oriented research w projekcie

- 10xWorkflow: research
- Korzystanie z bazy pod postacia ticketa/firmowej bazy wiedzy/resztek dokumentacji
- Before/after refaktoryzacja pod Agenta, gotchas, etc.
- Analiza ficzera — good practices, flaws, opportunities, etc.
- NEXT PROBLEM TO SOLVE = co z tym moge zrobic:
  - a) implement (bylo)
  - b) modernizacja — lekcja 3 i 4

#### 3. Metody refaktoryzacji kodu

- Testy, research, zmiany, check

#### 4. Modernizacja architektury z DDD

#### 5. Skalowanie kontekstu dla AI w duzych projektach

- Identyfikacja modulow
- Agents.md / Claude.md zagniezdzone
- Nested knowledge
- PRD / ADRs

### Innovate: Migracja libki/frameworka

- Np. masowa migracja komponentow React z klasowych na funkcyjne
- Migracja do nowej wersji Angular

### Czego sie nauczysz

- Tworzenia "Mental Model" projektu: Jak syntetyzowac wiedze o systemie (high-level architecture) do formatu, ktory pozwala Agentowi zrozumiec "o czym jest projekt" w kilka minut.
- Hierarchicznego zarzadzania kontekstem: Technik dzielenia wiedzy na poziomy (Global vs Module level) przy uzyciu zagniezdżonych plikow kontekstowych, aby ominac limity tokenow.
- Refaktoryzacji "pod Agenta": Identyfikowania i upraszczania fragmentow kodu, ktore sa zbyt zlozone dla LLM-ow.
- Archeologii kontekstowej: Odzyskiwania wiedzy z ticketow, starych PR-ow i baz wiedzy, a nastepnie konwertowania jej na ustrukturyzowane instrukcje dla AI.
- Wdrazania DDD w Legacy: Stopniowego wydzielania domen i modulow, aby ulatwic Agentowi prace na izolowanych fragmentach systemu.
- Strategii Migracji: Tworzenia automatycznych lub pol-automatycznych scenariuszy migracji (np. Class to Function components) przy uzyciu Agenta.

### Co zbudujesz

- Agent Repo Map: Fizyczna mape nawigacyjna po projekcie, ktora wskazuje Agentowi kluczowe pliki, moduly i zaleznosci.
- Zagniezdzona Strukture Wiedzy (Nested Knowledge): System plikow Agents.md rozmieszczonych w folderach projektu, dzialajacy jak lokalne instrukcje dla Agenta w danym module.
- Agent-Ready Module: Zrefaktoryzowany fragment systemu legacy, oczyszczony z dlugu technologicznego i przygotowany do dalszego, autonomicznego rozwoju przez AI.
- Migration Playbook: Zestaw instrukcji i promptow, ktory pozwala Agentowi powtarzalnie migrowac kolejne komponenty systemu do nowej technologii.
- Dokumentacje "Post-Factum": Opis systemu wygenerowany na podstawie analizy kodu i ticketow, sluzacy jako baza wiedzy dla nowych developerow i przyszlych Agentow.

### Innovate (tematy dodatkowe)

- Async Agent do backlogu maintenance, refinements, techniczny

### Questy

- **Onboarding Speedrun:** Zbuduj dzialajacy ficzer w nieznanym repo z AI
- **Documentation Generator:** Wygeneruj kompletna dokumentacje dla nieudokumentowanego modulu
- **Architecture Detective:** Zbuduj diagram architektury na podstawie kodu
- **Migration Master:** Zmigruj komponent ze starego frameworka na nowy zachowujac 100% funkcjonalnosci

#### Quest 1: "The Mysterious Bug Hunt"

- Dostajecie legacy repo z bugiem w produkcji
- Brak dokumentacji, poprzedni dev odszedl
- Deadline: 3h, znajdz i napraw z pomoca AI

#### Quest 2: "Tech Debt Prioritization"

- Repo z 50+ issues
- AI pomaga ocenic risk vs effort
- Stworz plan modernizacji

#### Quest 3: "Cross-Language Integration"

- Legacy backend (Python) + nowy frontend (TS)
- AI pomaga zrozumiec API i stworzyc adapter
- Working integration

---

## Modul 5 — AI-Native Teamwork

### Cele

- Nauczysz sie programowac wlasnych Agentow w CI/CD przy uzyciu TypeScript SDK, kontrolujac ich zachowanie, streaming i koszty.
- Zapanujesz nad zjawiskiem "Massive Code Review": wdrozysz strategie i narzedzia pozwalajace zespolowi radzic sobie z wzrostem produktywnosci bez utraty jakosci.
- Ustandaryzujesz wspolprace w zespole poprzez "Team Agreements" i wspoldzielone biblioteki komend, skilli oraz Rules, eliminujac chaos wynikajacy z roznych stylow pracy.
- Stworzysz infrastrukture "AI-Aware Service Mesh": wewnetrzne narzedzia i serwisy opisane standardem llms.txt, ktore sa zrozumiale i obslugiwalne przez inne Agenty.
- Zrozumiesz i wdrozysz infrastrukture Async Agents & Remote Access, pozwalajac AI pracowac w tle na zdalnych maszynach bez blokowania Twojego laptopa.

### Lekcje

#### 1. Programowanie Agenta AI dla zespolu engineeringowego

- TypeScript SDK, promptowanie, tool use, streaming, koszty
- Modele, metryki, monitoring (evale)

#### 2. AI-native Workflows na przykladzie CR (Agent integration)

- Masowe Code Review w epoce AI — jak tym zarzadzic
- Team agreements, potrzebujesz standardow, DoD, etc.
- Koszt integracji czlowieka vs agenta, podzial obowiązkow

#### 3. Skille i komendy dla ludzi i Agentow

- Sharing stuff, promptow, skilli, komend, Rules for AI

#### 4. AI Builders — Internal apps, tools, services

- Np. automatyzacja/wsparcie procesow agile'owych
- Service-level skills
- llms.txt o serwisie

#### 5. Async Agents & Remote Access

### Czego sie nauczysz

- Programowania Agentow (AI SDK): Tworzenia zaawansowanych skryptow w TypeScript, ktore orkiestruja prace modeli, obsluguja narzedzia (Tool Use) i monitoruja zuzycie tokenow.
- Strategii "Massive Code Review": Jak zmienic procesy Code Review, gdy zamiast 100 linii tygodniowo, musisz sprawdzic 100 linii dziennie (Automated Evals, AI-pre-check).
- Standardu llms.txt: Wystawiania dokumentacji Twoich wewnetrznych serwisow w formacie, ktory pozwala Agentom AI na ich autonomiczne odkrywanie i uzywanie.
- Ekonomii AI: Monitorowania i optymalizacji kosztow API w skali zespolu, balansujac miedzy uzyciem drogich modeli (Opus) a tanszych (Haiku/Flash).
- Zarzadzania Wiedza Zespolowa: Wersjonowania i dystrybucji sprawdzonych komend, skilli oraz "Rules for AI" wewnatrz organizacji.
- Obslugi Agentow Asynchronicznych: Delegowania zadan do "workerow" AI, ktore dzialaja w tle (Async workflows) i zwracaja wyniki po zakonczeniu dlugotrwalych procesow.

### Co zbudujesz

- Custom AI Agent (TypeScript): Wlasnego agenta w CI/CD, dostosowanego do specyficznych potrzeb Twojego stacku.
- Pipeline do "Massive CR": Zautomatyzowany przeplyw pracy w CI/CD, ktory wstepnie filtruje i ocenia kod generowany przez AI, oszczedzajac czas zespolu.
- Endpoint llms.txt: Plik/serwis, ktory pozwala agentom "zrozumiec" i uzywac firmowych API bez interwencji czlowieka.
- Shared AI Registry: Centralne repozytorium wspoldzielonych skilli, promptow i konfiguracji, z ktorego korzysta caly Twoj zespol.
- Konfiguracje Async Worker: Setup pozwalajacy na zlecenie zadania Agentowi i odebranie wynikow pozniej (np. przez powiadomienie na Slacku), zwalniajac Twoja lokalna maszyne.

### Innovate

- Agentic CI/CD Workflows (GitHub Actions z autonomicznymi agentami AI)
- Self-Healing Test Automation (automatyczna naprawa testow przez AI w ramach pipeline)

### Questy

- Zbuduj AI-powered PR Review Bot w GitHub Actions integrujacy LLM API dla automatycznej weryfikacji PRow
- Stworz zespolowy zestaw z komendami i skillami (wersjonowany w git)
- Zaprojektuj Definition of Done zawierajace protokoly i zasady wspolpracy z AI w zespole
