# 🚀 Start Here: Przewodnik po Sense-Making Checklists

**Witaj w serii checklist do efektywnej pracy z AI!**

Ten zbiór materiałów został stworzony specjalnie dla **junior developerów** (0-2 lata doświadczenia), którzy chcą nauczyć się efektywnie wykorzystywać AI w codziennej pracy programistycznej.

---

## 🎯 Dla kogo są te checklisty?

Te materiały są dla Ciebie, jeśli:
- ✅ Pracujesz jako junior developer (lub dopiero zaczynasz)
- ✅ Używasz AI tools (ChatGPT, GitHub Copilot, Claude, etc.) ale czujesz się niepewnie
- ✅ Dostajesz kod od AI, ale nie wiesz czy mu ufać
- ✅ Chcesz nauczyć się pisać lepsze prompty
- ✅ Martwisz się czy kod stworzony z AI jest "dobry"
- ✅ Nie wiesz jak commitować kod który AI Ci wygenerował

**Normalnie czujesz się przytłoczony?** To dobra wiadomość! Te checklisty powstały właśnie po to, żeby rozwiązać Twoje konkretne problemy.

---

## 📚 Jak korzystać z tego repozytorium?

### Struktura materiałów

```
sense-making-checklists/
│
├── 00-START-HERE.md              ← TEN PLIK (zacznij tutaj!)
├── 00-GLOSSARY.md                ← Słowniczek terminów AI/development
├── 00-FAQ.md                     ← Często zadawane pytania
│
├── junior-track/                 ← GŁÓWNE CHECKLISTY (przejdź przez nie po kolei)
│   ├── 01-pierwszy-prompt.md
│   ├── 02-ai-nie-rozumie-wymagan.md
│   ├── 03-gdy-ai-gada-glupoty.md
│   ├── 04-czy-ten-kod-jest-ok.md
│   ├── 05-ai-zepsul-testy.md
│   └── 06-jak-zapisac-prace.md
│
└── templates/                    ← SZABLONY DO SKOPIOWANIA
    ├── prompt-template.md
    ├── pre-commit-checklist.md
    └── code-review-checklist.md
```

---

## 🗺️ Ścieżka uczenia się (dla początkujących)

### Tydzień 1: Podstawy promptowania
1. **Przeczytaj:** `00-GLOSSARY.md` - poznaj podstawowe terminy
2. **Przejdź przez:** `01-pierwszy-prompt.md` - naucz się pisać dobre prompty
3. **Użyj:** `templates/prompt-template.md` - skopiuj szablon i zacznij używać

**Cel tygodnia:** Przestać pisać "fix this" i zacząć pisać precyzyjne prompty.

### Tydzień 2: Weryfikacja i jakość kodu
4. **Przejdź przez:** `02-ai-nie-rozumie-wymagan.md` - jak lepiej komunikować wymagania
5. **Przejdź przez:** `03-gdy-ai-gada-glupoty.md` - rozpoznawanie halucynacji
6. **Przejdź przez:** `04-czy-ten-kod-jest-ok.md` - ocena jakości kodu

**Cel tygodnia:** Nauczyć się krytycznie oceniać kod od AI.

### Tydzień 3: Workflow i best practices
7. **Przejdź przez:** `05-ai-zepsul-testy.md` - zarządzanie testami
8. **Przejdź przez:** `06-jak-zapisac-prace.md` - git workflow z AI
9. **Użyj:** `templates/pre-commit-checklist.md` i `code-review-checklist.md`

**Cel tygodnia:** Wypracować powtarzalny workflow pracy z AI.

---

## 🎨 Format każdej checklisty

Wszystkie checklisty mają spójną strukturę:

```markdown
# [Tytuł - Twój problem/pytanie]

## 🎯 Kiedy użyć tej checklisty?
[SYTUACJA - w jakiej się znajdujesz]

## 😤 Typowe frustracje
[LUKA - co czujesz, jakie masz wątpliwości]

## ✅ Checklist
[POMOC - konkretne kroki do wykonania]

## 💡 Przykład real-world
[Mini case study albo before/after code]

## ⚠️ Red flags
[Sygnały ostrzegawcze - kiedy STOP]

## 📚 Gdzie dowiedzieć się więcej?
[Linki do zaawansowanych materiałów]
```

Ta struktura nazywa się **Sense-Making** i pomaga Ci:
- Zidentyfikować kiedy użyć danej checklisty (🎯 Sytuacja)
- Zrozumieć że nie jesteś sam/a z problemem (😤 Frustracje)
- Dostać konkretne kroki akcji (✅ Checklist)

---

## 💡 Jak używać checklist w praktyce?

### Sposób 1: "Just-in-Time Learning"
**Kiedy:** Masz problem TERAZ i potrzebujesz szybkiej pomocy.

```
1. Przeczytaj sekcję "🎯 Kiedy użyć"
2. Jeśli pasuje - otwórz checklistę
3. Przejdź przez kroki ✅ Checklist
4. Zastosuj natychmiast
```

**Przykład:**
> AI zwrócił Ci kod ale używa biblioteki o której nigdy nie słyszałeś.
> → Otwórz `03-gdy-ai-gada-glupoty.md` i przejdź przez checklist weryfikacji.

---

### Sposób 2: "Systematic Learning"
**Kiedy:** Chcesz nauczyć się systematycznie (polecane!).

```
1. Przejdź przez checklisty po kolei (01 → 06)
2. Dla każdej:
   - Przeczytaj całość
   - Wypróbuj przykłady
   - Skopiuj szablony do swojego IDE
3. Wracaj do checklist gdy napotkasz problem
```

**Czas:** ~30-45 min na checklistę = ~4-5h total (można rozłożyć na 3 tygodnie).

---

### Sposób 3: "Templates First"
**Kiedy:** Wolisz najpierw dostać narzędzia, potem czytać teorię.

```
1. Idź do templates/
2. Skopiuj:
   - prompt-template.md → użyj przy następnym promptowaniu
   - pre-commit-checklist.md → dodaj do IDE jako snippet
   - code-review-checklist.md → użyj przed każdym PR
3. Gdy napotkasz problem, wróć do odpowiedniej checklisty
```

**Styl:** "Learning by doing" - najpierw praktyka, potem teoria.

---

## 🚨 Ważne: Czego NIE znajdziesz w tych materiałach

Te checklisty są **świadomie uproszczone** dla juniorów. Nie znajdziesz tutaj:

❌ **Zaawansowanych technik promptowania** (meta-prompting, chain-of-thought)
➡️ *Powód:* Najpierw opanuj podstawy (3C: Command + Context + Constraints)

❌ **Wielu języków programowania** (tylko TypeScript + universal patterns)
➡️ *Powód:* Cognitive overload. Gdy opanujesz TS, będziesz mógł przenieść wiedzę.

❌ **Architektonicznych decyzji** (convention over configuration, etc.)
➡️ *Powód:* To decyzje seniorów/architektów. Ty najpierw naucz się jakości kodu.

❌ **Multiple models strategy** (używanie różnych AI do różnych zadań)
➡️ *Powód:* Większość juniorów ma dostęp do 1 modelu (np. GitHub Copilot).

**Jeśli szukasz zaawansowanych materiałów:**
Zobacz `backup/10xdevs-2ed/checklists/effective-ai-guidelines/01-core-principles.md`
(1598 linii comprehensive reference - ale może być przytłaczający).

---

## 🎓 Filozofia tych materiałów

### 1. Problem-Focused, nie Theory-First
- ❌ Nie: "Co to jest hallucination?" (definicje)
- ✅ Tak: "AI zwrócił dziwny kod - co robić?" (rozwiązanie problemu)

### 2. Quick Wins > Completeness
- Lepiej **zrobić 3 rzeczy dobrze** niż wiedzieć o 10 i być sparaliżowanym.
- Każda checklist daje Ci actionable steps które możesz użyć DZIŚ.

### 3. Emotional Support & Validation
- Normalne że się męczysz. Wszyscy się męczyli.
- Normalne że AI czasem Cię zawiedzie. Dlatego są checklisty do weryfikacji.
- Impostor syndrome? To część procesu. Keep going!

### 4. Learning by Comparison (Before/After)
- Każda checklist ma real-world examples.
- Seeing is believing - łatwiej zrozumieć gdy widzisz różnicę.

---

## 🤝 Jak dostać pomoc?

### Jeśli coś jest niejasne:
1. Sprawdź `00-GLOSSARY.md` - może termin jest tam wyjaśniony
2. Sprawdź `00-FAQ.md` - może ktoś już zadał to pytanie
3. Wróć do sekcji "💡 Przykład real-world" w checkliście
4. Poszukaj w advanced materials (`01-core-principles.md`)

### Jeśli checklist nie rozwiązuje Twojego problemu:
- Możliwe że Twój problem jest bardziej zaawansowany
- Możliwe że potrzebujesz pomocy seniora z zespołu
- **To jest OK!** Te checklisty nie rozwiązują wszystkiego - to punkt startu.

---

## 🎯 Twój następny krok

**Jeśli czytasz to pierwszy raz:**

1. ✅ Przeczytaj `00-GLOSSARY.md` (5 min) - poznaj terminologię
2. ✅ Przejdź przez `01-pierwszy-prompt.md` (30 min) - naucz się podstaw
3. ✅ Skopiuj `templates/prompt-template.md` i użyj go przy następnym promptowaniu
4. ✅ Wróć tutaj po tygodniu i przejdź do `02-ai-nie-rozumie-wymagan.md`

**Gotowy? [Kliknij tutaj aby przejść do GLOSSARY →](./00-GLOSSARY.md)**

---

## 📊 Track Your Progress

Odznaczaj checklisty które przeszedłeś:

- [ ] `00-GLOSSARY.md` - Przeczytane
- [ ] `00-FAQ.md` - Przeczytane
- [ ] `01-pierwszy-prompt.md` - Przeszedłem + wypróbowałem szablon
- [ ] `02-ai-nie-rozumie-wymagan.md` - Przeszedłem + zastosowałem
- [ ] `03-gdy-ai-gada-glupoty.md` - Przeszedłem + umiem weryfikować
- [ ] `04-czy-ten-kod-jest-ok.md` - Przeszedłem + umiem code review
- [ ] `05-ai-zepsul-testy.md` - Przeszedłem + umiem zarządzać testami
- [ ] `06-jak-zapisac-prace.md` - Przeszedłem + wypracowałem git workflow

**Kiedy odznaczysz wszystkie?** Congratulations! 🎉
Jesteś gotowy aby przejść do intermediate-level materials.

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Metodologia: Sense-Making (Brenda Dervin)
- Target audience: Junior developers (0-2 lata doświadczenia)
- Język: Polski (komentarze w kodzie po angielsku)
