# Przewodnik: Efektywna praca z AI dla programistów

> Wersja: 1.0 | Ostatnia aktualizacja: 2025-11 | Bazuje na: 10xDevs 2. edycja (moduły 0x-1x)

## 📋 Spis treści

1. [Filozofia i podstawy](#filozofia-i-podstawy)
2. [Wybór modelu i narzędzi](#wybór-modelu-i-narzędzi)
3. [Efektywne promptowanie](#efektywne-promptowanie)
4. [Praca w IDE](#praca-w-ide)
5. [Praca w terminalu (CLI)](#praca-w-terminalu-cli)
6. [Agenci asynchroniczni](#agenci-asynchroniczni)
7. [Cechy dobrego projektu](#cechy-dobrego-projektu)
8. [Best Practices & Anti-Patterns](#best-practices--anti-patterns)
9. [Quick Reference Checklist](#quick-reference-checklist)

---

## Filozofia i podstawy

### Spec-Driven vs Vibe Coding

**Vibe Coding** to generowanie kodu bez głębszego zrozumienia, poleganie na magii AI i nadzieja, że zadziała. To podejście prowadzi do:
- Chaotycznego kopiowania kodu bez weryfikacji
- Braku kontroli nad tym, co ląduje w produkcji
- Trudności w debugowaniu i utrzymaniu kodu
- Częstych regresji i błędów

**Spec-Driven Development** to podejście, w którym:
- Każda interakcja z AI ma jasno określony cel
- Wyniki są weryfikowane przed zatwierdzeniem
- Modele wspierają z góry zdefiniowane wymagania
- Programista zachowuje pełną kontrolę nad procesem

**Cel:** Przejście od chaotycznego używania AI do systematycznego wykorzystywania go jako narzędzia innowacji.

### Fundamentalne ograniczenia LLM-ów

Zrozumienie ograniczeń modeli językowych jest kluczowe dla efektywnej pracy:

#### 1. Statyczne trenowanie
- Modele są trenowane na zamkniętych zbiorach danych
- Nie uczą się po zakończeniu treningu
- **Rozwiązanie:** In-context learning - dostarczaj aktualny kontekst w każdej konwersacji

#### 2. Statystyka, nie logika
- Odpowiedzi oparte na prawdopodobieństwie statystycznym, nie logicznym wnioskowaniu
- Ryzyko halucynacji - model generuje prawdopodobnie brzmiące, ale nieprawdziwe informacje
- Ograniczona innowacyjność - powielanie wzorców z danych treningowych
- **Rozwiązanie:** Zawsze weryfikuj krytyczne decyzje, szczególnie w domenie biznesowej

#### 3. Ograniczone okno kontekstu
- Modele mają limity tokenów przetwarzanych w jednej konwersacji
- Rzeczywista użyteczna pojemność to często 25-50% reklamowanego limitu
- Długie konwersacje prowadzą do "zapominania" wcześniejszego kontekstu
- **Rozwiązanie:**
  - Używaj zwięzłych promptów
  - Dziel duże zadania na mniejsze sesje
  - Podsumowuj kluczowe ustalenia przed przejściem dalej

### Filozofia Human-in-the-Loop (HITL)

**Kluczowe zasady:**

1. **AI nie pisze kodu produkcyjnego samodzielnie**
   - Każdy fragment kodu wymaga ludzkiej weryfikacji
   - Code review AI-generowanego kodu jest obowiązkowy

2. **Programista pozostaje niezbędny na każdym etapie**
   - Definiowanie wymagań
   - Weryfikacja poprawności rozwiązania
   - Testowanie edge case'ów
   - Ocena jakości i maintainability

3. **Efektywne zarządzanie autonomicznymi narzędziami**
   - Ustaw jasne guardrails (limity, obszary działania)
   - Monitoruj działanie agentów
   - Zatrzymuj nieproduktywne iteracje

4. **Pełna odpowiedzialność za committowany kod**
   - Nawet jeśli kod wygenerował AI, ty go zatwierdzasz
   - Zrozum co robi kod przed zmergowaniem
   - W razie problemów, ty odpowiadasz przed zespołem

---

## Wybór modelu i narzędzi

### Strategia wyboru modelu (Q4 2025)

Do efektywnej pracy potrzebujesz **dwóch typów modeli**:

#### 1. Model Asystent (Koder)
**Przeznaczenie:** Codzienne zadania programistyczne wymagające szybkiej odpowiedzi

**Cechy:**
- Wyspecjalizowany w domenie programowania
- Szybki czas odpowiedzi (1-5 sekund)
- Dobra znajomość popularnych frameworków i bibliotek
- Efektywny w generowaniu kodu, testów, dokumentacji

**Rekomendowane modele:**
- **Claude Sonnet 4.5** - doskonała równowaga jakości i szybkości
- **GPT-5-Codex** - jeśli niedostępny, użyj GPT-5
- **Gemini 2.5 Pro** - dobra alternatywa
- **Wariant ekonomiczny:** grok-code-fast-1 lub Claude Haiku 4.5

**Typowe zastosowania:**
- Generowanie komponentów UI
- Pisanie testów jednostkowych
- Refactoring istniejącego kodu
- Dokumentacja kodu
- Debugging prostych błędów

#### 2. Model Rozumujący (Architekt)
**Przeznaczenie:** Złożone zadania wymagające głębokiej analizy i planowania

**Cechy:**
- Zdolność do wieloetapowego rozumowania
- Analiza wymagań i konsekwencji
- Planowanie architektury
- Wolniejszy, ale dokładniejszy (może działać 30-120 sekund)
- Wyższe koszty zapytań

**Rekomendowane modele:**
- **GPT-5-Codex / GPT-5** (Medium / High Reasoning Effort)
- **Gemini 2.5 Pro**
- **Wariant ekonomiczny:** grok-4-fast

**Typowe zastosowania:**
- Projektowanie architektury systemu
- Analiza złożonych problemów
- Optymalizacja wydajności
- Security review
- Migracje i modernizacje legacy code

### Strategia kosztowa

#### Flat Rate (Abonament z limitami)
**Charakterystyka:**
- Stała miesięczna opłata
- Limity zapytań lub sesji
- Przewidywalne koszty

**Przykłady:**
- GitHub Copilot (~$10-20/mies.)
- Windsurf Professional

**Kiedy wybrać:**
- Intensywne codzienne użycie
- Potrzebujesz przewidywalnych kosztów
- Pracujesz w firmie z budżetem na narzędzia

#### Usage-Based (Płatność za tokeny)
**Charakterystyka:**
- Płacisz za faktyczne użycie (tokeny wejściowe + wyjściowe)
- Koszty mogą być zmienne
- Większa elastyczność

**Przykłady:**
- Cursor (credits system)
- Bezpośredni dostęp API (OpenAI, Anthropic, Google)

**Kiedy wybrać:**
- Nieregularne użycie
- Chcesz płacić tylko za to, czego używasz
- Potrzebujesz dostępu do najnowszych modeli

**Uwaga o kosztach i języku:**
Polski język używa ~50-67% więcej tokenów niż angielski, co bezpośrednio przekłada się na wyższe koszty w modelach usage-based.

### Wybór języka: Polski vs Angielski

#### Używaj **polskiego** gdy:
- ✅ Myślisz precyzyjniej w języku polskim
- ✅ Opisujesz złożoną domenę biznesową ze specjalistycznym słownictwem
- ✅ Pracujesz z długim kontekstem (badania OneRuler pokazują lepsze wyniki dla polskiego w long-context tasks)
- ✅ Koszt tokenów nie jest głównym problemem (flat rate)

#### Używaj **angielskiego** gdy:
- ✅ Chcesz zoptymalizować koszty tokenów (30-50% oszczędności)
- ✅ Pracujesz z międzynarodowym kodem/dokumentacją
- ✅ Szukasz przykładów kodu z popularnych bibliotek (więcej anglojęzycznych przykładów w danych treningowych)
- ✅ Współpracujesz z międzynarodowym zespołem

**Złota zasada:** Używaj języka, w którym **myślisz najbardziej precyzyjnie**, ale miej świadomość konsekwencji kosztowych.

### Monitorowanie modeli

**Nie polegaj ślepo na benchmarkach:**
- Syntetyczne benchmarki mogą być "zagrane" przez producentów
- Nie odzwierciedlają rzeczywistego użycia
- Scoring models na benchmarkach ≠ przydatność w codziennej pracy

**Lepsze źródła informacji:**
- **OpenRouter Rankings** - ranking oparty na rzeczywistym użyciu community
- **LM Arena** - ślepe porównania modeli przez użytkowników
- **Własne doświadczenie** - testuj modele na typowych dla siebie zadaniach

**Pamiętaj:** Praktyka znaczy więcej niż wyniki benchmarków. Model z niższym wynikiem może być lepszy dla Twojego konkretnego use case.

### Wybór narzędzia (Q4 2025)

#### IDE-Based Solutions

**Cursor**
- ✅ **Dla użytkowników VS Code**
- ✅ Doskonała integracja z edytorem
- ✅ Composer mode dla multi-file edits
- ✅ Elastyczny system kredytów (usage-based)
- ⚠️ Wymaga adaptacji od "czystego" VS Code

**Windsurf**
- ✅ **Dla użytkowników szukających prostoty**
- ✅ Cascade mode - świetny do dużych refaktorów
- ✅ Flat rate pricing (przewidywalne koszty)
- ⚠️ Młodsze narzędzie, mniej plugins

**Cline/Junie**
- ✅ **Dla użytkowników JetBrains IDE**
- ✅ Native integration z IntelliJ, WebStorm, PyCharm
- ⚠️ Mniej dojrzałe niż Cursor

#### CLI-Based Solutions

**Claude Code**
- ✅ Duże repozytoria
- ✅ Enterprise features (MCP, hooks)
- ✅ Szerokie okno kontekstu
- ✅ Doskonały do onboardingu i eksploracji codebase

**Codex CLI (OpenAI)**
- ✅ Integracja z ekosystemem OpenAI
- ✅ Najnowsze modele GPT-5
- ✅ Dobry do szybkich iteracji

**Gemini CLI**
- ✅ Zadania multimodalne
- ✅ Integracja z Google Cloud
- ✅ Bardzo długie okno kontekstu

**OpenCode**
- ✅ No vendor lock-in
- ✅ On-prem / offline support
- ✅ Open source

**aider**
- ✅ Precyzyjne, kontrolowane zmiany
- ✅ Czytelne diffy przed apply
- ✅ Dobry do surgical refactorings

---

## Efektywne promptowanie

### Anatomia prompta: 5 elementów (w kolejności ważności)

#### 1. **Command (Polecenie)** - NAJWAŻNIEJSZE
Jasna instrukcja rozpoczynająca się od czasownika. To najbardziej krytyczny element.

**Dobre przykłady:**
```
✅ "Zrefaktoruj funkcję calculateDiscount aby używała pattern matching"
✅ "Wygeneruj testy jednostkowe dla UserService"
✅ "Zdiagnozuj dlaczego query wykonuje się dłużej niż 500ms"
```

**Złe przykłady:**
```
❌ "calculateDiscount" - brak polecenia
❌ "Coś jest nie tak z dyskontem" - niejasne
❌ "Pomyśl o testach" - zbyt ogólne
```

#### 2. **Context (Kontekst)**
Informacje o sytuacji, tech stacku, plikach, domenie biznesowej.

**Co zawrzeć:**
- Aktualny stan (co działa, co nie)
- Tech stack i wersje
- Referencje do plików (@File, @Folder)
- Historia zmian (git log, poprzednie próby)
- Ograniczenia (wydajność, kompatybilność)
- Domena biznesowa (e-commerce, fintech, edtech)

**Przykład:**
```
Stack: React 19, TypeScript 5.2, TanStack Query, Supabase
File: @src/components/ProductList.tsx
Problem: Komponent re-renderuje się przy każdej zmianie filtra
Constraint: Musimy wspierać IE11
Business: Sklep e-commerce z 10k produktami
```

#### 3. **Format (Struktura wyjścia)**
Określ jak ma wyglądać rezultat.

**Przykłady:**
```
Format: JSON z polami {name, type, required}
Format: Markdown tabela z kolumnami: Feature | Pros | Cons | Cost
Format: TypeScript interface z JSDoc komentarzami
Format: Step-by-step plan numerowany 1-10
Format: Mermaid diagram sekwencji
```

#### 4. **Role (Rola)**
Zawężenie domeny ekspercji. Mniej ważne niż kiedyś, ale łatwe do dodania.

**Kiedy użyteczne:**
- Specjalistyczne domeny (security, performance, accessibility)
- Perspektywa biznesowa vs techniczna
- Code review z konkretnym naciskiem

**Przykłady:**
```
"Jako security engineer, zidentyfikuj potencjalne podatności"
"Z perspektywy tech leada, oceń maintainability tego rozwiązania"
"Jako specjalista od accessibility, zaproponuj usprawnienia"
```

#### 5. **Examples (Przykłady)**
Najmniej użyteczne dla typowych zadań deweloperskich. Przydatne głównie do:
- Automatyzacji i integracji (parsowanie specyficznych formatów)
- Nieliniowych transformacji danych
- Generowania w nietypowym stylu

**Kiedy pominąć:**
- Standardowe zadania programistyczne
- Gdy format jest jasny z kontekstu
- Gdy model zna konwencje (React component, REST API)

### Meta-Promptowanie

**Koncepcja:** Użyj AI do poprawy swoich własnych promptów.

**Kiedy stosować:**
- Prompt nie dał oczekiwanych rezultatów
- Chcesz nauczyć się lepszego promptowania
- Przygotowujesz template do reużycia

**Szablon meta-promptu:**
```
Przeanalizuj i przepisz poniższy prompt, aby był:
1. Precyzyjny i jednoznaczny
2. Zawierał wszystkie potrzebne konteksty
3. Był w pełni zrozumiały bez domyślania się intencji

Oryginalny prompt:
"""
[twój prompt]
"""

Najpierw wyjaśnij co jest niejasne, potem podaj ulepszoną wersję.
```

**Przykład transformacji:**
```
❌ Przed: "Napraw ten komponent"
✅ Po: "Zrefaktoruj komponent ProductCard (@src/components/ProductCard.tsx)
       aby używał React.memo i unikał re-renderów przy zmianie globalnego
       filtra. Zachowaj istniejące propsy i style Tailwind."
```

### Metoda sokratejska (Socratic Method)

**Koncepcja:** Odwróć role - pozwól AI zadawać TOBIE pytania przed rozpoczęciem pracy.

**Magiczna fraza:**
```
"Przed rozpoczęciem zadania, zadaj mi 5-10 pytań, aby lepiej zrozumieć:
- Kontekst techniczny
- Moje cele
- Co mogłem pominąć lub zapomnieć
- Potencjalne założenia do weryfikacji"
```

**Korzyści:**
- Odkrywa "unknown unknowns" - rzeczy, o których zapomniałeś pomyśleć
- Weryfikuje założenia zanim zainwestujesz czas
- Buduje wspólne zrozumienie problemu
- Często ujawnia prostsze rozwiązania

**Przykładowa wymiana:**
```
Ty: "Dodaj dark mode do aplikacji. [magiczna fraza]"

AI: "Przed rozpoczęciem mam kilka pytań:
1. Czy macie już jakąś infrastrukturę do theme management?
2. Jak ma działać przełącznik - w settings czy w topbar?
3. Czy dark mode ma być zapisywany w localStorage czy preferencjach usera?
4. Czy wszystkie komponenty muszą wspierać dark mode czy tylko główne?
5. Czy macie design system colors czy mam zaproponować paletę?
6. Czy planujecie system theme oprócz dark/light?"

[Te pytania mogą ujawnić, że masz już partial implementation
lub że potrzebujesz więcej niż dark/light toggle]
```

### Brainstorming i eksploracja

**Zamiast pytać "jak to zrobić", zapytaj "na ile sposobów można to zrobić".**

**Szablon eksploracyjny:**
```
"W ilu różnych sposób można [zadanie]?

Dla każdego podejścia podaj:
- Krótki opis
- Główne zalety
- Główne wady
- Szacunkowy effort (S/M/L)
- Kiedy to zastosować

Następnie rekomenduj 1-2 najlepsze dla mojego kontekstu: [kontekst]"
```

**Przykład:**
```
Zadanie: "Zaimplementować real-time notifications w aplikacji"

AI może przedstawić:
1. WebSockets (Socket.io) - Full duplex, najlepszy UX, wymaga infrastruktury
2. Server-Sent Events - Prostsza implementacja, jednokierunkowy
3. Polling - Najprostszy, większy load na server
4. Push API (PWA) - Działa w tle, wymaga service worker
5. Third-party service (Pusher, Ably) - Szybki start, koszty zewnętrzne

Możesz odkryć rozwiązania, o których nie pomyślałeś!
```

### Wiele perspektyw (Multiple Perspectives)

**Koncepcja:** Symuluj perspektywy różnych ról w zespole.

**Szablon:**
```
"Przeanalizuj to rozwiązanie z perspektywy:
- Architekta (skalowalność, maintainability)
- Testera (edge cases, test coverage)
- Security engineera (podatności, attack vectors)
- Product managera (time to market, business value)
- DevOpsa (deployment, monitoring, rollback)

Dla każdej perspektywy podaj 2-3 kluczowe uwagi."
```

**Korzyści:**
- Holistyczna ocena rozwiązania
- Wczesne wykrycie problemów
- Lepsza komunikacja z zespołem (znasz ich argumenty)
- Redukcja ryzyka w review

### Techniki anty-confirmation bias

Ludzie naturalnie preferują potwierdzenie swoich przekonań. AI może to zmienić.

#### 1. Devil's Advocate (Adwokat diabła)
```
"Wciel się w rolę sceptycznego architekta. Znajdź wszystkie słabości
w tym podejściu: [twoje podejście].

Bądź bezlitosny - chcę poznać prawdziwe ryzyka, nie komplementy."
```

#### 2. Compare Alternatives (Porównanie alternatyw)
```
"Przedstaw 3 najlepsze alternatywne podejścia do [problem]
wraz z tabelą porównawczą:

Feature | Approach A | Approach B | Approach C
Complexity | ... | ... | ...
Performance | ... | ... | ...
Scalability | ... | ... | ...
Cost | ... | ... | ...
Time to implement | ... | ... | ...
```

#### 3. Pre-Mortem
```
"Jesteśmy w przyszłości. To rozwiązanie zawiodło katastrofalnie.
Wyjaśnij krok po kroku, dlaczego i jak to się stało.

Rozwiązanie: [twoje rozwiązanie]"
```

#### 4. Unknown Unknowns
```
"Co może być 'unknown unknowns' w tym podejściu?
Jakie założenia robię nieświadomie?
Co może pójść nie tak, o czym nie pomyślałem?"
```

### Planowanie zadań

**Złota zasada:** NIGDY nie skacz od razu do implementacji.

**Zawsze najpierw stwórz plan:**

**Szablon planowania:**
```
"Stwórz szczegółowy plan implementacji dla: [zadanie]

Plan powinien zawierać:
1. Analiza wymagań (co dokładnie robimy)
2. Architektura (jak to się wpasuje w istniejący system)
3. Lista zadań (concrete actionable steps)
4. Strategia testowania (unit, integration, e2e)
5. Edge cases i error handling
6. Rollout strategy (jak deploy, jak rollback)

Poczekam na plan przed rozpoczęciem kodu."
```

**Korzyści:**
- ⏰ Planowanie jest tańsze niż fixing code
- 🎯 Wykryjesz problemy przed inwestycją czasu
- 📋 Masz checklist do śledzenia postępu
- 🔄 Łatwiej wrócić po przerwie
- 👥 Możesz zreview'ować plan z zespołem

**W Claude Code:** Użyj Plan Mode (automatyczne)
**W innych narzędziach:** Explicite poproś o plan przed implementacją

### Ratowanie nieudanych konwersacji

**Kiedy zresetować konwersację:**
- Po 3 nieudanych próbach naprawy tego samego problemu
- Gdy AI zaczyna halucynować lub zapętla się
- Gdy kontekst stał się zbyt skomplikowany
- Gdy realizujesz, że podejście było złe od początku

**Procedura soft reset:**

1. **Poproś o comprehensive summary:**
```
"Zanim zakończymy tę konwersację, stwórz comprehensive summary zawierający:

1. Co działa poprawnie (zrobione i zweryfikowane)
2. Gdzie nasze podejście zawiodło (co nie działa i dlaczego)
3. Co się nauczyliśmy (insights, wnioski)
4. Zaktualizowany kontekst (obecny stan kodu/systemu)
5. Najlepsze next steps (co spróbować teraz)

To będzie input do nowej konwersacji."
```

2. **Rozpocznij nową konwersację z summary jako kontekstem**
3. **Dostarcz improved prompt** (użyj meta-promptingu jeśli trzeba)

**Korzyści:**
- Zachowujesz valuable insights
- Unikasz context pollution
- Świeże spojrzenie AI na problem
- Czasami samo podsumowanie ujawni rozwiązanie

### Szablon nauki nowych konceptów

Gdy chcesz się czegoś nauczyć, użyj strukturyzowanego szablonu:

```
Jesteś doświadczonym {{Role}} - pomóż mi zrozumieć nowy temat.

**Mój poziom wiedzy:**
{{advanced}} w {{JavaScript, React, TypeScript}}.

**Moje doświadczenie:**
{{6 lat}} doświadczenia z {{React, Redux, Node.js, PostgreSQL}}.

**Cel nauki:**
Zrozumieć {{GitHub Actions}} aby {{zbudować pierwszy CI/CD pipeline}}.

**Obecny blocker:**
{{Nie rozumiem różnicy między job a workflow}}.

**Jak chcę się uczyć:**
Wyjaśnij krok po kroku od {{podstaw}} do {{praktycznego zastosowania}}.
Uczę się najlepiej przez {{wizualizacje i praktyczne schematy}}.
Preferuję {{krótkie instrukcje z przykładami}}.

**Poproś o clarifications jeśli czegoś nie rozumiesz w moim kontekście.**
```

**Dlaczego to działa:**
- Explicit level calibration - AI dostosuje complexity
- Konkretny cel uczenia się
- Wskazany blocker - fokus na tym co boli
- Preferowany styl nauki
- Wykorzystanie istniejącej wiedzy (analogie)

---

## Praca w IDE

### Essential Setup (Cursor/Windsurf/Cline)

#### 1. Privacy Mode - Ochrona wrażliwych danych

**Dlaczego to ważne:**
- Domyślnie IDE AI może wysyłać kod do zewnętrznych serwerów
- Ryzyko wycieku sekretów, kluczy API, danych biznesowych
- Potencjalne naruszenie NDA lub GDPR

**Co skonfigurować:**

**Cursor:**
```
Settings → Privacy:
☑ Enable Privacy Mode (blokuje wysyłanie kodu do serwerów Cursor)
☑ Disable Telemetry
```

**Pliki ignorujące:**
Stwórz `.cursorignore` w root projektu:
```
.env*
.secrets/
credentials/
*.key
*.pem
config/production.yml
db/seeds/
```

**Windsurf/Cline:**
Analogiczne ustawienia + `.aiignore` lub `.clineignore`

**Uwaga:** Privacy mode może ograniczać features (np. code indexing w chmurze). Zbalansuj potrzeby vs security.

#### 2. Keyboard Shortcuts - Efektywność

Naucz się na pamięć (przykład dla Cursor):

| Shortcut | Funkcja | Kiedy używać |
|----------|---------|--------------|
| `Cmd/Ctrl + L` | Open Chat | Ogólne pytania, planning |
| `Cmd/Ctrl + K` | Inline Edit | Quick edits w konkretnej linii |
| `Cmd/Ctrl + I` | Composer/Agent | Multi-file refactoring |
| `Cmd/Ctrl + Shift + L` | Chat with selection | Pytania o zaznaczony kod |

**Ćwicz przez tydzień** - shortcuts drastycznie przyspieszają workflow.

#### 3. Context Symbols - Precyzyjne wskazywanie kontekstu

**Podstawowe symbole:**

| Symbol | Znaczenie | Przykład użycia |
|--------|-----------|-----------------|
| `@File` | Konkretny plik | `@src/api/users.ts` |
| `@Folder` | Cały folder | `@src/components/` |
| `@Git` | Git context | `@Git ostatnie 3 commity` |
| `@Docs` | Dokumentacja | `@Docs React useEffect` |
| `@Web` | Wyszukiwanie web | `@Web latest Next.js 15 routing` |
| `@Code` | Code search | `@Code getUserProfile` |
| `@Codebase` | Całe repo | `@Codebase jak działa auth?` |

**Best Practices:**
- ✅ Bądź specific: `@src/utils/validation.ts` lepsze niż `@Codebase`
- ✅ Używaj Git dla kontekstu zmian: `@Git diff HEAD~5..HEAD`
- ✅ @Docs dla frameworków: szybsze niż manual search
- ⚠️ Unikaj @Codebase dla dużych repo - zjada context window

**Przykład dobrej kombinacji:**
```
Zrefaktoruj auth logic aby używała nowego token validation.

Context:
@src/auth/token.ts (obecna implementacja)
@src/types/Auth.ts (typy)
@Git ostatnie zmiany w auth/ (żeby zrozumieć kierunek zmian)
@Docs JWT best practices (świeża wiedza o security)
```

#### 4. Project Instructions - Naucz AI jak pracować w Twoim projekcie

**Cursor:**
- `.cursorrules` w root projektu
- `.cursor/rules/*.md` dla per-domain rules

**Windsurf:**
- `.windsurfrules`

**Co zawrzeć:**
```markdown
# Project: MyApp - E-commerce Platform

## Tech Stack
- React 19, TypeScript 5.2
- TanStack Query (dawniej React Query) - DO NOT suggest Redux
- Supabase (auth + db)
- Tailwind CSS (NO styled-components)

## Architecture Rules
- Components w src/components/, jeden komponent = jeden plik
- Custom hooks w src/hooks/, prefix use*
- API calls TYLKO przez TanStack Query w src/api/
- Typy zawsze explicit, NO type any (strict mode)

## Styling Conventions
- Tailwind utility-first
- Dark mode przez class strategy (NOT media query)
- Responsive: mobile-first, breakpoints: sm: 640px, md: 768px, lg: 1024px

## Testing Requirements
- Vitest dla unit
- Playwright dla E2E
- ZAWSZE generuj testy wraz z kodem
- Coverage minimum 80%

## DO NOT
- ❌ Nie używaj class components (tylko functional)
- ❌ Nie proponuj Redux (mamy TanStack Query + Zustand)
- ❌ Nie dodawaj dependencies bez pytania
- ❌ Nie commit bez testów

## Preferred Patterns
✅ Server components gdzie możliwe (Next.js App Router)
✅ Atomic design (atoms → molecules → organisms)
✅ Container/Presenter pattern dla complex logic

## Code Style
- ESLint + Prettier (konfiguracja w repo)
- Single quotes dla strings
- 2 spaces indent
- Max line length: 100
```

**Efekt:**
- AI generuje kod zgodny z Twoimi conventions od razu
- Mniej czasu na code review i fixing
- Spójny styl w całym projekcie

#### 5. Reusable Prompts - Biblioteka często używanych promptów

**Custom Commands (Cursor):**
`File → Preferences → Custom Commands`

**Przykładowe commands:**

```json
{
  "commands": [
    {
      "name": "Generate Tests",
      "prompt": "Generate comprehensive unit tests using Vitest for selected code. Include: happy path, edge cases, error scenarios. Mock external dependencies. Follow AAA pattern (Arrange, Act, Assert)."
    },
    {
      "name": "Add JSDoc",
      "prompt": "Add comprehensive JSDoc documentation to selected function/class. Include: @param, @returns, @throws, @example. Be specific about types even in TypeScript."
    },
    {
      "name": "Security Review",
      "prompt": "Review selected code for security vulnerabilities. Check for: SQL injection, XSS, CSRF, auth bypass, sensitive data exposure, dependency vulnerabilities. Provide specific fixes."
    },
    {
      "name": "Performance Audit",
      "prompt": "Analyze selected code for performance issues. Check: unnecessary re-renders, N+1 queries, memory leaks, blocking operations, bundle size. Suggest optimizations with trade-offs."
    },
    {
      "name": "Explain Code",
      "prompt": "Explain selected code in simple terms. Include: what it does, why this approach, potential gotchas, how to extend/modify safely."
    }
  ]
}
```

**Prompt Files (dla CLI):**
Folder `.prompts/` z reusable templates:

```
.prompts/
  generate-crud.md
  add-tests.md
  refactor-component.md
  security-review.md
```

### Zarządzanie kontekstem

**Kontekst to wszystko co AI "widzi" przy generowaniu odpowiedzi:**

**Źródła kontekstu:**
1. **Files & Folders** - kod, który referencje przez @
2. **Git History** - commity, branches, diffs
3. **Web Content** - dokumentacja, Stack Overflow
4. **User Instructions** - project rules, custom prompts
5. **Conversation History** - poprzednie wiadomości w sesji

**Best Practices:**

✅ **Minimalizuj zbędny kontekst**
```
❌ Źle: @src/ (cały folder, może być 100 plików)
✅ Dobrze: @src/components/Button.tsx @src/types/Button.ts (2 relevantne)
```

✅ **Odświeżaj kontekst przy zmianie tematu**
```
Po zrobieniu feature A i przejściu do feature B:
"Poprzedni kontekst już nieważny. Nowy kontekst: [...]"
```

✅ **Używaj Git kontekstu dla zmian**
```
"Jak się zmieniła auth od ostatniego release?"
@Git diff v2.0..HEAD -- src/auth/
```

✅ **Dokumentacja > Web search**
```
✅ @Docs Next.js server actions
❌ @Web "next.js server actions tutorial" (może być outdated)
```

⚠️ **Limituj @Codebase dla dużych projektów**
- @Codebase może zjeść 50-80% twojego context window
- Użyj tylko dla high-level questions: "Jak działa auth flow?"
- Dla specific questions użyj specific files

### Prompty z XML tagami

**Dlaczego XML?**
- Jasna struktura (AI lepiej parsuje)
- Separation of concerns
- Łatwe do templateowania
-Czytelne dla ludzi i AI

**Szablon XML prompta:**

```xml
<task>
  Zaimplementuj endpoint do tworzenia nowego użytkownika
</task>

<context>
  <stack>
    <backend>Node.js 20, Express 4, TypeScript 5.2</backend>
    <database>PostgreSQL 15, Prisma ORM</database>
    <auth>JWT tokens, bcrypt dla haseł</auth>
  </stack>

  <files>
    @src/routes/users.ts (istniejące endpointy)
    @src/models/User.ts (model)
    @src/middleware/auth.ts (auth middleware)
    @prisma/schema.prisma (schema)
  </files>

  <constraints>
    - API musi być RESTful
    - Rate limiting: 5 requests/minute per IP
    - Walidacja email i strong password
    - GDPR compliant (opt-in newsletter)
  </constraints>
</context>

<requirements>
  <functional>
    - POST /api/users endpoint
    - Walidacja: email (format), password (min 8 znaków, 1 cyfra, 1 special)
    - Hash password przed zapisem (bcrypt, 12 rounds)
    - Sprawdź czy email już istnieje (409 Conflict)
    - Wyślij welcome email (background job)
    - Return JWT token w response
  </functional>

  <non-functional>
    - Response time <200ms (bez email sending)
    - Proper HTTP status codes
    - Error messages: user-friendly (front) + detailed (logs)
    - TypeScript strict mode (no any)
  </non-functional>

  <testing>
    - Unit tests dla validation logic
    - Integration test dla całego flow
    - Test edge cases: duplicate email, weak password, invalid format
  </testing>
</requirements>

<output_format>
  1. Endpoint implementation (src/routes/users.ts)
  2. Validation schemas (Zod)
  3. Tests (Vitest)
  4. OpenAPI/Swagger documentation snippet
</output_format>
```

**Korzyści:**
- AI dostaje perfectly structured input
- Wszystkie wymagania jawne (mniej halucynacji)
- Łatwo reużyć jako template
- Możesz mieć XML prompt library w projekcie

**Kiedy używać:**
- Complex, multi-faceted tasks
- Tasks wymagające multiple deliverables
- Gdy potrzebujesz reproducible results
- Tworzenie prompt templates dla zespołu

### Najlepsze praktyki IDE

#### Workflow dla nowej feature:

1. **Planning** (w Chat)
   ```
   Zaplanuj implementację [feature]

   @Codebase (zrozum istniejącą architekturę)
   @File [relevantne pliki]

   Potrzebuję:
   - Architecture overview
   - Lista plików do create/modify
   - Potencjalne breaking changes
   - Testing strategy
   ```

2. **Review planu** (Human-in-the-Loop)
   - Czy plan ma sens?
   - Czy nie czegoś pominął?
   - Czy approach jest optymalny?

3. **Implementation** (Composer/Agent mode dla multi-file)
   ```
   Zaimplementuj według planu z poprzedniej konwersacji

   @src/components/ (gdzie zmiany)
   @src/types/ (typy)

   Pamiętaj o: testach, error handling, accessibility
   ```

4. **Iterative Refinement** (Inline Edit dla small tweaks)
   - Poprawki stylistyczne
   - Drobne bugi
   - Dodatkowe edge cases

5. **Testing** (Chat)
   ```
   Wygeneruj testy dla @src/components/NewFeature.tsx

   Sprawdź: happy path, edge cases, error states
   Framework: Vitest + Testing Library
   ```

6. **Documentation** (Custom Command)
   Użyj "Add JSDoc" command na każdej nowej funkcji

#### Tips & Tricks:

💡 **Rozpocznij prompt od symbolu @**
- AI od razu dostaje context
- Mniej token waste na explanations
- Przykład: `@src/api/users.ts jak mogę zoptymalizować to query?`

💡 **Używaj Selection Context**
- Zaznacz kod → Cmd+Shift+L → pytaj specyficznie o zaznaczenie
- Oszczędza tokeny vs wklejanie całego pliku

💡 **Chain of Thought w złożonych zadaniach**
```
"Pomyśl krok po kroku jak rozwiązać [problem].
Najpierw wyjaśnij approach, potem implementację."
```

💡 **Explicit Output Format**
```
"Odpowiedź w formacie:
## Problem Analysis
...
## Proposed Solution
...
## Implementation
```code```
## Trade-offs
..."
```

---

## Praca w terminalu (CLI)

### Kiedy używać AI CLI zamiast IDE

CLI AI (Claude Code, Codex CLI, aider) ma unikalne zalety w określonych scenariuszach:

#### ✅ Używaj CLI gdy:

1. **Praca na zdalnych maszynach**
   - SSH do produkcji/staging
   - Development na zdalnym serwerze
   - Brak możliwości GUI

2. **Multi-file refactoring na dużą skalę**
   - Renaming abstrakcji przez cały codebase
   - Migracje frameworków (React 17 → 19)
   - Update dependencies i fixing breaking changes
   - Większy context window niż IDE solutions

3. **Headless operations**
   - Skrypty CI/CD
   - Automated code generation pipelines
   - Git hooks z AI assistance

4. **Exploration i onboarding**
   - Zrozumienie unfamiliar codebase
   - "Jak działa feature X w tym projekcie?"
   - Generate architectural diagrams

5. **Gdy potrzebujesz ReAct mode (Reason + Act)**
   - AI runs commands (npm test, curl, git blame)
   - Reads logs and stack traces
   - Iterates based on results
   - Autonomiczne debugging

6. **Flexibility & no vendor lock-in**
   - Możesz zmieniać modele (API keys)
   - On-prem / offline capabilities (niektóre tools)
   - Działa z każdym editorem (vim, emacs, IntelliJ)

#### ❌ NIE używaj CLI gdy:

- Potrzebujesz instant inline suggestions (IDE lepsze)
- Quick one-line edits (IDE Inline Edit szybsze)
- Visual debugging (IDE oferuje breakpoints, inspect)
- Autocomplete as-you-type (IDE specialized)

### Kluczowe możliwości CLI

#### 1. Broad Repository Context
CLI tools zazwyczaj mają szersze context window i lepiej rozumieją całe repo:

```bash
claude-code "Wyjaśnij mi jak działa cały auth flow w tym projekcie"
# AI przejrzy: routes, middleware, models, config, tests
# Wygeneruje comprehensive explanation + diagram
```

#### 2. ReAct Mode (Reason + Act)
AI może:
- Uruchamiać komendy shell
- Czytać outputy i logi
- Iterować na podstawie rezultatów

**Przykład - Debugging z logs:**
```bash
aider "Dlaczego API zwraca 500? Przeanalizuj logi i napraw."

# AI zrobi:
1. tail -n 100 logs/error.log  (przeczyta logi)
2. Zidentyfikuje: NullPointerException in UserService:42
3. Otworzy src/services/UserService.ts
4. Znajdzie null pointer
5. Zaproponuje fix
6. Uruchomi testy
7. Jeśli fail, iterate
```

#### 3. Change Control
Przed zastosowaniem zmian, AI pokazuje diff:

```diff
# aider pokazuje co zmieni:
--- src/api/users.ts
+++ src/api/users.ts
@@ -15,7 +15,10 @@
 export async function createUser(data: CreateUserDTO) {
-  const user = await db.user.create({ data });
+  const existingUser = await db.user.findUnique({
+    where: { email: data.email }
+  });
+  if (existingUser) throw new ConflictError('Email already exists');
+  const user = await db.user.create({ data });
   return user;
 }

Apply these changes? [y/n/e/q]
y = yes, n = no, e = edit, q = quit
```

**Kontrola:**
- Zobacz dokładnie co się zmieni
- Odrzuć niepotrzebne zmiany
- Edit przed apply
- Optional auto-commit po sukcesie

#### 4. Tool Integrations

**Git integration:**
```bash
claude-code "Co zmieniło się w auth od v2.0?"
# AI uruchomi: git diff v2.0..HEAD -- src/auth/
# Przeanalizuje i wytłumaczy w języku ludzkim
```

**MCP (Model Context Protocol):**
- Integracja z external tools: Jira, Slack, Notion
- Access do databases (read-only dla bezpieczeństwa)
- Custom tooling (internal APIs)

**IDE plugins:**
- VS Code extension dla Claude Code
- Możesz zacząć w IDE, kontynuować w CLI

#### 5. Local i remote work

```bash
# Lokalne repo
cd ~/projects/myapp
claude-code "Add user authentication"

# Zdalny server przez SSH
ssh deploy@prod-server
cd /var/www/myapp
codex-cli "Analyze why memory usage spiked at 2AM"
```

### Best Use Cases dla CLI

#### 1. Onboarding do unfamiliar repo

```bash
claude-code "
Jestem nowy w tym projekcie. Stwórz mi onboarding guide:
- Główne komponenty i ich odpowiedzialności
- Flow danych (request → response)
- Najważniejsze abstrakcje i wzorce
- Jak setup dev environment
- Jak uruchomić testy
- Architectural diagram (Mermaid)

Zapisz jako ONBOARDING.md
"
```

**Efekt:** Zamiast godzin czytania kodu, masz structured overview w 2 minuty.

#### 2. Cross-file refactoring

```bash
aider "
Zrefaktoruj 'UserProfile' na 'UserAccount' we wszystkich plikach.

Rules:
- Update imports
- Update type definitions
- Update JSDoc comments
- Update test descriptions
- Zachowaj backwards compatibility (deprecated alias)
- Generate migration guide
"
```

**AI:**
- Znajdzie wszystkie wystąpienia
- Zrobi intelligent rename (nie słupie find-replace)
- Zachowa context w każdym pliku
- Pokaże diff przed apply

#### 3. Implementing complete CRUD module

```bash
claude-code "
Zaimplementuj complete CRUD dla 'Product' entity.

Stack: Next.js 15 App Router, Prisma, PostgreSQL
Include:
- Prisma schema
- API routes (app/api/products/)
- Server actions
- React components (list, create, edit, delete)
- Form validation (Zod)
- Error handling
- Unit + E2E tests

Follow patterns z istniejącej 'User' CRUD w projekcie.
"
```

**AI przejrzy istniejące patterns i wygeneruje spójny kod.**

#### 4. Test generation

```bash
codex-cli "
Wygeneruj testy dla wszystkich plików w src/api/ które nie mają testów.

Framework: Vitest
Coverage: functions, branches, edge cases
Mock: database, external APIs
Generate in src/api/__tests__/
"
```

#### 5. Debugging z logs/stack traces

```bash
# Skopiuj stack trace do pliku
vim error.log

aider "Przeanalizuj error.log i napraw bug. Uruchom testy po fixie."

# AI:
# 1. Przeczyta stack trace
# 2. Znajdzie problematyczny kod
# 3. Zrozumie root cause
# 4. Zaproponuje fix
# 5. Uruchomi testy (npm test)
# 6. Iterate jeśli testy fail
```

#### 6. Dependency migrations

```bash
claude-code "
Migruj z Moment.js na Day.js w całym projekcie.

Steps:
1. Update package.json
2. Find all moment imports
3. Replace z dayjs equivalents (show mapping)
4. Update tests
5. Run tests po każdej zmianie
6. Generate migration checklist
"
```

#### 7. Code review assistance

```bash
# Po otrzymaniu PR do review
claude-code "
Review PR #234 (użyj git diff main...feature-branch)

Check:
- Code quality i maintainability
- Security vulnerabilities
- Performance issues
- Test coverage
- Breaking changes
- Edge cases handling

Generate review comments w formacie GitHub.
"
```

#### 8. Documentation generation

```bash
codex-cli "
Wygeneruj API documentation dla wszystkich endpointów.

Source: src/api/
Format: OpenAPI 3.0 (JSON)
Include: params, responses, examples, error codes
Output: docs/api-spec.json

Also generate human-readable docs/API.md
"
```

### Rekomendowane CLI Tools - Szczegóły

#### Claude Code (Anthropic)

**Najlepsze dla:**
- Duże repozytoria (świetny large context handling)
- Enterprise features (MCP, hooks, compliance)
- Onboarding i exploration
- Complex multi-file refactorings

**Cechy:**
- Bardzo szeroki context window (effectively uses 200k+ tokens)
- Plan mode (HITL approval przed changes)
- MCP integration (extensibility)
- Hooks system (customize behavior)

**Instalacja:**
```bash
npm install -g @anthropic-ai/claude-code
claude-code auth
```

**Przykład użycia:**
```bash
# Plan mode (default) - shows plan before executing
claude-code "Add user authentication with JWT"

# Approve plan → wykonanie

# Direct mode (bez planu)
claude-code --no-plan "Fix typo w README"
```

**Koszty:** Usage-based (Anthropic API pricing)

#### Codex CLI (OpenAI)

**Najlepsze dla:**
- Integracja z ekosystemem OpenAI
- Dostęp do najnowszych GPT-5 models
- Szybkie iteracje (fast response times)

**Cechy:**
- GPT-5-Codex (specialized code model)
- Reasoning modes (Low/Medium/High effort)
- Good balance speed/quality

**Instalacja:**
```bash
pip install openai-codex-cli
codex auth
```

**Przykład:**
```bash
codex "Implement binary search in Python with type hints"

# Z reasoning mode
codex --reasoning high "Optimize this algorithm for large datasets"
```

**Koszty:** Usage-based (OpenAI API)

#### Gemini CLI (Google)

**Najlepsze dla:**
- Zadania multimodalne (images, PDFs w repo)
- Integracja z Google Cloud
- Bardzo długie context (1M+ tokens)

**Cechy:**
- Gemini 2.5 Pro (long context specialist)
- Multimodal (analyze screenshots, diagrams)
- Google Cloud integration (GCP services)

**Instalacja:**
```bash
npm install -g @google/gemini-cli
gemini auth
```

**Przykład:**
```bash
# Analyze image w projekcie
gemini "Compare design mockup (design.png) with current implementation"

# Long context
gemini "Summarize all changes in this repo from last 6 months"
```

**Koszty:** Usage-based (Google AI pricing)

#### aider

**Najlepsze dla:**
- Precyzyjne, controlled changes
- Devs którzy chcą widzieć dokładnie co się zmienia
- Surgical refactorings (minimal diff)

**Cechy:**
- Excellent diff preview przed apply
- Git integration (auto-commit opcjonalne)
- Multiple modes: ask, code, architect
- Works with any model (OpenAI, Anthropic, local)

**Instalacja:**
```bash
pip install aider-chat
```

**Przykład:**
```bash
# Interactive mode
aider src/app.ts src/types.ts
> Add error handling to fetchUser function

# AI generuje changes, pokazuje diff
# Ty approujesz lub rejectujesz

# One-shot mode
aider --message "Fix all ESLint errors" --yes-always
```

**Koszty:** Free tool, płacisz za API (OpenAI/Anthropic)

#### OpenCode

**Najlepsze dla:**
- No vendor lock-in (bring your own model)
- On-prem / offline support
- Open source customization

**Cechy:**
- Works with any LLM API
- Local model support (Ollama, LM Studio)
- Full control nad data (never leaves your infra)
- OSS (możesz modyfikować)

**Instalacja:**
```bash
npm install -g @open-code/cli
```

**Przykład:**
```bash
# Z OpenAI
opencode --model gpt-4 "Add logging"

# Z local model
opencode --model ollama/codellama "Explain this function"

# Z custom endpoint
opencode --api-url http://internal-llm.company.com "Generate tests"
```

**Koszty:** Free tool, koszty zależą od modelu

### CLI Best Practices

#### 1. Start z exploration

Przed dużymi zmianami, zrozum codebase:

```bash
claude-code "Wyjaśnij mi strukturę tego projektu i główne komponenty"
```

#### 2. Używaj Plan Mode dla destructive changes

```bash
# ✅ Z planem (safe)
claude-code "Refactor auth system to use OAuth"
# [review plan przed execution]

# ⚠️ Bez planu (risky)
claude-code --no-plan "Refactor auth system"
```

#### 3. Commit frequently

```bash
# Git status przed
git status

# AI changes
aider "Implement feature X"

# Review diff
git diff

# Commit jeśli OK
git add .
git commit -m "feat: implement X (AI-assisted)"

# Easy rollback jeśli coś pójdzie źle
```

#### 4. Combine z traditional tools

AI nie zawsze jest best tool:

```bash
# ✅ Structural changes - use AST tools
jscodeshift -t transform.js src/

# ✅ Simple find-replace
rg "oldName" --files-with-matches | xargs sed -i 's/oldName/newName/g'

# ✅ Complex logic changes - use AI
claude-code "Refactor user auth to support OAuth providers"
```

#### 5. Iterative refinement

```bash
# Session 1: High-level implementation
claude-code "Implement user dashboard"

# Session 2: Tests
claude-code "Add tests for dashboard"

# Session 3: Polish
claude-code "Improve accessibility and error handling"
```

Smaller, focused sessions > jeden gigantyczny prompt.

---

## Agenci asynchroniczni

Async agents wykonują pełny cykl development bez ciągłego nadzoru (ale z checkpoints do approval).

### Kluczowe funkcje

#### Full Development Cycle
```
Issue → Planning → Implementation → Tests → PR → Review
```

Agent autonomicznie:
1. Czyta issue/ticket
2. Analizuje wymagania
3. Tworzy plan implementacji
4. Tworzy branch
5. Implementuje changes
6. Pisze testy
7. Commit + push
8. Otwiera PR
9. Czeka na human review

#### HITL (Human-in-the-Loop) Approval

**Plan Approval:**
Przed rozpoczęciem kodu, agent przedstawia plan:

```markdown
## Implementation Plan for Issue #234: Add dark mode

### Analysis
- User wants dark mode toggle in settings
- Should persist preference (localStorage + user profile)
- Needs to apply globally across all pages

### Changes Required
1. Add theme context (src/contexts/ThemeContext.tsx)
2. Create toggle component (src/components/ThemeToggle.tsx)
3. Update Layout to use theme
4. Add dark: variants to existing components
5. Tests for theme switching

### Files to Modify
- src/contexts/ThemeContext.tsx (NEW)
- src/components/Layout.tsx
- src/components/Header.tsx
- tailwind.config.js (darkMode: 'class')
- ...

### Testing Strategy
- Unit: ThemeContext logic
- Integration: Toggle switches theme
- E2E: Theme persists across pages

Estimated time: 2-3 hours
Approve to proceed? [Yes/No/Edit]
```

Ty review i:
- ✅ Approve → agent starts
- ❌ Reject → agent stops
- ✏️ Edit → poprawiasz plan, agent uses updated version

#### Sandbox Execution

Agent może uruchamiać:
- `npm test` (run tests)
- `npm run lint` (check code style)
- `npm run build` (verify build passes)
- `npm run type-check` (TypeScript errors)

**Automatic iteration:**
```
1. Agent implementuje changes
2. Runs tests
3. Tests fail ❌
4. Agent analizuje failures
5. Fixes code
6. Runs tests again
7. Tests pass ✅
8. Proceeds to next step
```

**Limit iteracji:** Zazwyczaj 3-5 tries. Jeśli nie uda się - flaguje do human review.

#### Auto PR + Review Request

Po zakończeniu:
```
✅ Implementation complete
✅ Tests passing (24/24)
✅ Lint passing
✅ Build successful

Created PR #245: "feat: add dark mode toggle"
Requested review from: @you

Summary:
- Added ThemeContext with localStorage persistence
- Created ThemeToggle component in Header
- Updated 8 components with dark mode styles
- Added 12 unit tests, 3 E2E tests
- All checks passing ✅
```

Ty robisz final review i merge.

### Kiedy używać agentów

#### ✅ Perfect Use Cases:

**1. Bug Fixes z automated tests**
```
Issue: "User can submit form without email"
Agent:
- Przeczyta issue
- Znajdzie validation logic
- Naprawi bug
- Uruchomi testy
- Sprawdzi czy fix działa
- PR z fix
```

**2. Implementing features z user stories**
```
User Story: "As a user, I want to filter products by category"
Agent:
- Przeanalizuje requirements
- Zaprojektuje solution
- Zaimplementuje filter UI + logic
- Napisze testy
- PR ready for review
```

**3. Dependency updates**
```
Task: "Update React 18 → React 19"
Agent:
- Update package.json
- Znajdzie breaking changes
- Naprawi incompatibilities
- Uruchomi test suite
- Fix failing tests
- PR z migration
```

**4. Test coverage improvements**
```
Task: "Increase coverage to 80% for src/api/"
Agent:
- Zidentyfikuje uncovered code
- Wygeneruje missing tests
- Run coverage report
- Iterate until target reached
```

**5. Documentation gaps**
```
Task: "Document all API endpoints w OpenAPI"
Agent:
- Przejrzy kod
- Wyekstrahuje endpoint definitions
- Wygeneruje OpenAPI spec
- Add inline JSDoc
- Update README
```

**6. Review automation**
```
On PR creation:
Agent:
- Analyze code changes
- Check style compliance
- Run security scan
- Suggest improvements
- Comment on PR
```

**7. Recurring repo hygiene**
```
Weekly task: "Update dependencies, fix lint warnings"
Agent:
- npm update
- npm audit fix
- eslint --fix
- Run tests
- Auto-PR jeśli green
```

#### ❌ Unikaj agentów dla:

- **Architektural decisions** - wymaga human judgment
- **Sensitive security changes** - wymaga expert review
- **Breaking changes bez testów** - za duże ryzyko
- **Ambiguous requirements** - agent może źle zinterpretować
- **Creative/design tasks** - AI nie zastąpi designera

### Porównanie narzędzi

#### OpenAI Codex (ChatGPT Enterprise)

**Model:** GPT-5-Codex + GPT-5 Reasoning

**Charakterystyka:**
- Ad-hoc tasks w chat interface
- Brak native GitHub integration (manual triggers)
- Bardzo szybkie iteracje
- Świetna jakość kodu

**Workflow:**
```
1. Opisujesz zadanie w ChatGPT
2. Agent generuje plan
3. Approve → implementuje
4. Agent pokazuje code
5. Ty kopiujesz do IDE i commituje
```

**Pros:**
- ✅ Najnowsze modele (GPT-5 first)
- ✅ Reasoning mode dla complex tasks
- ✅ Bardzo dobra jakość
- ✅ Fast iterations

**Cons:**
- ❌ Brak GitHub automation
- ❌ Manual copy-paste kodu
- ❌ Nie tworzy PR automatycznie

**Kiedy używać:**
- Quick ad-hoc tasks
- Gdy pracujesz w ChatGPT i chcesz szybko coś zakodować
- Exploration i prototyping

#### Google Jules

**Model:** Gemini 2.5 Pro

**Charakterystyka:**
- GitHub-first (deeply integrated)
- Trigger przez labels lub comments
- Clear audit logs
- Multi-repo support

**Workflow:**
```
1. Create issue: "Add dark mode"
2. Add label: "jules" (lub comment "@jules please implement")
3. Jules analyze issue
4. Jules creates branch
5. Jules implements + tests
6. Jules opens PR
7. You review & merge
```

**Pros:**
- ✅ Deep GitHub integration (native triggers)
- ✅ Excellent audit trail (każdy krok logged)
- ✅ Multi-repo workflows
- ✅ Comment-based interaction (natural)

**Cons:**
- ❌ Wymaga Google AI subscription
- ❌ Młodsze narzędzie (fewer integrations)

**Kiedy używać:**
- Projekty z heavy GitHub workflow
- Potrzebujesz audit logs (enterprise)
- Multi-repo monorepo scenarios

#### GitHub Copilot Agent

**Model:** GPT-4 based (proprietary tune)

**Charakterystyka:**
- Native GitHub ecosystem
- Respects branch protection
- Full audit trail w GitHub UI
- Integracja z Actions, Projects, Issues

**Workflow:**
```
1. Issue creation (manual or automated)
2. Copilot analyze
3. Proposes plan (w issue comments)
4. Po approval → creates PR
5. Respects all GitHub rules (branch protection, required reviews)
6. Full history w GitHub
```

**Pros:**
- ✅ Native ecosystem (no third-party)
- ✅ Respects wszystkie GitHub policies
- ✅ Full audit w UI
- ✅ Integracja z Copilot w IDE

**Cons:**
- ❌ Wymaga GitHub Enterprise lub Copilot Business
- ❌ Vendor lock-in

**Kiedy używać:**
- Heavy GitHub users
- Enterprise z GitHub policies
- Potrzebujesz seamless IDE + Agent integration

#### Devin (Cognition AI)

**Model:** Proprietary (multi-model system)

**Charakterystyka:**
- Heavy lifting (multi-hour sessions)
- Long-running autonomous work
- Slack/Linear/Jira integrations
- Pełen development environment (browser, terminal, editor)

**Workflow:**
```
1. Assign ticket w Jira
2. Devin picked up automatically
3. Devin works autonomously (godziny)
4. Regularnie updatuje progress (Slack notifications)
5. Gdy stuck → asks questions
6. Finalnie → PR ready
```

**Pros:**
- ✅ Bardzo długie sesje (8+ godzin)
- ✅ Complex multi-step projects
- ✅ Real browser testing (Playwright integration)
- ✅ Integrations z PM tools

**Cons:**
- ❌ Najdroższy (usage-based, can be $$$)
- ❌ Czasem over-engineers solutions
- ❌ Requires good issue specs

**Kiedy używać:**
- Complex features (multi-day work)
- Potrzebujesz full autonomy
- Integracja z PM tools (Jira, Linear)

### Async Agents Best Practices

#### 1. Write clear, structured issues

❌ **Źle:**
```
Dark mode doesn't work
```

✅ **Dobrze:**
```
## Problem
Dark mode toggle in settings doesn't persist user preference

## Expected Behavior
- User toggles dark mode → preference saved
- Preference persists across sessions (localStorage + DB)
- All pages reflect chosen theme

## Current Behavior
- Toggle works but resets on page refresh

## Acceptance Criteria
- [ ] Preference saved to localStorage
- [ ] Preference synced to user profile (DB)
- [ ] Theme applies globally
- [ ] Tests for persistence
```

#### 2. Provide test infrastructure

Agent może napisać testy, ale potrzebuje:
- ✅ Test framework setup (Vitest, Jest, Playwright)
- ✅ Example tests do follow (patterns)
- ✅ Test utils, mocks, fixtures

❌ Bez testów → agent może wygenerować kod bez weryfikacji

#### 3. Set iteration limits

```
"Implement feature X. Max 3 iterations.
If tests don't pass after 3 tries, flag for human review."
```

Unikasz infinite loops i kosztów.

#### 4. Review all PRs (HITL mandatory)

**Nigdy nie auto-merge AI PRs bez review.**

Nawet jeśli testy pass:
- Sprawdź code quality
- Verify logic correctness
- Check for edge cases
- Security review

#### 5. Start small, scale gradually

```
Week 1: Assign simple bugs (well-tested areas)
Week 2: Small features (clear requirements)
Week 3: Refactorings (good test coverage)
Month 2: Complex features (after trust built)
```

#### 6. Monitor costs

Async agents mogą być costly:
- Long sessions = wiele tokenów
- Wiele iteracji = multiplied costs

Set budgets:
```
"Budget: $5 per task. Jeśli exceed → stop and flag."
```

---

## Cechy dobrego projektu

Projekty przyjazne AI mają wspólne cechy, które ułatwiają współpracę człowiek-LLM:

### 1. Jawne typowanie i spójne modele danych

**Dlaczego:**
- Jawne kontrakty ułatwiają dopasowanie różnych elementów
- AI-autocomplete działa lepiej z explicit types
- Generowany kod jest bardziej spójny
- Testy łatwiejsze do napisania

**TypeScript > JavaScript:**

```typescript
// ✅ Jawne typy - AI rozumie strukturę
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'pl' | 'en';
  notifications: boolean;
}

// ❌ Dynamiczny obiekt - AI musi zgadywać
const user = {
  id: '123',
  email: 'user@example.com',
  // ...co jeszcze może być?
};
```

**Praktyczne wnioski:**
- ✅ Używaj TypeScript strict mode
- ✅ Definiuj interfaces/types dla wszystkich struktur danych
- ✅ Używaj Zod/Yup dla runtime validation (type + validation w jednym)
- ✅ Dokumentuj typy z JSDoc
- ❌ Unikaj `any`, `unknown` bez dobrego powodu

### 2. Pliki i moduły jednego przeznaczenia (SRP)

**Single Responsibility Principle** w erze AI zyskuje nowe znaczenie.

**Dlaczego:**
- AI łatwiej zrozumie cel pliku/funkcji
- Mniej context pollution (1 plik = 1 problem)
- Łatwiejsze referencje (@File konkretny problem)
- Lepsze suggested edits (AI wie co może zmienić)

**Przykład:**

```
❌ ŹLE - jeden plik robi wszystko:
src/components/Dashboard.tsx (800 linii)
- DashboardLayout
- UserProfile
- ActivityFeed
- NotificationsBell
- Settings modal
- API calls
- State management

✅ DOBRZE - wyspecjalizowane moduły:
src/components/dashboard/
  DashboardLayout.tsx (50 linii - layout only)
  UserProfile.tsx (60 linii - profile display)
  ActivityFeed.tsx (80 linii - feed logic)
  NotificationsBell.tsx (40 linii - notifications)
src/features/dashboard/
  useActivityFeed.ts (hook - data fetching)
  useDashboardSettings.ts (hook - settings state)
src/api/dashboard.ts (API calls only)
```

**Korzyści dla AI:**
- Prompt: "@src/components/dashboard/UserProfile.tsx add avatar upload"
  - AI dostaje tylko relevant code
  - Wie że ma focus na UserProfile
  - Nie grzebię w logice ActivityFeed

**Praktyczne wnioski:**
- ✅ Jeden komponent = jeden plik
- ✅ Jedna funkcja = jedno zadanie
- ✅ Wydziel custom hooks (reusable logic)
- ✅ Separate concerns: UI, logic, data fetching
- ❌ Nie twórz "God objects" lub "Util hell"

### 3. Konwencje nad konfiguracją

**Convention over Configuration** - przewidywalna struktura ułatwia AI nawigację.

**Dlaczego:**
- AI natychmiast rozumie gdzie co jest
- Brak potrzeby długich wyjaśnień struktury
- Konsystencja = łatwiejsze generowanie

**Przykłady frameworków z konwencjami:**

**Next.js:**
```
app/
  page.tsx → homepage
  about/page.tsx → /about route
  api/users/route.ts → /api/users endpoint
```

AI wie: "chcesz nowy endpoint → stwórz app/api/{name}/route.ts"

**Astro:**
```
src/pages/
  index.astro → /
  about.astro → /about
  blog/[slug].astro → dynamic route
```

**Rails:**
```
app/
  models/ → ActiveRecord models
  controllers/ → request handlers
  views/ → templates
```

**Praktyczne wnioski:**
- ✅ Wybieraj frameworki z silnymi konwencjami (Next.js, Astro, Rails, Django)
- ✅ Stosuj established patterns (Repository, Service, Controller)
- ✅ Dokumentuj swoje konwencje jeśli custom
- ❌ Unikaj "clever" niestandardowych struktur bez dobrego powodu

### 4. Semantyczne nazewnictwo

**Nazwy tworzą kontekst domeny.**

**Dlaczego:**
- AI rozumie terminologię branżową
- Generuje kod zgodny z domeną
- Mniej potrzeby tłumaczenia intencji

**Przykłady:**

```typescript
// ❌ Generic, niejasne
function calc(a: number, b: number): number { ... }
function process(data: any): any { ... }
class Manager { ... }

// ✅ Semantyczne, jasne
function calculateMonthlyPayment(principal: number, interestRate: number): number { ... }
function processPaymentTransaction(transaction: PaymentTransaction): PaymentResult { ... }
class SubscriptionManager { ... }
```

**Domain-specific naming:**

```
E-commerce:
✅ Product, Cart, Checkout, Order, Payment
❌ Item, Container, Process, Thing

Fintech:
✅ Account, Transaction, Balance, Transfer
❌ Record, Action, Amount

Edtech:
✅ Course, Lesson, Student, Assignment, Progress
❌ Content, User, Task
```

**Praktyczne wnioski:**
- ✅ Używaj domain language (jak w business requirements)
- ✅ Funkcje jako czasowniki: `getUserProfile`, `createOrder`, `sendNotification`
- ✅ Klasy/typy jako rzeczowniki: `UserProfile`, `ShoppingCart`, `PaymentMethod`
- ✅ Booleans z prefix: `isActive`, `hasPermission`, `canEdit`
- ❌ Skróty i akronimy bez wyjaśnienia
- ❌ Generic names: `data`, `info`, `manager`, `handler`

### 5. Testy automatyczne

**Testy = żywa dokumentacja + feedback loop dla AI.**

**Dlaczego:**
- Opisują zachowanie systemu jednoznacznie
- AI może uruchamiać i iterować (ReAct mode)
- Wykrywają edge cases i regressje
- Feedback loop: generate → test → fix → test

**Przykład:**

```typescript
// Test opisuje co ma robić kod (spec)
describe('calculateDiscount', () => {
  it('applies 10% discount for regular customers', () => {
    const result = calculateDiscount(100, 'regular');
    expect(result).toBe(90);
  });

  it('applies 20% discount for premium customers', () => {
    const result = calculateDiscount(100, 'premium');
    expect(result).toBe(80);
  });

  it('applies no discount for guests', () => {
    const result = calculateDiscount(100, 'guest');
    expect(result).toBe(100);
  });

  it('throws error for negative amounts', () => {
    expect(() => calculateDiscount(-100, 'regular')).toThrow('Amount must be positive');
  });
});
```

**AI czyta testy i:**
- Rozumie expected behavior
- Wie jakie edge cases obsłużyć
- Może generować podobne testy dla nowego kodu
- Uruchamia po zmianach i iteruje jeśli fail

**Praktyczne wnioski:**
- ✅ Test-first development (TDD) dla AI-assisted work
- ✅ Descriptive test names (czytaj jak dokumentacja)
- ✅ Test edge cases, error paths, nie tylko happy path
- ✅ Integration tests dla critical flows
- ✅ E2E tests dla user journeys
- ❌ Nie commituj bez testów

### 6. Formattery, lintery i statyczna analiza kodu

**Instant feedback loop dla AI.**

**Dlaczego:**
- AI dostaje concrete error messages
- Może auto-naprawiać w kolejnych iteracjach
- Redukuje manual corrections

**Setup:**

```json
// package.json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

**AI workflow z linterem:**

```
1. AI generuje kod
2. Uruchamia `npm run lint`
3. ESLint zwraca:
   "Error: 'useState' is defined but never used (react-hooks/exhaustive-deps)"
4. AI rozumie problem
5. Naprawia (usuwa unused import)
6. Uruchamia lint ponownie
7. Pass ✅
```

**Praktyczne wnioski:**
- ✅ ESLint + Prettier (JavaScript/TypeScript)
- ✅ Ruff, Black (Python)
- ✅ RuboCop (Ruby)
- ✅ Pre-commit hooks (Husky) - wymusza quality
- ✅ CI checks - nie merguj bez pass
- ❌ Nie wyłączaj rules bez dobrego powodu

### 7. Zrozumiała historia zmian (Git)

**Git log = dodatkowy kontekst dla AI.**

**Dlaczego:**
- AI może przeszukiwać historię (`git log`, `git blame`)
- Rozumie ewolucję projektu
- Pomaga w debugowaniu ("co się zmieniło?")

**Dobre commity:**

```bash
✅ DOBRZE - Conventional Commits:
fix: prevent race condition in user authentication flow
feat: add dark mode toggle to settings
refactor: extract validation logic to separate module
test: add edge cases for payment processing
docs: update API documentation for /users endpoint

❌ ŹLE - niejasne:
fix bug BU-21411
update stuff
changes
WIP
asdf
```

**Conventional Commits format:**
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat:` - nowa funkcjonalność
- `fix:` - naprawa błędu
- `refactor:` - refactoring (bez zmiany behavior)
- `test:` - dodanie/zmiana testów
- `docs:` - dokumentacja
- `chore:` - maintenance (dependencies, config)
- `perf:` - optymalizacja wydajności
- `style:` - formatowanie (nie CSS, ale code style)

**AI może:**
```bash
# Zrozumieć co się zmieniło
git log --oneline --since="2 weeks ago"

# Znaleźć kiedy bug został wprowadzony
git bisect start
# AI iteruje i testuje

# Zobacz historię funkcji
git log -p --follow -- src/auth/login.ts
```

**Praktyczne wnioski:**
- ✅ Używaj Conventional Commits
- ✅ Descriptive messages (dlaczego, nie tylko co)
- ✅ Atomic commits (jeden concern = jeden commit)
- ✅ Linkuj do issues/tickets (#234)
- ❌ Nie commituj wszystkiego na raz
- ❌ "WIP" commits tylko w feature branches

### 8. Komentarze kontekstowe

**Komentarze wyjaśniają "dlaczego", nie "co".**

**Dlaczego:**
- Edge cases nie widoczne w kodzie
- Biznesowa logika nie oczywista
- Temporary workarounds z wyjaśnieniem
- Integracje z quirkami zewnętrznych API

**Przykłady dobrych komentarzy:**

```typescript
// ✅ Wyjaśnia edge case
// We check subscription status before allowing export because free users
// are limited to 10 exports per month (business rule from 2024-02)
if (!hasActiveSubscription(user) && user.exportCount >= 10) {
  throw new Error('Export limit reached');
}

// ✅ Wyjaśnia nieoczywiste
// Safari has a bug where Date.parse() fails for ISO strings with timezone
// See: https://bugs.webkit.org/show_bug.cgi?id=123456
// Workaround: manually parse using dayjs
const date = dayjs(isoString).toDate();

// ✅ Wyjaśnia tymczasowe rozwiązanie
// TODO: This is a temporary fix for the race condition in user authentication
// Proper solution tracked in #456. Remove this setTimeout when fixed.
setTimeout(() => validateSession(), 100);

// ✅ Wyjaśnia constraint zewnętrzny
// Stripe API requires amount in cents (integer), not dollars (float)
const amountInCents = Math.round(amountInDollars * 100);

// ❌ Komentarz wyjaśniający "co" (oczywiste z kodu)
// Increment counter by 1
counter++;

// ❌ Przestarzały komentarz (nie updates)
// This function uses Redis (WRONG - aktualnie używa Postgres)
function getCachedUser() { ... }
```

**Praktyczne wnioski:**
- ✅ Wyjaśniaj biznesową logikę
- ✅ Dokumentuj edge cases
- ✅ Oznaczaj temporary workarounds (TODO, FIXME)
- ✅ Linkuj do issues, bugtrackerów, dokumentacji
- ✅ Wyjaśniaj quirki platform/browserów
- ✅ Update komentarze przy zmianach kodu
- ❌ Nie komentuj oczywistości
- ❌ Nie zostawiaj commented-out code (użyj git)

### 9. Popularny stack technologiczny

**AI działa lepiej z popularniejszymi technologiami.**

**Dlaczego:**
- Więcej przykładów w danych treningowych
- AI widział miliony projektów w danym stacku
- Lepsze rozumienie patterns i best practices
- Mniej halucynacji

**Popularne stacki (dobre dla AI):**

**Frontend:**
- ✅ React + TypeScript (najbardziej popularne)
- ✅ Next.js (silne konwencje)
- ✅ Vue 3 + TypeScript
- ✅ Svelte(Kit)
- ✅ Astro

**Backend:**
- ✅ Node.js + Express/Fastify
- ✅ Python + Django/FastAPI
- ✅ Ruby on Rails
- ✅ Java + Spring Boot
- ✅ Go + Gin/Echo

**Databases:**
- ✅ PostgreSQL
- ✅ MySQL
- ✅ MongoDB
- ✅ Redis

**Testing:**
- ✅ Jest/Vitest
- ✅ Playwright
- ✅ Cypress

**Nisze/custom stacki:**
- ⚠️ AI ma mniej przykładów
- ⚠️ Może halucynować API
- ⚠️ Potrzebujesz dostarczyć więcej dokumentacji
- ⚠️ Musisz explicitly wskazać patterns

**Nie oznacza:** "nie używaj niszowych technologii"
**Oznacza:** "bądź świadomy że potrzebujesz więcej guidance dla AI"

**Praktyczne wnioski:**
- ✅ Dla nowych projektów: rozważ popularny stack (jeśli nie ma contra-indications)
- ✅ Dla niszowych: dostarcz comprehensive .cursorrules i examples
- ✅ Dokumentuj custom patterns explicit
- ⚠️ Weryfikuj AI suggestions dokładniej w niszowych stackach

### 10. Instrukcje dla AI

**Modern AI tools mają built-in konwencje definiowania instrukcji.**

**Pliki z instrukcjami:**

**Cursor:**
- `.cursorrules` (root projektu)
- `.cursor/rules/*.md` (per-domain rules)

**Windsurf:**
- `.windsurfrules`

**Claude Code:**
- `CLAUDE.md` (project instructions)

**GitHub Copilot:**
- `.github/copilot-instructions.md`

**Universal (większość narzędzi):**
- `AGENTS.md` - ogólne instrukcje dla agentów
- `CONTRIBUTING.md` - jak contributeować (AI też to czyta)

**Co zawrzeć w instrukcjach:**

```markdown
# Project Instructions for AI

## Tech Stack
[Lista technologii z wersjami]

## Architecture
[High-level overview: MVC, clean architecture, etc.]

## File Organization
[Gdzie co jest, naming conventions]

## Code Style
[Preferowane patterns, ESLint rules]

## Testing Requirements
[Jakie testy pisać, coverage minimum]

## DO's and DON'Ts
[Explicit rules: co robić, czego unikać]

## Examples
[Przykłady dobrych patterns z projektu]
```

**Przykład .cursorrules:**

```markdown
# E-commerce Project Rules

## Stack
- Next.js 15 (App Router), React 19, TypeScript 5.4
- Supabase (auth + db), Prisma ORM
- TailwindCSS 3, shadcn/ui components
- Stripe for payments

## Architecture
- Feature-based folders (src/features/{feature-name}/)
- Each feature: components/, hooks/, api/, types/
- Shared code in src/shared/

## Testing
- Vitest for unit, Playwright for E2E
- Every feature must have tests
- Minimum coverage: 80%

## DO
✅ Use Server Components by default
✅ Client components only when needed (interactivity)
✅ Validate forms with Zod
✅ API errors: throw, handle in error boundaries
✅ Async operations: use TanStack Query

## DON'T
❌ No Redux (use Zustand for client state)
❌ No CSS-in-JS (Tailwind only)
❌ No any types (use unknown and narrow)
❌ No console.log in production (use proper logging)

## Patterns
- Auth: useUser() hook from @/hooks/useUser
- API calls: src/api/{resource}.ts with TanStack Query
- Forms: react-hook-form + Zod schema
```

**Efekt:**
- AI generuje kod zgodny z projektem od pierwszej próby
- Mniej corrections i review iterations
- Spójność w całym projekcie

---

## Best Practices & Anti-Patterns

### ✅ DO - Best Practices

#### 1. Specs przed implementacją
```
✅ Zawsze zacznij od jasnych wymagań
✅ Stwórz plan przed kodem
✅ Weryfikuj założenia z team/AI przed implementacją
```

#### 2. Phased approach z checkpoints
```
✅ Dziel duże zadania na mniejsze kroki
✅ Checkpoint po każdym etapie (plan → kod → testy → review)
✅ Łatwiejszy rollback jeśli coś pójdzie nie tak
```

**Przykład faz:**
```
Phase 1: Planning & Architecture
└─ Checkpoint: Zreview plan z AI/team

Phase 2: Core Implementation
└─ Checkpoint: Code review, podstawowa funkcjonalność działa

Phase 3: Edge Cases & Error Handling
└─ Checkpoint: Wszystkie edge cases covered

Phase 4: Testing
└─ Checkpoint: All tests green

Phase 5: Documentation
└─ Checkpoint: Docs complete, ready to merge
```

#### 3. Multiple models strategy
```
✅ Koder (fast model) dla codziennych zadań
✅ Architekt (reasoning model) dla planowania i complex logic
✅ Nie używaj "najlepszego" modelu do wszystkiego (koszty!)
```

#### 4. Document exploration process
```
✅ Zapisuj co odkryłeś podczas researchu
✅ Dokumentuj "dlaczego" wybrano dane podejście
✅ Przyszły-Ty podziękuje (i zespół też)
```

**Szablon:**
```markdown
## Decision Log: Authentication Strategy

### Explored Approaches
1. Session-based (cookies)
   - Pros: Simple, no token management
   - Cons: Not scalable, CORS issues

2. JWT tokens
   - Pros: Stateless, scalable
   - Cons: Token revocation complex

3. OAuth 2.0 + JWT
   - Pros: Industry standard, third-party login
   - Cons: More complex setup

### Decision: OAuth 2.0 + JWT
**Reason:** We need third-party logins (Google, GitHub) and scalability.
**Trade-off:** Accepting higher initial complexity for long-term flexibility.
**Date:** 2024-11-07
**Participants:** @alice, @bob, AI (Claude Sonnet)
```

#### 5. Verify AI outputs (szczególnie business domain)
```
✅ Code review AI suggestions
✅ Weryfikuj business logic z domain experts
✅ Test w różnych scenariuszach
✅ Security review dla critical paths
```

**Checklist weryfikacji:**
- [ ] Kod kompiluje się / nie ma syntax errors
- [ ] Testy przechodzą (unit + integration)
- [ ] Edge cases są obsłużone
- [ ] Error handling jest comprehensisive
- [ ] Security: nie ma oczywistych luk (SQL injection, XSS, etc.)
- [ ] Performance: nie ma oczywistych bottlenecków
- [ ] Business logic: zgodna z requirements
- [ ] Code style: zgodny z projektem

#### 6. Combine traditional tools z AI
```
✅ AST-based refactoring (jscodeshift) dla structural changes
✅ Find-replace dla prostych zmian
✅ AI dla complex logic transformations
```

**Przykład:**
```bash
# Simple renaming: traditional tool (fast)
rg "oldFunction" -l | xargs sed -i 's/oldFunction/newFunction/g'

# Refactor logic: AI (quality)
claude-code "Refactor error handling to use Result type pattern"
```

#### 7. Regression tests przed refactoringiem
```
✅ Napisz testy PRZED refactoringiem
✅ Potwierdź że testy pass z obecnym kodem
✅ Refactor
✅ Testy powinny dalej passar (jeśli fail → regression)
```

**Golden Rule:**
> Green → Refactor → Green

### ❌ DON'T - Anti-Patterns

#### 1. Accepting first AI answer bez weryfikacji
```
❌ "AI powiedział więc na pewno jest OK"
❌ Copy-paste bez zrozumienia
❌ Commit bez review
```

**Problem:**
- AI może halucynować
- Może nie zrozumieć kontekstu
- Może użyć outdated patterns

**Fix:**
- ✅ Zawsze review
- ✅ Zrozum co robi kod
- ✅ Uruchom testy

#### 2. Letting AI make all architectural decisions
```
❌ "AI zaprojektuj mi architekturę aplikacji"
   [accept bez question]
```

**Problem:**
- AI nie zna business constraints
- Nie zna team skills
- Nie zna długoterminowych planów

**Fix:**
- ✅ AI jako advisor, nie decision maker
- ✅ Multiple perspectives (AI + team)
- ✅ Human ma final say na architekturze

#### 3. Ignore failing tests z AI changes
```
❌ "Tests fail ale kod wygląda OK, zmergujemy"
```

**Problem:**
- Failing test to signal że coś jest źle
- Może być regression
- Może być broken assumption

**Fix:**
- ✅ Zawsze investigate failing tests
- ✅ Napraw lub update test (jeśli behavior changed intentionally)
- ✅ Never ignore

#### 4. Use AI dla sensitive code bez privacy controls
```
❌ Paste secrets, API keys, customer data do AI
❌ No privacy mode w IDE
```

**Problem:**
- Leakage sekretów do training data
- GDPR violations
- Security breach

**Fix:**
- ✅ Privacy mode enabled
- ✅ .aiignore dla sensitive files
- ✅ Never paste secrets do AI (use env vars, references)

#### 5. Rely solely on benchmarks dla model selection
```
❌ "Model X ma 95% na benchmarku więc używam tylko go"
```

**Problem:**
- Benchmarks mogą być gamed
- Nie odzwierciedlają real-world użycia
- Twoje use case może być różny

**Fix:**
- ✅ Test models na swoich zadaniach
- ✅ Użyj OpenRouter rankings (real usage)
- ✅ Różne modele do różnych zadań

#### 6. Skip code review AI-generated code
```
❌ "AI napisało więc jest perfect"
```

**Problem:**
- AI generuje "plausible" kod, nie zawsze "correct"
- Może pominąć edge cases
- Może mieć subtle bugs

**Fix:**
- ✅ Code review WSZYSTKIEGO (AI czy human)
- ✅ Ten sam standard jakości

#### 7. Continue unproductive conversations beyond 3 fails
```
❌ Iteration 8: "Spróbuj jeszcze raz..."
```

**Problem:**
- Context pollution (zbyt długa konwersja)
- AI zapętlone w złym podejściu
- Koszt tokenów rośnie

**Fix:**
- ✅ 3-fix rule: po 3 failach → reset
- ✅ Comprehensive summary
- ✅ New conversation z improved prompt

#### 8. Ignore edge cases i error handling
```
❌ "Happy path działa, enough"
```

**Problem:**
- Production code musi handle errors
- Edge cases są gdzie bugs się kryją
- Users będą triggered edge cases

**Fix:**
- ✅ Explicit request dla edge cases
```
"Implement X. Handle edge cases:
- Empty input
- Null values
- Network failures
- Rate limiting
- Invalid formats"
```
- ✅ Test edge cases

---

## Quick Reference Checklist

### 🚀 Pre-work Checklist

Przed rozpoczęciem pracy z AI:

- [ ] **Privacy setup** - włącz privacy mode, .aiignore configured
- [ ] **Project instructions** - .cursorrules / CLAUDE.md aktualne
- [ ] **Git clean** - working tree clean (łatwy rollback)
- [ ] **Tests green** - wszystkie testy przechodzą przed zmianami
- [ ] **Model selected** - wybrany odpowiedni model (koder vs architekt)

### 📝 Prompting Checklist

Przy tworzeniu prompta:

- [ ] **Command** - jasne polecenie z czasownikiem na początku
- [ ] **Context** - stack, pliki (@File), constraints, domain
- [ ] **Format** - określony format output (JSON, markdown, code)
- [ ] **Specificity** - konkretne wymagania, nie ogólniki
- [ ] **Edge cases** - wymienione edge cases do obsłużenia

### 🔧 Implementation Checklist

Podczas implementacji:

- [ ] **Plan first** - stworzony i zreview'owany plan przed kodem
- [ ] **Incremental** - małe kroki z verification po każdym
- [ ] **Context symbols** - używane @File, @Folder dla precyzji
- [ ] **Tests alongside** - testy generowane razem z kodem
- [ ] **Linting** - kod przechodzi lint/format checks

### ✅ Pre-commit Checklist

Przed commitowaniem AI-generated code:

- [ ] **Code review** - zrozumiałeś co robi kod
- [ ] **Tests pass** - wszystkie testy green (unit + integration)
- [ ] **Edge cases** - covered w kodzie i testach
- [ ] **Error handling** - comprehensive error handling
- [ ] **Security check** - brak oczywistych podatności
- [ ] **Lint pass** - ESLint/Prettier pass
- [ ] **Type check** - TypeScript strict mode pass (jeśli TS)
- [ ] **Documentation** - komentarze dla non-obvious logic
- [ ] **Conventional commit** - opisowa commit message

### 🔄 Review & Iterate Checklist

Po otrzymaniu AI response:

- [ ] **Verify correctness** - logika biznesowa correct
- [ ] **Check completeness** - wszystkie requirements fulfilled
- [ ] **Assess quality** - maintainable, readable, idiomatic
- [ ] **3-fix rule** - jeśli 3 iteracje failed → reset conversation
- [ ] **Document decisions** - zapisz exploration i decision rationale

### 🎯 Tool Selection Guide

Wybierz narzędzie według typu zadania:

| Zadanie | Narzędzie | Dlaczego |
|---------|-----------|----------|
| Szybkie inline edits | IDE (Cursor) | Natychmiastowy feedback |
| Multi-file refactoring | CLI (Claude Code) | Szerszy kontekst |
| Onboarding do repo | CLI (Claude Code) | Exploration capabilities |
| Bug fix z testami | Async Agent | Autonomous iteration |
| Feature implementation | IDE w Plan mode | Interactive refinement |
| Dependency update | Async Agent | Automated testing loop |
| Code review | CLI or Async Agent | Comprehensive analysis |
| Documentation | CLI | Broad repo understanding |

### 🧠 Model Selection Guide

Wybierz model według złożoności:

| Typ zadania | Model | Przykład |
|-------------|-------|----------|
| Quick generation | Koder (Sonnet 4.5) | Generate React component |
| Complex refactoring | Architekt (GPT-5 Reasoning) | Redesign state management |
| Testing | Koder | Generate unit tests |
| Architecture planning | Architekt | Design microservices arch |
| Bug fixing | Koder | Fix type error |
| Performance optimization | Architekt | Optimize database queries |
| Code explanation | Koder | Explain function logic |
| Security analysis | Architekt | Find vulnerabilities |

### 🛡️ Safety Checklist

Dla bezpiecznej pracy z AI:

- [ ] **No secrets in prompts** - używaj placeholders, nie prawdziwe keys
- [ ] **Privacy mode on** - w IDE i CLI
- [ ] **Sensitive files ignored** - .env, credentials w .aiignore
- [ ] **Human review mandatory** - nigdy auto-merge bez review
- [ ] **Rollback plan** - git clean, łatwy revert
- [ ] **Audit logs** - track co AI zmienił (git log)

### 📊 Cost Optimization Checklist

Dla efektywnego wykorzystania budżetu:

- [ ] **Right model for task** - nie używaj reasoning dla prostych zadań
- [ ] **Language choice conscious** - Polish vs English (token cost)
- [ ] **Minimal context** - tylko relevant files, nie @Codebase jeśli niepotrzebne
- [ ] **Reusable prompts** - custom commands dla frequent tasks
- [ ] **Iteration limits** - max 3 tries, potem reset
- [ ] **Monitor usage** - track spending (Cursor credits, API usage)

---

## Zakończenie

Efektywna praca z AI to nie tylko używanie najnowszych modeli, ale:

1. **Zrozumienie ograniczeń** - AI to narzędzie, nie magiczne rozwiązanie
2. **Właściwe promptowanie** - precyzyjne, kontekstowe instrukcje
3. **Human-in-the-Loop** - programista zachowuje kontrolę i odpowiedzialność
4. **AI-friendly projekty** - struktura, typy, testy, konwencje ułatwiają współpracę
5. **Właściwe narzędzia** - dopasowane do typu zadania (IDE vs CLI vs Agent)
6. **Ciągłe doskonalenie** - monitoruj co działa, poprawiaj workflow

**Pamiętaj:** Cel to nie zastąpienie programisty, ale **10x zwiększenie produktywności** przez inteligentne wykorzystanie AI jako wspierającego narzędzia.

---

## Wersjonowanie i aktualizacje

Ten przewodnik będzie aktualizowany wraz z:
- Nowymi modelami i narzędziami
- Evolucją best practices
- Feedbackiem z community
- Nowymi lesson learned

**Źródła:**
- 10xDevs 2. edycja (moduły 0x-1x)
- Przeprogramowani Sites project instructions
- Community best practices

**Ostatnia aktualizacja:** 2025-11-07
