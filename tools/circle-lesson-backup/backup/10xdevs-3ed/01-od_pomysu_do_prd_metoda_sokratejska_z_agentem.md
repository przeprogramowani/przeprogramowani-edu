---
lessonId: 3662385
sectionId: 966234
name: "Od pomysłu do PRD: Metoda Sokratejska z Agentem"
---

# Od pomysłu do PRD: Metoda Sokratejska z Agentem

## Wstęp

Pierwsza pułapka w projekcie kursowym pojawia się zanim napiszesz pierwszą linię kodu.

Masz pomysł. Czasem nawet całkiem sensowny: aplikacja do fiszek z AI, system notatek, dashboard dla freelancerów, wewnętrzne narzędzie do firmy. Brzmi dobrze, bo na tym etapie pomysł nie musiał jeszcze odpowiedzieć na żadne niewygodne pytanie.

A potem wchodzisz w kod, dokładasz logowanie, dashboard, kilka tabel, widok statystyk... i po dwóch tygodniach okazuje się, że nadal nie wiadomo, dla kogo to właściwie jest.

Kto będzie tego używał? Jaki jest pierwszy wartościowy przepływ? Co wypada z MVP? Co robimy, kiedy użytkownik nie wróci po tygodniu?

No właśnie.

Dlatego pierwszym ruchem w 10xDevs nie jest implementacja. Pierwszym ruchem jest sesja `/10x-shape` — rozmowa, w której Agent wymusza precyzję — a po niej `/10x-prd`, który zapisuje ustalenia jako kontrakt.

Dwa osobne skille, dwa osobne artefakty: `shape-notes.md` jako zapis sesji i `prd.md` jako kontrakt wejściowy do dalszej pracy.

Dobrze poprowadzona sesja wymusza decyzje, które samodzielnie bardzo łatwo ominąć — a zapisany kontrakt sprawia, że twoje kolejne prompty już ich nie podważą.

W preworku zebrałeś trzy elementy tej układanki: kryteria dobrego projektu kursowego, pojęcie Agenta jako systemu działającego w kontrolowanym środowisku i intuicję, że prompt do Agenta to kontrakt. Teraz łączymy te trzy rzeczy w pierwszy realny workflow.

Zanim Agent dostanie repozytorium, dostaje twój pomysł. I ma go zweryfikować, bez litości.

## Core

### Dwa skille, jeden łańcuch

Workflow składa się z dwóch osobnych skilli — warto od razu rozdzielić ich role.

`/10x-shape` prowadzi sesję sokratejską. Pyta, drąży, łapie luki. Nie wymyśla za ciebie, co budujesz — wymusza, żebyś ty to powiedział na głos.

Wynik to `shape-notes.md`: zapis decyzji, które właśnie podjąłeś.

`/10x-prd` to drugi krok. Bierze `shape-notes.md` i przepisuje go do PRD o ustalonej strukturze — wiernie, bez domyślania się i dopowiadania. Jeśli czegoś brakuje w notatkach, wpisuje to wprost w sekcji `## Open Questions`. Twoja niezdecydowana decyzja zostaje twoja.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l1-lesson-draft-1-10x.png)

Łatwo pomylić te dwie role i powiedzieć: "ok, uruchamiam `/10x-prd` na surowym pomyśle". Efekt? PRD wypełniony otwartymi pytaniami i ostrzeżenie, że to ty jeszcze nie skończyłeś myśleć.

Oba skille potrafią też pracować w trybie brownfield. Jeśli uruchomisz `/10x-shape` w katalogu istniejącego projektu (tam, gdzie leży `package.json`, `Cargo.toml` czy inny marker), skill auto-wykrywa kontekst i proponuje przełączenie na sesję brownfield. Zamiast pytać "co budujesz od zera", pyta "co chciałbyś dodać/poprawić w systemie?".

### Minimalne uruchomienie

Zanim odpalisz `/10x-shape`, potrzebujesz kursowego CLI — narzędzia, które dostarcza skille i materiały do twojego projektu. Nie musisz go instalować globalnie — uruchamiasz je przez `npx` z tagiem `@latest`, żeby zawsze mieć najnowszą wersję:

```bash
npx @przeprogramowani/10x-cli@latest auth
```

`auth` wysyła magic link na twój adres e-mail z platformy. Klikasz link, CLI zapisuje token lokalnie i od tego momentu masz dostęp do materiałów. To jednorazowy krok — nie musisz go powtarzać przy każdej lekcji.

Ważne: upewnij się, że podczas logowania do CLI podajesz poprawny adres e-mail, przypisany do Twojego konta Circle.

Drugi krok to pobranie paczki skilli dla tej lekcji:

```bash
npx @przeprogramowani/10x-cli@latest get m1l1
```

CLI pobiera skille z serwera i zapisuje je w twoim projekcie. Dla Claude Code lądują w `.claude/skills/`, dla Cursora w `.cursor/skills/`, dla Copilota w `.github/skills/`. Każda lekcja ma swoją paczkę — w tej dostaniesz `/10x-shape` i `/10x-prd`, których za chwilę użyjemy.


Ponowne uruchomienie `get m1l1` jest bezpieczne — CLI sprawdza, co już masz, i aktualizuje tylko to, co się zmieniło.

Bez `get` komendy z tej lekcji po prostu nie zadziałają. Każda lekcja w kursie zaczyna się od `npx @przeprogramowani/10x-cli@latest get <lessonId>` — to jedyny sposób, żeby dostarczyć skille do projektu. Tag `@latest` gwarantuje, że dostajesz najnowszą wersję CLI bez ręcznego aktualizowania — w pierwszych dniach kursu możemy iterować szybko.

CLI dostarcza też [helper skille](https://github.com/przeprogramowani/10x-cli/tree/master/skills), które uczą twojego agenta, jak pracować z tym narzędziem. Na starcie najważniejszy jest **`10x-cli-setup`** — skill, który przeprowadzi cię (a właściwie twojego agenta) przez instalację, autentykację i konfigurację CLI pod wybrane narzędzie AI. Jeśli coś nie zadziała przy `auth` albo `get`, agent z tym skillem potrafi zdiagnozować problem i poprowadzić cię do rozwiązania.

Zainstaluj go przez `npx skills`:

```bash
npx skills add przeprogramowani/10x-cli
```

Jeśli chcesz, żeby helper skille były dostępne we wszystkich twoich projektach, dodaj flagę `-g`:

```bash
npx skills add przeprogramowani/10x-cli -g
```

Alternatywnie — jeśli nie używasz `npx skills` — możesz pobrać `SKILL.md` bezpośrednio z [repozytorium na GitHubie](https://github.com/przeprogramowani/10x-cli/tree/master/skills/10x-cli-setup) i umieścić go ręcznie w katalogu skilli swojego agenta (np. `.claude/skills/10x-cli-setup/SKILL.md`).

W paczce jest też **`10x-cli-guide`** — skill do codziennego użycia: pobieranie paczek, listowanie modułów, przełączanie profili narzędzi, diagnostyka błędów. Jego pełny przegląd robimy w lekcji Od chatbota do Agenta (M1L2), gdzie zobaczysz, jak skille tego typu działają pod spodem. Na teraz wystarczy `auth`, `get` i `10x-cli-setup`.

### Sesja /10x-shape w praktyce

Weźmy przykład z preworku: aplikacja do tworzenia i powtarzania fiszek z AI.

Pierwsza wersja brzmi tak:

```text
Chcę zbudować aplikację do fiszek z AI.
Użytkownik wkleja tekst, AI generuje fiszki, a potem można je powtarzać.
```

To nie jest zły start. To po prostu za mało, żeby zaczynać implementację.

Kto jest użytkownikiem? Co znaczy "powtarzanie"? Który moment w aplikacji daje realną wartość? Czy pod spodem jest jakakolwiek logika biznesowa, czy to kolejny CRUD z ładnym opisem?

Pokusa jest prosta: "przygotuj PRD dla aplikacji do fiszek z AI". Model odpowie składnie, często nawet profesjonalnie. Tyle że taki dokument może tylko elegancko opakować twoją niepewność.

Sesja `/10x-shape` wymusza inną drogę. Startuje jedną komendą:

```text
/10x-shape
```

Agent przejmuje prowadzenie. Przeprowadza cię przez sześć faz w stałej kolejności:

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l1-lesson-draft-2-10x.png)

W fazie **Vision & problem** Agent pyta: co dokładnie chcesz rozwiązać i czemu. W naszym przykładzie to moment, kiedy "aplikacja do fiszek z AI" musi się zmienić w konkretny problem konkretnej osoby.

W fazie **Persona & access control** pyta: kto z tego korzysta i jakie ma prawa. "Użytkownik" to za mało. Agent dociśnie cię do "dorosły learner, który sam dobiera materiały i po sesji nauki chce zamienić przeczytany tekst w fiszki, którym ufa."

W fazie **MVP discipline** przychodzi weryfikacja zakresu. Jeśli twój pierwszy przepływ wymaga więcej niż trzech tygodni pracy po godzinach, Agent nie zabroni. Ale wyłoży na stół koszt i poprosi o świadome potwierdzenie, że bierzesz dłuższy timeline na siebie.

W fazach **Functional Requirements (FRs) + user stories** i **Business logic + data** wymagania rozpisują się na konkretne decyzje. Agent uruchamia tu dwa mechanizmy, które łatwo ominąć w samodzielnym myśleniu:

- **Per-FR Socratic challenge** — przy każdym wymaganiu pyta: "co musiałoby być prawdą, żeby ten FR był błędny?". To test, czy umiesz obronić własną decyzję, a nie tylko ją wymyślić.
- **Empty-CRUD detection** — jeśli twoja logika biznesowa to "user dodaje fiszki i przegląda je", Agent powie ci wprost, że budujesz pusty CRUD. Wymusi konkretną regułę domenową: generacja fiszek z wklejonego tekstu, bramka akceptacji/odrzucenia przed zapisem, algorytm powtórek — coś, co naprawdę zamienia dane w wartość.

Szósta faza, **Product framing**, zamyka odkrywanie. Ale to jeszcze nie koniec — Agent przechodzi przez **closing soft-gate** z sześcioma kontrolnymi pytaniami:

1. Access control — czy wiesz, kto ma do czego dostęp?
2. Data model — czy wiesz, jakie dane potrzebujesz?
3. Business logic — czy masz jednozdaniową regułę biznesową?
4. Project artifacts — czy masz zdefiniowane artefakty pracy?
5. MVP-in-three-weeks — czy pierwszy przepływ zmieści się w trzy tygodnie pracy po godzinach?
6. Non-goals — czy wiesz, czego *nie* budujesz?

Agent pokazuje, gdzie brakuje ci odpowiedzi. Możesz zignorować ostrzeżenie, ale nie możesz go nie zobaczyć.

Twoja rola w sesji to odpowiadać konkretnie — także wtedy, gdy uczciwa odpowiedź brzmi "nie wiem".

"Nie wiem" jest sygnałem do sesji, nie do kodu.

#### Przed i po sesji

Wynik to `shape-notes.md` — zapis decyzji, nie zapis rozmowy. Porównaj punkt wejścia z tym, co z sesji wychodzi:

Przed:

```text
Aplikacja do fiszek z AI — wklejasz tekst, dostajesz fiszki, powtarzasz.
```

Po sesji `/10x-shape`, w `shape-notes.md`:

```text
Produkt dla dorosłego learnera, który sam dobiera materiały i po sesji nauki chce szybko zamienić przeczytany tekst w fiszki, którym ufa.

Pierwszy przepływ:
1. Użytkownik wkleja fragment tekstu.
2. AI generuje propozycje fiszek.
3. Użytkownik akceptuje, edytuje lub odrzuca każdą propozycję.
4. Zaakceptowane fiszki trafiają do talii z algorytmem powtórek.

Poza MVP:
- import z PDF-ów i stron WWW,
- współdzielone talie,
- wiele algorytmów powtórek,
- aplikacja mobilna,
- ręczne tworzenie fiszek bez AI.

Kryterium sukcesu:
≥ 75% propozycji AI jest akceptowanych przez użytkownika — fiszki są na tyle dobre, że learner im ufa.
```

To już jest materiał, z którym `/10x-prd` może pracować. Nie gotowa aplikacja, ale wystarczająca baza do kontraktu.

Czy to wolniejsze niż wejście prosto w kod? Przez pierwszą godzinę — tak. Ale dzięki temu zaoszczędzisz ogrom czasy, które mógłbyś zmarnować na kodowanie rzeczy, których nie potrafiłeś konkretnie opisać.

### Generacja PRD: /10x-prd

Drugi krok to wygenerowanie PRD z notatek:

```text
/10x-prd @context/foundation/shape-notes.md
```

`/10x-prd` domyślnie czyta `context/foundation/shape-notes.md` i pisze `context/foundation/prd.md`. Robi jedną rzecz: zapisuje twoje decyzje w stałej strukturze, żeby kolejne agentowe kroki miały skąd je czytać.

PRD opisuje produkt i biznes, nie technologię. W środku znajdziesz wizję, personę, kryteria sukcesu, user stories, wymagania funkcjonalne, jednozdaniową logikę biznesową, model danych, kontrolę dostępu, jawne non-goals i listę otwartych pytań.

Tech stack, plan testów i deployment celowo nie są w PRD — wpadną do dalszych skilli, które konsumują PRD jako wejście.

### Hollow PRD: kiedy /10x-prd ostrzega

Jest jedna sytuacja, w której `/10x-prd` daje ci wyraźny sygnał: kiedy `shape-notes.md` jest za cienki.

Skill sprawdza notatki pod kątem czterech sygnałów: checkpoint, wymagania w formacie FR-NNN, user stories ze strukturą Given/When/Then, jednozdaniowa reguła biznesowa. Jeśli zabraknie zbyt wielu, dostajesz ostrzeżenie z konkretnymi brakami i propozycją powrotu do `/10x-shape`.

Każdą rzecz, której w notatkach po prostu nie ma, `/10x-prd` przepisze wprost do sekcji `## Open Questions` w PRD. Zostawi pytanie i pójdzie dalej — zamiast wymyślać za ciebie, że twoja persona to "junior developer w wieku 24 lat z dużego miasta".

To jest dobre zachowanie. Musisz jednak wziąć za to odpowiedzialność i udzielić brakujących odpowiedzi zanim przejdziesz do implementacji funkcji.

Częsty błąd: kursant patrzy na ostrzeżenie i `## Open Questions`, myśli "Agent się nie postarał", ignoruje sygnał i idzie do kodu.

Po dwóch tygodniach widzi, że budował aplikację bez decyzji o personie, bez reguły biznesowej i bez kryterium sukcesu — bo PRD od początku był zbyt mglisty.

![](https://images.przeprogramowani.pl/diagrams/lessons-m1-l1-lesson-draft-3-10x.png)

Zasada: gapy w `## Open Questions` to *twoje* nieskończone decyzje, nie deficyt Agenta. Reakcja jest jedna — wracasz do `/10x-shape`, nie do kodu.

### Kontrola po wygenerowaniu PRD

Zamykające soft-gate'y w `/10x-shape` to twój pierwszy filtr — Agent pokazuje braki jeszcze w trakcie sesji. Po wygenerowaniu PRD warto zrobić drugi, lżejszy przegląd.

Otwórz `prd.md` i odpowiedz sobie:

- Czy widzisz jednego konkretnego użytkownika, nie "developera ogółem"?
- Czy pierwszy przepływ da się przejść od początku do końca w trzech tygodniach pracy po godzinach?
- Czy logika biznesowa to konkretna reguła, a nie "user dodaje rekordy"?
- Czy są jawne non-goals, czy tylko "zostawiamy na potem"?
- Czy `## Open Questions` jest pusta albo zawiera tylko naprawdę otwarte rzeczy?

Jeśli któraś odpowiedź cię niepokoi — wracasz do `/10x-shape`, nie do kodu z myślą "doprecyzuję po drodze".

### Nie tylko na start projektu

Ten workflow to nie rytuał inicjacyjny — powinien stać się nowym nawykiem przy rozpoczynaniu większych inicjatyw.

Kursanci najczęściej odpalają `/10x-shape` raz, na starcie projektu, i potem wracają do starego trybu — prosto do kodu. Tydzień później dodają nowy moduł, integrację albo poważną zmianę przepływu, a Agent nie ma żadnego kontraktu do tych zmian.

Kiedy za dwa tygodnie będziesz dodawać nowy moduł, zrób miniwersję tej samej sesji. Czasem wystarczy krótki shape pod konkretną funkcję zamiast pełnego PRD.

Zasada zostaje: zanim Agent zacznie edytować pliki, musi wiedzieć, jaki problem rozwiązujemy i po czym poznamy, że praca jest skończona.

### Brownfield: sesja na istniejącym projekcie

Nie każdy kursant startuje od zera. Jeśli twój projekt kursowy to zmiana w istniejącym systemie — nowy moduł w side-projectcie, rozbudowa narzędzia z pracy, refaktor kluczowego przepływu — workflow shape/prd działa tak samo, ale `/10x-shape` przełącza się na tryb brownfield.

W praktyce: uruchamiasz `/10x-shape` w katalogu istniejącego projektu. Skill wykrywa markery (`package.json`, `tsconfig.json`, `Cargo.toml`, `go.mod` itp.), proponuje tryb brownfield i czeka na twoje potwierdzenie. Możesz też ręcznie przełączyć tryb, jeśli auto-detekcja nie trafiła.

Te same sześć faz, ale pytania przesuwają się z "co budujesz od zera" na "co zmieniasz w tym, co już masz":

- **Vision & problem** — co jest dzisiaj, co boli i dlaczego teraz (zamiast "kto ma problem z niczego").
- **Persona & access control** — jak wygląda obecne uwierzytelnianie i kto ma jakie role (zamiast projektowania auth od zera).
- **MVP discipline** — jaka jest najmniejsza zmiana, która udowodni poprawę, i jaki jest jej blast radius. Zamiast "MVP-in-three-weeks" od pustego projektu: delta, którą da się dowieźć i zweryfikować.
- **FRs & user stories** — wymagania kategoryzowane jako nowe, zmodyfikowane lub zachowane (zamiast traktowania wszystkiego jako nowe).
- **Business logic & data** — czy ta zmiana dodaje nową regułę domenową, modyfikuje istniejącą, czy to zmiana infrastrukturalna.
- **Product framing** — czy zmienia się typ produktu, skala, ograniczenia (bramki tak/nie zamiast pełnej klasyfikacji od zera).

Na koniec sesji `shape-notes.md` zawiera dwie sekcje, których greenfield nie ma: `## Current System` (opis tego, co istnieje) i `## Constraints & Preserved Behavior` (co musi zostać nienaruszone). Closing soft-gate dodaje też siódmy punkt: zachowane zachowania explicite nazwane.

#### Brownfield PRD

Kiedy `/10x-prd` widzi `context_type: brownfield` w `shape-notes.md`, przełącza się na inny szablon. Zamiast 11 sekcji greenfield generuje 12 sekcji zorientowanych na deltę zmiany:

1. **Current System Overview** — co istnieje: architektura, stack, baza użytkowników.
2. **Problem Statement & Motivation** — co boli i dlaczego teraz.
3. **User & Persona** — kto jest dotknięty zmianą.
4. **Success Criteria** — po czym poznamy, że zmiana zadziałała.
5. **User Stories** — co się zmieni z perspektywy użytkownika (delta, nie pełna lista).
6. **Scope of Change** — co dodajemy, modyfikujemy, usuwamy (explicite).
7. **Constraints & Compatibility** — backward compat, migracje danych, zachowane integracje.
8. **Business Logic Changes** — dodane lub zmienione reguły domenowe.
9. **Data Model Changes** — delty schematu, nie pełny schema.
10. **Access Control Changes** — zmiany uprawnień, jeśli są.
11. **Non-Goals** — czego NIE zmieniamy.
12. **Open Questions** — co wymaga decyzji.

Kluczowa różnica: greenfield PRD opisuje cały produkt od zera. Brownfield PRD opisuje deltę — co jest dzisiaj, co się zmienia, co musi zostać.

W m1-l2 będziesz oceniać swój stack (zamiast wybierać nowy), a w m1-l3 robić health-check projektu (zamiast go bootstrapować). Brownfield PRD będzie kontraktem wejściowym dla tych kroków — tak jak greenfield PRD jest kontraktem wejściowym dla tech-stack-selectora i bootstrappera.

## Deep Dive

### Dlaczego Agent ma pytać

Wymagania produktowe zaczynają się od języka naturalnego. Człowiek opisuje problem, pomija oczywistości, miesza życzenia z decyzjami i zakłada, że druga strona "wie, o co chodzi".

Jeśli od razu poprosisz model o dokument, uzupełni braki najbardziej prawdopodobnymi założeniami. Dostaniesz tekst, który wygląda kompletnie, ale może zawierać decyzje, których nigdy nie podjąłeś.

W pracy agentowej to szczególnie niebezpieczne. Agent potrafi potem bardzo konsekwentnie implementować błędne założenie. Dlatego wybieramy kolejność: najpierw pytania, potem dokument.

### PRD jako kontrakt dla kolejnych kroków

W preworku mówiliśmy o prompcie agenta jako kontrakcie. PRD działa podobnie, tylko na wyższym poziomie.

Prompt zadaniowy mówi: "zrób teraz tę konkretną rzecz."

PRD mówi: "to jest świat, w którym ta rzecz ma sens."

Bez PRD kolejne prompty zaczną dryfować. Raz poprosisz o logowanie, raz o dashboard, raz o przypomnienia, raz o statystyki.

Każdy prompt osobno może brzmieć poprawnie, ale całość zacznie przypominać produkt budowany z kolejnych wieczornych zachcianek.

PRD daje Agentowi stabilniejszy punkt odniesienia:

- użytkownik i problem ograniczają fantazję,
- MVP ogranicza rozrost funkcji,
- non-goals chronią przed "przy okazji doróbmy jeszcze...",
- kryteria sukcesu pomagają później pisać plan i akceptację,
- otwarte pytania przypominają, gdzie nadal nie mamy pewności.

W kolejnej lekcji (m1-l2) zajrzymy pod maskę toolkitu, którego przed chwilą użyłeś — skille, metaprompting, struktura projektu agentowego — i wykorzystamy PRD do wyboru tech stacku pod konkretny problem, a nie pod modę.

W m1-l3 PRD razem z wybranym stackiem trafia do bootstrapu projektu. To lekcja, w której agentowe kroki zamieniają twój kontrakt w pierwsze pliki.

Workflow `/10x-shape → /10x-prd → wybór stacku → bootstrap` rozkłada się na trzy lekcje, ale to jeden ciąg. Jeśli pierwszy kontrakt jest pusty, reszta będzie tylko szybszym sposobem dowożenia złych decyzji.

Szybciej nie zawsze znaczy lepiej. Czasem znaczy po prostu... szybciej w ścianę.

Po zakończeniu pracy powinieneś mieć dwa pliki w `context/foundation/`: `shape-notes.md` z sesji `/10x-shape` i `prd.md` wygenerowany przez `/10x-prd`.

Albo — jeśli sesja ujawniła, że pomysł jeszcze nie dojrzał — wyraźną listę decyzji, które musisz zamknąć, zanim PRD będzie miał ręce i nogi.

## Zadania praktyczne

Zanim przejdziesz do m1-l2, przejdź pełny cykl na własnym pomyśle lub projekcie:

- **Greenfield** (startujesz od zera): `auth` + `get m1l1` (patrz sekcja Minimalne uruchomienie), `/10x-shape` w pustym katalogu, `/10x-prd`. Sprawdź, czy PRD ma jednego użytkownika, jeden problem, pierwszy przepływ na trzy tygodnie, jednozdaniową logikę biznesową, granice MVP, jawne non-goals i kryterium sukcesu.
- **Brownfield** (zmieniasz istniejący projekt): `auth` + `get m1l1`, `/10x-shape` w katalogu istniejącego projektu. Skill zaproponuje tryb brownfield — potwierdź i przejdź sesję skupioną na bólu obecnego systemu i najmniejszej wartościowej zmianie. `/10x-prd` wygeneruje brownfield PRD z opisem obecnego systemu, zakresem zmiany i ograniczeniami kompatybilności.

Twoim zadaniem jest dać Agentowi coś konkretnego zamiast twojej niepewności. Miłość do dokumentacji przyjdzie z czasem — albo i nie, ale kontrakt zostanie.

---

## Materiały dodatkowe

- Atlassian, "What is a Product Requirements Document?" — https://www.atlassian.com/agile/product-management/requirements
- QUARE, "towards a question-answering model for requirements elicitation" — https://link.springer.com/article/10.1007/s10515-023-00386-w
- Anthropic, "Building effective agents" — https://www.anthropic.com/engineering/building-effective-agents
- OpenAI Academy, "Prompting fundamentals" — https://openai.com/academy/prompting/
- GitHub Docs, "About GitHub Copilot cloud agent" — https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
