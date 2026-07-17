# Lesson Spec: m1-l4 — Agent Onboarding: Agents.md, AI Rules i feedback loops

## Schema Context

- Course: 10xdevs-3
- Module: m1 — Agentic Environment
- Position: 4/4 w module, 4/25 globalnie
- Depends on: m1-l3 — AI-Powered Bootstrap: boilerplate i bezpieczna praca z Agentem
- Prepares for: m1-l5 — Deployment z Agentem: CI/CD, MCP i CLI

## Prework Continuity

- Relevant prework: [2.2] Cursor (AGENTS.md jako kryterium oceny narzędzia), [2.3] Claude Code (CLAUDE.md jako pamięć projektowa), [3.2] Wzorce promptowania (hierarchia instrukcji), [3.3] Cykl życia wątku (context engineering)
- Assumed from prework: learner wie, że AGENTS.md/CLAUDE.md istnieje i do czego służy; zna strategie Write/Select/Compress/Isolate jako koncepty
- Deepened here: hierarchia instrukcji wraca jako zamierzony recap wizualny — diagram Mermaid + konkretny przykład warstw + analiza open-source system promptów z GitHub; jak pisać skuteczne custom instructions (instrukcje niestandardowe) — co model nie może wiedzieć z pretrainingu; gdzie trzymać różne typy reguł i pamięci (user rules, project rules, reguły obszarowe, dokumenty produktowe, ślady sesji); koszty błądzącego agenta bez kontekstu (over-exploration, szerokie przeszukiwanie); anatomia okna na starcie sesji + gdzie agent zostawia ślady cross-project (auto-memory); inner loop jako operacjonalizacja "Write" strategy z preworku [3.3]; reset problematycznej konwersacji jako higiena pamięci roboczej wątku
- Avoid repeating: pełna teoria context engineering strategies (Write/Select/Compress/Isolate) jako wykład, definicja od zera co to jest AGENTS.md

## Lesson Job

Po bootstrapie projektu (m1-l3) learner ma działający projekt, ale agent nic o nim nie wie — nie ma reguł projektowych, nie ma feedback gates, każda sesja zaczyna się od zera. Ta lekcja dokonuje onboardingu agenta: uczy rozróżniać wiedzę z pretrainingu (której nie trzeba powtarzać) od wiedzy projekt-specyficznej (której agent nie może wywnioskować), pisać minimalne skuteczne custom instructions, i wdrożyć lokalny inner loop, który agent uruchamia autonomicznie bez przypomnień. To domknięcie agentic environment przed przejściem do deployment (m1-l5).

## Thesis

AGENTS.md obniża czas pracy agenta o ~28% — ale tylko gdy zawiera to, czego model nie może wywnioskować z pretrainingu. Plik wypełniony dokumentacją i popularnymi wzorcami, które agent i tak zna, niszczy wyniki i podnosi koszty o ~20%. Lekcja uczy pisać skuteczne custom instructions: projekt-specyficzne konwencje, corner cases i nieoczywiste reguły należą do pliku; dokumentacja, popularne wzorce i rzeczy które model już zna — nie. Dodatkowo pokazuje, że nie każda dobra reguła musi żyć w głównym AGENTS.md: preferencje operatora, PRD, reguły obszarowe, auto-memory i ślady sesji mają różne miejsca w środowisku pracy.

## Learning Outcomes

- Kursant potrafi napisać minimalne, skuteczne custom instructions (AGENTS.md/CLAUDE.md) dla swojego projektu — stosując test "co model nie może wiedzieć bez tego pliku?" jako filtr inkluzji.
- Kursant odróżnia preferencje operatora, reguły projektu, reguły obszarowe, dokumenty produktowe i pamięć lokalną — i potrafi zdecydować, gdzie dana informacja powinna trafić.
- Kursant rozumie anatomię okna kontekstowego agenta na starcie sesji i potrafi po sesji zaobserwować gdzie zostają ślady auto-memory oraz jak je audytować.
- Kursant konfiguruje lokalny inner loop: formatter + hook lub prosty test runner, który agent uruchamia po zakończeniu pracy bez dodatkowego instruowania.
- Kursant zakłada failure-modes.md jako ewolucyjny rejestr błędów agentowych z referencją z AGENTS.md i wie jak przekształcać incydenty w reguły.
- Kursant potrafi rozpoznać problematyczną konwersację, wykonać reset przez `conversation-summary.md` i zdecydować, czy odkryta pułapka powinna trafić do pamięci, failure-modes.md, reguły lub testu.

## Audience Starting Point

Learner ma projekt po bootstrapie z działającym agentem. Wie z preworku, że AGENTS.md/CLAUDE.md istnieje, ale nie wie co tam wpisać. Typowy błąd startowy: kopiuje do pliku dokumentację projektu, ogólne zasady ("pisz czysty kod"), opisy architektury i popularne konwencje frameworka — tworzy plik pełen szumu. Rezultat: agent marnuje okno kontekstowe na nieistotne instrukcje, koszty rosną, wyniki się pogarszają.

## Behavioral Change

Zamiast kopiować dokumentację do AGENTS.md, kursant pyta: "czy agent mógłby to wiedzieć bez tego pliku?" — i wpisuje tylko to, na co odpowiedź brzmi "nie".

## Owned Concepts

- hierarchia instrukcji jako recap wizualny: diagram Mermaid warstw + analiza open-source system promptów z GitHub
- custom instructions (instrukcje niestandardowe) AGENTS.md/CLAUDE.md: test inkluzji "co model nie może wiedzieć z pretrainingu" + implikacje kosztowe (over-exploration bez kontekstu)
- /init (Claude Code) / auto project rules (GitHub Copilot, .github/copilot-instructions.md) jako starter — punkt startu, nie punkt końcowy
- anatomia okna kontekstowego agenta na starcie sesji: co jest, skąd pochodzi, co trafia do auto-memory cross-project
- lokalny feedback loop (inner loop): formatter + hook jako autonomiczny sygnał post-pracy agenta
- failure-modes.md jako ewolucyjny rejestr błędów agentowych (odróżniony od AGENTS.md)
- meta-poziom team setup: AGENTS.md vs CLAUDE.md decyzja stackowa, symlinki, multi-tool reading
- taksonomia reguł i pamięci: user rules vs project rules vs team rules vs auto-memory vs dokumenty produktowe
- granularne i warunkowo dołączane reguły jako alternatywa dla monolitycznego AGENTS.md
- reset problematycznej konwersacji przez conversation-summary.md jako higiena pamięci roboczej wątku

## References Only

- context engineering strategie Write/Select/Compress/Isolate (prework 3.3) — operacjonalizowane, nie wykładane od nowa
- archiwalne lekcje 10xDevs 2ed o efektywnej pracy z AI, planowaniu kontekstu i regułach dla AI — użyte jako materiał ciągłości kursowej, nie jako aktualna dokumentacja narzędzi
- głębokie hooki i triggery jako architektura (m3-l3 — wzmianka, nie mechanika)
- CI/CD pipeline hooks i outer loop (m1-l5)
- shared AI registry i team infrastructure (m5-l3, m4)

## Must Not Cover

- architektura hooków i automatycznych triggerów jako osobny system (m3-l3)
- CI/CD pipeline konfiguracja (m1-l5)
- benchmark modeli i wybór modelu (prework 3.5)
- refaktoryzacja i large scale projects (m4)
- shared AI registry dla całego zespołu (m5-l3)
- wybór tech-stacku (m1-l2)

## Required Example Or Demo

### Dwuetapowe demo (ćwiczenie interaktywne)

Kursant przeprowadza własną weryfikację w swoim projekcie — nie jeden narzucony przykład, ale wybór z katalogu 5 wzorców custom instructions:

1. **Format odpowiedzi błędów** — projekt ma własny kształt error response (`{ error: { code, message, context } }` zamiast standardowego `{ error: string }`). Agent bez reguły generuje standard → łamie konwencję.
2. **Nazewnictwo plików** — projekt używa `feature.handler.ts` zamiast `featureHandler.ts`. Agent bez reguły tworzy camelCase → łamie konwencję.
3. **Konwencja importów** — projekt wymaga absolute imports z aliasem `@/` zamiast relative `../../`. Agent domyślnie pisze relative imports.
4. **Struktura katalogów modułu** — każdy nowy moduł musi mieć `index.ts` re-exportujący publiczne API, `types.ts` z typami i `__tests__/` z testami. Agent tworzy płaską strukturę.
5. **Obsługa dat** — projekt używa zawsze UTC + własnego helpera `formatDate()` zamiast `new Date().toISOString()`. Agent używa natywnego API.

**Instrukcja dla kursanta:**
1. Wybierz jeden wzorzec, który pasuje do twojego projektu (lub zaproponuj własny).
2. Poproś agenta o implementację funkcji BEZ reguły w AGENTS.md → obserwuj, czy złamał konwencję.
3. Napisz minimalną regułę (1–3 zdania) → poproś agenta o tę samą funkcję → porównaj output oraz prosty koszt sesji.
4. Obserwuj różnicę: czas, liczbę eksplorowanych plików, uruchomione komendy, liczbę iteracji i widoczny koszt/tokeny, jeśli narzędzie je pokazuje. To jest wartość custom instructions.

Demo powinno dać się przeprowadzić przez każdego uczestnika w jego własnym projekcie. Wzorce są wzorcami startowymi — kursant może użyć konwencji ze swojego projektu.

## Failure Mode To Disarm

Learner wrzuca do AGENTS.md dokumentację projektu, ogólne zasady kodowania, opis architektury i konwencje frameworka, które model już zna z pretrainingu lub README. Plik rośnie do kilkuset linii. Agent marnuje okno na czytanie szumu, koszty rosną o ~20%, wyniki się pogarszają (arXiv 2602.11988 empirycznie to potwierdza — mechanizm to redundancja z istniejącą dokumentacją, nie sama długość pliku). Lekcja musi uświadomić tę pułapkę zanim learner w nią wpadnie.

## Suggested Structure

1. **Wstęp — Co agent ma w oknie na start?** — recap wizualny hierarchii instrukcji: diagram Mermaid warstw (system prompt → AGENTS.md/CLAUDE.md → pamięć → skille → prompt zadaniowy) + konkretny przykład co trafia do każdej warstwy. Analiza fragmentów open-source system promptów z GitHub jako ilustracja tego, jak realne narzędzia definiują kontekst agenta.
2. **Gdzie trzymać jaką regułę** — taksonomia warstw: preferencje operatora, reguły projektu, reguły obszarowe, wiedza produktowa, ślady po sesji. Rozróżnienie: PRD mówi "co i dlaczego budujemy", AGENTS.md mówi "jak pracujemy w repo", pamięć lokalna pomaga jednej osobie, ale nie jest kontraktem zespołu.
3. **Custom instructions — co tu wpisać?** — test inkluzji "co model nie może wiedzieć bez tego pliku?". Empiryczne zakotwiczenie: arXiv 2602.11988 (redundancja z docs → +20% koszty, gorsze wyniki) vs. 2601.20404 (dobrze napisane instrukcje → -28% czasu na Codexie, -16% tokenów). Kluczowy mechanizm: bez kontekstu agent błądzi i przeszukuje zbyt szeroko — koszty rosną, iteracje się mnożą. Kategorie do pliku: nieoczywiste konwencje, corner cases, projekt-specyficzne reguły, wstydliwe hacki. Co nie należy: dokumentacja, popularne wzorce, rzeczy z pretrainingu lub README. Granularność: jeśli narzędzie wspiera rules per glob/path, reguły React/API/testowe mogą być dołączane tylko wtedy, gdy są potrzebne.
4. **Pisanie AGENTS.md/CLAUDE.md — od /init do gotowego pliku** — start: uruchomienie `/init` (Claude Code) lub equivalent (GitHub Copilot → `.github/copilot-instructions.md`, brak CLI — cloud UI) → analiza co agent wygenerował domyślnie → identyfikacja luk → uzupełnienie o custom instructions. Zastrzeżenie: bootstrap projektu oprzyj o oficjalne CLI/starter, a AI wykorzystuj do analizy i adaptacji szkieletu. Minimalna struktura: tech stack specifics, non-obvious conventions, forbidden patterns. Ćwiczenie interaktywne: wybierz wzorzec z katalogu 5 przykładów → demo bez reguły → z regułą → porównaj output.
5. **Inner loop: lokalny feedback loop** — formatter (np. Prettier), intro do hooków koncepcyjnie (narzędzie-agnostycznie: wiele narzędzi agentowych ma własny mechanizm hooków lub automatycznych komend — sprawdź docs swojego narzędzia), konkretny snippet dla Claude Code jako przykład implementacji, basic test runner. Lintery, formatery i testy są sygnałami z rzeczywistości, a nie tylko instrukcjami w Markdownie. Konfiguracja: agent uruchamia po pracy bez przypominania. Architektura hooków (event chains, conditional firing, multi-step) → m3-l3.
6. **failure-modes.md** — kiedy zakładać, co wpisywać, jak dodać referencję z AGENTS.md, jak incydent przekształcić w regułę.
7. **Reset problematycznej konwersacji** — pamięć robocza wątku, sygnały ostrzegawcze, zasada trzech prób, `conversation-summary.md` jako świeży kontekst dla nowej sesji. Decyzja po resecie: czy odkryta pułapka trafia do pamięci, failure-modes.md, reguły albo testu.
8. **Ślady po sesji: auto-memory (wymagane, nie opcjonalne)** — gdzie Claude Code trzyma cross-project memory (konkretna ścieżka: `~/.claude/projects/<path>/memory/`), gdzie Codex (`~/.codex/memories/`, pod `CODEX_HOME`, z zastrzeżeniem dostępności i tego, że to generated state). Jak obserwować co agent zapamiętał po sesji, jak audytować i odtwarzać kontekst. Post-session review jako praktyka higieniczna.
9. **Team setup: meta-poziom** — AGENTS.md vs CLAUDE.md (decyzja stackowa), symlinki gdy nie można ujednolicić, multi-tool auto-reading (np. Cline). Jedna sekcja, nie porównanie narzędzi.

## Video Placeholders

- Prowadzący uruchamia `/init` w projekcie → pokazuje wygenerowany domyślny CLAUDE.md → analizuje co jest wartościowe, co jest szumem → uzupełnia o custom instruction → weryfikuje efekt.
- Ćwiczenie interaktywne: prowadzący wybiera jeden z 5 wzorców → pokazuje agenta bez reguły (łamie konwencję) → dodaje minimalną regułę → agent respektuje konwencję. Wizualizacja testu inkluzji custom instructions.
- Konfiguracja formatter + intro do hooka (Claude Code snippet) — agent autokoryguje output po pracy bez instruowania. Uwaga: narzędzia różnią się mechanizmem hooków, automatycznych komend i feedbacku z linterów — sprawdź docs swojego agenta.
- Obserwacja auto-memory traces po sesji (wymagane): `~/.claude/projects/<path>/memory/` w Claude Code, jak wygląda zawartość MEMORY.md, jak ją zresetować lub odtworzyć.

## Bridge In

Projekt jest bootstrapowany (m1-l3) — kod istnieje, agent działa, ale środowisko jest "nieme": nie ma reguł projektowych, nie ma feedback gates, każda sesja agenta zaczyna się od tej samej ignorancji. Ta lekcja wypełnia tę lukę: onboarduje agenta do projektu i daje mu lokalny mechanizm autokorekty.

## Bridge Out

Learner wchodzi do m1-l5 (Deployment z Agentem: CI/CD, MCP i CLI) z projektem, który ma już skonfigurowany inner loop. Lekcja deploymentu może naturalnie zbudować outer loop (CI/CD) jako rozszerzenie inner loop z m1-l4 — od lokalnego formattera do zautomatyzowanego pipeline.

## Resolved Decisions

*(Wszystkie decyzje rozstrzygnięte — gotowe do draftu)*

- **Głębokość hooków:** snippet + defer — Claude Code PostToolUse + Prettier snippet jako przykład implementacji; koncepcja omówiona narzędzie-agnostycznie (odesłanie do docs własnego narzędzia). Architektura hooków (event chains, conditional firing) → m3-l3.
- **Benchmarkowanie custom instructions:** ćwiczenie interaktywne — kursant przeprowadza własną weryfikację z katalogiem 5 wzorców. Liczby z papers (28%, 20%) jako kontekst empiryczny, nie jako własny benchmark.
- **Plik rejestru incydentów:** `failure-modes.md`
- **Demo konwencja:** katalog 5 stack-agnostycznych wzorców (format błędów, nazewnictwo plików, importy, struktura modułu, obsługa dat) — kursant wybiera pasujący do własnego projektu lub proponuje swój.
- **Naming:** "zasada filtrowania" → "custom instructions" / "instrukcje niestandardowe" — termin rozpoznawalny z dokumentacji narzędzi i materiałów online.

## Side-Effect Ledger

```
New claims introduced:
  - AGENTS.md reduces Codex execution time ~28% median, output tokens ~16% median
    (Lulla et al., arXiv 2601.20404 — Codex only, small PRs ≤100 LoC, caveat required)
  - LLM-generated or docs-redundant AGENTS.md increases costs ~20%, reduces success rate
    (Gloaguen et al., arXiv 2602.11988 — mechanism: redundancy with existing docs, not file length)
  - Test inkluzji "co model nie może wiedzieć bez tego pliku" jako operacyjny filtr custom instructions
  - Claude Code auto-memory location: ~/.claude/projects/<git-path>/memory/MEMORY.md
  - Archiwalne lekcje 10xDevs 2ed wspierają ciągłość kursową: reguły jako personalizacja AI,
    granularne rules per path/glob, PRD jako kontekst dla AI, reset konwersacji przez summary.

Claims removed:
  (none — lekcja nowa)

Neighboring lesson references changed:
  - m1-l5: explicitly linked via inner loop (m1-l4) → outer loop (m1-l5 CI/CD) metaphor
  - m3-l3: receives hook architecture; m1-l4 introduces hooks at config level + conceptual level only

Prework references used:
  [2.2], [2.3] — AGENTS.md/CLAUDE.md jako pamięć projektowa
  [3.2] — hierarchia instrukcji (operacjonalizowana)
  [3.3] — context engineering strategie (operacjonalizowane)
  10xDevs 2ed [1x5], [1x6], [2x1], [2x2] — materiał ciągłościowy dla reguł,
  kontekstu, resetu konwersacji i pracy z pamięcią roboczą

Prework concepts repeated intentionally:
  - Hierarchia instrukcji z preworku [3.2] — celowo powtórzona jako recap wizualny (diagram Mermaid),
    bo lekcja operacjonalizuje każdą warstwę.

Potential duplicates:
  - Hook snippet w m1-l4 vs. architektura hooków w m3-l3 — rozwiązane: m1-l4 zatrzymuje się na
    konfiguracji PostToolUse + formatter; m3-l3 przejmuje event chains i conditional firing.
  - Auto-memory traces vs. prework [3.3] — rozwiązane: konkretne ścieżki plików Claude Code
    odróżniają sekcję od abstrakcyjnej teorii z preworku.
  - Reguły dla AI z 10xDevs 2ed [2x2] vs. m1-l4 — rozwiązane: m1-l4 nie powtarza tutoriala
    Cursora, tylko wyciąga model mentalny warstw i granularności reguł.

Unsupported facts:
  - Specific Codex memories path — resolved via official Codex docs: default main memory files live
    under `~/.codex/memories/`, with `CODEX_HOME` controlling Codex home.
  - Efficiency claims from arXiv apply to Codex only — draft nie może generalizować na wszystkie agenty.

Video/text mismatches:
  (none — video placeholders zaktualizowane)

Needs human decision:
  (none — wszystkie decyzje rozstrzygnięte)
```
