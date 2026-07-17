# RC Review: m1-l1 / p1-lesson-intro — Cel lekcji: kontrakt zamiast kodu

## Verdict

**Ready with minor fixes**

No blockers. One Major finding (missing prework bridge from spec). Three Minor findings (diagram reference path, missing connection to p1-welcome handoff, tone instruction precision). The prompter text is tight, faithful to the lesson draft thesis, and does not introduce unsupported claims. It is a condensed, production-ready brief that correctly maps to videoPlaceholder #2 from the schema.

## Findings

### Major: Spec requires a prework bridge sentence — prompter text skips it

- Evidence: The lesson spec (Bridge In) and the earlier `video-lesson-intro.md` (Segment 1, step 3) both include a prework bridge: "W preworku mowilismy, ze prompt to kontrakt. Teraz rozszerzamy te idee na cala sesje." The p1-lesson-intro prompter text includes this line, which is good. However, the spec's Bridge In also references operationalizing prework [4.2] criteria and [1.2] Agent mental model. The earlier `video-lesson-intro.md` explicitly states in its assumptions: "Wideo nie powtarza definicji Agenta ani harnessu z preworku — odwołuje się do nich jednym zdaniem." The p1-lesson-intro prompter text has zero reference to prework [4.2] criteria (the criteria the Agent will enforce) or [1.2] (Agent as the thing doing the questioning). Only [3.2] (prompt-as-contract) is referenced.
- Why it matters: The spec says this lesson "natychmiast operacjonalizuje wszystkie trzy" prework concepts. The welcome video (p1-welcome) mentions all four prework modules, but the lesson-intro video is supposed to name what this lesson specifically activates. Missing [4.2] is notable because the entire /10x-shape session operationalizes those criteria.
- Required fix: Add one sentence connecting the prework project criteria to the shape session. For example, after the prework bridge line, something like: "Kryteria dobrego projektu, ktore poznales w preworku? Za chwile Agent zacznie je egzekwowac." This keeps the bridge organic without repeating definitions. One sentence is enough — the welcome video already covered the four modules.
- Source check: lesson-spec.md Bridge In, schema `referencesOnly`, video-lesson-intro.md Segment 1 step 3.

### Minor: Diagram PNG path references a different render than what video-lesson-intro.md uses

- Evidence: The p1-lesson-intro setup checklist references `assets/diagrams/lessons-m1-l1-videos-video-lesson-intro-1-10x.png`. The earlier `video-lesson-intro.md` rendered its diagram to the same path (`lessons-m1-l1-videos-video-lesson-intro-1-10x.png`). The PNG exists on disk. However, the p1-lesson-intro prompter text describes the diagram as: `Metna idea -> /10x-shape -> shape-notes.md -> /10x-prd -> prd.md -> Kolejne skille`. This matches the content of the existing render, so the reference is correct.
- Why it matters: The setup checklist says "Sprawdzic czytelnosc diagramu na pelnym ekranie" — this is the right instruction but the path should be confirmed as pointing to the correct file if the diagram was re-rendered after changes to the earlier scenario.
- Required fix: Verify that the PNG at `assets/diagrams/lessons-m1-l1-videos-video-lesson-intro-1-10x.png` matches the diagram described in the prompter. If the lesson-draft diagram (which uses emoji in node labels) differs from the video-lesson-intro diagram (which does not use emoji), confirm which version is intended for this recording. The existing render from video-lesson-intro.md uses no emoji — consistent with what a clean presentation slide should look like.
- Source check: file system check confirms PNG exists.

### Minor: No explicit handoff instruction from p1-welcome

- Evidence: The p1-welcome brief ends with "Od razu przejdz do video-lesson-intro — ten sam setup, nie ruszaj nic." This references the earlier scenario file name (`video-lesson-intro`), not the new `p1-lesson-intro`. The p1-lesson-intro brief says "Kolejnosc nagrania: 2 z 5" which is consistent with p1-welcome being #1, but does not include a reciprocal note like "Poprzednie nagranie: p1-welcome — kontynuuj bez przerwy."
- Why it matters: Production continuity. If someone reads p1-lesson-intro in isolation, they don't know it follows immediately after p1-welcome with the same setup. The p1-welcome file references the old filename.
- Required fix: Either (a) update p1-welcome.md to reference `p1-lesson-intro` instead of `video-lesson-intro`, or (b) add a line at the top of p1-lesson-intro.md noting "Kontynuacja z p1-welcome — ten sam setup." Both small fixes. Updating p1-welcome is outside the scope of this specific video review but should be tracked.
- Source check: p1-welcome.md line 68.

### Minor: Tone instruction "lekko prowokujacy" could use a guardrail

- Evidence: Setup checklist says `Ton: pewny, rzeczowy, lekko prowokujacy ("Wiem, co myslisz..."), bez hype`. The style guide says "Humor should be brief (3-8 words) and self-aware, not slapstick." The prompter text handles this well — the "Wiem, co myslisz. Kolejny dokument przed kodowaniem." line is exactly the right register. No issue with the text itself.
- Why it matters: The tone instruction is fine as written. This is an observation, not a fix — the prompter text already demonstrates the correct register.
- Required fix: None. Note for awareness: the tone is well-calibrated.
- Source check: style.md Conversational Tone rules.

## Spec Compliance

- **Thesis**: Pass — the prompter text delivers the core thesis: first move is a conversation, not code. PRD is the deliverable, but the mindset shift is the point.
- **Learning outcomes**: Pass (partial coverage expected) — a 2-3 min intro video is not expected to cover all 6 learning outcomes. It correctly previews the shape→prd chain and names the deliverable. Detailed mechanics are deferred to p1-shape-session and the lesson text.
- **Behavioral change**: Pass — the prompter text frames the behavioral shift ("To NIE jest generowanie dokumentu z mglistego promptu. To zapisanie decyzji, ktore wlasnie podjales w rozmowie.").
- **Required example/demo**: Not applicable — this is a presentation segment, not a demo. The habit tracker example is referenced ("Uruchomie /10x-shape na pomysle habit trackera") as a forward reference to the next video.
- **Failure mode**: Partial — "Kolejny dokument przed kodowaniem" directly addresses the "PRD is a waste of time" objection. Hollow PRD and brownfield failure modes are correctly deferred to text and other videos.
- **Bridge in/out**: Major finding — [3.2] bridge present, [4.2] and [1.2] bridges missing. Bridge out to the next video is present ("Za chwile zobaczysz to na zywo").

## Grounding And External Checks

- **Verified claims:**
  - Two-skill split (/10x-shape as facilitator, /10x-prd as generator) — correctly represented in prompter: "/10x-shape prowadzi sesje. Pyta, drazy, lapie luki." and "/10x-prd bierze te notatki i zamienia w PRD o stalej strukturze."
  - shape-notes.md as output of /10x-shape — correct per SKILL.md.
  - "/10x-prd bierze te notatki i zamienia w PRD o stalej strukturze. Wiernie, bez domyslania sie. Czego brakuje — trafi do Open Questions." — matches /10x-prd SKILL.md behavior (gaps go to ## Open Questions verbatim).
  - "To NIE jest generowanie dokumentu z mglistego promptu" — correct framing supported by the two-skill split design rationale.

- **Unsupported or softened claims:**
  - (none) — the prompter text makes no factual claims beyond what is grounded.

- **Open verification:**
  - (none) — no external/current-behavior claims in this presentation segment.

## Curriculum Continuity

- **Previous lesson fit**: First lesson, first module. The video correctly positions itself as the course's opening move after prework.
- **Next lesson setup**: Not relevant for this video — it bridges to the next video (p1-shape-session), not to m1-l2.
- **Potential duplicates**: The prompter text overlaps significantly with the lesson draft Wstep, which is intentional — the video is the spoken version of the opening argument. The earlier `video-lesson-intro.md` has more detailed segment structure; this p1 brief is a condensed prompter version. No content duplication with other lessons.
- **Scope theft risk**: None. The video does not touch toolkit mechanics, stack selection, or bootstrap — all correctly deferred.

## Editorial Quality

- **Style guide fit**: Good. The prompter text uses direct address ("Masz pomysl", "otwierasz edytor"), short punchy sentences, casual tone. The closing "Zaczynamy." matches the style guide's 3-5 word punchy sentence ending.
- **AI-sounding patterns**: None detected. The text reads like natural spoken Polish for a screencast.
- **Polish/prose issues**: The text is written in ASCII-only Polish (no diacritics) — this is intentional for prompter readability. Correct approach for a teleprompter brief.

## Diagram Quality

- **Diagrams present**: 1 (referenced as pre-rendered PNG, not inline mermaid)
- **Placement**: Correct — the diagram is shown during the explanation of the two-skill chain.
- **Missing opportunities**: None for a 2-3 min intro video.
- **Decorative or redundant**: No — the pipeline diagram is the core visual of this segment.
- **Syntax/rendering**: The PNG exists at `assets/diagrams/lessons-m1-l1-videos-video-lesson-intro-1-10x.png`. The earlier video-lesson-intro.md contains the mermaid source. No emoji in this version of the diagram (unlike the lesson draft version), which is appropriate for a presentation slide.

## Video Alignment

- **Mapping to videoPlaceholders**: This video maps to videoPlaceholder #2 in the schema: "Wprowadzenie prowadzącego do celu lekcji — efektem pracy jest PRD, ale sednem jest zmiana nastawienia." The mapping is correct.
- **Consistency with lesson draft**: The prompter text is a condensed spoken version of the lesson draft Wstep + first Core section thesis. No contradictions.
- **Consistency with video-lesson-intro.md**: The p1-lesson-intro is a production-ready condensation of the more detailed video-lesson-intro.md scenario. All three segments from video-lesson-intro.md (pułapka → diagram → hook) are present in the prompter text in the same order.
- **Consistency with p1-welcome**: The p1-welcome ends with "Pierwszym ruchem w tym kursie nie bedzie implementacja. Bedzie rozmowa." The p1-lesson-intro opens with "Masz pomysl na aplikacje" which is a clean continuation — the welcome sets up "conversation first", the intro names the problem that conversation solves.
- **Consistency with p1-shape-session**: The p1-lesson-intro closes with "Uruchomie /10x-shape na pomysle habit trackera i pokaze, jak Agent wymusza precyzje — i co wychodzi z sesji." The p1-shape-session opens with setup in a habit-tracker directory and launching /10x-shape. Clean handoff.
- **Video/text mismatches**: None. The prompter text introduces no claims that are absent from the lesson draft.
- **Claims introduced only in video**: None.

## Side-Effect Ledger

```
New claims introduced:
(none)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
- [3.2] prompt-as-contract bridge ("W preworku mowilismy, ze prompt to kontrakt")
- [4.2] and [1.2] are NOT referenced (see Major finding)

Prework concepts repeated intentionally:
- "prompt to kontrakt" — used as a bridge, not as repetition

Potential duplicates:
- Prompter text overlaps with lesson draft Wstep — intentional (spoken version of written opening)

Unsupported facts:
(none)

Video/text mismatches:
(none)

Needs human decision:
- Whether to add a [4.2] bridge sentence to the prompter text (see Major finding)
- Whether to update p1-welcome.md to reference p1-lesson-intro instead of video-lesson-intro (see Minor finding)
```

## Acceptance Checklist

- [x] Spec compliance blockers resolved — no blockers
- [x] Unsupported factual claims resolved or removed — no unsupported claims
- [x] Neighboring lesson drift resolved — no drift
- [x] Editorial polish accepted — prompter text is tight and natural
- [x] Video scenario aligned with lesson draft — no mismatches
- [ ] Prework bridge completeness — [4.2] reference missing (Major finding)
- [ ] Cross-file reference consistency — p1-welcome references old filename (Minor finding)
