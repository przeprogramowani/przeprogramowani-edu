---
title: "AI Development: Core Principles & Techniques"
version: 2.0
last_updated: 2025-11
maintenance_schedule: Annual
target_audience: All developers working with AI
language: Polish
universality: High (technology-agnostic)
---

# AI Development: Core Principles & Techniques

> **Uniwersalny przewodnik niezależny od technologii** | Wersja 2.0 | Ostatnia aktualizacja: 2025-11

Ten dokument zawiera fundamentalne zasady i techniki pracy z AI w rozwoju oprogramowania, niezależne od konkretnych narzędzi czy frameworków. Skupia się na ponadczasowych konceptach, które pozostaną aktualne niezależnie od zmian w ekosystemie AI.

## 📋 Spis treści

1. [Filozofia i podstawy](#filozofia-i-podstawy)
2. [Fundamentalne ograniczenia LLM-ów](#fundamentalne-ograniczenia-llm-ów)
3. [Filozofia Human-in-the-Loop](#filozofia-human-in-the-loop-hitl)
4. [Mistrzostwo w promptowaniu](#mistrzostwo-w-promptowaniu)
5. [Cechy projektów przyjaznych dla AI](#cechy-projektów-przyjaznych-dla-ai)
6. [Best Practices & Anti-Patterns](#best-practices--anti-patterns)
7. [Quick Reference Checklist](#quick-reference-checklist)

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

---

## Fundamentalne ograniczenia LLM-ów

Zrozumienie ograniczeń modeli językowych jest kluczowe dla efektywnej pracy:

### 1. Statyczne trenowanie
- Modele są trenowane na zamkniętych zbiorach danych
- Nie uczą się po zakończeniu treningu
- **Rozwiązanie:** In-context learning - dostarczaj aktualny kontekst w każdej konwersacji

### 2. Statystyka, nie logika
- Odpowiedzi oparte na prawdopodobieństwie statystycznym, nie logicznym wnioskowaniu
- Ryzyko halucynacji - model generuje prawdopodobnie brzmiące, ale nieprawdziwe informacje
- Ograniczona innowacyjność - powielanie wzorców z danych treningowych
- **Rozwiązanie:** Zawsze weryfikuj krytyczne decyzje, szczególnie w domenie biznesowej

### 3. Ograniczone okno kontekstu
- Modele mają limity tokenów przetwarzanych w jednej konwersacji
- Rzeczywista użyteczna pojemność to często 25-50% reklamowanego limitu
- Długie konwersacje prowadzą do "zapominania" wcześniejszego kontekstu
- **Rozwiązanie:**
  - Używaj zwięzłych promptów
  - Dziel duże zadania na mniejsze sesje
  - Podsumowuj kluczowe ustalenia przed przejściem dalej

---

## Filozofia Human-in-the-Loop (HITL)

**Kluczowe zasady:**

### 1. AI nie pisze kodu produkcyjnego samodzielnie
- Każdy fragment kodu wymaga ludzkiej weryfikacji
- Code review AI-generowanego kodu jest obowiązkowy

### 2. Programista pozostaje niezbędny na każdym etapie
- Definiowanie wymagań
- Weryfikacja poprawności rozwiązania
- Testowanie edge case'ów
- Ocena jakości i maintainability

### 3. Efektywne zarządzanie autonomicznymi narzędziami
- Ustaw jasne guardrails (limity, obszary działania)
- Monitoruj działanie agentów
- Zatrzymuj nieproduktywne iteracje

### 4. Pełna odpowiedzialność za committowany kod
- Nawet jeśli kod wygenerował AI, ty go zatwierdzasz
- Zrozum co robi kod przed zmergowaniem
- W razie problemów, ty odpowiadasz przed zespołem

---

## Mistrzostwo w promptowaniu

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
- Referencje do plików (używając mechanizmu referencji dostępnego w twoim narzędziu)
- Historia zmian (git log, poprzednie próby)
- Ograniczenia (wydajność, kompatybilność)
- Domena biznesowa (e-commerce, fintech, edtech)

**Przykład:**
```
Stack: Nowoczesny framework frontend, system typów, biblioteka do zarządzania stanem, baza danych
File: Odwołanie do src/components/ProductList
Problem: Komponent re-renderuje się przy każdej zmianie filtra
Constraint: Musimy wspierać starsze przeglądarki
Business: Sklep e-commerce z 10k produktami
```

#### 3. **Format (Struktura wyjścia)**
Określ jak ma wyglądać rezultat.

**Przykłady:**
```
Format: JSON z polami {name, type, required}
Format: Markdown tabela z kolumnami: Feature | Pros | Cons | Cost
Format: Interface z komentarzami dokumentacyjnymi
Format: Step-by-step plan numerowany 1-10
Format: Diagram sekwencji w notacji Mermaid
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
- Gdy model zna konwencje (komponenty UI, REST API)

---

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
✅ Po: "Zrefaktoruj komponent ProductCard (odwołując się do odpowiedniego pliku)
       aby używał memoizacji i unikał re-renderów przy zmianie globalnego
       filtra. Zachowaj istniejące propsy i style."
```

---

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
3. Czy dark mode ma być zapisywany lokalnie czy w preferencjach użytkownika?
4. Czy wszystkie komponenty muszą wspierać dark mode czy tylko główne?
5. Czy macie design system colors czy mam zaproponować paletę?
6. Czy planujecie system theme oprócz dark/light?"

[Te pytania mogą ujawnić, że masz już partial implementation
lub że potrzebujesz więcej niż dark/light toggle]
```

---

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
1. WebSockets - Full duplex, najlepszy UX, wymaga infrastruktury
2. Server-Sent Events - Prostsza implementacja, jednokierunkowy
3. Polling - Najprostszy, większy load na server
4. Push API (PWA) - Działa w tle, wymaga service worker
5. Third-party service - Szybki start, koszty zewnętrzne

Możesz odkryć rozwiązania, o których nie pomyślałeś!
```

---

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

---

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

---

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

**W narzędziach AI:** Niektóre narzędzia oferują tryb planowania - wykorzystaj go. W innych, explicite poproś o plan przed implementacją.

---

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

---

### Szablon nauki nowych konceptów

Gdy chcesz się czegoś nauczyć, użyj strukturyzowanego szablonu:

```
Jesteś doświadczonym {{Role}} - pomóż mi zrozumieć nowy temat.

**Mój poziom wiedzy:**
{{advanced}} w {{technologie, które znasz}}.

**Moje doświadczenie:**
{{X lat}} doświadczenia z {{konkretne technologie i narzędzia}}.

**Cel nauki:**
Zrozumieć {{nowa technologia}} aby {{konkretny cel}}.

**Obecny blocker:**
{{Konkretny problem, który cię blokuje}}.

**Jak chcę się uczyć:**
Wyjaśnij krok po kroku od {{poziom początkowy}} do {{poziom docelowy}}.
Uczę się najlepiej przez {{preferowany styl: wizualizacje, praktyka, teoria}}.
Preferuję {{długość i format: krótkie instrukcje, szczegółowe wyjaśnienia}}.

**Poproś o clarifications jeśli czegoś nie rozumiesz w moim kontekście.**
```

**Dlaczego to działa:**
- Explicit level calibration - AI dostosuje complexity
- Konkretny cel uczenia się
- Wskazany blocker - fokus na tym co boli
- Preferowany styl nauki
- Wykorzystanie istniejącej wiedzy (analogie)

---

## Cechy projektów przyjaznych dla AI

Niektóre praktyki projektowe znacząco ułatwiają współpracę z AI. Oto uniwersalne zasady, które działają niezależnie od technologii.

### 1. Jawne typowanie i spójne modele danych

**Dlaczego:**
- Jawne kontrakty ułatwiają dopasowanie różnych elementów
- AI-autocomplete działa lepiej z explicit types
- Generowany kod jest bardziej spójny
- Testy łatwiejsze do napisania

**Przykłady w różnych językach:**

```typescript
// TypeScript
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
```

```python
# Python
from typing import TypedDict, Literal, Optional
from datetime import datetime

class UserPreferences(TypedDict):
    theme: Literal['light', 'dark']
    language: Literal['pl', 'en']
    notifications: bool

class UserProfile(TypedDict):
    id: str
    email: str
    displayName: str
    avatar: Optional[str]
    createdAt: datetime
    preferences: UserPreferences
```

```go
// Go
type UserPreferences struct {
    Theme         string // "light" or "dark"
    Language      string // "pl" or "en"
    Notifications bool
}

type UserProfile struct {
    ID          string
    Email       string
    DisplayName string
    Avatar      *string  // Optional
    CreatedAt   time.Time
    Preferences UserPreferences
}
```

```java
// Java
public class UserPreferences {
    private String theme; // "light" or "dark"
    private String language; // "pl" or "en"
    private boolean notifications;
}

public class UserProfile {
    private String id;
    private String email;
    private String displayName;
    private Optional<String> avatar;
    private LocalDateTime createdAt;
    private UserPreferences preferences;
}
```

**Praktyczne wnioski:**
- ✅ Używaj systemów typów w trybie strict (jeśli dostępny)
- ✅ Definiuj interfaces/types dla wszystkich struktur danych
- ✅ Używaj bibliotek do walidacji (Zod, Pydantic, Bean Validation)
- ✅ Dokumentuj typy z komentarzami
- ❌ Unikaj dynamicznych typów bez dobrego powodu

---

### 2. Pliki i moduły jednego przeznaczenia (SRP)

**Single Responsibility Principle** w erze AI zyskuje nowe znaczenie.

**Dlaczego:**
- AI łatwiej zrozumie cel pliku/funkcji
- Mniej context pollution (1 plik = 1 problem)
- Łatwiejsze referencje (konkretny problem w konkretnym pliku)
- Lepsze suggested edits (AI wie co może zmienić)

**Przykład:**

```
❌ ŹLE - jeden plik robi wszystko:
src/components/Dashboard (800 linii)
- Layout główny
- Profil użytkownika
- Feed aktywności
- Powiadomienia
- Ustawienia modal
- API calls
- State management

✅ DOBRZE - wyspecjalizowane moduły:
src/components/dashboard/
  DashboardLayout (50 linii - layout only)
  UserProfile (60 linii - profile display)
  ActivityFeed (80 linii - feed logic)
  NotificationsBell (40 linii - notifications)
src/features/dashboard/
  useActivityFeed (hook - data fetching)
  useDashboardSettings (hook - settings state)
src/api/dashboard (API calls only)
```

**Korzyści dla AI:**
- Prompt: "W pliku UserProfile dodaj avatar upload"
  - AI dostaje tylko relevant code
  - Wie że ma focus na UserProfile
  - Nie grzebię w logice ActivityFeed

**Praktyczne wnioski:**
- ✅ Jeden komponent = jeden plik
- ✅ Jedna funkcja = jedno zadanie
- ✅ Wydziel reusable logic (hooks, utilities, helpers)
- ✅ Separate concerns: UI, logic, data fetching
- ❌ Nie twórz "God objects" lub "Util hell"

---

### 3. Konwencje nad konfiguracją

**Convention over Configuration** - przewidywalna struktura ułatwia AI nawigację.

**Dlaczego:**
- AI natychmiast rozumie gdzie co jest
- Brak potrzeby długich wyjaśnień struktury
- Konsystencja = łatwiejsze generowanie

**Przykłady frameworków z konwencjami:**

**Framework z file-based routing:**
```
app/
  page → homepage
  about/page → /about route
  api/users/route → /api/users endpoint
```

AI wie: "chcesz nowy endpoint → stwórz app/api/{name}/route"

**Framework z page-based routing:**
```
src/pages/
  index → /
  about → /about
  blog/[slug] → dynamic route
```

**MVC Framework:**
```
app/
  models/ → Data models
  controllers/ → Request handlers
  views/ → Templates
```

**Praktyczne wnioski:**
- ✅ Wybieraj frameworki z silnymi konwencjami
- ✅ Stosuj established patterns (Repository, Service, Controller)
- ✅ Dokumentuj swoje konwencje jeśli custom
- ❌ Unikaj "clever" niestandardowych struktur bez dobrego powodu

---

### 4. Semantyczne nazewnictwo

**Nazwy tworzą kontekst domeny.**

**Dlaczego:**
- AI rozumie terminologię branżową
- Generuje kod zgodny z domeną
- Mniej potrzeby tłumaczenia intencji

**Przykłady w różnych językach:**

```typescript
// TypeScript
// ❌ Generic, niejasne
function calc(a: number, b: number): number { ... }
function process(data: any): any { ... }
class Manager { ... }

// ✅ Semantyczne, jasne
function calculateMonthlyPayment(principal: number, interestRate: number): number { ... }
function processPaymentTransaction(transaction: PaymentTransaction): PaymentResult { ... }
class SubscriptionManager { ... }
```

```python
# Python
# ❌ Generic, niejasne
def calc(a, b):
    pass

def process(data):
    pass

# ✅ Semantyczne, jasne
def calculate_monthly_payment(principal: float, interest_rate: float) -> float:
    pass

def process_payment_transaction(transaction: PaymentTransaction) -> PaymentResult:
    pass
```

```go
// Go
// ❌ Generic, niejasne
func Calc(a, b float64) float64 { ... }
func Process(data interface{}) interface{} { ... }

// ✅ Semantyczne, jasne
func CalculateMonthlyPayment(principal, interestRate float64) float64 { ... }
func ProcessPaymentTransaction(tx PaymentTransaction) PaymentResult { ... }
```

```java
// Java
// ❌ Generic, niejasne
public double calc(double a, double b) { ... }
public Object process(Object data) { ... }

// ✅ Semantyczne, jasne
public double calculateMonthlyPayment(double principal, double interestRate) { ... }
public PaymentResult processPaymentTransaction(PaymentTransaction transaction) { ... }
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

---

### 5. Testy automatyczne

**Testy = żywa dokumentacja + feedback loop dla AI.**

**Dlaczego:**
- Opisują zachowanie systemu jednoznacznie
- AI może uruchamiać i iterować
- Wykrywają edge cases i regressje
- Feedback loop: generate → test → fix → test

**Przykład w różnych językach:**

```typescript
// TypeScript (Vitest/Jest)
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

```python
# Python (pytest)
def test_applies_discount_for_regular_customers():
    result = calculate_discount(100, 'regular')
    assert result == 90

def test_applies_discount_for_premium_customers():
    result = calculate_discount(100, 'premium')
    assert result == 80

def test_applies_no_discount_for_guests():
    result = calculate_discount(100, 'guest')
    assert result == 100

def test_throws_error_for_negative_amounts():
    with pytest.raises(ValueError, match='Amount must be positive'):
        calculate_discount(-100, 'regular')
```

```go
// Go (testing package)
func TestCalculateDiscount(t *testing.T) {
    tests := []struct {
        name     string
        amount   float64
        tier     string
        expected float64
        wantErr  bool
    }{
        {"regular customer", 100, "regular", 90, false},
        {"premium customer", 100, "premium", 80, false},
        {"guest", 100, "guest", 100, false},
        {"negative amount", -100, "regular", 0, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := CalculateDiscount(tt.amount, tt.tier)
            if tt.wantErr && err == nil {
                t.Error("expected error but got none")
            }
            if !tt.wantErr && result != tt.expected {
                t.Errorf("got %v, want %v", result, tt.expected)
            }
        })
    }
}
```

```java
// Java (JUnit)
class DiscountCalculatorTest {
    @Test
    void appliesDiscountForRegularCustomers() {
        double result = calculateDiscount(100, "regular");
        assertEquals(90, result);
    }

    @Test
    void appliesDiscountForPremiumCustomers() {
        double result = calculateDiscount(100, "premium");
        assertEquals(80, result);
    }

    @Test
    void appliesNoDiscountForGuests() {
        double result = calculateDiscount(100, "guest");
        assertEquals(100, result);
    }

    @Test
    void throwsErrorForNegativeAmounts() {
        assertThrows(IllegalArgumentException.class,
            () -> calculateDiscount(-100, "regular"));
    }
}
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

---

### 6. Formattery, lintery i statyczna analiza kodu

**Instant feedback loop dla AI.**

**Dlaczego:**
- AI dostaje concrete error messages
- Może auto-naprawiać w kolejnych iteracjach
- Redukuje manual corrections

**Setup w różnych językach:**

```json
// JavaScript/TypeScript
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

```python
# Python (pyproject.toml)
[tool.ruff]
line-length = 100
select = ["E", "F", "I"]

[tool.black]
line-length = 100
```

```yaml
# Go (.golangci.yml)
linters:
  enable:
    - gofmt
    - govet
    - staticcheck
    - errcheck
```

```xml
<!-- Java (Maven pom.xml) -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>3.3.0</version>
</plugin>
```

**AI workflow z linterem:**

```
1. AI generuje kod
2. Uruchamia lint/format check
3. Linter zwraca błędy
4. AI rozumie problem
5. Naprawia
6. Uruchamia ponownie
7. Pass ✅
```

**Praktyczne wnioski:**
- ✅ ESLint + Prettier (JavaScript/TypeScript)
- ✅ Ruff, Black (Python)
- ✅ gofmt, golangci-lint (Go)
- ✅ Checkstyle, SpotBugs (Java)
- ✅ Pre-commit hooks - wymusza quality
- ✅ CI checks - nie merguj bez pass
- ❌ Nie wyłączaj rules bez dobrego powodu

---

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
fix bug
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
git log -p --follow -- src/auth/login
```

**Praktyczne wnioski:**
- ✅ Używaj Conventional Commits
- ✅ Descriptive messages (dlaczego, nie tylko co)
- ✅ Atomic commits (jeden concern = jeden commit)
- ✅ Linkuj do issues/tickets
- ❌ Nie commituj wszystkiego na raz
- ❌ "WIP" commits tylko w feature branches

---

### 8. Komentarze kontekstowe

**Komentarze wyjaśniają "dlaczego", nie "co".**

**Dlaczego:**
- Edge cases nie widoczne w kodzie
- Biznesowa logika nie oczywista
- Temporary workarounds z wyjaśnieniem
- Integracje z quirkami zewnętrznych API

**Przykłady dobrych komentarzy w różnych językach:**

```typescript
// TypeScript
// ✅ Wyjaśnia edge case
// We check subscription status before allowing export because free users
// are limited to 10 exports per month (business rule from 2024-02)
if (!hasActiveSubscription(user) && user.exportCount >= 10) {
  throw new Error('Export limit reached');
}

// ✅ Wyjaśnia nieoczywiste
// Safari has a bug where Date.parse() fails for ISO strings with timezone
// See: https://bugs.webkit.org/show_bug.cgi?id=123456
// Workaround: manually parse using date library
const date = parseISOString(isoString);
```

```python
# Python
# ✅ Wyjaśnia constraint zewnętrzny
# Payment API requires amount in cents (integer), not dollars (float)
amount_in_cents = int(round(amount_in_dollars * 100))

# ✅ Wyjaśnia tymczasowe rozwiązanie
# TODO: This is a temporary fix for the race condition in user auth
# Proper solution tracked in #456. Remove this sleep when fixed.
time.sleep(0.1)
```

```go
// Go
// ✅ Wyjaśnia biznesową logikę
// Orders over $1000 require manual approval per company policy
// established in Q3 2024 due to fraud prevention
if order.Total > 1000.0 {
    return requiresManualApproval(order)
}
```

```java
// Java
// ✅ Wyjaśnia quirk platformy
// Oracle JDBC driver requires explicit timezone conversion
// for DATE fields. PostgreSQL handles this automatically.
Timestamp ts = new Timestamp(date.getTime());
```

**Złe przykłady (niezależne od języka):**

```
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

---

### 9. Popularny stack technologiczny

**AI działa lepiej z popularniejszymi technologiami.**

**Dlaczego:**
- Więcej przykładów w danych treningowych
- AI widział miliony projektów w danym stacku
- Lepsze rozumienie patterns i best practices
- Mniej halucynacji

**Popularne stacki (dobre dla AI):**

**Frontend:**
- ✅ Biblioteki komponentowe z dużą społecznością
- ✅ Frameworki z silnymi konwencjami i routingiem
- ✅ Meta-frameworki dla full-stack development

**Backend:**
- ✅ Popularne frameworki webowe (Express-like, Django-like, Spring-like)
- ✅ REST i GraphQL frameworks
- ✅ ORM/query builders z szerokim użyciem

**Databases:**
- ✅ PostgreSQL, MySQL (relacyjne)
- ✅ MongoDB (dokumentowe)
- ✅ Redis (cache/key-value)

**Testing:**
- ✅ Popularne frameworki testowe dla twojego języka
- ✅ E2E frameworks z dużą społecznością

**Nisze/custom stacki:**
- ⚠️ AI ma mniej przykładów
- ⚠️ Może halucynować API
- ⚠️ Potrzebujesz dostarczyć więcej dokumentacji
- ⚠️ Musisz explicitly wskazać patterns

**Nie oznacza:** "nie używaj niszowych technologii"
**Oznacza:** "bądź świadomy że potrzebujesz więcej guidance dla AI"

**Praktyczne wnioski:**
- ✅ Dla nowych projektów: rozważ popularny stack (jeśli nie ma contra-indications)
- ✅ Dla niszowych: dostarcz comprehensive instrukcje i examples
- ✅ Dokumentuj custom patterns explicit
- ⚠️ Weryfikuj AI suggestions dokładniej w niszowych stackach

---

### 10. Instrukcje dla AI

**Nowoczesne narzędzia AI mają built-in konwencje definiowania instrukcji.**

**Pliki z instrukcjami (przykłady nazw):**

- Pliki konfiguracyjne specyficzne dla narzędzia (różne nazwy w zależności od narzędzia)
- `.github/copilot-instructions.md` - dla narzędzi z integracją GitHub
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
[Preferowane patterns, linter rules]

## Testing Requirements
[Jakie testy pisać, coverage minimum]

## DO's and DON'Ts
[Explicit rules: co robić, czego unikać]

## Examples
[Przykłady dobrych patterns z projektu]
```

**Przykład instrukcji projektowych:**

```markdown
# E-commerce Project Rules

## Stack
- Nowoczesny meta-framework z file-based routing
- System typów (strict mode)
- Baza danych: PostgreSQL z ORM
- Styling: Utility-first CSS framework
- Payment processing: Zewnętrzny provider

## Architecture
- Feature-based folders (src/features/{feature-name}/)
- Each feature: components/, hooks/, api/, types/
- Shared code in src/shared/

## Testing
- Unit testing framework dla business logic
- E2E framework dla user journeys
- Every feature must have tests
- Minimum coverage: 80%

## DO
✅ Use server-side rendering by default
✅ Client-side interactivity only when needed
✅ Validate forms with validation library
✅ API errors: throw, handle in error boundaries
✅ Async operations: use proper data fetching library

## DON'T
❌ No overly complex state management (keep it simple)
❌ No inline styles (use utility framework only)
❌ No dynamic types (use static typing)
❌ No console.log in production (use proper logging)

## Patterns
- Auth: use dedicated auth hook
- API calls: centralized API layer with proper abstractions
- Forms: use form library + validation schema
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
✅ Model do szybkiego kodowania dla codziennych zadań
✅ Model z reasoning capabilities dla planowania i complex logic
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
**Reason:** We need third-party logins and scalability.
**Trade-off:** Accepting higher initial complexity for long-term flexibility.
**Date:** 2024-11-07
**Participants:** Team members, AI assistant
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
- [ ] Error handling jest comprehensive
- [ ] Security: nie ma oczywistych luk (SQL injection, XSS, etc.)
- [ ] Performance: nie ma oczywistych bottlenecków
- [ ] Business logic: zgodna z requirements
- [ ] Code style: zgodny z projektem

#### 6. Combine traditional tools z AI
```
✅ AST-based refactoring dla structural changes
✅ Find-replace dla prostych zmian
✅ AI dla complex logic transformations
```

**Przykład:**
```bash
# Simple renaming: traditional tool (fast)
# Use find-replace or refactoring tools

# Refactor logic: AI (quality)
# Use AI assistant to refactor error handling patterns
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

---

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
❌ No privacy mode w narzędziu
```

**Problem:**
- Leakage sekretów do training data
- GDPR violations
- Security breach

**Fix:**
- ✅ Privacy mode enabled (jeśli dostępny)
- ✅ Ignoruj sensitive files w konfiguracji
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
- ✅ Użyj community rankings (real usage)
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

- [ ] **Privacy setup** - włącz privacy mode (jeśli dostępny), skonfiguruj ignore patterns
- [ ] **Project instructions** - instrukcje projektowe aktualne
- [ ] **Git clean** - working tree clean (łatwy rollback)
- [ ] **Tests green** - wszystkie testy przechodzą przed zmianami
- [ ] **Model selected** - wybrany odpowiedni model (koder vs architekt)

### 📝 Prompting Checklist

Przy tworzeniu prompta:

- [ ] **Command** - jasne polecenie z czasownikiem na początku
- [ ] **Context** - stack, pliki, constraints, domain
- [ ] **Format** - określony format output (JSON, markdown, code)
- [ ] **Specificity** - konkretne wymagania, nie ogólniki
- [ ] **Edge cases** - wymienione edge cases do obsłużenia

### 🔧 Implementation Checklist

Podczas implementacji:

- [ ] **Plan first** - stworzony i zreview'owany plan przed kodem
- [ ] **Incremental** - małe kroki z verification po każdym
- [ ] **Context references** - używane referencje do plików dla precyzji
- [ ] **Tests alongside** - testy generowane razem z kodem
- [ ] **Linting** - kod przechodzi lint/format checks

### ✅ Pre-commit Checklist

Przed commitowaniem AI-generated code:

- [ ] **Code review** - zrozumiałeś co robi kod
- [ ] **Tests pass** - wszystkie testy green (unit + integration)
- [ ] **Edge cases** - covered w kodzie i testach
- [ ] **Error handling** - comprehensive error handling
- [ ] **Security check** - brak oczywistych podatności
- [ ] **Lint pass** - linter/formatter pass
- [ ] **Type check** - type checker pass (jeśli używasz systemu typów)
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
| Szybkie inline edits | IDE z AI | Natychmiastowy feedback |
| Multi-file refactoring | CLI tool | Szerszy kontekst |
| Onboarding do repo | CLI tool | Exploration capabilities |
| Bug fix z testami | Async Agent | Autonomous iteration |
| Feature implementation | IDE w trybie planowania | Interactive refinement |
| Dependency update | Async Agent | Automated testing loop |
| Code review | CLI or Async Agent | Comprehensive analysis |
| Documentation | CLI | Broad repo understanding |

### 🧠 Model Selection Guide

Wybierz model według złożoności:

| Typ zadania | Model | Przykład |
|-------------|-------|----------|
| Quick generation | Szybki model | Generate component |
| Complex refactoring | Model z reasoning | Redesign architecture |
| Testing | Szybki model | Generate unit tests |
| Architecture planning | Model z reasoning | Design system architecture |
| Bug fixing | Szybki model | Fix type error |
| Performance optimization | Model z reasoning | Optimize queries |
| Code explanation | Szybki model | Explain function logic |
| Security analysis | Model z reasoning | Find vulnerabilities |

### 🛡️ Safety Checklist

Dla bezpiecznej pracy z AI:

- [ ] **No secrets in prompts** - używaj placeholders, nie prawdziwe keys
- [ ] **Privacy mode on** - w narzędziach (jeśli dostępne)
- [ ] **Sensitive files ignored** - .env, credentials w ignore patterns
- [ ] **Human review mandatory** - nigdy auto-merge bez review
- [ ] **Rollback plan** - git clean, łatwy revert
- [ ] **Audit logs** - track co AI zmienił (git log)

### 📊 Cost Optimization Checklist

Dla efektywnego wykorzystania budżetu:

- [ ] **Right model for task** - nie używaj reasoning dla prostych zadań
- [ ] **Language choice conscious** - świadomość kosztów różnych języków
- [ ] **Minimal context** - tylko relevant files, nie cała baza kodu jeśli niepotrzebne
- [ ] **Reusable prompts** - custom commands dla frequent tasks
- [ ] **Iteration limits** - max 3 tries, potem reset
- [ ] **Monitor usage** - track spending (credits, API usage)

---

## Cross-References

Dla szczegółowych workflow i narzędzi, zobacz: [02-workflows-patterns.md](./02-workflows-patterns.md)

Dla aktualnego przeglądu narzędzi, zobacz: [03-tools-landscape-2025q4.md](./03-tools-landscape-2025q4.md)

---

**Koniec dokumentu** | Wersja 2.0 | Uniwersalny przewodnik niezależny od technologii
