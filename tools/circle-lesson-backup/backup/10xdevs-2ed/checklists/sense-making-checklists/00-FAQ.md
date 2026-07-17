# ❓ FAQ: Często zadawane pytania

**Najczęstsze pytania juniorów o pracę z AI**

> 💡 **Nie znalazłeś odpowiedzi?** Sprawdź [00-GLOSSARY.md](./00-GLOSSARY.md) albo konkretną checklistę.

---

## 🤖 Ogólne pytania o AI

### Czy używanie AI to "oszukiwanie"?
**Krótka odpowiedź:** NIE.

**Długa odpowiedź:**
- AI to narzędzie, jak Google, Stack Overflow, dokumentacja
- Nie ma nic złego w używaniu narzędzi które przyspieszają pracę
- **ALE:** Musisz rozumieć kod który commitniesz
- **ALE:** Musisz umieć zweryfikować czy AI nie halucynuje

**Analogia:**
Czy używanie kalkulatora to oszukiwanie matematyka? Nie - ale musisz wiedzieć JAKIE obliczenia robisz.

**Bottom line:**
Używaj AI, ale **nie przestawaj się uczyć** i **zawsze weryfikuj** co AI generuje.

---

### Czy AI zastąpi programistów?
**Krótka odpowiedź:** Nie w najbliższym czasie.

**Dlaczego:**
- AI nie rozumie business requirements (Ty musisz je zdefiniować)
- AI nie wie co jest ważne w Twoim projekcie (Ty musisz dać kontekst)
- AI popełnia błędy (Ty musisz je łapać)
- AI nie wie kiedy przestać (Ty musisz zarządzać procesem)

**Co się zmieni:**
- Programiści którzy **umieją używać AI** będą bardziej produktywni
- Programiści którzy **nie chcą się uczyć AI** mogą mieć trudniej

**Bottom line:**
AI to **współpracownik**, nie zastępca. Jak Excel - nie zastąpił księgowych, ale zmienił jak pracują.

---

### Które AI powinienem używać? ChatGPT, Claude, Copilot?
**Krótka odpowiedź:** Użyj tego do którego masz dostęp. Wszystkie są OK dla juniorów.

**Jeśli masz wybór:**
- **GitHub Copilot** - najlepszy do coding in-IDE (autocomplete, sugestie)
- **ChatGPT** - uniwersalny, darmowy tier, duża społeczność
- **Claude** - świetny do długich konwersacji i analysis
- **Cursor** - IDE z wbudowanym AI (łączy coding + chat)

**Dla juniorów:**
Zacznij od **jednego narzędzia** i opanuj je dobrze. Nie przeskakuj między tools.

**Bottom line:**
Umiejętność promptowania > wybór konkretnego AI. Dobry prompt działa w każdym AI.

---

### Jak często mogę używać AI w pracy?
**Krótka odpowiedź:** Zależy od polityki firmy - ZAPYTAJ!

**Co sprawdzić:**
- Czy firma ma AI usage policy?
- Czy możesz wklejać kod firmowy do AI? (data privacy!)
- Czy możesz używać AI do code review?
- Czy musisz oznaczać AI-generated code?

**Red flags:**
- 🚨 Wklejanie sensitive data (hasła, API keys, dane klientów) do AI
- 🚨 Wklejanie proprietary business logic bez zgody
- 🚨 Używanie AI jeśli firma zabrania

**Safe approach:**
1. Zapytaj tech leada / managera o policy
2. Jeśli brak policy - zaproponuj stworzenie guidelines
3. Używaj AI do public/generic code, nie sensitive data

---

## 💻 Pytania o promptowanie

### Ile czasu powinienem spędzać na pisaniu prompta?
**Krótka odpowiedź:** 1-3 minuty dla typowego taska.

**Rozbicie:**
- Simple task (refactor, fix typo): 30 sek - 1 min
- Medium task (add feature, write tests): 2-3 min
- Complex task (architecture, design): 5-10 min + iteracja

**Jeśli spędzasz dłużej:**
Możliwe że:
- Task jest za duży (podziel na mniejsze)
- Nie masz jasnych wymagań (najpierw zdefiniuj spec)
- Prompt jest za skomplikowany (uprość!)

**Pro tip:**
Lepiej napisać dobry prompt przez 2 min, niż zły prompt przez 30 sek i tracić 20 min na poprawki.

**Zobacz więcej:** `01-pierwszy-prompt.md`

---

### Co jeśli AI nie rozumie mojego prompta?
**Krótka odpowiedź:** Przepisz prompt używając wzoru 3C (Command + Context + Constraints).

**Debug checklist:**
- [ ] Czy mam jasne **Command** (polecenie od czasownika)?
- [ ] Czy podałem **Context** (tech stack, co działa, co nie)?
- [ ] Czy określiłem **Constraints** (ograniczenia, format wyjścia)?
- [ ] Czy prompt jest precyzyjny czy ogólnikowy?

**Przykład transformacji:**
```
❌ Przed: "Napraw ten komponent"
✅ Po: "Refactor the ProductCard component (src/components/ProductCard.tsx)
       to use React.memo and avoid re-renders when global filter changes.
       Keep existing props and Tailwind styles."
```

**Pro tip:**
Jeśli dalej nie działa - użyj **meta-promptingu**:
```
"Przeanalizuj poniższy prompt i przepisz go aby był precyzyjny i jednoznaczny:

[twój prompt]"
```

**Zobacz więcej:** `01-pierwszy-prompt.md`, `02-ai-nie-rozumie-wymagan.md`

---

### Czy powinienem używać polskiego czy angielskiego w promptach?
**Krótka odpowiedź:** **Angielski** jeśli możesz.

**Dlaczego:**
- AI są trenowane głównie na danych angielskich (lepsze rezultaty)
- Kod i dokumentacja są po angielsku
- Łatwiejsze przełączanie między konwersacją a kodem

**Ale:**
- Jeśli Twój angielski jest słaby - użyj polskiego
- Lepszy prompt po polsku niż zły prompt po angielsku
- Możesz mieszać: prompt po polsku, kod po angielsku

**Pro tip:**
Jeśli piszesz po polsku:
```
"[Twój prompt po polsku]

Note: Generate all code, comments, and variable names in English."
```

---

### Czy powinienem pokazywać AI cały plik czy tylko fragment?
**Krótka odpowiedź:** Tylko **relevant fragment** + kontekst.

**Dlaczego:**
- Context window limitation - AI ma limit ile może przeczytać
- Za dużo kodu = AI się gubi
- Za mało kontekstu = AI nie rozumie co robić

**Złota reguła:**
```
1. Fragment który chcesz zmienić (np. funkcja)
2. Related code (np. typy, interfaces które funkcja używa)
3. Opis co robi reszta pliku (słownie)
```

**Przykład:**
```
Command: Refactor calculateDiscount to handle edge cases

Context:
Tech stack: TypeScript 5, Node.js 20
File: src/utils/pricing.ts

[Wklej funkcję calculateDiscount: ~20 linii]

[Wklej interface Product: ~10 linii - używane przez funkcję]

This file also contains:
- calculateTax() - applies tax based on country
- formatPrice() - formats price with currency symbol

Constraints:
- Keep the same function signature
- Add JSDoc comments
- Handle negative prices (throw error)
- Handle 0 prices (return 0)
```

**Co NIE robić:**
❌ Wklejać 500 linii kodu naraz
❌ Wklejać kod bez opisu co robi
❌ Wklejać kod bez określenia co chcesz zmienić

---

## 🧪 Pytania o testowanie i jakość kodu

### Czy powinienem testować kod od AI?
**Krótka odpowiedź:** **TAK! Absolutnie!**

**Dlaczego:**
- AI może generować kod który "kompiluje się" ale nie działa poprawnie
- AI może nie obsługiwać edge cases
- AI może wprowadzić regressions (zepsuć coś co działało)

**Minimum testowania:**
```
1. Kod się kompiluje / nie ma syntax errors
2. Happy path działa (podstawowy scenariusz)
3. Edge cases działają (granice, null, zero, etc.)
4. Istniejące testy dalej przechodzą (brak regressions)
```

**Ideał:**
```
1-4 z powyższych +
5. Napisz nowe unit testy dla nowej funkcjonalności
6. Integration tests jeśli dotyka API/DB
7. Manual testing w UI
```

**Bottom line:**
**Ty jesteś odpowiedzialny** za kod który commitniesz, nie AI. Test everything!

**Zobacz więcej:** `04-czy-ten-kod-jest-ok.md`, `05-ai-zepsul-testy.md`

---

### AI zmienił kod i testy są czerwone. Co robić?
**Krótka odpowiedź:** Zobacz `05-ai-zepsul-testy.md` - tam jest full workflow.

**Quick decision tree:**
```
Testy czerwone?
│
├─ Czy zmieniłeś functionality? (refactor vs nowy feature)
│  ├─ TAK → Update tests (functionality changed)
│  └─ NIE → Fix code (regresja! kod broken)
│
└─ Czy test sprawdza implementation detail czy behavior?
   ├─ Implementation detail → OK to update test
   └─ Behavior → DON'T update, fix code!
```

**Bottom line:**
Nie ignoruj czerwonych testów! To są **red flags** że coś poszło nie tak.

---

### Jak sprawdzić czy kod od AI jest "dobry"?
**Krótka odpowiedź:** Użyj `templates/code-review-checklist.md`.

**5-minutowa checklist:**
```
✅ Kod się kompiluje
✅ Testy przechodzą
✅ Nazwy zmiennych są descriptive (nie: d, x, tmp)
✅ Brak oczywistych bugów (null checks, edge cases)
✅ No security issues (SQL injection, XSS)
```

**15-minutowa checklist (jeśli ważna feature):**
```
Wszystko z powyższego +
✅ Single Responsibility - funkcje robią jedną rzecz
✅ DRY - brak duplikacji kodu
✅ Error handling - obsługa błędów
✅ Comments - kod jest zrozumiały
✅ Performance - brak oczywistych bottlenecków
```

**Zobacz więcej:** `04-czy-ten-kod-jest-ok.md`

---

## 🔐 Pytania o security i privacy

### Czy mogę wklejać kod firmowy do ChatGPT?
**Krótka odpowiedź:** **ZAPYTAJ firmę o AI usage policy!**

**Domyślna safe odpowiedź:**
Zakładaj że **NIE**, dopóki firma nie powie że TAK.

**Co sprawdzić:**
- Czy firma ma written AI policy?
- Czy AI provider (OpenAI, Anthropic) trenuje na Twoich danych?
- Czy kod zawiera sensitive data? (API keys, business logic, dane klientów)

**Safe alternatives:**
- Użyj AI który gwarantuje data privacy (np. GitHub Copilot for Business)
- Wklej generic/pseudocode zamiast prawdziwego kodu
- Poproś AI o abstract solution bez pokazywania kodu

**Red flags (NIGDY nie wklejaj):**
- 🚨 Hasła, API keys, secrets
- 🚨 Dane klientów (emails, adresy, numery kart)
- 🚨 Proprietary business algorithms
- 🚨 Kod oznaczony jako "confidential"

---

### AI zasugerował użycie biblioteki którą znam. Czy mogę użyć?
**Krótka odpowiedź:** Sprawdź czy **biblioteka naprawdę istnieje** i czy jest **safe to use**.

**Checklist przed użyciem nowej biblioteki:**
```
1. Czy biblioteka istnieje? (npm search, pypi, etc.)
2. Czy jest aktywnie maintainowana? (ostatni commit, issues, releases)
3. Czy ma dużo pobrań / gwiazdek? (popularity = więcej oczu na security)
4. Czy ma znane security vulnerabilities? (npm audit, Snyk)
5. Czy license pozwala na użycie w Twoim projekcie? (MIT, Apache, etc.)
6. Czy rozmiar biblioteki jest reasonable? (nie 50MB dla prostej funkcji)
7. Czy firma pozwala na dodawanie dependencies? (sprawdź z team)
```

**Red flags:**
- 🚨 Biblioteka nie istnieje (AI hallucination!)
- 🚨 Ostatni commit 5 lat temu (abandoned)
- 🚨 Znane security issues (CVE warnings)
- 🚨 Suspicious nazwa (typosquatting: "requst" zamiast "request")

**Pro tip:**
Zanim dodasz dependency, zapytaj AI:
```
"Are there any known security issues or alternatives to [library-name]?"
```

---

## 📝 Pytania o git i commity

### Jak powinienem opisywać commity z kodem od AI?
**Krótka odpowiedź:** Opisuj **CO się zmieniło**, nie **KTO to zrobił**.

**Dobre commit messages:**
```
✅ "feat: add user authentication with JWT tokens"
✅ "refactor: simplify discount calculation logic"
✅ "fix: handle null values in product filter"
```

**Złe commit messages:**
```
❌ "AI generated this"
❌ "ChatGPT code"
❌ "fix stuff"
❌ "WIP" (Work In Progress - ale co progress?)
```

**Czy oznaczać że AI pomógł?**
To zależy od team policy. Opcje:
- A) Nie oznaczaj (kod jest Twój, AI tylko pomógł)
- B) Oznacz w extended commit message
  ```
  feat: add user authentication

  - Implement JWT token generation
  - Add login/logout endpoints
  - Add middleware for protected routes

  AI-assisted: Initial implementation with GitHub Copilot
  ```

**Bottom line:**
Ty jesteś **odpowiedzialny** za committowany kod. Opisz zmiany profesjonalnie.

**Zobacz więcej:** `06-jak-zapisac-prace.md`

---

### Czy powinienem commitować cały kod od AI naraz czy po kawałku?
**Krótka odpowiedź:** **Po kawałku!** (małe, logiczne commity)

**Dlaczego małe commity są lepsze:**
- ✅ Łatwiejszy code review
- ✅ Łatwiejszy rollback jeśli coś nie działa
- ✅ Łatwiejsze zrozumienie historii zmian
- ✅ Łatwiejszy cherry-pick do innych branchy

**Przykład rozbicia:**
```
AI wygenerował dużą feature (200 linii zmian w 5 plikach)

Zamiast 1 commit:
❌ "feat: add user dashboard"

Zrobić 4 commity:
✅ "feat: add UserDashboard component structure"
✅ "feat: add user stats API endpoint"
✅ "feat: integrate dashboard with API"
✅ "test: add tests for user dashboard"
```

**Jak dzielić commity:**
```bash
# Interactive staging - wybierz co commitować
git add -p

# Lub dodawaj po pliku
git add src/components/Dashboard.tsx
git commit -m "feat: add UserDashboard component"

git add src/api/stats.ts
git commit -m "feat: add user stats API endpoint"
```

**Zobacz więcej:** `06-jak-zapisac-prace.md`

---

## 🎯 Pytania o workflow i produktywność

### Ile czasu powinienem dać AI zanim przerywam i próbuję inaczej?
**Krótka odpowiedź:** **2-3 iteracje**, potem zmień podejście.

**Decision tree:**
```
Iteracja 1: AI zwrócił coś ale nie to co chciałeś
└─ Doprecyzuj prompt (dodaj context, constraints)

Iteracja 2: Dalej nie to
└─ Przepisz prompt od zera (użyj meta-promptingu)

Iteracja 3: Nadal nie działa
└─ STOP. Zmień podejście:
   - Podziel task na mniejsze części
   - Spróbuj innego AI (jeśli masz dostęp)
   - Zrób research (dokumentacja, Stack Overflow)
   - Zapytaj seniora z zespołu
```

**Red flags (STOP immediately):**
- 🚨 AI w kółko generuje ten sam kod
- 🚨 AI zaczyna halucynować (wymyśla biblioteki)
- 🚨 AI sugeruje "rozwiązania" które nie mają sensu
- 🚨 Spędziłeś 30+ min na promptowaniu tego samego taska

**Bottom line:**
AI to **narzędzie**, nie oracle. Jeśli nie działa - użyj innych metod.

---

### Czy powinienem używać AI do code review?
**Krótka odpowiedź:** **TAK**, ale to nie zastępuje human review.

**Jak używać AI do code review:**
```
Prompt:
"Review this code for:
- Bugs and edge cases
- Security issues (SQL injection, XSS)
- Performance bottlenecks
- Code style violations
- Best practices

[Wklej kod]"
```

**Co AI łapie dobrze:**
- ✅ Syntax errors
- ✅ Common security issues
- ✅ Performance anti-patterns
- ✅ Code style inconsistencies

**Czego AI może nie złapać:**
- ❌ Business logic errors (AI nie zna Twojego biznesu)
- ❌ Architecture issues (AI nie zna całości systemu)
- ❌ Team-specific conventions
- ❌ Subtle race conditions

**Bottom line:**
AI code review = first pass. Human review = final approval.

**Zobacz więcej:** `04-czy-ten-kod-jest-ok.md`, `templates/code-review-checklist.md`

---

### Jak długo powinienem uczyć się jednej checklisty?
**Krótka odpowiedź:** 30-45 min czytanie + 1-2 dni praktyka.

**Recommended flow:**
```
Dzień 1:
- Przeczytaj checklistę (30-45 min)
- Wypróbuj przykłady
- Skopiuj szablony do IDE

Dzień 2-3:
- Użyj w prawdziwej pracy
- Wracaj do checklisty gdy napotkasz problem
- Dostosuj szablony pod siebie

Koniec tygodnia:
- Quick review - czy pamiętasz kluczowe punkty?
- Przejdź do kolejnej checklisty
```

**Nie musisz pamiętać wszystkiego!**
Checklisty są po to aby **wracać do nich** gdy potrzebujesz. To reference, nie materiał do wykucia.

---

## 🆘 Pytania o naukę i rozwój

### Czy używanie AI spowalnia moje uczenie się?
**Krótka odpowiedź:** Zależy JAK używasz AI.

**Użycie AI które **pomaga** w nauce:**
- ✅ Pytasz AI o wyjaśnienie konceptów
- ✅ Prosisz AI o review Twojego kodu
- ✅ Używasz AI jako "rubber duck" do debug
- ✅ Pytasz AI "dlaczego to rozwiązanie jest lepsze?"

**Użycie AI które **szkodzi** nauce:**
- ❌ Slepo copy-paste bez czytania
- ❌ Nie próbujesz sam, od razu AI
- ❌ Nie weryfikujesz co AI generuje
- ❌ Używasz AI żeby "ominąć" naukę fundamentów

**Bottom line:**
AI jako **tutor**: ✅ pomaga
AI jako **zamiennik myślenia**: ❌ szkodzi

---

### Czego powinienem się uczyć jako junior, jeśli AI może pisać kod?
**Krótka odpowiedź:** Fundamenty + umiejętności których AI nie ma.

**Co uczyć się (AI tego nie zastąpi):**
- 🎯 **Problem solving** - rozumienie problemu biznesowego
- 🎯 **System design** - architektura aplikacji
- 🎯 **Debugging** - znajdowanie i naprawianie bugów
- 🎯 **Code review** - ocena jakości kodu
- 🎯 **Communication** - wyjaśnianie technical rzeczy non-technical ludziom
- 🎯 **Business domain knowledge** - rozumienie branży w której pracujesz

**Co uczyć się (AI pomaga ale nie zastępuje):**
- 📚 **Fundamenty języka** - TypeScript, JavaScript, etc.
- 📚 **Data structures & algorithms** - podstawy CS
- 📚 **Testing** - jak pisać dobre testy
- 📚 **Git workflow** - zarządzanie kodem
- 📚 **Security basics** - common vulnerabilities

**Czego można uczyć się "on demand":**
- 🔧 Specyficzna biblioteka (AI może pomóc)
- 🔧 Syntax nowego języka (AI może tłumaczyć)
- 🔧 Boilerplate code (AI może generować)

**Bottom line:**
Ucz się **myśleć jak developer**, nie tylko **pisać kod**. AI pisze kod, Ty definiujesz CO i DLACZEGO.

---

## 🚀 Następny krok

**Gotowy aby zacząć?**

**→ Przejdź do [01-pierwszy-prompt.md](./junior-track/01-pierwszy-prompt.md)** - naucz się pisać dobre prompty!

Lub:

**→ Wróć do [00-START-HERE.md](./00-START-HERE.md)** - zobacz pełną ścieżkę uczenia się

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Liczba pytań: 25+
- Target audience: Junior developers (0-2 lata doświadczenia)
