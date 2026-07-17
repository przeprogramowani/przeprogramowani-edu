# Learner Review: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym

## Verdict

**Ready** — overall 4.5/5

I'd finish this lesson knowing exactly what I came for: when and how I can hand a task to an agent and walk away. The control-relocation thesis ("kontrola nie znika, tylko zmienia miejsce") is set on the first screen and actually pays off three times — the phone thread, the runbook, and the "green run ≠ success" line all land where they were promised. Calibration is the standout: as someone who already did m2-l5, I was braced to be re-taught Ralph and `/goal`, and instead the draft pointed back and moved on; the MCP section goes straight to its sandbox-specific consequence instead of re-defining MCP at me. It nearly lost me only twice, both cosmetic: the three modes are named one way in prose and a slightly different way in the table right below, and the MCP subsection introduces itself twice before getting to the point. Neither stopped me. The slop sensor stayed quiet — this reads like a practitioner wrote it, with maybe one faint twitch at how often a section ends on the same kind of punchy one-liner.

## Persona (reconstructed)

- **Already knew (prework + m5-l4 + course-order priors):** SSH/tmux/mosh, terminal, JSON, APIs, git, NAT/port-forwarding (I'm a working dev); harness as the control layer — sandboxing, context, diffs, approvals ([1.2]); prompt-as-contract with goal/scope/boundaries/verification ([3.2]); context engineering and isolation ([3.3]); IDE/terminal/cloud agent environments and agent-native background work, mobility, secrets, costs ([2.1], [2.4]); MCP and committed `.mcp.json` as a shared artifact (m5-l4); and from m2-l5 in course order — worktrees, independent slices, `/goal`, the Ralph loop, the orchestrator roundup.
- **New here (this lesson's owns):** the control-moment model; the three execution archetypes (SSH/tmux, Happy, managed cloud sandbox) as a *task-driven* choice; the transferable sandbox config model (setup / network / MCP / cache / secrets / preinstalled tools); isolation-as-autonomy; delegate-and-monitor-from-phone ending in review criteria; `/loop` and routines as scheduled control; the "control moved, it didn't disappear" failure model.
- **Came expecting it would NOT cover:** re-teaching Ralph/`/goal`, worktree mechanics, the orchestrator survey, building an SDK agent, or a Cloudflare Agents implementation tutorial. `preparesFor` is empty — I read it as the module/course capstone, and it framed itself that way. It correctly defers all the out-of-scope items.

## Scores

| Dimension | Score | One-line reason |
|---|---|---|
| Comprehension & gap-freeness | 5/5 | Every new concept arrived with a usable what-it-is + why-now; no leap I couldn't cross with my priors. |
| Knowledge calibration | 5/5 | Exemplary two-sided fit — back-pointed to m2-l5 instead of re-teaching, went straight to the sandbox-specific MCP point, never expanded SSH/CLI/JSON down to me. |
| Narrative & flow | 4/5 | Strong, traceable through-line, all promises paid; docked for the prose-vs-table mode-name mismatch and the doubled MCP intro. |
| Engagement & momentum | 4/5 | Pulled me through; the six-question block is long and the cache sub-section is the one limp spot. |
| Authenticity (anti-LLM) | 4/5 | Human practitioner voice; faint repeated rhythm of "section → aphoristic closer" is the only tell. |
| Payoff & capability | 5/5 | I can name exactly what I can now do, and the YAML runbook is a tangible take-home artifact. |
| **Overall** | **4.5/5** | Holistic (not an average): a genuinely ready capstone. Only minor, local stumbles, each self-recovered; spine and payoff are clear and no dimension is near a cap. |

## Confusion Log (cold read, in character)

### "Kiedy kontrolujesz pracę agenta?" — modes vs. table (prose 19–23 → table 27–31) — Narrative break (minor)
- What I felt: "I just learned the three modes as *zdalna kontrola lokalnego agenta*, *sandbox w chmurze*, *pętle i routines*… and the table's first column right below renames them *Zdalna kontrola w czasie rzeczywistym*, *Uruchom i monitoruj*, *Zaplanowany lub cykliczny przebieg*. Same three? I think so, by row order — but I stopped to re-map them."
- What I needed instead: the table's first column echoing the bold mode names from the prose above (or the prose adopting the table's verbs), so the mapping is automatic and I don't align two naming schemes mid-read.

### "Jak przenosisz MCP i konfigurację narzędzi?" (lines 77–79) — Momentum drop (minor)
- What I felt: "Two sentences in a row tell me MCP matters in the sandbox — *'W sandboxie widać, dlaczego to ma znaczenie'* then *'W sandboxie MCP ma znaczenie z konkretnego powodu'*. I stalled a beat waiting for the actual reason."
- What I needed instead: collapse the doubled run-up into one sentence and reach the mechanism (the remote env only sees config it can read at startup) faster. The mechanism itself, when it arrives, is exactly the new thing I needed — it's just one sentence late.

### "Co trafia do cache'u?" (lines 87–91) — Momentum drop (minor)
- What I felt: "This is where I started to skim. True and useful, but after setup and network it's the least urgent of the six and the energy dips."
- What I needed instead: nothing structural — it's the natural soft spot in a six-part list. Flagging honestly that this is where attention frays; the surrounding sections re-grab me.

### Tryb 1 (lines 35–51) — worked, calibrated right
- What I felt: "Names SSH/mosh/tmux and the session-survives-disconnect property without explaining what tmux *is* to me — thank you, exactly my level. Happy then arrives with what-it-is (relay wrapping a local agent) and why-now (NAT, different networks, no port forwarding), so I instantly got why I'd reach for it over raw SSH."
- What I needed instead: nothing. This is the calibration I wish the whole lesson held — and mostly it does.

### "Tryb 3" → `/loop` (lines 190, 348) — Capability check (minor, acknowledged)
- What I felt: "It keeps saying `/loop` but won't give me an exact invocation. Briefly curious — but it explicitly tells me to treat `/loop` as a tool-dependent name, not a stable command, and the Deep Dive backs that up. So I accepted it instead of feeling cheated."
- What I needed instead: I'd have liked one throwaway concrete shape of a routine *as it's fired* ("co godzinę: przejrzyj otwarte PR-y"), but the deliberate vagueness is owned on the page and is the right call for a preview-era feature. Not blocking.

## What Worked

- **The opening reframe (line 7):** "Brzmi jak utrata kontroli? Tylko jeśli kontrolę rozumiesz jako ciągłe patrzenie Agentowi na ręce." flipped my instinctive objection and set the thesis in one move; planting "zielony status nie znaczy, że zadanie się udało" on line 11 made the Tryb-3 payoff feel earned, not introduced.
- **The back-pointer discipline (line 188):** "poznałeś delegowanie celu i wzorce w stylu Ralph / `/goal`. Tutaj nie będziemy ich uczyć od nowa" is exactly what I wanted as a learner who did m2-l5 — it respected my time instead of re-deriving.
- **Isolation-as-autonomy with a mechanism (lines 122–134):** the blast-radius ("promień rażenia") explanation is *why* the rule sticks — "Izolacja nie jest tylko hamulcem. Jest warunkiem autonomii." flipped a constraint I'd resent into the reason I can leave the desk. The moment the lesson changed how I think, not just what I know.
- **The YAML runbook + its guard (lines 140–167):** concrete, scoped to a believable task, with `zakaz` / `warunek_stopu` / a review checklist — and the "to nie jest format narzędzia, to checklista myślowa" line stops me from hunting for a runbook spec that doesn't exist.
- **The "nudne" failure modes (line 233):** "Agent przez dwie godziny próbuje pobrać paczkę z hosta zablokowanego przez politykę sieci…" — naming that the real risk is *boring*, not spectacular, reads as lived experience, not generated copy.

## Through-line

When you stop watching the agent work live, control doesn't disappear — you relocate it to three places you set deliberately: pre-start setup/runbook, selective monitoring, and post-run review. Pick the control moment, constrain the environment, delegate a bounded task, come back to review. I could state it in one breath the whole way through, and the closer ("Kontrola nie zniknęła") paid it off.

## Capability Check

In my voice: "I can pick a control mode for an async task (steer-from-phone vs. cloud sandbox vs. scheduled routine), write a runbook that pins scope, network, MCP source, secrets, a stop condition, and review criteria, and hand a bounded task off without sitting on it — because I built the safe lane before I walked away. I also know a green run is not success and what to actually check when it finishes." The one soft edge: I could *set up* a routine conceptually but I'd still open the docs for the exact `/loop` invocation — which the lesson tells me to do anyway.

## Handoff to rc-review

- **Video placeholder vs. schema:** draft contains `[VIDEO PLACEHOLDER: delegate-from-phone]` (line 178) but the schema's `videoPlaceholders` is `[]`. Reconcile — video-scenario is still a required artifact.
- **Course-order dependency:** the lesson leans on m2-l5 concepts (Ralph, `/goal`, worktrees) as already-learned, but m2-l5 is `planned` in the course map while this is `drafted`, and `dependsOn` lists only m5-l4. Confirm the m2-l5 back-references are safe given sequencing.
- **Mode names: prose vs. table:** the three modes are labeled differently in prose (lines 19–23) than in the comparison table's first column (lines 27–31) — consistency check (felt as a small re-mapping stumble).
- **Style-guide table rule:** the comparison table (lines 27–31) is a decision matrix; the style guide flags conceptual-framework tables for prose conversion. Editor/editor-pl judgment call, not a learner-comprehension failure.
- **`/loop` as an `owns` capability:** "Learner can use `/loop` or routines" is taught only at the conceptual level with no concrete invocation — verify that bar is acceptable given research-preview status, or that the outcome is intentionally framed as conceptual.
- **Product-fact freshness (not verified here):** Claude Code on the web sandbox behavior (line 83), Claude Code routines, `/loop` semantics, Codex Cloud "internet off during agent phase / on during setup" asymmetry (line 71), Happy architecture/relay (lines 43–45), and Cloudflare Agents/Workflows scope (lines 332–340) — all research-preview/mid-2026 per grounding notes; re-verify against live docs before publishing.

---

## Addendum — second independent cold read (same draft)

A second reviewer ran the skill independently against the identical draft and **converged with the verdict above** (independent overall **4/5**, holding **Ready**). Same strengths felt (opening reframe, m2-l5 back-pointer discipline, isolation-as-autonomy mechanism, the YAML runbook guard, the "boring" failure modes); same minor stumbles (prose-vs-table mode-name mismatch, doubled MCP intro, cache section as the soft spot, the repeated aphoristic-closer rhythm). The richer review above is retained intact.

One **net-new finding** not flagged above:

### "Telefon" point restated three times (lines 169, 176, 180) — Momentum drop / Miscalibration (over), minor
- What I felt: "I get it — the phone is a control panel, not a full review surface. The draft tells me this at 169 (*szybkie kontrole, nie czytanie całego diffu*), again at 176 (*panel kontroli, nie miniaturowe code review*), and a third time at 180 (*kontrolka, nie symbol 'programuję z plaży'*) right after the video placeholder. By the third I'm skimming — and all three lean on the same *nie X, jest Y* shape, so the tic and the redundancy compound in one spot."
- What I needed instead: keep one crisp statement of the phone's role (169's bullet list earns it) plus the "programuję z plaży" reframe, and cut the 176/180 restatements down to a single closing line. This is the densest cluster of the "section → antithetical one-liner" rhythm the review above flags in general.

This nudges the second reviewer's **knowledge-calibration to 4/5** (vs 5/5 above) and **authenticity to 4/5**, because the over-statement and the antithesis device peak together here — hence the slightly lower holistic 4 rather than 4.5. Neither blocks; both are local cuts for `lesson-editor-pl`.

---

## Reconciliation — third cold read against the revised draft (2026-06-14)

A third independent run of the skill read the **current draft (edited 06:51, i.e. *after* the two reviews above were written at 06:46)** and **converges on the same verdict: Ready, holistic 4/5**, no dimension below 3. The signature strengths held on this read too — the opening control-relocation reframe (lines 7, 11), the m2-l5 back-pointer discipline (line 186), isolation-as-autonomy with the blast-radius mechanism (lines 122–134), the YAML runbook plus its "to checklista myślowa" guard (lines 138–165), and the "boring, not spectacular" failure modes (line 231).

What the 06:51 edit **resolved** (the prior reviews were reading the pre-edit draft):

- **Prose-vs-table mode-name mismatch — FIXED.** The comparison table's first column now reads `Tryb 1: zdalna kontrola lokalnego agenta` / `Tryb 2: sandbox w chmurze` / `Tryb 3: pętle i routines`, matching the bold prose mode names verbatim. The re-mapping stumble logged at lines 29–31 above no longer fires.
- **Doubled MCP intro — FIXED.** Current line 77 reaches the mechanism ("zdalne środowisko widzi tylko tę konfigurację narzędzi, którą potrafi odczytać podczas startu") in the same sentence; the one-sentence-late stall is gone.
- **Phone restated 3× — LARGELY TRIMMED.** Now a quick-checks bullet list (167–174) + "pełna ocena… przy komputerze" (174) + the "programuję z plaży" reframe (178) + the close (180). Reads as one role-statement plus reframe, not a triple.

What **remains open** (unchanged by the edit, still a polish item, not a blocker):

- **Antithesis-couplet rhythm ("Nie X. Jest Y." / "X w opisie, Y w praktyce").** Still ~8 instances across the lesson (lines 11, 37, 41, 51, 73, 128, 178, 233). Each lands alone; cumulatively the formula registers as a faint authenticity tell by mid-lesson. Caps authenticity at 4/5. Local cuts for `lesson-editor-pl`.
- Minor: the un-numbered "Dlaczego ograniczenia…" section sits between Tryb 2 and Tryb 3, briefly interrupting the 1-2-3 scaffold — a small, recoverable flow speed bump; not worth a structural change.

The rc-review handoff items above (video-placeholder vs empty `videoPlaceholders` schema field — note a `videos/video-delegate-from-phone.md` scenario does exist; m2-l5 course-order dependency; style-guide table rule; `/loop` taught at conceptual level; product-fact freshness) all still apply to the current draft. The richer two-part review above is retained intact; this note only records the post-edit delta.

---

## Reconciliation — fourth cold read against the current draft (2026-06-14, 08:29 edit)

A fourth independent run read the **current draft (edited 08:29, after the 06:51 edit the third read covered)** and again **converges: Ready, holistic 4/5**, no dimension below 3. All previously-fixed items stay fixed on this read — the table's first column matches the prose mode names verbatim (lines 27–31 ↔ 19–23), the MCP subsection reaches its mechanism in one sentence (line 83), and the phone role is stated once as a bullet list + the "programuję z plaży" reframe (lines 172–183), not a triple. The signature strengths held: the control-relocation reframe (lines 7, 9), the m2-l5 back-pointer discipline (line 191), isolation-as-autonomy with the blast-radius mechanism (lines 130–134), the YAML runbook + "to checklista myślowa" guard (lines 142–170), and the "boring, not spectacular" failure modes (line 236).

The 08:29 edit reworked **Tryb 1 to lead with first-party Claude Code Remote Control**, reframing Happy as the third-party fallback. That edit is a clear improvement (Remote Control is the right default to teach), but it introduced **one net-new stumble** no prior read could have seen:

### Tryb 1 — "Happy" named before it's introduced (line 47 vs. line 51) — Narrative break (minor)
- What I felt: "Line 47 tells me Remote Control is *'first-party odpowiednik tego, co robi Happy'* — but I haven't met Happy yet. For a beat I'm anchoring a new tool against another tool I don't know. Then line 51 (*'A gdzie w tym wszystkim Happy?'*) finally introduces it. Resolved in four lines, but I was momentarily defining the lead feature by an undefined one."
- What I needed instead: either move the Happy comparison to *after* its line-51 introduction, or gloss it inline at line 47 (one clause: *„…co robi Happy — narzędzie open source, do którego zaraz wracam"*) so the forward reference doesn't leave me hanging. Purely a sequencing nit for `lesson-editor-pl`; not a comprehension gap (the new `owns` concept, Remote Control, is itself introduced cleanly).

One mild momentum note, distinct from the now-fixed mode-name mismatch: the three modes are now presented prose-intro (19–23) → comparison table (27–31) back-to-back before any depth, so I pass over the same three labels twice in quick succession. The table earns its place with the extra comparison columns (control point, fit, risk), so this reads as light redundancy, not a break — I'd leave it.

Open items unchanged: the antithesis-couplet rhythm still registers as the one faint authenticity tell and caps that dimension at 4/5; `/loop` remains taught at the conceptual level (owned on the page, the right call for a preview feature); the un-numbered "Dlaczego ograniczenia…" section still sits mid-scaffold between Tryb 2 and Tryb 3. None block. The rc-review handoff items above all still apply. Richer review above retained intact; this note records only the 08:29-edit delta.

---

## Reconciliation — fifth cold read against the current draft (2026-06-14, 14:48 edit)

A fifth independent run read the **current draft (edited 14:48, after the 08:29 edit the fourth read covered)**. Scores were locked from a blind cold read *before* opening this file, then reconciled. Verdict again **converges: Ready, holistic 4–5**, no dimension below 4. The signature strengths held on this read: the control-relocation reframe (lines 10, 12), the m2-l5 back-pointer discipline (line 194), isolation-as-autonomy with the blast-radius mechanism (lines 135–137), the YAML runbook + "to checklista myślowa" guard (lines 145–173), and the "boring, not spectacular" failure modes (line 239).

What the 14:48 edit **resolved** (the fourth read's net-new finding was reading the 08:29 draft):

- **"Happy named before it's introduced" — FIXED.** The fourth read flagged that Remote Control was introduced (old line 47) as the *"first-party odpowiednik tego, co robi Happy"* before Happy itself appeared. The current draft introduces Remote Control as the *"first-party wersję tej samej idei"* (the SSH idea — line 48) and only reaches Happy at line 54 (*"A gdzie w tym wszystkim Happy?"*). The forward-reference-to-an-undefined-tool stumble no longer fires; on this read Tryb 1 flowed SSH → VPS → Remote Control → Happy cleanly.

What this read adds — **one net-new finding** the prior four reads did not log:

### "runbook" leaned on at line 110 before it's defined at line 145 — Comprehension/sequencing (minor)
- What I felt: "Line 110 tells me to write things *'w runbooku'* — first time the word appears, and the surrounding diagram (line 122) and bullet list treat it as a known artifact, so I picture a *file in the repo*. Then 35 lines later, line 145 corrects me: *'To nie jest format narzędzia ani plik… tylko checklista myślowa.'* Small whiplash — I'd already built the wrong mental model of what a runbook *is* here before the lesson reframed it."
- What I needed instead: gloss "runbook" the first time it's used (line 110) with the same one-clause reframe the lesson already nails at 145 (*"…krótka checklista myślowa, nie plik"*), so the file→checklist correction never has to happen. Purely a sequencing nit for `lesson-editor-pl`; the new `owns` concept (the runbook's *contents*) is taught cleanly — only the term's first appearance runs ahead of its definition.

One mild momentum note, converging with the fourth read and unchanged by the edit: the three modes are presented prose-intro (20–26) → comparison table (30–34) back-to-back, so I pass the same three labels twice before any depth. The table earns its place with the extra columns (control point, fit, risk), so this reads as light redundancy, not a break — I'd leave it.

**Honest divergence on authenticity.** My blind cold read scored authenticity **5/5** — the voice read as a practitioner's and the antithesis-couplet rhythm (*"nie X, tylko Y"*: lines 10, 12, 137, 186, 241, 264) registered only faintly, sub-threshold for me. The four prior reads consistently docked it to **4/5** for that same device. I noticed the pattern but it did not cost the author credibility on my pass. Recording the divergence transparently rather than retro-fitting my score to the prior verdict: treat the rhythm as a confirmed `lesson-editor-pl` polish item, but it is a 5-vs-4 judgment call, not a blocker.

Open items unchanged: `/loop` taught at the conceptual level (owned on the page, right call for a preview feature); the un-numbered "Dlaczego ograniczenia…" section still sits mid-scaffold between Tryb 2 and Tryb 3 (small, recoverable flow speed bump). None block. The rc-review handoff items above all still apply to the current draft — note especially the empty `videoPlaceholders: []` in schema vs. the `[VIDEO PLACEHOLDER: delegate-from-phone]` at draft line 184 (a `videos/video-delegate-from-phone.md` scenario does exist), and the m2-l5 course-order dependency (m2-l5 is `planned`, this is `drafted`, `dependsOn` lists only m5-l4). The richer multi-part review above is retained intact; this note records only the 14:48-edit delta.

---

## Reconciliation — sixth cold read against the current draft (2026-06-14, post-"runbook→checklist" refactor)

A sixth independent run read the **current draft** (the one whose body example uses an inline `/goal` block at lines 147–157 and a "checklista myślowa" framing rather than a YAML runbook — i.e. *after* the fc4bdbbc "demote runbook to lightweight checklist, drop YAML" commit). Scores were locked from a blind cold read *before* opening this file. Verdict again **converges: Ready, holistic 4/5**, no dimension below 4.

All previously-fixed items stayed fixed on this read: the comparison table's first column matches the prose mode names verbatim (`Tryb 1/2/3`, lines 30–34 ↔ 22–26); the MCP subsection reaches its mechanism in one sentence (line 86); the phone role is stated once as a quick-checks bullet list + the "programuję z plaży" reframe (lines 160–171), not a triple; and Tryb 1 now flows SSH → VPS → Remote Control → Happy cleanly, with Remote Control framed as the "prostszą, first-party wersję tej samej idei" (the SSH idea, line 48) so Happy is no longer referenced before it's introduced.

Signature strengths held: the control-relocation reframe (lines 10, 12), the six-question sandbox model with the internet-off-during-work-phase gotcha (lines 78–82), isolation-as-autonomy with the blast-radius mechanism (lines 135–137), the worked payments-test-plan `/goal` example with its inline "zielony przebieg to NIE sukces" review line (lines 143–158), and the "boring, not spectacular" failure modes (line 224).

What this read adds — **one net-new finding** no prior pass logged:

### "deliberate-break check" named as a gate without a gloss (line 236) — Comprehension gap (minor-to-moderate)
- What I felt: "The `/10x-goal-implement` description lists the quality gates it runs: *'kryteria sukcesu z planu, deliberate-break check, pełen zestaw testów'*. I know what success criteria and a full test run are. **`deliberate-break check` I do not** — it's an English term dropped mid-Polish-sentence as if I should recognize it. I can half-guess it's some guardrail against the agent doing something destructive, but I'm guessing. Every other gate in that list I could name; this one I can't, and it's describing the brand-new skill the whole closing section hangs on."
- What I needed instead: one clause saying what it checks (e.g. *„…deliberate-break check, czyli kontrola, czy agent świadomie nie złamał założeń planu…"* — or whatever it actually verifies), so the new skill's value proposition doesn't rest on an unexplained named mechanism. This is the one spot where a genuinely *new* `owns`-adjacent concept (the gates that make `/10x-goal-implement`'s green run trustworthy) is named but not made usable on the page. Local fix for `lesson-draft`/`lesson-editor-pl`; does not block the verdict because the surrounding sentences still convey "gates enforce that green = real," but it's the most concrete comprehension snag left in the lesson.

The "runbook term-before-definition" stumble the fifth read logged no longer applies in the same form: this draft revision uses "checklista" framing inline and the worked `/goal` block *is* the concrete demo, so the file→checklist whiplash is gone. The inline example also directly answers the rc-review's two "Major" findings (missing concrete sandbox/phone demo; the `/goal` block at 147–157 is exactly the operational pass rc-review asked for) — though rc-review's video-scenario-artifact and `/loop`-source items are separate and still apply.

Open items unchanged: the antithesis-couplet rhythm remains the one faint authenticity tell (5-vs-4 judgment call per the fifth read); `/loop` taught at the conceptual level (right call for a preview feature); the un-numbered "Dlaczego ograniczenia…" section still sits mid-scaffold between Tryb 2 and Tryb 3. None block. The richer multi-part review above is retained intact; this note records only the post-refactor delta plus the one net-new `deliberate-break check` finding.
