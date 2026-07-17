# Relacja między 10xDevs a Space Explorers

## Cel tego dokumentu

Ten dokument wyjaśnia, jak należy rozumieć relację między główną zawartością szkolenia **10xDevs** a warstwą gry **Space Explorers**.

Najważniejszy punkt jest taki: **gra nie zastępuje kursu i nie kopiuje go 1:1**. Szkolenie i gra pełnią różne funkcje, ale są ze sobą ściśle powiązane. 10xDevs jest głównym programem edukacyjnym, a Space Explorers tworzy dodatkową warstwę progresji, fabuły i bezpiecznej praktyki.

---

## 1. Czym jest 10xDevs

10xDevs to program uczący pracy z AI w całym cyklu wytwarzania oprogramowania — od researchu i planowania, przez implementację, aż po utrzymanie produkcyjne. Jego filozofia opiera się na **powtarzalnym, production-grade procesie**, a nie na prompt trickach czy pokazach demo. Kurs stawia na realne repozytoria, realne API, realne problemy i kontekst inżynierski.

W praktyce oznacza to, że uczestnik podczas szkolenia:

* pracuje na własnym projekcie,
* buduje realne artefakty,
* podejmuje realne decyzje projektowe,
* uczy się wykorzystywać AI jako narzędzie inżynierskie, a nie tylko jako chatbota. 

Szczególnie w module 1 kurs zakłada budowę takich elementów jak:

* osobisty toolkit i bootstrap środowiska,
* context stack,
* PRD tworzone metodą sokratejską,
* integracje MCP i Agent Skills,
* evale oraz pętle feedbackowe. 

---

## 2. Czym jest Space Explorers

Space Explorers to narracyjno-zadaniowa warstwa towarzysząca kursowi. Fabularnie gracz wciela się w astronautę na misji eksploracyjnej złożonej z pięciu księżyców, z których każdy odpowiada jednemu modułowi kursu. Misja polega na stopniowym odzyskiwaniu zdolności CORE AI, a więc symbolicznie — na odzyskiwaniu kolejnych kompetencji z obszaru Agentic Engineering.

Każdy księżyc mapuje się bezpośrednio na moduł 10xDevs:

* Moon 1 → Agentic Environment
* Moon 2 → 10xDevs Workflow
* Moon 3 → AI Quality & Maintenance
* Moon 4 → Large Scale & Legacy
* Moon 5 → AI-Native Teamwork.

To oznacza, że gra nie ma własnego, niezależnego programu nauczania. Ona **organizuje tę samą progresję kompetencyjną w formie misji, świata i fabularnego celu**.

---

## 3. Kluczowa różnica: kurs buduje realny projekt, gra sprawdza transfer umiejętności

Najlepiej rozumieć tę relację w taki sposób:

**w 10xDevs uczestnik buduje własny, realny projekt full-stackowy**,
a **w Space Explorers sprawdza wybraną umiejętność z lekcji na osobnym, bezpiecznym lub symulowanym przypadku testowym**.

To rozróżnienie jest fundamentalne.

W kursie efektem lekcji jest zwykle:

* realny artefakt,
* realna decyzja,
* realny fragment systemu uczestnika.

W grze efektem nie musi być ten sam artefakt. Gra ma raczej sprawdzić, czy uczestnik:

* rozumie mechanizm,
* potrafi zastosować daną technikę,
* umie przenieść wiedzę na inny kontekst,
* działa świadomie, a nie tylko odtworzył schemat na własnym projekcie.

Innymi słowy:

**kurs służy do budowania**
**gra służy do weryfikacji transferu kompetencji**

---

## 4. To nie jest relacja „lekcja = quest”

Najważniejsze nieporozumienie, którego warto uniknąć, brzmi:
**quest w grze nie jest kopią lekcji z kursu**.

Prawidłowa relacja wygląda raczej tak:

* lekcja w kursie rozwija realny projekt uczestnika,
* deep-dive pogłębia zrozumienie techniczne,
* quest w grze ćwiczy tę samą klasę myślenia lub umiejętności, ale na odseparowanym case’ie.

Czyli nie projektujemy gry jako:

* „zrób jeszcze raz to samo, tylko w kosmosie”.

Tylko raczej jako:

* „udowodnij, że naprawdę rozumiesz daną technikę, stosując ją poza swoim projektem”.

To jest dydaktycznie dużo mocniejsze, bo sprawdza nie tylko wykonanie, ale też zrozumienie i transfer.

---

## 5. Jak działa mechanika gry w praktyce

Space Explorers ma dwa poziomy działania:

### Warstwa fabularna

W świecie gry gracz jest Dexo — astronautą odzyskującym pamięć i zdolności potrzebne do naprawy CORE AI. Fabuła nadaje sens progresji: kolejne moduły kursu stają się kolejnymi etapami misji.

### Warstwa wykonawcza

Równolegle gracz działa jako **Navigator** — realna osoba siedząca przy IDE i rozwiązująca zadania techniczne poza grą. Dokumentacja Navigator Workflow opisuje to wprost jako model podobny do Advent of Code: ciężar zadania jest po stronie lokalnej pracy gracza, a system jedynie waliduje krótki, deterministyczny wynik.

Mechanika wygląda tak:

1. W grze odblokowywany jest kontakt z HQ przez `/support`.
2. Gracz dostaje token i adres repozytorium HQ.
3. Każdy quest odpowiada osobnemu branchowi. 
4. Na branchu pojawia się zadanie opisane jako misja.
5. Uczestnik rozwiązuje je przy użyciu własnych narzędzi AI.
6. Wynik jest odsyłany przez skill `submit-to-hq`.
7. Gra aktualizuje stan świata, przyznaje progres i odblokowuje kolejne elementy.

To oznacza, że gra nie symuluje pracy developerskiej we własnym, zamkniętym świecie. Ona **odsyła do prawdziwej pracy w repo i narzędziach**, ale robi to przez ramę misji i questów.

---

## 6. Jak rozumieć podział Core / Deep-Dive / Space Explorers

Na potrzeby projektowania treści najlepiej przyjąć następujące rozumienie:

### Core

To główna część lekcji osadzona w realnym projekcie uczestnika.
Tutaj powstaje właściwy artefakt albo decyzja projektowa.

Core odpowiada na pytania:

* co uczestnik ma zbudować,
* czego ma się nauczyć,
* jaki realny efekt ma zostać w jego projekcie.

### Deep-Dive

To pogłębienie techniczne.
Tutaj uczestnik lepiej rozumie niuanse, ograniczenia, heurystyki, błędy i trade-offy związane z danym zagadnieniem.

Deep-Dive odpowiada na pytania:

* dlaczego to działa,
* gdzie to się psuje,
* jak podejmować lepsze decyzje w trudniejszych przypadkach.

### Space Explorers

To quest lub misja w grze, która sprawdza wybraną umiejętność z danej lekcji w bezpiecznym, ograniczonym albo symulowanym środowisku.

Space Explorers odpowiada na pytania:

* czy uczestnik potrafi użyć tej techniki poza swoim projektem,
* czy rozumie mechanizm,
* czy potrafi zastosować go w nowym kontekście.

Najkrócej:

**Core = budujesz coś realnego**
**Deep-Dive = rozumiesz to głębiej**
**Space Explorers = sprawdzasz tę kompetencję na sandboxowym case’ie**

---

## 7. Przykład: „Od pomysłu do PRD”

To dobrze pokazuje całą relację.

### W kursie 10xDevs

Lekcja „Od pomysłu do PRD” powinna prowadzić do realnego efektu w projekcie uczestnika:

* doprecyzowania pomysłu,
* zawężenia scope’u,
* wydobycia wymagań,
* przeprowadzenia rozmowy z agentem metodą sokratejską,
* stworzenia końcowego PRD dla własnego produktu. 

Czyli efektem lekcji jest **rzeczywisty artefakt projektowy**, który będzie później używany w kolejnych etapach budowy produktu.

### W Deep-Dive

Można wejść głębiej w:

* anti-confirmation bias prompting,
* jakość pytań zadawanych agentowi,
* różnicę między celem użytkownika, wymaganiem a implementacją,
* typowe błędy przy pracy nad PRD z udziałem AI. 

### W Space Explorers

Quest nie musi polegać na napisaniu kolejnego PRD.
Może sprawdzać bardziej podstawową kompetencję, np.:

* umiejętność wydobywania wymagań z niejasnego opisu,
* rozróżnianie problemu od rozwiązania,
* zastosowanie konkretnej techniki promptowania,
* zadawanie pytań sokratejskich w celu doprecyzowania celu misji.

Wtedy:

* w kursie powstaje **PRD własnego projektu**,
* w grze sprawdzana jest **zdolność analityczna i promptingowa**, która pozwala taki PRD stworzyć.

To właśnie jest właściwa relacja między kursem a grą.

---

## 8. Dlaczego ten model jest mocny dydaktycznie

Taki podział daje kilka ważnych korzyści.

Po pierwsze, kurs nie traci praktyczności. Uczestnik cały czas pracuje nad czymś, co ma realną wartość dla jego własnego projektu. Nie wykonuje fikcyjnych ćwiczeń zamiast budowy produktu.

Po drugie, gra nie staje się tylko dekoracją. Questy mają sens, bo sprawdzają prawdziwe umiejętności, ale robią to w bezpiecznym środowisku, bez ryzyka popsucia właściwego projektu.

Po trzecie, taki model wspiera transfer wiedzy. Uczestnik nie tylko „zrobił zadanie”, ale pokazuje, że umie zastosować daną zasadę również poza własnym kontekstem. To znacznie lepiej odróżnia zrozumienie od mechanicznego odtworzenia.

---

## 9. Ostateczna definicja relacji

Najbardziej użyteczne sformułowanie tej relacji brzmi:

**10xDevs jest głównym programem edukacyjnym, w którym uczestnik buduje własny, realny projekt full-stackowy.**
**Space Explorers jest towarzyszącą warstwą fabularno-zadaniową, która pozwala ćwiczyć i sprawdzać kompetencje z danej lekcji na osobnych, bezpiecznych przypadkach testowych.**

Albo jeszcze krócej:

**kurs = budujesz własny produkt**
**gra = trenujesz i weryfikujesz tę samą klasę kompetencji na sandboxowym case’ie**

---

## 10. Zasada projektowa na przyszłość

Projektując kolejne lekcje i questy, warto trzymać się jednej reguły:

dla każdej lekcji należy osobno zdefiniować:

1. **efekt w realnym projekcie uczestnika**,
2. **pogłębienie techniczne i heurystyki**,
3. **skill, który ma zostać sprawdzony w grze na osobnym case’ie**.

W praktyce oznacza to model:

**Lekcja → realny artefakt**
**Deep-Dive → głębsze rozumienie**
**Quest → transfer umiejętności**

To jest najbardziej spójna i skalowalna interpretacja relacji między 10xDevs a Space Explorers.
