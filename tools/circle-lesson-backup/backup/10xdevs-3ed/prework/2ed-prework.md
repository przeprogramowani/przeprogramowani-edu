# Prework (0x) — szczegółowe podsumowanie

---

## 0x1 — Generative AI dla programisty

Lekcja otwierająca szkolenie 10xDevs. Przedstawia plan pięciu modułów obejmujących teorię, pracę projektową, spotkania LIVE i wymianę doświadczeń ze społecznością. Na start uczestnicy poznają najważniejsze aspekty Generative AI w kontekście programowania — czym jest AI generatywne, jak działają modele językowe i czym różnią się od usług dostępnych dla użytkownika końcowego (np. ChatGPT vs API OpenAI).

Kluczowym tematem jest wbudowana nieprzewidywalność narzędzi opartych na LLM — lekcja uczy, jak ją opanować i czego się spodziewać pracując z modelami. Materiał wideo stanowi główną oś lekcji, a całość jest zaprojektowana jako punkt wejścia dla osób z różnym poziomem doświadczenia z AI.

Dla chętnych przygotowano zestaw pogłębionych materiałów: wykład Andreja Karpathy'ego o działaniu LLM-ów, interaktywna wizualizacja architektury Transformer, blog Sebastiana Raschki z przeglądem badań, publikacje Ethana Mollicka o wpływie AI na codzienność, notatki Simona Willisona oraz codzienny newsletter smol.ai i autorski podcast Opanuj.AI.

---

## 0x2 — Przegląd asystentów AI w przeglądarce

Lekcja omawia webowe aplikacje AI (ChatGPT, Claude, Gemini, Perplexity) jako najszybszy sposób na eksperymenty bez konfiguracji — wystarczy przeglądarka i konto. Przedstawia ich kluczowe możliwości: upload plików (PDF/CSV), przeszukiwanie internetu z cytatami (Deep Research), generowanie obrazów, tworzenie customowych asystentów (GPTs) oraz iteracyjny styl pracy z natychmiastowym feedbackiem. Zwraca uwagę na ograniczenia — brak masowej automatyzacji, wolniejsze działanie sandboxów i kwestie prywatności (domyślne trenowanie na danych, opcje wyłączenia, plany Enterprise).

Szczegółowo porównuje cztery narzędzia: **ChatGPT** (9/10) — najbardziej wszechstronne, dojrzały ekosystem GPT Store, Canvas do współpracy, interpreter kodu; **Claude** (9/10) — ogromne okno kontekstowe (do 1M tokenów), wysoka jakość kodu, Projects z cache'owaniem, artefakty HTML/JS/SVG; **Gemini** (9/10) — natywna integracja z Google Workspace, konkurencyjny cennik z 2TB w Google One, generowanie grafik (Nano Banana); **Perplexity** (7/10) — wyspecjalizowany silnik odpowiedzi z precyzyjnymi cytatami do źródeł, najlepszy do researchu.

Lekcja wskazuje konkretne scenariusze, gdzie webowe AI ma przewagę nad narzędziami w IDE/terminalu: generowanie specyfikacji PRD, eksploracja domeny biznesowej, projektowanie architektury (diagramy Mermaid/PlantUML), podsumowywanie długich dokumentów, brainstorming, research zastępujący tradycyjne wyszukiwanie, analiza danych z plików. Zawiera opcjonalne ćwiczenia praktyczne z arkuszem ewaluacyjnym CSV (podsumowanie PDF, research z cytatami, analiza funnelu z CSV, Deep Research, tworzenie PRD z opisu MVP).

---

## 0x3 — Przegląd AI w edytorach i IDE

Lekcja definiuje 5 komponentów AI w IDE: **inline completions** (autouzupełnianie z kontekstu), **chat** (konwersacyjny asystent do wyjaśnień i debugowania), **code actions** (zautomatyzowane refaktory, generatory testów), **repo-level context** (indeksowanie bazy, wyszukiwanie semantyczne) oraz **agenci** (planowanie, edycje wieloplikowe, walidacja testami). Opisuje ewolucję od Code Assistant (pasywne podpowiedzi) przez Copilot (reaktywny chat) do Agenta (autonomiczne planowanie, edycja wielu plików, uruchamianie testów). Rola programisty przesuwa się z wykonawcy na nadzorcę/stratega.

Porównuje cztery dominujące rozwiązania: **VS Code + GitHub Copilot** (6/10) — rynkowy standard z dojrzałą integracją GitHub (Issues/PR/Actions), IP indemnity, ale słabsza warstwa agentowa i brak trybu offline; **JetBrains AI + Junie** (7/10) — precyzyjne refaktory dzięki PSI (Program Structure Interface), wsparcie lokalnych modeli (Ollama/LM Studio), opcje on-prem/air-gapped; **Cursor** (9/10) — AI-native fork VS Code, mocne multi-file edits, szybki Tab, reguły repo (.cursor/rules), szeroki wybór modeli, ale wyłącznie chmurowy; **Windsurf** (8/10) — agentowe przepływy plan→patch→review, dobry stosunek cena/jakość (~$15/mies.), lokalne indeksowanie, ale niepewność organizacyjna po przejęciu przez Google/Cognition.

Lekcja omawia też dwie szkoły kontekstu: **RAG nad repo** (Copilot, Cursor, Windsurf — skaluje się do dużych baz, ale wrażliwy na "długoogonowe" zależności) vs **model struktury kodu PSI** (JetBrains — precyzyjne rozumienie zależności symboli). Porusza kwestie wydajności (latencja inline krytyczna dla flow), TCO (limity żądań, kontrola kosztów per dev), bezpieczeństwa (SSO/SAML, RBAC, zero-retention, IP indemnity) i skalowania patchy agentowych (checkpointy, mniejsze commity, testy regresji). Zawiera ćwiczenia: inline sprint (memoize z TTL), nawigacja po repo (wyszukiwanie semantyczne), debug loop (stacktrace → fix).

---

## 0x4 — Przegląd agentów AI w terminalu

AI w terminalu to "pair programming" bez opuszczania linii komend — narzędzia działają tam, gdzie już jest git, testy i kompilatory, skracając pętlę czytam→zmieniam→uruchamiam. Agent CLI czyta logi i kod, proponuje poprawki w wielu plikach, uruchamia testy, iteruje aż do zielonego buildu i tworzy gałąź z PR — a programista kontroluje proces, widząc diffy i zatwierdzając zmiany. Kluczowa przewaga nad IDE to praca headless (serwery, CI/CD) i łatwość skryptowania. Najlepsze zastosowania: onboarding do nowego repo, refaktoryzacja cross-file, implementacja modułów CRUD, generowanie testów, debug ze stack trace, migracje zależności, code review i dokumentacja.

Porównanie pięciu narzędzi: **Claude Code** (9/10) — "ciężkie działa" do dużych repo, szeroki kontekst i dojrzałe przepływy ReAct, integracja z ekosystemem Anthropic (Team/Enterprise, SSO/RBAC), wymaga chmury; **Codex CLI** (8.5/10) — "ChatGPT w powłoce", naturalny wybór dla ekosystemu OpenAI, dobiera model do zadania, dojrzała integracja z GitHub i IDE; **Gemini CLI** (8/10) — multimodalność i wbudowane narzędzia (search/scraping/shell), OAuth, integracje z Google Cloud; **OpenCode** (8/10) — open-source (MIT), brak lock-in, działa z lokalnymi modelami (Ollama/LM Studio), tryb on-prem/air-gapped, wymaga więcej konfiguracji; **aider** (6/10) — minimalistyczny, precyzyjne diffy i auto-commity, świadomie bez uruchamiania testów i web search, najniższy koszt tokenów.

Lekcja wyjaśnia wzorzec **ReAct (Reason + Act)** — agent uruchamia polecenia systemowe, czyta logi, diagnozuje, poprawia i ponownie odpala testy w jednej sesji. Podkreśla znaczenie kontroli zmian (diff przed zapisem, auto-apply) i integracji (MCP — zewnętrzne narzędzia, VS Code/JetBrains). Kryteria wyboru: rozmiar repo, polityka danych (chmura vs on-prem), potrzebne integracje, budżet i oczekiwany poziom automatyzacji.

---

## 0x5 — Przegląd agentów asynchronicznych

Agenci asynchroniczni to narzędzia, które samodzielnie wykonują zadania w repozytorium: klonują projekt, tworzą branch, wprowadzają zmiany i otwierają PR do review — deweloper pozostaje w pętli decyzyjnej (HITL), ale nie musi nadzorować każdego kroku na żywo. Obsługują pełny cykl issue→plan→zmiany→PR→review z widocznością kroków i logów. Kluczowe możliwości: automatyczne branch/commit/PR dla zmian repo-wide, plan do zatwierdzenia (HITL), wykonywanie komend w sandboxie (build/linters/testy) z iteracją aż do zielonego CI, równoległe zadania i lepszy kontekst repo (AGENTS.md, indeksacja kodu).

Cztery porównywane narzędzia: **OpenAI Codex** — uruchamiany z czatu ChatGPT, agent ładuje repo do sandboxa, wykonuje komendy i otwiera PR, najlepszy do krótkich ad-hoc zadań (1-30 min), w pakiecie z ChatGPT Plus ($20/mies.); **Google Jules** — GitHub-first, reaguje na etykiety/komentarze w issue, generuje plan do akceptacji, świetny do seryjnych prac utrzymaniowych, darmowe 15 zadań/dzień (Intro) lub 100/dzień (Pro, $19.99/mies.); **GitHub Copilot Agent Mode** — natywny w ekosystemie GitHub, respektuje branch protection, pełny ślad audytowy w PR/Actions, SSO/SAML "po prostu działają", idealny dla enterprise; **Devin** — pełne środowisko (shell+edytor+przeglądarka), długie sesje, integracje ze Slack/Linear/Jira, opcje enterprise/self-host, od ~$500/mies.

Lekcja podkreśla, że efektywność agentów zależy od przygotowania repo — stabilne CI, dobre testy, pliki konfiguracyjne (AGENTS.md). Typowe przebiegi trwają 1-30 minut. Dane przetwarzane są w chmurze z różnymi politykami prywatności (warianty enterprise bez trenowania na danych klienta). Najlepsze zastosowania: bugfixy z automatycznym potwierdzeniem testami, implementacja od user story do PR, aktualizacje zależności w wielu plikach, podnoszenie pokrycia testami, uzupełnianie dokumentacji, "review-bot" i cykliczna higiena repo.

---

## 0x6 — Full-Stack Environment dla 10xDeva

Lekcja definiuje **10 cech projektu przyjaznego dla AI**, które decydują o jakości współpracy z LLM-ami: (1) jawne typowanie i spójne modele danych — TypeScript > JavaScript; (2) pliki i moduły jednego przeznaczenia (SRP) — AI łatwiej rozumie wyizolowane funkcje; (3) konwencje nad konfiguracją — przewidywalna struktura daje AI natychmiastowy kontekst; (4) semantyczne nazewnictwo — `calculateMonthlyPayment()` mówi więcej niż `calc()`; (5) testy automatyczne — żywa dokumentacja i feedback loop dla agentów; (6) formattery i lintery — natychmiastowy feedback loop redukujący manualne korekty; (7) zrozumiała historia zmian — konwencjonalne commity jako dodatkowy kontekst; (8) komentarze kontekstowe — wyjaśniają "dlaczego", nie "co"; (9) popularny stack technologiczny — więcej danych treningowych = lepsza jakość; (10) instrukcje dla AI — CLAUDE.md, Cursor Rules, Copilot Instructions, AGENTS.md.

Prezentuje **10x Astro Starter** — szablon repozytorium oparty na TypeScript, Astro, React, TailwindCSS i Supabase — jako bazę do projektu certyfikacyjnego. Wybór stosu jest uzasadniony powyższymi zasadami: TypeScript daje jawne typy, Astro i React to popularny ekosystem z bogatymi danymi treningowymi, Tailwind zapewnia konwencje, a Supabase dostarcza auth i bazę danych. Lekcja zawiera wideo z prezentacją kluczowych elementów startera i implementacją pierwszej full-stackowej funkcjonalności, a także pogłębiony tutorial Astro w Cursorze.

Lekcja jednocześnie podkreśla, że realizacja projektu w innym stosie jest całkowicie możliwa — starter to tylko jedna opcja, a omawiane techniki AI są niezależne od technologii. Różnica polega na zakresie wsparcia (dla niestandardowych stacków więcej pomocy od społeczności niż od autorów). Zawiera linki do dokumentacji wszystkich używanych technologii (Astro, React, TypeScript, Tailwind, Supabase Auth) i zamyka część wprowadzającą zachętą do aktywnego udziału w społeczności platformy.
