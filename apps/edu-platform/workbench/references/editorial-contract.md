# Editorial Contract

Single source of truth for three cross-cutting editorial rules shared by the
lesson pipeline (`lesson-spec → lesson-grounding → lesson-draft →
lesson-editor-pl → lesson-rc-review`). Each skill references this file rather
than restating these rules, so the contract composes as a whole instead of
drifting across five divergent copies.

The pipeline applies many *additive* forces (more continuity, more claims, more
voice). These three rules are the *subtractive* counter-weights. They exist to
stop the recurring hand-fixes: filler / restated narrative figures, over-forced
inter-lesson and inter-section continuity, and half-introduced concepts named
but never explained.

Rule format mirrors `references/style.md`: **Rule → Before → After → How to
apply**. Examples are concrete so any drafter, editor, or reviewer can act on
them without re-deriving intent. Examples are illustrative Polish prose; the
rules themselves are language-agnostic.

---

## 1. Editorial Economy

**Owner:** `lesson-editor-pl` (systematic Economy Pass).
**Backstop:** `lesson-rc-review` (economy finding).

#### Rule: Every sentence earns its place; cut payload-free narrative

A sentence stays only if it carries information, advances the argument, or sets
up a later payoff. Cut verbatim or near-verbatim restatement of a point already
made in a nearby section. Cut asides that exist only to fill space or perform
voice. Merge repeated beats into one.

**Before (filler / payload-free aside):**
> Bezpieczne uwierzytelnianie agenta to dziś standard. Nie musimy wymyślać koła
> na nowo. Skorzystamy z gotowych mechanizmów.

**After:**
> Bezpieczne uwierzytelnianie agenta oprzemy na gotowych mechanizmach.

**Before (near-verbatim restatement across sections):**
> *(sekcja 3)* Token trafia do nagłówka `Authorization`.
> *(sekcja 5)* Jak już wspominaliśmy, token wędruje w nagłówku `Authorization`.

**After:** keep the first statement; in section 5 reference it only if the new
context adds something (`token z sekcji 3 — tu używamy go do…`), otherwise cut.

**Before (summary-announcing / self-narration):**
> W tej sekcji podsumujemy to, co właśnie omówiliśmy.

**After:** cut the announcement; let the summary content stand on its own (or
drop it if it only repeats).

**How to apply:** Sweep the draft section by section. For each sentence ask:
"Does this add information, advance the argument, or set up a payoff?" If none,
cut it or merge it. Treat a quota of asides as a ceiling, not a target — an
informative aside survives, a decorative one does not.

---

## 2. Concept-Introduction Adequacy

Enforced at three touchpoints from this one definition: spec logic-map field
(`Introduces (what + why-now)`), draft self-review, rc-review dependency ledger.

#### Rule: At first substantive use, say what it is and why it matters now

Ordering ("introduced before it is used") is necessary but **not sufficient**. At
a concept's first substantive use the text must state *what it is* and *why it
matters here, now*. A bare name-drop — even of correct, well-sourced
terminology — is a half-introduction and a defect, whether the term appears for
the first time or is course vocabulary reused without grounding.

**Before (name-drop):**
> Do wymiany tożsamości użyjemy OIDC, podpiszemy żądania kluczem Ed25519, a
> kontrakt opiszemy w OpenAPI 3.1.

**After:**
> Do wymiany tożsamości użyjemy OIDC — warstwy tożsamości nad OAuth, dzięki
> której agent dostaje zweryfikowany token zamiast surowego hasła. Żądania
> podpiszemy kluczem Ed25519 (szybki, krótki podpis asymetryczny), bo chcemy,
> żeby serwer mógł potwierdzić nadawcę bez współdzielonego sekretu.

(If a detail like `OpenAPI 3.1` does not need introducing, cut it rather than
name-drop it — see the grounding note below.)

**Grounding note (for `lesson-grounding`):** A source may be used *silently* to
get a fact right. Not every supported claim must become a surfaced sentence. Do
not turn the claims list into a checklist of name-drops. If a claim is too thin
to introduce adequately (what + why-now), flag it — either it earns a proper
introduction or it is cut.

**How to apply:** At each concept's first substantive use, check for two
clauses: *what it is* (a short gloss) and *why it matters now* (its job in this
lesson). If either is missing, either expand to adequacy or cut the term.

---

## 3. Continuity Earns Its Place

Stated symmetrically with "introduced before used": continuity serves clarity,
it is not a value in itself.

#### Rule: Continuity serves clarity — do not manufacture transitions

A transition, bridge, or forward-reference is justified only when it helps the
reader follow the argument. A clean, labeled topic switch is acceptable and
often clearer than a forced connective. Do not manufacture transitions between
sections that are already independently clear. Do not pre-announce a topic only
to claim the payoff later. Bridges in and out of a lesson are conditional, not
mandatory — include them when the thesis depends on the connection.

**Before (manufactured pre-announcement):**
> Instalator skonfiguruje też zmienne środowiskowe — ale do tego jeszcze
> wrócimy.
> *(…później…)* Tak jak obiecaliśmy, wracamy teraz do zmiennych środowiskowych.

**After:** drop the pre-announcement and the callback; introduce the env-vars
topic where it actually belongs, with its own what + why-now.

**Before (forced inter-section bridge):**
> Skoro wiemy już, jak działa logowanie, naturalnym kolejnym krokiem — bo
> wszystko się przecież łączy — będzie przyjrzenie się autoryzacji.

**After:**
> Mamy logowanie. Teraz autoryzacja: kto może co zrobić po zalogowaniu.

**How to apply:** For each bridge/transition/forward-reference ask: "Does the
reader need this connection to follow the lesson?" If the sections are
independently clear, prefer a clean labeled switch. A *missing* bridge is a
defect only when the lesson's thesis genuinely depends on the connection — not
automatically.
