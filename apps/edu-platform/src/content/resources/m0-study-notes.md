# Notatki szkoleniowe — Agentic Software Engineering

Materiały wprowadzające przed egzaminami weryfikacyjnymi odbywającymi się w Sali Egzaminacyjnej.
Każda sekcja odpowiada jednemu z egzaminów. Linki prowadzą do źródeł i oficjalnej dokumentacji.

Aktualizacja: **Q1 2026**

Astronauci zainteresowani ścieżką zaawansowaną mogą się zapisać pod adresem [10xDevs.pl](https://10xdevs.pl) - start już 18 maja 2026 🚀

---

## Sekcja 1 — Czym jest agent kodujący?

W 2026 roku narzędzia AI do programowania to już nie „chatboty dopisujące linijki kodu”. To **agenty** —
systemy, które samodzielnie działają w pętli: czytają repozytorium, planują zmiany, edytują pliki,
uruchamiają komendy, obserwują wyniki i naprawiają błędy.

Kluczowa różnica między chatbotem a agentem:

| Chatbot | Agent |
|---------|-------|
| Odpowiada na pojedyncze pytanie | Realizuje całe zadanie od początku do końca |
| Generuje fragment kodu | Czyta repo, edytuje pliki, uruchamia testy |
| Wymaga ręcznego kopiowania wyniku | Działa bezpośrednio w projekcie |
| Jedna odpowiedź = koniec interakcji | Iteruje w pętli aż do osiągnięcia rezultatu |

Popularne narzędzia agentowe w 2026 roku:

| Narzędzie | Twórca | Wyróżnik | Dokumentacja |
|-----------|--------|----------|-------------|
| **Claude Code** | Anthropic | Agent CLI, integracja z terminalem i gitem | [code.claude.com/docs](https://code.claude.com/docs/en/best-practices) |
| **Codex** | OpenAI | Środowiska chmurowe, praca na zdalnych maszynach | [openai.com/codex](https://openai.com/codex/) |
| **OpenCode** | Community | Open source, rozbudowany ekosystem pluginów | [opencode.ai/docs](https://opencode.ai/docs/) |
| **Cursor** | Anysphere | IDE z wbudowanym agentem, praca bezpośrednio w edytorze | [cursor.com](https://www.cursor.com/) |

Każde z tych narzędzi działa nieco inaczej, ale wszystkie opierają się na tym samym fundamencie:
model językowy + dostęp do narzędzi + pętla iteracyjnego działania.

Źródła:
- [Anthropic — Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [OpenAI — Codex](https://openai.com/codex/)
- [OpenCode — dokumentacja](https://opencode.ai/docs/)

---

## Sekcja 2 — Pętla agentowa a jednorazowe zapytanie

Kluczowa różnica między chatem a agentem to **pętla działania**. Agent nie odpowiada jednorazowo
— iteruje aż do osiągnięcia rezultatu:

```
Plan → Zmiana kodu → Uruchomienie narzędzi → Obserwacja wyniku → Naprawa → Raport
```

Skuteczność agenta zależy nie od „idealnego promptu”, ale od jakości tej pętli.
Jednorazowe zapytanie („napisz mi funkcję X”) to zaledwie ułamek możliwości agenta.

### Dlaczego pętla jest ważniejsza niż prompt?

Wyobraź sobie, że prosisz agenta o dodanie walidacji e-maila do formularza:

- **Podejście jednorazowe:** agent generuje funkcję `validateEmail`, ale nie sprawdza,
  czy pasuje do istniejącego kodu, nie uruchamia testów, nie weryfikuje typów.
- **Podejście agentowe:** agent najpierw czyta istniejący formularz, rozumie strukturę,
  pisze funkcję dopasowaną do reszty kodu, uruchamia testy, naprawia błędy
  i raportuje wynik.

W praktyce oznacza to, że **jakość wyniku zależy od tego, jak dobrze agent potrafi
sam siebie weryfikować i naprawiać**, a nie od tego, jak precyzyjnie sformułujesz pytanie.

Źródła:
- [Anthropic — Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [OpenAI — Run long-horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)

---

## Sekcja 3 — Explore → Plan → Implement → Verify

Najskuteczniejszy przepływ pracy z agentem kodującym to cztery fazy:

1. **Explore** — agent czyta pliki i odpowiada na pytania bez wprowadzania zmian
2. **Plan** — agent tworzy szczegółowy plan implementacji do przeglądu przez programistę
3. **Implement** — agent koduje i uruchamia testy, walidując wynik względem planu
4. **Verify** — programista recenzuje zmiany i potwierdza ich poprawność

### Najczęstszy błąd: pominięcie fazy eksploracji

Skierowanie agenta od razu do pisania kodu, bez fazy eksploracji, to najczęstszy błąd.
Agent rozwiązuje wtedy niewłaściwy problem, bo nie rozumie istniejącej architektury.

Przykład — **źle:**
```
Dodaj endpoint /api/users zwracający listę użytkowników.
```

Przykład — **dobrze:**
```
Przeczytaj pliki w src/server/ i src/pages/api/. Opisz, jak działają
istniejące endpointy i jaka jest konwencja routingu. Potem zaproponuj
plan dodania endpointu /api/users — jeszcze nie koduj.
```

W pierwszym przypadku agent może stworzyć endpoint niezgodny z istniejącym stylem, konwencją
nazewnictwa lub warstwą uwierzytelniania. W drugim — najpierw zrozumie kontekst,
a dopiero potem zaproponuje rozwiązanie.

### Dlaczego warto oddzielać planowanie od implementacji?

- Plan można przejrzeć i skorygować **zanim** agent zacznie pisać kod
- Agent nie marnuje tokenów na ślepe próby — pracuje celowo
- Programista zachowuje kontrolę nad kierunkiem zmian

Źródła:
- [Anthropic — Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [OpenAI — Run long-horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)

---

## Sekcja 4 — Od prompt engineering do context engineering

W 2026 roku kluczowym pytaniem nie jest *„jak napisać prompt”*, ale **„jak zorganizować
odpowiedni kontekst”** — cały zestaw informacji, które trafiają do modelu:

- instrukcje systemowe
- historia pracy (wcześniejsze wiadomości i wyniki)
- wyniki narzędzi (pliki, komendy, testy)
- dokumentacja projektu
- pamięć sesji i stan postępu

Anthropic definiuje context engineering jako *„strategię dobierania i utrzymywania optymalnego
zestawu tokenów podczas wnioskowania modelu”*. Celem jest znalezienie **możliwie najmniejszego
zestawu najbardziej wartościowych informacji**, który maksymalizuje jakość wyników.

| Prompt Engineering | Context Engineering |
|-------------------|---------------------|
| Skupienie na jednej instrukcji | Zarządzanie całym stanem informacyjnym |
| Jednorazowa optymalizacja | Ciągłe zarządzanie kontekstem w trakcie pracy |
| „Jak napisać prompt?” | „Co agent powinien wiedzieć w tym momencie?” |

### Co to oznacza w praktyce?

Zamiast szlifować pojedyncze zdanie promptu, programista w 2026 roku dba o to, **jakie informacje
są dostępne agentowi w momencie działania**:

- Czy agent widzi odpowiednie pliki źródłowe?
- Czy zna konwencje projektu?
- Czy ma wyniki poprzednich uruchomień testów?
- Czy kontekst nie jest zaśmiecony nieistotnymi informacjami?

Dobrze zarządzany kontekst to największa dźwignia jakości pracy agenta — ważniejsza
niż wybór modelu czy narzędzia.

Źródła:
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic — Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

---

## Sekcja 5 — Trwałe instrukcje projektowe: CLAUDE.md / AGENTS.md

Zespoły nie chcą za każdym razem tłumaczyć agentowi architektury, procesu budowania projektu,
stylu kodu i zasad przeglądu kodu. Dlatego powstały **trwałe instrukcje projektowe** — pliki
ładowane automatycznie na początku każdej sesji.

### Jaki format wybrać?

Nie ma jednego, absolutnie obowiązującego formatu. W praktyce spotkasz dwa główne podejścia:

- **Pliki specyficzne dla narzędzia** — np. `CLAUDE.md` w Claude Code
- **Formaty bardziej uniwersalne** — np. `AGENTS.md`, promowane jako otwarty, przenośny standard
  dla wielu agentów

Jeśli pracujesz głównie w jednym narzędziu, naturalne jest użycie jego natywnego mechanizmu.
Jeśli zależy ci na przenośności między różnymi agentami, `AGENTS.md` jest coraz częściej
traktowany jako najbardziej uniwersalny punkt wyjścia.

Niezależnie od nazwy pliku, zasada pozostaje ta sama: **repozytorium powinno zawierać jeden
przewidywalny punkt wejścia z instrukcjami dla agenta**.

### Przykład minimalnego pliku z instrukcjami

```markdown
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible

# Workflow
- Typecheck after making changes
- Prefer running single tests, not the whole suite
```

### Zasady dobrego pliku instrukcji

- **Zwięzłość** — tylko rzeczy, których agent nie wywnioskuje z samego kodu
- **Komendy** — build, test, lint, deploy, których agent sam nie odgadnie
- **Reguły stylu** — tylko te odmienne od domyślnych konwencji
- **Architektura** — decyzje projektowe specyficzne dla repozytorium
- **Brak tutoriali** — to nie dokumentacja, to instrukcja sterująca

Przeładowany plik instrukcji to problem — agent zaczyna ignorować ważne reguły, bo giną w szumie.
Traktuj go jak kod: recenzuj, przycinaj i testuj, czy agent faktycznie się do niego stosuje.

Źródła:
- [AGENTS.md](https://agents.md/)
- [Anthropic — Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

---

## Narzędzia i zasoby dodatkowe

### Agenty kodujące — pierwsze kroki

- [Claude Code](https://code.claude.com) — agent CLI od Anthropic (instalacja: `npm install -g @anthropic-ai/claude-code`)
- [Codex](https://openai.com/codex/) — agent chmurowy OpenAI
- [Cursor](https://www.cursor.com/) — IDE z wbudowanym agentem
- [OpenCode](https://opencode.ai/) — agent CLI typu open source

### Dokumentacja i best practices

- [Claude Code — Best practices](https://code.claude.com/docs/en/best-practices) — kompletny przewodnik po pracy z Claude Code
- [Anthropic — Context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — zarządzanie kontekstem
- [OpenAI — Run long-horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) — praktyki pracy nad długimi zadaniami
- [OpenAI — Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide/) — skuteczne instrukcje dla Codexa

### Benchmarki i rankingi

- [SWE-bench Verified](https://www.swebench.com) — benchmark agentów kodujących na prawdziwych zgłoszeniach z GitHuba
- [LMSYS Chatbot Arena](https://lmarena.ai) — oceny w ślepych testach użytkowników
- [ARC-AGI Prize](https://arcprize.org) — benchmark rozumowania ogólnego

### Dalsze czytanie

- [Andrej Karpathy — Intro to LLMs (YouTube)](https://www.youtube.com/watch?v=zjkBMFhNj_g) — fundamenty, na których opierają się agenty
- [Anthropic — AI Safety research](https://www.anthropic.com/research) — bezpieczeństwo i zgodność celów modeli
- [OpenCode Docs — Agents](https://opencode.ai/docs/agents/) — architektura agenta głównego i subagentów
