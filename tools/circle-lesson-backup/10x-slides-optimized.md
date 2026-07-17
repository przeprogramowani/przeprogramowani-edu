# 📊 WARSZTAT - "10x METHODOLOGY: Research → Plan → Implement"

## 🎯 Struktura (2h warsztat - 32 slajdy)
**Format:** Technical workshop - Google Slides / PowerPoint ready
**Style:** Structured, code-light, speaker notes comprehensive

---

## **WPROWADZENIE**

### Slajd 1: Tytuł warsztatu

# Od Vibe Code do 10x Method
## Research → Plan → Implement

**Studium przypadku:** Mattermost - Search dla Flagged Posts
**Format:** Live coding + dyskusja
**Czas trwania:** 2 godziny

> "Show > Tell"

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Opening:**
- Witamy na warsztacie "10xMethod"
- Dzisiaj zobaczycie różnicę między chaotycznym "vibe coding" a systematycznym podejściem
- Będziemy pracować na realnym case study: Mattermost (1,7mln linii kodu, 21k+ commits, 8 lat historii)
- Feature: Dodanie wyszukiwania w zapisanych wiadomościach (flagged posts)

**Format:**
- 2 live demos (5 min + 15 min)
- 1 hands-on task (5 min)
- Dyskusja + Q&A
- Wszystkie materiały dostępne po warsztacie

**Expectations setting:**
"Show > Tell" - więcej praktyki niż teorii, zobaczycie real workflow

---

### Slajd 2: Paradoks adopcji AI

## Paradoks adopcji AI

**Problem:**
- ✅ **Wysoka adopcja** - Copilot, Cursor, Claude
- ❌ **Niskie zadowolenie** - Frustracja przy złożonych zadaniach

**3 główne problemy:**
1. 🔍 **Context** - AI "gubi się" w dużych projektach
2. 🐛 **Jakość** - Kod wymaga "prowadzenia za rękę"
3. 🧪 **Wąskie gardła** - testowanie i przegląd kodu

> **Do sali:** "Kto doświadczył tego w ostatnim tygodniu?"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Context dla prezentacji:**
Wszyscy korzystamy z AI tools - GitHub Copilot, Cursor, Claude. Adopcja narzędzi AI w programowaniu rośnie dynamicznie według badań branżowych. ALE satysfakcja jest niska przy złożonych zadaniach.

**3 główne problemy (rozwiń każdy):**

**1. Problem kontekstu:**
- AI nie zna Twojego projektu
- Generuje ogólne rozwiązania zamiast dopasować się do istniejących rozwiązań i wzorców projektu
- Rezultat: Dostajemy "nowy", niepotrzebny kod zamiast ponownie wykorzystać istniejący
- Przykład: Tworzy od nowa mechanizm uwierzytelniania zamiast użyć istniejącego

**2. Niska jakość:**
- "Działa" dla podstawowego scenariusza, ale nie obsługuje przypadków brzegowych?
- Luki bezpieczeństwa (SQL injection, XSS, auth bypass)
- Brak testów
- Rezultat: 2-3h przeróbkę po "5 min implementacji"

**3. Wąskie gardła - testowanie i przegląd:**
- AI nie pisze testów automatycznie (trzeba prosić)
- Przegląd kodu trwa dłużej (duża ilość kodu = trudniejszy do zrozumienia)
- Najwięcej czasu schodzi na "sprawdzanie co AI zrobiło"
- Rezultat: Czas zaoszczędzony na implementacji, stracony na przeglądzie

**Pytanie do sali:**
"Kto z was doświadczył któregoś z tych problemów w ostatnim tygodniu?"
[Pokaż ręce, szybka dyskusja 30 sec]

**Transition:**
"Dzisiaj pokażemy wam jak te problemy rozwiązać systematycznie."

---

### Slajd 3: Czego się nauczysz

## Czego się nauczysz dziś

**Vibe Code ❌ vs AI the Proper Way ✅**

**3 kluczowych umiejętności:**
1. 📋 **Definition of Done** - jak zmierzyć sukces z AI
2. 🎯 **Badania i planowanie** - oszczędzamy czas, zamiast tracić go na poprawkach
3. 🤖 **Agent świadomy kontekstu** - 80% ponownego wykorzystania kodu
4. 🧪 **Testy** - piszemy testy automatyczne, zamiast manualnie sprawdzać


**Czego NIE będzie:** Podstawy IDE, "magiczne prompty"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Setup expectations:**

Dzisiaj zobaczycie różnicę między dwoma podejściami:
- ❌ **"Vibe Code"** - one-shot prompting bez kontekstu, "zobaczymy co wyjdzie"
- ✅ **"10xMethod"** - Research → Plan → Implement

**5 rzeczy które konkretnie wyniesiesz:**

**1. Definition of Done dla AI:**
- Tradycyjne DoD (tests, review, docs) NIE wystarcza
- AI wymaga dodatkowych checks: halucynacje, bezpieczeństwo, istotność kontekstu
- Dostaniesz template checklist (5-min sprawdzenie przed commit)

**2. Badania i planowanie:**
- Dlaczego 15 min badania oszczędza 3h refactoringu
- 10xMethod (Advanced Context Engineering)
- Badaj → Planuj → Wdrażaj - przepływ pracy
- "Złe badanie = tysiące złych linii kodu"

**3. Agent świadomy kontekstu:**
- 3 filary: Project Instructions (Cursor Rules), Prompt Library, Smart Context
- Jak zbudować agenta który "zna Twój projekt"
- Rezultat: 80% ponownego wykorzystania kodu (vs 20% w vibe code)

**4. Przepływ pracy 3×3:**
- 3 małe kroki, informacja zwrotna po każdym, commit
- Przepływ cykliczny zamiast kaskadowego
- Human-in-the-Loop checkpoints

**5. Legacy code - najlepsze praktyki:**
- Nieznany kod źródłowy? 3-krokowy proces (git gorące punkty, AI wdrażanie, verification)
- Testy regresji PRZED refaktoringiem
- Unikanie halucynacji w legacy

**Czego NIE będzie:**
- ❌ Podstawy Copilot/Cursor (zakładam że używacie)
- ❌ "Magiczne prompty" (nie ma jednego perfect prompt)
- ❌ "AI zrobi wszystko za ciebie" (Human-in-the-Loop zawsze!)

**Transition:**
"Zacznijmy od fundamentu - Definition of Done."

---

## **CZĘŚĆ 1: DEFINITION OF DONE**

### Slajd 4: Co to jest "Definition of Done"?

## Definition of Done w erze AI

> "Jasno określona lista kryteriów, które muszą być spełnione, zanim uznamy zadanie za ukończone"

**Dlaczego potrzebujemy DoD z AI?**

| Bez DoD | Z DoD |
|---------|-------|
| "Działa" = commit ✓ | Build passes ✓ |
| Przypadki brzegowe? Later... | Przypadki brzegowe tested ✓ |
| Security? Looks ok... | Security audit ✓ |

> "2 min na dobry prompt oszczędza 20 min poprawek.
> DoD oszczędza 2h refactoringu."

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Definicja DoD:**
Definition of Done to jasno określona lista kryteriów, które muszą być spełnione, zanim uznamy zadanie za ukończone. To nie jest nic nowego - używamy tego w Scrum, Agile, każdej metodologii.

**Dlaczego w erze AI to jest CRITICAL?**

Problem: AI generuje kod który "działa" (compiles, runs), ale czy jest production-ready?

**Comparison table (rozwiń):**

**Bez DoD:**
- "Działa" = commit ✓
  - Kompiluje się? Tak? To git commit!
  - Problemy odkrywamy w production
- Przypadki brzegowe? Maybe later...
  - "Działa dla normalnych inputów"
  - Co z null? Empty? Negative? Large values? "Zobaczymy"
- Security? Wygląda ok...
  - Visual inspection: "Nie widzę SQL injection"
  - Ale: czy sprawdziłeś auth? Rate limiting? Input validation?
- Tests? Po deploymencie...
  - "Nie mam czasu teraz"
  - Manual testing w production

**Z DoD:**
- Build passes ✓
  - make test - wszystkie testy (unit + integration)
  - make check-style - sprawdzanie stylu
  - No compiler warnings
- Przypadki brzegowe tested ✓
  - null, 0, negative, empty array, large values
  - All paths covered
- Security audit ✓
  - SQL injection check (parameterized queries?)
  - XSS check (input sanitization?)
  - Auth check (permission validation?)
  - Secrets check (no hardcoded keys?)
- Tests written ✓
  - Unit tests (happy path + 3 przypadki brzegowe + errors)
  - Integration tests (API contracts)
  - E2E for critical flows

**Kluczowy cytat:**
> "2 minuty na napisanie dobrego prompta oszczędza 20 minut na poprawkach.
> A Definition of Done oszczędza 2 godziny na refactoringu."

Matematyka:
- 2 min prompt engineering
- 15 min proper planning with DoD
- 40 min implementation
**Total: ~1h**

vs

- 30 sec vague prompt
- 5 min "implementation"
- 2-3h przeróbkę (refactoring, tests, security fixes, przypadki brzegowe)
**Total: ~3h**

DoD = 3x time savings!

**Transition:**
"Zobaczmy jak DoD wygląda dla tradycyjnego workflow vs z AI"

---

### Slajd 5: DoD - Tradycyjne vs z AI

## DoD w erze AI - Rozszerzone kryteria

**Tradycyjne DoD:**
- Funkcjonalność + Testy + Przegląd+ Docs ✅

**DoD z AI - dodatkowe kryteria:**
- 💡 **Zrozumiałem wygenerowany** kod
- 🛡️ **Security audit** (injection, XSS, auth)
- ✅ **Brak halucynacji** (biblioteki istnieją, API rzeczywiste)
- 🏗️ **Podąża za konwencjami** (wykorzystuje ponownie wzorce)

> **Kluczowe:** AI wymaga weryfikacji kontekstu i bezpieczeństwa

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Tradycyjne DoD (przypomnienie):**
- ✅ Funkcjonalność zaimplementowana
- ✅ Testy unit + integration przechodzą
- ✅ Przegląd kodu zakończony
- ✅ Dokumentacja zaktualizowana

To wszystko DALEJ obowiązuje! Ale z AI musimy dodać więcej checks.

**DoD z AI - 6 dodatkowych kryteriów:**

**1. Zrozumiałem kod** - nie commituj czarnych skrzynek
- Weryfikacja: Przeczytaj każdą linię, pytaj AI o niejasności

**2. Przypadki brzegowe** - AI fokus na basic case
- Weryfikacja: Testuj null, 0, empty, large values

**3. Security audit** - AI generuje vulnerable code
- Check: SQL injection? XSS? Hardcoded secrets? Auth bypass?
- Weryfikacja: semgrep, security checklist

**4. Kontekst istotny** - używa istniejących wzorców?
- Weryfikacja: Porównaj z @reference-files, sprawdź integrację z architekturą

**5. Brak halucynacji** - AI wymyśla libraries/APIs
- Weryfikacja: grep -r, check package.json, compile & test

**6. Konwencje projektu** - naming, struktura, error handling
- Weryfikacja: Sprawdź .cursorrules, porównaj z istniejącym kodem

**Key insight:**
DoD z AI szersze - nowe risk vectors: halucynacje, luki bezpieczeństwa, ignorancja kontekstu.

**Transition:**
"Za 5 minut pokażę wam jak to wygląda w praktyce. Ale najpierw - zadanie dla was!"

---

### Slajd 6: 🎯 TASK dla uczestników

## 🎯 Ćwiczenie (5 minut)

**Zadanie:**
> Stwórz swoją checklistę Definition of Done
> Lista 5-8 elementów dla typowego feature w Twoim projekcie

**Podpowiedzi - co uwzględnić:**
- Walidacja (client + server)
- Error handling (network, validation, przypadki brzegowe)
- Loading states (spinners, skeletons)
- Security (auth, permissions, sanitization)
- Tests (unit, integration, e2e)

💡 **Za 5 minut:** Przykład DoD dla Mattermost case study

---

**[SPEAKER NOTES]**

[TIMING: 5 min task + 2 min debrief]

**Instrukcje dla uczestników:**

"Macie teraz 5 minut na stworzenie swojej Definition of Done checklist dla typowego feature w waszym projekcie. Jeśli nie pracujecie aktualnie nad projektem, wybierzcie hipotetyczny feature - np. 'dodaj search do listy produktów' lub 'user profile page'."

**Framework do myślenia (podpowiedzi):**

1. **Walidacja**
   - Client-side: input validation (required fields, format)
   - Server-side: business logic validation
   - User feedback: error messages, success states

2. **Error handling**
   - Network errors: timeout, connection refused
   - Validation errors: clear messages
   - Przypadki brzegowe: what if API returns unexpected data?

3. **Loading states**
   - Spinners for async operations
   - Skeleton screens for content loading
   - Disable buttons during submission

4. **Security**
   - Authentication: user logged in?
   - Authorization: user has permission?
   - Input sanitization: prevent XSS, SQL injection
   - Rate limiting: prevent abuse

5. **Tests**
   - Unit tests: individual functions
   - Integration tests: API calls, data flow
   - E2E tests: critical user journeys
   - Coverage: aim for 80%+

6. **Performance**
   - Response time: <200ms for API calls
   - Bundle size: check impact on load time
   - Lazy loading: for heavy components

7. **Dostępność**
   - Keyboard navigation: tab order, shortcuts
   - Screen readers: aria-labels, semantic HTML
   - Color contrast: WCAG AA minimum

8. **Documentation**
   - README: setup instructions if needed
   - JSDoc: for complex functions
   - CHANGELOG: what changed
   - API docs: if exposing new endpoints

**Format sugestia:**
```markdown
## DoD for [Your Feature]

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3
...
```

**Po 5 minutach - debrief (2 min):**

"Kto chce podzielić się swoją listą?" [2-3 volunteers, quick share 20-30 sec each]

"Świetnie! Zauważcie jak różne mogą być DoD dla różnych projektów i kontekstów. Kluczowe: dostosować do swojego projektu, nie ogólny szablon."

**Transition:**
"Zobaczmy teraz konkretny przykład DoD dla naszego case study - Mattermost Flagged Posts Search"

---

### Slajd 7: Example DoD - Mattermost Flagged Posts Search

## DoD: Mattermost Flagged Posts Search

**Zadanie:** Dodaj wyszukiwanie w zapisanych wiadomościach

**Backend (5 kluczowych):**
- [ ] Endpoint `GET /api/v4/users/{id}/posts/flagged/search`
- [ ] Permission check: user → własne posts only
- [ ] Integration z search engine (wykorzystaj istniejący)
- [ ] Unit tests: podstawowy + 3 przypadki brzegowe + errors
- [ ] Performance: <200ms dla 10k posts

**Frontend (5 kluczowych):**
- [ ] SearchBox + debouncing (300ms)
- [ ] Loading + error + empty states
- [ ] Component tests (RTL)

**Full checklist:** 15 items → handout

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Context:**
To jest nasz case study na dzisiaj. Feature: "Dodaj funkcjonalność wyszukiwania w zapisanych wiadomościach (flagged posts)" w Mattermost.

Mattermost = open source Slack alternative, 21k+ commits, Go backend + React frontend.

**Full Definition of Done (15 items):**

**BACKEND (Go) - 7 items:**

1. **Endpoint implemented:**
   - Route: `GET /api/v4/users/{user_id}/posts/flagged/search`
   - Handler: `server/api4/post.go` → `searchFlaggedPosts`
   - Query params: `terms` (string), `page` (int), `per_page` (int)

2. **Query params validated:**
   - `terms`: non-empty, max 100 chars
   - `page`: >= 0
   - `per_page`: 1-100 range, default 20
   - Return 400 Bad Request z clear error message

3. **Integration z search engine:**
   - Wykorzystaj istniejący: Elasticsearch/Bleve/Database search
   - Nie wymyślaj na nowo! Sprawdź `server/app/post_search.go`
   - Użyj interfejsu `SqlStore.Post.Search()`

4. **Permission check:**
   - User może szukać tylko własnych flagged posts
   - Check: `requireSession` middleware
   - Check: `user_id` in URL == session user ID
   - Return 403 Forbidden if mismatch

5. **Error handling:**
   - 400: Invalid query params
   - 401: Unauthorized (no session)
   - 403: Forbidden (not own posts)
   - 404: User not found
   - 500: Internal errors (DB, search engine)
   - All: proper `model.NewAppError` with message

6. **Unit tests:**
   - File: `server/api4/post_test.go`
   - Podstawowy scenariusz: valid search returns results
   - Przypadki brzegowe:
     - Empty query → 400
     - Special characters (quotes, unicode) → handled
     - Large page number → empty results
   - Error scenarios:
     - Unauthorized → 401
     - Different user → 403

7. **Performance:**
   - Search <200ms dla 10k flagged posts
   - Użyj indeksów w bazie danych
   - Paginacja zaimplementowana (nie pobieraj wszystkich)

**FRONTEND (React + TypeScript) - 6 items:**

8. **SearchBox component:**
   - Location: `webapp/channels/src/components/search_flagged/`
   - Input field + search button
   - Debouncing: 300ms (nie wyszukuj przy każdym naciśnięciu klawisza)
   - Clear button to reset

9. **Loading state:**
   - Show spinner podczas search
   - Disable input during search
   - Visual feedback: "Searching..."

10. **Error states:**
    - No results found: "No flagged posts match your search"
    - Network error: "Connection error, try again"
    - Unauthorized: Redirect to login
    - Display errors w user-friendly format

11. **Pagination:**
    - Show 20 results per page
    - "Load more" button or infinite scroll
    - Page number display: "Showing 1-20 of 150"

12. **Component tests (RTL):**
    - File: `search_flagged.test.tsx`
    - Rendering: component renders correctly
    - User interactions: typing triggers search (debounced)
    - API calls: mocked, correct params sent
    - Error handling: displays error messages

13. **Dostępność:**
    - Keyboard navigation: tab order, enter to search
    - aria-labels: "Search flagged posts", "Search results"
    - Screen reader: announce results count
    - Focus management: focus input after clear

**BOTH (Security + E2E + Docs) - 2 items:**

14. **E2E test (Playwright):**
    - File: `tests/e2e/flagged_search.spec.ts`
    - Flow: Login → Flag post → Search → Find result
    - Edge case: Search with no results
    - Error case: Search as unauthorized user

15. **Documentation:**
    - Swagger spec: `server/api4/swagger.yaml` updated
    - JSDoc: component props documented
    - README: `CHANGELOG.md` entry
    - Developer docs: if needed

**Security (implicit in above, but highlight):**
- SQL injection: Use parameterized queries (SqlStore handles)
- XSS: Input sanitization on display (React handles)
- Auth bypass: Permission checks in place
- Rate limiting: Wykorzystaj istniejący middleware

**Kluczowy insight:**
> "Ten checklist będzie naszym miernikiem sukcesu. Za chwilę zobaczycie jak 'vibe code' radzi sobie z tymi wymaganiami vs 'AI the Proper Way'."

**Transition:**
"Mamy DoD. Teraz zobaczmy co się dzieje gdy nie używamy tego podejścia - Welcome to Vibe Code!"

---

**[CUMULATIVE TIMING: CZĘŚĆ 1 = 9 min | Running total: 17 min]**

---

## **CZĘŚĆ 2: VIBE CODE - ONE SHOT**

### Slajd 8: Co to jest "Vibe Code"?

## "Vibe Code" - One-Shot Approach

> "Generujemy kod z minimalnym kontekstem, testujemy czy 'działa' i commitujemy bez systematycznej weryfikacji"

**Charakterystyka:**
- 🎲 "Zobaczymy co wyjdzie"
- 📋 One-shot prompt, minimal context
- ⚠️ "Kompiluje się = OK"
- ⏱️ "Działa dla podstawowego scenariusza = commituję"

**Kiedy działa:** Prototypy, spike solutions
**Kiedy FAIL:** Legacy codebase, team collaboration

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Definicja Vibe Coding:**
"Vibe Coding to podejście gdzie generujemy kod z minimalnym kontekstem, testujemy czy 'działa' (compiles, runs on happy path) i commitujemy bez systematycznej weryfikacji według Definition of Done."

**Charakterystyka (rozwiń każdy punkt):**

**1. "Zobaczymy co wyjdzie" approach**
- Brak planu, brak badania
- "AI jest smart, wymyśli"
- Hope-driven development
- Problem: AI nie zna Twojego projektu, generuje ogólny kod

**2. One-shot prompt, minimal context**
- Prompt: "Add search to flagged posts"
- Context: Tylko otwarty plik (lub żaden)
- No @references do istniejących wzorców
- No .cursorrules
- Problem: AI wymyśla koło na nowo, nie wykorzystuje ponownie wzorców

**3. "Kompiluje się = pewnie OK"**
- make test passes? Ship it!
- No security review
- No edge case testing
- No verification czy używa project conventions
- Problem: "Works on my machine" != "Production ready"

**4. Przypadki brzegowe odkładane na później**
- "Zaimplementuję podstawowy scenariusz, resztę później"
- Later == never (lub w production jako bug)
- Problem: Przypadki brzegowe są 80% effort, odkładanie = dług techniczny

**5. "Działa dla podstawowego scenariusza = commituję"**
- Manual test: wpisałem "test query" → działa!
- What about: empty query? Special chars? Unicode? Large results?
- Problem: Users don't only use podstawowy scenariusz

**Diagram workflow:**
```
┌──────────────────────────┐
│  1. Write prompt         │
│  "Add search to posts"   │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  2. Get code from AI     │
│  (no context, generic)   │
└──────────────────────────┘
           ↓
┌──────────────────────────┐
│  3. Does it compile?     │
│  Yes → Commit            │
│  No → Try again          │
└──────────────────────────┘
```

Linear, no feedback, no verification.

**Kiedy Vibe Code DZIAŁA:**
- ✅ Proste, izolowane zmiany (add console.log, rename variable)
- ✅ Prototypy, spike solutions ("sprawdźmy czy to w ogóle możliwe")
- ✅ Throwaway code (hackathon, one-time script)
- ✅ You're the only dev, small project

**Kiedy Vibe Code NIE WYSTARCZA:**
- ❌ Złożone projekty z istniejącą architekturą (Mattermost: 21k commits!)
- ❌ Legacy codebase gdzie trzeba wykorzystywać ponownie wzorce (wymyślanie na nowo = dług techniczny)
- ❌ Team collaboration gdzie consistency matters
- ❌ Production code gdzie security, reliability, maintainability matter

**Key insight:**
Vibe Code jest kusząco szybki (5 min "implementation"), ale hidden cost w przeróbkę (2-3h).

**Transition:**
"Zobaczmy Vibe Code w akcji - live demo!"

---

### Slajd 9: 🎬 LIVE DEMO 1 - Vibe Code Approach

## 🎬 LIVE DEMO: Vibe Code

**Konfiguracja:**
- **Zadanie:** "Add search to flagged posts in Mattermost"
- **Tool:** Cursor / GitHub Copilot
- **Context:** Minimal (tylko otwarty plik)
- **Prompt:** "add search functionality to flagged posts"

**Spodziewany rezultat:**
- ✅ Go handler generated
- ⚠️ Implementacja od zera (wymyśla koło na nowo)
- ⚠️ Ogólne wzorce (nie używa stylu projektu)
- ❌ Brak testów

**Po demo:** Porównanie z DoD checklist

---

**[SPEAKER NOTES]**

[TIMING: 5 min live demo]

**Przygotowanie przed demo:**
- Otwórz Mattermost repo
- Clean git status
- Otwórz `server/api4/post.go` (referencja, ale nie dodawaj do context!)
- Przygotuj Cursor/Copilot (clear chat history)

**Demo steps:**

**1. [30 sec] Setup context:**
"Otwieram plik gdzie dodam endpoint. Żaden dodatkowy context. To symuluje typowy 'vibe code' workflow - mam pomysł, pytam AI."

**2. [1 min] Prompt:**
Wpisz w Cursor chat:
```
"add search functionality to flagged posts"
```

Pokaż prompt na ekranie. No context, no @files, no .cursorrules.

**3. [2 min] AI generuje kod:**
- Pokaż generated code
- Highlight:
  - "Wygląda dobrze, prawda?"
  - "Handler jest, endpoint jest"
  - "Kompiluje się!" (make test - pokaż że passes)

**4. [1 min] Quick analysis:**
Przewiń kod, komentuj na głos:
- "OK, mam handler"
- "Mam endpoint registration"
- "Używa... hmm, direct SQL? Interesting."
- "Auth check... nie widzę. Może jest?"
- "Tests? Nie widzę pliku."

**5. [30 sec] Summary:**
"Działający kod w 5 minut! Ale..."

**Spodziewany output (typical AI behavior):**

```go
// AI generated (ogólny, od zera):
func searchFlaggedPosts(c *Context, w http.ResponseWriter, r *http.Request) {
    // ⚠️ Wymyśla od nowa zamiast wykorzystać ponownie
    query := r.URL.Query().Get("query")

    // ❌ Brak walidacji
    // ❌ Brak sprawdzenia uwierzytelnienia (czy user ma prawo?)

    // ⚠️ Bezpośrednie SQL zamiast interfejsu SqlStore
    results, err := c.App.Srv().Store.GetFlaggedPostsSearch(query)

    // ⚠️ Ogólna obsługa błędów
    if err != nil {
        c.Err = model.NewAppError("searchFlaggedPosts", "app.post.search.error", nil, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Write([]byte(results.ToJson()))
}

// ❌ Plik testów nie utworzony
```

**Problems to highlight:**
1. **Wymyśla koło na nowo:** Nie używa istniejącego wzorca `SqlStore.Post.Search`
2. **Brak auth:** Brak `requireSession`, brak sprawdzenia uprawnień
3. **Brak walidacji:** Query params nie są walidowane
4. **Ogólne błędy:** Komunikaty błędów nie są przyjazne dla użytkownika
5. **Brak testów:** Plik `*_test.go` nie utworzony

**Po demo - pytanie do sali:**
> "Ile elementów z naszej DoD checklist zostało zrealizowanych?"

Answer: ~30-40% (zobaczymy za chwilę na następnym slajdzie)

**Transition:**
"Zobaczmy jak to wygląda compared to our DoD checklist..."

---

### Slajd 10: Analiza rezultatów Vibe Code vs DoD

## Vibe Code vs Definition of Done

**Rezultat:**
- ✅ **Realized:** ~30-40% of DoD
- ⚠️ **Partial:** ~30% (needs work)
- ❌ **Missing:** ~30-40%

**Metrics:**
- ⏱️ **Implementation:** 5 min ⚡
- 🔧 **Rework needed:** 2-3h 😰
- ⚠️ **Risk:** Production bugs, security issues

> **Kluczowa obserwacja:** "Działa" ≠ "Production ready"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Porównanie szczegółowe z DoD checklist (slide 7):**

**BACKEND (7 items):**
- Endpoint implemented: ✅ (ale wymyśla wzorzec na nowo)
- Query params validated: ⚠️ (podstawowa, ale brakuje przypadków brzegowych: min length, max length, sanitization)
- Integration z search: ⚠️ (bezpośrednie SQL zamiast wykorzystać ponownie `SqlStore.Post.Search`)
- Permission check: ❌ (brak auth middleware, brak sprawdzenia własności użytkownika)
- Error handling: ⚠️ (ogólne błędy 500, brak konkretnych 400/401/403/404)
- Unit tests: ❌ (brak pliku testów)
- Performance: ❓ (nie przetestowane, nieznane czy <200ms, brak wzmianek o indeksach)

**Score Backend: 1/7 full ✅, 3/7 partial ⚠️, 3/7 missing ❌**

**FRONTEND (6 items):**
- SearchBox component: ⚠️ (podstawowy input, ale brak struktury, brak debouncing)
- Loading state: ❌ (brakuje)
- Error states: ❌ (brakuje obsługi dla braku wyników, błędu sieci, nieautoryzowanych)
- Pagination: ❌ (brakuje)
- Component tests: ❌ (brak testów)
- Dostępność: ❌ (brak aria-labels, brak nawigacji klawiaturą)

**Score Frontend: 0/6 full ✅, 1/6 partial ⚠️, 5/6 missing ❌**

**SECURITY + E2E + DOCS (2 items):**
- E2E test: ❌ (no E2E)
- Documentation: ❌ (no Swagger update, no README)

**Score Other: 0/2 ✅**

**TOTAL SCORE:**
- **Fully Realized:** 1-2 items = ~10-15% ✅
- **Partially Done:** 4-5 items = ~30% ⚠️ (needs przeróbkę)
- **Missing:** 8-9 items = ~50-60% ❌

(Note: Earlier estimate "30-40%" was generous, reality is ~10-15% fully done)

**Matematyka czasu:**

**Implementation (vibe code):** 5 min
- Write prompt: 30 sec
- AI generates: 2 min
- Przegląd& commit: 2.5 min

**Rework needed:** 2-3h
- Add auth & permission check: 20 min
- Add validation: 15 min
- Refactor to use SqlStore pattern: 30 min (zbadaj istniejące + refactor)
- Add unit tests (backend): 30 min
- Add component tests (frontend): 20 min
- Add E2E test: 20 min
- Add loading/error states: 15 min
- Add pagination: 20 min
- Security przegląd& fixes: 15 min
- Documentation: 10 min
- **Total: ~3h 15min**

**Overall:**
- **Vibe code total time:** 5 min + 3h 15min = **3h 20min**
- **Production risk:** Wysokie (luki bezpieczeństwa, brak testów, brakujące przypadki brzegowe)
- **Jakość kodu:** Niska (wymyśla wzorce na nowo, trudny do utrzymania)

**Key insight:**
"Działa" (compiles, runs dla podstawowego scenariusza) ≠ "Production ready" (DoD satisfied)

Vibe code gives FALSE sense of speed. You're fast initially (5 min), but pay later (3h przeróbkę).

**Comparison:**
```
Vibe Code:      [■] 5 min impl + [■■■■■■■] 3h przeróbkę = 3h 5min total
AI Proper Way:  [■■■] 40 min (badania+plan+impl) = 40 min total

Savings: 2h 25min (4.6x faster!)
```

**Transition:**
"Widzicie problem? Teraz dyskusja - czy rozpoznajecie ten pattern w swojej pracy?"

---

**[CUMULATIVE TIMING: CZĘŚĆ 2 = 6 min | Running total: 23 min]**

---

## **CZĘŚĆ 3: PORÓWNANIE I DYSKUSJA**

### Slajd 11: Why Vibe Code Fails - Analiza

## Dlaczego Vibe Code zawodzi

**Główne problemy:**

| Problem | Impact |
|---------|--------|
| **Wymyśla wzorce na nowo** | 2-3h refaktoringu |
| **Brak testów** | Błędy po wdrożeniu |
| **Ogólne rozwiązania** | Słaba integracja |
| **Luki bezpieczeństwa** | Podatności |
| **Brak dostępności** | Wyklucza użytkowników |

> "Bad research → thousands of bad code lines"
> — ACE methodology

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Vibe Code Cycle (5 steps to failure):**

1. Quick prompt (30 sec, vague) → Generic code generated
2. Code doesn't fit architecture → Wymyśla koło na nowo
3. "Działa!" for basic case → Przypadki brzegowe? Security?
4. Production deployment → Bugs discovered by users, security incidents
5. Przeróbka (2-3h) → Fix + tests + refactor + review

→ See Backup B14 for full flowchart

**Główne problemy:**

**1. Wymyśla wzorce na nowo** - AI nie zna konwencji, generuje "swoje" wzorce
- Przykład: Nowy error handler zamiast `model.NewAppError`
- Impact: 2-3h przeróbek na dopasowanie do stylu projektu

**2. Brak testów** - AI nie generuje testów automatycznie
- Przykład: Działa dla basic case, crash na null input
- Impact: Błędy w produkcji, hotfix, utrata zaufania

**3. Ogólne rozwiązania** - "teoretycznie poprawny" kod, ale nie integruje się
- Przykład: Direct SQL zamiast SqlStore interface
- Impact: Łamie abstrakcję, trudny do testowania

**4. Luki bezpieczeństwa** - brak security mindset
- Przykład: Missing auth, SQL injection, XSS
- Impact: Security incidents, data breaches

**5. Słaba obsługa błędów** - fokus na podstawowy scenariusz
- Przykład: Brak handlera dla network/validation errors
- Impact: Crash, zły UX

**6. Brak dostępności** - nie zakłada dostępności bez instrukcji
- Przykład: Brak aria-labels, keyboard navigation
- Impact: Wyklucza użytkowników screen readerów, WCAG fail

**Kluczowa zasada ACE methodology:**
Jak mówią autorzy Advanced Context Engineering: błędy w fazie planowania prowadzą do setek linii złego kodu, a błędy w fazie badania (research) - do tysięcy.

**Matematyka (szacunkowo):**
- Bez badania/planu: AI generuje 1000 linii złego kodu → 8-12h refactor
- Z badaniem/planem (10-20 min): AI wykorzystuje wzorce → 0h przeróbkę
- **ROI: 24-72x** (efektywność może się różnić)

**Transition:**
"Czy rozpoznajecie te problemy? Szybka dyskusja..."

---

### Slajd 12: Dyskusja - Wasze doświadczenia

## Dyskusja (5 minut)

**Pytania do sali:**

1. **Rozpoznajecie ten pattern?**
   Quick prompts → "działa" → later problems?

2. **Najczęstsze problemy które odkrywacie?**
   Przypadki brzegowe? Security? Performance? Integration?

3. **Ile czasu zajmuje "doprowadzenie do porządku"?**
   Minutes? Hours? Days?

> **Key insight:** Vibe Code jest szybki na początku, ale kosztowny później.

---

**[SPEAKER NOTES]**

[TIMING: 5 min dyskusji]

**Facilitacja dyskusji:**

**Pytanie 1: "Czy rozpoznajecie ten pattern w swojej pracy?"**
[Show hands]
- Quick prompts → code that "works" → later problems?

Likely answers:
- "Tak, często AI generuje kod który compiles ale potem odkrywam że nie działa dla przypadków brzegowych"
- "Commitowałem 'działający' kod, a w przeglądzie kodu dostałem 20 komentarzy"
- "Wydawało się że feature gotowy, ale potem QA znalazło 10 bugów"

**Follow-up:** "Co było najczęstszym problemem?"

---

**Pytanie 2: "Jakie są najczęstsze problemy które potem odkrywacie?"**

Kategorie (zapisz na tablicy/slajdzie):
- Przypadki brzegowe not handled (null, empty, large values)
- Luki bezpieczeństwa (auth missing, SQL injection)
- Performance issues (N+1 queries, no caching)
- Integration problems (doesn't fit architecture)
- Missing tests
- Poor error handling
- No dostępność

Dla każdej wymienionej przez uczestników:
"Tak, to typowy problem. Dlaczego AI tego nie zrobił?"
→ Answer: Bo nie było w kontekście/promptcie

---

**Pytanie 3: "Ile czasu zwykle zajmuje wam 'doprowadzenie do porządku'?"**

Typical answers:
- "15-30 minut dla małych rzeczy"
- "1-2 godziny dla średnich features"
- "Pół dnia dla complex features"
- "Czasem przepisuję całość (kilka godzin)"

**Follow-up:** "Dlaczego tyle czasu?"
→ Answers: Refactoring, adding tests, fixing security, handling przypadków brzegowych

"Dokładnie! Wszystkie te rzeczy można było zrobić **right first time** gdybyśmy użyli proper approach."

---

**Summary (po dyskusji):**

**Key insight do zapamiętania:**
> "Vibe Code jest szybki na początku, ale kosztowny później.
> AI the Proper Way jest wolniejszy na początku, ale oszczędza czas w sumie."

**Diagram:**
```
Time investment:

Vibe Code:      [■] 5 min impl + [■■■■■■■] 3h przeróbkę = 3h 5min total
AI Proper Way:  [■■■] 40 min (badania+plan+impl) = 40 min total

Savings: ~2h 25min (4.6x faster)
```

**The math:**
- Vibe: Fast start (5 min) + Slow przeróbkę (3h) = 3h total
- Proper: Slower start (15 min badania/planowanie + 25 min impl) = 40 min total
- **Difference: 2h 25min saved!**

Plus:
- Better jakość kodu (wykorzystuje ponownie patterns)
- Lower risk (security reviewed, tested)
- Easier maintenance (podąża za konwencjami)
- Szybszy przegląd kodu (clear, well-structured)

**Transition:**
"Zobaczmy jak to zrobić properly. Zacznijmy od Context-Aware Agent."

---

**[CUMULATIVE TIMING: CZĘŚĆ 3 = 3 min | Running total: 26 min]**

---

## **CZĘŚĆ 4: AGENT ŚWIADOMY DoD**

### Slajd 13: Problem - AI nie zna Twojego projektu

## Problem: AI nie zna Twojego projektu

> "LLM nie zna Twojego projektu - musisz mu pokazać 'jak u nas się robi'"

**5 ograniczeń LLM:**
1. 🧊 Statyczne trenowanie (zamrożona wiedza)
2. 📊 Statystyka, nie logika
3. 💾 Ograniczone okno kontekstu
4. ❓ Brak domain knowledge
5. 🏗️ Nie zna architektury

**Rezultat bez kontekstu:**
```typescript
// ❌ Generic, but vulnerable
const results = await db.query(
  `SELECT * FROM posts WHERE content LIKE '%${query}%'`
)
// SQL Injection! No auth! No patterns!
```

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Kluczowy problem:**
> "LLM nie zna Twojego projektu - musisz mu pokazać 'jak u nas się robi'"

**5 fundamentalnych ograniczeń LLM:**

**1. Zamrożona wiedza** - trenowany do daty cutoff, nie zna Twojego projektu
- Impact: Generuje "teoretycznie poprawny" kod, nie "praktycznie użyteczny"

**2. Statystyka, nie logika** - generuje na podstawie wzorców w danych treningowych
- Impact: Generic solutions zamiast project-specific (np. Elasticsearch zamiast Twojego Bleve)

**3. Ograniczone okno kontekstu** - 200k tokens nie pomieści całego projektu (500k+ linii kodu)
- Impact: Musisz selective dodawać context (@files)

**4. Brak domain knowledge** - nie zna Twojego biznesu (HIPAA, regulacje finansowe)
- Impact: Może generować non-compliant code

**5. Nie zna architektury** - nie wie "jak u was się robi"
- Impact: Wymyśla wzorce na nowo, łamie konwencje (direct SQL zamiast SqlStore pattern)

**Przykład BAD (bez kontekstu):**

```typescript
// AI generuje to (ogólny, poprawne składniowo, ALE):
async function searchPosts(query: string) {
  const results = await db.query(
    `SELECT * FROM posts WHERE content LIKE '%${query}%'`
    // ❌ SQL Injection! (string interpolation)
  )
  return results
  // ❌ Brak auth check (kto ma prawo?)
  // ❌ Brak pagination (wszystkie rezultaty?)
  // ❌ Nie używa project abstractions (SqlStore? Repository pattern?)
}
```

Problemy:
- SQL Injection (string interpolation)
- Brak auth check
- Brak pagination
- Nie używa project patterns

**Key insight:**
AI jest stateless, project-agnostic. Musisz go "nauczyć" o Twoim projekcie poprzez context.

**Transition:**
"Jak to zrobić? 3 Filary Context-Aware Agent"

---

### Slajd 14: 3 Filary Context-Aware Agent

## 3 Filary Context-Aware Agent

**Agent świadomy kontekstu:**
- ✅ Zna Twój **tech stack**
- ✅ Rozumie **konwencje projektu**
- ✅ Zna **Definition of Done**
- ✅ Ma dostęp do **wielokrotnego użytku promptów**
- ✅ Potrafi **referencjonować istniejący kod**

**3 Filary:**
1. **Project Instructions** (.cursorrules)
2. **Prompt Library** (reusable templates)
3. **Smart Context** (selective @files)

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Definicja Context-Aware Agent:**
"Agent świadomy kontekstu = AI który zna Twój projekt i generuje kod zgodny z Twoimi conventions, nie ogólne rozwiązania"

**5 capabilities:**

1. **Zna Twój tech stack**
   - Backend: Go, PostgreSQL, Elasticsearch
   - Frontend: React, Redux, TypeScript
   - Testing: testify, Jest, Playwright
   - Wie które tools używać

2. **Rozumie konwencje projektu**
   - Naming: camelCase czy snake_case?
   - File structure: gdzie powinien być plik?
   - Error handling: jak projekt handleuje errors?
   - Auth patterns: jak projekt robi authentication?

3. **Zna Definition of Done**
   - Wie że każdy feature wymaga tests
   - Wie że security audit jest obowiązkowy
   - Wie że trzeba użyć istniejące wzorce
   - Automatycznie includes w generated code

4. **Ma dostęp do wielokrotnego użytku promptów**
   - Prompt library: templates dla common tasks
   - Consistency: wszyscy w teamie używają same prompts
   - Best practices: prompts zawierają learned lessons

5. **Potrafi referencjonować istniejący kod**
   - @files: konkretne pliki jako reference
   - Grep: znajdowanie istniejące wzorce
   - Wykorzystanie ponownie > wymyślanie na nowo

**3 Filary (architektura):**

Context-Aware Agent is built on three pillars:
1. **Project Instructions** (.cursorrules)
2. **Prompt Library** (.prompts/)
3. **Smart Context** (selective @files)

→ See Backup B14 for architecture diagram

**Filar 1: Project Instructions** - Jak "u nas się robi"
- File: `.cursorrules` (Cursor) lub `.github/copilot-instructions.md` (Copilot)
- Contains: Tech stack, conventions, DO/DON'T, DoD
- Loaded automatically każdym razem
- Benefit: AI "pamięta" project rules

**Filar 2: Prompt Library** - Reużywalne wzorce
- Folder: `.prompts/backend/`, `.prompts/frontend/`, `.prompts/testing/`
- Contains: Templates dla common tasks
- Usage: @.prompts/backend/api-endpoint.md
- Benefit: Consistency w teamie, nie wymyślanie na nowo prompts

**Filar 3: Smart Context** - Tylko istotne pliki
- Problem: @codebase zjada 80% okno kontekstu
- Solution: Selective @files
- Rules:
  - Adding new? @reference-similar-file.ts
  - Modifying? @target-file.ts
  - Architecture? @.ai/architecture.md
- Benefit: AI focused, nie overwhelmed

**Together:**
3 filary → AI generuje kod który:
- Wykorzystuje ponownie istniejące patterns (80% ponownego wykorzystania vs 20%)
- Podąża za konwencjami (no refactoring needed)
- Passes DoD (security, tests, docs included)
- Integrates well (architecture-aware)

**Result:**
- Implementation time: Similar (~25 min)
- Przeróbka time: Near zero (~5 min review)
- Total: ~30 min (vs 3h with vibe code)
- Savings: 6x faster!

**Transition:**
"Zobaczmy każdy filar szczegółowo, starting with Project Instructions"

---

### Slajd 15: Filar 1 - Project Instructions

## Filar 1: Project Instructions

**File:** `.cursorrules` / `.github/copilot-instructions.md`

**Zawiera (5 sekcji):**
1. 📦 **Tech Stack** - Backend, Frontend, Testing
2. 🏗️ **Architecture** - Patterns, conventions
3. 🧪 **Testing** - Coverage, requirements
4. ❌ **DO NOT** - Red lines, anti-patterns
5. ✅ **Definition of Done** - Checklist przed commit

> AI automatycznie rozumie Twoje conventions

📥 **Template dostępny w materiałach**

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Setup Project Instructions:**

Create `.cursorrules` (Cursor) or `.github/copilot-instructions.md` (Copilot) with 5 sections:

1. **Tech Stack** - Backend/Frontend/Testing stack → AI knows which libraries
2. **Architecture Patterns** - API layer, data layer, frontend patterns → AI reuses existing patterns
3. **Testing Requirements** - 80% coverage, happy + 3 edge + errors → AI includes tests automatically
4. **DO NOT** - Anti-patterns (bypass auth, direct SQL, 'any' types) → AI avoids red lines
5. **Definition of Done** - Checklist (tests pass, security audit, error handling) → See Slajd 7 for full DoD

**Benefits:**
- Prompt length: -50% (no repeating conventions)
- Przeróbka: -80% (AI follows conventions first time)
- Onboarding: -70% (new devs read .cursorrules)

**Example:**
Without: "use SqlStore, add tests, check auth" in every prompt
With: AI knows implicitly

**Template in materials:** .cursorrules for Mattermost (adaptable to any project)

**Transition:** "Project-level done. Now task-level: Prompt Library"

---

### Slajd 16: Filar 2 - Prompt Library

## Filar 2: Prompt Library

**Struktura:**
```
.prompts/
├── backend/     (API endpoints, DB migrations)
├── frontend/    (Components, Redux patterns)
└── testing/     (Unit, E2E, security review)
```

**Korzyści:**
- 🔁 Konsystencja w zespole
- ⏱️ Oszczędność czasu (nie przepisywać)
- 📚 Wdrażanie (nowi devs widzą patterns)

**Usage:** `@.prompts/backend/api-endpoint.md`

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Co to jest Prompt Library:**
Folder z reusable prompt templates dla common tasks. Zamiast pisać nowy prompt każdym razem, wykorzystujesz ponownie tested template.

**Struktura folderów:**

```
.prompts/
├── backend/
│   ├── api-endpoint-mattermost.md
│   ├── database-migration.md
│   └── error-handling.md
├── frontend/
│   ├── component-scaffold.md
│   ├── redux-pattern.md
│   └── dostępność-audit.md
└── testing/
    ├── unit-test-generator.md
    ├── e2e-test-scaffold.md
    └── security-review.md
```

**Example prompt: `api-endpoint-mattermost.md`**

```markdown
# Generuj Mattermost API v4 Endpoint

## Context (auto-load)
@.cursorrules (tech stack & conventions)
@server/api4/post.go (reference pattern)
@server/model/post.go (structs)

## Task
Implement {METHOD} /api/v4/{resource} endpoint

## Requirements

### Backend (Go):
- Location: `server/api4/{resource}.go`
- Auth: Use `requireSession` middleware
- Validation: Validate all inputs, return 400 for invalid
- DB: Use `app.Srv().Store` interface (NO direct SQL)
- Errors: Use `model.NewAppError` (400, 401, 403, 404, 500)
- Tests: Create `server/api4/{resource}_test.go` with `th.Client`

### Test cases:
- Happy path (authenticated user, valid input)
- Przypadki brzegowe:
  - Empty/null inputs → 400
  - Unauthorized user → 401
  - User without permission → 403
- Error scenarios:
  - Database error → 500
  - Resource not found → 404

### Frontend (React/TS):
- Client method: `webapp/channels/src/client/client4.ts`
- Redux action: `actions/{resource}_actions.ts`
- Selector: `selectors/{resource}.ts`
- Component tests: RTL, mock API calls

## DoD Checklist
- [ ] Endpoint implemented with auth middleware
- [ ] Input validation (all przypadki brzegowe)
- [ ] Tests (happy + 3 edge + 2 errors)
- [ ] Security audit (auth, injection, secrets)
- [ ] Follows Mattermost API v4 conventions
- [ ] Documentation (JSDoc, Swagger spec)

## Output
Generate code in 1-2 commits:
1. Backend (endpoint + tests)
2. Frontend (client + action + tests)
```

**Jak używać:**

W Cursor/IDE:
```
Cmd+L (chat)

"Use @.prompts/backend/api-endpoint-mattermost.md

Implement GET /api/v4/users/{user_id}/posts/flagged/search

Additional requirements:
- Query params: terms, page, per_page
- Use Bleve search engine
- Max 100 results per page"
```

AI:
1. Czyta template prompt
2. Loads @.cursorrules, @reference files
3. Fills in {METHOD} = GET, {resource} = posts/flagged/search
4. Generuje zgodnie z all requirements w template
5. Includes tests, validation, auth

**Result:**
- Code podąża za konwencjami projektu ✅
- Tests included ✅
- Security checks ✅
- Documentation ✅
- **Time:** 25 min (vs 3h with vibe code)

**Korzyści Prompt Library:**

**1. Konsystencja w zespole**
- Wszyscy używają tego samego template
- Wszystkie endpoints wyglądają podobnie
- Easy to przegląd(znasz pattern)
- Wdrażanie: nowi devs widzą "jak u nas się robi"

**2. Oszczędność czasu**
- Nie przepisywać tego samego prompt 20 razy
- Template tested, works
- Focus na business logic, nie na "jak napisać prompt"
- **Savings:** 5-10 min per task

**3. Continuous improvement**
- Znajdziesz lepszy pattern? Update template
- Wszyscy w teamie benefit instantly
- Template evolves z projektem

**4. Knowledge capture**
- Learned lessons captured w prompts
- "We had SQL injection in PR #1234" → add check to template
- Templates są living documentation

**Ile templates potrzeba:**
- Start: 5-8 templates (core tasks)
  - API endpoint
  - React component
  - Unit test
  - E2E test
  - Security review
- Grow: Add template gdy widzisz pattern (3+ uses = template worthy)
- Mature project: 20-30 templates

**Template w materiałach:**
Dostaniecie starter pack: 10 templates (backend, frontend, testing)

**Transition:**
"Mamy project rules, mamy task templates. Teraz: Smart Context Management"

---

### Slajd 17: Filar 3 - Smart Context Management

## Filar 3: Smart Context Management

**Problem:** `@codebase` zjada 80% okno kontekstu

**Solution: Selective context**

**✅ DO:**
- @specific-file.ts (pattern to follow)
- @.cursorrules (project rules)
- @target-file.ts (file to modify)

**❌ DON'T:**
- @src/ (too much!)
- @Codebase (only if needed)

> **ACE Insight:** Keep context 40-60% utilization

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**4 Context Problems & Solutions:**

1. **@-mention overload** (adding @src/ = 50k lines = 40% context wasted)
   - Solution: Use selective @files (.cursorrules + target + reference pattern)

2. **Lost context** (AI doesn't know project patterns)
   - Solution: Store research in .ai/ docs, reference as needed

3. **Wrong files** (too broad = AI confused)
   - Solution: Semantic search first → find exact files → add specific paths

4. **Context drift** (stale files from previous task)
   - Solution: Clear context every 30-45 min, start fresh when switching topics

**Key insight:** Context = AI's memory. Bad context → bad code.

**ACE Rule:** Keep context at 40-60% utilization
- Why: Leaves room for AI reasoning (20-30%) + output generation (20-30%)
- At 90%+: AI has no room to think → shallow, generic answers

**Decision tree:**
- Similar code exists? → @reference-file.ts
- Modifying existing? → @target-file.ts
- Framework docs? → Context7 MCP (don't paste docs)
- Architecture? → @.ai/architecture.md

**Transition:** "3 filary gotowe. Now: ACE Method - Research → Plan → Implement"

---

**[CUMULATIVE TIMING: CZĘŚĆ 4 = 15 min | Running total: 41 min]**

---

## **CZĘŚĆ 5: AI THE PROPER WAY - ACE METHOD**

### Slajd 18: Rekomendowane modele (Q1 2025)

## Rekomendowane modele AI (2025)

> **Uwaga:** Nazwy modeli i ceny aktualne na styczeń 2025

| Model | Context | Best For | Cost |
|-------|---------|----------|------|
| **Claude Sonnet 3.5** | 200K | Complex reasoning, planning | $$$ |
| **Gemini 1.5 Pro** | 1M | Large codebase exploration | $$ |
| **GPT-4 Turbo** | 128K | Quick tasks, refactoring | $$ |

**Dla Mattermost case study:**
- Research: Gemini 1.5 Pro (large context) / GPT-4 Turbo / Sonnet 3.5
- Planning: Gemini 1.5 Pro (large context) / GPT-4 Turbo / Sonnet 3.5
- Implementation: Sonnet 3.5 / GPT-4 Turbo

> Nie ma jednego "najlepszego" - dobieraj do fazy

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Current AI landscape (Q1 2025):**

**Top models for coding:**

**1. Claude Sonnet 3.5**
- Context: 200K tokens (~150k words)
- Strengths:
  - Best reasoning capabilities (planning, architecture)
  - Excellent jakość kodu
  - Good security awareness
  - Handles ambiguity well
- Best for: Research, Planning, Complex features
- Cost: $$$ (~$3 per 1M input tokens, $15 per 1M output)
- Access: Claude.ai (web), Claude API, Cursor (via API key)

**2. GPT-4 Turbo** (not in table, but mention)
- Context: 128K tokens
- Strengths: General purpose, fast, good integration
- Best for: General tasks, when Claude unavailable
- Cost: $$$ (~$10 per 1M tokens)

**3. Gemini Pro 1.5**
- Context: 1M tokens (~750k words ~3000 pages!)
- Strengths:
  - Massive okno kontekstu (can see huge codebases)
  - Good for exploration
  - Cheaper than Claude/GPT-4
- Best for: Research phase (large codebase exploration)
- Cost: $$ (~$1.25 per 1M tokens)
- Access: Google AI Studio, Gemini API



**Recommendation for case study (Mattermost):**

**Phase 1: Research (5-10 min)**
- Model: Gemini 1.5 Pro (large context) OR Claude Sonnet 3.5 (reasoning)
- Why:
  - Gemini: Can ingest large portions of codebase, find patterns
  - Claude: Better at reasoning about architecture
- Task: "Research how search works in Mattermost"

**Phase 2: Planning (5 min)**
- Model: Claude Sonnet 3.5
- Why: Best planning, considers przypadki brzegowe, security
- Task: "Create technical plan for flagged posts search"

**Phase 3: Implementation (20-30 min)**
- Tool: Cursor (with Claude) / GitHub Copilot
- Why:
  - IDE integration (seamless workflow)
  - Inline completions (faster typing)
  - Multi-file editing (Cursor Composer)
- Task: "Implement according to plan"

**Kluczowa zasada:**
> "Nie ma jednego 'najlepszego' modelu - dobieraj do fazy pracy"

Different phases need different strengths:
- Research: Large context (Gemini) or deep reasoning (Claude)
- Planning: Best reasoning (Claude Sonnet 3.5)
- Implementation: Best integration (Copilot, Cursor)
- Quick fixes: Fast & cheap (Claude Haiku)

**Cost optimization:**
- Use cheaper models for simple tasks (Haiku for refactoring)
- Use expensive models only for complex (Sonnet for architecture)
- Example monthly cost (heavy usage):
  - Research: 10 tasks × $0.20 = $2
  - Planning: 20 tasks × $0.50 = $10
  - Implementation: 50 tasks × $0.10 = $5
  - Total: ~$17/month (plus Copilot subscription $20)
  - **Total: ~$37/month** (affordable!)

**Transition:**
"Wybierzcie model. Teraz workflow: Research → Plan → Implement"

---

### Slajd 19: RESEARCH PHASE - Uczenie AI o projekcie

## RESEARCH PHASE (5 min)

**Cel:** Zrozumieć jak projekt działa PRZED pisaniem kodu

**4-step process:**
1. **Explore codebase** (semantic search, git gorące punkty)
2. **Ask AI to research** (podagent: "How does X work?")
3. **Review research** (HITL: verify, check hallucinations)
4. **Capture knowledge** (save to `.ai/research-X.md`)

**Tools:** Cursor semantic search, Context7 MCP, git analysis

> **ACE:** "Review research and plans - more leverage than reviewing code"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**RESEARCH PHASE - Učenie AI o projekcie**

**Goal:**
Zrozumieć jak projekt działa, find istniejące wzorce, identify gotchas PRZED pisaniem kodu.

**Why research?**
- Bez badania: AI wymyśla wzorce, łamie konwencje → tysiące linii złego kodu
- Z badaniem: AI wykorzystuje istniejące wzorce → ~80% ponowne wykorzystanie kodu

**4-Step Research Workflow:**

1. **EXPLORE CODEBASE** (2-3 min) - Semantic search, git hotspots, architecture docs
2. **ASK AI TO RESEARCH** (2 min) - Podagent finds patterns, schemas, auth, tests → .ai/research-search.md
3. **REVIEW RESEARCH (HITL)** (3-5 min) - Check hallucinations, verify paths, confirm patterns
4. **CAPTURE KNOWLEDGE** (2 min) - Save to .ai/ with key files, patterns, constraints

Total time: 10-12 min | → See Backup B14 for detailed flowchart

**Step 1: Explore codebase (manual + AI)**

Tools:
- **Cursor:** Cmd+Shift+K → Semantic search ("how does search work")
- **Grep:** Find exact functions (`grep -r "SearchPosts"`)
- **Git gorące punkty:** Most changed files (`git log --name-only | sort | uniq -c`)
- **Architecture docs:** Check `/docs`, `README.md`, `.ai/`

Questions to answer:
- Where is similar feature implemented?
- What patterns does project use?
- What are file/folder conventions?

**Step 2: Ask AI to research (podagent)**

Prompt example:
```
"Research how search works in Mattermost. Find:
- Existing search implementations
- DB schema for posts and flags
- Auth patterns for user data
- Testing patterns

Context: @server/api4/post.go @server/store/sqlstore/

Output: .ai/research-search.md"
```

AI przeczyta pliki, znajdzie wzorce, napisze dokumentację (2-3 min).

**Step 3: Przeglądresearch (HITL)**

CRITICAL: Zweryfikuj research!
- Czy pliki istnieją? (grep -r)
- Czy wzorce aktualne? (git log)
- Brak halucynacji?
- Ma sens?

Jeśli wątpliwości: pytaj AI lub zespół (3-5 min weryfikacji).

**Step 4: Capture knowledge**

Save to `.ai/research-{feature}.md`:
```markdown
# Research: Feature X

## Key Files
- Path/file.go - Purpose

## Patterns to Follow
- API: Use middleware X
- DB: Use interface Y

## Constraints
- MUST: Permission checks
- MUST: Pagination

## Related: PR #123, Issue #456
```

Dla: przyszłe zadania, wdrażanie zespołu, kontekst AI (2 min).

**Tools:**
- **Cursor:** Semantic search (Cmd+Shift+K), @-mentions, codebase chat
- **Context7 MCP:** Fresh docs dla frameworks/libraries
- **Git:** `git log --name-only` (gorące punkty), `git log --grep` (related commits)

**Kluczowy insight (ACE):**
> "Review the research and plans - you get more leverage than reviewing code.
> Bad research → thousands of bad code lines"

**ROI:**
- 5 min przeglądu research → zapobiega 3h złej implementacji (leverage: 36x)
- Bez research: 30 min implementacji + 2h przeróbki = 2.5h zmarnowane

**Transition:**
"Research done. Now: Planning - what and how to implement"

---


### Slajd 20: PLAN PHASE - Spec-Driven Development

## PLAN PHASE (5 min)

**Cel:** Zdefiniować CO i JAK zaimplementujemy

**4-step process:**
1. **Create PRD** (with AI: requirements, przypadki brzegowe)
2. **Create tech plan** (with AI: architecture, steps, tests)
3. **Review plan** (HITL: architecture OK? Security?)
4. **Approve & proceed** (team aligned, ready)

> "Planning 15 min oszczędza 3h refactoringu"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Goal:** Define WHAT (requirements) and HOW (technical approach) BEFORE coding.

**Why planning?**
- 30 min planning saves 4h debugging
- Catch architecture mistakes before implementation
- Align team before work starts
- Planning jest tańsze niż fixing code

**4-Step Process:**

**1. Create PRD (2 min with AI)**
- Prompt: "Based on research, create PRD for {feature}"
- Include: User stories, requirements, edge cases, DoD
- Output: `.ai/prd-{feature}.md`

**2. Create Tech Plan (3 min with AI)**
- Prompt: "Create tech plan for @.ai/prd-{feature}.md"
- Context: @.ai/research-{feature}.md, @.cursorrules, @similar-file
- Output: Architecture, 3-5 impl steps, testing strategy, security, rollout
- Format: `.ai/tech-plan-{feature}.md`

**3. Review Plan (5 min HITL) - CRITICAL checkpoint!**
- Check: Architecture sound? Security considered? Edge cases covered?
- Check: Realistic estimate? Aligned with DoD? Testing adequate?
- If issues: Iterate with AI → "Plan has issue X, how to fix?"
- ROI: 5 min review saves 3h bad implementation (36x!)

**4. Approve & Proceed**
- Save plan, share with team, get alignment
- Everyone knows "what" and "how"
- Easier code review (reviewers see plan first)

**Real example:**
- No plan: 30 min impl + 2h refactor + 1h bugs + 30 min tests = 4h
- With plan: 10 min research + 5 min plan + 40 min impl = 55 min
- Savings: 3h 5min (5.5x faster!)

**ACE Insight:**
Bad research → thousands of bad code lines
Bad plan → hundreds of bad code lines
Good research + plan → correct code first time

See Backup B8 for full PRD/Tech Plan templates and examples.

**Transition:**
"Plan approved. Now: Implementation with Workflow 3×3"

---

### Slajd 21: IMPLEMENT PHASE - Workflow 3×3

## IMPLEMENT PHASE - Workflow 3×3

**Cel:** Małe kroki z częstymi checkpointami

**Circular flow:**
1. **3 small steps** (backend, frontend, E2E)
2. **Feedback (HITL)** (review, test, check DoD)
3. **Commit** (git commit, proceed)
4. **Repeat** (next 3 steps...)

**Example timing:** Step = 15 min impl + 5 min review

> "3 atomic commits > 1 giant commit"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**IMPLEMENT PHASE - Workflow 3×3**

**Goal:**
Implementacja w małych krokach z częstymi Human-in-the-Loop checkpointami. Zamiast waterfall (research → plan → impl → test), circular flow.

**Why small steps?**
- Łatwiejszy przegląd(100 linii vs 1000)
- Szybszy feedback (błędy po 15 min, nie 2h)
- Niższe ryzyko (izolowane bugi)

**Circular flow 3×3:**

Cycle: **Implement** (3 small steps: Backend, Frontend, E2E - 15min each) → **Feedback/HITL** (review code, run tests, check DoD - 5min) → **Commit** (atomic commit - 1min) → Repeat

→ See Backup B14 for circular flow diagram

**Example dla Flagged Posts Search:**

**Step 1: Backend (20 min)**

Prompt:
```
"Implement backend for flagged posts search
Context: @.ai/tech-plan-flagged.md @server/api4/post.go
Requirements: endpoint, auth, SqlStore, tests"
```

AI generates: handler, route, DB method, tests (15 min)

**HITL (5 min):**
- Przegląd: auth? SqlStore? tests?
- Security: SQL injection? input validation?
- Run: `make test-server` ✓
- DoD check ✓

If ✓ → commit. If issues → iterate.

**Step 2: Frontend (20 min)**

Prompt:
```
"Implement frontend for flagged posts search
Context: @.ai/tech-plan-flagged.md @webapp/channels/src/actions/
Requirements: SearchBox, debouncing, loading/error states, Redux, tests, dostępność"
```

AI generates: component, Redux (action/reducer), tests (15 min)

**HITL (5 min):**
- Przegląd: debouncing? states? pagination?
- Dostępność: aria-labels? keyboard nav?
- Run: `npm test` ✓
- Manual test: `npm run dev` ✓

If ✓ → commit.

**Step 3: E2E + Docs (15 min)**

Prompt:
```
"Add E2E test and docs
Context: @tests/e2e/
Requirements: E2E test (Playwright), Swagger, README, CHANGELOG"
```

AI generates: E2E test, documentation updates (10 min)

**HITL (5 min):**
- Run: `npm run test:e2e` ✓
- Docs: Swagger? README? CHANGELOG? ✓
- Final DoD: wszystkie 15 itemów? ✓

If ✓ → commit → DONE!

**Rezultat:**
- 3 atomic commits, każdy przetestowany
- 100% DoD coverage
- Czas: ~55 min (vs 3.5h vibe code = 3.8x szybciej!)
- Ponowne wykorzystanie kodu: ~80%

**Key benefits:**
1. **Szybszy feedback** - błędy po 20 min, nie 2h
2. **Niższe ryzyko** - każdy krok testowany osobno
3. **Łatwiejszy przegląd** - 3 małe PRs (100 linii) vs 1 gigantyczny (300 linii)
4. **Lepsza historia git** - atomowe commity ("feat(backend): ...", "feat(frontend): ...") vs ogólne "add search"

**Transition:**
"Zobaczmy to w akcji - Live Demo 2!"

---

### Slajd 22: 🎬 LIVE DEMO 2 - Research → Plan → Implement

## 🎬 LIVE DEMO: AI the Proper Way

**Setup:** To samo zadanie - "Add search to flagged posts"

**Approach:** Research → Plan → Implement (ACE method)

**Timing:**
- Research (5 min) - Semantic search, AI research doc
- Plan (3 min) - AI creates plan, HITL review
- Implement (7 min) - 3 steps with checkpoints

**Result:** 3 commits, 80% reuse, tests included, 12x faster than vibe code

**Fallback:** If demo fails, walk through .ai/ docs from backup

→ See **Backup B11** for detailed step-by-step script & prompts

---

**[SPEAKER NOTES]**

[TIMING: 15 min live demo]

**LIVE DEMO 2 - Research → Plan → Implement**

**Key demo points:**
1. **Research first** - Semantic search finds existing patterns
2. **Plan review** - HITL catches security/architecture issues early
3. **3 atomic commits** - Backend → Frontend → E2E, tested individually
4. **Compare to Demo 1** - 90-100% DoD vs 30-40%, 15min vs 3h
5. **Ask audience** - "How many DoD items completed this time?"

**Simplified flow:**
- Research: Cmd+Shift+K search → AI creates .ai/research-search.md
- Plan: AI creates .ai/tech-plan.md with security/architecture
- Implement: 3 steps, each with HITL checkpoint → commit

**Key insight to emphasize:**
> "Research prevented reinventing. Plan caught security. HITL prevented rework."
> Result: 12x faster, 3x better quality

**For detailed prompts, timing breakdown, troubleshooting → See Backup B11**

**Transition:**
"To była metoda. Zobaczmy porównanie before/after - Vibe Code vs ACE Method"

**Note:** For practical tools (Cursor symbols, shortcuts, MCP) → See **Backup B12-B13**

---

### Slajd 23: Before/After - Vibe vs ACE

## Before/After: Vibe Code vs ACE Method

| Metric | Vibe Code | ACE Method | Improvement |
|--------|-----------|------------|-------------|
| **Time to production-ready** | 3h 5min | 40 min | **4.6x faster** |
| **DoD coverage** | 40% | 100% | **2.5x better** |
| **Ponowne wykorzystanie kodu** | 20% | 80% | **4x better** |
| **Bug risk** | High | Low | Much safer |

> "15 min planning oszczędza 3h refactoringu"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**Before/After - Side-by-side comparison**

Porównajmy dwa approaches które zobaczyliście w live demos.

**Side-by-side comparison:**

**VIBE CODE:** Prompt (1min) → Impl (5min) → Przeróbka (3h) = **3h 5min total**
- DoD: 40% | Reuse: 20% | Commits: 1 giant | Review: Painful

**ACE METHOD:** Research (10min) → Plan (5min) → Impl (25min) = **40min total**
- DoD: 100% | Reuse: 80% | Commits: 3 atomic | Review: Easy

**Key metrics:**
- **Speed:** ACE 4.6x faster to production-ready
- **Quality:** ACE 2.5x better DoD coverage
- **Integration:** ACE 4x better code reuse
- **ROI:** 2h 25min saved per feature

→ See Backup B14 for full comparison table and cost breakdown

**Weekly impact (assuming 10 features/week):**

```
Developer working 40h/week on features:

Vibe Code approach:
10 features × 3h = 30h implementation
→ 10h left for other work

ACE Method approach:
10 features × 40 min = 6.7h implementation
→ 33.3h left for other work

Extra capacity: ~20-25h/week (potencjalnie 50-60% więcej czasu)
```

That's **extra 20+ hours per week** to:
- Work on 15 features instead of 10 (+50% throughput)
- Spend more time on architecture, refactoring
- Learn new technologies
- Mentor team members
- Actually go home at reasonable hour!

**Kluczowa obserwacja:**
> "Inwestycja w research i planning (15 min) zwraca się 9x w zaoszczędzonym czasie"

Math:
- Investment: 15 min (research + planning)
- Savings: 2h 25min (avoided przeróbkę)
- ROI: 145min / 15min = **9.7x return on investment!**

**Analogy:**
- Vibe Code = "Measure once, cut twice (or thrice)"
- ACE Method = "Measure twice, cut once"

Carpenter who measures twice:
- Spends 5 min extra measuring
- Saves hours on wasted materials and przeróbkę
- Delivers quality work first time

**Why ACE Method wins:**

1. **Research prevents wymyślanie na nowo**
   - 80% ponowne wykorzystanie kodu vs 20%
   - Follows project conventions
   - Integrates well with istniejący kod

2. **Planning catches issues early**
   - Architecture reviewed BEFORE coding
   - Security considered UPFRONT
   - Przypadki brzegowe identified in PLAN
   - Cheaper to fix in plan than in code

3. **3×3 Workflow enables fast iteration**
   - Small steps = faster feedback
   - HITL checkpoints = catch errors early
   - Atomic commits = easier przegląd& revert

4. **Result: Production-ready code**
   - Not just "works" but "passes DoD"
   - Lower bug risk
   - Faster przegląd kodu
   - Easier maintenance

**Transition:**
"Mamy methodology. Teraz: Feedback Loop - jak utrzymać quality"

---

**[CUMULATIVE TIMING: CZĘŚĆ 5 = 14 min | Running total: 55 min]**

---

## **CZĘŚĆ 6: FEEDBACK LOOP DLA AGENTA**

### Slajd 24: Automated Checks - Pre-commit Hooks

## Automated Checks - Pre-commit Hooks

**Cel:** Catch errors BEFORE they hit repository

**Pre-commit hook (5 checks):**
1. 🔍 Sprawdzanie stylu (ESLint, golangci-lint)
2. 📝 Sprawdzanie typów (TypeScript, Go vet)
3. 🧪 Unit tests (Jest, testify)
4. 🛡️ Skan bezpieczeństwa (npm audit, semgrep)
5. 🔑 Secret detection (grep for API keys)

> "Automated checks = AI gets instant feedback"

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Automated Checks - Pre-commit Hooks**

**Goal:**
Catch errors BEFORE they hit repository. AI generuje kod → automated checks validate → AI iteruje jeśli fail → tylko clean code gets committed.

**Why haki przed committem?**
- Instant feedback (AI learns within seconds)
- Consistent quality (every commit checked)
- Prevent bad code from entering repo
- Cheaper to fix before commit than after push

**Pre-commit hook setup:**

```bash
# .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. Sprawdzanie stylu
echo "1/5 Sprawdzanie stylu..."
npm run lint || exit 1

# 2. Sprawdzanie typów
echo "2/5 Sprawdzanie typów..."
npm run type-check || exit 1

# 3. Unit tests
echo "3/5 Unit tests..."
npm run test:unit || exit 1

# 4. Skan bezpieczeństwa
echo "4/5 Skan bezpieczeństwa..."
npm audit --audit-level=high || exit 1

# 5. Secret detection
echo "5/5 Checking for secrets..."
git diff --cached | grep -iE "(api_key|password|secret|token)[ ]*=" && {
  echo "❌ Potential secret detected!"
  exit 1
} || echo "✅ No secrets found"

echo "✅ All checks passed! Proceeding with commit..."
```

**5 checks explained:**

**1. Sprawdzanie stylu (code style, best practices)**
```bash
npm run lint          # JavaScript/TypeScript (ESLint)
golangci-lint run     # Go
```

Catches:
- Code style violations
- Unused variables
- Missing error handling
- Complexity issues

**2. Sprawdzanie typów (TypeScript, Go)**
```bash
npm run type-check    # TypeScript
go vet ./...          # Go static analysis
```

Catches:
- Type errors
- Missing types ('any' usage)
- Invalid casts
- Unreachable code

**3. Unit tests**
```bash
npm run test:unit     # Jest
go test ./...         # Go testify
```

Catches:
- Broken functionality
- Regression bugs
- Logic errors

**4. Skan bezpieczeństwa**
```bash
npm audit --audit-level=high    # Dependencies
snyk test                        # Vulnerabilities
semgrep --config=auto            # Code patterns
```

Catches:
- Vulnerable dependencies
- Known CVEs
- Security anti-patterns

**5. Secret detection**
```bash
git diff --cached | grep -iE "(api_key|password|secret|token)[ ]*="
```

Catches:
- Hardcoded API keys
- Passwords in code
- Tokens
- Credentials

**Dla Mattermost (example):**

```bash
# Backend (Go)
make test           # Unit tests
make check-style    # Sprawdzanie stylu
go vet ./...        # Static analysis

# Frontend (React/TS)
npm test            # Jest tests
npm run check       # ESLint + Prettier
npm run type-check  # TypeScript
```

**Workflow with AI:**

```
AI generates code
      ↓
Save files
      ↓
git add .
git commit -m "feat: search"
      ↓
Pre-commit hook runs
      ↓
Checks pass? ✅
├─ YES → Commit succeeds
└─ NO → Commit blocked
         ↓
         Show errors to AI
         ↓
         "Fix sprawdzanie stylu errors: [paste output]"
         ↓
         AI fixes
         ↓
         Try commit again
```

**Korzyść:**
> "Automated checks = AI gets instant feedback, iteruje szybciej"

Without hooks:
- AI generates code with sprawdzanie stylu errors
- You commit
- CI fails
- You fix manually (10 min)

With hooks:
- AI generates code
- Pre-commit catches errors (2 sec)
- You show errors to AI
- AI fixes (30 sec)
- Commit succeeds

**Time savings:** 10 min → 30 sec (20x faster iteration!)

**Setup (simple):**
```bash
# Install husky
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"
```

**Transition:**
"Mamy automated checks. Teraz: Testing strategy - jak testować z AI"

---

### Slajd 25: Testing Strategy - Równolegle z kodem

## Testing Strategy

**Anti-pattern:** Testy na końcu (1h 45min)
**Proper pattern:** Testy równolegle (45 min, no rework!)

**Testing pyramid:**
```
        E2E (1-2 critical flows)
           ↑
      Integration (API contracts)
           ↑
    Unit Tests (happy + 3 edge + errors)
```

**Prompt template:**
```
"Implement {function} with tests
- Happy path + 3 edge cases + 2 errors
- 100% coverage
Output: {file}.ts + {file}.test.ts"
```

→ See **Backup B10** for full code examples (Go/React tests)

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Testing Strategy - Równolegle z kodem**

**Anti-pattern vs Proper pattern:**

Anti-pattern (testy na końcu): Write all code (1h) → Write tests (30min) → Fix bugs (15min) = 1h 45min total
- Problems: Bugs found late, tests skipped, feels like "extra work"

Proper pattern (równolegle): Write feature + test (15min × 3) = 45 min total, no rework phase
- Benefits: Catch bugs immediately, no test debt, faster overall

**Testing pyramid (80% unit, 15% integration, 5% E2E):**
- Unit: Happy + 3 edge + errors (Jest/testify)
- Integration: API contracts (endpoint tests)
- E2E: 1-2 critical flows (Playwright)

**Prompt template (AI generates code + tests together):**
```
"Implement {function} with tests
Requirements:
- Happy path + 3 edge cases + 2 error scenarios
- Coverage: 100%
Output: {file}.ts + {file}.test.ts"
```

**Key principle:**
> "Tests generated WITH code = 100% coverage, no debt, consistent patterns"

**For detailed examples:**
- Go example: searchFlaggedPosts + tests → See Backup B10
- React example: SearchBox component + RTL tests → See Backup B10

**Transition:**
"Automated checks + tests. Teraz: Static Analysis - AI safety net"

---

### Slajd 26: Static Analysis Tools - AI Safety Net

## Static Analysis - AI Safety Net

**4 typy tools:**

1. **Code Quality** (ESLint, golangci-lint)
2. **Security** (npm audit, Snyk, semgrep)
3. **Bezpieczeństwo typów** (TypeScript strict, Go vet)
4. **Dostępność** (eslint-plugin-jsx-a11y, axe)

**Integration:** Pre-commit → CI → AI fixes based on errors

> "Static analysis = automated przegląd koduer"

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Why Static Analysis?**
AI catches logic, static analysis catches: patterns, security, style, accessibility.

**4 Essential Tools:**

1. **semgrep** - Security vulnerabilities (SQL injection, XSS, secrets, auth bypass)
2. **eslint / golangci-lint** - Code quality (style, complexity, unused code, smells)
3. **TypeScript strict / Go vet** - Type safety (null pointers, invalid casts, type errors)
4. **eslint-plugin-jsx-a11y / axe** - Accessibility (aria-labels, contrast, keyboard nav)

**Integration Workflow:**
AI generates → Pre-commit hook runs tools → Issues? → AI fixes based on error output → Re-run → Pass → Commit

**Benefits:**
- Fast iteration (AI fixes in seconds, not days)
- Consistent quality (all commits pass checks)
- AI learns from feedback

**Setup:** Pre-commit hook with tools configured (see Backup B10 for configs)

**Time savings:** Days of PR back-and-forth → Minutes of automated fixes

**Transition:** "Static checks done. Now: HITL checkpoints"

---

### Slajd 27: Human-in-the-Loop Checkpoints

## Human-in-the-Loop (HITL) Checkpoints

**Kluczowa zasada:**
> "AI nie pisze kodu produkcyjnego samodzielnie"

**5 checkpointów:**
1. **Po research** - Czy ma sens? (3-5 min)
2. **Po planning** - Czy plan dobry? (5 min)
3. **Co 3 kroki** - Czy kod OK? (5 min/step)
4. **Przed commitem** - 5-min checklist
5. **Przed PR merge** - Team review (20-60 min)

**Time investment:** ~30 min total saves 2h debugging

**Guardrails:** AI MOŻE generować, NIE MOŻE committować

→ See **Backup B9** for complete checklists & detailed verification steps

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Human-in-the-Loop Checkpoints - Kiedy zatrzymać AI**

**Kluczowa zasada:**
> "AI nie pisze kodu produkcyjnego samodzielnie.
> Każdy fragment wymaga ludzkiej weryfikacji."

Why HITL critical:
- AI makes mistakes (hallucinations, logic errors)
- AI lacks context (business requirements, przypadki brzegowe)
- AI no accountability (human responsible for code)
- HITL = quality gate

**5 Checkpointów HITL (simplified flow):**

1. Po research → Files exist? Patterns current? (3-5 min)
2. Po planning → Architecture OK? Security? DoD aligned? (5 min)
3. Co 3 kroki → Works? Safe? Tested? (5 min/step)
4. Przed commitem → Full DoD checklist (5 min)
5. Przed PR merge → Human approval required (20-60 min)

**Guardrails:**
- Agent MOŻE: Generate, test, iterate, suggest
- Agent NIE MOŻE: Commit, merge, deploy, delete data

**Key insight:**
> "5 min przegląd prevents 2h debugging"
> HITL savings: 12x cost reduction

**For detailed checklists, red flags, and action items → See Backup B9**

**Transition:**
"Feedback loop complete. Teraz: Best Practices dla daily workflow"

---

**[CUMULATIVE TIMING: CZĘŚĆ 6 = 8 min | Running total: 63 min]**

---

## **CZĘŚĆ 7: BEST PRACTICES**

### Slajd 28: Iteracja & Context Management

## Iteracja + Context Hygiene

**Iteracja = Norma (2-3 iteracje OK)**
- Prompt → AI output → HITL → refine → approved

**Red flags (>5 iteracji):**
- Vague prompts → Solution: Clear requirements
- Context drift → Solution: Fresh chat

**Context Hygiene (co 30-45 min):**
1. **Czyszczenie** - Nowy chat, clear old @files
2. **Rewind** - git checkout if AI broke code
3. **Konsolidacja** - 5 promptów → 1 comprehensive

---

**[SPEAKER NOTES]**

[TIMING: 4 min]

**PART 1: Iteracja jest normalna (15 lines)**

**Mindset shift:**
OLD: "AI should work perfectly first time"
NEW: "Iteration with AI is normal collaborative process"

**Typical workflow (THIS IS OK!):**
```
Prompt 1 → Basic implementation
HITL review → "Missing error handling"
Prompt 2 → Add error handling
HITL review → ✅ Approved
```

**Compare to human collaboration:**
You ask junior dev → Basic impl → Review → Iterate → Approved
Same with AI! AI = smart junior developer needing guidance.

**Success metrics:**
```
✅ 2-3 iteracje = efficient
⚠️ 4-5 iteracji = acceptable, can improve
🚨 >5 iteracji = red flag, change approach
```

**Red flags requiring approach change:**

🚨 **>5 iterations on simple feature:**
Problem: Vague prompt, insufficient context
Solution: Start over with explicit requirements, add @reference-files

🚨 **AI invents non-existent APIs:**
Problem: Hallucinations, missing context
Solution: Add @reference-files with real APIs, verify with grep

🚨 **Each iteration breaks previous work (context drift):**
Problem: AI forgets requirements, conflicting instructions
Solution: Restart session, consolidate into ONE comprehensive prompt

**Pro tip:** After 3 iterations → STOP → Consolidate all requirements → Fresh chat → Generate with everything at once

**PART 2: Context Hygiene (20 lines)**

**Problem: Context Drift**
```
Start: [■■■■■■________] 60% (good)
After: [■■■■■■■■■■____] 90% (AI struggles)
Full:  [■■■■■■■■■■■■■■] 100% (AI confused/slow)
```

**4 Strategies:**

**1. Czyszczenie (co 30-45 min):**
When: Switching topics, context >80%, AI confused
How: Start new chat (Cmd+Shift+N)
Keep: @.cursorrules, @current-file.ts
Remove: Old @files, previous topic history

**2. Rewind to working state:**
```bash
git status           # Check changes
git diff            # Review changes
git checkout -- file.ts   # Revert if AI broke code
```
When to use: AI broke code, messy changes, faster to revert than fix

**3. Przepisywanie prompts (vague → specific):**
BAD: "Fix the search"
GOOD: "Fix SearchBox component: add validation (min 2 chars), debouncing (300ms), update tests"
Include: specific component, clear issue, explicit requirements, expected behavior

**4. Konsolidacja requirements:**
Anti-pattern: 5 separate prompts (each risks breaking previous work)
Better: 1 comprehensive prompt with ALL requirements upfront
Benefits: No breaking work, consistent implementation, faster (1 iteration vs 5)

**Context hygiene checklist (every 30-45 min):**
□ Clear old @files
□ Fresh chat if switching topics
□ Re-add only essential context
□ Consolidate if >3 iterations
□ Check context utilization (< 80%)

**Signs you need cleanup:**
- AI slower responses
- AI forgetting requirements
- Context >80%

**Key insight:**
Iteration normal. But >5 iterations = poor planning.
Context hygiene prevents drift, keeps AI focused.

**Transition:**
"Iteration + clean context OK. Teraz: Legacy Code Toolkit"

---

### Slajd 29: Legacy Code Toolkit

## Legacy Code Toolkit

**Problem:** Unknown codebase, brak docs, złożone

**3-Step Process:**
1. **Git Hot Spots** (5 min) - Most changed files
2. **AI Wdrażanie** (20 min) - Research existing
3. **Verification** (15 min) - Testy regresji FIRST

> **Golden rule:** Testy regresji PRZED refactoringiem

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Problem with unknown legacy codebases:**
- No documentation (original team left)
- Outdated patterns (2015-style code)
- Complex dependencies (everything interconnected)
- Regression risk (change X breaks Y)

**3-Step Process:**

**1. Git Hot Spots (5 min)** - Find important files
- Command: `git log --since="1 year ago" --name-only | sort | uniq -c | sort -rn`
- Output shows most frequently changed files
- These are core files - start here

**2. AI Wdrażanie (20 min)** - Learn the codebase
- Prompt: "Research how {feature} works" with context @hot-spot-files
- Ask: How does it work? Patterns? Gotchas? Tests? Recent changes?
- Output: `.ai/wdrażanie-{feature}.md` (comprehensive research doc)

**3. Verification (15 min)** - Don't trust blindly
- grep -r "FunctionName" (does it exist?)
- Check go.mod/package.json (real packages?)
- git log (feature history)
- Ask team if uncertain (5 min question > 2h debugging)

**Golden Rule:**
"ZAWSZE najpierw testy regresji, POTEM refactoring"

**Why:**
- Legacy code often has no tests
- Refactoring without tests = danger
- First: Add regression test for current behavior
- Then: Refactor safely (tests catch regressions)

**Red flags:**
- No tests → Add regression tests FIRST
- Global state → Small steps, high risk
- Complex dependencies → Map before changing

See Backup B7 for detailed commands, prompts, and examples.

**Transition:**
"Best practices complete. Teraz: Podsumowanie warsztatu"

---

**[CUMULATIVE TIMING: CZĘŚĆ 7 = 6 min | Running total: 69 min]**

---

## **CZĘŚĆ 8: PODSUMOWANIE + Q&A**

### Slajd 30: 5 Kluczowych Takeaways

## 5 Kluczowych Takeaways

1. **Definition of Done** = fundament (measure success)
2. **Research → Plan → Implement** (9x faster than przeróbkę)
3. **Context-Aware Agent** = 80% ponowne wykorzystanie kodu
4. **Feedback Loop** = quality assurance (automated + HITL)
5. **Iteracja to norma** (2-3 iterations = efficient)

> "15 min planning oszczędza 3h refactoringu"

---

**[SPEAKER NOTES]**

[TIMING: 3 min]

**5 Kluczowych Takeaways - Summary**

**1. Definition of Done = fundament**
- 📋 Zdefiniuj DoD PRZED implementacją
- ✅ DoD dla AI jest szersze niż tradycyjne:
  - Hallucinations check
  - Security audit
  - Context relevance
- 🎯 DoD = miernik sukcesu:
  - Vibe Code: 40% DoD coverage
  - ACE Method: 100% DoD coverage
  - Measurement enables improvement

**2. Research → Plan → Implement (ACE)**
- 🔍 **Research** (5-10 min):
  - Poznaj projekt
  - Znajdź istniejące wzorce
  - Capture knowledge (.ai/research.md)
  - Prevents wymyślanie na nowo (80% ponowne wykorzystanie kodu)
- 📝 **Plan** (5 min):
  - Stwórz spec (PRD + tech plan)
  - PrzeglądZ AI (not sam!)
  - Catch issues BEFORE coding (36x leverage)
- ⚡ **Implement** (20-30 min):
  - Workflow 3×3 (small steps, HITL checkpoints)
  - Atomic commits (easy review, easy revert)
- **ROI:** 9x faster than vibe code przeróbkę

**3. Context-Aware Agent = 80% ponowne wykorzystanie kodu**
- 🏗️ **Project Instructions** (.cursorrules):
  - Tech stack, architecture, DO/DON'T, DoD
  - AI "remembers" project rules
- 📚 **Prompt Library** (.prompts/):
  - Reusable templates dla common tasks
  - Team consistency
- 🎯 **Smart Context** (selective @files):
  - 40-60% context utilization (leave room for AI reasoning)
  - Relevant files only (not @codebase)
- **Result:** AI generuje kod zgodny z conventions, nie generic

**4. Feedback Loop = quality assurance**
- 🤖 **Automated:**
  - Haki przed committem (lint, test, security, secrets)
  - Static analysis (ESLint, Snyk, semgrep)
  - Tests (generated WITH code, not after)
  - Instant feedback (AI fixes in seconds)
- 👤 **HITL (Human-in-the-Loop):**
  - After research (3-5 min)
  - After planning (5 min)
  - Every 3 steps (5 min per step)
  - Before commit (5-min checklist)
  - Before PR merge (team review)
- 🧪 **Testing:** Równolegle z kodem (nie na końcu!)
- **Result:** Catch errors early (5 min przegląd> 2h debugging)

**5. Iteracja to norma (nie porażka)**
- 🔄 **Healthy iteration:**
  - 2-3 iterations = efficient
  - Refining requirements
  - Improving quality
- 🧹 **Context hygiene:**
  - Clear old @files co 30-45 min
  - Start fresh chat when switching topics
- 🏚️ **Legacy code:**
  - Git gorące punkty → AI wdrażanie → Verification
  - Testy regresji FIRST, refactor AFTER
- 💡 **Mindset:** Collaboration with AI, not magic wand

**Summary stats (workshop recap):**

```
Vibe Code approach:
├─ Time: 5 min impl + 3h przeróbkę = 3h 5min total
├─ DoD: 40% coverage
├─ Ponowne wykorzystanie kodu: 20%
└─ Risk: High (no tests, luki bezpieczeństwa)

ACE Method approach:
├─ Time: 10 min research + 5 min plan + 25 min impl = 40 min total
├─ DoD: 100% coverage
├─ Ponowne wykorzystanie kodu: 80%
└─ Risk: Low (tested, secure, reviewed)

Improvement: 4.6x faster, 2.5x better quality
```

**Cytat zamykający:**
> "15 min planowania oszczędza 3h refactoringu.
> Programista ma pełną kontrolę i odpowiedzialność za kod."

Key mindset shift:
- AI nie zastępuje programisty
- AI to powerful tool w rękach skilled developer
- Human judgment, responsibility, quality control = critical
- ACE Method = struktura dla effective collaboration

**Transition:**
"Co dalej? Pierwsze kroki po warsztacie"

---

### Slajd 31: Pierwsze kroki po warsztacie

## Pierwsze kroki (4 tygodnie)

**Tydzień 1: SETUP**
- Wybierz projekt (Mattermost / własny)
- Stwórz .cursorrules
- Zdefiniuj DoD checklist

**Tydzień 2: PRACTICE**
- Pick "Good First Issue"
- Research → Plan → Implement
- Workflow 3×3

**Tydzień 3: CONTRIBUTE**
- Build Prompt Library (3-5 templates)
- Submit PR

**Tydzień 4: MEASURE**
- Track metrics (time, DoD %)
- Share with team

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Pierwsze kroki po warsztacie - 4-tygodniowy roadmap**

**TYDZIEŃ 1: SETUP (foundation)**

```
□ Wybierz projekt
  - Mattermost (Good First Issues)
  - LUB własny projekt

□ Setup dev environment
  - Clone repo
  - Install dependencies
  - Run tests (make test / npm test)

□ Stwórz .cursorrules
  - Use template z materiałów
  - Customize dla swojego projektu
  - Include: Tech stack, Architecture, DO/DON'T, DoD

□ Zdefiniuj Definition of Done
  - Use checklist template
  - Customize dla swojego projektu
  - 8-12 items (realistic)

Time investment: 3-5 hours
```

**TYDZIEŃ 2: PRACTICE (hands-on)**

```
□ Pick "Good First Issue"
  - Mattermost: github.com/mattermost/mattermost/issues?q=label:"Good+First+Issue"
  - Własny projekt: Prosty feature (search, filter, etc)

□ Apply ACE method:
  1. Research (10 min):
     - Find istniejące wzorce
     - AI research doc (.ai/research.md)
  2. Plan (5 min):
     - Create tech plan (.ai/tech-plan.md)
     - HITL review
  3. Implement (30 min):
     - Workflow 3×3 (3 small steps)
     - HITL checkpoint per step
     - 3 atomic commits

□ 5-min checklist przed commit
  - All DoD items checked

Time investment: 1-2 hours per feature
```

**TYDZIEŃ 3: CONTRIBUTE (share)**

```
□ Build Prompt Library
  - Create .prompts/ folder
  - 3-5 templates:
    - API endpoint
    - React component
    - Unit test
  - Customize z learned lessons

□ Submit PR
  - Mattermost LUB internal project
  - Use DoD checklist
  - Reference research & plan docs
  - Request review

□ Document learnings
  - .ai/lessons-learned.md
  - What worked well?
  - What needs improvement?
  - Tips for next time

Time investment: 2-3 hours
```

**TYDZIEŃ 4: MEASURE & ITERATE (improve)**

```
□ Track metrics:
  - Time saved (before vs after ACE)
  - DoD coverage (% items completed)
  - Ponowne wykorzystanie kodu (% ponownie wykorzystanych wzorców)
  - Bug rate (production issues)

□ Share with team:
  - Present results (show metrics)
  - Demo workflow (live coding)
  - Share templates (.cursorrules, .prompts)

□ Iterate process:
  - What worked? (keep doing)
  - What didn't? (improve)
  - What's missing? (add)

□ Join community:
  - 10xDevs Discord
  - Mattermost Contributors channel
  - Share experience

Time investment: 2-3 hours (+ ongoing)
```

**Kluczowe resources:**
- 🏠 **Mattermost:** github.com/mattermost/mattermost
- 📖 **Good First Issues:** Label "Good First Issue"
- 💬 **Community:** community.mattermost.com (#Contributors)
- 📝 **Templates:** .cursorrules + prompt library (w materiałach)
- 🎓 **10xDevs:** Full course (moduły 2x/3x/4x) - 10xdevs.pl

**Expected outcomes after 4 weeks:**
- 🎯 Implemented 3-5 features with ACE method
- ⏱️ 3-4x faster implementation (vs vibe code)
- ✅ 90%+ DoD coverage
- 📚 5-8 reusable prompt templates
- 👥 Team interested in approach

**Transition:**
"Materiały i kontakt"

---

### Slajd 32: Materiały i następne kroki

## Materiały + Kontakt

**🎁 Dostępne dla uczestników:**
- Templates (.cursorrules, DoD checklist)
- Prompt Library starter pack (10 templates)
- PRD + Tech Plan examples
- MCP setup guide

**📥 Pobierz:** `10xdevs.pl/workshop-ai-proper-way`

**📧 Kontakt:**
- Email: kontakt@10xdevs.pl
- Discord: 10xDevs Community
- LinkedIn: /company/10xdevs

---

**[SPEAKER NOTES]**

[TIMING: 2 min]

**Dostępne materiały:**
- Slide deck + speaker notes
- .cursorrules templates + DoD checklist
- Prompt Library (10 templates: backend, frontend, testing)
- PRD + Tech Plan + Research doc examples
- MCP setup guide (Context7, GitHub)
- Static analysis configs

**Download:** 10xdevs.pl/workshop-ai-proper-way

**Kontakt:**
- Email: kontakt@10xdevs.pl
- Discord: 10xDevs Community
- LinkedIn: /company/10xdevs

**Pytania?** → See Backup B1-B6 for comprehensive FAQ

**Dziękuję! Czas na Q&A**

---

**[CUMULATIVE TIMING: CZĘŚĆ 8 = 7 min | Running total: 76 min | Main presentation complete]**

---

## **Q&A (20 minut)**

**Pytania? Dyskusja? Doświadczenia?**

💡 Backup slides (B1-B6) available for detailed questions

---

## 🔒 BACKUP SLIDES

### Backup Slide B1: FAQ - Frequently Asked Questions

## FAQ - Top 8 Questions

1. **AI zastąpi programistów?** NIE. Human judgment critical.
2. **Jaki tool?** Cursor/Copilot/Claude - methodology działa ze wszystkimi
3. **Jak przekonać zespół?** Start small, show results, measure
4. **Hallucinations?** Verify: grep, compile, check docs
5. **Ile trwa nauka?** 1-2 tygodnie praktyki
6. **Bezpieczeństwo?** No PII/secrets in prompts, enterprise tools
7. **Go/TS nowy?** AI + Context7 pomaga się uczyć
8. **Długość PR review?** Zależy od size - małe PRs szybciej

📖 **Full answers in speaker notes**

---

**[SPEAKER NOTES]**

**Q1: Czy AI zastąpi programistów?**

Answer: **NIE.**

Reasons:
- AI to tool, nie replacement
- Mattermost: 21k+ commits, 8 lat historii - AI pomaga zrozumieć szybciej (20 min vs 2 dni)
- ALE human judgment kluczowy:
  - Architecture decisions (trade-offs, long-term implications)
  - Security considerations (threat modeling)
  - Design decisions (UX, API design)
  - Business requirements (what to build)
- Human-in-the-Loop zawsze potrzebny
- Future: Programmers who use AI effectively > programmers who don't

**Q2: Jaki tool wybrać? Copilot vs Cursor vs Claude?**

Answer: **Metodologia działa ze wszystkimi. Pick based on preference:**

- **Cursor:**
  - Best: długi context (@-mentions, composer)
  - Best: semantic search (codebase chat)
  - Best: multi-file editing (Cmd+I composer)
  - Cost: $$$ ($20/month + API costs)

- **GitHub Copilot:**
  - Best: integration z GitHub ecosystem (issues, PRs)
  - Best: inline completions (as you type)
  - Best: workspace context (auto-indexes)
  - Cost: $ ($10-20/month subscription)

- **Claude Code (CLI):**
  - Best: research + planning (deep reasoning)
  - Best: MCP integration (Context7, GitHub, etc)
  - Best: autonomous agents
  - Cost: $ (pay per use, ~$20-40/month heavy usage)

Key: Project Instructions (.cursorrules) działają wszędzie!

**Q3: Jak przekonać zespół do adopcji?**

Answer: **Start small, show results:**

1. **Pick one feature** (Good First Issue)
   - Don't try to change everything at once
   - Prove value first

2. **Document workflow** (.ai/action-plan.md)
   - Show research → plan → implement
   - Make process visible

3. **Show results** (metrics):
   - Time saved: 3h → 40 min (4.6x)
   - DoD coverage: 40% → 100% (2.5x)
   - Ponowne wykorzystanie kodu: 20% → 80% (4x)
   - Numbers convince

4. **Share templates** (.cursorrules, prompts)
   - Make it easy for team to start
   - Lower barrier to entry

5. **Present at team meeting**:
   - "How I used AI to implement feature X"
   - Live demo if possible
   - Share learnings

6. **Measure & iterate**:
   - Track metrics monthly
   - Adjust process based on feedback
   - Celebrate wins

**Q4: Jak radzić sobie z halucynacjami?**

Answer: **Verification workflow:**

1. `grep -r "FunctionName"` - Does it exist?
   ```bash
   AI: "Use SearchPosts function"
   You: grep -r "SearchPosts" .
   → Should find definition
   ```

2. Check `go.mod` / `package.json` - Real package?
   ```bash
   AI: "Import from github.com/some/package"
   You: cat go.mod | grep "some/package"
   → Should be in dependencies
   ```

3. Compile: `make test` - Does it build?
   ```bash
   AI generates code
   You: make test
   → Should compile without errors
   ```

4. Check docs (Swagger, README)
   - AI: "Call endpoint /api/v4/foo"
   - You: Check Swagger spec
   - → Should exist

5. Ask team if uncertain
   - 5 min Q > 2h debugging
   - "Hey, do we have function X?"

Rule: **Never trust "looks correct" - always verify!**

**Q5: Ile czasu zajmuje nauka metody?**

Answer: **Learning curve:**

- **Week 1:** Setup + explore (5-10h)
  - Setup tools (Cursor/Copilot)
  - Create .cursorrules
  - Explore codebase
  - Try first simple tasks

- **Week 2:** First feature with AI (10-15h includes learning)
  - Research → Plan → Implement
  - Many iterations (learning!)
  - Document learnings

- **Week 3-4:** Efficient workflow (5-8h per feature)
  - Less iterations (know patterns)
  - Faster prompting
  - Reusing prompt templates

- **After 1 month:** 3-4x productivity improvement
  - Confident with workflow
  - Built prompt library
  - Efficient iteration

Key: First PR wolniejszy (learning), but knowledge capture (.ai/) przyspiesza kolejne

**Q6: Co z bezpieczeństwem kodu w AI tools?**

Answer: **Best practices:**

**DO NOT paste:**
- ❌ Auth logic (authentication mechanisms)
- ❌ DB schemas with real data
- ❌ API keys, credentials
- ❌ PII (Personal Identifiable Information)
- ❌ Proprietary algorithms

**SAFE to use:**
- ✅ Public code (open source projects like Mattermost)
- ✅ Generic patterns (no business secrets)
- ✅ Documentation
- ✅ Test code (if no real data)

**Safeguards:**
- Use enterprise AI tools (with data privacy guarantees)
  - GitHub Copilot Enterprise
  - Claude Enterprise
  - OpenAI Enterprise
- **Pre-commit:** Secrets detection
  ```bash
  git diff | grep -i "api_key|password|secret"
  ```
- **Review:** AI code for security issues
  - SQL injection
  - Auth bypass
  - XSS
- **Policy:** Team AI usage policy (slide B5)

**Q7: Go/TypeScript jest nowy dla mnie - czy AI pomoże?**

Answer: **Tak! Learning pattern:**

1. **Use Context7 MCP:** Fresh docs dla Go/TypeScript
   ```
   "@docs golang effective go"
   "@docs typescript handbook"
   ```

2. **Reference istniejący kod:** `@reference-file.go`
   - AI shows patterns used in project
   - Learn by example

3. **AI explains patterns:**
   ```
   "Explain how SqlStore interface works
    Context: @server/store/sqlstore/post_store.go"
   ```

4. **Tests teach:** Read tests to understand usage
   - Tests = executable documentation
   - Shows how functions used

5. **Compile often:** Catch errors early
   - `go build` / `tsc` frequently
   - Fix as you go

Result: Learn by doing with real examples (faster than reading docs!)

**Q8: Jak długo trwa przeglądPR?**

Answer: **Zależy od:**

- **PR size:**
  - Small (3 commits, 100 lines each) = faster (<1 week typically)
  - Large (1 commit, 300 lines) = slower (1-2 weeks)
  - Rule: Smaller PRs → faster review

- **Tests:**
  - 100% coverage = faster approval (reviewer trusts)
  - Brak testów = slower (reviewer must test manually)

- **Quality:**
  - Podąża za konwencjami = less iterations
  - Wymyśla wzorce na nowo = more iterations

AI skraca implementation (40 min vs 4h), ALE human przeglądtime roughly stały.

**Tip:** Use ACE method → smaller, better PRs → faster overall cycle time

---

### Backup Slide B2: Security Checklist (AI-specific)

## Security Audit Checklist

**Before commit (2 min check):**

1. **SQL Injection** - Parameterized queries? ✓
2. **XSS** - Input sanitization? Output encoding? ✓
3. **Secrets** - No API keys/passwords in code? ✓
4. **Auth** - Permission checks? No bypass? ✓
5. **CSRF** - Tokens for state changes? ✓
6. **Input Validation** - Server-side validation? ✓

**Automated:** `semgrep --config=auto`

---

**[SPEAKER NOTES]**

Full security checklist - przed commitem każdego AI-generated code.

**Quick 2-minute audit:**

```
┌─────────────────────────────────────────────────┐
│ SECURITY AUDIT (2 min)                          │
├─────────────────────────────────────────────────┤
│ □ SQL Injection                                  │
│   • Parameterized queries? ✓                    │
│   • No string concatenation in SQL? ✓           │
│                                                  │
│ □ XSS (Cross-Site Scripting)                    │
│   • Input sanitization? ✓                       │
│   • Output encoding? ✓                          │
│   • No dangerouslySetInnerHTML? ✓               │
│                                                  │
│ □ Secrets                                        │
│   • No API keys in code? ✓                      │
│   • No passwords/tokens? ✓                      │
│   • Using environment variables? ✓              │
│                                                  │
│ □ Authentication & Authorization                │
│   • Auth check for protected endpoints? ✓       │
│   • Permission validation? ✓                    │
│   • No auth bypass? ✓                           │
│                                                  │
│ □ CSRF (Cross-Site Request Forgery)            │
│   • Tokens for state-changing operations? ✓     │
│                                                  │
│ □ Input Validation                               │
│   • Server-side validation? ✓                   │
│   • Sprawdzanie typów? ✓                            │
│   • Length limits? ✓                            │
└─────────────────────────────────────────────────┘
```

**Red flags examples:**

```typescript
// ❌ SQL Injection
const query = `SELECT * FROM posts WHERE id = ${userId}`

// ✅ Safe
const query = 'SELECT * FROM posts WHERE id = ?'
db.query(query, [userId])

// ❌ XSS
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ Safe
<div>{sanitize(userInput)}</div>

// ❌ Hardcoded secret
const API_KEY = "sk_live_abc123..."

// ✅ Safe
const API_KEY = process.env.STRIPE_API_KEY
```

**Automated skan bezpieczeństwa:**
```bash
npm audit                    # Dependencies
snyk test                    # Vulnerabilities
semgrep --config=auto        # Code patterns
git diff --cached | grep -iE "(api_key|password|secret)"
```

---

### Backup Slide B3: Metrics for Success

## Success Metrics

**Leading (weekly):**
- % team using AI tools
- % features with PRD/plan
- Avg iterations to approval

**Lagging (monthly):**
- Time from spec to production (should ↓)
- Bug escape rate (should not ↑)
- Developer satisfaction (NPS)

**Benchmarks (6 months):**
- Przegląd kodu time: -15-20%
- Time to feature: -20-30%
- Test coverage: maintain or ↑

---

**[SPEAKER NOTES]**

How to measure success of AI adoption.

**Leading Indicators** (measure weekly):

```
┌─────────────────────────────────────────────────┐
│ AI ADOPTION                                     │
├─────────────────────────────────────────────────┤
│ • % team using AI tools                         │
│ • % commits with AI assistance                  │
│ • # prompts from library vs ad-hoc              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PROCESS ADHERENCE                               │
├─────────────────────────────────────────────────┤
│ • % features with PRD/plan                      │
│ • % features using 3×3 workflow                 │
│ • # HITL checkpoints per feature                │
│ • Avg iterations to approval                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ QUALITY                                         │
├─────────────────────────────────────────────────┤
│ • Test coverage (should maintain/improve)       │
│ • # security issues in przegląd kodu              │
│ • # AI hallucinations caught                    │
└─────────────────────────────────────────────────┘
```

**Lagging Indicators** (measure monthly):

```
┌─────────────────────────────────────────────────┐
│ VELOCITY                                        │
├─────────────────────────────────────────────────┤
│ • Time from spec to production (should decrease)│
│ • Przegląd kodu cycle time (should decrease)      │
│ • PR size (should decrease - smaller commits)   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ QUALITY (long-term)                             │
├─────────────────────────────────────────────────┤
│ • Bug escape rate (should not increase!)       │
│ • Production incidents (should not increase!)   │
│ • Security vulnerabilities (should decrease)    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SATISFACTION                                    │
├─────────────────────────────────────────────────┤
│ • Developer satisfaction (survey 1-10)          │
│ • Przegląd kodu satisfaction                      │
│ • "Would you recommend AI workflow?" (NPS)      │
└─────────────────────────────────────────────────┘
```

**Success Benchmarks** (6 months post-adoption):
- 🎯 **Przegląd kodu time:** -15-20% reduction
- 🎯 **Bug escape rate:** No regression (maintain or improve)
- 🎯 **Developer satisfaction:** 7+/10
- 🎯 **Time to feature:** -20-30% reduction
- 🎯 **Test coverage:** Maintain or increase

**Dashboard example:**
```
Week 12 vs Baseline:
─────────────────────────────────────────
Time to feature:        -25% ✅ (3d → 2.25d)
Przegląd kodu time:       -18% ✅ (4h → 3.3h)
Bug escape rate:        +5%  ⚠️ (monitor!)
Test coverage:          +3%  ✅ (82% → 85%)
Developer satisfaction: 7.8/10 ✅
```

---

### Backup Slide B4: Legacy Code - Git Gorące punkty

## Legacy Code: Git Gorące punkty Analysis

**Command:**
```bash
git log --since="1 year ago" \
        --name-only --pretty=format: | \
  sort | uniq -c | sort -rn | head -20
```

**Output:**
```
156 server/app/post.go      ← Very active
142 server/api4/post.go     ← Start here
 89 server/store/post_store.go
```

**Interpretation:** Most changed = most important

---

**[SPEAKER NOTES]**

Git Gorące punkty = find important files in unknown codebase.

**Full command:**
```bash
git log --since="1 year ago" \
        --name-only \
        --pretty=format: | \
  sort | \
  uniq -c | \
  sort -rn | \
  head -20
```

**What it does:**
1. `git log --since="1 year ago"` - Commits from last year
2. `--name-only` - Show only file names
3. `--pretty=format:` - No commit messages
4. `sort | uniq -c` - Count occurrences
5. `sort -rn` - Sort by count (descending)
6. `head -20` - Top 20 files

**Output example (Mattermost):**
```
    156 server/app/post.go
    142 server/api4/post.go
     89 server/store/sqlstore/post_store.go
     67 webapp/channels/src/components/post_view/index.tsx
     54 webapp/channels/src/actions/post_actions.ts
     ...
```

**Interpretation:**
- `post.go` changed 156 times = very active
- These are core files = start here for understanding
- Team focuses here = good patterns
- High change frequency = important to business

**How to use:**
1. Run git gorące punkty
2. Pick top 3-5 files
3. Add to AI research context:
   ```
   "Research how posts work
    Context:
    @server/app/post.go
    @server/api4/post.go
    @server/store/sqlstore/post_store.go"
   ```
4. AI analyzes these key files first

**Pro tip:** Combine with git blame
```bash
# Who worked on this file?
git log --format="%an" server/app/post.go | \
  sort | uniq -c | sort -rn

# Output:
   45 John Doe      ← Ask John about this file!
   23 Jane Smith
   ...
```

---

### Backup Slide B5: Team AI Policy Template

## Team AI Usage Policy

**Approved Tools:**
- ✅ GitHub Copilot Enterprise
- ✅ Cursor (company license)
- ✅ Claude Code (approved accounts)

**Red Lines (NEVER):**
- ❌ Paste auth logic to public AI
- ❌ Paste PII/credentials
- ❌ Bypass przegląd kodu

**Required:**
- ✅ Use .cursorrules
- ✅ HITL every 3 steps
- ✅ Human PR review

---

**[SPEAKER NOTES]**

Template AI Usage Policy dla teams.

**Full Policy (markdown format):**

```markdown
# AI Development Policy v1.0

## 1. Approved Tools
✅ GitHub Copilot Enterprise
✅ Cursor (with company license)
✅ Claude Code (CLI, approved accounts)
⚠️ ChatGPT Plus (with restrictions below)

## 2. Red Lines (NEVER)
❌ Paste authentication logic to public AI
❌ Paste database schemas with real data
❌ Paste PII (Personally Identifiable Information)
❌ Paste API keys, secrets, credentials
❌ Paste proprietary algorithms
❌ Paste customer data
❌ Bypass przegląd kodu with AI-generated code

## 3. Required Practices
✅ Use project instructions (.cursorrules)
✅ Follow Definition of Done checklist
✅ HITL checkpoint co 3 kroki
✅ Haki przed committem (lint, tests, secrets scan)
✅ Human PR przeglądrequired (no auto-merge)
✅ Document AI-assisted work (.ai/*)

## 4. Definition of Done (with AI)
□ Przegląd kodued by human (not just AI)
□ Tests written (happy + edge + errors)
□ Security audit (SQL injection, XSS, auth)
□ No hallucinations verified
□ Follows project conventions
□ Documentation updated

## 5. Training Requirements
Week 1: Mandatory workshop "AI the Proper Way"
Week 2-3: Mentored practice (pair with senior)
Week 4+: Independent usage (with reviews)

## 6. Escalation
If uncertain about:
- Security implications → Ask Security team
- Architecture decisions → Ask Tech Lead
- AI tool usage → Ask DevOps/IT

## 7. Metrics & Review
- Monthly przeglądof AI usage metrics
- Quarterly policy update
- Incident retrospectives (AI-related bugs)
```

**Enforcement:**
- Haki przed committem (secrets detection)
- Przegląd kodu (human required)
- Automated scanning (SonarQube, Snyk)
- Regular audits (monthly)

**Consequences:**
- First violation: Warning + training
- Second: Restricted AI access
- Third: Escalation to management

---

### Backup Slide B6: Resources - Full List

## Resources

**Workshop Materials:**
- github.com/10xdevs/ai-proper-way
- Templates, checklists, prompt library

**Mattermost:**
- github.com/mattermost/mattermost
- Good First Issues label
- community.mattermost.com

**ACE Methodology:**
- github.com/humanlayer/advanced-context-engineering

**10xDevs:**
- 10xdevs.pl - Full course
- Discord community

---

**[SPEAKER NOTES]**

Complete list of resources.

**Workshop Materials:**
- 📝 `.cursorrules` template dla Mattermost
- 📋 5-min przegląd kodu checklist
- 📚 Prompt Library (10 templates):
  - Backend: API endpoint, DB migration, error handling
  - Frontend: Component, Redux, dostępność
  - Testing: Unit, E2E, security review
- 🎯 PRD template - Flagged Posts Search
- 📖 "AI the Proper Way" - Full guide (PDF)
- 🔧 MCP setup guide (Context7, GitHub)

**Mattermost Resources:**
- 🏠 **Repository:** github.com/mattermost/mattermost
- 📖 **Developer Docs:** developers.mattermost.com
- 📚 **API Docs:** api.mattermost.com
- 🐛 **Good First Issues:** github.com/mattermost/mattermost/issues?q=label:"Good+First+Issue"
- 💬 **Community:** community.mattermost.com
  - Channel: ~Contributors
  - Channel: ~Developers
- 📖 **Contributing Guide:** CONTRIBUTING.md

**ACE Methodology:**
- 📄 **Original article:** github.com/humanlayer/advanced-context-engineering-for-coding-agents
- 🔧 **HumanLayer repo:** github.com/humanlayer/humanlayer
  - Example commands (research, plan, implement)
  - .claude/commands/ templates

**Tools:**
- **Context7:** context7.com (MCP server dla fresh docs)
- **Cursor:** cursor.sh
- **GitHub Copilot:** github.com/features/copilot
- **Claude Code:** claude.ai/claude-code
- **Playwright:** playwright.dev

**10xDevs Community:**
- 💬 **Discord:** discord.gg/10xdevs
- 🎓 **Kurs pełny:** 10xdevs.pl/courses
  - 2x: Bootstrap (PRD, planning, DoD)
  - 3x: Production (team workflows, CI/CD)
  - 4x: Legacy (sensemaking, refactoring)
- 📧 **Newsletter:** Weekly tips
- 🌐 **Website:** 10xdevs.pl

**Contact:**
- 📧 Email: kontakt@10xdevs.pl
- 🐦 Twitter: @10xdevs
- 💼 LinkedIn: /company/10xdevs

---

### Backup Slide B7: Legacy Code Toolkit - Full Guide

**[DETAILED CONTENT - For Reference]**

## Legacy Code Toolkit - Complete Guide

**Problem z legacy:**
- Brak dokumentacji (stary team odszedł)
- Przestarzałe patterns (2015 style code)
- Złożone zależności (wszystko powiązane)
- Ryzyko regresji (zmiana X psuje Y)

**3-Step Process dla unknown codebase:**

```
┌──────────────────────────────────┐
│ STEP 1: Git Hot Spots (5 min)   │
├──────────────────────────────────┤
│ git log --since="1 year ago"     │
│         --name-only              │
│         --pretty=format: |       │
│   sort | uniq -c | sort -rn      │
│                                  │
│ Output: Most changed files       │
│ → These are important!           │
│                                  │
│ Why: Frequently changed =        │
│      - Active development        │
│      - Core functionality        │
│      - Good starting point       │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ STEP 2: AI Wdrażanie (20 min)  │
├──────────────────────────────────┤
│ Prompt:                          │
│ "Research how {feature} works    │
│                                  │
│  Context:                        │
│  @hot-spot-file-1.go             │
│  @hot-spot-file-2.go             │
│  @relevant-tests.go              │
│                                  │
│  Questions:                      │
│  - How does X work?              │
│  - What patterns are used?       │
│  - What are gotchas/constraints? │
│  - Related tests?                │
│                                  │
│  Output: .ai/wdrażanie-X.md"    │
│                                  │
│ AI reads, analyzes, documents    │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ STEP 3: Verification (15 min)   │
├──────────────────────────────────┤
│ □ grep -r "FunctionName" (exists?)│
│ □ Check imports (real packages?) │
│ □ git log (feature history)     │
│ □ Ask team if uncertain          │
│                                  │
│ ⚠️ CRITICAL:                     │
│ Testy regresji BEFORE refactor │
└──────────────────────────────────┘
```

**Step 1: Git Hot Spots (find important files)**

Command:
```bash
git log --since="1 year ago" \
        --name-only \
        --pretty=format: | \
  sort | \
  uniq -c | \
  sort -rn | \
  head -20
```

Output example:
```
    156 server/app/post.go
    142 server/api4/post.go
     89 server/store/sqlstore/post_store.go
     67 webapp/channels/src/components/post_view/
     ...
```

Interpretation:
- `post.go` changed 156 times in last year = very active
- These are core files = start here
- Team focuses on these = good reference

**Step 2: AI Wdrażanie (learn the codebase)**

Prompt template:
```
"Research how {feature} works in this legacy codebase

Context:
@{hot-spot-file-1}
@{hot-spot-file-2}
@{tests} (if exist)

Questions to answer:
1. How does {feature} currently work?
   - Entry points
   - Data flow
   - Dependencies

2. What patterns are used?
   - Architecture (MVC, layered, etc)
   - Naming conventions
   - Error handling patterns

3. What are gotchas/constraints?
   - Known bugs
   - Performance limitations
   - Deprecated approaches

4. Related tests?
   - Where are tests?
   - Coverage level
   - Test patterns

5. Recent changes?
   - Check git log
   - Related PRs
   - Breaking changes

Output format: .ai/wdrażanie-{feature}.md
Include:
- Summary
- Key files
- Patterns to follow
- Gotchas to avoid
- Related code"
```

AI generates comprehensive wdrażanie doc (15-20 min).

**Step 3: Verification (don't trust blindly!)**

**Verification Checklist:**

```
┌────────────────────────┬────────────────────────┬──────────────┐
│ ❓ PYTANIE            │ 🔍 WERYFIKACJA        │ ✅ TOOL     │
├────────────────────────┼────────────────────────┼──────────────┤
│ Funkcja istnieje?     │ grep -r "FuncName"     │ Terminal     │
│ Package istnieje?     │ Check go.mod/package.json│ File system│
│ Endpoint istnieje?    │ Check API docs/Swagger │ Docs         │
│ Pattern był używany?  │ git log --grep="X"     │ Git history  │
│ Test exists?          │ Find *_test.go         │ Grep         │
└────────────────────────┴────────────────────────┴──────────────┘
```

Commands:
```bash
# 1. Function exists?
grep -r "SearchPosts" .
→ Should find function definition

# 2. Package exists?
cat go.mod | grep "github.com/some/package"
cat package.json | grep "some-package"
→ Should be in dependencies

# 3. Pattern was used?
git log --grep="search" --oneline
→ See historical usage

# 4. Tests exist?
find . -name "*search*test.go"
→ Find related tests
```

**Golden Rule:**
> "ZAWSZE najpierw testy regresji, POTEM refactoring"

Why:
- Legacy code = no tests (often)
- Refactoring without tests = danger!
- First: Add tests for current behavior
- Then: Refactor safely (tests catch regressions)

**Example flow:**

```bash
# 1. Understand current behavior
"Research how search works"
→ AI documents current implementation

# 2. Add regression test (BEFORE changing!)
"Write E2E test for current search behavior

Context:
@tests/e2e/search.spec.ts (istniejące wzorce)

Requirements:
- Test CURRENT behavior (as-is)
- Cover happy path
- Cover main user flow
- Don't change implementation yet!

Output: tests/e2e/search-regression.spec.ts"

# AI generates test
# You run: npm run test:e2e
# Test should pass (validates current behavior)

# 3. NOW refactor safely
"Refactor search to use new pattern

Context:
@.ai/wdrażanie-search.md (research)
@new-pattern.ts (target pattern)

Requirements:
- Refactor to new pattern
- ENSURE @tests/e2e/search-regression.spec.ts still passes
- Don't break existing functionality

Output: Refactored code"

# AI refactors
# You run: npm run test:e2e
# Regression test should STILL pass ✅
```

**If regression test fails after refactoring:**
- Good! Test caught regression
- Fix refactoring
- Re-run until passes

**Verification best practices:**

1. **Always grep before trusting**
   ```bash
   AI: "Use function Foo from package Bar"
   You: grep -r "function Foo"
   You: grep -r "import.*Bar"
   → Verify both exist
   ```

2. **Check git history**
   ```bash
   git log --grep="feature X" --oneline
   git log -- path/to/file.go
   → See how feature evolved
   ```

3. **Ask team if uncertain**
   - 5 min question > 2h debugging
   - Team knows gotchas
   - "Hey, how does X work here?"

4. **Start small**
   - Don't refactor entire module at once
   - Start: 1 function refactor
   - Test: Regression test passes?
   - Expand: Next function
   - Build confidence gradually

**Red flags in legacy (be careful!):**

```
🚨 No tests → Add testy regresji FIRST
🚨 Global state → High risk, small steps
🚨 Complex dependencies → Map dependencies before changing
🚨 Deprecated patterns → May be deprecated for a reason (ask team)
```

**Pro tip: Document as you go**

```
.ai/legacy-gotchas.md:
- Function X has side effect Y (don't remove!)
- Module Z depends on global state (refactor carefully)
- Pattern P deprecated but can't change (used in 50 places)
```

---

### Backup Slide B8: PLAN PHASE - Templates & Examples

**[DETAILED CONTENT - For Reference]**

## PLAN PHASE - Complete Planning Guide

**Why planning?**
- Planning jest tańsze niż fixing code
- 30 min planning saves 4h debugging
- Catch architecture mistakes before implementation
- Align team before work starts

**4-Step Planning Workflow (Full Details):**

**Step 1: Create PRD (Product Requirements Document)**

Prompt template:
```
Based on @.ai/research-{feature}.md, create Product Requirements Document
for feature: "{feature description}"

Include:
1. User Stories
   - As a [role], I want [goal] so that [benefit]
   - Acceptance criteria for each

2. Functional Requirements
   - What the feature must do
   - User flows
   - UI/UX requirements

3. Non-Functional Requirements
   - Performance (<200ms response time)
   - Scalability (10k users)
   - Security (auth, data privacy)
   - Dostępność (WCAG AA)

4. Edge Cases to Handle
   - Empty inputs
   - Invalid data
   - Network failures
   - Rate limiting
   - Large datasets

5. Success Criteria (Definition of Done)
   - [Full DoD checklist from slide 7]

Output: .ai/prd-{feature}.md
```

Example (Mattermost):
```
"Based on @.ai/research-search.md, create PRD for:
'Add search functionality to flagged posts'

User: Should be able to search through their flagged posts
by keyword, filter results, and navigate to original post.

Include all sections above.

Output: .ai/prd-flagged-search.md"
```

AI generates comprehensive PRD in 2 min.

**Step 2: Create Technical Plan**

Prompt template:
```
Create technical implementation plan for @.ai/prd-{feature}.md

Context:
@.ai/research-{feature}.md (istniejące wzorce)
@.cursorrules (project conventions)
@{reference-file} (similar implementation)

Output (in .ai/tech-plan-{feature}.md):

1. Architecture Overview
   - Components to create/modify
   - Data flow diagram
   - Integration points

2. Implementation Steps (3-5 steps)
   - Step 1: Backend (endpoint + DB)
   - Step 2: Frontend (UI + state)
   - Step 3: Tests (unit + integration + E2E)
   Each step: ~20-30 min, 1 commit

3. Testing Strategy
   - Unit tests (what to test)
   - Integration tests (API contracts)
   - E2E tests (user flows)
   - Performance tests (if needed)

4. Security Considerations
   - Auth/permissions
   - Input validation
   - Rate limiting
   - Data privacy

5. Rollout Plan
   - Feature flag? (gradual rollout)
   - Monitoring (metrics to track)
   - Rollback strategy

6. Effort Estimate
   - Implementation: X hours
   - Testing: Y hours
   - Przegląd kodu: Z hours
   - Total: X+Y+Z hours
```

Example (Mattermost):
```
"Create technical plan for @.ai/prd-flagged-search.md

Context:
@.ai/research-search.md
@server/api4/post.go
@.cursorrules

Focus on:
- Reusing existing search infrastructure
- Following Mattermost API v4 patterns
- Security (user can only search own posts)

Output: .ai/tech-plan-flagged-search.md"
```

AI generates detailed tech plan in 3 min.

**Step 3: Review Plan (HITL checkpoint!)**

Review checklist:
```
Architecture:
□ Makes sense? (logical components)
□ Wykorzystuje ponownie istniejące? (not wymyślanie na nowo)
□ Scales well? (performance OK)
□ Maintainable? (not overly complex)

Security:
□ Auth considered? (who can access)
□ Input validation? (prevent injection)
□ Data privacy? (no leaking)
□ Rate limiting? (prevent abuse)

Edge Cases:
□ Null/empty handled?
□ Error scenarios covered?
□ Network failures considered?
□ Large data handled?

Completeness:
□ Aligned with DoD? (all checklist items)
□ Realistic estimate? (not too optimistic)
□ Testing strategy sound? (adequate coverage)
□ Dependencies identified? (blockers known)
```

If issues found:
- Iterate with AI: "The plan has issue X. How to fix?"
- AI updates plan
- Re-review
- Repeat until satisfied

Time investment: 5 min review might save 3h bad implementation
**ROI: 36x!**

**Step 4: Approve & Proceed**

Once plan reviewed and approved:
- Save plan to `.ai/tech-plan-{feature}.md`
- Share with team (if applicable)
- Get alignment
- Proceed to implementation

Benefits:
- Everyone knows "what" and "how"
- No surprises during implementation
- Easier przegląd kodu (reviewers see plan first)
- Faster approval (already aligned)

**Why planning saves time:**

```
Bez planu:                 Z planem:
─────────────────────────────────────────────
[■] impl                    [■■] research
[■■■] refactor (wrong)      [■] planning
[■■] fix bugs               [■■] impl (right first time)
[■] add missing tests       = 5 units time
= 7 units time
                            Savings: 28%
```

**Real example:**
- No plan: 30 min impl + 2h refactor + 1h bugs + 30 min tests = 4h total
- With plan: 10 min research + 5 min plan + 40 min impl = 55 min total
- **Savings: 3h 5min (5.5x faster!)**

**ACE Insight:**
Bad plan → hundreds of bad code lines
Bad research → thousands of bad code lines
Good research + plan → correct code first time

---

### Backup Slide B9: HITL Verification - Complete Checklists

**[DETAILED CONTENT - For Reference]**

## Full HITL Checkpoint Workflow with Detailed Checklists

**Checkpoint 1: Po Research (3-5 min)**

Checklist:
```
□ Files mentioned exist? (grep -r "FileName")
□ Functions exist? (check actual code)
□ Patterns current? (check git log, recent commits)
□ No hallucinations? (verify packages in package.json/go.mod)
□ Makes architectural sense? (aligns with your understanding)
```

Red flags:
- AI mentions file that doesn't exist
- AI references deprecated pattern
- AI suggests approach that breaks architecture

Action:
- Fix: Ask AI clarifying questions, re-research
- Approve: Move to planning

---

**Checkpoint 2: Po Planning (5 min)**

Checklist:
```
Architecture:
□ Makes sense? (components logical)
□ Wykorzystuje ponownie istniejące? (not wymyślanie na nowo)
□ Scales? (performance considerations)
□ Maintainable? (not overly complex)

Security:
□ Auth considered? (who can access)
□ Input validation? (prevent injection)
□ Data privacy? (no data leaks)

Completeness:
□ Aligned with DoD? (all items covered)
□ Realistic estimate? (not too optimistic)
□ Testing strategy? (adequate coverage)
```

Red flags:
- Plan misses security requirements
- Architecture too complex
- Estimate unrealistic (too fast)

Action:
- Fix: Iterate with AI, update plan
- Approve: Proceed to implementation

---

**Checkpoint 3: Co 3 kroki podczas implementation (5 min)**

Checklist:
```
Code Quality:
□ Works? (build passes, tests pass, console clean)
□ Safe? (no SQL injection, XSS, hardcoded secrets)
□ Readable? (clear names, SRP, reasonable complexity)
□ Tested? (happy path + 3 edge + errors)

Integration:
□ Uses istniejące wzorce? (podąża za konwencjami)
□ No breaking changes? (backward compatible)
```

Red flags:
- Tests fail
- Security issues
- Code too complex (cyclomatic > 15)

Action:
- Fix: Ask AI to fix issues, re-review
- Approve: git commit, move to next step

---

**Checkpoint 4: Przed commitem (5 min)**

**5-Minute Checklist:**
```
□ Works?    Build + tests pass + console clean
□ Safe?     No SQL injection, XSS, secrets
□ Readable? Clear names, SRP, no deep nesting
□ Tested?   Happy path + 3 przypadki brzegowe + errors
□ Docs?     JSDoc, README updated

✅ All checked → git commit
❌ Any fail → fix before commit
```

This is your final gate before commit. Don't skip!

---

**Checkpoint 5: Przed PR merge (team review)**

Human przegląd kodu required:
- Another developer reviews
- Checks logic, security, przypadki brzegowe
- Approves or requests changes

**NEVER:**
- Auto-merge AI-generated PRs
- Skip human review
- Merge without approval

---

**Guardrails dla autonomous agents:**

```markdown
Agent MOŻE:
✅ Generować kod (sandbox)
✅ Uruchamiać testy
✅ Iterować 3-5 razy
✅ Sugerować poprawki

Agent NIE MOŻE:
❌ Committować samodzielnie
❌ Merge PR bez approval
❌ Deploy do production
❌ Zmieniać security settings
❌ Usuwać database/data
```

These are red lines. Even "fully autonomous" AI agents should have these guardrails.

---

**Why HITL matters - Cost Analysis:**

```
Without HITL:                    With HITL:
──────────────────────────────────────────────
AI generates → commit            AI generates
                                      ↓ (review 5 min)
Bug found in production          Catch bug in review
Fix takes 2h                     Fix takes 5 min

Total cost: 2h                   Total cost: 10 min

HITL savings: 12x!
```

**Full Checkpoint Flow Diagram:**

```
┌──────────────────────────────────┐
│ 1. PO RESEARCH                   │
│    "Czy research ma sens?"       │
│    ├─ Files exist? ✓             │
│    ├─ Patterns current? ✓        │
│    └─ No hallucinations? ✓       │
│    Time: 3-5 min                  │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 2. PO PLANNING                   │
│    "Czy plan jest dobry?"        │
│    ├─ Architecture OK? ✓         │
│    ├─ Security considered? ✓     │
│    ├─ Effort realistic? ✓        │
│    └─ Aligned with DoD? ✓        │
│    Time: 5 min                    │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 3. CO 3 KROKI (during impl)      │
│    "Czy kod jest OK?"            │
│    ├─ Works? (tests pass) ✓      │
│    ├─ Safe? (no vulns) ✓         │
│    ├─ Readable? (clean) ✓        │
│    └─ Tested? (coverage) ✓       │
│    Time: 5 min per step           │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 4. PRZED COMMITEM                │
│    "5-min checklist"             │
│    └─ Full DoD przegląd✓          │
│    Time: 5 min                    │
└──────────────────────────────────┘
         ↓
┌──────────────────────────────────┐
│ 5. PRZED PR MERGE                │
│    "Team review"                 │
│    └─ Human approval required ✓  │
│    Time: 20-60 min (team review)  │
└──────────────────────────────────┘
```

---

### Backup Slide B10: Testing Strategy - Code Examples & Patterns

**[DETAILED CONTENT - For Reference]**

## Full Testing Workflow & Code Examples

**Anti-pattern (testy na końcu):**

```
[■■■] Write all code (1h)
      ↓
[■■] Write all tests (30 min)
      ↓
[■] Fix failing tests (15 min)
      ↓
Total: 1h 45min
```

Problems:
- Finding bugs late (harder to fix)
- Tests feel like "extra work"
- Often skipped due to time pressure

**Proper pattern (testy równolegle):**

```
[■] Write feature 1 + test (15 min)
     ↓ HITL ✓
[■] Write feature 2 + test (15 min)
     ↓ HITL ✓
[■] Write feature 3 + test (15 min)
     ↓ HITL ✓
Total: 45 min (no przeróbkę!)
```

Benefits:
- Catch bugs immediately (easier to fix)
- Tests guide implementation
- No "test debt"
- **Faster overall (no przeróbkę phase)**

---

**Testing pyramid dla AI:**

```
        ┌──────────────┐
        │     E2E      │  ← 1-2 critical flows
        │  (Playwright)│    AI generates from plan
        └──────────────┘    Example: Full search flow
             ↓
      ┌────────────────┐
      │  Integration   │  ← API contracts
      │  (API tests)   │    AI generates with endpoint
      └────────────────┘    Example: GET /search returns 200
            ↓
   ┌──────────────────────┐
   │   Unit Tests         │  ← Happy + 3 edge + errors
   │  (Jest/testify)      │    AI generates with function
   └──────────────────────┘    Example: searchPosts() tests
```

**Distribution:**
- Unit: ~80% of tests (fast, many)
- Integration: ~15% (medium speed, important contracts)
- E2E: ~5% (slow, critical flows only)

---

**Prompt template (AI generates tests WITH code):**

```
"Implement {function} with tests

Requirements:
- Happy path test (normal inputs)
- Przypadki brzegowe tests:
  1. {edge case 1} (e.g., null input)
  2. {edge case 2} (e.g., empty array)
  3. {edge case 3} (e.g., very large input)
- Error scenarios:
  1. {error 1} (e.g., network failure)
  2. {error 2} (e.g., validation error)
- Test coverage: 100% for new code

Output format:
1. Implementation ({file}.ts)
2. Unit tests ({file}.test.ts)
3. Integration test (if API endpoint)"
```

---

**EXAMPLE 1: Go Backend (Mattermost)**

```
Prompt:
"Implement searchFlaggedPosts function with tests

Context:
@server/store/sqlstore/post_store.go (istniejące wzorce)

Requirements:
- Happy path: valid query returns results
- Przypadki brzegowe:
  1. Empty query → return empty array
  2. Special characters (quotes, unicode) → sanitized
  3. Large page number → return empty
- Error scenarios:
  1. Database error → return error
  2. Invalid user ID → return error
- Coverage: 100%

Output:
1. server/store/sqlstore/post_store.go (implementation)
2. server/store/sqlstore/post_store_test.go (unit tests)
```

AI generates:
```go
// Implementation
func (s SqlPostStore) SearchFlaggedPosts(userId, query string, page int) ([]*model.Post, error) {
    // ... implementation
}

// Tests (generated simultaneously!)
func TestSearchFlaggedPosts(t *testing.T) {
    // Happy path
    t.Run("ValidQuery", func(t *testing.T) {
        results, err := store.SearchFlaggedPosts("user1", "test", 0)
        assert.NoError(t, err)
        assert.NotEmpty(t, results)
    })

    // Edge case 1
    t.Run("EmptyQuery", func(t *testing.T) {
        results, err := store.SearchFlaggedPosts("user1", "", 0)
        assert.NoError(t, err)
        assert.Empty(t, results)
    })

    // Edge case 2
    t.Run("SpecialCharacters", func(t *testing.T) {
        results, err := store.SearchFlaggedPosts("user1", "test\"'", 0)
        assert.NoError(t, err)  // Should not error (sanitized)
    })

    // Edge case 3
    t.Run("LargePage", func(t *testing.T) {
        results, err := store.SearchFlaggedPosts("user1", "test", 9999)
        assert.NoError(t, err)
        assert.Empty(t, results)
    })

    // Error scenario 1
    t.Run("DatabaseError", func(t *testing.T) {
        // Mock DB failure
        results, err := store.SearchFlaggedPosts("user1", "test", 0)
        assert.Error(t, err)
    })
}
```

**Benefits:**
- **100% coverage** (because generated together)
- **Consistent patterns** (same style as istniejące testy)
- **Fast implementation** (AI writes both at once)
- **No "test debt"** (tests already there)

---

**EXAMPLE 2: React Frontend (Component Testing)**

```
Prompt:
"Implement SearchBox component with tests

Requirements:
- Debouncing (300ms)
- Loading state
- Error state
- Component tests (RTL):
  - Renders correctly
  - Typing triggers search (debounced)
  - Shows loading during search
  - Shows error on failure

Output:
1. components/SearchBox/index.tsx
2. components/SearchBox/SearchBox.test.tsx"
```

AI generates component + comprehensive tests.

**File structure (generated together):**

```
components/SearchBox/
├── index.tsx                    # Implementation
└── SearchBox.test.tsx           # Tests (generated with component!)
```

---

**Key principle:**
> "Tests generated WITH code = 100% coverage, no debt, consistent patterns"

---

### Backup Slide B11: LIVE DEMO 2 - Detailed Script

**[DETAILED CONTENT - For Reference]**

## Full Live Demo Script with Prompts & Timing

**Setup:**
- To samo zadanie jak w Demo 1: "Add search to flagged posts in Mattermost"
- ALE tym razem: Research → Plan → Implement (ACE method)
- Tool: Cursor with Claude / GitHub Copilot
- Starting point: Clean git state

**Demo Structure:**

```
┌─────────────────────────────────────┐
│  [LIVE DEMO - 15 MINUT]            │
│                                     │
│  RESEARCH (5 min):                  │
│  1. Semantic search dla "search"    │
│  2. Find istniejące wzorce          │
│  3. @server/api4/post.go analysis   │
│  4. Ask AI to create research doc   │
│     Output: .ai/research-search.md  │
│  5. HITL: Przeglądresearch           │
│                                     │
│  PLAN (3 min):                      │
│  6. Ask AI to create tech plan      │
│     Context: @research + @cursorrules│
│     Output: .ai/tech-plan.md        │
│  7. HITL: Przeglądplan               │
│                                     │
│  IMPLEMENT (7 min):                 │
│  8. Step 1: Backend (3 min)         │
│     • AI generates code             │
│     • HITL przegląd→ commit          │
│  9. Step 2: Frontend (3 min)        │
│     • AI generates code             │
│     • HITL przegląd→ commit          │
│  10. Step 3: E2E (1 min)            │
│     • AI generates test             │
│     • HITL przegląd→ commit          │
│                                     │
│  RESULT:                            │
│  • 3 commits                        │
│  • 80% ponowne wykorzystanie kodu                   │
│  • Tests included                   │
│  • Follows Mattermost patterns      │
└─────────────────────────────────────┘
```

---

**RESEARCH PHASE (5 min):**

**[1 min] Setup:**
"Zacznijmy od research. Zamiast od razu pisać kod, najpierw zrozumiemy jak Mattermost implementuje search."

**[1 min] Semantic search:**
- Cursor: Cmd+Shift+K
- Query: "how does search work in Mattermost"
- Show results: server/api4/post.go, server/store/sqlstore/post_store.go
- "OK, widzę gdzie jest existing search"

**[2 min] Ask AI to research:**
Prompt w Cursor chat:
```
"Research how search works in Mattermost.

Find:
- Existing search implementations
- DB schema for posts and flags
- Auth patterns for user data
- Testing patterns

Context:
@server/api4/post.go
@server/store/sqlstore/post_store.go

Output: .ai/research-search.md"
```

AI generates research doc (show on screen).

**[1 min] HITL Review:**
- Open `.ai/research-search.md`
- Quick scan: "Does it make sense?"
- Verify: grep -r "SearchPosts" (exists? ✓)
- "Looks good, move to planning"

---

**PLAN PHASE (3 min):**

**[2 min] Ask AI to create plan:**
Prompt:
```
"Create technical plan for: 'Add search to flagged posts'

Context:
@.ai/research-search.md
@.cursorrules

Include:
- Architecture
- Implementation steps (3 steps)
- Testing strategy
- Security considerations

Output: .ai/tech-plan-flagged-search.md"
```

AI generates tech plan (show on screen).

**[1 min] HITL Review:**
- Open `.ai/tech-plan-flagged-search.md`
- Check: Architecture makes sense? ✓
- Check: Security considered? (auth, validation) ✓
- Check: 3 steps defined? ✓
- "Plan approved, let's implement!"

---

**IMPLEMENT PHASE (7 min):**

**[3 min] Step 1: Backend:**
Prompt:
```
"Implement Step 1 from @.ai/tech-plan-flagged-search.md

Context:
@server/api4/post.go (pattern)
@.cursorrules

Generate backend endpoint + tests"
```

AI generates code (show).

HITL checkpoint (30 sec):
- Quick review: Uses SqlStore? ✓ Auth? ✓
- Run: make test (passes? ✓)
- git commit -m "feat(backend): add flagged posts search endpoint"

**[3 min] Step 2: Frontend:**
Prompt:
```
"Implement Step 2 from @.ai/tech-plan-flagged-search.md

Context:
@webapp/channels/src/actions/post_actions.ts
@.cursorrules

Generate SearchBox component + Redux + tests"
```

AI generates code (show).

HITL checkpoint (30 sec):
- Quick review: Debouncing? ✓ Tests? ✓
- Run: npm test (passes? ✓)
- git commit -m "feat(frontend): add flagged posts search UI"

**[1 min] Step 3: E2E:**
Prompt:
```
"Implement Step 3 from @.ai/tech-plan-flagged-search.md

Generate E2E test + docs update"
```

AI generates (show quickly).

HITL checkpoint (20 sec):
- Run: npm run test:e2e (passes? ✓)
- git commit -m "test(e2e): add flagged posts search test"

---

**[30 sec] Summary:**
- git log --oneline (show 3 commits)
- "3 commits, each tested, each atomic"
- "Total time: 15 min"
- "Vibe code took 5 min + 3h przeróbkę = 3h 5min"
- "Savings: 2h 50min (12x faster!)"

**Po demo - pytanie do sali:**
> "Ile elementów DoD zostało zrealizowanych tym razem?"

Expected answer: ~90-100% (vs 30-40% w vibe code)

Compare:
- Vibe code (Demo 1): 30-40% DoD, 3h total
- ACE method (Demo 2): 90-100% DoD, 15 min total
- **Improvement: 12x faster, 3x better quality!**

---

**Key takeaways (point out):**
1. **Research prevented wymyślanie na nowo** - AI wykorzystało istniejący SqlStore pattern
2. **Plan caught security** - Auth check explicitly in plan
3. **3×3 workflow enabled fast iteration** - Each step tested immediately
4. **HITL checkpoints caught issues early** - Przeglądafter 15 min, not 2h
5. **Result: Production-ready code** - Not "działa", but "spełnia DoD"

---

**Troubleshooting / Fallback Plans:**

If live demo encounters issues:
1. **Network issues:** Walk through pre-created .ai/ docs from backup folder
2. **AI gives poor response:** Show expected output, explain what went wrong
3. **Tests fail:** Expected! Show how to iterate with AI to fix
4. **Time overrun:** Skip Step 3 (E2E), focus on Research + Plan + Step 1

---

### Backup Slide B12: Praktyczne Narzędzia - Context7 & MCP

**[DETAILED CONTENT - For Reference]**

## Praktyczne narzędzia - Symbole, Prompty, Komendy

Quick reference guide dla daily workflow.

**Symbole w Cursor / IDE:**

```
@file-name.ts           - Reference specific file
                           Example: @server/api4/post.go
                           Use: When you want AI to see this file

@folder/                - Reference folder context
                           Example: @server/api4/
                           Use: When you need multiple related files

#symbol-name            - Reference function/class
                           Example: #SearchPosts
                           Use: Jump to specific symbol

@web                    - Search web for latest info
                           Example: "@web latest React 18 features"
                           Use: When you need current docs

@docs library-name      - Fetch documentation (Context7 integration)
                           Example: @docs react
                           Use: Get authoritative framework docs
```

**Komendy (Cursor shortcuts):**

```bash
Cmd+K           - Inline edit with AI
                  Use: Quick edits to current selection
                  Example: Select function, Cmd+K, "add error handling"

Cmd+L           - Chat with codebase
                  Use: Ask questions about code
                  Example: "How does authentication work?"

Cmd+I           - Composer (multi-file edit)
                  Use: Changes across multiple files
                  Example: "Rename User to Account everywhere"

Cmd+Shift+P     - Command palette
                  Use: Access all commands

Cmd+Shift+K     - Semantic search
                  Use: Find code by concept, not exact match
                  Example: "authentication middleware"
```

**Example workflow:**

**1. Understanding codebase:**
```
Cmd+L → "How does search work in this codebase?"
(AI explores semantic search and answers)
```

**2. Planning implementation:**
```
Cmd+I → Composer
"@.ai/tech-plan.md implement step 1
Context: @server/api4/post.go"
(AI edits multiple files according to plan)
```

**3. Quick inline fix:**
```
Select problematic code
Cmd+K → "Add error handling for edge case: empty query"
(AI edits inline)
```

**Prompty (reusable templates):**

Location: `.prompts/`

```bash
.prompts/
├── backend/
│   └── api-endpoint.md
├── frontend/
│   └── component.md
└── testing/
    └── unit-test.md
```

**Usage:**
```bash
# In Cursor chat:
"Use @.prompts/backend/api-endpoint.md
 for GET /api/v4/posts/flagged/search"
```

**Template structure:**
```markdown
# {Task Name}

## Context (auto-load)
@.cursorrules
@reference-file.go

## Requirements
- [List requirements]

## Output
[Expected output format]
```

**Benefits:**
- Save 5-10 min per task (don't rewrite prompt)
- Consistency across team
- Wdrażanie (new devs see patterns)

**Advanced: Context7 integration**

If you have Context7 MCP setup:

```
# Instead of searching online docs manually:
"@docs react hooks best practices"

# Context7 fetches official docs directly
# AI gets authoritative, up-to-date information
```

**Pro tips:**

1. **Start minimal context:**
   - @.cursorrules + @target-file
   - Add more only if AI confused

2. **Use grep before @folder:**
   - grep -r "pattern" → find exact file
   - @exact-file.ts (not @folder/)

3. **Clear context when switching topics:**
   - New chat for new feature
   - Prevents dryfowanie kontekstu

4. **Keyboard > Mouse:**
   - Learn shortcuts (Cmd+K, Cmd+L, Cmd+I)
   - Faster workflow

---

### Backup Slide B13: MCP Deep Dive

**[DETAILED CONTENT - For Reference]**

## MCP & Tool Calling - Superpowers dla AI

**Co to jest MCP (Model Context Protocol)?**
- Protocol pozwalający AI używać external tools
- AI może wykonywać actions: search files, fetch docs, run commands
- "Hands and legs" dla AI - nie tylko generuje text, ale też działa

**Why MCP matters:**
- Traditional AI: Stateless, can only respond to your input
- AI with MCP: Can proactively gather context, fetch docs, verify files
- Result: Less manual work for you, more autonomous AI

**Dostępne MCP servers:**

**1. Context7 - Fresh documentation**
```typescript
// AI może sam fetch'ować docs!
const reactDocs = await mcp.context7.getDocs({
  library: '/facebook/react',
  topic: 'hooks',
  tokens: 5000
})
```

Example workflow:
```
You: "Implement React component using latest hooks"
AI (with Context7):
1. Fetches React 18 docs automatically
2. Reads hooks best practices
3. Generates component using current patterns
4. No hallucinations (uses official docs)
```

Without MCP:
- You paste docs manually
- AI might use outdated patterns (dane treningowe)
- Risk of hallucinations

**2. GitHub MCP - Repository operations**
```bash
# AI może używać gh CLI:
gh issue list --label "good first issue"
gh pr create --title "feat: search" --body "..."
gh pr checks --watch
```

Example workflow:
```
You: "Create PR for this feature"
AI (with GitHub MCP):
1. Checks git status
2. Creates branch if needed
3. Commits changes
4. Pushes to remote
5. Creates PR with description
6. Returns PR URL
```

Without MCP:
- You manually run each command
- More steps, more errors

**3. Filesystem MCP - Read/write files**
```bash
# AI może czytać pliki strukturalnie:
mcp.fs.readFile('.ai/research.md')
mcp.fs.writeFile('.ai/plan.md', planContent)
```

Example workflow:
```
You: "Research how search works and save findings"
AI (with Filesystem MCP):
1. Searches codebase
2. Analyzes patterns
3. Writes .ai/research.md automatically
4. Returns summary + file path
```

Without MCP:
- AI generates content
- You copy-paste to file manually

**4. Web Search MCP - Search for latest info**
```bash
# AI może szukać w necie:
mcp.search("Mattermost API v4 flagged posts")
```

Example workflow:
```
You: "How to implement feature X in Mattermost?"
AI (with Web Search MCP):
1. Searches Mattermost docs
2. Finds relevant guides
3. Fetches latest API docs
4. Synthesizes answer with links
```

Without MCP:
- You Google manually
- Paste findings to AI
- AI might still be outdated

**Example full workflow with MCP:**

```
You: "Research React 18 hooks best practices"

AI (autonomous with MCP):
1. Uses Context7 MCP → fetches React 18 official docs ✓
2. Uses Web Search MCP → finds latest blog posts (2024) ✓
3. Uses Filesystem MCP → saves research to .ai/react-hooks.md ✓
4. Responds with:
   "I've researched React 18 hooks. Key findings:
    - useTransition for concurrent rendering
    - useDeferredValue for non-urgent updates
    - Automatic batching in React 18

    Full research saved to .ai/react-hooks.md"
```

**Korzyść:**
> AI ma "ręce i nogi" - może sam zbierać kontekst zamiast czekać na Ciebie

Time savings:
- Without MCP: 10 min manual research (search, read, paste)
- With MCP: 2 min AI autonomous research
- **Savings: 8 min per research task (5x faster!)**

**Setup (optional, dla zainteresowanych):**
- Context7: context7.com/setup
- GitHub MCP: gh extension install mcp
- Dostępne dla: Claude Code CLI, some Cursor configs

W materiałach: MCP setup guide

---

### Backup Slide B14: Flowcharts & ASCII Diagrams

**[DETAILED CONTENT - For Reference]**

This section contains all ASCII diagrams extracted from main slides for reference.

---

#### **From Slajd 11: Why Vibe Code Fails - Analiza**

**VIBE CODE CYCLE:**

```
┌────────────────┐
│  Quick prompt  │  ← 30 sec, vague
└────────────────┘
       ↓
┌────────────────┐
│  Generic code  │──→ Doesn't fit architecture
└────────────────┘      Wymyśla koło na nowo
       ↓
┌────────────────┐
│  "Działa!"     │──→ Only podstawowy scenariusz tested
└────────────────┘      Przypadki brzegowe?Security?
       ↓
┌────────────────┐
│  Production    │──→ Bugs discovered by users
└────────────────┘      Security incidents
       ↓
┌────────────────┐
│  Przeróbka 2-3h   │──→ Fix + tests + refactor + review
└────────────────┘      Could've been avoided!
```

**Key problem:** Quick prompts → generic code → production issues → costly rework

---

#### **From Slajd 14: 3 Filary Context-Aware Agent**

**3-PILLAR ARCHITECTURE:**

```
         ┌─────────────────────────────┐
         │  CONTEXT-AWARE AGENT        │
         └─────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼───┐    ┌───▼────┐   ┌───▼─────┐
   │ Filar 1│    │ Filar 2│   │ Filar 3 │
   │Project │    │ Prompt │   │ Smart   │
   │Instruct│    │Library │   │ Context │
   └────────┘    └────────┘   └─────────┘
```

**Foundation:** Three pillars work together to provide comprehensive context

---

#### **From Slajd 19: RESEARCH PHASE - Uczenie AI o projekcie**

**4-STEP RESEARCH WORKFLOW:**

```
┌──────────────────────────────────┐
│ 1. EXPLORE CODEBASE              │
├──────────────────────────────────┤
│ • Semantic search (Cursor)        │
│ • Git gorące punkty analysis           │
│ • @-mentions istotne pliki       │
│ • Architecture documentation      │
│ Time: 2-3 min                     │
└──────────────────────────────────┘
          ↓
┌──────────────────────────────────┐
│ 2. ASK AI TO RESEARCH (podagent) │
├──────────────────────────────────┤
│ Prompt example:                   │
│ "Research how search works in     │
│  Mattermost. Find:                │
│  - Existing search implementations│
│  - DB schema for posts/flags      │
│  - Auth patterns for user data    │
│  - Testing patterns used          │
│                                   │
│  Output: .ai/research-search.md"  │
│ Time: 2 min                       │
└──────────────────────────────────┘
          ↓
┌──────────────────────────────────┐
│ 3. REVIEW RESEARCH (HITL) ⚡     │
├──────────────────────────────────┤
│ Human checks:                     │
│ • Check hallucinations (files exist?)│
│ • Verify file paths (grep)       │
│ • Confirm patterns current (git log)│
│ • Ask clarifying questions        │
│ Time: 3-5 min                     │
└──────────────────────────────────┘
          ↓
┌──────────────────────────────────┐
│ 4. CAPTURE KNOWLEDGE              │
├──────────────────────────────────┤
│ Save to: .ai/research-search.md   │
│ Content:                          │
│ - Key files identified            │
│ - Patterns to follow              │
│ - Constraints/gotchas             │
│ - Related tickets/PRs             │
│ Time: 2 min                       │
└──────────────────────────────────┘
```

**Total time:** 10-12 minutes for comprehensive research

---

#### **From Slajd 21: IMPLEMENT PHASE - Workflow 3×3**

**CIRCULAR FLOW 3×3:**

```
              ┌─────────────────────┐
              │  3 SMALL STEPS      │
              │  ─────────────      │
              │  • Step 1: Backend  │
              │  • Step 2: Frontend │
              │  • Step 3: E2E      │
              │  Time: 15 min each  │
              └─────────────────────┘
                        ↓
              ┌─────────────────────┐
              │  FEEDBACK (HITL) ⚡ │
              │  ─────────────      │
              │  • Przeglądcode      │
              │  • Run tests        │
              │  • Check DoD        │
              │  • Security check   │
              │  Time: 5 min        │
              └─────────────────────┘
                        ↓
              ┌─────────────────────┐
              │  COMMIT             │
              │  ─────────────      │
              │  git commit -m      │
              │  "feat: step N"     │
              │  Time: 1 min        │
              └─────────────────────┘
                        ↓
                   Next 3 steps...
```

**Pattern:** Implement → Review → Commit → Repeat (small cycles, frequent feedback)

---

#### **From Slajd 23: Before/After - Vibe vs ACE**

**SIDE-BY-SIDE COMPARISON:**

```
┌─────────────────────────┬─────────────────────────┐
│ VIBE CODE ⚠️           │ ACE METHOD ✅          │
├─────────────────────────┼─────────────────────────┤
│ Prompt (1 min):         │ Research (5 min):       │
│ "Add search"            │ • Explore codebase      │
│                         │ • Find patterns         │
│                         │ • Capture knowledge     │
├─────────────────────────┼─────────────────────────┤
│ Implementation (5 min): │ Planning (5 min):       │
│ • AI generates code     │ • Create PRD            │
│ • One big chunk         │ • Create tech plan      │
│                         │ • HITL przeglądplan      │
├─────────────────────────┼─────────────────────────┤
│ Testing (later...):     │ Implementation (25 min):│
│ ❌ No tests            │ • Step 1 + tests (10m)  │
│                         │ • Step 2 + tests (10m)  │
│                         │ • Step 3 + E2E (5m)     │
├─────────────────────────┼─────────────────────────┤
│ Przeróbka (2-3h):          │ Verification (5 min):   │
│ • Fix patterns          │ • 5-min checklist       │
│ • Add auth              │ • All DoD checked       │
│ • Add tests             │ ✅ Production ready    │
│ • Fix przypadki brzegowe        │                         │
│ • Add docs              │                         │
├─────────────────────────┼─────────────────────────┤
│ TOTAL: ~3h 5min         │ TOTAL: ~40 min          │
│ DoD coverage: 40%       │ DoD coverage: 100%      │
│ Ponowne wykorzystanie kodu: 20%         │ Ponowne wykorzystanie kodu: 80%         │
│ Commits: 1 (giant)      │ Commits: 3 (atomic)     │
│ Review: 😰 Painful     │ Review: 😊 Easy        │
└─────────────────────────┴─────────────────────────┘
```

**Cost breakdown:**

```
Vibe Code:
├─ Implementation: 5 min (cheap!)
├─ Przeróbka: 3h (expensive!)
│  ├─ Refactoring: 1h (wrong patterns)
│  ├─ Tests: 1h (add missing)
│  ├─ Security fixes: 30 min
│  └─ Przypadki brzegowe: 30 min
└─ Total: 3h 5min

ACE Method:
├─ Research: 10 min (investment)
├─ Planning: 5 min (investment)
├─ Implementation: 25 min (efficient, right first time)
└─ Total: 40 min

Savings: 2h 25min per feature (4.6x ROI)
```

**Bottom line:** ACE Method is 4.6x faster and 2.5x higher quality

---

## 🎯 KOŃCOWA NOTATKA DLA PROWADZĄCYCH

**Format warsztatu:** Live coding + dyskusja (show > tell)

**Timing guide:**
- Intro: 5 min
- DoD + task: 15 min
- Vibe Code + demo: 15 min
- Porównanie + dyskusja: 10 min
- Agent świadomy DoD: 15 min
- ACE Method + demo: 30 min
- Feedback loop: 10 min
- Best practices: 10 min
- Podsumowanie: 5 min
- Q&A: 20 min
**Total: 2h 15min** (15 min buffer)

**Materiały do przygotowania:**
- ✅ Mattermost repo lokalnie
- ✅ .cursorrules przykładowy
- ✅ Prompt library (5 templates)
- ✅ .ai/research-search.md (example)
- ✅ .ai/tech-plan-flagged.md (example)
- ✅ Cursor/Copilot skonfigurowany

**Demo 1 (slajd 9) - Vibe Code:**
- Cel: Pokazać ograniczenia one-shot
- Time: 5 min max

**Demo 2 (slajd 22) - ACE Method:**
- Cel: Pokazać research → plan → implement
- Time: 15 min max

**Backup slides:** Use only if questions arise

---

**FIN**
