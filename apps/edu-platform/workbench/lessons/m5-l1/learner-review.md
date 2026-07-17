# Learner Review: m5-l1 — AI Internal Builders: wewnętrzne narzędzia, serwisy i automatyzacje

> Re-review of the edited draft (Jun 14, 06:44). My independent cold read **converges** with the
> prior review on verdict (Ready), scores (4/5 overall), and live findings. Two prior findings are
> now **fixed**: the redundant opportunity-map LR mermaid was removed (earlier pass), and the
> back-third **routing repetition** — the prior review's single biggest drag — has been collapsed:
> "Jak helper dojrzewa" (lines 227–231) no longer re-walks M5L2/L3/L4/L5; it now self-references
> the three earlier pointers and reduces to one rule (*hypothesis, not commitment*). Line numbers
> below are refreshed to the current draft.

## Verdict

**Ready** — overall 4/5

I'd finish this knowing exactly what I came for: how to *not* over-build. The opening names my real itch — "skoro AI umie szybko pisać kod, to zbudujmy własne narzędzie" — and immediately ("I dlatego trzeba uważać") tells me the lesson will talk me *down* from it, not hype me. The SaaS-as-responsibility reframe lands, and the opportunity map plus the worked digest hand me an artifact I could fill out tomorrow. The back-third routing repetition that dragged the prior read has been fixed — the "Jak helper dojrzewa" section now names the repetition and collapses to a single rule rather than re-walking the four later lessons. The one soft spot left is Step 4's 10xChampion checklist: it asks me to plan evidence (pipeline views, job logs, package definitions) for workflows I haven't built and won't build here, and although the framing ("części z tych pozycji jeszcze nie rozpoznasz") keeps me from getting lost, it floats as a future obligation rather than a capability gained now. Nothing blocks comprehension and no slop breaks trust — the remaining polish is tightening, not rescuing.

## Persona (reconstructed)

- **Already knew (prework + m4-l5):** model/agent/harness layers and tool use [1.2]; IDE vs terminal vs cloud tradeoffs [2.x]; prompt/context/model discipline and LLM token mechanics [3.x]; CI/CD baseline and "small useful flow before big product" [4.2]; the solo 10x loop (`/10x-shape` → `/10x-prd` → `/10x-roadmap` → `/10x-research` → `/10x-plan` → `/10x-implement`); DDD legacy modernization at prompt/plan level (m4-l5). I do **not** need PoC, CLI, SDK, CI, or API expanded.
- **New here (this lesson's owns):** build-vs-buy-vs-complement frame; SaaS as platform responsibility (not a feature list); team friction as the opportunity signal; the opportunity-map artifact; the "first useful version" rule; internal-builder leverage (trust without promotion promises); the 10xChampion screenshot evidence package.
- **Came expecting it would NOT cover (preparesFor m5-l2):** how to actually build the SDK agent. Correct — the lesson stays on the decision, not the build.

## Scores

| Dimension | Score | One-line reason |
|---|---|---|
| Comprehension & gap-freeness | 5/5 | Every owned concept (complement frame, SaaS-as-responsibility, opportunity map, first useful version) arrives with what-it-is + why-now before use; `/10x-new` is glossed inline ("które zakłada folder zmiany"), so no leap I couldn't cross. |
| Knowledge calibration | 4/5 | Doesn't re-teach agents/harness/CLI and correctly teaches The Mom Test inline as a half-known callback — good; loses a point for retelling the forward M5 routing often enough that it reads as being walked the same hallway, plus the tiny over-explain "PoC, czyli prototypu sprawdzającego pomysł" (line 258) I don't need. |
| Narrative & flow | 4/5 | Clean through-line (friction → classify → smallest complement → validate → mature later); the routing repetition across table field + three examples + the dedicated maturation section sags the back third. |
| Engagement & momentum | 4/5 | Strong front half (temptation hook, SaaS argument, digest example); the routing-repeat in the back third and Step 4's abstract 10xChampion checklist are where I skimmed. |
| Authenticity (anti-LLM) | 4/5 | Mostly reads like a confident practitioner; the recurring "To nie X. To Y." cadence (lines 29–31, 189, 225) mildly pings the sensor by the third hit, but trust holds and the slop sensor never really fires. |
| Payoff & capability | 4/5 | I leave able to produce and route an opportunity map and sketch a deliberately no-auth/no-deploy first version — real and honest, if modest; the 10xChampion checklist is the one part that's prep-for-later rather than a capability gained now. |
| **Overall** | **4/5** | Holistic, not an average: solid and learnable end-to-end; nothing caps it low, the only drag is the "graduate later" routing repeating in the final third. |

## Confusion Log (cold read, in character)

### Wstęp (lines 1–17) — worked
- What I felt: "'zbudujmy własne narzędzie' is exactly my itch, and 'I dlatego trzeba uważać' tells me the lesson will discipline it, not feed it. Recognition-level, no code, a real temptation named — I trust where this is going."

### "SaaS to nie tylko funkcje" (lines 35–53) — worked
- What I felt: "The strawman quote ('przecież z AI zrobimy ją w weekend') is me on a bad day. The list of invisible responsibilities — uprawnienia, audyty, onboarding, dane klienta — reframes 'mały helper' into 'pełny produkt wewnętrzny' and I feel the trap close. 'czy powinniśmy przejąć tę odpowiedzialność?' is the better question and I buy it."

### Decision flowchart (lines 69–93) — momentum, minor
- What I felt: "Clean diagram, repeats the prose I just read — fine for a visual learner. Node H ('Późniejsza ścieżka M5 — agent, pipeline, registry lub async') is the *first* time I'm routed forward, and it won't be the last."
- What I needed instead: nothing yet — earned. Flagging only because it starts a pattern.

### Routing-to-two-flows paragraphs (lines 147–151) — momentum drop
- What I felt: "Two paragraphs fire `/10x-shape`, `/10x-prd`, `/10x-roadmap`, `/10x-new`, `/10x-research`, `/10x-plan`, `/10x-implement` at me. I know these, so I'm not lost — I just glazed. I half-paused at `/10x-new`; it's the one command I'm least sure I met by name, but 'które zakłada folder zmiany' catches me in the same clause, so I recover."
- What I needed instead: nothing blocking — the split into two paragraphs (fuzzy/big → shaping flow; narrow/clear → implementation flow) and the inline gloss of `/10x-new` already do the work. Previously raised against a single fat paragraph; reads better now.

### Mom Test checkpoint (lines 153–157) — calibration (under), recovered
- What I felt: "*The Mom Test* lands as a named thing I might not have met — I didn't necessarily do 10xDevs 2 — but the next sentences tell me what it means in practice (don't ask 'czy używaliby', ask about ostatnie konkretne sytuacje, obejścia, realny koszt), so I get enough to act. It reads as the next move after classifying on paper, not an appended gate."

### "Przykład: digest tarcia zespołowego" (lines 159–207) — worked, the high point
- What I felt: "This is where it clicks. Four tools each holding 'część prawdy', then the concrete digest with PR #1842 / PAY-412 / Release 2026.06.11 — I can *see* the artifact. And 'największa wartość ... bierze się z lokalnego połączenia sygnałów, których jeden SaaS z definicji nie widzi' is the real insight of the lesson. That sentence alone justified the read."

### "Jak helper dojrzewa" (lines 227–231) — previously a repetition drag, now collapsed
- What I felt (this read): "It opens by *naming* the repetition — 'wypełniałeś pole "Późniejsza ścieżka M5" już trzy razy' — and instead of re-walking the four lessons it lands one rule: this direction is a hypothesis, not a commitment, and only graduates when the helper proves itself. The earlier 'walked the same hallway' feeling is gone; two short paragraphs do the job."
- Prior read (now addressed): a full section re-walked M5L2/L3/L4/L5 after the table field and three example pointers had already routed me forward; I skimmed it. The Jun 14 edit collapsed it exactly as the prior review recommended — keep the per-example pointers, cut this to a self-aware two-paragraph rule.

### Recurring "To nie X. To Y." cadence — authenticity, minor
- What I felt: "'To nie są jeszcze pomysły na produkt. To sygnały.' (29–31) / 'To nie jest pełny system... To mały widok.' (189) / 'To nie straszenie zgodnością..., tylko zwykła higiena.' (225) — by the third I notice the beat. Reads as deliberate emphasis, not slop, but it's a recognizable tic."
- What I needed instead: vary one or two so the shape doesn't repeat. (Style guide also prefers merging "Nie X. Y." contrasts into one sentence.)

### 10xChampion checklist, Step 4 (lines 306–327) — capability/abstraction, minor
- What I felt: "Screenshots-not-repos is reassuring (I *can* use company context). But the checklist — 'definicja paczki', 'widok pipeline'u', 'logi z pipeline'u' — points at things I haven't built and won't build here. It's framed as 'kategorie zrzutów, które będziesz zbierać później' and 'części z tych pozycji jeszcze nie rozpoznasz', so I don't get lost, but it floats. I'm noting a future obligation more than learning something now."
- What I needed instead: nothing blocking — the framing saves it. One half-clause tying each checklist item to the specific later lesson that produces it would make it feel less like an abstract list.

## What Worked

- **The temptation hook** (Wstęp): naming the "zbudujmy własne narzędzie w weekend" impulse and immediately signalling the lesson will discipline it, not feed it.
- **SaaS-as-responsibility reframe** (lines 41–53): turning "brakuje nam jednego widoku" into "przejmujesz dostęp do danych, logi, onboarding, audyt" genuinely changed how I'd weigh the next "let's just build it."
- **The digest worked example** (lines 169–207): the concrete read-only digest plus "lokalne połączenie sygnałów, których jeden SaaS nie widzi" is the load-bearing idea, delivered well.
- **Honest framing of payoff** (lines 246–252): "To nie jest obietnica awansu" and "nie jest jeszcze zbudowanie agenta" — the lesson doesn't oversell, which makes me trust it more.

## Previously raised, now fixed

- **Back-third routing repetition** (Jun 14 edit) — the prior review's #1 drag: the "graduate to a later M5 path" beat reaching me a fourth time in a dedicated "Jak helper dojrzewa" section that re-walked M5L2/L3/L4/L5. The current draft collapses that section to two paragraphs that *name* the prior three pointers and reduce to one rule (hypothesis, not commitment), then explicitly defers SDK/CI/registries/remote to later. Exactly the "collapse it" fix recommended. Resolved.
- **Redundant opportunity-map LR mermaid** — the prior review asked to cut the LR mermaid that restated the five-field chain right under the "Pole | Pytanie" table. The current draft goes straight from the table to "Zobacz trzy przykładowe klasyfikacje" with no diagram between them. Only two diagrams remain (decision flowchart at line 69, digest sources→digest at line 191), neither redundant. Resolved.

## Through-line

I can state it in one sentence: *spot a repeated team friction, classify it honestly with an opportunity map (buy / complement / wait), validate it against real people with Mom Test questions, and if you build, build the smallest read-only complement around existing systems first — then let it graduate into a later Module 5 path only if it proves itself.* The arc holds; only the closing third repeats the "graduate later" beat more than it needs to.

## Capability Check

In my voice: "I can take a recurring annoyance on my team, fill out a five-field opportunity map, and decide whether to use the SaaS default, build a thin read-only helper, or wait — and I can sketch a first useful version that deliberately has no auth, no deploy, no database, then pressure-test it with Mom Test questions before writing code. I can't build the agent yet, and the lesson is upfront that that's m5-l2's job." A real, if intentionally modest, capability — exactly what a module-opening lesson should leave me with.

## Handoff to rc-review

- **Scope/continuity:** The Mom Test is `referencesOnly` (10xDevs 2 / Opanuj Frontend). The inline intro (153–157) reads fine to me — confirm a 10xDevs-3-only learner isn't assumed to already own it and that it stays a "validation checkpoint", not a discovery curriculum.
- **Continuity:** `/10x-new` appears in the implementation flow (line 151) — verify an earlier module established this command by name for the learner.
- **Terminology:** main section "Kup, uzupełnij albo zbuduj" vs Deep Dive "Build, buy, complement" vs schema `owns` "build-vs-buy-vs-complement" — order and language differ across the lesson; confirm intentional.
- **Scope/forward-reference:** the 10xChampion checklist names "definicja paczki", "widok pipeline'u", "logi" (320–325) — deliverables of m5-l2/l3/l4. Verify it stays an evidence-shape forward reference and doesn't tip into teaching pipeline/registry mechanics (`mustNotCover`), and that the items match what m5-l3/m5-l4 actually deliver.
- **Currency:** Linear "Triage Intelligence" and vendor-built AI triage references (lines 205, 383) — grounding notes already flag plan-tier/feature drift; confirm prose stays generic. Not verified here.
- Otherwise (none) on factual smells — the digest stays mocked/read-only and the lesson stops at routing, not implementation.
