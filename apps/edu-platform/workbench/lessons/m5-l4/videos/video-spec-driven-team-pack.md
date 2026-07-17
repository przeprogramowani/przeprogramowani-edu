# Video Scenario: Od `10x get` do własnego team packa (spec-driven)

> Lesson: **m5-l4 — Shared AI Registry: skille, komendy i reguły dla zespołu**
> Slug: `spec-driven-team-pack`
> Combines video ideas **#3 (Model 3 under-the-hood peek)** and **#2 (spec-driven bootstrap of a Model 1 pack)** into one arc — they share the `10x get` beat.

## Recording metadata

- **Estimated length:** 7–9 min
- **Format:** terminal + editor screencast, voiceover narration (PL). On-screen directions below in English.
- **Primary tool on screen:** Claude Code (default profile). The CLI step works for any of the 7 profiles; mention that, record with one.
- **Prerequisites / dependencies (resolve before recording):**
  1. **Handout wiring:** the model-labeled files are wired into `10x get m5l4` through `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-05/lesson-04.ts`. Record against a build that includes the new names: `m5l4-shared-*`, `m5l4-github-packages-*`, and optional `m5l4-codeartifact-*`.
  2. A throwaway GitHub org/repo to publish the demo pack to (so `publishConfig` → GitHub Packages is real, not faked).
  3. A logged-out CLI state at the start, so `10x auth` is shown live.
- **Learner-facing command rule:** only `10x auth` / `10x get` appear on screen and in narration. No internal toolkit commands (`npx @przeprogramowani/10x-toolkit ...`).

## Through-line (one sentence)

The same `10x get` you've used all course to *consume* the toolkit (Model 3) now hands you the specs to *produce* your own team pack (Model 1) — consumer and producer, one command.

## Arc

| Act | Beat | Maps to |
|-----|------|---------|
| **Act 1** | You're already a Model-3 consumer — peek under the hood | Video idea #3 |
| **bridge** | `10x get` the spec handout — the consume→produce pivot | shared beat |
| **Act 2** | Feed specs to the Agent → scaffold a Model-1 pack | Video idea #2, Zadanie 2 |
| **close** | Publish-ready: what you'd merge to ship it to the team | Model 1 payoff |

---

## Act 1 — You've been using Model 3 this whole time (≈2 min)

**On screen:** fresh terminal, CLI logged out.

**Action 1.1** — run `10x auth`. Show the magic-link prompt, the email arriving, the browser confirm, the terminal flipping to authenticated.

> **Narracja:** „Tę komendę znasz od pierwszego dnia kursu. `10x auth` — logujesz się magic linkiem. Ale zatrzymajmy się na chwilę nad tym, co się właśnie wydarzyło, bo to jest żywy przykład trzeciego modelu dystrybucji z lekcji."

**Action 1.2** — overlay the storage→gate→applicator diagram from the lesson (the second mermaid). Annotate live as you narrate.

> **Narracja:** „W zamian za magic link dostałeś krótki token dostępu — JWT ważny godzinę — i długożyjący refresh token, który rotuje się przy każdym użyciu. Twoje uprawnienia nie siedzą w tym tokenie. Bramka sprawdza je przy każdym odświeżeniu w osobnym magazynie, do którego dane o dostępie trafiają ze społeczności na Circle. Dlatego gdyby ktoś zwrócił dostęp, wypadłby z kursu w najwyżej godzinę — tyle żyje token, zanim wymusi ponowne sprawdzenie."

**Director note:** keep this to the *what*, not the *how to build it* — that's m5-l1 (AI Internal Builders). The point is recognition: "oh, the thing I use is exactly Model 3."

> **Narracja (zamknięcie aktu):** „Czemu te materiały nie leżą po prostu jako paczka na npm? Bo nie rozdasz organizacyjnego tokena trzem tysiącom kursantów. Odbiorca — zewnętrzny i bramkowany — wymusił API plus CLI. A teraz odwrócimy role: z konsumenta staniesz się producentem."

---

## Bridge — `10x get` the handout (≈30 s)

**Action B.1** — run `10x get` for the spec handout. Show the model-labeled files landing in the workspace.

> **Narracja:** „Jedna komenda, ten sam mechanizm. `10x get` zaciąga teraz nie lekcję, ale zestaw specyfikacji i starterów. Pliki `m5l4-shared-*` są wspólne, `m5l4-github-packages-*` to ścieżka domyślna, a `m5l4-codeartifact-*` to dodatek AWS. Do tego dostajesz template'y: `package.json`, instalator, uninstall i workflow publikujący paczkę."

**On screen:** briefly open `m5l4-shared-conventions.md` — show it's the team's review standards (the payload from the previous lesson, m5-l3).

> **Narracja:** „`m5l4-shared-conventions.md` to wasze standardy review z poprzedniej lekcji. Do zadania bierzemy pliki GitHub Packages, bo to model pierwszy i domyślna rekomendacja. CodeArtifact zostaje jako świadomy wariant AWS."

---

## Act 2 — Spec-driven bootstrap of a Model-1 pack (≈4 min)

**Action 2.1** — in Claude Code, prompt the Agent with the specs as input. Show the actual prompt.

> **On-screen prompt (example):** „Na podstawie `m5l4-shared-spec-skill.md`, `m5l4-shared-conventions.md`, `m5l4-github-packages-spec-pack.md`, `m5l4-github-packages-spec-cicd.md` oraz template'ów `m5l4-github-packages-*.template` wygeneruj szkielet paczki npm dla zespołu: skill `code-review` zrodzony z konwencji, `package.json` z `publishConfig` na GitHub Packages, instalator, uninstall i workflow publikujący na merge. Zignoruj pliki `m5l4-codeartifact-*`, bo to appendix AWS."

> **Narracja:** „To jest sedno metody spec-driven: nie dyktujesz kodu, dyktujesz intencję. Specyfikacja jest wejściem, budowę zostawiasz Agentowi."

**Action 2.2** — let the Agent scaffold. Speed-ramp the generation in edit. Show the resulting tree:

```
ai-toolkit/
├── package.json          # publishConfig → npm.pkg.github.com
├── skills/
│   └── code-review/SKILL.md
└── .github/workflows/publish.yml
```

**Action 2.3** — open `package.json`, highlight the one field that is "the whole infrastructure":

```json
"publishConfig": { "registry": "https://npm.pkg.github.com" }
```

> **Narracja:** „Cały 'provisioning' rejestru to jedno pole. Pamiętasz model pierwszy z lekcji? Tu go widzisz na żywo."

**Action 2.4** — open `.github/workflows/publish.yml`, point at the two auth halves (the asymmetry beat):

> **Narracja:** „Publikacja w CI używa efemerycznego `GITHUB_TOKEN` — `permissions: packages: write`, zero sekretów do rotowania. Cała upierdliwość, czyli token do odczytu, czeka po stronie konsumenta — o tym mówiliśmy w sekcji o hydraulice tokenów."

**Action 2.5** — open `skills/code-review/SKILL.md`, show it traces back to `m5l4-shared-conventions.md`.

> **Narracja:** „A skill review nie jest wymyślony — wprost wyrasta z waszego `m5l4-shared-conventions.md`. Standard, pipeline, paczka: jedna linia pochodzenia."

---

## Close — what shipping it looks like (≈1 min)

**Action C.1** — narrate the publish path without necessarily recording a live publish (or do, if the throwaway org is ready): bump version → merge → CI publishes → a consumer repo does one `install`.

> **Narracja:** „Żeby to trafiło do zespołu: podbijasz wersję, robisz merge, CI publikuje. Każde repo zaciąga paczkę jak zwykłą zależność, a przy aktualizacji reguły review wystarczy jeden `install`. Z kopiuj-wklej między repo robi się jedno źródło prawdy."

> **Narracja (zamknięcie):** „Zacząłeś jako konsument trzeciego modelu, kończysz jako producent pierwszego — tą samą komendą `10x get`. To jest twoje Zadanie 2: zrób to dla własnego zespołu."

---

## Alignment check (video ↔ lesson)

- **No thesis drift:** reinforces "AI artifacts are code; audience picks the model." Act 1 = Model 3 (audience-forced), Act 2 = Model 1 (default for GitHub teams). ✓
- **No new claims:** every Act-1 mechanic (1h JWT, refresh rotation, Circle→KV, ≤1h revocation, 7 profiles) is in the draft prose (`Model 3` section) and verified in code (`10x-toolkit/packages/api`, `10x-cli`). ✓
- **Boundary respect:** Act 1 stays at *what*, defers *how to build the gate* to m5-l1. ✓
- **Command rule:** only `10x auth` / `10x get` on screen. ✓

## Open recording decisions (needs human call)

1. **Confirm the build contains the renamed handouts** before recording: `m5l4-shared-*`, `m5l4-github-packages-*`, and `m5l4-codeartifact-*`.
2. **Live publish vs narrated close** — record an actual GitHub Packages publish (stronger, needs throwaway org) or keep the close narrated (safer, faster).
3. **Which tool profile to film** — default `claude-code`, but could film `cursor` if the audience skews that way; mention the other six either way.
