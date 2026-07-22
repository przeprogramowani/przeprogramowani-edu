# Przepis na korektę egzaminów (Space Explorers)

Notatka robocza spisana po rewizji `m1-landing-pad/exams.ts`. Uzupełnia `rules.md`
(styl prozy) i pamięć `explorers-exam-style` (staging fikcji w stemach, dystraktory z
realnych błędnych przekonań, wymieszany klucz). Tu zbieramy **na co Przemek zwraca uwagę
przy poprawianiu pytań** — do stosowania przy kolejnych egzaminach.

## Reguły korekty

1. **Konkretny, „zmysłowy" skrót w stemie.** Pokušę opisz jako realny, kuszący gest
   („zrobić zdjęcie tablicy, wysłać do CORE AI i poczekać na wynik"), a nie abstrakcyjnie
   („wkleić mętny pomysł i napisać: przygotuj dokument"). Skrót ma być czymś, co gracz
   naprawdę chciałby zrobić.

2. **Poprawna odpowiedź mówi WPROST, co zrobić dobrze** — nazywa właściwą praktykę
   („przeprowadzić sesję pogłębiających pytań i odpowiedzi, aż wydobędzie wasze
   rzeczywiste potrzeby"), zamiast tłumaczyć „dlaczego". Pytanie stawiamy jako wybór ruchu
   („który sposób da lepszy efekt?", „jak przygotowujesz maszynę na te luki?"), nie jako
   „dlaczego X".

3. **Nie dokładaj pojęć spoza polecenia.** Jeśli instrukcja mówi o „wyniku", nie zawężaj
   do „PRD"/„dokumentu". Trzymaj się poziomu idei, którą testujemy — nie anchoruj na
   konkrecie, którego nie było w poleceniu.

4. **Zero żargonu narzędziowego/plikowego w treści egzaminu.** Wywalamy nazwy plików
   (`shape-notes.md`), komend i skilli (`/10x-shape`), ścieżek. Egzamin zostaje
   konceptualny — techniczne terminy zostają tylko tam, gdzie są sednem sprawdzanej wiedzy.

5. **Dystraktory jako nazwane archetypy błędu.** Sprawdzone, dobrze grające typy:
   - **nadmierna specyfikacja / za głęboki detal wykonawczy** (np. „twardość i cena stopu
     aluminium" w pytaniu o zakres planowania),
   - **nieistotny szum** (np. „humor mieszkańców obozu"),
   - **spięcie/skrócenie procesu** (np. „etap planowania można połączyć z budową",
     „przerwać i zacząć sesję od nowa"),
   - **zgadywanie / autogenerowanie** (uzupełnić luki „najsensowniejszym domysłem"),
   - **pomijanie** (pominąć wszystko nierozstrzygnięte).

6. **Poprawna nie może być najdłuższa ani najbardziej rozbudowana.** Wyrównuj długości
   opcji; gdy poprawna wychodzi obszerna — skróć ją i dopchnij dystraktory.

7. **Wymieszany klucz w obrębie egzaminu.** Nigdy wszystkie te same litery
   (m1-landing-pad po korekcie: `b / a / c`).

## Ślad zmian w m1-landing-pad (przykład wzorcowy)

- **q1** — reframe: skrót „zdjęcie → AI → wynik"; poprawna = sesja pytań pogłębiających
  potrzeby; odjęte „PRD" (nie było w poleceniu).
- **q2** — z „co robi skill" na „jak z góry przygotowujesz maszynę na luki"; poprawna =
  polecić z góry zbierać nierozstrzygnięte w sekcji „Pytania otwarte"; dystraktory:
  przerwa / autogenerowanie / pomijanie. Usunięte `shape-notes.md`.
- **q3** — zakres wczesnego planowania: poprawna = potrzeby załogi, koszty, czas;
  dystraktory: za głęboki detal materiałowy, nieistotny szum, spięcie planowania z budową.
