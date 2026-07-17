# Analiza: wątek forum „Jak organizujecie pracę agentów AI w architekturze mikroserwisowej?" vs draft M4L1

**Data:** 2026-06-03
**Źródła:** post BRAVE Education (Tomasz Skoczewski, 10x3, May 25) + komentarze (Krzysztof Drzymalski, Mateusz, Marcin Czarkowski) vs `lessons/m4-l1/lesson-draft.md`
**Pytanie redakcyjne:** na ile draft M4L1 adresuje pytania/bóle z wątku, czy korzysta z rekomendowanych technik praktyków, czego istotnego brakuje.

---

## 1. Kluczowy rozjazd ramy

Wątek Tomasza jest **w 100% o multi-repo / mikroserwisach** (ficzer rozbity na 2-3 serwisy, kontekst cross-service, „orchestrator kontekstu"). Draft M4L1 jest **w ~90% o skalowaniu kontekstu wewnątrz jednego repo** (lean root + `context/`, drabina dojrzałości, per-moduł `AGENTS.md`). Multi-repo żyje wyłącznie w **opcjonalnym Deep Dive** („Multi-repo: świadomość", linie 367-400), który świadomie **odracza praktyczną budowę do M5L3** (linie 314, 400).

Drugi rozjazd: w wątku Marcin obiecał Tomaszowi, że temat będzie w lekcji **„Skalowanie kontekstu (M4L5)"**. Draft to **M4L1**, a realna odpowiedź na scenariusz Tomasza jest rozbita między M4L1 (świadomość) i M5L3 (budowa). Learner oczekujący jednej spójnej lekcji „mikroserwisy" dostaje temat rozsmarowany na dwa miejsca — decyzja redakcyjna do zakomunikowania.

---

## 2. Mapowanie pytań Tomasza na pokrycie w lekcji

| Pytanie / ból Tomasza | Gdzie w lekcji | Poziom |
|---|---|---|
| Lokalne „agentic repo" agregujące kontekst i linki | Deep Dive W2 (źródło prawdy + dystrybucja) i W3 (kontrakt jako narzędzie); lekcja **świadomie odradza** ciężki centralny meta-kontekst | częściowo, świadomość |
| Pliki opisujące zależności między serwisami | Deep Dive W3: OpenAPI/Swagger, współdzielone testy | świadomość |
| Jak organizować wiedzę cross-service | Deep Dive W3 | świadomość |
| Osobne PRD / shape / impl notes / dependency maps / flow docs dla całego ficzera | **brak** | **luka** |
| Workflow ficzera przez kilka serwisów | **brak** | **luka** |
| Kontekst dynamiczny vs stały „meta-context" | JIT (l. 77) + W3 (odpytywanie w runtime) — odpowiada **implicite**, nie wprost | częściowo |
| Co się sprawdza / czego unikać | W2 ostrzega przed copy-paste driftem | częściowo |
| Struktury repo / naming / tooling | tooling tak (CLI/paczka/OpenAPI/Nx/Ruler); konkretnych struktur i naming dla multi-repo brak | częściowo |

**Wniosek:** draft odpowiada na *„jaki jest kształt problemu"* (3 warstwy, dystrybucja, kontrakt-jako-narzędzie), ale prawie nie odpowiada na *„jak ja jutro dowiozę ficzer przez 3 serwisy"* — a to było sedno pytania Tomasza.

---

## 3. Czy lekcja korzysta z rekomendowanych technik (z komentarzy praktyków)

### Obecne w lekcji (często w mocniejszej, bardziej zasadniczej formie)

- **Zrzut kontraktu API (Swagger/OpenAPI) do innych repo** (Krzysztof) → ✅ Warstwa 3 (l. 385, 395).
- **Jedno źródło prawdy + dystrybucja** → ✅ Warstwa 2 (CLI/paczka, semver/pin) — lekcja *bardziej* dojrzała niż wątek.
- **Kontrakt jako odpytywalne narzędzie w runtime** → ✅ Warstwa 3 — wyprzedza poziom dyskusji.

### Brakujące, choć learner ich wprost szukał

- **Workflow „kontrakt FE→BE jako plik MD"** (Mateusz): agent na froncie generuje md z kontraktem → przekazujesz agentowi backendu. Najczystszy praktyczny wzorzec cross-repo z wątku — nieobecny.
- **„Coupling smell"** (Mateusz): jeśli często potrzebujesz kontekstu z >1 repo, to zapach i potencjalna inicjatywa architektoniczna. Mocna pointa, **idealnie pasująca do modułu 4** (mapy kodu, DDD, refaktoryzacja) — brak.
- **Uruchamianie agenta z katalogu nadrzędnego bez dodatkowych plików kontekstu** (Mateusz) — lekcja omawia „skąd odpalasz agenta" tylko w obrębie jednego repo (l. 242-248), mechanika urywa się na granicy repo (l. 369).
- **Cursor: Add Folder to Workspace** (Krzysztof/Mateusz) — technika IDE do łączenia kilku repo z zachowaniem granic; brak (drobne).
- **„Każde repo wie, z kim się komunikuje"** (Krzysztof) — lekcja ma Warstwę 1 (uniwersalne reguły), ale jawnej zasady „w regułach repo trzymaj listę sąsiadów" nie ma.

### Napięcie do rozstrzygnięcia

Mateusz: „nie przejmuję się duplikacją kontekstu w systemie rozproszonym". Lekcja (W2): „kopiuj-wklej do dwudziestu repo gwarantuje drift". To nie sprzeczność wprost (on = garść powtórzonych faktów jest OK; ona = systematyczny copy-paste warstwy reguł jest zły), ale learner czytający oba poczuje tarcie. Warto, by lekcja jawnie rozróżniła: *garść zduplikowanych faktów ≠ kopiowanie warstwy reguł*.

---

## 4. Czego istotnego brakuje (3 luki materialne)

1. **Workflow cross-service dla jednego ficzera.** Najczęstszy realny ból (ficzer przez FE+BE+3. serwis); lekcja nie pokazuje sekwencji ani gdzie żyją artefakty całego ficzera (wspólny PRD/flow doc vs per-repo). Domyka to wzorzec „kontrakt jako artefakt przekazywany między agentami repo".
2. **Coupling jako sygnał architektoniczny.** Że *częsta* potrzeba kontekstu z wielu repo to smell, a nie problem do rozwiązania większą ilością plików kontekstu. Jedno zdanie podnosi poziom Deep Dive i spina go z DDD z dalszej części modułu.
3. **Jawna odpowiedź na „statyczny meta-context czy dynamiczny".** Lekcja ma tezę (dynamiczny + odpytywanie w runtime, przeciw ciężkiemu „orchestratorowi"), ale nie nazywa intuicji Tomasza po imieniu i jej nie obala. Darmowy, mocny moment dydaktyczny.

---

## 5. Decyzja o placemencie (potwierdzona schematem)

Sprawdzenie `lessons-schema.json`:

- **M4L1 `owns`**: *„świadomość multi-repo… poziom org/user + dystrybucja + tooling cross-repo; build-out odłożony do M5-L3"* → teoria/świadomość multi-repo to **własność M4L1**.
- **M4L1 `mustNotCover`**: *„budowa zespołowego Shared AI Registry / CLI / dystrybucji paczek (M5-L3)"* → sama budowa infry zostaje w M5L3.
- **M5L3** w schemacie jeszcze **pusty** (`owns/mustNotCover/learningOutcomes = []`) → można oprzeć go o M4L1 i tylko odwołać wstecz.

**Ograniczenie autora (M5L3):** M5L3 ma być gęsty od praktyki + teorii budowy infrastruktury współdzielenia kontekstu — mało miejsca na teorię ogólną. → Trzy braki konceptualne lądują w **Deep Dive M4L1** (sekcja opcjonalna, nie obciąża nurtu MVP), a M5L3 zostaje czystą praktyką i linkuje w górę.

---

## 6. Proponowane wstawki do Deep Dive „Multi-repo: świadomość"

Poziom awareness, w głosie lekcji, bez budowania infry. Wszystkie w `owns` M4L1, poza `mustNotCover`, z forward-ref (m4-l5, M5L3).

### A. Obalenie „stałego meta-contextu" — przed zdaniem „Gdy te same konwencje…" (l. 371)

> Tu pojawia się naturalny odruch, który pewnie czujesz: zbudować jeden centralny „meta-kontekst" albo osobne *agentic repo* agregujące wiedzę o wszystkich serwisach i linki między nimi. To kuszące, ale to ta sama pułapka co gruby monolit z początku lekcji, tylko piętro wyżej — centralny meta-kontekst gnije najszybciej, bo opisuje N niezależnie zmieniających się serwisów, a żaden lockfile nie wyłapie, że się rozjechał. Dlatego rozwiązanie nie jest jednym wielkim plikiem, tylko **dynamiczne**: kontekst dociera do repo przez dystrybucję, a wiedzę cross-service agent *odpytuje w runtime*, zamiast trzymać jej kopię na stałe.

### B. Workflow ficzera przez serwisy — po akapicie o OpenAPI/testach (l. 398), jako instancja Warstwy 3

> Ta sama zasada „kontrakt zamiast kopiowanego kontekstu" działa też **wewnątrz jednego ficzera rozbitego na kilka serwisów**. Zamiast otwierać agenta nad wszystkimi repo naraz i liczyć, że ogarnie całość, potraktuj kontrakt jako *artefakt przekazywany między agentami*: agent kończący pracę po jednej stronie (np. na froncie) generuje krótki opis tego, co zrobił i jakiego kontraktu oczekuje od drugiej strony, a ty podajesz ten plik agentowi w drugim repo. Kontekst płynie wąskim, jawnym interfejsem, a nie wspólnym workiem na wszystko.

### C. Coupling smell — tuż przed granicą „I tu stawiamy granicę…" (l. 400)

> Jedna przestroga architektoniczna na koniec. Jeżeli przy ficzerach **regularnie** potrzebujesz pełnego kontekstu z więcej niż jednego repo, to częściej sygnał o zbyt ciasnym couplingu między serwisami niż o brakującym narzędziu do kontekstu. Żadna warstwa dystrybucji tego nie naprawi — to temat na granice domen, do którego wrócimy przy analizie DDD (m4-l5).

---

## 7. Rekomendacje końcowe

- **Wprowadzić wstawki A/B/C** do Deep Dive M4L1 przez `lesson-editor-pl` (editor przed RC), żeby dociągnąć je stylistycznie do reszty sekcji.
- **M5L3 spec**: jawnie zdelegować framing konceptualny do M4L1 (reference back), by M5L3 został pure-practice.
- **Komunikacja do learnera (wątek forum)**: odpisać Tomaszowi, że temat rozdzielono (świadomość w M4L1, praktyka w M5L3), bo obietnica brzmiała „M4L5", a jeden konkret (workflow przez kilka serwisów) nadal nie ma jednoznacznego adresu w obecnym drafcie.
- **Świadoma decyzja altitude**: główny nurt M4L1 dalej nie zaadresuje scenariusza Tomasza — i to jest OK, bo jego scenariusz jest genuinely advanced/multi-repo, a docelowy odbiorca lekcji to MVP single-repo. Multi-repo pozostaje w opcjonalnym Deep Dive.

---

## Side-Effect Ledger

```
New claims introduced: (none — analiza, nie zmiana treści lekcji)
Claims removed: (none)
Neighboring lesson references changed: (none — proponowane forward-refy do m4-l5 i M5L3 jeszcze nieзаaplikowane)
Prework references used: [3.1] MECW (kontekst dla ekonomii budżetu uwagi)
Prework concepts repeated intentionally: (none)
Potential duplicates: proponowana wstawka B częściowo pokrywa się z Warstwą 3 (świadomie, jako jej instancja)
Unsupported facts: (none — wszystkie obserwacje zakotwiczone w drafcie, wątku forum i schemacie)
Video/text mismatches: (none — brak scenariusza wideo dla m4-l1 w analizie)
Needs human decision:
  - czy zaaplikować wstawki A/B/C do draftu (i czy przez lesson-editor-pl czy surowy diff),
  - czy/kiedy odpisać Tomaszowi w wątku forum,
  - rozstrzygnięcie napięcia „duplikacja kontekstu OK vs copy-paste = drift".
```
