# Przewodnik: Efektywna praca z AI dla programistów

> **Wersja 2.0** | Ostatnia aktualizacja: 2025-11 | Uniwersalny, niezależny od technologii

## 📚 Przegląd dokumentów

Ten przewodnik został podzielony na trzy komplementarne dokumenty, aby zapewnić maksymalną użyteczność i łatwość utrzymania:

### 🎯 [01: Podstawy i Techniki](./01-core-principles.md)
**Uniwersalne, ponadczasowe zasady rozwoju oprogramowania z AI**

Dla kogo:
- Programistów uczących się pracy z AI
- Każdego szukającego fundamentalnych zasad (niezależnie od tech stacku)
- Architektów chcących zrozumieć filozofię AI-assisted development

Zawartość:
- Filozofia Spec-Driven Development vs Vibe Coding
- Fundamentalne ograniczenia LLM i jak z nimi pracować
- Human-in-the-Loop (HITL) - zasady kontroli
- Mistrzowskie promptowanie (anatomia, meta-prompting, metoda sokratejska)
- Cechy projektów przyjaznych AI (typy, architektura, testy)
- Uniwersalne best practices i anti-patterns

Utrzymanie: **Rzadkie** (rocznie) - zawiera ponadczasową wiedzę

---

### ⚙️ [02: Wzorce i Workflows](./02-workflows-patterns.md)
**Uniwersalne wzorce pracy z AI w różnych środowiskach**

Dla kogo:
- Programistów szukających konkretnych workflow
- Zespołów chcących standardyzować procesy
- Developerów wybierających między IDE, CLI, agentami

Zawartość:
- Zarządzanie kontekstem (minimalizacja, odświeżanie)
- Strukturyzowane promptowanie (XML, JSON, Markdown)
- Wzorce pracy w IDE (planning → implementation → testing)
- Wzorce pracy w CLI (eksploracja, refactoring, CRUD)
- Wzorce pracy z agentami asynchronicznymi (HITL, sandbox)
- Drzewa decyzyjne: kiedy użyć którego narzędzia

Utrzymanie: **Średnie** (półroczne) - wzorce ewoluują wolniej niż narzędzia

---

### 🛠️ [03: Narzędzia i Modele (Q4 2025)](./03-tools-landscape-2025q4.md)
**Aktualny przegląd narzędzi, modeli i rekomendacji**

Dla kogo:
- Programistów wybierających narzędzia/modele
- Menedżerów planujących budżety
- Zespołów migrujących między narzędziami

Zawartość:
- Rekomendacje modeli (Q4 2025)
- Strategia kosztowa (flat rate vs usage-based)
- Wybór języka: Polski vs Angielski
- Porównanie narzędzi IDE (Cursor, Windsurf, Cline)
- Porównanie narzędzi CLI (Claude Code, Codex CLI, aider)
- Porównanie agentów (Devin, Jules, GitHub Copilot Agent)
- Setup instructions dla konkretnych narzędzi

Utrzymanie: **Częste** (kwartalne) - ten dokument się dezaktualizuje najszybciej

---

## 🗺️ Jak czytać te dokumenty?

### Jeśli jesteś **nowy w AI coding**:
1. Zacznij od **01: Podstawy i Techniki** (cały dokument)
2. Przeczytaj **02: Wzorce** dla swojego środowiska (IDE/CLI/Agenty)
3. Sprawdź **03: Narzędzia** dla aktualnych rekomendacji

### Jeśli **wybierasz narzędzie**:
1. **03: Narzędzia** → sekcja porównań
2. **02: Wzorce** → zrozum workflow dla wybranego typu narzędzia
3. **01: Podstawy** → sekcja "Cechy dobrego projektu" (przygotuj projekt)

### Jeśli chcesz **poprawić swoje promptowanie**:
1. **01: Podstawy** → sekcja "Efektywne promptowanie"
2. **02: Wzorce** → sekcja "Strukturyzowane promptowanie"

### Jeśli **onboardujesz zespół**:
1. **01: Podstawy** → filozofia i zasady (must-read dla wszystkich)
2. **02: Wzorce** → workflow dla waszego stacku
3. **03: Narzędzia** → standardyzacja narzędzi

---

## 📌 Kluczowe zmiany w wersji 2.0

### ✅ Co się zmieniło:
- **Podzielono** na 3 dokumenty (łatwiejsze w utrzymaniu)
- **Uogólniono** zasady (niezależne od React/Next.js/TypeScript)
- **Dodano** przykłady w wielu językach (TypeScript, Python, Go, Java)
- **Usunięto** specyficzne wersje frameworków
- **Zabstrakcjonowano** nazwy narzędzi w częściach uniwersalnych
- **Rozdzielono** ponadczasową wiedzę od ulotnych narzędzi

### ⚖️ Filozofia podziału:
- **Dokument 01**: Zasady prawdziwe za 5 lat (rzadkie aktualizacje)
- **Dokument 02**: Wzorce prawdziwe za 2 lata (średnie aktualizacje)
- **Dokument 03**: Narzędzia prawdziwe za 3 miesiące (częste aktualizacje)

---

## 🔄 Historia wersji

### v2.0 (2025-11)
- Podział na 3 dokumenty
- Uniwersalizacja (multi-język, multi-framework)
- Separacja ponadczasowej wiedzy od narzędzi

### v1.0 (2025-11)
- Wersja monolityczna
- Bazowana na 10xDevs 2. edycja (moduły 0x-1x)
- Oryginalny dokument zachowany w `archive/`

---

## 📖 Archiwum

Oryginalna wersja dokumentu (monolityczna, web-focused):
- [original-effective-ai-guidelines.md](./archive/original-effective-ai-guidelines.md)

---

## 🤝 Wkład i feedback

Ten przewodnik ewoluuje razem z ekosystemem AI coding. Jeśli masz sugestie:
- **Dokument 01/02**: Fundamentalne błędy lub brakujące uniwersalne zasady
- **Dokument 03**: Dezaktualizacje narzędzi/modeli (po upływie >3 miesięcy)

---

## 📜 Licencja i źródło

Bazuje na materiałach kursu **10xDevs 2. edycja** (przeprogramowani.pl)
Uniwersalizacja: 2025-11
