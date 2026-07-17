# 10xDevs 3.0 Prework - podsumowanie lekcji PL

Źródło analizy: `src/content/lessons10xDevs3Prework/pl`.

## Post powitalny prework

Krótki komunikat startowy kierujący uczestników do platformy preworku w wersji polskiej i angielskiej. Wyjaśnia rolę quizu, który pomaga zbudować indywidualną agendę lekcji przed startem programu.

- Dostęp do preworku na platformie kursowej.
- Dostępność wersji polskiej i angielskiej.
- Quiz jako mechanizm rekomendacji lekcji.
- Zakres preworku: narzędzia, modele, kontekst, stack i projekt kursowy.
- Zachęta do przerobienia materiałów przed startem programu.

## [1.1] Co potrafi AI w 2026 r.

Lekcja otwierająca pokazuje potencjał agentów AI przez pięć przykładowych scenariuszy pracy, które będą rozwijane w głównym programie. Po obejrzeniu materiału uczestnik ma przejść do quizu albo kontynuować pełną ścieżkę preworku.

- Przegląd praktycznych scenariuszy pracy z agentami AI.
- Ustawienie oczekiwań wobec programowania z AI w 2026 roku.
- Quiz jako narzędzie do dopasowania agendy preworku.
- Możliwość przejścia przez wszystkie lekcje bez quizu.
- Prework jako przygotowanie do dalszego, bardziej praktycznego kursu.

## [1.2] Chatbot vs Agent vs Harness - definicje

Lekcja porządkuje podstawowy model mentalny pracy z AI: model generuje tokeny, agent realizuje zadania przez narzędzia, a harness daje mu środowisko, uprawnienia, pamięć roboczą i kontrolę. Główna zmiana polega na przejściu od proszenia chatbota o instrukcje do delegowania celów agentowi działającemu w kontrolowanym środowisku.

- Różnica między chatbotem, agentem i harnessem.
- Tool use jako źródło sprawczości agenta.
- Wpływ modelu, harnessu, środowiska lokalnego i polityki użytkownika na wynik pracy.
- Harness jako warstwa kontroli: narzędzia, sandboxing, kontekst, diffy i zgody.
- Przejście od mikrozarządzania komendami do opisywania celu, granic i kryteriów sukcesu.

## [1.3] Jak uczyć się i rozwijać z AI

Lekcja ostrzega przed trybem "approve bez obrony", w którym agent dowozi działający wynik, ale uczestnik nie buduje zrozumienia. Proponuje używanie AI jako korepetytora: najpierw można wygenerować rozwiązanie, ale potem trzeba je rozłożyć na decyzje, trade-offy, pytania kontrolne i materiał do powtórek.

- Rozdzielenie produktywności w zadaniu od realnego rozwoju kompetencji.
- Ryzyko powierzchownej nauki przy szybkim przyjmowaniu gotowych odpowiedzi.
- Workflow generation-then-comprehension: wygeneruj, potem zrozum.
- Pytania sprawdzające, elaboracja i aktywne odtwarzanie jako techniki nauki.
- Konfiguracja narzędzia tak, aby częściej działało jak korepetytor niż generator gotowców.

## [2.1] Agent w IDE, Terminalu czy w Chmurze?

Lekcja porównuje trzy środowiska pracy z agentami: klasyczne IDE z asystentem AI, terminalowe agenty oraz narzędzia agent-native lub chmurowe. Nie narzuca jednej ścieżki, tylko pokazuje kompromisy między kontrolą kodu, sprawczością, równoległością, komfortem pracy i delegowaniem zadań.

- Klasyczne IDE jako bezpieczny start z wizualnym feedbackiem i znanym workflow.
- Terminal jako środowisko uniwersalne, headless i dobrze zintegrowane z narzędziami systemowymi.
- Agent-native IDE i chmura jako model pracy z wieloma agentami i zadaniami w tle.
- Kryteria wyboru: kontrola kodu, próg wejścia, mobilność, równoległość i typ zadania.
- Rekomendowany setup: agent terminalowy wewnątrz znanego IDE plus eksperymenty z narzędziami agent-native.

## [2.2] Cursor - Podstawy operacyjne

Lekcja wideo wprowadza Cursora jako środowisko programowania z AI, od klasycznego edytora z agentem po nowszy kierunek centrum sterowania agentami. Część tekstowa podpowiada, jak oceniać alternatywne edytory pod kątem prywatności, kontekstu projektu, trybów pracy, standardów agentowych, modeli i kosztów.

- Cursor jako edytor kodu z agentem AI i ewoluujące środowisko pracy.
- Prywatność kodu, promptów i historii pracy jako kryterium wyboru narzędzia.
- Indeksowanie repozytorium, wykluczanie plików i wskazywanie kontekstu.
- Tryby pracy: lokalna edycja, rozmowa o pliku, praca wieloplikowa i kontrola zmian.
- Znaczenie standardów `AGENTS.md`, `.agents/skills`, modeli domyślnych, limitów i cennika.

## [2.3] Claude Code - Podstawy operacyjne

Lekcja wideo wprowadza Claude Code jako terminalowego agenta programowania, którego warto oceniać nie tylko po modelu, ale po jakości harnessu. Tekst wskazuje, jak analizować alternatywy: uprawnienia, komendy operacyjne, pamięć projektu, standardy agentowe, prywatność, koszty i benchmarki.

- Claude Code jako agent terminalowy z mocnym harnessem.
- Uprawnienia do edycji plików, komend, sieci, danych spoza projektu i integracji.
- Operacyjne komendy do kontroli modelu, kontekstu, diffów, kosztów, kompakcji i sesji.
- Pamięć projektowa przez pliki typu `CLAUDE.md`, reguły projektu i stałe instrukcje.
- Alternatywy: Codex, OpenCode i modele otwarte jako wybory zależne od jakości, kosztu i benchmarków.

## [2.4] Agent-Native IDE - nowa generacja narzędzi

Lekcja pokazuje nową kategorię środowisk, w których centrum interfejsu stanowi sesja agenta, lista zadań i statusy pracy, a nie sam edytor kodu. Podkreśla, że taka praca wymaga większej dyscypliny: czystego repozytorium, ograniczonego zakresu, testów, review, kontroli diffów, sekretów i kosztów.

- Agent-native IDE jako interfejs zorientowany na zadania i sesje agentów.
- Odejście od pliku jako centrum pracy na rzecz zarządzania agentami.
- Równoległa praca, worktrees i delegowanie zadań w tle.
- Ryzyka: mniejsza widoczność kodu, nadmierne zaufanie i trudniejsza kontrola procesu.
- Zasady bezpieczeństwa: czysty stan repo, testy, review, diffy, zakres zmian i ostrożność z sekretami.

## [3.1] LLMy i ich wpływ na codzienną pracę programisty

Lekcja tłumaczy LLMy jako systemy przewidywania tokenów, a nie magiczne rozumienie projektu. Pokazuje typowe klasy błędów, rolę modeli rozumujących, koszt ukrytych tokenów, problem degradacji długiego kontekstu oraz potrzebę budżetowania modelu i okna kontekstowego.

- Predykcja tokenów jako fundament działania modeli językowych.
- Błędy semantyczne mimo poprawnej składni, testy utrwalające błędne założenia i ignorowanie środka kontekstu.
- Modele rozumujące i effort jako trade-off między jakością, kosztem i czasem.
- Degradacja kontekstu oraz pojęcie Maximum Effective Context Window.
- Budżetowanie tokenów między instrukcje systemowe, reguły projektu, sesję i definicje narzędzi.

## [3.2] Wzorce i antywzorce promptowania

Lekcja traktuje prompt do agenta jako kontrakt wysokiej wagi, a nie jednorazowe pytanie do chatbota. Uczy definiowania celu, zakresu, granic, kontekstu, weryfikacji, raportu i uprawnień, a także rozdzielania instrukcji między reguły projektu, pamięć, skille i bieżący prompt.

- Różnica między krótkim promptem chatbota a długotrwałym kontraktem agenta.
- Hierarchia instrukcji: system prompt, `AGENTS.md` / `CLAUDE.md`, pamięć, skille i prompt zadaniowy.
- Prompty dla modeli rozumujących: cel i ograniczenia zamiast niepotrzebnego prowadzenia krok po kroku.
- Antywzorce: brak granic, przeładowanie kontekstu, brak kryteriów, kompresja reguł w jedną warstwę i zaufanie składni.
- Szablony pracy: bugfix, refaktor, code review, eksploracja bez edycji i implementacja po planie.

## [3.3] Cykl życia wątku i zarządzanie kontekstem

Lekcja wyjaśnia context engineering jako projektowanie tego, co trafia do okna modelu, kiedy i w jakiej formie. Pokazuje cykl życia sesji z agentem, sygnały degradacji wątku oraz decyzje operacyjne: zapisać, wybrać, skompresować, odizolować, wyczyścić albo rozpocząć nowy wątek.

- Context engineering jako projektowanie systemu kontekstu, a nie tylko pisanie lepszych promptów.
- Strategie Write, Select, Compress i Isolate.
- Cykl pracy: świeży wątek, eksploracja, plan, implementacja, weryfikacja, kompakcja lub restart.
- Sygnały degradacji: powtarzanie ustaleń, wymyślanie ścieżek, ignorowanie ograniczeń i łatanie objawów.
- Pamięć zewnętrzna i subagenty jako sposoby utrzymania jakości długiej pracy.

## [3.4] Język pracy z AI w programowaniu

Lekcja odpowiada na pytanie, kiedy rozmawiać z agentem po angielsku, a kiedy po polsku. Rekomenduje angielski jako domyślny język operacyjny kodu, reguł projektu, commitów i poleceń technicznych, ale dopuszcza polski tam, gdzie zwiększa jasność myślenia, wymagań biznesowych albo copy produktu.

- Tokenizacja i wyższy koszt polskich promptów w długich sesjach.
- Fertility ratio jako intuicja liczby tokenów potrzebnych na słowo.
- Rozumowanie modeli jako w dużej mierze ponadjęzykowe, ale ograniczone kosztami i szumem pojęciowym.
- Angielski jako język operacyjny dla kodu, instrukcji projektowych, nazw, branchy i narzędzi.
- Polski jako użyteczny tryb planowania, debugowania, opisu domeny i generowania treści produktu.

## [3.5] Rekomendowane modele i jak być na bieżąco

Lekcja porządkuje wybór modeli przez role, a nie przez ślepe rankingi. Proponuje utrzymywać trzy poziomy: model do codziennej egzekucji, tani model do prostych lub równoległych zadań oraz mocny model do planowania, architektury, trudnego debugowania i review.

- Podział ról modeli: koder do egzekucji i architekt do planowania oraz decyzji pod niepewnością.
- Dobór modelu do zadania, ryzyka, kosztu i oczekiwanej liczby iteracji.
- Modele chińskie i otwarte jako budżetowa warstwa robocza, ale z kontrolą danych, regionu i compliance.
- Ograniczenia benchmarków: Goodhart, saturacja, kontaminacja, pass@1 kontra długie pętle agentowe.
- Sposób bycia na bieżąco: oficjalne blogi, OpenRouter, rankingi użycia, aktywne benchmarki i dwutygodniowy model check.

## [4.1] Tech Stack Overview

Lekcja wyjaśnia, że kursowy stack jest rekomendowaną i najlepiej wspieraną ścieżką, ale nie obowiązkowym warunkiem ukończenia kursu. Kluczowe jest wybranie stacku przyjaznego agentowi: typowanego, konwencyjnego, popularnego w danych treningowych i dobrze udokumentowanego.

- Kryteria stacku agent-friendly: typy, konwencje, popularność wzorców i dokumentacja.
- Rekomendowany stack: Astro, React, TypeScript, Tailwind CSS, Supabase i Cloudflare.
- Rola Astro jako meta-frameworka, endpointów API i warstwy SSR/deployment.
- Własny stack jako dobry wybór, jeśli uczestnik zna go wystarczająco i agent ma w nim dobre sygnały.
- Minimalna wiedza na start: system typów, HTTP/API i uruchomienie startera, bez konieczności biegłości w konkretnym frameworku.

## [4.2] Dobry i zły projekt kursowy

Lekcja pomaga wybrać projekt kursowy, który da się dowieźć po godzinach i który dobrze nadaje się do pracy z agentem. Dobry projekt ma małe MVP, konkretny problem, pierwszą działającą ścieżkę użytkownika, dane, logikę biznesową, artefakty projektowe, test użytkownika i CI/CD.

- MVP jako najmniejszy spójny przepływ dający wartość użytkownikowi.
- Minimalne wymagania projektu: kontrola dostępu, zarządzanie danymi, logika biznesowa, artefakty, test i CI/CD.
- Ryzyko wysokiego progu zero-to-one, zbyt dużego MVP i pustego CRUD-u.
- Kryteria dobrego projektu: użytkownik, problem, MVP, dane, logika biznesowa, stack, test i automatyczna weryfikacja.
- Reguła praktyczna: pierwszy działający przepływ powinien być możliwy w około tydzień pracy po godzinach.

## [4.3] Checklista uczestnika i support (Circle)

Lekcja zamyka prework organizacyjnie: wskazuje Circle jako główne miejsce programu, przypomina o starcie pełnych przestrzeni 18 maja 2026 i spotkaniu otwierającym 19 maja 2026. Uczestnik ma upewnić się, że ma narzędzie agentowe, świadomie wybrany model rozliczenia, roboczy pomysł na projekt i wie, gdzie szukać wsparcia.

- Circle jako główne miejsce ogłoszeń, dyskusji, wsparcia i przestrzeni PL/ENG.
- Daty organizacyjne: pełny dostęp od 18 maja 2026 i spotkanie otwierające 19 maja 2026.
- Minimalny setup: Cursor, Claude Code, Codex albo inne narzędzie pracujące z repozytorium.
- Decyzja kosztowa: subskrypcja kontra API oraz ostrożność wobec lokalnych modeli jako defaultu.
- Ścieżki wsparcia: Circle dla spraw merytorycznych i programowych, email lub wskazana osoba dla administracji.
