# Moduł 1 (1x) — 10xWorkflow — szczegółowe podsumowanie

---

## 1x1 — Wybór modelu do programowania wspomaganego AI

Lekcja otwierająca moduł 10xWorkflow, poświęcona świadomemu dobieraniu modeli AI do programowania. Kluczowy wniosek: nie istnieje „jeden najlepszy model" — zamiast tego warto stosować zestaw dwóch typów. **Koder/Asystent** (Claude Sonnet 4.5, GPT-5-Codex, Gemini 2.5 Pro, grok-code-fast-1) do codziennych zadań jak generowanie kodu i testów, oraz **Architekt/model rozumujący** (GPT-5 z High Reasoning, Gemini 2.5 Pro) do złożonego planowania, analizy wymagań i debugowania. GPT-5 i Gemini 2.5 Pro wyróżniają się jako modele „hybrydowe" z różnymi trybami działania.

Lekcja szczegółowo omawia dwa modele rozliczeń: **Flat Rate** (stała subskrypcja, np. Windsurf, Copilot) i coraz popularniejszy **Usage-Based Pricing** (płatność za tokeny, np. Cursor). W modelu za zużycie kluczowe jest strategiczne dobieranie modeli — tańsze do prostych zadań, droższe do złożonych. Różnice cenowe bywają 5-7-krotne (np. grok-code-fast-1 vs GPT-5-Codex). Lekcja wskazuje też oferty specjalne: Copilot z nielimitowanym GPT-4.1, Windsurf z SWE-1, darmowe modele Gemini przez ai.dev, oraz opcję darmowych tokenów OpenAI w zamian za udostępnienie danych.

Obszerny fragment poświęcony jest źródłom śledzenia trendów: **OpenRouter Rankings** (realny monitoring zapytań), **LM Arena** (anonimowe porównania modeli), benchmarki syntetyczne (LiveBench, SWE Bench, GPQA Diamond) — z wyraźnym ostrzeżeniem, że benchmarki nie przekładają się bezpośrednio na „vibe check" i mają liczne słabości (overfitting, brak różnorodności, zakażenie danych). Osobna sekcja omawia **modele lokalne** — opisane jako drastycznie uproszczone kopie oryginałów (1-26% pojemności), 5-10x wolniejsze, przydatne do nauki i prostego uzupełniania kodu, ale niepraktyczne w profesjonalnej pracy.

---

## 1x2 — Współpraca z AI w IDE

Lekcja praktyczna oparta na Cursorze (z alternatywami dla JetBrains). Rozpoczyna od konfiguracji: **Privacy Mode** (kluczowe ustawienie bezpieczeństwa), indeksowanie projektu, wybór modeli. Omawia plik **.cursorignore** do wyłączania wrażliwych plików z indeksu (z zastrzeżeniem, że Agent i tak może do nich sięgnąć — to „security by obscurity"). Odpowiedniki w innych narzędziach: .aiignore (JetBrains), .clineignore (Cline), ustawienia administracyjne (Copilot). Szczegółowo opisane są ustawienia prywatności dla Copilot, JetBrains AI i Cline.

Lekcja przechodzi przez główne tryby pracy: **Inline Edit** (edycja zaznaczenia, całego pliku, pytania o fragment), **Chat** (konwersacje read-only o projekcie — planowanie, analiza plików, przeszukiwanie historii Git), **Context Engineering** (zarządzanie kontekstem: pliki, foldery, historia Git, strony www, instrukcje; formatowanie promptów z tagami XML). Omówiona jest zmiana w Cursorze 0.48, gdzie @Codebase zastąpiono poleceniami w języku naturalnym. Kluczowe: **Custom Commands** (reużywalne prompty w repo, .cursor/commands/) i ich odpowiedniki: .github/prompts (Copilot z obsługą zmiennych), Prompt Library (JetBrains).

Duży rozdział poświęcony **instrukcjom dla AI** — stałym plikom tekstowym z konwencjami projektu (reguły kodowania, frameworki, wersje). Opisano lokalizacje: .cursor/rules, .github/instructions, .aiassistant/rules, .junie/guidelines.md, .windsurf/rules. Omówiony standard **AGENTS.md** (poparcie OpenAI i Cursora, sprzeciw Anthropic z CLAUDE.md) i jego ograniczenie — jeden plik utrudnia skalowanie reguł. Sekcja o AI w **JetBrains** wskazuje na pluginy z trybem agentowym (Cline, Windsurf, Junie) i Claude Code jako rekomendowane opcje. Ćwiczenia: implementacja banking.ts z testami, analiza specyfikacji z porównaniem modeli.

---

## 1x3 — Współpraca z AI w terminalu

Najobszerniejsza lekcja modułu, poświęcona **Claude Code** jako głównemu narzędziu AI w terminalu. Rozpoczyna od instalacji (npm, Node.js v18+), planów cenowych (Pro $20, Max 5x $100, Max 20x $200 — limity resetowane co 5h) i porównania subskrypcji vs klucz API (średnio ~$6/dzień, Opus 5x droższy od Sonneta). Szczegółowe wskazówki kto powinien wybrać jaki plan. Onboarding: /init (tworzenie CLAUDE.md), /terminal-setup (Shift+Enter), /ide (integracja z edytorem).

Dużo miejsca poświęcone **zarządzaniu kontekstem**: /context (podgląd zużycia tokenów), /compact (kompresja historii — z zastrzeżeniem, że czasem traci istotne informacje), /clear (reset konwersacji). Kluczowe zasady: im mniejszy kontekst, tym lepsza efektywność i wolniejsze zużywanie limitów. Szczegółowo opisany **system uprawnień**: tryby default/acceptEdits/plan/bypassPermissions, konfiguracja allow/ask/deny w .claude/settings.json (projektowe i globalne), blokowanie plików wrażliwych (.env, secrets). Omówiony **Plan Mode** (Shift+Tab x2) z rekomendacją: Sonnet do bieżącej pracy, Opus do planowania.

Sekcja o automatyzacji: **Custom Commands** (.claude/commands/), **Hooks** (skrypty przed/po zdarzeniach — np. notyfikacja po zakończeniu), **Subagenci** (wyspecjalizowane instancje AI z własnym kontekstem — eksperymentalne, z ograniczeniami: izolowany kontekst, wysokie zużycie tokenów), **Claude Code SDK** (Headless/TypeScript/Python). Porównanie alternatyw: **Codex CLI** (Rust, open-source, mediana 5s/zadanie, multimodalne UI), **Gemini CLI** (darmowe do 1000 żądań/dzień, 1M tokenów kontekstu, multimodalność), **OpenCode** (Go/TS, provider-agnostic, 75+ modeli, self-hosting). Omówiony też **claude-code-router** do routingu zapytań przez OpenRouter do dowolnych modeli.

---

## 1x4 — Współpraca z agentem AI

Lekcja wyjaśniająca różnicę między chatbotami a agentami AI. Chatboty (ChatGPT, Claude.ai) działają z dala od kontekstu projektu — fragmenty kodu trzeba dostarczać ręcznie, a wdrażanie sugestii jest żmudne (copy/paste). **Agenci AI** idą dalej: korzystają z narzędzi, mają dostęp do systemu plików i wykonują realne akcje w projekcie. Kluczowy mechanizm to **Agent Loop** — iteracyjna pętla, w której model dobiera narzędzia, interpretuje wyniki i decyduje o kolejnych krokach, aż do uzyskania końcowej odpowiedzi.

Lekcja prezentuje praktyczne scenariusze z narzędziami wbudowanymi: generowanie mockowych danych, pobieranie aktualnej wiedzy z internetu, przeszukiwanie projektu w deterministyczny sposób. Szczegółowo omówiony **Model Context Protocol (MCP)** — protokół integracji zewnętrznych narzędzi z agentami AI w sposób jednolity i przewidywalny. Przykładowa konfiguracja .cursor/mcp.json dla serwerów lokalnych (npx) i zdalnych (URL). Odpowiedniki dla Copilot i JetBrains Junie.

Zaprezentowana usługa **Context7** jako przykład MCP w akcji — indeksuje oficjalną dokumentację frameworków, czyści z zbędnych elementów i umożliwia semantyczne wyszukiwanie aktualnych fragmentów dokumentacji. Dwa tryby: ręczne wyszukiwanie na context7.com lub automatyczne wstrzykiwanie przez MCP. Zalety: aktualna dokumentacja dopasowana do wersji, realne przykłady kodu, odfiltrowywanie szumu, darmowe dla indywidualnych użytkowników. Ćwiczenia: test wbudowanych narzędzi (pliki, terminal, web search), prompt z publicznym API (Rick and Morty), porównanie konwersacji z i bez Context7, instalacja własnego serwera MCP.

---

## 1x5 — Efektywna praca z AI, cz. 1

Lekcja o fundamentach komunikacji z modelami językowymi. Rozpoczyna od kontrowersyjnego pytania: **polski czy angielski?** Powołując się na badanie OneRuler (26 języków), wskazuje, że polski zajął 1. miejsce w zadaniach needle-in-a-haystack, wyprzedzając angielski (6. miejsce). Możliwe przyczyny: fleksyjność polskiego ułatwia modelom śledzenie zależności na dłuższym dystansie. Praktyczna rekomendacja: jeśli kontekst jest w danym języku, promptuj w tym samym języku; angielski ma przewagę przy programowaniu ze względu na dane treningowe.

Kluczowa technika to **meta-prompting** — wykorzystywanie AI do ulepszania własnych promptów. Zamiast pisać skomplikowany prompt od zera, podajemy modelowi zarys intencji i prosimy o stworzenie optymalnego promptu. To pozwala odkryć aspekty, o których sami byśmy nie pomyśleli. Kolejna technika: **Metoda Sokratejska** — odwrócenie ról, gdzie to AI zadaje pytania programiście, aby zebrać kontekst potrzebny do realizacji zadania. Zamiast pisać długi, wyczerpujący prompt, pozwalamy modelowi prowadzić wywiad i doprecyzowywać wymagania iteracyjnie.

Lekcja opisuje też typowe **antywzorce promptowania**: zbyt ogólne polecenia bez kontekstu, sugerowanie odpowiedzi w pytaniu, ignorowanie formatowania (brak tagów XML, brak struktury), pisanie „esejów" zamiast konkretnych instrukcji. Dla każdego antywzorca podane jest lepsze podejście. Ćwiczenia praktyczne oparte na repozytorium 10x-warmup z konkretnymi zadaniami testującymi każdą z technik.

---

## 1x6 — Efektywna praca z AI, cz. 2

Kontynuacja poprzedniej lekcji — pięć zaawansowanych technik pracy z AI. **Brainstorming i eksploracja rozwiązań**: zmiana podejścia z „jak to zrobić?" na „w ile sposobów można to zrobić?". AI jako doświadczony senior developer bez uprzedzeń wynikających z ostatnich projektów. Kluczowe: jasne ramy problemu, różnorodne perspektywy (architekt, tester, PM, security), iteracyjne drążenie od strategii do taktyk, dokumentowanie procesu w markdown. Ostrzeżenia przed zbyt wczesnym przejściem do implementacji, akceptowaniem pierwszej odpowiedzi i overthinkingiem.

**Planowanie zadań**: krytyka podejścia „zaimplementuj ten pomysł" bez szczegółowego planu. Skuteczne planowanie powinno kończyć się dokumentem Markdown ze specyfikacją. Opisany Plan Mode w Claude Code. Najlepsze praktyki: rewizja każdego planu przez programistę, modelowanie edge case'ów i scenariuszy błędów, planowanie testów równolegle z implementacją. **Promptowanie bez efektu potwierdzenia** (sycophancy): 5 technik wymuszających krytyczne myślenie — Adwokat diabła, Porównanie alternatyw, Analiza Pre-Mortem, Zmiana ról i perspektyw, Poszukiwanie „nieznanych niewiadomych".

**Ratowanie problematycznych konwersacji**: rozpoznanie momentu, gdy dialog staje się antyproduktywny (naprawianie jednej rzeczy psuje dwie kolejne). Strategia: konsolidacja wniosków, reset kontekstu, rozpoczęcie nowego wątku z odświeżonymi wymaganiami. **Wizualizacje tekstowe**: wykorzystanie AI do generowania diagramów ASCII, Mermaid i SVG bez walki z narzędziami graficznymi — dokumentacja techniczna i schematy tworzone bezpośrednio w konwersacji z modelem. Wszystkie techniki określone jako kluczowe dla modułów 2-3 (budowanie projektu od analizy wymagań po deployment).

---

## 1x7 — Mindset 10xDeva

Lekcja zamykająca moduł 1, definiująca dwa bieguny AI-assisted development. **Vibe coding** — generowanie kodu bez zrozumienia, poleganie na „magii" modeli, nadzieja że „jakoś to będzie". **Spec-driven development** — każde użycie AI ma jasny cel, wynik jest weryfikowany, model wspiera realizację wcześniej zdefiniowanych wymagań. Lekcja podkreśla, że utożsamianie AI-assisted development z vibe codingiem jest nietrafne i sprowadza dyskusje w złym kierunku. Większość programistów jest „gdzieś pośrodku", z nastawieniem bliższym spec-driven, ale brakami w wiedzy i umiejętnościach.

Omówione **fundamentalne ograniczenia LLM**: (1) trenowane na zamkniętych zbiorach danych, nie uczą się po zakończeniu treningu (in-context learning jako jedyny workaround); (2) dochodzą do odpowiedzi przez statystykę, nie logikę — ryzyko halucynacji i ograniczona innowacyjność/adaptacyjność (co jest przewagą ludzi); (3) ograniczone okno kontekstowe — deklarowane wartości dostawców trzeba dzielić przez 2-4x dla sensownych odpowiedzi.

Kluczowe przesłanie o **nadzorze nad AI**: AI nie pisze produkcyjnego kodu samodzielnie, programista jest i będzie niezbędny w każdym etapie procesu. Specjaliści muszą wiedzieć, jak zarządzać pracą autonomicznych narzędzi i brać pełną odpowiedzialność za commitowany kod. Lekcja zamyka pierwszy tydzień szkolenia i zapowiada moduły 2-3 (projekt certyfikacyjny), gdzie uczestnicy zastosują spec-driven development w praktyce.
