# Artefakt 2 — Struktura (graf zależności)

> Wide Scan, składowa 2/3. Pytanie: **co realnie zależy od czego?**
> Narzędzie: `dependency-cruiser` 17.4.3 (`webapp/`), config `webapp/.depcruise-rules.cjs` + `tsconfig.depcruise.json`.
> Zakres skanu (aktywne obszary z artefaktu 1): `channels/src/components/admin_console`, `channels/src/packages`, `channels/src/utils`, `channels/src/actions`, `platform/client/src`, `platform/types/src`.
> Skanowano **1836 modułów**. Wykluczono: `node_modules`, `.test.`, `.stories.`, `/tests/`, `__snapshots__`, `.d.ts`, `/i18n/`.
> Metryki fan-in/fan-out policzone z grafu (liczba krawędzi w obrębie skanu).

## TL;DR (co już wiadomo o strukturze)

1. **108 cykli importów** w aktywnych obszarach frontendu. Skupione w `mattermost-redux`, `admin_console` oraz w pajęczynie `actions ↔ selectors ↔ utils`.
2. **Granice warstw platform są respektowane**: `types-is-foundation` i `client-below-channels` → **0 naruszeń**. To czysty, ważny sygnał — fundament TS trzyma się zasad.
3. Najbardziej **load-bearing** plik repo: `utils/constants.tsx` (**fan-in 340**). Zmiana tam = najszerszy możliwy blast radius we frontendzie.
4. Najbardziej load-bearing **obszar**: `packages/mattermost-redux` (zagregowany fan-in **1838**) — to logiczny rdzeń stanu, od którego zależy prawie wszystko.
5. `admin_console/admin_definition.tsx` to **gruby orkiestrator, nie głębokie centrum** (out=85, in=1) — rozwiązuje unknown z artefaktu 1: jest dotykany „przy okazji" bo importuje pół panelu, a nie dlatego, że wszyscy od niego zależą.

## 1. Cykle w aktywnych obszarach

Reguła `no-circular` (severity: error). **108 naruszeń.** Cykle pogrupowane wg obszaru źródłowego:

| Obszar | Cykle | Dowód (przykładowy łańcuch) | Dlaczego ważne przy zmianie | Związek z art. 1 |
|--------|-------|------------------------------|------------------------------|------------------|
| `packages/mattermost-redux` | 12 | wewnętrzne pętle selectors/actions | rdzeń stanu — cykl tu rozlewa ryzyko na cały frontend | #4 wg aktywności |
| `components/admin_console` | 11 | przez `blockable_link → admin_actions → widgets/menu → …` | #1 hotspot — cykle utrudniają izolowaną zmianę | #1 wg aktywności |
| `components/user_settings` | 8 | lokalne pętle modali | aktywna funkcja (89 commitów) | top components |
| `utils/markdown` | 8 | pętle w parserze markdown | parser na gorącej ścieżce (posty) | utils load-bearing |
| `components/onboarding_tasks`, `tours` | 7+7 | wzajemne importy | funkcje pomocnicze, ale splątane | — |
| `actions/* ↔ selectors/* ↔ utils/utils.tsx` | ~20 łącznie | `post_actions → user_actions → emoji_actions → custom_status → utils.tsx → post_actions` | **pajęczyna rdzenia** — najtrudniejszy do rozplątania obszar | `components↔utils` = top co-change (92) |

**Powtarzający się węzeł w cyklach: `channels/src/utils/utils.tsx`** (in=93, out=24). Występuje w wielu łańcuchach jako spoiwo `actions ↔ selectors ↔ components`. To klasyczny „worek na wszystko" — kandydat #1 na Deep Focus.

> Uwaga: cykl ≠ automatycznie bug. Część to artefakt wzorca redux (action importuje selector, który importuje util, który importuje action). Ale **108 to dużo** — każdy dotyka izolowanej testowalności.

## 2. Granice warstw (czysto)

| Sprawdzana granica | Wynik | Dowód | Czytanie |
|--------------------|-------|-------|----------|
| `platform/types` nie zależy od `channels`/`client` (`types-is-foundation`) | ✅ **0 naruszeń** | reguła depcruise | fundament typów trzyma się — bezpieczna baza |
| `platform/client` nie importuje `channels` (`client-below-channels`) | ✅ **0 naruszeń** | reguła depcruise | klient API jest poprawnie „poniżej" UI |

Wniosek: mimo 108 cykli *wewnątrz* `channels`, **międzywarstwowe** granice platform są zdrowe. Kontrakt (`types` → `client` → `channels`) nie jest odwrócony. To zawęża ryzyko: niebezpieczeństwo jest *w obrębie* frontendu, nie w jego fundamencie.

## 3. Load-bearing — kto trzyma system (fan-in)

| Plik | fan-in | fan-out | Rola |
|------|--------|---------|------|
| `utils/constants.tsx` | **340** | 19 | globalne stałe — **najszerszy blast radius w repo** |
| `mattermost-redux/selectors/entities/users.ts` | 136 | 7 | selektor user — kontrakt stanu |
| `mattermost-redux/selectors/entities/general.ts` | 125 | 3 | selektor general/config |
| `utils/utils.tsx` | 93 | 24 | **tangled hub** (load-bearing + sam dużo importuje) |
| `mattermost-redux/action_types/index.ts` | 92 | 34 | typy akcji redux |
| `mattermost-redux/constants/index.ts` | 91 | 13 | stałe redux |
| `mattermost-redux/client/index.ts` | 90 | 1 | klient API (cienkie, czyste wejście) |
| `mattermost-redux/selectors/entities/preferences.ts` | 84 | 7 | preferencje |
| `platform/components/src/index.tsx` | 53 | 10 | design system (shared UI) |
| `components/external_link/index.tsx` | 66 | 1 | mały, ale wszędzie używany widget |

**Zagregowane po obszarach (najbardziej nośne):**

| Obszar | Σ fan-in | Czytanie |
|--------|----------|----------|
| `packages/mattermost-redux` | **1838** | logiczny rdzeń stanu — fundament całego frontendu |
| `components/admin_console` | 845 | duży, ale fan-in głównie *wewnętrzny* (do siebie) |
| `components/widgets` | 361 | współdzielone komponenty UI |
| `utils/constants.tsx` | 340 | pojedynczy plik = nośnik całego repo |
| `components/common` | 160 | wspólne komponenty |
| `actions/views` | 128 | akcje widoków (modale itp.) |

## 4. Cienkie wejścia vs głębokie centra (fan-out)

Wysoki fan-out + niski fan-in = **orkiestrator / god-file**, nie centrum, od którego zależą inni:

| Plik | fan-out | fan-in | Czytanie |
|------|---------|--------|----------|
| `admin_console/admin_definition.tsx` | **85** | 1 | **deklaratywny rejestr** całego admin console — importuje wszystko, nikt jego. Gruby orkiestrator, nie głębokie centrum. ✅ rozwiązuje unknown z art. 1 |
| `actions/websocket_actions.ts` | 69 | 1 | dispatcher WebSocket — spina wiele akcji w jednym miejscu (runtime hub) |
| `actions/global_actions.tsx` | 33 | 13 | globalne akcje — i orkiestruje, i jest używany |
| `admin_console/schema_admin_settings.tsx` | 27 | 13 | silnik renderujący schemat admin (parami z `admin_definition`) |
| `mattermost-redux/client/index.ts` | 1 | 90 | przeciwieństwo: cienkie, czyste wejście do API |

## Lista ryzyk testowych

| Ryzyko | Pliki | Strategia |
|--------|-------|-----------|
| **Trudne do testu w izolacji** (ciągną dużo importów) | `admin_definition.tsx` (85), `websocket_actions.ts` (69), `global_actions.tsx` (33), `post_actions.ts` (29) | test integracyjny / e2e, nie unit z mockami |
| **Zmiana łamie wiele testów** (wysoki fan-in) | `utils/constants.tsx` (340), selektory `mattermost-redux/*` (70–136) | uważać na efekt domina; zmiana kontraktu = szeroki re-run |
| **Cykle = trudny mock** | pajęczyna `actions↔selectors↔utils.tsx`, `utils/markdown` | rozplątać cykl zanim zaczniesz unit-testy; kandydat na e2e |
| **Tangled hub** | `utils/utils.tsx` (in=93, out=24, w wielu cyklach) | nie ruszać bez dobrego pokrycia; Deep Focus |

## Najbardziej podejrzane moduły (kandydaci na Deep Focus)

1. **`channels/src/utils/utils.tsx`** — tangled hub, w wielu cyklach, load-bearing i jednocześnie zależny.
2. **`packages/mattermost-redux`** — 12 cykli + Σfan-in 1838; rdzeń stanu, każda zmiana ma zasięg.
3. **`components/admin_console`** — 11 cykli + #1 hotspot aktywności; `admin_definition.tsx`/`schema_admin_settings.tsx` jako para silnik+rejestr.

## Co sprawdzić dalej / opcjonalny graf

- Wyrenderować SVG **tylko** dla jednego cyklu rdzenia (`actions↔selectors↔utils.tsx`) — `--focus "utils/utils" --include-only "^channels/src/(actions|selectors|utils)"` + `--collapse`.
- Potwierdzić, czy cykle w `mattermost-redux` to wzorzec redux (akceptowalny) czy realny dług.

## Sprzężenia spoza grafu JS/TS (uczciwość dowodu)

`dependency-cruiser` widzi **tylko frontend JS/TS**. Z artefaktu 1 (git) + `server/Makefile` dochodzi sprzężenie, którego ten graf **nie obejmuje**:

- **Klaster store backendu** (`store.go` → `sqlstore` + `retrylayer` + `timerlayer`): `retrylayer.go`/`timerlayer.go` mają w nagłówku `Code generated by "make store-layers" / DO NOT EDIT`. Ich co-change to **regeneracja, nie ręczna edycja** — tańszy rodzaj sprzężenia. ✅ rozwiązuje unknown z art. 1.

## Unknowns

- **Cały backend Go nie ma tu grafu** — `server/channels`, `store`, `api4`, `app` są poza zasięgiem depcruise. To `unknown`, nie „brak powiązań".
- Graf statyczny nie widzi **runtime coupling**: dynamic import, feature flagi, plugin API (`module_registry.ts`), DI, WebSocket events.
- Czy 108 cykli to dług czy wzorzec redux — wymaga oceny człowieka w Deep Focus.
- Czy `platform/components` (design system) jest spójny — był tylko częściowo w zakresie skanu.
