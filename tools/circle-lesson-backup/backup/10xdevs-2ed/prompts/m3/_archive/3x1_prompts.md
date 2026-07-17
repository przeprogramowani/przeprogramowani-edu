---
title: "Authentication Architecture Specification"
description: "Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements."
collection: m3-prod
segment: l1-auth
sort-order: 0
status: published
---

Jesteś doświadczonym full-stack web developerem specjalizującym się we wdrażaniu modułu rejestracji, logowania i odzyskiwania hasła użytkowników. Opracuj szczegółową architekturę tej funkcjonalności na podstawie wymagań z pliku @project-prd.md (US-003 i US-004) oraz stacku z @tech-stack.md.

Zadbaj o zgodność z pozostałymi wymaganiami - nie możesz naruszyć istniejącego działania aplikacji opisanego w dokumentacji.

Specyfikacja powinna zawierać następujące elementy:

1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA
- Dokładny opis zmian w warstwie frontendu (stron, komponentów i layoutów w trybie auth i non-auth), w tym opis nowych elementów oraz tych do rozszerzenia o wymagania autentykacji
- Dokładne rozdzielenie odpowiedzialności pomiędzy formularze i komponenty client-side React a strony Astro, biorąc pod uwagę ich integrację z backendem autentykacji oraz nawigacją i akcjami użytkownika
- Opis przypadków walidacji i komunikatów błędów
- Obsługę najważniejszych scenariuszy

2. LOGIKA BACKENDOWA
- Struktura endpointów API i modeli danych zgodnych z nowymi elementami interfejsu użytkownika
- Mechanizm walidacji danych wejściowych
- Obsługa wyjątków
- Aktualizacja sposobu renderowania wybranych stron server-side biorąc pod uwagę @astro.config.mjs

3. SYSTEM AUTENTYKACJI
- Wykorzystanie Supabase Auth do realizacji funkcjonalności rejestracji, logowania, wylogowywania i odzyskiwania konta w połączeniu z Astro

Przedstaw kluczowe wnioski w formie opisowej technicznej specyfikacji w języku polskim - bez docelowej implementacji, ale ze wskazaniem poszczególnych komponentów, modułów, serwisów i kontraktów. Po ukończeniu zadania, utwórz plik .ai/auth-spec.md i dodaj tam całą specyfikację.



---
title: "Authentication Spec Validation"
description: "Validates authentication specification against PRD requirements, identifies conflicts and redundant assumptions, updates documentation accordingly."
collection: m3-prod
segment: l1-auth
sort-order: 1
status: published
---

Porównaj @project-prd.md oraz @auth-spec.md w poszukiwaniu sprzecznych i nadmiarowych założeń. Upewnij się, że każde User Story może być zrealizowane w oparciu o przygotowany plan. Jeśli zauważasz sprzeczności, zaktualizuj @auth-spec.md zgodnie z nową wiedzą.



---
title: "Authentication Flow Diagram"
description: "Generates Mermaid diagram visualizing authentication architecture based on PRD and auth specification."
collection: m3-prod
segment: l1-auth
sort-order: 2
status: published
---

Wykorzystaj dokumentację projektową @project-prd.md , specyfikację autentykacji @auth-spec.md do utworzenia diagramu zgodnie z regułami - @mermaid-diagram-ui.mdc 

Zanim rozpoczniesz, przeszukaj codebase pod kątem elementów mogących brać udział w procesie autentykacji.



---
title: "Authentication UI Implementation"
description: "Implements login, signup, and password recovery pages and forms following Astro and React best practices without backend integration."
collection: m3-prod
segment: l1-auth
sort-order: 3
status: published
---

Twoim zadaniem jest implementacja elementów interfejsu użytkownika (stron i formularzy) dla procesu logowania, rejestracji i odzyskiwania konta. Specyfikacja znajduje się w: @auth-spec.md

Pamiętaj o założeniach @astro.mdc i @react.mdc - 

Wykorzystaj podobną stylistykę do {{EXISTING_COMPONENTS}}

Nie implementuj backendu ani modyfikacji stanu aplikacji - tymi elementami zajmiemy się w dalszej kolejności



---
title: "Login Backend Integration Planning"
description: "Plans login form integration with Astro backend and Supabase Auth. Generates technical questions to clarify implementation details before proceeding."
collection: m3-prod
segment: l1-auth
sort-order: 4
status: published
---

Przeprowadź integrację @login.astro @LoginForm.tsx  z backendem Astro na podstawie specyfikacji @auth-spec.md. Rozpocznij od analizy istniejącego kodu w kontekście najlepszych praktyk @astro.mdc i @react.mdc 

Przedstawiony plan powinien spełniać założenia wyszczególnione w sekcji user stories: @project-prd.md

Wykorzystaj @supabase-auth.mdc do uzyskania poprawnej integracji procesu logowania z Supabase Auth.

Zanim rozpoczniemy, zadaj mi 5 kluczowych pytań technicznych adresujących niejasne elementy integracji, które pomogą ci przeprowadzić całą implementację od początku do końca.



---
title: "Logout Functionality Implementation"
description: "Extends Layout component with user session verification and logout functionality for authenticated users."
collection: m3-prod
segment: l1-auth
sort-order: 5
status: published
---

Rozbuduj @Layout.astro o weryfikację stanu użytkownika - dla zalogowanych wprowadź możliwość wylogowywania się z aplikacji zgodnie z @astro.mdc @react.mdc



---
title: "Route Protection Implementation"
description: "Implements universal route protection mechanism preventing unauthenticated users from accessing protected pages."
collection: m3-prod
segment: l1-auth
sort-order: 6
status: published
---

Upewnij się, że wejście na stronę główną @generate.astro nie jest możliwe dla niezalogowanych użytkowników.

Wykorzystaj instrukcje z @supabase-auth.mdc i zaimplementuj ten mechanizm w maksymalnie uniwersalny i zgodny z praktykami inżynierskimi sposób.



---
title: "Signup Backend Implementation"
description: "Implements backend logic for signup page and form component consistent with login flow, including email confirmation handling."
collection: m3-prod
segment: l1-auth
sort-order: 7
status: published
---

Wykorzystując @supabase-auth.mdc zaimplementuj backend pod stronę @signup.astro i komponent @SignupForm.tsx 

Logika powinna być spójna z @login.astro oraz @LoginForm.tsx 

Weź pod uwagę zachowanie supabase - po rejestracji zostanie wysłany link do potwierdzenia konta przez użytkownika - poinformuj o tym.


