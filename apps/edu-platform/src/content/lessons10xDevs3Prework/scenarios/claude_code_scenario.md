# Claude Code — Podstawy operacyjne | Scenariusz wideo


## 1. Co to jest Claude Code (~45s)

Cześć, w tym krótkim filmie zaprezentuję ci podstawy korzystania z narzędzia Claude Code.

Claude Code to twój osobisty Agent programowania, wyposażony w topowe modele jak Opus czy Sonnet, które kontroluje jakościowy harness - warstwa narzędzi, bezpieczeństwa i kontroli wywołań.

To właśnie ten słynny harness, czyli warstwa integracji samych modeli m.in. z twoim systemem plików czy zasobami zewnętrznymi sprawiła, że Claude Code błyskawicznie wyrósł na topowe narzędzie AI dla programistów - o ile dostęp do tych samych modeli oferowały wcześniej inne narzędzia jak choćby Cursor, to mało która alternatywa wykorzystywała maksimum potencjału tych rozwiązań - czy to na poziomie wywoływania właściwych narzędzi, posługiwania się terminalem, korekty swoich działań czy sprawnego przeszukiwania plików i trzymania aktualnej wiedzy o projekcie.

Jeśli różnica między modelem, Agentem i harnessem jest dla ciebie nieoczywista, to wróć do jednej z poprzednich lekcji gdzie tłumaczymy to na przykładach. Jeśli natomiast masz tę lekcję już za sobą, to skupmy się teraz na podstawach pracy z Claude Codem.

---

## 2. Instalacja i pierwszy start (~30s)

Cześć, w tym krótkim filmie zaprezentuję ci podstawy korzystania z narzędzia Claude Code. Pierwsze kroki znajdziesz na stronie `https://code.claude.com/`.

Tutaj znajduje się instrukcja instalacji terminalowego Claude Code pod najważniejsze systemy operacyjne, a także oficjalna dokumentacja samego narzędzia. W tym filmie pokażę ci Claude Code w terminalu ale warto wiedzieć, że Anthropic aktywnie rozwija też aplikację desktopową `Claude` z trybem kodowania, a także oficjalny plugin do VS Code. My jednak pozostaniem w terminalu, bo obecnie jest to najbardziej uniwersalna i sprawdzona metoda korzystania z Claude Code.

Jeśli zainstalowałeś już to narzędzie, zweryfikuj cały proces wywołując w terminalu polecenie `claude`. Na start nie masz aktywnej sesji użytkownika, więc musisz ją aktywować poprzez komendę `/login`.

## 3. Subskrypcje

Jak widzisz, mamy obecnie 3 główne opcje aktywowania Claude Code - poprzez subskrypcję ze stałą ceną, poprzez klucz do API gdzie płacimy za zużycie, a także podłączając się do firmowej chmury i usług pośrednich jak Amazon Bedrock. 

Jeśli masz firmową subskrypcję i konto Claude, lub dostęp do AWS Bedrock, to decyzja jest oczywista.

Jeśli natomiast jesteś użytkownikiem indywidualnym, to warto rozważyć 2 popularne subskrypcje - Pro za `$17` oraz Max 5x za `$100`.

Niestety, w przypadku subskrypcji Pro dość szybko poczujesz limity konwersacji - szczególnie. w przypadku najdroższego modelu Opus. Na tym poziomie możesz przetestować potencjał Claude Code, ale do codziennej i wygodnej pracy z Claude Code przyda się subskrypcja Max - warto sprawdzić, czy twoja firma nie oferuje takich subskrypcji. W trakcie samego 10xDevs pokażemy ci również alternatywne, tańsze narzędzia i modele, a także techniki zabezpieczania budżetu przed zbyt szybkim marnowaniem tokenów.

Co ważne, każda z subskrypcji Claude Code - zarówno darmowa jak i płatne - ma zablokowane udostępnianie danych i kodu do firmy Anthropic w celu trenowania kolejnych wersji modeli AI. Odrobina niezbędnej kontroli, co warto docenić.

## 4. Skan środowiska

W przypadku pracy z istniejącym projektem, po zalogowaniu się, przygodę z Claude Code warto rozpocząć od polecenia `/init`

Narzędzie przeskanuje wtedy cały projekt i stworzy dla siebie `Claude.md`, czyli streszczenie zawartości całego projektu. 

Ten plik będzie dodawany do każdej nowej sesji z Agentem w sposób automatyczny i jest to bardzo ważny elementy konfiguracji całego środowiska. Powtarzalne elementy promptów możesz przenosić właśnie do tego miejsca, a kiedy sam projekt będzie się rozrastał, `Claude.md` powinieneś aktualizować o nowe szczegóły jak choćby tech stack, narzędzia czy dostępne dla Agenta komendy.

Zobaczmy teraz, że Agent utworzył dla siebie spis komend dostępnych w projekcie, więc kiedy kolejny raz wydamy mu polecenie "run all tests", to będzie wiedział, że chodzi o `npm run test`.

## 5. Pierwszy prompt — agent loop w akcji

Spróbujmy teraz zmodyfikować pierwszy plik - pusty zestaw testów do algorytmu fizz buzz. Jak wyglądałoby to w ChatGPT? 

Musiałbyś odnaleźć ten plik, zaznaczyć go, skopiować, wkleić, poczekać na odpowiedź Chata, znowu skopiować, znowu wkleić i przetestować modyfikację.

Praca z Agentami takimi jak Claude Code wygląda inaczej. Napisz po prostu - `add 3 test cases to @fizzbuzz.spec.ts`. Przy okazji widzisz jak przez znak małpy podpowiedziałem agentowi, o który plik nam konkretnie chodzi. Korzystaj z takich podpowiedzi aby oszczędzić tokenów na zbędne i kosztowne przeszukiwania projektu przez Claude Code.

Co się stanie kiedy nacisnę ENTER? Agent sam przeczyta plik, zapyta o zgodę na modyfikację i poinformuje cię, kiedy cały proces się zakończy. Pamiętaj więc o sprawczości i autonomii agenta. Zamiast głuchego telefonu i kopiowania plików, deleguj do niego konkretną pracę i przedstawiaj cele.

## 6. Bezpieczeństwo

Teraz dwa słowa o uprawnieniach - chociaż będzie o tym dedykowana lekcja w pierwszym module 10xDevs.

Zanim zaczniemy, wycofajmy wprowadzone zmiany - możesz to zrobić komendą `/rewind` lub podwójnym ESCAPE. Agent zapyta w które miejsce chcesz się przenieść - wybieramy jedną wiadomość wstecz, naciskamy ENTER i widzimy repo sprzed wykonania tego polecenia. Teraz możemy go ponowić - co widzimy?

Domyślnie, Claude Code pyta o zgodę w kilku kontekstach - modyfikacja plików, czytanie plików poza folderem w którym został uruchomiony, a także w przypadku korzystania z zewnętrznych narzędzi jak serwery MCP czy pobieranie danych z sieci.

Jeśli wyrazimy zgodę jednorazowo, nic w repo się nie zmieni. Jeśli te pytania są uciążliwe, możemy przejść w tryb zgody na edycję na przestrzeni całej sesji - opcja druga lub shift tab. Jeśli chcemy zapisać uprawnienia na przekroju kilku sesji, potrzebujemy już konfigu `Claude Code` pod adresem `.claude/settings.json` - możemy o to poprosić tekstem - `update Claude Config for this project to allow file modifications`.

Opcja ostatnia i najbardziej ryzykowna - uruchomienie `claude` flagą `--dangerously-skip-permissions` - to wskazówka dla tych, którzy chcą eksperymentować w pełnym trybie sprawczości agenta, który nie pyta nas o zgody. Więcej o tym, jak i opcjach na bezpieczną pracę z Agentami w pierwszym module 10xDevs.

---

## 6. Komendy operacyjne — /help, /context, /cost, /model (~60s)

Na koniec tego wprowadzenia kilka praktycznych komend, które warto znać:

**Co pokazać:**
- `/help` — żeby poznać skróty klawiszowe i opis dostępnych narzędzi
- `/model` — żeby wybrać dostępny model - dla tych z większym budżetem tokenów rekomendujemy Opusa, a Sonnet jako bezpieczna opcja B - Haiku to model pomocniczy, m.in. do searcha
- `/context` — pasek zużycia okna kontekstowego (tokeny, procent)
- `/diff` - jeśli chcesz zobaczyć zmiany w ramach bieżącej sesji, jeszcze nie zacommitowane

No i dwie ważne komendy już w przypadku ciągłej pracy z modelem:

- `/clear` — do czyszczenia pamięci podręcznej, kiedy zauważamy, że okno kontekstowe wypełnia się ponad określone limity - wg nas bezpieczny limit to ok 100k tokenów
- `/compact` — "miękkie czyszczenie", tzw. kompaktowanie - model podsumuje bieżącą sesje w formie krótkiego streszczenia, umieści je na początku nowej sesji i pozwoli pracować dalej - możemy poprzez parametry wskazywać, co powinno w takim streszczeniu pozostać, a co usunąć - będziemy o tym jeszcze mówić w kolejnych lekcjach

##

W tym krótkim wprowadzeniu do `Claude Code` to wszytko - w ramach całego szkolenia `10xDevs` poznasz Agentów w Terminalu znacznie głębiej, omówimy m.in tryb planowania, skille czy zaawansowane metody kontroli okna kontekstowego. To wszystko czeka na ciebie już w pierwszym module, który startuje niebawem.