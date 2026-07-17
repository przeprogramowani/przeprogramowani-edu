# Artefakt 3 — Kontekst kontrybutorów (kto wie co)

> Wide Scan, składowa 3/3. Pytanie: **kogo zapytać, zanim popełnię zmianę?**
> Źródło: `git log --author` po ścieżkach. Okno: **2025-06-04 → 2026-06-04**.
> Odfiltrowano boty i agentów: `[bot]`, dependabot, renovate, mattermost-build, github-actions, Weblate, Claude, Codex, Copilot, semantic-release.
> To **punkt wejścia do rozmowy i czytania PR-ów**, nie lista właścicieli. `git log` mówi „kto dotykał", nie „kto nadal jest w zespole" ani „kto miał rację".

## Top 5 obszarów wymagających kontaktu (z art. 1 + art. 2)

1. **`components/admin_console`** — #1 hotspot aktywności (856) + 11 cykli.
2. **`packages/mattermost-redux`** — load-bearing rdzeń stanu (Σfan-in 1838) + 12 cykli.
3. **`server/channels/store`** — stały rdzeń backendu, kontrakt danych (`store.go` → generowane warstwy).
4. **`channels/src/utils`** — tangled hub (`utils.tsx`) + najwyższy fan-in (`constants.tsx` 340).
5. **kontrakt config/types** — `server/public/model/config.go` ↔ `platform/types/src/config.ts`.

## Mapa „kto wie co" (pogrupowana tematycznie)

### 1. admin_console — dominuje temat Access Control / Permissions

| Osoba | Commity | Specjalizacja (z subjectów PR) |
|-------|---------|-------------------------------|
| **Pablo Vélez** | 21 | **ABAC / Access Control Policies** — parent/child policies, channel scope, BoR (burn-on-read), modale email/hasło. Pierwszy kontakt do permissions. |
| **Ibrahim Serdar Acikgoz** | 16 | **System uprawnień / policy versions** — permission policies, policy v0.3, deprecacja API AccessControl, ABAC beta. Drugi filar permissions. |
| sabril | 11 | admin_console UI |
| Jesse Hallam | 11 | przekrojowo (też backend store — patrz niżej) |
| Harrison Healey | 11 | frontend core |

> Wiedza o **access control / ABAC / permissions** jest **skupiona** wokół Pablo Vélez + Ibrahim Serdar Acikgoz. Przed zmianą w polityce dostępu — pytaj ich.

### 2. mattermost-redux — rdzeń stanu, wiedza rozproszona

| Osoba | Commity | Specjalizacja |
|-------|---------|---------------|
| Pablo Vélez | 13 | selektory/akcje powiązane z permissions |
| Harshil Sharma | 9 | logika redux / akcje |
| Jesse Hallam | 7 | store ↔ redux pomost |
| Harrison Healey | 7 | frontend core, długi staż |
| Devin Binnie, Scott Bishel, Nick Misasi | 6 ea. | różne entities |

> Wiedza tu **rozproszona** — brak jednego właściciela. Czytaj PR-y zamiast liczyć na jedną osobę.

### 3. server store — backend data layer, dwa silne filary

| Osoba | Commity | Specjalizacja (z subjectów PR) |
|-------|---------|-------------------------------|
| **Jesse Hallam** | 16 | **wnętrze store + infra** — migracje, `concurrentIndex` vet rule, usunięcie MySQL, FIPS, perf (`avoid select *`), replica race. Główny ekspert store. |
| **Ben Schumacher** | 12 | **search + refaktor kontekstu** — CJK post search (Postgres), migracja `context.Context` → `request.CTX`, lintery. |
| Ben Cooke | 10 | config/jobs (patrz config) |
| Pablo Vélez, Ibrahim S. A., Harshil Sharma | 8 ea. | przekrojowo |

> Przed zmianą schematu/migracją: **Jesse Hallam**. Przed zmianą w wyszukiwaniu/kontekście request: **Ben Schumacher**.

### 4. frontend utils — cross-cutting, temat „popouts"

| Osoba | Commity | Specjalizacja |
|-------|---------|---------------|
| Harrison Healey | 13 | utils core, długi staż |
| **Devin Binnie** | 13 | **popout windows** — channel/thread/RHS popouty, focus/blur listeners. Duża, cross-cutting funkcja siedząca w utils. |
| Scott Bishel | 12 | utils / akcje |
| Nick Misasi, Daniel Espino García | 7–8 | różne |

> `utils.tsx`/`constants.tsx` są dotykane przez wielu — ale temat **popoutów** (świeży, runtime-wrażliwy) zna **Devin Binnie**.

### 5. config/types contract — backend infra + jobs

| Osoba | Commity | Specjalizacja (z subjectów PR) |
|-------|---------|-------------------------------|
| **Ben Cooke** | 8 | **autotranslations + OAuth/jobs** — worker counts, job infra, Dynamic Client Registration OAuth, data retention. Najwięcej świeżych pól config. |
| **Ben Schumacher** | 9 | kontrakt store↔config, refaktory |
| Jesse Hallam | 7 | infra/CI |
| Agniva De Sarker | 5 | backend perf/infra |

> Nowe pola configu (autotranslations, OAuth) — **Ben Cooke**. Spójność kontraktu config ↔ store — **Ben Schumacher**.

## Wnioski dla pracy w legacy

- **Access control / ABAC / permissions**: wiedza skupiona → **Pablo Vélez, Ibrahim Serdar Acikgoz**.
- **Store / migracje / schemat DB**: **Jesse Hallam** (główny), **Ben Schumacher** (search, request.CTX).
- **Config / jobs / OAuth / autotranslations**: **Ben Cooke**.
- **Popouty / okna / focus-blur (utils)**: **Devin Binnie**.
- **Frontend core o długim stażu** (dobry „pierwszy kontakt" ogólny): **Harrison Healey**, **Jesse Hallam** (pełni rolę pomostu front↔back).
- `mattermost-redux` to obszar **bez jednego właściciela** — tu lepiej czytać PR-y niż liczyć na jedną osobę.

## Unknowns / ograniczenia

- `git log` pokazuje, kto *dotykał*, nie kto jest formalnym ownerem ani czy nadal jest w firmie.
- Nazwiska zliczone po `%an`; jeśli ktoś commituje pod różnymi aliasami, liczby mogą być rozbite.
- Tematy wyprowadzone z subjectów PR (próbka top-8) — to hipoteza specjalizacji, do potwierdzenia lekturą PR-ów.
- Filtr botów jest heurystyczny; pojedyncze commity automatów mogły przejść.
- Nie sprawdzano `CODEOWNERS` — warto skonfrontować tę mapę z plikiem własności, jeśli istnieje (to `unknown`).
