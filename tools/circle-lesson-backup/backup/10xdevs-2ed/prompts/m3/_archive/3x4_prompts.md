---
title: "Component Complexity Analysis"
description: "Analyzes components folder to identify top 5 files with highest LOC and suggests refactoring directions based on tech stack."
collection: m3-prod
segment: l4-refactor
sort-order: 0
status: published
---

Zapoznaj się z wszystkimi plikami w folderze @components identyfikując te o największej liczbie linijek kodu.

1) Wyselekcjonuj i wypisz ścieżki TOP 5 plików o największej liczbie LOC, wskazując na potencjalnie wysoką złożoność.

2) Zapoznaj się z każdym plikiem z TOP 5 sugerując potencjalne kierunki refaktoryzacji (wzorce, techniki i ulepszenia dopasowanej do napotkanej tam technologii) wraz z argumentacją.

Dla referencji bazuj na @tech-stack.md



---
title: "React Hook Form Refactoring Plan"
description: "Creates detailed refactoring plan for migrating form components to React Hook Form, including API call management and testing strategy."
collection: m3-prod
segment: l4-refactor
sort-order: 1
status: published
---

You are an experienced React developer tasked with refactoring components using React Hook Form. Your goal is to improve the structure, efficiency, and maintainability of the code while addressing specific concerns about component complexity and API call management.

Components: {{COMPONENTS}}

Tech Stack: {{TECH_STACK}}

Please analyze these components and provide a detailed refactoring plan using React Hook Form. Follow these steps:

1. Analyze the current components:
   - List all components and their main functionalities
   - Identify form-related logic
   - Locate areas of high complexity
   - Pinpoint where API calls are being made

2. Implement React Hook Form:
   - Explain how to integrate React Hook Form into each component
   - Describe any necessary changes to the component structure

3. Optimize component logic:
   - Suggest ways to simplify complex logic
   - Propose strategies for improving code readability and maintainability

4. Manage API calls:
   - Recommend best practices for handling API calls
   - If appropriate, suggest moving API calls to a separate service or custom hook

5. Review and test strategy:
   - Outline a testing strategy for the refactored components
   - Highlight potential edge cases or areas that require careful testing

Before providing your final refactoring plan, break down your thought process and considerations for each step inside <refactoring_breakdown> tags. For each component:

- Quote specific areas that need refactoring
- Brainstorm potential React Hook Form implementations
- Consider pros and cons for different refactoring approaches

This will ensure a thorough approach to the refactoring task. It's OK for this section to be quite long.

Your final output should be structured as follows:

1. Analysis
2. Refactoring Plan
   2.1 Component Structure Changes
   2.2 React Hook Form Implementation
   2.3 Logic Optimization
   2.4 API Call Management
   2.5 Testing Strategy

Please proceed with your refactoring breakdown and refactoring plan.



---
title: "Accessibility Evaluation"
description: "Evaluates proposed solutions on 1-10 scale considering user accessibility and usability based on industry research."
collection: m3-prod
segment: l4-refactor
sort-order: 2
status: published
---

Oceń w skali 1-10 każdą z propozycji pod kątem dostępności i łatwości obsługi. Zależy mi na perspektywie użytkownika.

Weź pod uwagę branżowe badania i opracowania na temat każdej z propozycji.



---
title: "Mobile Navigation Specification"
description: "Creates business specification for mobile navigation changes in TwoPane component, including footer hiding on small screens."
collection: m3-prod
segment: l4-refactor
sort-order: 3
status: published
---

Zdecydowałem się na opcję nr 3. Jako specjalista frontendu, Reacta i Tailwinda, utwórz specyfikację biznesową zmian w komponencie @TwoPane.tsx. Dodaj informacje o @tech-stack.md. Specyfikacja nie powinna zawierać detali implementacyjnych, a wyłącznie referencje do komponentów. Upewnij się, że zachowanie paneli w trybie desktop nie zostanie naruszone.

Rozszerz proponowaną zmianę o ukrywanie klasycznej stopki @Footer.tsx na rzecz nawigacji mobile na małych ekranach.

Zapisz specyfikację w pliku w folderze .ai/ui/mobile-navigation.md



---
title: "Mobile Navigation Implementation"
description: "Implements mobile navigation changes across all affected components following the specification and React best practices."
collection: m3-prod
segment: l4-refactor
sort-order: 4
status: published
---

Jesteś doświadczonym senior frontend developerem.
Zaimplementuj niezbędne zmiany w projekcie aby zrealizować @mobile-navigation.md 

Zaktualizuj wszystkie wskazane komponenty tak, aby całościowo wpływały na realizację zadania.

Pamiętaj o zgodności z @tech-stack.md oraz @react-development.mdc



---
title: "React 19 Migration Assessment"
description: "Analyzes components in rule-builder folder to identify which require updates for React 19 migration."
collection: m3-prod
segment: l4-refactor
sort-order: 5
status: published
---

Zapoznaj się z treścią @R19Migration a następnie oceń, które komponenty w folderze @rule-builder będą wymagać korekty w przypadku migracji do Reacta 19.



---
title: "Domain-Driven Design Restructuring"
description: "Proposes domain extraction strategy using DDD patterns (strategic and tactical) to improve project maintainability."
collection: m3-prod
segment: l4-refactor
sort-order: 6
status: published
---

Projekt 10xRules staje się trudny w utrzymaniu. Przygotowujemy się do wyodrębnienia domen z aplikacji bazując na @project-prd.md oraz strukturze i zawartości projektu.

Zaproponuj kształt przykładowej domeny zgodnie przechodząc przekrojowo przez wszystkie warstwy aplikacji, opisując sugestie refaktoryzacji. Jakie wzorce DDD - strategiczne i taktyczne - warto wziąć pod uwagę?



---
title: "Row Level Security Migration"
description: "Creates Supabase migration adding Row Level Security to all CRUD operations on collections table with implementation instructions."
collection: m3-prod
segment: l4-refactor
sort-order: 7
status: published
---

Utwórz nową migrację dodającą RLS na wszystkie operacje CRUD w tabeli kolekcji (@database.types.ts ) bazując na rekomendacjach z @supabase-migrations.mdc 

Dodatkowo, przedstaw instrukcję wykonania migracji na bazie i zaaplikowania zmian.


