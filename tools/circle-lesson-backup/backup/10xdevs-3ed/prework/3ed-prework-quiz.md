# Prework 3ed — Quiz diagnostyczny

## Cel quizu

Quiz pomaga uczestnikowi ocenic, ktore moduly preworku sa dla niego **konieczne**, a ktore moze **pominac lub przejrzec pobieznie**. Caly prework jest opcjonalny w tym sensie, ze ktos z doswiadczeniem moze go przeskoczyc — ale dla wielu osob bedzie obowiazkowy w calosci.

Quiz NIE ocenia. Quiz SUGERUJE sciezke.

---

## Learning outcomes wyluslane z draftu

### Modul 1 — Wiecej niz ChatGPT

| ID | Learning outcome | Blok |
|----|-----------------|------|
| LO-1 | Rozroznia chatbot / agent / harness i rozumie role operatora | 1.1 |
| LO-2 | Widzial realna sesje agenta na produkcyjnym repo od poczatku do konca | 1.2 |

### Modul 2 — Tooling do programowania z AI

| ID | Learning outcome | Blok |
|----|-----------------|------|
| LO-3 | Rozumie komplementarnosc agent IDE + agent CLI i wie kiedy po ktore siegnac | 2.1 |
| LO-4 | Ma zainstalowanego Cursora, zna tryby pracy (inline edit, chat, agent) i ma ustawiony Privacy Mode | 2.2 |
| LO-5 | Ma dzialajacego Claude Code, zna podstawowe komendy i umie czytac wyjscie agenta | 2.3 |
| LO-6 | Zna kierunek agent-native IDE i flagowe przyklady (Codex Desktop, Antigravity, Conductor) | 2.4 |
| LO-7 | Przeszedl pelny cykl: zadanie → agent → wynik → weryfikacja | 2.5 |

### Modul 3 — Jak to dziala pod maska

| ID | Learning outcome | Blok |
|----|-----------------|------|
| LO-8 | Rozumie praktyczne konsekwencje architektury LLM: tokeny, okno kontekstowe, halucynacje, koniecznosc review | 3.1 |
| LO-9 | Zna anatomie dobrego prompta i rozpoznaje typowe antywzorce | 3.2 |
| LO-10 | Rozumie dryf kontekstu, zna roznice miedzy compact / clear / nowy watek i wie kiedy restartowac | 3.3 |
| LO-11 | Ma praktyczna regule kciuka dot. jezyka pracy z AI | 3.4 |
| LO-12 | Wie jaki model ustawic na start i gdzie sledzic zmiany | 3.5 |

### Modul 4 — Przygotowania do projektu

| ID | Learning outcome | Blok |
|----|-----------------|------|
| LO-13 | Orientuje sie w kursowym stacku (Astro, React, TS, Tailwind, Supabase) i wie czego nie musi jeszcze znac | 4.1 |
| LO-14 | Ma realistyczny pomysl na projekt kursowy z okreslonym zakresem | 4.2 |
| LO-15 | Wie jak poruszac sie po Circle i gdzie szukac pomocy | 4.3 |

---

## Pytania quizowe

### Sekcja A — Agent i model mentalny

**A1. Jak opisalbyś swoje obecne rozumienie agentow AI?**

- **(a)** Dla mnie ChatGPT, Copilot i "agent" to mniej wiecej to samo — model odpowiada na pytania.
- **(b)** Wiem, ze agent robi cos wiecej niz chatbot, ale nie potrafie precyzyjnie wyjasnic roznicy.
- **(c)** Rozrozniam chatbot, agent i harness. Wiem, ze agent dziala w petli (plan → akcja → obserwacja), a harness to warstwa, ktora mu to umozliwia.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 1.1** (definicje) + **obejrzyj 1.2** (demo) |
| (b) | → **Przejrzyj 1.1** pobieznie, **obejrzyj 1.2** |
| (c) | → Mozesz pominac M1 lub potraktowac jako powtorke |

---

**A2. Czy widziales/as kiedys ciagla sesje pracy z agentem AI na realnym repozytorium — od pobrania zadania do dzialajacego rozwiazania?**

- **(a)** Nie. Znam AI z chatow i autocomplete, ale nie widzialem agenta w akcji na kodzie.
- **(b)** Widzialem demo lub tutorial, ale na zabawkowym przykladzie.
- **(c)** Tak — widzialem lub sam przeprowadzilem sesje, w ktorej agent eksplorowal repo, planowal, implementowal i testowal.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Obejrzyj 1.2** — to kluczowe dla zrozumienia, po co reszta preworku |
| (b) | → **Obejrzyj 1.2** — zobaczysz roznice miedzy demo a realna praca |
| (c) | → Mozesz pominac 1.2 |

---

### Sekcja B — Narzedzia

**B1. Z jakich narzedzi AI do kodowania korzystasz na co dzien?**

- **(a)** Glownie ChatGPT / Claude w przegladarce. Wklejam kod, dostaje odpowiedz.
- **(b)** Copilot lub Cursor — ale glownie autocomplete i czat w panelu bocznym.
- **(c)** Cursor w trybie agenta LUB Claude Code — regularnie deleguje zadania wieloplikowe, agent edytuje kod i odpala komendy.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob caly M2** (2.1–2.5) — to bedzie dla Ciebie nowy tryb pracy |
| (b) | → **Przejrzyj 2.1**, **przerob 2.2 i 2.3**, **zrob 2.5** |
| (c) | → Przejrzyj 2.1 pobieznie, skup sie na brakujacym narzedziu (Cursor lub CC) |

---

**B2. Cursor — jaki jest Twoj obecny poziom?**

- **(a)** Nie mam zainstalowanego Cursora / nie wiem co to.
- **(b)** Mam Cursora, ale uzywam go glownie jako VS Code z chatem.
- **(c)** Znam tryby pracy (inline edit, chat, agent), umiem dodawac kontekst, mam ustawiony Privacy Mode.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 2.2** od poczatku |
| (b) | → **Przerob 2.2** — szczegolnie tryb agenta i Privacy Mode |
| (c) | → Mozesz pominac 2.2 lub potraktowac jako referencje |

---

**B3. Claude Code — jaki jest Twoj obecny poziom?**

- **(a)** Nie wiem co to Claude Code.
- **(b)** Slyszalem/am, ale nie instalowalem/am.
- **(c)** Mam dzialajacego Claude Code, znam /help, /clear, /compact i umiem czytac wyjscie agenta.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 2.3** od poczatku |
| (b) | → **Przerob 2.3** — instalacja + podstawy operacyjne |
| (c) | → Mozesz pominac 2.3 lub potraktowac jako sciagawke |

---

**B4. Czy wykonales/as kiedys pelne zadanie z agentem AI: od opisu → przez prace agenta → do zweryfikowanego wyniku?**

- **(a)** Nie — do tej pory tylko pytalem/am i dostawalem/am odpowiedzi tekstowe.
- **(b)** Probowalem/am, ale nie jestem pewien/pewna czy wynik byl poprawny.
- **(c)** Tak — znam pelny cykl i potrafie zweryfikowac wynik agenta.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Zrob 2.5** (mini-task) — to zdejmie tarcie mentalne przed M1 |
| (b) | → **Zrob 2.5** — tym razem z pelna weryfikacja |
| (c) | → Mozesz pominac 2.5 |

---

### Sekcja C — Jak to dziala pod maska

**C1. Co wiesz o tym, jak dzialaja modele jezykowe (LLM-y)?**

- **(a)** Niewiele — wiem ze to "AI", ale nie wiem jak to wplywa na moja prace.
- **(b)** Wiem o tokenach i ze model moze halucynowac, ale nie rozumiem dlaczego.
- **(c)** Rozumiem tokenizacje, wiem ze wieksze okno kontekstowe ≠ lepsza jakosc, rozumiem halucynacje jako ceche systemu i wiem dlaczego review jest obowiazkowe.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 3.1** — to fundament mentalny |
| (b) | → **Przejrzyj 3.1** — moze uzupelnic luki |
| (c) | → Mozesz pominac 3.1 |

---

**C2. Jak opisalbyś swoje podejscie do pisania promptow?**

- **(a)** Pisze co mi przychodzi do glowy, bez struktury.
- **(b)** Staram sie byc precyzyjny/a, ale nie mam systemu — czasem dziala, czasem nie.
- **(c)** Znam elementy dobrego prompta (rola, kontekst, instrukcja, ograniczenia, oczekiwane wyjscie) i swiadomie unikam typowych antywzorcow.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 3.2** — to zmieni jakosc Twoich interakcji z AI |
| (b) | → **Przerob 3.2** — ulozy to w system |
| (c) | → Mozesz pominac 3.2 lub potraktowac jako checklist |

---

**C3. Co robisz, kiedy dluga rozmowa z AI zaczyna dawac coraz gorsze odpowiedzi?**

- **(a)** Kontynuuje i probuje przeformulowac pytanie. Nie wiem czemu jakosc spada.
- **(b)** Wiem ze to problem kontekstu, ale nie wiem kiedy dokladnie restartowac ani jaka opcje wybrac.
- **(c)** Rozumiem dryf kontekstu. Wiem kiedy uzyc compact, kiedy clear, a kiedy zaczac nowy watek.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 3.3** — to wyrozniajacy temat 3. edycji |
| (b) | → **Przerob 3.3** — szczegolnie compact vs clear vs nowy watek |
| (c) | → Mozesz pominac 3.3 |

---

**C4. Czy wiesz, jaki model AI ustawic w Cursorze lub Claude Code na start kursu?**

- **(a)** Nie — uzywam domyslnego i nie wiem jakie sa alternatywy.
- **(b)** Mniej wiecej wiem jakie modele istnieja, ale nie wiem ktory do czego.
- **(c)** Wiem ktory model do jakich zadan i gdzie sledzic zmiany (blogi, changelogi).

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przejrzyj 3.5** |
| (b) | → **Przejrzyj 3.5** pobieznie |
| (c) | → Mozesz pominac 3.5 |

---

### Sekcja D — Przygotowanie do projektu

**D1. Jak dobrze znasz kursowy stack: Astro, React, TypeScript, Tailwind, Supabase?**

- **(a)** Wiekszosc z tego widze pierwszy raz.
- **(b)** Znam niektore elementy (np. React lub TypeScript), reszta jest nowa.
- **(c)** Znam caly stack lub jego wiekszosc — nie potrzebuje orientacji.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 4.1** — nie musisz znac stacku, ale orientacja zmniejszy tarcie w M1 |
| (b) | → **Przejrzyj 4.1** — skup sie na nieznanych elementach |
| (c) | → Mozesz pominac 4.1 |

---

**D2. Czy masz pomysl na projekt kursowy?**

- **(a)** Jeszcze nie myslalem/am o tym.
- **(b)** Mam mglisty pomysl, ale nie wiem czy jest realistyczny.
- **(c)** Mam konkretny pomysl z jasnym zakresem, wykonalny w czasie kursu.

| Odpowiedz | Sugestia |
|-----------|----------|
| (a) | → **Przerob 4.2** — pomoze Ci wybrac realistyczny projekt |
| (b) | → **Przejrzyj 4.2** — zweryfikuj swoj pomysl pod katem dobrych/zlych cech |
| (c) | → Mozesz pominac 4.2 |

---

## Logika rekomendacji

### Sumaryczna mapa: odpowiedz → bloki do przerobienia

| Pytanie | (a) → przerob | (b) → przejrzyj/przerob | (c) → pomiń |
|---------|---------------|--------------------------|-------------|
| A1 | 1.1, 1.2 | 1.1 (pobieznie), 1.2 | — |
| A2 | 1.2 | 1.2 | — |
| B1 | 2.1–2.5 (caly M2) | 2.1, 2.2, 2.3, 2.5 | brakujace narzedzie |
| B2 | 2.2 | 2.2 | — |
| B3 | 2.3 | 2.3 | — |
| B4 | 2.5 | 2.5 | — |
| C1 | 3.1 | 3.1 | — |
| C2 | 3.2 | 3.2 | — |
| C3 | 3.3 | 3.3 | — |
| C4 | 3.5 | 3.5 (pobieznie) | — |
| D1 | 4.1 | 4.1 (czesciowo) | — |
| D2 | 4.2 | 4.2 | — |

> Bloki 2.4 (Agent-Native IDE) i 3.4 (jezyk pracy z AI) sa opcjonalne i nie sa pokryte quizem — uczestnik siega po nie z ciekawosci. Blok 4.3 (checklista + Circle) jest obowiazkowy dla wszystkich.

---

### Profile uczestnikow — trzy sciezki

**Sciezka A: "Nowy w swiecie agentow"**
Wiekszosc odpowiedzi (a).

→ Przerob caly prework od poczatku do konca. Kazdy modul jest dla Ciebie. Nie pomijaj — M1 zaklada, ze masz to za soba.

**Sciezka B: "Uzywam AI, ale nie agentowo"**
Mix odpowiedzi (a) i (b), z kilkoma (c) w toolingu.

→ Mozesz przejsc M1 szybciej (pobieznie). Skup sie na M2 (tooling) i M3 (teoria). Zrob mini-task (2.5). Przejrzyj M4.

**Sciezka C: "Pracuje z agentami na co dzien"**
Wiekszosc odpowiedzi (c).

→ Przejrzyj prework jako checklist. Upewnij sie, ze masz Cursora i Claude Code skonfigurowane pod kurs. Przerob 4.2 (projekt) i 4.3 (Circle). Reszta to powtorka.

---

## Uwagi implementacyjne

- Quiz powinien byc na poczatku preworku — zanim uczestnik zacznie pierwszy modul.
- Wynik quizu to **sugestia**, nie blokada — uczestnik moze przerobic wszystko niezaleznie od wyniku.
- Bloki oznaczone jako `core` w drafcie sa rekomendowane nawet dla doswiadczonych (przynajmniej pobieznie).
- Blok 4.3 (checklista + Circle) jest zawsze obowiazkowy — niezaleznie od profilu.
- Quiz mozna zaimplementowac jako interaktywny formularz na Circle lub jako statyczna checkliste do samodzielnej oceny.
