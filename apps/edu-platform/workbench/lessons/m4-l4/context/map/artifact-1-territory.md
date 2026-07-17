# Artefakt 1 — Terytorium (historia gita)

> Wide Scan, składowa 1/3. Pytanie: **gdzie projekt realnie żyje?**
> Źródło: `git log`. Okno: **2025-06-04 → 2026-06-04** (ostatnie 12 mies.).
> Uwaga: ostatni commit w repo to `2026-04-21`, więc ostatni kwartał urywa się w kwietniu.
> Szum odfiltrowany: lockfile'y, `go.sum`/`go.mod`, `__snapshots__`/`.snap`, `*.pb.go`, `*_gen.go`, `mocks/`, `*.d.ts`, `vendor/`, `i18n/`, `CHANGELOG` (poza analizą "wspólnego mianownika" — tam i18n jest celowo włączone).
> Liczby = liczba commitów dotykających danej ścieżki, nie liczba linii.

## TL;DR (co już wiadomo o terenie)

- Repo to monorepo: `server/` (Go) + `webapp/` (React/TS) + `e2e-tests/` (Cypress + Playwright). **Środek ciężkości pracy leży po stronie frontendu.**
- Bezdyskusyjny hotspot: **`webapp/channels/src/components`** (3805 commitów), a w nim **`admin_console`** (856) — to numer jeden całego repo, aktywny w każdym kwartale.
- Drugi stały rdzeń: **warstwa store backendu** (`server/channels/store/sqlstore` + `storetest` + `store.go`) — niski wolumen, ale bardzo spójny i ciągły.
- Dwie wyraźne **kampanie**, nie stałe centra: migracje DB (`server/channels/db/migrations`, Q1) oraz testy e2e Cypress (`e2e-tests/cypress/tests/integration`, Q4).
- Kontrakt konfiguracji (`config.go` ↔ `config.ts` ↔ `default_config.ts`) przewija się przez backend, frontend i e2e — to cienka, ale szeroko sięgająca nić.

## TOP katalogi (12 mies., szum odfiltrowany)

| # | Katalog | Commity | Czytanie |
|---|---------|---------|----------|
| 1 | `webapp/channels/src/components` | 3805 | rdzeń produktowego UI; dominuje wszystko inne o rząd wielkości |
| 2 | `e2e-tests/cypress/tests/integration` | 888 | duża aktywność testowa (głównie kampania Q4) |
| 3 | `server/channels/db/migrations` | 373 | kampania migracji (głównie Q1) |
| 4 | `webapp/channels/src/packages` | 263 | m.in. `mattermost-redux` — wspólny stan/logika frontendu |
| 5 | `e2e-tests/playwright/lib/src` | 260 | biblioteka pomocnicza nowego stacku e2e (Playwright) |
| 6 | `server/channels/store/sqlstore` | 259 | warstwa dostępu do danych — stały rdzeń backendu |
| 7 | `webapp/channels/src/utils` | 212 | wspólne utilsy frontendu (cross-cutting) |
| 8 | `server/cmd/mmctl/commands` | 204 | CLI administracyjne (aktywne Q1–Q2, potem cichnie) |
| 9 | `e2e-tests/playwright/specs/functional` | 204 | rosnący stack testów funkcjonalnych |
| 10 | `server/channels/store/storetest` | 135 | testy store — zawsze idą w parze z `sqlstore` |
| — | `server/channels/app/platform` | 134 | warstwa app/runtime backendu |
| — | `webapp/platform/types/src` | 127 | współdzielone typy TS (kontrakt) |
| — | `webapp/channels/src/actions` | 95 | redux actions frontendu |

### Drążenie w `components` (bo pojedynczy folder = 3805)

| Subfolder | Commity | Czytanie |
|-----------|---------|----------|
| `admin_console` | 856 | **#1 hotspot całego repo** — panel administracyjny |
| `post_view` | 178 | renderowanie postów (gorące, perf-wrażliwe) |
| `widgets` | 144 | wspólne komponenty UI (cross-cutting) |
| `channel_settings_modal` | 118 | aktywna funkcja |
| `suggestion` | 103 | autouzupełnianie (@mention, /, emoji) |
| `common` | 101 | wspólne komponenty (cross-cutting) |
| `advanced_text_editor` | 97 | edytor wiadomości — krytyczny user flow |
| `user_settings` | 89 | ustawienia użytkownika |
| `threading` | 82 | wątki |
| `sidebar` | 75 | nawigacja po kanałach |

## TOP pojedyncze pliki (12 mies., szum odfiltrowany)

| Plik | Commity | Rola / sygnał |
|------|---------|---------------|
| `server/Makefile` | 101 | orkiestracja buildu (dotykany przy wielu zmianach) |
| `server/public/model/config.go` | 64 | **kontrakt konfiguracji** — źródło prawdy o config |
| `webapp/platform/types/src/config.ts` | 49 | frontowy odpowiednik configu (kontrakt TS) |
| `server/channels/store/store.go` | 49 | **interfejs store** — z niego generują się warstwy |
| `webapp/platform/client/src/client4.ts` | 45 | klient API frontendu (kontrakt sieciowy) |
| `e2e-tests/playwright/lib/src/server/default_config.ts` | 45 | config testowy (lustro `config.go`) |
| `webapp/channels/src/utils/constants.tsx` | 44 | globalne stałe frontendu |
| `webapp/channels/src/components/admin_console/admin_definition.tsx` | 44 | deklaratywna definicja całego admin console |
| `server/channels/store/retrylayer/retrylayer.go` | 44 | **GENEROWANA** warstwa store (retry) |
| `server/channels/store/timerlayer/timerlayer.go` | 43 | **GENEROWANA** warstwa store (metryki) |
| `server/channels/app/post.go` | 41 | logika domenowa postów |
| `server/channels/app/channel.go` | 34 | logika domenowa kanałów |
| `server/public/model/client4.go` | 36 | klient API po stronie Go (kontrakt) |

## Trend kwartalny (stałe centrum vs kampania)

| Obszar | Q1 (06–09'25) | Q2 (09–12'25) | Q3 (12'25–03'26) | Q4 (03–06'26) | Wniosek |
|--------|----|----|----|----|---------|
| `webapp/channels/src/components` | 705 | 1088 | 1232 | 780 | **stałe centrum** (dominuje każdy kwartał) |
| `server/channels/db/migrations` | **301** | — | — | — | **kampania Q1** (jednorazowy spike migracji) |
| `e2e-tests/cypress/tests/integration` | 206 | — | 135 | **525** | **kampania Q4** (duży push testowy) |
| `server/channels/store/sqlstore` | 86 | 58 | 65 | 50 | **stały rdzeń** (równomierny przez cały rok) |
| `server/cmd/mmctl/commands` | 73 | 92 | — | — | aktywne Q1–Q2, **wygasa** w Q3–Q4 |
| `e2e-tests/playwright/*` | nisko | rośnie | rośnie | wysoko | **rosnący trend** (migracja Cypress→Playwright?) |

Czytanie: `components` to prawdziwe, stałe serce projektu. `db/migrations` i Cypress to skoki kampanijne — wysoka liczba zmian *nie* oznacza tu stałej wrażliwości. `sqlstore` jest mniej spektakularny, ale to on jest „zawsze obecnym" rdzeniem backendu.

## Współzmiany (co zmienia się razem)

**Pary (TOP):**

| Co-change | n | Czytanie |
|-----------|---|----------|
| `components` ↔ `utils` | 92 | UI ciągnie wspólne utilsy — szeroki blast radius w `utils` |
| `components` ↔ `packages` | 79 | UI ↔ `mattermost-redux` (stan) |
| `components` ↔ `platform/types/src` | 78 | UI ↔ kontrakt typów |
| `store/sqlstore` ↔ `store/storetest` | 62 | implementacja + jej testy (zdrowa para) |
| `playwright/lib` ↔ `playwright/specs/functional` | 49 | helpery e2e + specs |
| `store/sqlstore` ↔ `store/store.go` | 45 | impl ↔ interfejs store |
| `components` ↔ `sass` | 43 | komponent + jego style |
| `components` ↔ `platform/client/src` | 42 | UI ↔ klient API |
| `store/retrylayer` ↔ `store/timerlayer` | 39 | **dwie GENEROWANE warstwy regenerują się razem** |

**Trójki (TOP):**

- `components` + `packages` + `platform/types/src` (39) — frontowy trójkąt: UI ↔ stan ↔ typy.
- `store/retrylayer` + `store/sqlstore` + `store/store.go` (38) i wszystkie permutacje z `timerlayer` (38) — **klaster store regeneruje się jako całość**.
- `playwright/lib` + `config.go` + `platform/types/src` (30) — kontrakt config przecina backend/e2e/frontend.

### Wspólny mianownik repo (pojedynczy plik, wiele obszarów)

Po **włączeniu** i18n z powrotem (bo to dokładnie ten typ pliku):

| Plik | Commity | Distinct obszary | Typ sprzężenia |
|------|---------|------------------|----------------|
| `.github/workflows/server-ci.yml` | 26 | 136 | CI (infra) |
| `server/Makefile` | 101 | 122 | build (infra) |
| **`webapp/channels/src/i18n/en.json`** | **177** | **101** | **i18n — change-by-addition (frontend)** |
| **`server/i18n/en.json`** | **139** | **91** | **i18n — change-by-addition (backend)** |
| `server/public/model/config.go` | 64 | 91 | **kontrakt config** (realna ręczna edycja) |

Czytanie: pliki `i18n/en.json` to klasyczny „wspólny mianownik" — prawie każdy feature dorzuca string, więc co-change jest **mechaniczny i tani** (dodanie klucza), nie oznacza realnego sprzężenia logiki. Odwrotnie `config.go`/`config.ts`: ich co-change to **realny kontrakt** — zmiana tam ma koszt w wielu warstwach.

### Weryfikacja istnienia (współzmiany to historia)

Wszystkie mocno sprzężone pliki **nadal istnieją** w repo (sprawdzone `[ -e ]`): `store.go`, `retrylayer.go`, `timerlayer.go`, `config.go`, `config.ts`, `client4.ts`, `constants.tsx`, `admin_definition.tsx`. Żaden wniosek z tego artefaktu nie opiera się na pliku usuniętym/przeniesionym.

## Wnioski dla pracy w legacy

- **Zacznij od frontendu** — to tam jest 80% ruchu. Konkretnie `components/admin_console` (najgorętszy), `post_view`, `advanced_text_editor`.
- **`utils`, `packages` (mattermost-redux), `platform/types` to load-bearing** dla frontendu — zmiana tam rozlewa się na `components`.
- **Klaster store backendu** to stały rdzeń: `store.go` (interfejs) + `sqlstore` (impl) + `storetest`. `retrylayer`/`timerlayer` zmieniają się razem **bo są generowane** — to tańsze sprzężenie (regeneracja), nie ręczna edycja.
- **Kontrakt config** (`config.go` → `config.ts` → `default_config.ts`) to wąska, ale szeroko sięgająca nić — wrażliwa przy zmianie.
- Wysoka aktywność `db/migrations` (Q1) i Cypress (Q4) to **kampanie** — nie myl ich ze stałą wrażliwością.

## Unknowns (do sprawdzenia w strukturze / Deep Focus)

- Czy `admin_definition.tsx` (44 commity, deklaratywny) to realne centrum logiki, czy wielki plik konfiguracyjny dotykany „przy okazji"? → sprawdzić grafem zależności.
- Czy `store.go` ↔ `retrylayer`/`timerlayer` na pewno jest generowane (potwierdzić w strukturze/`make`), żeby poprawnie zważyć koszt zmiany.
- Czy kontrakt `config.go` ↔ `config.ts` jest synchronizowany ręcznie czy codegenem — historia tego nie rozstrzyga (klasyczny „kontrakt, który powinien zmieniać się razem").
- Migracja Cypress → Playwright: czy Cypress jest wygaszany? (rosnący Playwright + spike Cypress Q4 są niejednoznaczne.)
- To okno 12 mies. — pokazuje, gdzie *dotykano*, nie *dlaczego* ani *czy słusznie*.
