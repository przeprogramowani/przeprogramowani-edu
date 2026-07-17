# 📖 Glossary: Słowniczek terminów AI & Development

**Skrócona wersja dla juniorów** - tylko najważniejsze terminy które spotkasz w checklistach.

> 💡 **Tip:** Jeśli w checkliście spotkasz nieznany termin, wróć tutaj i sprawdź definicję.

---

## 🤖 Terminy związane z AI

### LLM (Large Language Model)
**Co to jest:**
Duży model językowy - AI który został wytrenowany na ogromnej ilości tekstu (kod, dokumentacja, książki, artykuły) i potrafi generować odpowiedzi na pytania, pisać kod, tłumaczyć, etc.

**Przykłady LLM:**
- GPT-4 (ChatGPT)
- Claude (Anthropic)
- Gemini (Google)
- Llama (Meta)

**Dlaczego Cię to obchodzi:**
GitHub Copilot, ChatGPT, Claude - wszystkie te narzędzia używają LLM-ów pod spodem.

---

### Prompt
**Co to jest:**
Instrukcja/pytanie które wysyłasz do AI. To jak "zapytanie" albo "polecenie".

**Przykłady:**
- ❌ Słaby prompt: "fix this"
- ✅ Dobry prompt: "Refactor the `calculateDiscount` function to use pattern matching instead of if-else chains"

**Dlaczego Cię to obchodzi:**
Jakość prompta = jakość odpowiedzi od AI. Lepszy prompt = lepszy kod.

**Zobacz więcej:** `01-pierwszy-prompt.md`

---

### Promptowanie / Prompting
**Co to jest:**
Proces pisania promptów do AI. "Umiejętność promptowania" = umiejętność pisania dobrych instrukcji dla AI.

**Analogia:**
Jak mówienie do juniora w zespole - musisz być precyzyjny, dać kontekst, pokazać przykłady.

---

### Hallucination (Halucynacja)
**Co to jest:**
Gdy AI "wymyśla" rzeczy które brzmią prawdopodobnie, ale są fałszywe.

**Przykłady hallucination:**
- AI wymyśla nieistniejącą bibliotekę: `import { magic } from 'super-helper-lib'`
- AI twierdzi że funkcja robi X, ale naprawdę robi Y
- AI "cytuje" dokumentację której nie ma

**Dlaczego to się dzieje:**
LLM działa na prawdopodobieństwie ("co brzmi prawdopodobnie?"), nie na faktach.

**Co robić:**
Zawsze weryfikuj! Szczególnie:
- Nazwy bibliotek (sprawdź czy istnieją na npm/PyPI)
- API methods (sprawdź dokumentację)
- Business logic (zapytaj domain expert)

**Zobacz więcej:** `03-gdy-ai-gada-glupoty.md`

---

### Context Window (Okno kontekstu)
**Co to jest:**
Limit ile tekstu AI może "pamiętać" w jednej konwersacji.

**Analogia:**
Jak pamięć krótkotrwała - możesz pamiętać max X rzeczy naraz. Gdy dodasz kolejną, najstarsza wypada.

**W praktyce:**
- Krótka konwersacja: AI pamięta wszystko
- Długa konwersacja: AI "zapomina" początek
- Za dużo kodu w jednym promptcie: AI się gubi

**Co robić:**
- Pisz zwięzłe prompty
- Dziel duże zadania na mniejsze sesje
- Podsumowuj kluczowe ustalenia przed przejściem dalej

**Przykład:**
```
❌ Źle: Wklejanie 500 linii kodu naraz
✅ Dobrze: Wklejanie 50-100 linii + opisanie co robi reszta
```

---

### In-Context Learning
**Co to jest:**
Technika polegająca na tym że "uczysz" AI w ramach prompta - dajesz mu informacje, przykłady, kontekst.

**Przykład:**
```
Command: "Refactor this function to use async/await"
Context: "We use TypeScript 5.0, Node.js 20, and ESLint strict mode"
        "Our code style: prefer const over let, use descriptive names"
Example: [pokazujesz jak wygląda inny refactor w projekcie]

[Twój kod do refactor]
```

**Dlaczego to działa:**
LLM nie zna Twojego projektu - musisz mu pokazać "jak u nas się robi".

---

### Token
**Co to jest:**
Jednostka tekstu dla AI. Mniej więcej:
- 1 token ≈ 0.75 słowa (w języku angielskim)
- 1 token ≈ 4 znaki
- 100 tokenów ≈ 75 słów

**Dlaczego Cię to obchodzi:**
- Context window jest mierzony w tokenach (np. "128k tokens")
- Płacisz za tokeny (input + output) w płatnych API
- Możesz przekroczyć limit i dostać błąd

**W praktyce:**
Nie musisz liczyć tokenów ręcznie - po prostu pisz zwięźle.

---

## 💻 Terminy związane z code quality

### Code Review
**Co to jest:**
Proces przeglądania kodu przez inną osobę (lub siebie!) przed zmergowaniem do głównego brancha.

**Dlaczego to ważne:**
- Łapiesz bugi przed produkcją
- Uczysz się od innych
- Utrzymujesz jakość kodu w zespole

**W kontekście AI:**
**ZAWSZE rób code review kodu od AI!** AI to nie senior developer - może popełniać błędy.

**Zobacz więcej:** `04-czy-ten-kod-jest-ok.md`, `templates/code-review-checklist.md`

---

### Refactoring
**Co to jest:**
Zmiana struktury kodu **bez zmiany jego zachowania**. Cel: lepszy, czystszy, łatwiejszy do utrzymania kod.

**Przykłady:**
- Zmiana nazwy zmiennej: `d` → `daysUntilExpiry`
- Wyciągnięcie duplikacji do funkcji
- Uproszczenie skomplikowanego if-else

**Złota zasada:**
```
1. Testy są zielone ✅
2. Refactor
3. Testy DALEJ są zielone ✅
```

**Jeśli testy czerwone po refactor:**
Albo: zepsułeś funkcjonalność (źle!) lub testy są outdated (trzeba update).

**Zobacz więcej:** `05-ai-zepsul-testy.md`

---

### Edge Case
**Co to jest:**
Sytuacja która rzadko się zdarza, ale może spowodować błędy.

**Przykłady:**
```typescript
// Happy path
calculateDiscount(100, 0.1) // → 90 ✅

// Edge cases
calculateDiscount(0, 0.1)     // → ? (co z zerem?)
calculateDiscount(100, 1.5)   // → ? (150% discount?!)
calculateDiscount(-10, 0.1)   // → ? (ujemna cena?)
calculateDiscount(100, 0)     // → ? (zero discount)
```

**Dlaczego Cię to obchodzi:**
AI często generuje kod który działa dla "happy path", ale nie obsługuje edge cases.

**Co robić:**
Zawsze pytaj AI: "Obsługuje to edge cases?" i testuj te scenariusze.

---

### Tech Debt (Dług technologiczny)
**Co to jest:**
Shortcuts w kodzie które "działają teraz", ale spowodują problemy później.

**Analogia:**
Jak kredyt - możesz wziąć teraz, ale będziesz spłacać z odsetkami (czas na fixing bugs, refactoring).

**Przykłady tech debt:**
- Brak testów ("zadziałało więc ok")
- Copy-paste kod zamiast funkcji
- Komentarz `// TODO: fix this properly later`
- Ignorowanie warningów

**W kontekście AI:**
AI może generować "working but messy" kod. Twoja odpowiedzialność: posprzątać zanim commitniesz.

---

### Regression (Regresja)
**Co to jest:**
Bug który pojawia się po zmianach w kodzie. Coś co **wcześniej działało, teraz nie działa**.

**Przykład:**
```
1. Funkcja login() działa ✅
2. AI refaktoruje auth system
3. Login nie działa ❌ ← to jest regresja
```

**Jak zapobiegać:**
- Pisz testy automatyczne
- Testuj ręcznie przed commitem
- Code review
- Regression tests (testy które sprawdzają że stare featury działają)

**Zobacz więcej:** `05-ai-zepsul-testy.md`

---

## 🛠️ Terminy związane z workflow

### Git / Version Control
**Co to jest:**
System do śledzenia zmian w kodzie. Jak "save points" w grze - możesz wrócić do wcześniejszej wersji.

**Podstawowe komendy:**
```bash
git add .              # Dodaj zmiany do staging
git commit -m "msg"    # Zapisz zmiany (save point)
git push               # Wyślij na serwer (GitHub, GitLab)
git status             # Zobacz co się zmieniło
```

**Dlaczego Cię to obchodzi:**
Musisz wiedzieć jak commitować kod od AI.

**Zobacz więcej:** `06-jak-zapisac-prace.md`

---

### Commit
**Co to jest:**
"Save point" w git - snapshot Twojego kodu w danym momencie.

**Dobry commit:**
```
feat: add user authentication with JWT tokens

- Implement login/logout endpoints
- Add JWT token generation and validation
- Add middleware for protected routes
- Add tests for auth flow
```

**Zły commit:**
```
fix stuff
```

**Zobacz więcej:** `06-jak-zapisac-prace.md`

---

### Staging / Staging Area
**Co to jest:**
"Poczekania" dla zmian przed commitem. Wybierasz CO chcesz commitnąć.

**Workflow:**
```
1. Zmieniasz pliki (working directory)
2. Wybierasz co commitować (git add) → staging area
3. Commitniesz (git commit)
```

**Dlaczego to ważne:**
AI może zmienić 10 plików, ale Ty chcesz commitnąć tylko 3. Staging pozwala Ci wybrać.

---

### Pull Request (PR) / Merge Request (MR)
**Co to jest:**
Prośba o zmergowanie Twojego kodu do głównego brancha. Zespół robi code review przed zaakceptowaniem.

**Workflow:**
```
1. Tworzysz feature branch
2. Piszesz kod
3. Push do brancha
4. Otwierasz PR
5. Code review (komentarze, sugestie)
6. Poprawki
7. Approve & merge
```

---

### CI/CD (Continuous Integration / Continuous Deployment)
**Co to jest:**
Automatyzacja testowania i deploymentu. Gdy pushniesz kod:
- CI: Automatyczne uruchamianie testów
- CD: Automatyczny deployment do produkcji (jeśli testy przechodzą)

**Przykład:**
```
1. Push code to GitHub
2. GitHub Actions uruchamia testy
3. Jeśli testy ✅ → deploy do produkcji
4. Jeśli testy ❌ → blokuje merge
```

**Dlaczego Cię to obchodzi:**
Twój kod musi przejść przez CI przed mergowaniem. Jeśli AI zepsuł testy - CI Cię zatrzyma.

---

## 📝 Terminy związane z testowaniem

### Unit Test (Test jednostkowy)
**Co to jest:**
Test małego kawałka kodu (funkcja, klasa, komponent) **w izolacji**.

**Przykład:**
```typescript
// Code
function add(a: number, b: number): number {
  return a + b;
}

// Unit test
describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});
```

**Dlaczego to ważne:**
Unit testy łapią bugi wcześnie i dokumentują jak funkcja powinna działać.

---

### Integration Test (Test integracyjny)
**Co to jest:**
Test który sprawdza czy **wiele części** systemu działa razem.

**Przykład:**
```typescript
// Test integracji: API endpoint + database + auth
it('should create user and return JWT token', async () => {
  const response = await api.post('/auth/register', {
    email: 'test@example.com',
    password: 'secret123'
  });

  expect(response.status).toBe(201);
  expect(response.body.token).toBeDefined();

  // Check database
  const user = await db.users.findOne({ email: 'test@example.com' });
  expect(user).toBeDefined();
});
```

---

### E2E Test (End-to-End)
**Co to jest:**
Test całego przepływu aplikacji **z perspektywy użytkownika**.

**Przykład:**
```typescript
// Playwright E2E test
test('user can login', async ({ page }) => {
  await page.goto('https://app.com/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'secret123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('https://app.com/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

---

### Test Coverage (Pokrycie testami)
**Co to jest:**
Procent kodu który jest testowany.

**Przykład:**
```
Total coverage:
  Lines: 85%
  Functions: 90%
  Branches: 75%
```

**Czy 100% coverage jest celem?**
Nie koniecznie - lepiej 80% dobrych testów niż 100% słabych. Ale 0% to red flag.

---

## 🔒 Terminy związane z security

### SQL Injection
**Co to jest:**
Atak gdzie hacker wstrzykuje SQL kod przez input użytkownika.

**Przykład vulnerable code:**
```typescript
// ❌ VULNERABLE!
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
db.execute(query);

// Hacker input: "' OR '1'='1"
// Resulting query: SELECT * FROM users WHERE email = '' OR '1'='1'
// → Zwraca wszystkich użytkowników!
```

**Jak zapobiegać:**
```typescript
// ✅ SAFE - use prepared statements
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [userInput]);
```

**Dlaczego Cię to obchodzi:**
AI może generować vulnerable code. Musisz sprawdzić!

---

### XSS (Cross-Site Scripting)
**Co to jest:**
Atak gdzie hacker wstrzykuje JavaScript przez input użytkownika.

**Przykład vulnerable code:**
```typescript
// ❌ VULNERABLE!
const userComment = getUserInput();
div.innerHTML = userComment;

// Hacker input: "<script>alert('hacked')</script>"
// → Script się wykona!
```

**Jak zapobiegać:**
```typescript
// ✅ SAFE - escape HTML
div.textContent = userComment; // or use sanitizer library
```

---

## 🎨 Terminy związane z code style

### Single Responsibility Principle (SRP)
**Co to jest:**
Jedna funkcja/klasa powinna robić **jedną rzecz**.

**Przykład:**
```typescript
// ❌ Źle - funkcja robi 3 rzeczy
function processUser(email: string) {
  // 1. Validate
  if (!email.includes('@')) throw new Error('Invalid');
  // 2. Save to DB
  db.users.create({ email });
  // 3. Send welcome email
  sendEmail(email, 'Welcome!');
}

// ✅ Dobrze - każda funkcja robi jedno
function validateEmail(email: string): boolean {
  return email.includes('@');
}

function createUser(email: string): User {
  return db.users.create({ email });
}

function sendWelcomeEmail(email: string): void {
  sendEmail(email, 'Welcome!');
}

function processUser(email: string) {
  if (!validateEmail(email)) throw new Error('Invalid');
  const user = createUser(email);
  sendWelcomeEmail(email);
}
```

**Dlaczego to ważne:**
Łatwiejsze testowanie, debugowanie, reużycie kodu.

---

### DRY (Don't Repeat Yourself)
**Co to jest:**
Nie duplikuj kodu - wyciągnij do funkcji/zmiennej.

**Przykład:**
```typescript
// ❌ Źle - duplikacja
const discountedPrice1 = price1 * 0.9;
const discountedPrice2 = price2 * 0.9;
const discountedPrice3 = price3 * 0.9;

// ✅ Dobrze - funkcja
function applyDiscount(price: number): number {
  return price * 0.9;
}

const discountedPrice1 = applyDiscount(price1);
const discountedPrice2 = applyDiscount(price2);
const discountedPrice3 = applyDiscount(price3);
```

---

## 🧠 Terminy związane z AI-assisted development

### Human-in-the-Loop (HITL)
**Co to jest:**
Filozofia że AI **nie działa samodzielnie** - człowiek jest zawsze w procesie (weryfikuje, podejmuje decyzje).

**Przykład workflow:**
```
1. Ty: Definiujesz wymagania
2. AI: Generuje kod
3. Ty: Code review i weryfikacja
4. AI: Poprawki (jeśli trzeba)
5. Ty: Finalne zatwierdzenie i commit
```

**Dlaczego to ważne:**
AI może popełniać błędy. Ty jesteś odpowiedzialny za jakość kodu w produkcji.

---

### Spec-Driven Development
**Co to jest:**
Podejście gdzie **najpierw definiujesz wymagania** (spec), potem piszesz kod.

**Przeciwieństwo:** "Vibe coding" - pisanie bez planu, "zobaczymy co wyjdzie".

**Przykład spec:**
```markdown
## Feature: User discount calculation

Requirements:
- Calculate 10% discount for orders > $100
- Calculate 20% discount for orders > $500
- No discount for orders < $100
- Edge cases:
  - Handle $0 orders
  - Handle negative prices (throw error)
  - Handle exactly $100 (10% discount)
```

**Dlaczego to ważne w AI:**
Jasne wymagania = lepsze prompty = lepszy kod od AI.

---

### Vibe Coding
**Co to jest:**
Generowanie kodu bez głębszego zrozumienia, poleganie na "magii AI" i nadzieja że zadziała.

**Red flags vibe coding:**
- "AI mi to wygenerował więc pewnie ok"
- Copy-paste kodu bez czytania
- Brak testowania edge cases
- "Działa więc commituję"

**Dlaczego to źle:**
Prowadzi do bugów, regressions, tech debt, security issues.

---

## 📚 Następny krok

Teraz gdy znasz podstawowe terminy:

**→ Przejdź do [00-FAQ.md](./00-FAQ.md)** - zobacz często zadawane pytania

Lub:

**→ Przejdź do [01-pierwszy-prompt.md](./junior-track/01-pierwszy-prompt.md)** - zacznij naukę!

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Liczba terminów: 35+
- Target audience: Junior developers (0-2 lata doświadczenia)
