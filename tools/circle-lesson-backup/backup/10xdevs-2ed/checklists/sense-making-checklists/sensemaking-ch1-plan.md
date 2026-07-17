# Plan transformacji: Sense-Making Checklists Level 1

**Źródło:** `backup/10xdevs-2ed/checklists/effective-ai-guidelines/01-core-principles.md`
**Metodologia:** Sense-Making (Brenda Dervin) - Sytuacja → Luka → Pomoc
**Grupa docelowa:** Junior developers (0-2 lata doświadczenia)
**Priorytety:** Prompting & AI Workflows + Code Quality & Review
**Data utworzenia:** 2025-11-10
**Status:** Oczekiwanie na decyzje implementacyjne

---

## Executive Summary

### Problem
Materiał źródłowy `01-core-principles.md` (1599 linii) jest **świetnym comprehensive reference**, ale wymaga transformacji dla junior developerów. Główne bariery:

1. 🔴 **Przeciążenie informacyjne** - nie wiadomo od czego zacząć
2. 🔴 **Brak kontekstu biznesowego** - "dlaczego to jest ważne?"
3. 🔴 **Abstrakcyjne koncepty** - brak konkretnego wdrożenia
4. 🔴 **Fear-inducing anti-patterns** - paralysis analysis
5. 🔴 **Zbyt wiele technologii** - 4 języki programowania jednocześnie

### Rozwiązanie
Transformacja w **serię 5 standalone checklist** w formacie:
- ❌ Nie: "Co to jest X?" (definicje)
- ✅ Tak: "Kiedy użyć X i dlaczego?" (problem → rozwiązanie)

Każda checklist ma strukturę **Sense-Making**:
```
🎯 SYTUACJA: W jakim kontekście znajduje się użytkownik?
😤 LUKA: Jakie jest prawdziwe pytanie/frustracja?
✅ POMOC: Jaka informacja-most pomaga przeskoczyć lukę?
```

---

## Analiza materiału źródłowego

### Struktura dokumentu 01-core-principles.md

| Sekcja | Linie | Główne zagadnienia |
|--------|-------|-------------------|
| 1. Filozofia i podstawy | 29-46 | Spec-Driven vs Vibe Coding |
| 2. Ograniczenia LLM | 49-72 | Statyczne trenowanie, hallucinations, context window |
| 3. Human-in-the-Loop | 75-98 | 4 kluczowe zasady HITL workflow |
| 4. **Mistrzostwo w promptowaniu** | **101-453** | **8 zaawansowanych technik (352 linie!)** |
| 5. **Cechy projektów AI-friendly** | **455-1222** | **10 cech + przykłady w 4 językach (767 linii)** |
| 6. Best Practices & Anti-Patterns | 1225-1477 | 7 DO's + 8 DON'Ts |
| 7. Quick Reference Checklists | 1480-1586 | 10 gotowych checklist |
| 8. Cross-References | 1590-1595 | Linki do innych dokumentów |

**Statystyki:**
- Całkowita długość: 1599 linii
- Przykłady promptów: 25+ (good vs bad)
- Przykłady kodu: 50+ (TypeScript, Python, Go, Java)
- Anti-patterns: 8 dedykowanych sekcji
- Gotowe checklisty: 10

### Mocne strony materiału (do wykorzystania)

✅ **Świetna struktura** - jasny spis treści, logiczna progresja
✅ **Dużo przykładów** - good vs bad, konkretne code snippets
✅ **Praktyczne checklisty** - ready-to-use (np. pre-commit checklist)
✅ **Anti-patterns** - pokazuje co NIE robić
✅ **Cross-references** - wskazuje gdzie szukać więcej
✅ **Metadane** - wersjonowanie, maintenance schedule

### Bariery dla juniorów (do rozwiązania)

🔴 **Przeciążenie informacyjne**
- Dokument zakłada że użytkownik przeczyta wszystko
- Brak "ścieżki uczenia się" (beginner → intermediate → advanced)
- Junior nie wie od czego zacząć

🔴 **Brak kontekstu biznesowego**
- Zakłada znajomość: TDD, CI/CD, code review
- Nie wyjaśnia "dlaczego" te praktyki są ważne
- Brak connection do real-world consequences

🔴 **Abstrakcyjne koncepty**
- "Phased approach" - brak konkretnego przykładu projektu
- "Multiple models strategy" - nie wiadomo JAK wybierać
- "Document exploration" - brak template do użycia

🔴 **Zbyt wiele technologii naraz**
- Przykłady w 4 językach (TypeScript, Python, Go, Java)
- Junior może nie znać wszystkich
- Ryzyko confusion zamiast clarity

🔴 **Fear-inducing anti-patterns**
- 8 rzeczy których NIE robić
- Może wywołać paralysis analysis
- "Co jeśli popełnię błąd?" vs "Jak robić dobrze?"

🔴 **Brak progresji trudności**
- Wszystkie techniki na tym samym poziomie
- Nie ma oznaczenia "to dla zaawansowanych"
- Junior może próbować wszystkiego naraz

---

## Struktura wyjściowa: Seria checklist

### Architektura katalogów

```
utils/circle-lesson-backup/sense-making-checklists/
│
├── 00-START-HERE.md                    # Przewodnik: jak korzystać z checklist
│
├── level-1-essentials/                 # Dla juniorów (0-2 lata)
│   ├── 01-pierwszy-prompt.md          # "Nie wiem jak napisać prompt"
│   ├── 02-gdy-ai-gada-glupoty.md      # "AI mi coś zwróciło ale to wygląda podejrzanie"
│   ├── 03-czy-ten-kod-jest-ok.md      # "Kod działa ale nie wiem czy to dobry kod"
│   ├── 04-ai-zepsul-testy.md          # "AI zmienił kod i testy są czerwone"
│   └── 05-jak-zapisac-prace.md        # "Jak commitować kod stworzony z AI"
│
├── level-2-intermediate/
│   ├── 06-zaawansowane-promptowanie.md
│   └── 07-multiple-models.md
│
└── templates/                          # Szablony do skopiowania
    ├── prompt-template.md              # Gotowy szablon prompta (3C: Command+Context+Constraints)
    └── pre-commit-checklist.md         # Checklist do użycia przed commitem
```

### Format każdej checklisty

```markdown
# [Tytuł w formie problemu/pytania użytkownika]

## 🎯 Kiedy użyć tej checklisty?
[SYTUACJA - konkretny moment/zadanie w którym junior się znajduje]

## 😤 Typowe frustracje (to co czujesz w głowie)
[LUKA - prawdziwe pytania, wątpliwości, "WTF moments"]

## ✅ Checklist - Most do rozwiązania
[POMOC - konkretne kroki akcji, można odznaczać]
- [ ] Krok 1: ...
- [ ] Krok 2: ...
- [ ] Krok 3: ...

## 💡 Przykład real-world
[Mini case study - narrative albo before/after code]

## ⚠️ Red flags (kiedy STOP i przemyśl)
[Sygnały ostrzegawcze że coś idzie nie tak]
- 🚨 Signal 1: ...
- 🚨 Signal 2: ...

## 📚 Gdzie dowiedzieć się więcej?
[Link do sekcji w 01-core-principles.md dla "advanced reading"]
```


---

## Mapowanie: Źródło → Checklisty

| Checklist | Sekcje źródłowe (01-core-principles.md) | Linie | Transformacja |
|-----------|----------------------------------------|-------|---------------|
| **01-pierwszy-prompt** | § Anatomia prompta<br>§ Meta-promptowanie | 105-179<br>182-213 | Uprościć do wzoru 3C (Command+Context+Constraints). Usunąć zaawansowane techniki (meta-prompting, sokratejska). Dodać mini-tutorial "jak napisać pierwszy prompt". |
| **02-gdy-ai-gada-glupoty** | § Ograniczenia LLM (hallucinations)<br>§ Verify AI outputs<br>§ Anti-pattern: Accepting first answer | 49-72<br>1307-1316<br>1349-1366 | Transformować z "czym jest hallucination" → "jak rozpoznać i naprawić". Dodać 3-step verification checklist. Przykłady: halucynowane biblioteki, buggy code. |
| **03-czy-ten-kod-jest-ok** | § Pre-commit checklist<br>§ Semantyczne nazewnictwo<br>§ Single Responsibility<br>§ Best Practices | 1513-1525<br>647-732<br>551-598<br>1227-1342 | Wyciągnąć 5 najważniejszych punktów z 9-punktowej checklisty. Dodać before/after code examples. Skupić się na TypeScript (usunąć Python, Go, Java). Dodać "red flags" sekcję. |
| **04-ai-zepsul-testy** | § Testy automatyczne<br>§ Golden Rule (Green→Refactor→Green)<br>§ Regression tests<br>§ Anti-pattern: Ignore failing tests | 735-862<br>820-828<br>1336-1342<br>1381-1395 | Transformować w workflow (nie teorię): "co robić krok po kroku gdy testy czerwone". Dodać decision tree (kod broken vs test outdated). Przykład real-world refactor. |
| **05-jak-zapisac-prace** | § Git history<br>§ Conventional Commits<br>§ WIP commits w feature branches | 940-1005<br>962-999<br>1000-1005 | Dodać interactive staging tutorial (`git add -p`). Szablon commit message. Strategia dzielenia dużych zmian na małe commity. Jak unstage niepotrzebne zmiany. |

---

## Filozofia transformacji: Z czego rezygnujemy, co dodajemy

### ❌ Z CZEGO REZYGNUJEMY (dla juniorów)

1. **Przykłady w wielu językach**
   - Źródło: TypeScript, Python, Go, Java
   - Checklisty: Tylko TypeScript
   - Powód: Junior prawdopodobnie pracuje w 1-2 językach, reszta to cognitive overload

2. **Zaawansowane techniki promptowania**
   - Źródło: 8 technik (meta-prompting, sokratejska, multiple perspectives, etc.)
   - Checklisty: 3C (Command+Context+Constraints) + verification
   - Powód: Juniorzy potrzebują najpierw opanować podstawy

3. **Teoretyczne wyjaśnienia LLM**
   - Źródło: "Statyczne trenowanie", "Context window 25-50% capacity"
   - Checklisty: Praktyczne konsekwencje ("AI nie zna twojego projektu", "Wklejaj mało kodu naraz")
   - Powód: Juniorzy potrzebują "jak użyć", nie "jak działa pod spodem"

4. **Architektura patterns na poziomie systemu**
   - Źródło: "Convention over Configuration", "Popularny stack"
   - Checklisty: Pominięte (to decyzje seniora/architekta)
   - Powód: Juniorzy zazwyczaj dostają projekt z gotową architekturą

5. **Multiple models strategy**
   - Źródło: "Używaj różnych modeli do różnych zadań"
   - Checklisty: Pominięte
   - Powód: Juniorzy zazwyczaj mają dostęp do 1 modelu (np. GitHub Copilot)

### ✅ CO DODAJEMY (dla juniorów)

1. **Real-world scenarios (narrative)**
   - "Junior Kasia tworzy formularz..."
   - "Tomek dostał error X i nie wie co robić..."
   - Powód: Łatwiej zidentyfikować się z problemem

2. **Emotional support & validation**
   - "Normalne że nie rozumiesz wszystkiego"
   - "Wszyscy czasem dostają halucynacje od AI"
   - Powód: Redukcja impostor syndrome, zwiększenie confidence

3. **Red flags (warning signals)**
   - 🚨 "STOP jeśli widzisz X"
   - 🚨 "NIGDY NIE rób Y"
   - Powód: Prevencja częstych błędów (proaktywne ostrzeżenia)

4. **Before/After code examples**
   - Pokazuje konkretną transformację
   - Highlightuje różnice (❌ vs ✅)
   - Powód: Learning by comparison działa lepiej niż abstrakcje

5. **Quick wins & progressive difficulty**
   - Checklisty numerowane 01→05
   - Każda kolejna zakłada wiedzę z poprzedniej
   - Powód: Małe sukcesy budują momentum

6. **Decision trees / workflows**
   - "Jeśli X → zrób A, jeśli Y → zrób B"
   - Flowchart dla "kod broken vs test outdated"
   - Powód: Juniorzy potrzebują guidance w decision making

7. **Interactive elements**
   - `- [ ]` Checkboxy do odznaczania (GitHub markdown)
   - Self-assessment: "Czy czujesz się komfortowo z X?"
   - Powód: Active learning > passive reading

8. **Templates do skopiowania**
   - Szablon prompta (3C)
   - Szablon commit message
   - Pre-commit checklist (do IDE)
   - Powód: "Copy-paste and adapt" jest szybsze niż "twórz od zera"

---

## Decyzje do podjęcia przed realizacją

Proces tworzenia checklist ujawnił **10 kluczowych punktów decyzyjnych**, które wymagają Twojej analizy przed implementacją:

### 🔴 KRYTYCZNE (bezpośredni wpływ na użyteczność)

#### **Decyzja 1: Liczba checklist w Level 1**
**Obecny plan:** 5 checklist
**Rozważenia:**
- ✅ Za: 5 to manageable number (można przeczytać w 1-2 dni)
- ❌ Przeciw: Może za mało? (np. brak "debugging z AI", "AI nie rozumie wymagań")
- 🤔 Alternatywy:
  - 3 checklisty (tylko must-have: pierwszy prompt, weryfikacja, commit strategy)
  - 7 checklist (dodać: debugging, security, performance)

**Pytanie do Ciebie:**
Czy 5 checklist to OK, czy chcesz więcej/mniej?
5 checklist, ale uwzględnij "AI nie rozumie wymagań"
Jeśli więcej - jakie tematy dodać?
"AI nie rozumie wymagań"

---

#### **Decyzja 2: Długość pojedynczej checklisty**
**Obecny plan:** ~300-400 linii (jak powyższe outline)
**Rozważenia:**
- ✅ Za: Comprehensive, wszystkie edge cases covered
- ❌ Przeciw: Junior może się zniechęcić długim documentem
- 🤔 Alternatywy:
  - 100-150 linii (bare minimum, tylko bullets)
  - 200-250 linii (sweet spot?)
  - 400+ linii (bardzo szczegółowe z wieloma przykładami)

**Pytanie do Ciebie:**
Wolisz krótsze checklisty (łatwiejsze do przeskanowania) czy dłuższe (więcej przykładów)?
400-600 linii.

---

#### **Decyzja 3: Format przykładów kodu - narrative vs snippets**
**Obecny plan:** Mieszany (narrative dla context + code snippets)
**Przykład narrative:**
```
"Junior Kasia tworzy formularz. AI wygenerowało kod ale..."
[Story-based, relatable]
```

**Przykład pure snippets:**
```
❌ Bad:
[kod]

✅ Good:
[kod]

Why: [explanation]
```

**Rozważenia:**
- Narrative: Bardziej engaging, łatwiejsze utożsamienie
- Snippets: Szybsze, bardziej technical, mniej "fluffy"

**Pytanie do Ciebie:**
Jaki balans narrative/snippets? (np. 70% snippets + 30% narrative?)
70% snippets + 30% narrative?

---

### 🟡 WAŻNE (wpływ na maintenance i skalowanie)

#### **Decyzja 4: Struktura katalogów - naming convention**
**Obecny plan:**
```
level-1-essentials/
level-2-intermediate/
templates/
```

**Alternatywy:**
- `01-basics/`, `02-intermediate/`, `03-advanced/`
- `junior-track/`, `mid-track/`, `senior-track/`
- `essentials/`, `mastery/`, `expert/`

**Pytanie do Ciebie:**
Wolisz nazwy opisowe ("essentials") czy numeryczne ("01-basics")?
junior-track/ a potem 01-basics/, 02-intermediate/, 03-advanced/

---

#### **Decyzja 5: Cross-references do źródła**
**Opcje:**
- A) Linkować do 01-core-principles.md dla "advanced reading"
  - ✅ Za: Juniorzy mogą pogłębić wiedzę
  - ❌ Przeciw: Może ich overwhelm wrócić do 1599-liniowego dokumentu

- B) Nie linkować, checklisty są self-contained
  - ✅ Za: Standalone, no dependencies
  - ❌ Przeciw: Brak ścieżki do advanced material

**Pytanie do Ciebie:**
Czy dodawać cross-references?
Tak.

---

#### **Decyzja 6: Maintenance strategy**
**Pytanie:**
Gdy 01-core-principles.md się zmieni, jak synchronizować checklisty?

**Opcje:**
- Manual sync (review co release)
- Automated checks (CI sprawdza czy source się zmienił)
- Versioning (checklisty mają wersję związaną ze source)

Nie zajmujmy się tym teraz.
---

### 🟢 NICE-TO-HAVE (enhancement, nie blocker)

#### **Decyzja 7: Interaktywność**
**Czy dodać:**
- [ ] GitHub-flavored markdown checkboxy (`- [ ]`) - można odznaczać?
- [ ] Quizy na końcu checklist ("Sprawdź się")?
- [ ] Self-assessment ("Oceń swoją pewność 1-5")?

**Pytanie do Ciebie:**
Które elementy interaktywne dodać (jeśli w ogóle)?
Markdown checkboxy
---

#### **Decyzja 8: Templates katalog - co zawrzeć?**
**Obecny plan:**
```
templates/
├── prompt-template.md
└── pre-commit-checklist.md
```

**Potencjalnie dodać:**
- `commit-message-template.txt` (do ustawienia w git config)
- `debugging-template.md` (szablon zgłaszania błędu do AI)
- `code-review-checklist.md` (dla self-review przed PR)

**Pytanie do Ciebie:**
Jakie templates będą najbardziej użyteczne?
prompt-template, pre-commit-checklist.md, code-review-checklist.md
---

#### **Decyzja 9: Język przykładów - tylko TypeScript czy więcej?**
**Obecny plan:** Tylko TypeScript (dla spójności)
**Rozważenia:**
- ✅ Za TS-only: Consistency, mniej cognitive load
- ❌ Przeciw: Co jeśli junior pracuje w Python?
- 🤔 Alternatywa: 80% TypeScript + 20% "universal patterns" (działa w każdym języku)

**Pytanie do Ciebie:**
Strict TypeScript czy language-agnostic gdzie można?
80% TypeScript + 20% "universal patterns" (działa w każdym języku)
---

#### **Decyzja 10: Glossary & FAQ**
**Czy dodać plik:**
- `00-GLOSSARY.md` - definicje terminów (prompt, hallucination, context window, etc.)
- `00-FAQ.md` - często zadawane pytania

**Rozważenia:**
- ✅ Za: Juniorzy nie będą się gubić w terminologii
- ❌ Przeciw: Jeszcze jeden plik do utrzymania

**Pytanie do Ciebie:**
Czy potrzebny glossary/FAQ?
Tak
---

## Next Steps (po decyzjach)

### Workflow realizacji:

```
1. ✅ DONE: Analiza źródła (agent wykonał)
2. ✅ DONE: Plan transformacji (ten dokument)
3. ⏳ PENDING: Decyzje użytkownika (10 powyższych)
4. ⏳ TODO: Finalizacja specyfikacji (na podstawie decyzji)
5. ⏳ TODO: Implementacja checklist 01-05
6. ⏳ TODO: Stworzenie 00-START-HERE.md
7. ⏳ TODO: Przygotowanie templates/
8. ⏳ TODO: Review & testing (czy checklisty są użyteczne?)
```

### Szacowany czas implementacji (po decyzjach):

- Pojedyncza checklist: ~1-2h pisania + review
- 5 checklist: ~8-10h
- 00-START-HERE.md: ~1h
- Templates: ~30min
- **Total:** ~10-12h pracy

---

## Podsumowanie

### Kluczowe insights z analizy:

1. **Materiał źródłowy jest świetny** - bogaty w przykłady, dobrze ustrukturyzowany
2. **Główna bariera:** Przeciążenie informacyjne dla juniorów
3. **Rozwiązanie:** Transformacja w bite-sized, problem-focused checklisty
4. **Metodologia Sense-Making** idealnie pasuje do tego use case

### Co sprawia że ten plan jest dobry:

✅ Bazuje na konkretnej analizie materiału (nie assumptions)
✅ Adresuje prawdziwe frustracje juniorów (zidentyfikowane w analizie)
✅ Progresywna trudność (01→05)
✅ Praktyczne, actionable (checkboxy do odznaczania)
✅ Real-world examples (relatable scenarios)
✅ Red flags (proactive warnings)

### Potential risks:

⚠️ Może być za dużo tekstu (nawet dla checklist) - monitoring feedback
⚠️ TypeScript-only może wykluczyć część juniorów - rozważyć multi-language
⚠️ Maintenance burden - trzeba będzie syncować ze źródłem gdy się zmieni

---

## Akcje wymagane od Ciebie

Proszę przeanalizuj **10 decyzji powyżej** i daj feedback:

1. Liczba checklist (3, 5, 7?)
2. Długość pojedynczej (100-150, 200-250, 400+ linii?)
3. Format przykładów (narrative vs snippets ratio?)
4. Naming convention katalogów
5. Cross-references do źródła?
6. Maintenance strategy
7. Interaktywność (checkboxy, quizy?)
8. Jakie templates w templates/?
9. TypeScript-only czy multi-language?
10. Glossary/FAQ potrzebne?

**Po Twoim feedbackzie** mogę finalizować spec i zacząć implementację checklist.

---

**Metadata tego pliku:**
- Autor: Claude (Sonnet 4.5)
- Data: 2025-11-10
- Metodologia: Sense-Making (Brenda Dervin)
- Status: Draft - oczekiwanie na decyzje
- Wersja: 1.0
