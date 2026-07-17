# Modul 1 — User Journey

## Zalozenia po preworku

Module 1 nie startuje od zera. Po preworku student:

- widzial demo agenta AI w praktyce i rozumie roznice miedzy chatbotem a agentem na poziomie operacyjnym,
- potrafi wykonac podstawowe zadania w `Cursorze` i ma skonfigurowane srodowisko pracy w IDE,
- ma dzialajacego `Claude Code` i zna podstawowe komendy oraz model pracy na diffach,
- rozumie fundamenty `Context Engineering 101` — tokeny, efektywne okno kontekstowe, anatomie prompta, context drift i thread restart,
- ma orientacje w kursowym stacku oraz podstawowy heads-up dotyczacy prywatnosci, kosztow modeli i review kodu generowanego przez AI.

To oznacza, ze Module 1 moze od pierwszej lekcji skupic sie na **planowaniu, delegowaniu, bootstrapie i onboardingu agenta**, zamiast na wdrozeniu do samych narzedzi.

---

## Lekcja 1: Od pomyslu do PRD

**Cel:** Student przechodzi od surowego pomyslu na projekt do ustrukturyzowanego dokumentu PRD, uczac sie brainstormingu i refinementu z agentem AI.

**Punkt startowy:** Student ma wizje projektu, ale brakuje mu struktury, jasnych granic i zdefiniowanego scope'u. Umie juz obsluzyc narzedzia AI, wie czym jest context drift i potrafi napisac sensowna instrukcje, ale nie pracowal jeszcze z agentem w kontekscie **planowania produktu**.

### Journey

1. Student zaczyna z surowym pomyslem na projekt — ma wizje, ale brakuje mu struktury i jasnych granic
2. Uruchamia sesje brainstormingowa z agentem AI, eksplorujac przestrzen problemu i potencjalne rozwiazania
3. Przeprowadza refinement pomyslu — precyzuje, co dokladnie projekt ma robic, dla kogo i dlaczego
4. Identyfikuje corner cases i edge case'y, ktore moglyby wykoleic projekt w pozniejszej fazie
5. Definiuje **non-goals** — swiadomie wyznacza granice tego, czego projekt NIE bedzie robil (kluczowe dla scope'u)
6. Poznaje kursowego CLI agenta i wbudowany **Skill do PRD** — uruchamia go na swoim pomysle
7. Obserwuje, jak agent generuje ustrukturyzowany dokument PRD na bazie wczesniejszego brainstormingu
8. Uczy sie, dlaczego zapisywanie wiedzy do plikow `.md` jest fundamentalne — kontekst, ktory przetrwa miedzy sesjami
9. Integruje swoje srodowisko z kursowym CLI workflow — konfiguruje narzedzie pod swoj sposob pracy
10. **Outcome:** Student konczy lekcje z gotowym PRD dla swojego projektu (nowego lub rozwijanego) i rozumie, ze dobry PRD to fundament pracy z agentem

**Stan koncowy:** Student ma gotowy PRD w pliku `.md`, skonfigurowany workflow planowania z agentem i zrozumienie, ze dobry PRD eliminuje zgadywanie agenta. Wie czym sa non-goals i dlaczego externalizacja wiedzy do plikow jest fundamentem pracy z AI.

---

## Lekcja 2: Nowe umiejetnosci Agenta — Built-in Tools & New Skills

**Cel:** Student poznaje taksonomie mozliwosci agenta (Tools vs Skills), tworzy pierwszego wlasnego skilla i podejmuje swiadoma decyzje o stacku technologicznym.

**Punkt startowy:** Student ma PRD z L1 i skonfigurowane srodowisko. Nie potrzebuje juz tlumaczenia podstaw obslugi `Cursora` i `Claude Code`, ale nie zna jeszcze taksonomii mozliwosci agenta, mechaniki `Tools vs Skills` ani sposobow rozszerzania jego workflow.

### Journey

1. Student poznaje taksonomie mozliwosci agenta — czym roznia sie **Tools** od **Skills** i kiedy uzywac ktorych
2. Eksploruje wbudowane narzedzia (Tools) — uczy sie, co agent potrafi "out of the box"
3. Przechodzi do Skills — gotowych, wielokrokowych przepisow, ktore rozszerzaja zdolnosci agenta
4. Poznaje koncept **Skill Creatora** i metaprompting — tworzenie nowych skilli za pomoca AI
5. Dostaje praktyczne zadanie: stworzyc skilla do **wyboru stacku technologicznego** na bazie swojego PRD
6. Analizuje swoje PRD pod katem wymagan technicznych — co stack musi wspierac
7. Konfrontuje wynik z gotowym rozwiazaniem — **10x-astro-starter** — i ocenia, czy pasuje do jego potrzeb
8. Podejmuje swiadoma decyzje: wlasny stack vs starter — rozumie trade-offy obu sciezek
9. Konfiguruje preferencje technologiczne w swoim srodowisku, zeby agent znal jego wybory w przyszlych sesjach
10. **Outcome:** Student ma wybrany stack technologiczny dopasowany do PRD i swoich preferencji, plus umiejetnosc tworzenia wlasnych skilli

**Stan koncowy:** Student ma wybrany i uzasadniony stack technologiczny, pierwszego wlasnego skilla (do wyboru stacka) i rozumie roznice miedzy Tools a Skills. Agent zna preferencje technologiczne studenta.

---

## Lekcja 3: Bootstrap

**Cel:** Student stawia dzialajacy projekt lokalnie — od konfiguracji bezpieczenstwa, przez bootstrap z agentem, po reuzywalny skill do powtarzania tego procesu.

**Punkt startowy:** Student ma PRD, wybrany stack i umiejetnosc tworzenia skilli z L2. Z preworku zna kursowy stack, podstawy pracy w CLI oraz bezpieczenstwo na poziomie heads-up, ale nie umie jeszcze skonfigurowac **permissions**, zaufanego workflow i bootstrapu projektu z agentem. Nie ma jeszcze kodu ani projektu. Jest gotowy do budowania.

### Journey

1. Student zaczyna od tematu **permissions** — poznaje praktyczne konsekwencje tego, co agent moze, a czego nie moze robic w systemie
2. Uczy sie podejscia **"Security by design"** — wbudowane mechanizmy bezpieczenstwa, nie nakladki po fakcie
3. Rozumie, dlaczego swiadome zarzadzanie uprawnieniami agenta chroni przed kosztownymi bledami (usuniete pliki, nadpisany kod)
4. Poznaje dwie sciezki bootstrapu projektu — **z AI** (agent stawia projekt) i **bez AI** (recznie, z pelna kontrola)
5. Porownuje obie sciezki — kiedy ktora ma sens, jakie sa ryzyka i korzysci
6. Otrzymuje walkthrough przez **10xAstroStarter** — gotowy template projektowy zoptymalizowany pod workflow z agentem
7. Analizuje strukture startera — jak jest zorganizowany, jakie konwencje wymusza, dlaczego tak a nie inaczej
8. Bootstrapuje swoj wlasny projekt — uzywajac startera lub od zera, w zaleznosci od decyzji z lekcji 2
9. Tworzy **10xSkill do bootstrapu** — reuzywalny przepis, ktory pozwoli mu (i innym) powtorzyc ten proces w przyszlosci
10. **Outcome:** Student ma postawiony, dzialajacy projekt z poprawna konfiguracja bezpieczenstwa i gotowy skill do bootstrapowania kolejnych projektow

**Stan koncowy:** Student ma dzialajacy projekt lokalnie z poprawna konfiguracja permissions, reuzywalny skill do bootstrapu i zrozumienie trade-offow miedzy bootstrapem z AI a recznym setupem.

---

## Lekcja 4: Agent Onboarding (Rules + Feedback Loops)

**Cel:** Student buduje systemowy onboarding agenta — pliki kontekstowe, reguly, hooki i feedback loopy, ktore sprawiaja ze agent uczy sie na bledach.

**Punkt startowy:** Student ma dzialajacy projekt z L3. Z preworku wie juz, ze istnieja pliki kontekstowe i zna pojecie `context drift`, ale dopiero teraz doswiadcza w praktyce, ze agent bez kontekstu projektowego popelnia bledy i lamie konwencje. Szuka systemowego rozwiazania zamiast poprawiania agenta za kazdym razem.

### Journey

1. Student uswiadamia sobie, ze agent bez kontekstu projektowego to jak nowy developer w pierwszym dniu pracy — potrzebuje onboardingu
2. Konfiguruje **statyczna analize kodu** pod potrzeby projektu i CI/CD — agent musi znac reguly, zanim zacznie pisac kod
3. Poznaje ekosystem plikow konfiguracyjnych: **Agents.md**, **Claude.md**, **AI Rules** — czym sie roznia, kiedy uzywac ktorego
4. Uczy sie mechanizmu **Memory** — jak agent zapamietuje ustalenia miedzy sesjami i dlaczego to zmienia jakosc wspolpracy
5. Buduje swoj pierwszy zestaw regul projektowych — koduje w plikach `.md` konwencje, ktorych agent ma przestrzegac
6. Poznaje koncept **feedback loop** — jak Agents.md i hooki tworza petle samokorygujaca sie w czasie rzeczywistym
7. Konfiguruje **hooki** — automatyczne reakcje na dzialania agenta (np. uruchom linter po kazdej edycji pliku)
8. Obserwuje, jak agent popelnia blad, i zamiast go recznie poprawiac, zapisuje regule w Agents.md — systemowe rozwiazanie zamiast jednorazowej poprawki
9. Otrzymuje tip na przyszlosc: gdy agent sie myli, pierwszym odruchem powinno byc pytanie "czy to brakujaca regula w Agents.md?" — nie "czy agent jest glupi?"
10. **Outcome:** Student ma w pelni "onboardowanego" agenta z regulami, hookami i feedback loopem — agent zna projekt i uczy sie na bledach

**Stan koncowy:** Student ma agenta z pelnym kontekstem projektowym (CLAUDE.md, Agents.md, Rules), skonfigurowanymi hookami i dzialajacym feedback loopem. Rozumie, ze inwestycja w onboarding agenta zwraca sie przy kazdej kolejnej sesji.

---

## Lekcja 5: Deployment z Agentem (CLIs + MCP)

**Cel:** Student buduje pelny deployment pipeline i konczy modul z projektem LIVE na chmurze, poznajac MCP i zarzadzanie sekretami.

**Punkt startowy:** Student ma dzialajacy projekt lokalnie z onboardowanym agentem z L4. Agent zna projekt, przestrzega regul, uczy sie na bledach. Student ma juz z preworku orientacje w stacku i narzedziach, ale brakuje mu drogi z localhost na produkcje oraz praktycznego modelu pracy `CLI vs MCP`.

### Journey

1. Student poznaje **omowienie procesu deploymentu** — co sie dzieje od momentu "kod dziala lokalnie" do "aplikacja jest live"
2. Porownuje dwie sciezki: **GitHub CLI + Cloudflare CLI** (bezposrednie komendy) vs **MCP** (agent jako posrednik) — trade-offy obu podejsc
3. Uczy agenta nowych umiejetnosci deploymentowych przez **AGENTS.md** — agent wie, jak wdrazac ten konkretny projekt
4. Konfiguruje **CI/CD pipeline** — od definicji krokow po integracje z agentem, ktory potrafi go uruchomic i monitorowac
5. Mierzy sie z tematem **sekretow** — jak bezpiecznie zarzadzac kluczami API, tokenami i credentials w srodowisku, gdzie agent ma dostep do terminala
6. Konfiguruje **DEV vs PROD configs** — rozdziela srodowiska, zeby agent nie wdrozyl przypadkiem testowego kodu na produkcje
7. Buduje pelny **Deployment Pipeline** — od pusha do repo, przez testy, build, az po deploy na chmure
8. Testuje pipeline end-to-end — puszcza zmiane przez caly proces i obserwuje, jak agent reaguje na ewentualne bledy
9. Rozwiazuje problemy pojawiajace sie przy pierwszym deployu — typowe pulapki (env variables, build errors, routing)
10. **Outcome:** Student ma swoj projekt **LIVE na chmurze** z dzialajacym pipeline'em CI/CD i agentem, ktory potrafi asystowac przy kolejnych wdrozeniach

**Stan koncowy:** Student ma projekt live na chmurze, dzialajacy pipeline CI/CD z obsluga sekretow i rozdzieleniem DEV/PROD. Zna dwie sciezki deploymentu (CLI vs MCP) i potrafi nauczyc agenta nowych umiejetnosci wdrozeniowych. Gotowy na Modul 2.
