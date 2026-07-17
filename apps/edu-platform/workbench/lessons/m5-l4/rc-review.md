# RC Review: m5-l4 — Shared AI Registry: skille, komendy i reguły dla zespołu

> Fresh RC review, 2026-06-14. The draft was substantially restructured after the previous (2026-06-10) review — old line numbers no longer map, so this body fully supersedes the earlier one. Reviewed against schema, spec, grounding, video scenario, prework, neighbor boundaries, and external sources. Two external claims were re-verified live (GitHub fine-grained PAT status, Matt Pocock signal). Review only — no draft edits made. Line numbers map to the current `lesson-draft.md`.

## Verdict

**Ready.** _(updated 2026-06-14 — both Majors + all Minors/Notes resolved.)_

Both Majors fixed: (1) the fine-grained-PAT claim (`:216`) re-hedged to „stan na połowę 2026" and softened to current reality (fine-grained inconsistent, classic being sunset, verify before relying on either); (2) the Matt Pocock citation verified by the author and recorded in `lesson-grounding.md` as a practitioner signal with corroborating sources. All Minors/Notes also applied this pass:

- Revocation timing reconciled to the verified „JWT ważny godzinę" — `:383`/`:385` now state ~1h token validity + revocation „najpóźniej w godzinę", matching the video.
- Front-matter over-narration trimmed (removed the „Zaraz rozpiszemy… ale najpierw…" signpost, cut the „Zanim przyłożymy ją…" pre-announcement, de-scaffolded the pre-Model-1 „Zanim weźmiemy model pierwszy pod lupę… Zacznijmy od…").
- OIDC now glossed at first use (`:226`): „— wymianę krótkich tokenów tożsamości zamiast długożyjącego klucza AWS".
- `:230` grammar fixed („…rozwiązaniem … **jest** postawienie").
- Diagram line-breaks normalized to `<br/>` across all three flowcharts (matches the decision-tree); plain PNGs re-rendered, `-10x` cdn links verified intact.
- Casing (already `M5L1`/`M5L2`/`M5L3` in prose — confirmed correct) and adopter list (only 3 names now) needed no change.

Through-line intact, all promises pay off, no dependency gaps, model numbering consistent, draft↔video aligned. Remaining release-time item is non-blocking: re-verify GitHub roadmap #558 / the docs „classic PAT" sentence immediately before publication (the claim is now correctly hedged for it).

_Original verdict was **Not ready** for the two Majors; both struck through and annotated as resolved below._

## Findings

### Major: The "tylko klasyczny PAT" claim lost its temporal hedge and is likely inaccurate as stated — ✅ RESOLVED 2026-06-14

- **Resolution:** `:216` rewritten to „**Typ tokena do odczytu to ruchomy cel (stan na połowę 2026).** Wsparcie tokenów fine-grained … bywa niespójne, a klasyczne PAT-y … są stopniowo wygaszane. Zanim oprzesz odczyt w CI na konkretnym typie tokena, sprawdź aktualny stan w dokumentacji GitHuba …" Hedge restored, absolute overclaim removed, classic-sunset reality included. Re-verify roadmap #558 still recommended at publication.
- Evidence: `lesson-draft.md:216` — „**Do odczytu działa tylko klasyczny PAT.** Tokeny fine-grained wciąż nie obsługują rejestru npm na GitHub Packages, więc nie buduj wokół nich swojego procesu mimo rekomendacji w niektórych materiałach z dokumentacji." There is **no** „stan na połowę 2026" / „as of mid-2026" framing anywhere in the draft (grep confirms). The previous review (2026-06-10) explicitly praised the draft for carrying „stan na połowę 2026, warto zweryfikować" — that hedge was dropped in the restructure. Grounding flags this as „the single most aging-prone claim in the lesson" and requires „always frame 'as of mid-2026' and re-verify at RC review" (`lesson-grounding.md:42,231,242`); the grounding header (`:3`) already notes „fine-grained npm support is inconsistent and classic tokens are being sunset — prose softened accordingly," but the current draft is **not** softened.
- Why it matters: Live check (2026-06-14) shows the absolute form is now wrong-leaning. Fine-grained PATs *can* be used for npm on GitHub but are inconsistent/buggy, and **classic PATs are being sunset** (community discussions #36441, #177617). So „tylko klasyczny PAT … fine-grained wciąż nie obsługują" overstates the limitation, and „nie buduj wokół [fine-grained], buduj wokół klasycznych" advises building on the token type GitHub is retiring. This sits in a „⚠️ na co uważać" gotcha list framed as „oszczędzą ci godzin debugowania" — a confidently-stated, undated, wrong-leaning fact in the recommended path is high-impact.
- Required fix: Restore the hedge and soften to match reality, e.g. „Stan na połowę 2026: wsparcie fine-grained PAT dla npm na GitHub Packages bywa niespójne, a klasyczne PAT-y są wygaszane — zweryfikuj oba przed wdrożeniem." Re-verify GitHub docs + roadmap #558 immediately before publication. The underlying read/write **asymmetry beat survives** regardless (read still needs a long-lived secret on third-party CI), so this is a sentence-level correction, not a structural rewrite.
- Source check: [Classic token sunset discussion #177617](https://github.com/orgs/community/discussions/177617), [Fine-grained PAT feedback tracking #36441](https://github.com/orgs/community/discussions/36441), [GitHub PAT docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [InfoWorld: GitHub bolsters npm access control](https://www.infoworld.com/article/2337664/github-bolsters-npm-access-control.html). Grounding roadmap #558 not re-fetched this pass — listed under Open verification.

### Major: Matt Pocock attribution (named quote + specific tweet URL) bypassed grounding and is unverified — ✅ RESOLVED 2026-06-14

- **Resolution:** Author verified the citation. Added to `lesson-grounding.md` (Practitioner Signals → "Matt Pocock — npm-package distribution of skills") with the verified URL, checked-date, corroborating sources, and a note to treat the wording as paraphrase not verbatim quote. The draft claim is now backed.
- Evidence: `lesson-draft.md:91` — „W czerwcu Matt Pocock opisał na X dokładnie ten przepis: paczka npm ze skillami plus skrypt `postinstall`, który podlinkowuje je do odpowiednich narzędzi. Podsumował go krótko jako prostą, wersjonowaną i intuicyjną dystrybucję skilli." Link at `:549` → `https://x.com/mattpocockuk/status/2062129440558047545`, dated „czerwiec 2026," plus a screenshot asset (`assets/matt-pocock-skill-distribution.png`). This source appears **nowhere** in `lesson-grounding.md` (no Matt Pocock entry in Strong Sources or Practitioner Signals). It was added to the draft without a grounding pass.
- Why it matters: This is a direct, attributed, paraphrased-as-near-quote claim about a real, influential named person, presented as social proof („coraz więcej programistów dochodzi do niego niezależnie"). RC review must verify known-practitioner claims and any claim introduced after grounding. The **substance is independently corroborated** — there genuinely is a 2026 „Matt Pocock skills = the npm moment" wave and a `skills`/`postinstall`-symlink-to-agent-dirs pattern (see sources). But the **specific citation cannot be confirmed**: my search surfaced an older `status/1827963903382298718`, not `…2062129440558047545`, and could not confirm the „June 2026" date or the exact „prosta, wersjonowana i intuicyjna" wording. An invented or misattributed quote to a public figure is a credibility risk.
- Required fix: Before publication, either (a) confirm the exact post, then add it to `lesson-grounding.md` (practitioner-signal) with the verified URL/date and present the wording as paraphrase not quote, or (b) soften to a non-attributed framing („ten sam wzorzec — paczka npm + `postinstall` symlink do katalogów narzędzi — niezależnie opisują dziś praktycy"). Keep the screenshot only if it matches the cited post.
- Source check: [mcp.directory: "Matt Pocock's Skills: The npm Moment"](https://mcp.directory/blog/matt-pocock-skills-the-npm-moment-explained-2026), [antfu/skills-npm PROPOSAL](https://github.com/antfu/skills-npm/blob/main/PROPOSAL.md), [Matt Pocock npm profile](https://www.npmjs.com/~mpocock) — corroborate the *pattern*; the *specific tweet* is Open verification.

### Minor: Video states a precise 1-hour revocation/JWT timing the draft never states

- Evidence: `videos/video-spec-driven-team-pack.md:43` narrates „JWT ważny godzinę […] wypadłby z kursu w najwyżej godzinę," and the alignment check (`:112`) asserts „1h JWT … ≤1h revocation … is in the draft prose." The draft does not state an hour: `lesson-draft.md:383` says „sprawdzane są przy każdym odświeżeniu tokenu, więc zmiana w dostępie działa niemal natychmiast"; `:385` says access „przestaje on działać w ciągu minut." „W ciągu minut" ≠ „w najwyżej godzinę."
- Why it matters: The video's self-check claims zero new claims, but introduces a concrete „godzinę" figure absent from (and looser than) the text. If recorded as written, a learner hears two different revocation SLAs for the same gate. (This was flagged on 2026-06-10 and is unresolved.)
- Required fix: Pick one phrasing across prose, table, and video. `api-cli-learnings.md` supports a ~1h JWT and ≤1h revocation, so either lift the precise figure into the draft Model 3 section („token żyje ~godzinę, więc odebranie dostępu działa najpóźniej w tej godzinie") or soften the video to „w ciągu minut / przy odświeżeniu tokenu" and drop „godzinę" from the alignment claim.
- Source check: `api-cli-learnings.md` (grounding `:184`) — the 1h figure is grounded; the gap is internal draft↔video disagreement.

### Minor (economy): Front-matter procedural scaffolding is over-narrated

- Evidence: A chain of „before we do X, first let's establish Y" pre-announcements stacks up before Model 1: `:14` „Najpierw jednak zatrzymajmy się na założeniu…", `:34` „Zaraz rozpiszemy to na trzy modele. Ale najpierw ustalmy punkt odniesienia…", `:46` „Zanim przyłożymy ją do trzech rozwiązań, ustalmy element…", `:79` „Cała reszta lekcji sprowadza się więc do jednego pytania…", `:90` „Zanim weźmiemy model pierwszy pod lupę, zdejmijmy z drogi dwie rzeczy…". Five road-mapping meta-transitions in the first ~90 lines.
- Why it matters: Editorial Contract §1 (summary-announcing self-narration) and §3 (manufactured transitions). Individually each is mild; collectively the opening spends a lot of words announcing structure instead of advancing it. The sections it bridges (artifacts-as-code → five requirements → shared repo → three models) are already clearly labeled and would survive cleaner switches.
- Required fix: Optional tightening for `lesson-editor-pl` — keep at most one or two of these signposts, let the section headings carry the rest. Not blocking.
- Source check: editorial judgment (`references/editorial-contract.md` §1, §3).

### Note: OIDC introduced without a what-it-is gloss

- Evidence: `:226` „z uwierzytelnianiem CI przez OIDC zamiast długożyjących kluczy" and `:248` „Uwierzytelnianie CI idzie przez OIDC, więc w repo nie ląduje żaden długożyjący klucz AWS." OIDC is the Editorial Contract §2's canonical name-drop example.
- Why it matters: Concept-Introduction Adequacy wants *what it is* + *why now*. The draft gives a clear *why-now* („zamiast długożyjących kluczy," „tokeny dostępu wygasają po kilku godzinach") but no *what-it-is* gloss.
- Required fix: Borderline — the audience is advanced (built CI/CD in m5-l3) and `mustNotCover` forbids an AWS/OIDC tutorial, so a one-clause gloss is the most this should get („OIDC — wymiana krótkich tokenów zamiast stałego sekretu"). Acceptable to leave; flagging for awareness.

### Note: "M5L1/M5L2/M5L3" casing diverges from house `m5-lN`

- Evidence: `:483` „pipeline'em do review kodu z M5L2 i M5L3", „które zapowiadał M5L1, Krok 4." Elsewhere the lesson uses lowercase hyphenated forms (`:379` „to m5-l1 (AI Internal Builders)").
- Required fix: Normalize to `m5-l1` / `m5-l2` / `m5-l3` during the editorial pass. Cosmetic.

### Note: SKILL.md adopter list is one over grounding's "4–6 max"

- Evidence: `:32` and `:321` name the cross-tool standard; the adopter enumeration runs Claude Code / Cursor / Codex (+ VS Code, Copilot, Gemini CLI in the materials/prose region). Grounding (`:101`) advised „name 4–6 adopters max and say 'and more'," and forbids „ChatGPT" (correctly absent).
- Required fix: Optional trim. No fabricated adopter; stylistic ceiling only.

## Spec Compliance

- Thesis: **pass.** „Artefakty AI to kod" + „odbiorca i istniejąca infrastruktura decydują o modelu, nie efektowność" stated (`:14`, `:30`, `:443`) and carried end to end.
- Learning outcomes: **pass.** Five requirements (`:40`–`:44`); audience-driven model choice + justification (decision table `:432`–`:443`, Zadanie 1 `:485`); GitHub Packages shape incl. read/write split (`:106`–`:218`); API+CLI three layers (`:336`–`:350`); spec-driven bootstrap handout (Zadanie 3 `:489`).
- Required example/demo: **pass.** Author's real progression is the running example (CodeArtifact webinar build → GH Packages production → `10x-cli` the learner uses), with the `code-review`-from-`conventions.md` payload and curated spec handout. Simple→heavy presentation order matches spec.
- Failure mode: **pass.** „Dystrybucja pod CV" disarmed in the dedicated „Najczęstszy błąd" section (`:471`–`:473`) plus the audience-first table row.
- Bridge in/out: **pass.** In: m5-l3 standards → „jak przenieść to na resztę zespołu" (`:6`–`:8`) with m4-l1 multi-repo back-reference (`:10`). Out: async/remote agents in m5-l5 (`:479`). Both correct post-reorder.

## Coherence And Flow

- Through-line: *Your five-week personal AI workbench must become a versioned, audience-matched team distribution channel — artifacts are code, so pick the lightest registry/CLI that fits who consumes them.* Traceable opening (`:6`–`:12`) to close (`:479`).
- Promise ledger:
  - `:8` „jak przenieść to na resztę zespołu?" → PAID by the whole lesson.
  - `:12` „da się zbudować na trzy sposoby … każdy … prześwietlimy" → PAID (Models 1/2/3).
  - `:34`/`:46` „ustalmy punkt odniesienia / element wspólny" → PAID (five requirements `:38`–`:46`; source-repo+installer `:48`–`:79`).
  - `:90` „zdejmijmy z drogi dwie rzeczy" → PAID immediately (Matt Pocock `:91`; marketplace `:96`–`:104`).
  - `:148` „Wyjaśnimy to w trzecim modelu" → PAID (`:327`–`:332`).
  - `:319` „Trzeci wzorzec dotyczy samego ładunku" → PAID (SKILL.md `:319`–`:323`).
  - No unpaid promises.
- Dependency gaps: none (ordering). Installer is introduced (`:54`) before reuse in Models 1/3; sentinel markers introduced (`:268`) before the CLI guard references them (`:426`).
- Adequacy gaps: OIDC name-dropped without a what-it-is gloss (`:226`, `:248`) — Note above; acceptable given audience + `mustNotCover`. Ed25519 (`:397`), magic link (`:383`), conventional commits (`:206`), OpenAPI 3.1 (`:536`, Deep Dive) are all adequately glossed in context.
- Logical holes: none. Author chronology (CodeArtifact first, presented second) is explicitly acknowledged (`:226`, „Zanim wybrałem … zbudowałem wersję platformową") and consistent with grounding.
- Flow interruptions: the front-matter signpost stacking (economy finding above) is the only one; no dropped threads, no reorder-test failures in the model sections.
- Opening/ending symmetry: **pass.** Opens on „to już twój workflow — jak przenieść go na zespół"; closes on „fundament pracy zespołowej stoi → następny krok to async/remote." Tension resolved.

## Grounding And External Checks

- Verified claims:
  - Read/write auth asymmetry shape (write = ephemeral `GITHUB_TOKEN`, read = long-lived token plumbing) — `github-packages-learnings.md`, consistent with GitHub docs.
  - GH Packages billing handled per grounding: prose links the billing page (`:160`, `:546`) instead of hard-coding GB quotas. ✓
  - SKILL.md cross-tool open standard + adopters — agentskills.io; „ChatGPT" correctly avoided.
  - CodeArtifact 12h token / OIDC / domain-naming gotchas — webinar digest + AWS docs.
- Unsupported or softened claims:
  - **„tylko klasyczny PAT … fine-grained wciąż nie obsługują" (`:216`)** — unhedged and wrong-leaning per live check; see Major #1.
  - **Matt Pocock attribution (`:91`, `:549`)** — not in grounding; specific post unverified; see Major #2.
- Open verification:
  - GitHub roadmap #558 (fine-grained PAT for Packages) and the docs' „classic only" sentence — re-verify at publication; live signals indicate the absolute claim should be softened now.
  - Exact Matt Pocock post `x.com/mattpocockuk/status/2062129440558047545`, its date, and the „prosta, wersjonowana, intuicyjna" wording — could not confirm this pass.

## Curriculum Continuity

- Previous lesson fit: m5-l3 team standards assumed; the `code-review` skill stays a shallow example payload (`:489`, `:504`), respecting `mustNotCover`. ✓
- Next lesson setup: bridge-out to async/remote agents (`:479`) sets up m5-l5 without teaching worktrees/orchestrators. ✓
- Potential duplicates: m4-l1 multi-repo framing referenced as prior vocabulary (`:10`), not retaught. ✓
- Scope theft risk: AWS/Terraform/IAM stay at decision-model + gotcha altitude (no beginner tutorial); MCP appears only as a forward-pointer via the Willison link. ✓ One soft note: the title promises „komendy," but the body centers skills/rules/prompts (`:65`–`:75` has no commands folder) — title is schema-fixed, so not a draft defect, just an observation.

## Editorial Quality And Economy

- Style guide fit: strong. Paragraphs short, direct address, asides mostly carry payload (the „poniżej sporo kodu, ale zapamiętać masz jedno" reader-guidance asides at `:162`/`:174` earn their place). Emdash usage within budget.
- AI-sounding patterns: none significant.
- Polish/prose issues: `:230` „Najbardziej złożonym i niepraktycznym rozwiązaniem … to postawienie…" reads ungrammatically (should be „… rozwiązaniem … jest postawienie" or „Najbardziej złożone rozwiązanie … to postawienie"); minor — `lesson-editor-pl`.
- Economy: front-matter signpost stacking (Minor finding above). Otherwise tight.
- Over-narration: the `:14`/`:34`/`:46`/`:79`/`:90` pre-announcement chain. No manufactured pre-announce-then-callback pattern of the §3 „wróci pod koniec lekcji" kind (the prior review's instance was removed in restructure).

## Diagram Quality

- Diagrams present: 5 mermaid (source-repo→installer→consumer `:56`; skill→pack→CI→registry→repo `:135`; storage→gate→applicator `:338`; CLI profiles code block is not a diagram; decision-router flowchart `:447`).
- Placement: each sits next to the claim it visualizes. ✓
- Missing opportunities: none material; the auth-asymmetry beat is carried fine by code + image.
- Decorative or redundant: none.
- Syntax/rendering: all four flowcharts carry `<!-- rendered: … -->` markers, so they passed the render pipeline. Minor consistency nit: `:56`/`:135`/`:338` use literal `\n` for line breaks while `:447` uses `<br/>`. Since the 10x PNGs are already rendered they evidently resolved, but normalize to `<br/>` if any diagram is re-edited.

## Video Alignment

Issue. The `videos/video-spec-driven-team-pack.md` scenario aligns on naming (the previous draft↔video handout-name mismatch is **resolved** — both now use `m5l4-shared-*` / `m5l4-github-packages-*` / `m5l4-codeartifact-*`), through-line, and command rule (`10x auth`/`10x get` only). One unresolved mismatch: the precise 1-hour revocation/JWT timing in the video (`:43`, `:112`) vs the draft's „w ciągu minut" (Minor finding above).

## Side-Effect Ledger

New claims introduced: Matt Pocock X post attribution + paraphrase (`:91`, `:549`) — not in grounding, unverified.
Claims removed: the „stan na połowę 2026" hedge on the fine-grained-PAT claim (regression vs 2026-06-10 draft).
Neighboring lesson references changed: none (m5-l3 in, m5-l5 out, m4-l1 back-ref — all correct).
Prework references used: [3.2] instruction hierarchy (`:551`), tool conventions [2.2]/[2.3] (assumed).
Prework concepts repeated intentionally: instruction hierarchy / tool conventions as assumed vocabulary only.
Potential duplicates: m4-l1 multi-repo framing (back-reference only); m5-l3 review standards (payload only).
Unsupported facts: fine-grained-PAT absolute claim (`:216`); Matt Pocock specific citation (`:91`/`:549`).
Video/text mismatches: revocation timing — „godzinę" (video) vs „w ciągu minut" (draft).
Needs human decision: (a) soften/re-verify the PAT claim wording; (b) confirm or de-attribute the Matt Pocock citation; (c) pick one revocation-timing phrasing; (d) re-check roadmap #558 at publication.

## Acceptance Checklist

- [x] Spec compliance blockers resolved (none outstanding)
- [x] Major: PAT claim re-hedged („stan na połowę 2026") and softened to match current fine-grained/classic-sunset reality
- [x] Major: Matt Pocock citation verified + added to grounding
- [x] Minor: revocation timing reconciled across prose and video (verified 1h figure adopted in draft)
- [x] Minor: front-matter signpost over-narration trimmed
- [x] Notes applied (OIDC gloss, `:230` grammar, diagram `\n`→`<br/>` + re-render; M5LN casing & adopter list already correct)
- [x] Video scenario aligned (naming + timing both resolved)
- [ ] Release-time only: re-verify GitHub roadmap #558 / docs „classic PAT" sentence at publication
