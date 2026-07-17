---
title: "Meta preworku 10xDevs 3"
hidden: true
---

# Meta preworku 10xDevs 3

## Model publikacji

- Learner-facing lekcje PL mieszkają w `pl/`, a szkielety EN w `en/`.
- Kanoniczne ścieżki lekcji to `/external/10xdevs-3-prework/pl/{lessonId}` oraz `/external/10xdevs-3-prework/en/{lessonId}`.
- PL i EN muszą używać tych samych wartości `lessonId` oraz zgodnego `order`.
- Lokalne Markdowni są źródłem prawdy dla preworku. Nie ma kroku synchronizacji z Circle.
- Pliki redakcyjne i pomocnicze zostają poza learner-facing globami kolekcji.

## Cookbook

Ten plik jest wspólną mapą redakcyjną dla całego preworku. Służy do pilnowania ciągłości między lekcjami, rozdzielania tematów między bloki i ograniczania powtórzeń przy pisaniu kolejnych materiałów.

Jak go używać:

- przed napisaniem lekcji sprawdź, co już jest przypisane do wcześniejszych i późniejszych bloków,
- w sekcji `Otwarcie` wpisz funkcję wejścia do lekcji: z jakiego problemu startuje i jaki most robi z poprzednim blokiem,
- w sekcji `Główne tezy` wpisz tylko najważniejsze punkty, które ta lekcja "posiada" i które nie powinny być rozwijane gdzie indziej,
- w sekcji `Źródła` zbieraj tylko źródła robocze lub finalne dla danej lekcji,
- jeśli temat pojawia się w kilku lekcjach, przypisz go jednej jako głównej, a w pozostałych zostaw tylko krótkie odesłanie albo kontekst,
- po napisaniu lekcji zaktualizuj ten plik, żeby następne teksty nie dublowały tych samych argumentów.

Ten plik jest wspólnym szkicem dla całego preworku. Ma utrzymywać ciągłość między lekcjami, pilnować zakresu poszczególnych bloków i ograniczać powtórzenia.

## Moduł 1. Więcej niż ChatGPT

### 1.1 Co potrafi AI w 2026r.
`01-1x1_co_potrafi_ai_w_2026r.md`

#### Otwarcie

#### Główne tezy

#### Źródła

### 1.2 Chatbot vs Agent vs Harness — definicje
`02-1x2_chatbot_vs_agent_vs_harness.md`

#### Otwarcie

Wejście przez codzienny, mylący moment z pracy: wpisujesz „napraw ten test” do AI i zależnie od narzędzia dostajesz albo odpowiedź w czacie, albo diff, albo niemal gotowy PR. Lekcja ma od razu rozdzielić trzy warstwy, które rynek miesza pod jednym słowem „agent”, i ustawić uczestnika nie jako „użytkownika chatbota”, tylko jako operatora systemu pracy z AI.

#### Główne tezy

- Właścicielem tematu w tej lekcji są definicje i model mentalny: czym różni się chatbot jako interfejs odpowiedzi, agent jako pętla działania oraz harness jako warstwa uruchomieniowa wokół modelu.
- Ta lekcja ma wprowadzić najmocniejsze rozróżnienie całego preworku: agent nie jest „lepszym chatbotem”, tylko systemem, który planuje, używa narzędzi, obserwuje środowisko i iteruje do wyniku albo blokera.
- Właścicielem tezy „programista staje się operatorem” jest właśnie `1.2`. Późniejsze lekcje rozwijają narzędzia i praktyki, ale nie powinny już na nowo definiować tych trzech warstw.
- Właścicielem pojęcia harness w tej lekcji jest podstawowe znaczenie praktyczne: system prompt, narzędzia, uprawnienia, polityka kontekstu, środowisko wykonania i guardrails. Szczegóły kontekstu zostają dla `3.3`, a szczegóły narzędzi dla modułu 2.
- Lekcja świadomie nie wchodzi jeszcze głęboko w Cursora, Claude Code ani context engineering. Jej zadanie to ustawić język i oczekiwania przed wejściem w konkretne interfejsy i workflowy.

#### Źródła

- Building effective agents / Anthropic / 2024-12-19 — https://www.anthropic.com/engineering/building-effective-agents
- Introducing Codex / OpenAI / 2025-05-16 — https://openai.com/index/introducing-codex/
- Harness engineering: leveraging Codex in an agent-first world / Ryan Lopopolo / 2026-02-11 — https://openai.com/index/harness-engineering/
- Unlocking the Codex harness: how we built the App Server / Celia Chen / 2026-02-04 — https://openai.com/index/unlocking-the-codex-harness/
- Unrolling the Codex agent loop / Michael Bolin / 2026-01-23 — https://openai.com/index/unrolling-the-codex-agent-loop/
- Harness design for long-running application development / Anthropic Engineering / 2026 — https://www.anthropic.com/engineering/harness-design-long-running-apps
- Claude Code overview / Anthropic Docs / 2026 — https://code.claude.com/docs

### Jak uczyć się i rozwijać z AI
`03-1x3_jak_uczyc_sie_i_rosnac_z_ai.md`

#### Otwarcie

Wejście przez dwie kontrastowe scenki z jednego dnia pracy: poranny ticket zamknięty w kilka minut z pomocą agenta (subiektywne poczucie rozwoju), i popołudniowa rozmowa z seniorem, która odsłania, że uczestnik nie potrafi obronić własnego kodu — bo nie on go wybrał. Most z `1.2`: operator agenta ma obowiązki wobec kodu, kontekstu i prompta, ale dochodzi jeszcze jeden, często niewidoczny — obowiązek wobec własnych fundamentów. Pivot: nauka z AI jest osobną dyscypliną operacyjną, nie kwestią samego narzędzia; domyślny tryb użycia statystycznie pogarsza wyniki, a tryb korepetytora je podnosi.

#### Główne tezy

- Właścicielem tematu „iluzji uczenia się", cognitive offloading i różnicy między dwoma trybami użycia AI w nauce jest właśnie `1.3`. Inne lekcje wspominają o review i weryfikacji, ale tylko tu pokazujemy twarde dane (Anthropic RCT: 17% gap, MIT EEG, Mollick) i pozytywną kontrę (*Generation-then-Comprehension* 86%, +19%).
- Właścicielem tematu triady dyscyplin operatora-ucznia (buduj-dekonstruuj, retrieval practice z fiszkami z AI, konfigurowalny tryb nauki) jest `1.3`. Pojedyncze techniki mogą pojawiać się w innych lekcjach jako taktyka, ale spójny system jako zestaw pedagogiczny mieszka tutaj.
- Właścicielem tematu spaced repetition i integracji z Anki na bazie konwersacji z agentem jest `1.3`. Meta-analiza Adesope (217 badań, 50–93% wzrost retencji) jako twardy grunt.
- Właścicielem wzorca system promptu do nauki (Paras Chopra) oraz natywnych trybów (*Claude Code Learning and Explanatory* output style, *ChatGPT Study Mode*) jest `1.3` — w zakresie pedagogiki. Szczegóły konfiguracji output styles zostają dla kursu głównego.
- Lekcja pełni rolę dopięcia ramy operatora z `1.2` — zanim uczestnik wejdzie w narzędzia i mechanikę, dostaje jasny komunikat, że produktywność ≠ wzrost kompetencji, i że w każdym kolejnym module ma prawo (i obowiązek) traktować AI jak korepetytora, a nie jak maszynę do wyręczania.
- Lekcja świadomie nie wchodzi głęboko w halucynacje i mechanikę modeli (to `3.1`), nie wchodzi w `/compact`, `/clear`, subagentów (to `3.3`), nie robi przeglądu trybów pracy w Cursorze/Claude Code (to `2.2`/`2.3`), nie jest listą „10 promptów do nauki" ani karierowym poradnikiem.
- Najmocniejszy actionable: jedna linia dopisana do każdego prompta edukacyjnego („po każdym kroku zadaj mi pytanie sprawdzające — nie kontynuuj, dopóki nie odpowiem poprawnie") jako minimalna dawka, która odwraca dynamikę sesji; dla trwałości — wygeneruj fiszki z rozmowy i wrzuć do Anki; dla defaultu — skonfiguruj tryb nauki jako system prompt lub włącz natywny output style.

#### Źródła

- *AI impact on formation of coding skills* / Anthropic Safety Fellows Program / 2026 — https://arxiv.org/abs/2601.20245
- *Your Brain on ChatGPT: Accumulation of Cognitive Debt When Using an AI Assistant for Essay Writing* / Kosmyna et al., MIT Media Lab / 2025 — https://arxiv.org/abs/2506.08872
- *Against "Brain Damage": AI and the Reshaping of Learning* / Ethan Mollick / SSRN 4941259 — https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4941259
- *Rethinking the Use of Tests: A Meta-Analysis of Practice Testing* / Adesope, Trevisan, Sundararajan / Review of Educational Research / 2017 — https://journals.sagepub.com/doi/10.3102/0034654316689306
- *Claude Code output styles* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/output-styles
- *Introducing study mode in ChatGPT* / OpenAI / 2025 — https://openai.com/index/chatgpt-study-mode/
- *System prompt for learning* / Paras Chopra / X (@paraschopra) / 2026-02-05

## Moduł 2. Tooling do programowania z AI

### 2.1 Agent w IDE vs Agent w Terminalu
`04-2x1_agent_w_ide_vs_agent_w_terminalu.md`

#### Otwarcie

Wejście przez codzienną scenkę dwóch rytmów pracy: ten sam ticket i to samo repo, raz w Cursorze (review co kilkadziesiąt sekund, inline diff, akceptuję/cofam), raz w Claude Code (prompt z planem, sześć minut pracy w tle, gotowy diff z testami). Most z `1.2`: pod spodem ta sama pętla agenta, różni się tylko cadencja review i długość kroku. Pivot: pytanie „IDE czy terminal" jest w 2026 mylące, bo oba produkty przekraczają tę granicę — właściwe pytanie brzmi „jak długi krok agenta chcę dziś zobaczyć".

#### Główne tezy

- Właścicielem ramowania „IDE vs terminal jako dwie ergonomie tej samej pętli, a nie dwa produkty" jest właśnie `2.1`. Lekcje `2.2` i `2.3` pokazują operacyjne szczegóły każdej strony, ale nie wracają już do tego ramowania.
- **Krótka pętla (IDE-first)** optymalizuje się pod precyzję lokalną: diff co kilkadziesiąt sekund, review per edycja, kontekst z otwartych plików i `@`-mentions. Domena: edycja w znanym pliku, refaktor w 1–3 plikach, zmiany w UI.
- **Długa pętla (CLI-first)** optymalizuje się pod głębokość autonomii: agent sam eksploruje repo, planuje, iteruje, review per plan i per batch. Domena: wieloplikowe migracje, feature w nieznanym fragmencie repo, porządkowanie legacy.
- Dychotomia interfejsowa się w 2026 zaciera — Cursor 3 (kwiecień 2026) deklaruje się jako „agent-first workspace" traktujący IDE jako fallback; Claude Code żyje w czterech powierzchniach (terminal, VS Code, desktop, przeglądarka). Decyzja przesuwa się z „który produkt" na „który tryb pracy".
- Właścicielem tematu **headless / automatyka agenta** w preworku jest właśnie `2.1`. To jedyny wymiar, w którym dychotomia pozostaje ostra: `claude -p` z `--allowedTools` i `--output-format json` nadal jest first-class tylko po stronie terminala. Szczegóły CI/CD w kursowej implementacji trafiają do głównego programu 10xDevs, nie do preworku.
- Najsilniejsza pojedyncza reguła operacyjna tej lekcji: **wybieraj ergonomię według długości pętli, którą jesteś skłonny tolerować; wybór produktu idzie za tą decyzją, nie odwrotnie**.
- Lekcja świadomie nie uczy Cursora ani Claude Code operacyjnie (to zadanie `2.2` i `2.3`), nie publikuje rankingów „kto lepszy" (sporne, szybko się dezaktualizują) i nie wchodzi w MCP, subagentów, hooks (to dalsze lekcje modułu 2 i 3).

#### Źródła

- *Claude Code overview* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/overview
- *Run Claude Code programmatically (Headless mode)* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/headless
- *Meet the new Cursor* / Cursor Blog / 2026-04-02 — https://cursor.com/blog/cursor-3
- *CLI Agent Modes and Cloud Handoff* / Cursor Changelog / 2026-01-16 — https://cursor.com/changelog/cli-jan-16-2026
- *Cursor 3 Introduces Agent-First Interface, Moving Beyond the IDE Model* / InfoQ / 2026-04 — https://www.infoq.com/news/2026/04/cursor-3-agent-first-interface/
- *Building effective agents* / Anthropic / 2024-12-19 — https://www.anthropic.com/engineering/building-effective-agents

### 2.2 Cursor — Podstawy operacyjne
`05-2x2_cursor_podstawy_operacyjne.md`

#### Otwarcie

Wejście przez codzienną scenę pierwszego dnia w Cursorze: uczestnik zainstalował narzędzie i klika `Cmd+L`, bo „tu jest czat". Most z `2.1`: krótka pętla IDE-first nie jest jedną pętlą — w Cursorze to pięć różnych kontraktów z agentem, trzy strumienie danych opuszczających maszynę i jedna decyzja o modelu, która realnie wpływa na rachunek. Pivot: opanowanie Cursora to nie nauka skrótów klawiszowych, tylko świadoma konfiguracja trzech osi: trybu pracy, polityki kontekstu i prywatności.

#### Główne tezy

- Właścicielem tematu operacyjnego minimum Cursora w preworku jest `2.2`. Trzy osie konfiguracji, które uczestnik musi opanować na dzień 0: tryb pracy, polityka kontekstu i prywatność.
- Tryby pracy w Cursor 3 to pięć różnych kontraktów z agentem, nie pięć skrótów klawiszowych. Inline (Cmd+K) = chirurgiczna edycja zaznaczenia, Ask = read-only Q&A o repo, Agent (Cmd+I) = autonomiczne wieloplikowe zmiany, Plan = eksploracja i plan przed edycją, Debug = runtime evidence. Decyzja o trybie to decyzja o długości pętli wewnątrz IDE-first.
- Właścicielem operacyjnego rozróżnienia `@`-mentions vs dynamic context discovery jest `2.2` — w zakresie tego, kiedy podać kontekst ręcznie, a kiedy pozwolić agentowi szukać samemu. Teoria context rot i strategie Write/Select/Compress/Isolate zostają w `3.1` i `3.3`.
- Właścicielem tematu prywatności w Cursorze jest `2.2`. Trzy strumienie danych: indeksowanie (embeddingi, surowy kod przesyłany tymczasowo), requesty do LLM (w Privacy Mode bez retencji i bez treningu), Cloud Agents (wymagają czasowej zaszyfrowanej kopii repo). Świadomy tradeoff: Privacy Mode wyłącza Cloud Agents.
- Właścicielem tematu `.cursorignore` vs `.cursorindexingignore` jest `2.2`.
- Zmiana modelu w Cursorze to decyzja o kompromisie inteligencja/szybkość/koszt, nie zabawka. Auto/Composer vs inne modele; dwie pule zużycia. Szczegółowe rekomendacje modeli i bycie na bieżąco trafiają do `3.5`.
- Lekcja świadomie nie uczy Cursor Rules w głąb (to `3.2` i kurs główny), nie robi przeglądu rynku ani porównania z Copilotem, nie wchodzi w Agents Window / Design Mode / `/best-of-n` (to `2.4`), nie wchodzi w headless / CI (to `2.1`), nie wchodzi w zarządzanie długim kontekstem i `/compact`/`/clear` (to `3.3`).
- Najmocniejszy actionable: zanim wpiszesz prompt, wybierz tryb pod typ zadania. Dla pierwszego tygodnia: Inline dla znanych edycji, Ask dla czytania repo, Agent dla drobnych zmian wieloplikowych, Plan dla wszystkiego, co nie mieści się w głowie po dwudziestu sekundach.

#### Źródła

- *Cursor — Agents* / Cursor Docs / 2026 — https://cursor.com/docs/agent
- *Cursor — Modes* / Cursor Docs / 2026 — https://cursor.com/docs/agent/modes
- *Cursor — Context (@-symbols, Codebase)* / Cursor Docs / 2026 — https://cursor.com/docs/context
- *Cursor — Privacy & Security* / Cursor Docs / 2026 — https://cursor.com/docs/account/privacy
- *Cursor — Models & Pricing* / Cursor Docs / 2026 — https://cursor.com/docs/account/pricing
- *Best practices for coding with agents* / Lee Robinson / Cursor Blog / 2026-01-09 — https://cursor.com/blog/agent-best-practices
- *Meet the new Cursor* / Cursor Blog / 2026-04-02 — https://cursor.com/blog/cursor-3

### 2.3 Claude Code — Podstawy operacyjne
`06-2x3_claude_code_podstawy_operacyjne.md`

#### Otwarcie

Wejście jako naturalna kontynuacja `2.1` i `2.2`: skoro krótka pętla w Cursorze już działa, ta lekcja pokazuje długą pętlę w Claude Code operacyjnie. Most z `1.1`: Claude Code to harness, nie „ChatGPT w terminalu" — jego siła nie bierze się ze znajomości komend, tylko z dobrego modelu operacyjnego. Pivot: większość tarcia przy pierwszym uruchomieniu nie wynika z narzędzia, tylko z oczekiwań, które programista przywozi z chatbota.

#### Główne tezy

- Właścicielem tematu „Claude Code jako harness" w warstwie operacyjnej jest `2.3` — jak w praktyce wygląda pętla (prompt → plan → tool calls → diff → review), instalacja na start i pierwsza sesja. Definicję harnessu posiada `1.2`; ergonomię długiej pętli posiada `2.1`; `2.3` nie wraca do tych ram, tylko z nich korzysta.
- Właścicielem tematu **minimalnego zestawu komend** jest ta lekcja: `/help`, `/context`, `/cost`, `/model`, `/clear`, `/compact`, Plan Mode (Shift+Tab). Dla każdej komendy jedno zdanie „kiedy jej użyć", nie kompletna referencja.
- Właścicielem tematu **uprawnień w codziennej pracy** jest `2.3` — tryb restrykcyjny jako default, `/permissions`, approval fatigue jako realny problem operacyjny. Szczegóły bezpieczeństwa i sandboxów zostają dla M1.
- Właścicielem tematu **czytania wyjścia agenta** (kiedy analizuje, kiedy edytuje, kiedy odpala komendę, jak czytać inline diff przed akceptacją) jest ta lekcja — bo to pierwsza rzecz, której programista potrzebuje, żeby nie klikać „approve" na ślepo.
- Właścicielem tematu **kosztów i limitów w Claude Code** jest `2.3` w zakresie praktycznej higieny: `/cost` jako widoczność, `/model` jako świadomy wybór Sonnet/Opus, `/clear` między niepowiązanymi zadaniami. Teoria kosztów tokenowych zostaje dla `3.1`; strategie context engineering zostają dla `3.3`.
- Lekcja świadomie nie uczy CLAUDE.md jako trwałego prompta (to `3.2`), nie wchodzi w MCP, subagentów, hooks i skills (to kurs główny M1), nie robi szczegółowego zarządzania cyklem życia wątku poza wskazaniem `/clear` i `/compact` jako minimum (szczegóły decyzji to `3.3`), nie powtarza dychotomii IDE vs CLI z `2.1`.
- Najmocniejszy actionable: w pierwszej sesji wypracuj dwa nawyki — `/context` zanim agent zacznie pracować długo, `/clear` po każdym zamkniętym zadaniu przed kolejnym. Te dwa odruchy załatwiają większość problemów operacyjnych początkującego użytkownika.

#### Źródła

- *Claude Code overview* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/overview
- *Claude Code quickstart* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/quickstart
- *Claude Code setup* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/setup
- *Slash commands* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/slash-commands
- *Managing costs* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/costs
- *Permissions* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/iam
- *Using Claude Code: session management and 1M context* / Thariq Shihipar / Anthropic / 2026-04-15 — https://claude.com/blog/using-claude-code-session-management-and-1m-context

### 2.4 Agent-Native IDE — nowa generacja narzędzi
`07-2x4_agent_native_ide.md`

#### Otwarcie

Wejście przez moment, gdy jeden agent w IDE lub terminalu przestaje wystarczać i pojawia się potrzeba równoległej pracy. Prezentacja kierunku rozwoju narzędzi z lat 2025-2026, w którym IDE nie jest już edytorem z dodanym czatem, ale "centrum dowodzenia", gdzie wielu agentów pracuje asynchronicznie w izolowanych worktree, a deweloper ewoluuje z recenzenta pojedynczych diffów w orkiestratora całego zespołu wirtualnego.

#### Główne tezy

- Orkiestracja wielu agentów równolegle to kolejny krok po opanowaniu Cursora i Claude Code.
- Izolacja przez Git worktree staje się standardem, pozwalając unikać konfliktów przy asynchronicznej pracy w tle.
- Koncepcja "Artifacts" (jak w Google Antigravity) i diff-first review (jak w Conductor) tworzą nowy UX oparty o zaufanie i przejrzystość, wypierający analizę surowych logów agenta.
- Trójwarstwowy model pracy z AI (3-tier framework): in-process subagenty, lokalni orkiestratorzy na desktopie, zlecenia cloud-async.
- Świadomość rynku: narzędzia agent-native wyznaczają kierunek rynkowy, choć do codziennego shipowania kodu nadal używamy sprawdzonych rozwiązań.

#### Źródła

- Conductor (Melty Labs) — conductor.build
- O'Reilly AI CodeCon — Addy Osmani (Google)
- Dokumentacje robocze Codex Desktop (OpenAI) i Google Antigravity (przykłady innowacji w UI)

### 2.5 Mini-Task Rozgrzewkowy
`08-2x5_mini_task_rozgrzewkowy.md`

#### Otwarcie

#### Główne tezy

#### Źródła

## Moduł 3. Jak to działa pod maską

### 3.1 LLMy i ich wpływ na codzienną pracę
`09-3x1_llmy_i_ich_wplyw_na_codzienna_prace.md`

#### Otwarcie

Start od codziennej sceny pracy z agentem: wrzucasz opis błędu i logi, a po chwili dostajesz elegancki, ale błędny diff. Lekcja ma przestawić uczestnika z myślenia „model czasem ma humor” na myślenie „to wynik architektury LLM-a i sposobu pracy z nim”.

#### Główne tezy

- LLM nie „wie”, tylko przewiduje kolejny token. To oznacza, że płynność i pewność tonu nie są dowodem poprawności.
- Halucynacje są cechą systemu, nie wyjątkiem. Dlatego review, testy, logi i weryfikacja na artefaktach są obowiązkową częścią pracy z AI.
- Okno kontekstowe to working memory, nie darmowa pamięć. Więcej kontekstu nie oznacza automatycznie lepszej jakości.
- W tej lekcji właścicielem tematu jest praktyczna konsekwencja długiego kontekstu: szum, zły priorytet informacji i spadek jakości. Szczegółowe zarządzanie wątkiem, `compact`, `clear` i restart sesji zostają dla `3.3`.
- W tej lekcji właścicielem tematu jest też podstawowy kompromis koszt/jakość przy reasoning. Głębsze rozumowanie ma sens przy planie, analizie i decyzjach pod niepewnością, ale nie przy mechanicznych zadaniach.
- Lekcja kończy się regułami operacyjnymi dla programisty: ufaj lokalnie, sprawdzaj globalnie; traktuj kontekst jak budżet; rezerwuj reasoning na decyzje; proś o wynik, który da się zweryfikować.

#### Źródła

- Why language models hallucinate / OpenAI / 2025-09-05 — https://openai.com/index/why-language-models-hallucinate/
- Reasoning best practices / OpenAI API Docs / 2026 — https://developers.openai.com/api/docs/guides/reasoning-best-practices
- Context windows / Anthropic Docs / 2026 — https://docs.anthropic.com/en/docs/build-with-claude/context-windows
- Building with extended thinking / Anthropic Docs / 2025 — https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
- Context Rot: How Increasing Input Tokens Impacts LLM Performance / Kelly Hong, Anton Troynikov, Jeff Huber / 2025-07-14 — https://www.trychroma.com/research/context-rot
- API Pricing / OpenAI / 2026 — https://openai.com/api/pricing/

### 3.2 Wzorce i antywzorce promptowania
`10-3x2_wzorce_i_antywzorce_promptowania.md`

#### Otwarcie

Wejście przez codzienny kontrast: ten sam prompt („napraw ten test i dodaj brakujący edge case") wklejony do chata daje odpowiedź tekstową; wklejony do agenta uruchamia wielominutową sesję z edycjami, testami i commitem. Most z `3.1`: skoro model nie „wie" i halucynuje, to prompt agenta musi być kontraktem, który prowadzi autonomiczną pętlę — nie jednorazowym pytaniem. Pivot: promptowanie agenta to inna dyscyplina niż promptowanie chatbota.

#### Główne tezy

- Właścicielem rozróżnienia „prompt chatbota vs prompt agenta" jest właśnie `3.2`. Trzy fundamentalne różnice: czas trwania (minuty/godziny vs jedna tura), efekty uboczne (edycje plików, komendy, API calls), pętla korekcyjna (prompt jako kontrakt OODA, nie jednorazowa instrukcja).
- Anatomia prompta (rola, kontekst, instrukcja, ograniczenia, oczekiwane wyjście) zostaje, ale hierarchia się odwraca: dla agentów najważniejsze są kryteria sukcesu i ograniczenia (czego NIE robić), a rola traci na znaczeniu. Dla reasoning models osobna podsekcja: zero few-shot, zero role, czyste cele + constrainy.
- Właścicielem tematu antywzorców promptowania jest ta lekcja. Pięć zabójców: (1) „zrób to dobrze" bez constrainów, (2) przeładowanie kontekstu całym repo, (3) „sprawdź swoją pracę" bez kryteriów weryfikacji, (4) step-by-step dla reasoning models, (5) jeden wielki plik instrukcji wypychający z kontekstu właściwe zadanie.
- Właścicielem tematu plików instrukcji jako trwałego promptu (CLAUDE.md, Cursor Rules, AGENTS.md) jest `3.2` — w zakresie zasad pisania skutecznych instrukcji. Operacyjne szczegóły konfiguracji zostają w `2.2` i `2.3`.
- Lekcja nie wchodzi w meta-prompting, brainstorming, metodę sokratejską (to kurs główny), nie wchodzi w zarządzanie cyklem życia wątku i compact/clear (to `3.3`), nie robi przeglądu technik promptowania a la cookbook.
- Najmocniejszy actionable: zanim napiszesz prompt dla agenta, odpowiedz na pytanie „po czym agent pozna, że skończył i że zrobił dobrze?"

#### Źródła

- Prompt engineering overview / Anthropic Docs / 2025 — https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- GPT-4.1 Prompting Guide / OpenAI Cookbook / 2025 — https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide
- Reasoning best practices / OpenAI Docs / 2025 — https://developers.openai.com/api/docs/guides/reasoning-best-practices
- Effective context engineering for AI agents / Anthropic Engineering / 2025-09-29 — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Agentic Engineering Patterns / Simon Willison / 2026-02-23 — https://simonwillison.net/guides/agentic-engineering-patterns/
- AGENTS.md / agentsmd / GitHub — https://github.com/agentsmd/agents.md
- Chain of Draft: Thinking Faster by Writing Less / Xu et al. / arXiv 2502.18600 / 2025 — https://arxiv.org/abs/2502.18600

### 3.3 Cykl życia wątku i zarządzanie kontekstem
`11-3x3_cykl_zycia_watku_i_zarzadzanie_kontekstem.md`

#### Otwarcie

Wejście przez codzienną scenę degradacji: agent, który po czterdziestu minutach pracy powtarza się, gubi nazwy plików i „odkrywa" na nowo informacje, które sam znalazł trzy tury wcześniej. Moment pivot: problemem nie jest model ani prompt, tylko zużyty kontekst. Most z `3.2`: dobry prompt to warunek konieczny, ale nie wystarczający — jeśli kontekst wokół prompta jest zaśmiecony, nawet najlepszy prompt nie pomoże.

#### Główne tezy

- Właścicielem tematu context engineering jako dyscypliny jest właśnie `3.3`. To nie prompt engineering z nową nazwą, tylko projektowanie systemów dostarczania kontekstu: co wchodzi do okna, kiedy, w jakiej formie i jak się z niego pozbyć. Definicje Karpathy'ego i Chase'a ustawiają ramę.
- Właścicielem tematu czterech strategii context engineeringu (Write, Select, Compress, Isolate) jest ta lekcja — w zakresie modelu mentalnego i reguł kciuka. Operacyjne szczegóły narzędzi (jak dokładnie działa `/compact` w Claude Code) zostają w `2.3`.
- Właścicielem decyzji operacyjnych `/compact` vs `/clear` vs nowy wątek vs `/rewind` jest `3.3`. Lekcja `2.3` wymienia te komendy jako obowiązkowe minimum; `3.3` uczy, kiedy i dlaczego podjąć każdą z tych decyzji.
- Właścicielem tematu sygnałów degradacji kontekstu (agent się powtarza, gubi ścieżki, zwalnia, generuje hedging) jest ta lekcja. Lekcja `3.1` wprowadza context rot jako pojęcie; `3.3` daje operacyjne sygnały i decyzje.
- Właścicielem tematu izolacji kontekstu przez subagentów i pamięci zewnętrznej (scratchpady, notatki w plikach, CLAUDE.md jako persistent memory) jest `3.3` — w zakresie wzorca i modelu mentalnego. Szczegóły konfiguracji subagentów to kurs główny (M1).
- Właścicielem rozróżnienia kompakcja (odwracalna) vs sumaryzacja (stratna) jest ta lekcja.
- Lekcja nie powtarza badań o context rot z `3.1` (tylko krótkie odesłanie), nie uczy Cursora / Claude Code operacyjnie (to `2.2`/`2.3`), nie wchodzi w MCP, hooks ani skills (to M1).
- Najmocniejszy actionable: kiedy zobaczysz 2+ sygnałów degradacji, nie naprawiaj prompta — zdecyduj: `/compact <co zachować>`, `/clear` + lepszy prompt, albo nowy wątek z commitniętą wiedzą.

#### Źródła

- Context engineering (Andrej Karpathy, post on X) / 2025-06-25 — https://x.com/karpathy/status/1937902205765607626
- The rise of context engineering / Harrison Chase / LangChain / 2025-06-23 — https://www.langchain.com/blog/the-rise-of-context-engineering
- Context Engineering for Agents / LangChain / 2025-07-02 — https://www.langchain.com/blog/context-engineering-for-agents
- Effective context engineering for AI agents / Anthropic Engineering / 2025-09-29 — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Context Engineering for AI Agents: Part 2 / Philipp Schmid / 2025-12-04 — https://www.philschmid.de/context-engineering-part-2
- Using Claude Code: session management and 1M context / Thariq Shihipar / 2026-04-15 — https://claude.com/blog/using-claude-code-session-management-and-1m-context
- Best practices for coding with agents / Lee Robinson / Cursor / 2026-01-09 — https://cursor.com/blog/agent-best-practices

### 3.4 Język pracy z AI
`12-3x4_jezyk_pracy_z_ai.md`

#### Otwarcie

Wejście jako naturalny most po `3.1`: skoro kontekst kosztuje i łatwo go przeładować, to jednym z praktycznych pytań staje się język pracy z modelem. Lekcja nie zaczyna od ogólnej sceny z agentem, tylko od decyzji operacyjnej: po polsku czy po angielsku i dlaczego w 2026 roku domyślnym wyborem dla operatora pozostaje angielski.

#### Główne tezy

- Domyślny język pracy z AI we wszystkim (komendy, instrukcje, planowanie, dyskusje) to angielski, ponieważ jest tańszy i precyzyjniejszy (lepiej mapuje się na stack technologiczny).
- Tokenizacja ma twardy koszt: polski jest często 1.5–2× droższy tokenowo (wyższe fertility ratio w BPE), więc wymuszanie polskiego przyspiesza wyczerpywanie budżetu okna i context rot w długich sesjach.
- Polski nie jest "zabroniony" – rozumienie języka przez modele jest świetne (OneRuler 2025). Można go stosować, kiedy angielski stanowi barierę w swobodnej eksploracji lub w komunikacji całego zespołu. Należy jednak robić to ze świadomością ekonomicznych trade-offów.
- Reguły kciuka (heurystyki): używaj angielskiego jako domyślnego interfejsu (tak jak używasz go w nazwach zmiennych czy komendach gita), a polskiego traktuj jako świadome, droższe ułatwienie.
- Najmocniejsza reguła operacyjna: default to English; use Polish if it removes friction, but know the token price.

#### Źródła

- *One ruler to measure them all: Benchmarking multilingual long-context language models* / Kim et al. / COLM 2025
- *Advancing Polish Language Modeling through Tokenizer Optimization in the Bielik v3 7B and 11B Series* / SpeakLeash / 2026
- *Language Model Tokenizers Introduce Unfairness Between Languages* / Petrov et al. / 2023
- Multilingual support / Anthropic Claude API Docs
- Reasoning best practices / OpenAI API Docs

### 3.5 Rekomendowane modele i jak być na bieżąco
`13-3x5_rekomendowane_modele_i_jak_byc_na_biezaco.md`

#### Otwarcie

Wejście jako most z `3.4`: skoro wiesz już, w jakim języku rozmawiać z agentem, ostatnia decyzja operacyjna przed M1 to wybór modelu. Krótka scenka: uczestnik otwiera dropdown w Cursorze i widzi trzydzieści nazw. Pivot: w 2026 roku nie szukamy „najlepszego" - dobieramy tier do zadania i uczymy się czytać rankingi ze świadomością, że one kłamią. Lekcja zamyka moduł 3 i pełni funkcję onrampu do ebooka „Rankingi modeli AI kłamią", który jest pełnym deep dive'em na te same tematy.

#### Główne tezy

- Właścicielem rekomendacji modeli na start M1 jest `3.5`. Konkretne nazwy (Sonnet 4.6, Opus 4.7, Composer 2) mają datę ważności krótszą niż prework — kursowy kanał aktualizacji modeli na Circle jest długoterminowym źródłem prawdy.
- Właścicielem ramy tierów (tani / średni / premium) jest `3.5`. Mental model spójny z ebookiem: Koder do szybkiej egzekucji w znanych zadaniach, Architekt do planu i decyzji pod niepewnością. `3.1` mówi *kiedy* sięgać po reasoning, `3.5` mówi *co* ustawić operacyjnie.
- Właścicielem dedykowanego rozdziału o benchmarkach w preworku jest `3.5`. Kluczowe pojęcia: pass@1 vs pass^k (0,9⁵ = 0,59), saturacja i kontaminacja (SWE-bench Verified wycofany przez OpenAI w lutym 2026), luka trafności konstruktu (FeatureBench: 74% na bugfixach vs 11% na feature'ach w Claude Opus 4.5), cykl życia benchmarku 12-18 miesięcy. Lekcja daje onramp; pełne ujęcie pięciu problemów strukturalnych + dziennik decyzji żyje w ebooku.
- Właścicielem tematu „jak być na bieżąco bez FOMO" jest `3.5`. Hierarchia sygnału: oficjalne blogi laboratoriów > rankingi użycia (OpenRouter, Copilot Arena, LM Arena) > syntetyczne benchmarki. Najmocniejsza reguła (przejęta wprost z ebooka): jedno popołudnie z 10 zadaniami z twojego repo daje więcej sygnału niż tydzień czytania leaderboardów.
- Lekcja świadomie nie robi: szczegółowego pricing breakdown (to Rozdział 8 ebooka), frameworków ewaluacji (Rozdział 6), ważonej karty decyzyjnej (Rozdział 9), tutoriala konfiguracji modeli w Cursorze (`2.2`) ani w Claude Code (`2.3`).
- Najmocniejszy actionable: ustaw Sonnet 4.6 jako default w obu narzędziach, Opus 4.7 trzymaj na trudne decyzje, w Cursorze Composer 2 do szybkich edycji. Subskrybuj *jeden* kanał update'ów + kursowy kanał na Circle. A jeśli chcesz wiedzieć, co naprawdę działa u ciebie - weź 10 ticketów z ostatnich tygodni i przepuść je przez dwa kandydackie modele. Resztę odpuść. Pełen deep dive: ebook „Rankingi modeli AI kłamią".

#### Źródła

- *Rankingi modeli AI kłamią* (ebook 10xDevs 3.0) — `src/content/resources/10xdevs3-ebook.md` (wewnętrzny materiał rozszerzający; linkowany jako „Materiały dodatkowe")
- *Separating code reasoning and editing* / Paul Gauthier / Aider / 2024-09-26 — https://aider.chat/2024/09/26/architect.html
- *Claude Code model configuration* / Anthropic Help Center / 2026 — https://support.claude.com/en/articles/11940350-claude-code-model-configuration
- *Models overview* / Claude API Docs / 2026 — https://platform.claude.com/docs/en/about-claude/models/overview
- *Cursor — Models* / Cursor Docs / 2026 — https://cursor.com/docs/models
- *Composer 2* / Cursor Blog / 2026 — https://cursor.com/blog/composer-2
- *SWE-bench Pro Leaderboard* / Scale AI SEAL / 2026 — https://scale.com/leaderboard/swe_bench_pro_public
- *SWE-rebench* / 2026 — https://swe-rebench.com
- *FeatureBench* / ICLR 2026 — https://arxiv.org/abs/2602.10975
- *Chatbot Arena Leaderboard* / 2026 — https://lmarena.ai/leaderboard
- *OpenRouter rankings — Programming* / 2026 — https://openrouter.ai/rankings/programming?view=month

## Moduł 4. Przygotowania do projektu

### 4.1 Tech Stack Overview
`14-4x1_tech_stack_overview.md`

#### Otwarcie

Wejście przez dwie typowe obawy, z którymi uczestnik wchodzi do bloku 4 po modułach 1–3: „nie znam Astro / Supabase / Cloudflare — dam radę na kursie?" i „a jeśli wolę Next.js / .NET / Pythona — to gorzej?". Most z modułu 3: skoro kontekst, typy i konwencje decydują o jakości pracy agenta, to każdy stack spełniający te kryteria jest dobrym środowiskiem do kursu. Pivot redakcyjny względem poprzedniej wersji: lekcja nie narzuca kursowego stacku jako jedynego słusznego, tylko pozycjonuje go jako **rekomendację z pełnym wsparciem mentorskim**, a decyzję o projekcie i stacku wyraźnie przekazuje do `4.2` i Modułu 1.

#### Główne tezy

- Właścicielem tematu w tej lekcji jest orientacja w temacie tech stacku dla kursu — mapa mentalna złożona z trzech elementów: (a) czterech agnostycznych kryteriów agent-friendly, (b) konkretnej rekomendacji kursowej, (c) realnych alternatyw w JS/TS i poza JS/TS. Nie tutorial, nie kurs od zera.
- Właścicielem czterech kryteriów agent-friendly stacku (typowany, konwencyjny, popularny w danych treningowych, dobrze udokumentowany) jest `4.1`. Kryteria są technologicznie agnostyczne — uczestnik używa ich do oceny dowolnego frameworka, nie tylko kursowego.
- Kursowy stack (Astro, React, TypeScript, Tailwind, Supabase, Cloudflare) to **nasza rekomendacja** i ścieżka z pełnym wsparciem — nie warunek ukończenia kursu.
- Właścicielem mapy alternatyw jest `4.1`. Warstwa 1 (JS/TS): Next.js / Remix / SvelteKit / Nuxt + Hono / tRPC / Fastify / NestJS + Vercel / Fly.io / Railway / Render. Warstwa 2 (poza JS/TS): Java/Spring Boot, .NET/ASP.NET Core, PHP/Laravel lub Symfony, Python/FastAPI + Django. Każda z oceną przez pryzmat czterech kryteriów.
- Lekcja świadomie nie uczy żadnej z tych technologii od zera, nie porównuje „kto lepszy" między alternatywami i nie finalizuje wyboru projektu — to zadanie `4.2` i M1.
- Najmocniejszy actionable — trzy ścieżki: (a) bez preferencji → sklonuj 10x-astro-starter, (b) ulubiony stack w JS/TS → zweryfikuj przez cztery kryteria, (c) produkcyjny Java/.NET/PHP/Python → wybierz framework spełniający kryteria (Spring Boot / ASP.NET Core / Laravel / FastAPI / Django) i ruszaj.

#### Źródła

- *Why Astro* / Astro Docs — https://docs.astro.build/en/concepts/why-astro/
- *Astro Islands* / Astro Docs — https://docs.astro.build/en/concepts/islands/
- *Thinking in React* / React Docs — https://react.dev/learn/thinking-in-react
- *TypeScript Handbook* / TypeScript Docs — https://www.typescriptlang.org/docs/handbook/intro.html
- *Utility-First Fundamentals* / Tailwind CSS Docs — https://tailwindcss.com/docs/styling-with-utility-classes
- *Getting Started with Supabase* / Supabase Docs — https://supabase.com/docs/guides/getting-started
- *Deploy an Astro Site to Cloudflare Pages* / Cloudflare Docs — https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- *@astrojs/cloudflare adapter* / Astro Docs — https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- *Next.js Docs* — https://nextjs.org/docs
- *Spring Boot Reference Documentation* — https://docs.spring.io/spring-boot/
- *ASP.NET Core Documentation* / Microsoft — https://learn.microsoft.com/en-us/aspnet/core/
- *Laravel Documentation* — https://laravel.com/docs
- *FastAPI Documentation* / Sebastián Ramírez — https://fastapi.tiangolo.com/
- *Django Documentation* — https://docs.djangoproject.com/

### 4.2 Dobry i zły projekt kursowy
`15-4x2_dobry_i_zly_projekt_kursowy.md`

#### Otwarcie

Wejście przez moment po lekcji `4.1`: uczestnik już wie, że stack jest wyborem, a nie testem lojalności wobec kursu, ale nadal ma większe pytanie — "co właściwie mam zbudować?". Pivot: dobry projekt kursowy nie jest tym, który wygląda najbardziej imponująco w opisie, tylko tym, który szybko daje pierwszy działający przepływ, mieści się w budżecie czasu i naturalnie spełnia kryteria zaliczenia. Lekcja ma uspokoić wobec certyfikacji, ale jednocześnie ostro obciąć projekty z wysokim progiem zero-to-one.

#### Główne tezy

- Właścicielem tematu wyboru projektu kursowego jest `4.2`. `4.1` mówi o stacku, `4.3` domknie checklistę startową i support, a ta lekcja odpowiada na pytanie: jaki projekt warto wybrać, żeby dowieźć go razem z kursem.
- Dobry projekt kursowy to małe MVP na 1-2 kluczowe przepływy użytkownika, nie rozbudowana wizja produktu. Najważniejsze jest szybkie dojście do pierwszej wersji, którą da się kliknąć, użyć albo sprawdzić.
- Właścicielem rozróżnienia "dobry projekt" vs "zły projekt" jest ta lekcja. Dobry projekt ma użytkownika, dane, decyzję domenową i weryfikowalny wynik. Zły projekt ma wysoki próg zero-to-one, za duże MVP albo pusty CRUD bez logiki biznesowej.
- Właścicielem minimalnego omówienia wymagań certyfikacyjnych jest `4.2` w zakresie interpretacji projektowej: kontrola dostępu, zarządzanie danymi, logika biznesowa, artefakty projektowe, test z perspektywy użytkownika i CI/CD. Szczegółowa administracyjna checklista zostaje dla `4.3`.
- Lekcja ma jasno podać aktualne terminy składania projektów dla tej edycji: koniec szkolenia 19 czerwca 2026; 1. termin 5 lipca 2026 (oceny do 19 lipca); 2. termin 10 sierpnia 2026 (oceny do 25 sierpnia); 3. termin 14 września 2026 (oceny do 30 września).
- Lekcja nie odwołuje się do formularza zgłoszeniowego. Finalna decyzja o projekcie i stacku może zapaść w pierwszym tygodniu kursu.
- Demo Daye z poprzednich edycji mogą pojawić się jako opcjonalna inspiracja: uczestnik może obejrzeć prezentacje absolwentów i wypisać wzorce dobrych projektów, ale nie jest to obowiązkowy krok.
- Najmocniejsza reguła decyzyjna: jeśli pierwszy działający przepływ wymaga więcej niż tygodnia pracy po godzinach, zmniejsz MVP. Safety check: czy potrafisz wyjaśnić logikę biznesową projektu w jednym zdaniu.
- Główny artefakt lekcji: tabela "dobry vs zły projekt" oraz mini-scorecard pomysłu, który uczestnik może zastosować do własnej propozycji.

#### Źródła

- Demo Day 10xDevs — projekty absolwentów 1. edycji — https://www.youtube.com/watch?v=b-gOI128G2s
- Demo Day 10xDevs — projekty absolwentów 2. edycji — https://www.youtube.com/watch?v=duTuGy1xF-Q

### 4.3 Checklista uczestnika i support (Circle)
`16-4x3_checklista_uczestnika_i_support.md`

#### Otwarcie

Wejście jako domknięcie preworku: uczestnik nie potrzebuje kolejnej lekcji koncepcyjnej, tylko krótkiego sprawdzenia gotowości na start M1. Nie weryfikujemy dostępu do preworku, bo czytelnik ma go z poziomu Circle; akcent przenosi się na informację, że pełne przestrzenie programu będą dostępne od 18 maja 2026, oraz na przygotowanie setupu agentowego i kanałów wsparcia.

#### Główne tezy

- Właścicielem administracyjnej checklisty startowej jest `4.3`. Lekcja ma być krótka, checklistowa i organizacyjna, a nie technicznym deep dive'em.
- Lekcja świadomie nie powtarza wyboru środowiska z `2.1`, modeli z `3.5`, stacku z `4.1` ani projektu kursowego z `4.2`. Odsyła do tych lekcji tam, gdzie uczestnik potrzebuje wrócić po decyzję.
- Uczestnik powinien wejść w M1 z działającym narzędziem agentowym (`Cursor`, `Claude Code`, `Codex` lub alternatywa), a nie tylko z chatbotem w przeglądarce.
- Właścicielem praktycznej informacji kosztowej jest ta lekcja w minimalnym zakresie: subskrypcja od 18 maja albo świadome API, z ostrzeżeniem, że intensywne użycie API może przekroczyć 20 dolarów miesięcznie. Szczegóły wyboru modeli zostają w `3.5`.
- Lekcja jasno rozdziela wsparcie programowe/merytoryczne na Circle (Marcin, Przemek) od spraw administracyjnych (email `10xdevs@brave.courses` albo Kasia Wojdyła).
- Główny artefakt lekcji: checklista przed 18 maja oraz lista najważniejszych linków Circle.
- Zamknięcie ma pełnić funkcję ostatniego zdania całego preworku: widzimy się od 18 maja 2026 w Module 1 10xDevs 3.0.

#### Źródła

- Platforma Circle — https://bravecourses.circle.so/
- Informacje i ogłoszenia 10x3 (PL) — https://bravecourses.circle.so/c/informacje-i-ogloszenia-10x3/
- Information 10x3 (ENG) — https://bravecourses.circle.so/c/information-10x3-4234b2/
- Profil Marcina na Circle — https://bravecourses.circle.so/u/4310ac79
- Profil Przemka na Circle — https://bravecourses.circle.so/u/8d71f6f1
- Profil Kasi Wojdyły na Circle — https://bravecourses.circle.so/u/2f493310
