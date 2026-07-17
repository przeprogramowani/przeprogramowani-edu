# Learner Review: m5-l4 — Shared AI Registry: skille, komendy i reguły dla zespołu

> **Reconciliation pass (latest draft, current run).** Cold-read in character *before* opening this prior review, per project convention. My read **converges** with the artifact below — same through-line, same strengths, same **Ready with fixes / 4/5** verdict, no dimension below 3. Two prior NEW findings are now **fixed in the current draft** and I correctly did not re-feel them: "trzy wzorce" now delivers three (Sentinel markery, Manifest instalacji, **SKILL.md jako przenośny standard** at the section), and the Zadanie 2/3 numbering note now reads "za bazę **Zadania 3**" matching the body. The stray `,.` is also gone. Still present: the inline `[VIDEO PLACEHOLDER]` in Model 2 (author previously decided acceptable at draft stage — not re-litigated).
>
> **Two deltas I independently hit that this prior review predates:**
> 1. **Model 2 section opens on backstory before its own label.** "Trzy modele" promises Model 2 = "rejestr jako gotowa infrastruktura chmurowa". The `## Model 2` section then opens with "Czas na rozwiązanie, które zbudowałem na webinarze" + a story about building CodeArtifact on AWS **before** GitHub Packages. For a paragraph I wasn't sure if I was in Model 2 or flashing back to something built before Model 1. *Fix:* put a one-line orienting label ("Model 2 to rejestr jako gotowa infrastruktura chmurowa — u nas AWS CodeArtifact") at the very top, before the anecdote. Engagement/flow nit, not a comprehension gap.
> 2. **Model 3 signing-key half-loop.** "Klucz publiczny jest wkompilowany w CLI, więc samo przejęcie API nie wystarczy" — believable, but as a programmer I half-want one clause on where the *private* signing key lives (server-side / in the API), otherwise "compiled-in public key" silently raises "so who can sign?". Minor credibility wobble, didn't stall me.
>
> Both are quick, local fixes and neither changes the verdict. Keeping the richer prior artifact intact below rather than overwriting it with a thinner pass.

> Re-read on the **08:22 draft**, which is newer than the prior review (07:04). My cold read **converges fully** with that earlier review — same through-line, same strengths, and Fixes A/B/C (consumer/publisher framing, pre-Model-1 detour signpost, skim cue before the token-plumbing code) are all present and working in this draft. This pass is richer, not thinner: it keeps that convergent context and adds **two new defects** I independently hit on the current draft that the prior review predates — a "trzy wzorce" count that delivers two, and a Zadanie 2/3 numbering contradiction in the assignment. Both are quick, local fixes; neither blocks learning, hence the downgrade from "Ready" to "Ready with fixes" is a proofing call, not a content one.

## Verdict

**Ready with fixes** — overall 4/5

I'd finish this lesson knowing exactly what to do on Monday: look at who actually consumes my team's AI artifacts, pick a distribution model, and stand up a GitHub Packages starter from the handout. The through-line ("artefakty AI to kod → dystrybuuj je jak kod → wybór zależy od odbiorcy") held from the first line to the last, and the read/write auth asymmetry is the beat I'll remember because it's mechanism-backed, not asserted. It never lost me. What pulls it back from a clean "Ready" is a small cluster of proofing leaks the latest edit left behind: the "Wzorce" section promises **trzy** patterns and gives me **two**, the practical assignment calls the build task both "Zadanie 3" and "Zadania 2", and there's a raw `[VIDEO PLACEHOLDER]` plus a stray `,.`. Each is a 30-second fix, but the first two are things I *notice as a reader* — I counted the patterns, and I tried to follow the task numbers — so they belong in the verdict.

## Persona (reconstructed)

- **Already knew (prework + dependsOn):** how to *consume* packages (`npm/pip/maven install`, declaring a dependency, version resolution) but **never having published one** — first time on the producer side; CI/CD, tokens/secrets, JSON, git, conventional commits (working dev); `CLAUDE.md`/`AGENTS.md` rules + skills + prompts as my own accumulated 5-week workflow; daily `10x auth` / `10x get` since m1; the multi-repo "problem isn't duplication, it's manual maintenance + sync" framing from m4; GitHub Actions vocabulary, repo-secret→step passing, and the ephemeral-runner model from **m5-l3**; instruction hierarchy from prework [3.2]; the `/10x-shape → /10x-prd → /10x-roadmap → /10x-research → /10x-plan → /10x-implement` loop from m1–m2.
- **New here (this lesson's owns):** publishing a package at all; "AI artifacts are code" as a distribution-engineering problem; the three-model spectrum + audience-driven decision framework (GitHub Packages = default); read/write auth asymmetry; the sentinel-marker pattern + manifest-tracked install/update/uninstall; `SKILL.md` as a cross-tool open standard; plugin marketplaces as the single-tool alternative + lock-in warning; the API+CLI model (audience argument, storage→gate→applicator, the signing / allowlist / sentinel-injection security trio).
- **Came expecting it would NOT cover:** async & remote agent delegation — that's m5-l5, and the lesson correctly only hooks forward to it at the very end.

## Scores

| Dimension | Score | One-line reason |
|---|---|---|
| Comprehension & gap-freeness | 5/5 | Every owns concept lands with what-it-is + why-now; publishing mechanics (publishConfig, `.npmrc` scope, preinstall, CI token) are scaffolded for a first-time publisher; no leap I can't cross. |
| Knowledge calibration | 5/5 | Two-sided fit holds: the registry recap is pitched as needed teaching for a first-time *publisher* (not re-chewing what I consume daily), and m5-l3's GHA/secrets/ephemeral-runner material is referenced, not re-derived. AWS/Terraform/OIDC stay at gotcha depth. |
| Narrative & flow | 4/5 | Strong, traceable arc and the pre-Model-1 detours are now signposted — but "trzy wzorce" then two delivered is a real unpaid micro-promise, and the Zadanie 2/3 mismatch + inline `[VIDEO PLACEHOLDER]` are flow leaks I notice. |
| Engagement & momentum | 4/5 | Pulls well; the Model 1 token-plumbing run is still the densest stretch, but the skim cue at the top of it lets me coast rather than stall. |
| Authenticity (anti-LLM) | 5/5 | Reads like a practitioner who ships this — SmartRecruiters background, war-story gotchas, "dystrybucja pod CV", disciplined punctuation. Slop-sensor never fired. |
| Payoff & capability | 5/5 | I can name exactly what I can now do: pick a model by audience and publish my first GitHub Packages bundle from the handout. |
| **Overall** | **4/5** | Holistic: a strong, essentially-ready lesson with a thin layer of proofing defects on the latest edit. No dimension below 4, zero comprehension gaps — but the visible "three vs two" miscount and the assignment numbering contradiction are the few local fixes that make this "Ready with fixes" rather than "Ready". |

## Confusion Log (cold read, in character)

### "Wzorce, które przeżyją każdy model", l.263 vs l.265–314 — Narrative break (unpaid promise) — NEW
- What I felt: "The intro says *trzy wzorce* przenoszą się między modelami. Then I read **Sentinel markery** (l.265) and **Manifest instalacji** (l.296)... and the section ends and Model 3 starts. I scrolled back up looking for the third. Where's number three? Idempotency is mentioned, but it's folded into the other two, not a named pattern. I was promised three and counted two."
- Trigger: Narrative break — a stated count the section doesn't pay off.
- What I needed instead: either renumber to "dwa wzorce", or surface the implicit third as its own bolded pattern. The idempotent installer (it's already doing the heavy lifting in both the sentinel block-replace and the manifest cleanup) is the obvious candidate to promote to a named third pattern.

### "Zadania praktyczne", l.474 vs l.501 — Narrative break (numbering contradiction) — NEW
- What I felt: "l.474 tells me the badge project is the distribution package, *Zadanie 3 poniżej*. I build my plan around that. Then the closing note at l.501 says *za bazę Zadania 2 weź ścieżkę GitHub Packages* — but Zadanie 2 (l.478) is the *requirements* task, and the build-the-package task is Zadanie 3 (l.480). For a moment I genuinely didn't know which task the CodeArtifact note was qualifying."
- Trigger: Narrative break — internal cross-reference disagrees with itself in the one place I'm reading procedurally.
- What I needed instead: make l.501 point to the same task number as l.474 (the build task = Zadanie 3). One-word fix, but it's in the assignment, where I follow numbers literally.

### "Model 2", l.235 — production stub — PREVIOUSLY RAISED, author decided leave-as-is
- What I felt: "A raw `[VIDEO PLACEHOLDER: webinar ...]` sits in the body; on a linear read it's a hole where a video goes, right after the webinar paragraph that already links the same URL (l.233)."
- Status: the prior review flagged this; author confirmed it's acceptable at draft stage and resolved later in the pipeline. Recording again only because it's still inline on the 08:22 draft — not re-litigating the decision.

### Trivial polish — l.466
- "Traktuj je jak materiał do adaptacji,." — stray `,.` double punctuation at the end of the sentence. Noting once; editor territory.

### Convergent with prior review — confirmed RESOLVED in this draft (not re-raised)
- **Consumer/publisher framing (l.21–29):** the registry recap now anchors to "Znasz to z codziennej pracy jako konsument paczek. Tym razem sam staniesz po stronie wydawcy." Reads as exactly my situation — first-time publisher, not presumed producer. Fix A holds.
- **Pre-Model-1 detours (l.88):** "zdejmijmy z drogi dwie rzeczy" gives me the heads-up that Matt Pocock + marketplaces come before Model 1, so the "od niej zaczniemy" promise no longer slips. Fix B holds.
- **Token-plumbing density (l.159):** "Poniżej sporo kodu, ale zapamiętać masz z niego jedno... Resztę możesz przeglądać pobieżnie." The takeaway leads, so the TS body reads as illustration. Fix C holds.

## What Worked

- **The auth read/write asymmetry (l.147–157).** The beat I'll remember. "Zapis darmowy i tymczasowy, odczyt to długożyjący sekret wszędzie" reframed the whole "it's just one config field" picture, and the org-boundary nuance (l.155) made it feel honest instead of scary.
- **"Ten koszt nigdzie nie znika, tylko zmienia postać" (l.197).** The hinge between Model 1 and Model 2 — it made the comparison feel like one argument, not three disconnected setups. Same with "Tak właśnie dystrybuujemy dziś nasz wewnętrzny toolkit" (l.143): real, not hypothetical.
- **The 10x-cli reveal (l.318, 386).** "Tak działa rozwiązanie, którego używasz w tym kursie" reframed something I'd used passively all course as a live example of Model 3, and the "ty jesteś konsumentem, ale to kontekst 10xDevs, nie firmowy" caveat (l.370) stopped me confusing my two roles.
- **CodeArtifact's "repozytorium" terminology clash (l.241–243).** It pre-empted the exact confusion I'd hit and disambiguated domain vs scope vs repository cleanly. A section that respects my time.
- **The security trio in Model 3 (l.388–417).** Each guard came with the attack it prevents (MITM, login redirect, sentinel nuke), and the "Pamiętasz znaczniki sentinel?" callback at l.417 is a real "oh, *that's* why" payoff.
- **"Najczęstszy błąd: dystrybucja pod CV" (l.462–464).** Memorable, self-aware, inoculated me against the exact failure mode. "zrobiliśmy platformę, bo brzmi cool" is the humor the house voice wants.

## Through-line

AI artifacts are executable code, not notes — so distribute them like code (one source of truth + an installer); then pick the mechanism by *who your audience is* (GitHub Packages by default, CodeArtifact when you're an AWS shop, API+CLI when the audience is external/gated/revocable), judged against one fixed checklist of requirements. I could state that arc in one breath, which is the sign it held.

## Capability Check

In my voice: "I can look at my team, answer the one question that matters — who actually consumes these artifacts — pick GitHub Packages, CodeArtifact, or API+CLI off the table, and justify it in review. For the first time I can publish a package, not just install one: I've got a `10x get m5l4` starter (package.json, installer, `.npmrc`, publish workflow) to stand the GitHub Packages path up instead of just nodding at a diagram. And I know the one place it'll bite me — read-token plumbing in external CI — plus why I'd *not* reach for a marketplace or a self-hosted registry."

## Handoff to rc-review

- **"Trzy wzorce" vs two delivered (l.263):** flagged above as a learner-felt narrative break; also a coherence/contract item — the linear pass should decide renumber-to-two vs promote-a-third-pattern.
- **Zadanie 2/3 numbering contradiction (l.474 vs l.501):** internal cross-reference disagreement in the assignment; confirm which task number is canonical.
- **Reorder / bridge framing (l.7 "W module czwartym…", dependsOn now m5-l3; bridge-out l.470 → m5-l5):** schema `needsHumanDecision` flags an inverted bridge and stale "m5-l3" self-references after the m5 reorder. The draft *appears* corrected (self-identity uses m5l4, bridge-out points to m5-l5 as the last lesson, no stale "next lesson = how to build" framing). Read fine to me; contract question, not a felt one.
- **Aging-prone billing claim (l.157):** schema marks GitHub Packages billing as the most aging-prone claim — re-verify the free-tier framing and the "`GITHUB_TOKEN` download is free" statement against current GitHub docs.
- **Classic-vs-fine-grained PAT (l.213):** grounding notes flag roadmap #558 may have shipped — re-check that "tokeny fine-grained wciąż nie obsługują rejestru npm na GitHub Packages" still holds, and adjust the "klasyczny PAT only" sentence if it has.
- **Author-progression numbering (l.219–223):** draft introduces Model 2 (CodeArtifact) as "rozwiązanie, które zbudowałem na webinarze" while Model 1 (GitHub Packages) is the production system; the grounding source filenames invert the model tags. Reads internally consistent to me — flagging only because the source metadata disagrees.
- **`[VIDEO PLACEHOLDER]` (l.235):** unresolved production stub still inline; author confirmed acceptable at draft stage, resolved later in pipeline.
- **Matt Pocock X claim (l.88, l.540):** practitioner-signal source — verify the status URL and the "czerwiec 2026" date stamp.
