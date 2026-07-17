# Handoff: M4-L2 → M4-L3 (Wide Scan → Deep Focus)

Krótkie podsumowanie procesu na dużym/legacy repo. Demo: Mattermost.

**Last commit:**
 
commit 29bab2184db42103dd30c0827059ef3f854847d4
Author: Nuno Simões <nuno.simoes@mattermost.com>
Date:   Tue Apr 21 21:25:01 2026 +0200

## M4-L2 — Mapa projektu ① (Wide Scan)

**Cel:** „gdzie warto patrzeć?" — szeroki, tani skan zanim agent czyta kod.

**Narzędzia (CLI, deterministyczne):**
- `git` — historia zmian: terytorium, aktywność w czasie, współzmiany (co-change), kontrybutorzy
- `dependency-cruiser` / `madge` — graf zależności: entry pointy, cykle, centra, blast radius
- Graphviz — render wybranego podgrafu do SVG
- `rg` / `grep` — wyszukiwanie wzorców

**Artefakty:**
- `context/map/artifact-1-territory.md`
- `context/map/artifact-2-structure.md`
- `context/map/artifact-3-contributors.md`
- `context/map/repo-map.md` ← finalna synteza (sekcje: `TL;DR`, `Teren`, `Realne powiązania`, `Strefy ryzyka`, `Kogo zapytać`, `Pierwszy dzień`, `Ograniczenia`)

**Wnioski:** gdzie skupia się praca, strefy ryzyka, realne couplingi, entry pointy, jawne `unknowns`. Mapa = kontrakt wejściowy, nie esej.

**Granica:** mapa pokazuje szerokość/strukturę/snapshot — NIE głębokość, NIE zachowanie runtime, NIE aktualny stan kontraktów.

## M4-L3 — Feature overview ② + Technical debt ③ (Deep Focus)

**Cel:** „jak ten jeden przepływ działa i gdzie boli?" — wąsko, ale głęboko, z dowodami.

**Wejście:** mapa jako prior. Cel wybrany ze `Strefy ryzyka`, entry pointy z `Pierwszy dzień`, pierwsze `unknowns` z `Ograniczenia`. Demo: zapis wiadomości `PostStore.Save` (warstwa store).

**Narzędzia:**
- `/10x-research` (tryb kontrolowany) — jedno zapytanie → 3 sub-agenty: **trace e2e**, **luki w testach**, **blast radius** (graf statyczny + co-change)
- `/10x-init`, `/10x-new` — przygotowanie miejsca pod research
- `ast-grep` — konfirmacja twierdzeń strukturalnych (liczby, „tylko tutaj", `Save` vs `SaveMultiple`)
- `grep` — potwierdzenie każdego zera z `ast-grep`

**Artefakt:**
- `context/changes/<feature-slug>/research.md` ← dwie sekcje: ② Feature overview, ③ Technical debt (rygor `evidence` / `inference` / `unknown`)

## Gdzie się zatrzymujemy

- Koniec L3 = **dowody i ryzyko**, NIE refaktor.
- NIE wybieramy target architecture, NIE projektujemy migracji, NIE proponujemy zmian.
- `ast-grep` w trybie rewrite tylko **zapowiedziany** — używamy go w M4-L4 (if needed!).
- **Następny krok (M4-L4):** zamienić raport w rankingowane refactor opportunities, inkrementalnie i z siatką bezpieczeństwa. Może followup do 10x-test-plan. Ew. kandydaci na wzorce / refaktor / archetypy / plan optymalizacji danego fragmentu.

## Od czego zacząć M4-L4

- Analiza "Technical debt", "Blast radius" oraz "Obszar 1 — Luki w pokryciu testami" z changes/post-flow-analysis/research.md
- Wykorzystaj /10x-research oraz /10x-plan
- /test-plan do zabezpieczenia refaktoryzacji testami