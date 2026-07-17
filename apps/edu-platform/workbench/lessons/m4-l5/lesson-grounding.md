# Lesson Grounding: m4-l5 — Modernizacja legacy z DDD: wydzielaj domeny, potem deleguj Agentowi

> Language: English (verification brief). Lesson prose stays Polish.
> Posture: **verification pass** — the §5 conceptual-scaffolding attributions were fact-checked
> against primary/authoritative sources. This brief records verdicts, corrections, and the
> strongest sources for the drafter. It is not a fresh literature review.

## Scope

- Lesson source: schema `owns` (4 items) + `notes.md` + `lesson-2ed-draft.md` + `m4-shape.md` §5.
  No `lesson-spec.md`/`lesson-draft.md` yet — grounded the schema contract and the 2ed draft.
- Report element: ⑤ **DDD opportunities** (bounded contexts within the module, ubiquitous
  language, invariants, road to entities/value objects).
- Worked example: brownfield refactor of **asynchronous flashcard generation** in 10xCards
  (the 2ed draft's webhook async migration, re-homed onto a domain the learner knows).
- Neighbor boundaries:
  - **dependsOn m4-l4** *owns* **Strangler Fig, Branch by Abstraction, Mikado Method,
    enterprise archetypes (PoEAA), accidental-vs-essential complexity**, and report element ④
    (refactor opportunities). In L5 these are **reference-only** — do not re-teach them.
  - **preparesFor m5-l1** (team-scale agents/SDK) — L5 closes the architecture report and the
    10xArchitect Badge; it does not open team tooling.
- Relevant prework: AI-as-tutor / AI-as-ally framing and the chatbot→agent→harness model are
  assumed, not re-taught. The "human owns and defends the decision" frame is reused verbatim.
- Research posture: **standard** (canon verification + a small Focus-B migration check).

## Claims To Support

- **Event Storming exists as a named technique with a definite author and origin** — the lesson
  opens on it (Beat 2 of the reference lesson). Needs: primary attribution + correct date.
- **The Event Storming sticky-note grammar and the three levels are stated accurately** — the
  lesson uses a Mermaid "whiteboard"; the vocabulary must be precise, not folk. Needs: primary/
  authoritative source for colors + levels + hotspots/pivotal events.
- **Bounded Contexts & Context Mapping are attributed correctly and the integration-pattern list
  is canonical** — owned concept. Needs: Evans/Vernon primary; the exact pattern set.
- **Core/Supporting/Generic subdomain distillation is canonical and the "invest in the Core"
  guidance is faithful** — owned concept. Needs: Evans/Vernon primary.
- **Aggregates as consistency boundaries; reference-by-identity; one-transaction-per-aggregate** —
  feeds element ⑤ and justifies the async (cross-aggregate → eventual consistency) Beat. Needs:
  Vernon primary.
- **Entities vs Value Objects (identity vs value equality, immutability)** — element ⑤. Needs: Evans.
- **Bounded Context Canvas authorship and contents** — candidate report-capture template. Needs:
  correct attribution + section list.
- **(Beat-2 worked example) "Separate initiation of an action from its execution" / async loose
  coupling has a credible engineering grounding** — needs: outbox/async-job literature, right-sized.

## Strong Sources

### Introducing Event Storming (blog post) — technique origin

- URL: http://ziobrando.blogspot.com/2013/11/introducing-event-storming.html
- Type: technical-post
- Author/publisher: Alberto Brandolini (*Ziobrando's Lair*)
- Checked: 2026-06-03
- Supports:
  - Event Storming as a named technique originates with Brandolini; the seminal post is **Nov 18, 2013**.
  - Precursor "Event-Based modelling workshop" shown at **Italian Agile Day 2012**; renamed
    "EventStorming" in 2013.
- Use in lesson:
  - Attribute the **technique** as *Brandolini, 2013*. Do **not** date it to the (later) book.
- Confidence: high
- Notes:
  - ⚠️ **Correction:** the schema `owns` and notes phrase it as "(A. Brandolini)" without a date —
    fine — but anywhere a year appears, the **technique is 2013**, the **book is later (~2018,
    ongoing)**. Keep them separate.

### Introducing EventStorming (book) — levels + grammar

- URL: https://www.eventstorming.com/book/
- Type: technical-post
- Author/publisher: Alberto Brandolini (Leanpub)
- Checked: 2026-06-03
- Supports:
  - Three levels: **Big Picture → Process → Software/Design**.
  - The book is an **ongoing, unfinished Leanpub work** ("the most successful unfinished book on
    Leanpub"); price tracks completion. No fixed publication year — cite as *Leanpub, ongoing (~2018)*.
- Use in lesson:
  - When naming the levels and the workshop arc, cite the book; when dating the technique, cite 2013.
  - Sticky grammar (cross-checked against Wikipedia/draft.io references): domain events = **orange**
    (past tense), commands = **blue** (present tense), actors = small yellow/person, **policies =
    lilac/purple** ("whenever… then…"), read models = **green**, external systems = **pink**,
    aggregates = **(large) yellow**, **hotspots = red/purple**, **pivotal events = timeline dividers**
    marking context seams.
- Confidence: high
- Notes:
  - Sticky colors have minor real-world variance (esp. aggregates/read-model shades); the past-vs-
    present tense rule and the hotspot/pivotal markers are stable. Keep color claims at the level
    above "exact hex".

### Domain-Driven Design Reference (Evans) — context mapping, subdomains, entities/VOs

- URL: https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf
- Type: official-docs (author's own canonical reference; free)
- Author/publisher: Eric Evans (Domain Language, Inc.)
- Checked: 2026-06-03
- Supports:
  - **Bounded Context / Context Mapping** and the canonical integration-pattern set:
    **Partnership, Shared Kernel, Customer/Supplier, Conformist, Anticorruption Layer,
    Open Host Service, Published Language, Separate Ways, Big Ball of Mud** (+ upstream/downstream).
  - **Subdomain distillation: Core / Supporting / Generic**; "justify investment in everything else
    by how it supports the distilled Core."
  - **Entities vs Value Objects**: identity-based continuity vs value-based equality + immutability.
  - "Linguistic boundaries reveal context boundaries" — faithful to Evans (one model = one
    ubiquitous language within one boundary).
- Use in lesson:
  - Pair with *Domain-Driven Design: Tackling Complexity in the Heart of Software* (Evans, **2003**)
    and *Implementing Domain-Driven Design* (Vernon, **2013**) as the named books.
- Confidence: high
- Notes:
  - ⚠️ **Correction:** the schema `owns` lists 5 integration patterns (ACL, Conformist, OHS,
    Published Language, Shared Kernel) — that is a **curated subset**. The full canon adds
    **Partnership, Customer/Supplier, Separate Ways, Big Ball of Mud**. Either expand or state
    explicitly that the lesson teaches a subset. (Editorial decision — logged in ledger.)

### Effective Aggregate Design (3-part series) — Vernon

- URL: https://www.dddcommunity.org/library/vernon_2011/
- Type: paper
- Author/publisher: Vaughn Vernon (dddcommunity.org)
- Checked: 2026-06-03
- Supports:
  - Aggregates = **consistency boundaries** protecting invariants.
  - **Reference other aggregates by identity** (not object reference).
  - **Modify one aggregate per transaction; eventual consistency between aggregates.**
- Use in lesson:
  - Element ⑤'s "invariants + road to entities/VOs" beat. Directly underwrites the **async Beat**:
    cross-aggregate updates become events + eventual consistency, not one fat transaction — the DDD
    justification for "separate initiation from execution".
- Confidence: high
- Notes:
  - Three parts, **2011**. Part I (single aggregate), II (aggregates working together), III (discovery).

### Bounded Context Canvas — DDD Crew / Nick Tune

- URL: https://github.com/ddd-crew/bounded-context-canvas
- Type: repo
- Author/publisher: Nick Tune & the DDD Crew (with Eric Evans); open source
- Checked: 2026-06-03
- Supports:
  - Capture template for a bounded context: name/description, **ubiquitous language**,
    responsibilities, **inbound/outbound messages** (suppliers/consumers), message types
    (**Command / Domain Event / Query**), dependencies.
- Use in lesson:
  - Optional report-capture template for element ⑤ (how to write the DDD opportunity down).
- Confidence: high
- Notes:
  - ⚠️ **Correction:** attribute as **"Nick Tune & the DDD Crew (with Eric Evans)"**, now maintained
    open-source — not "Tune solo". Templates exist for Miro/draw.io/Excalidraw.

### Transactional Outbox — Chris Richardson

- URL: https://microservices.io/patterns/data/transactional-outbox.html
- Type: technical-post
- Author/publisher: Chris Richardson (microservices.io)
- Checked: 2026-06-03
- Supports:
  - One DB transaction updates business state **and** inserts the event into an **OUTBOX table**;
    a separate relay publishes asynchronously. Solves the dual-write problem without 2PC.
- Use in lesson:
  - **Beat-2 conceptual *why*** for "persist the job, then process out-of-band." Use as the named
    pattern that justifies a **DB-backed job/worker** in 10xCards.
- Confidence: medium-high
- Notes:
  - **Right-sizing caveat (honor notes §6):** this is canonically a *microservices/broker* pattern.
    For 10xCards present it as the *idea* (durable record + out-of-band processing), implemented as a
    DB-backed job — **not** Kafka/RabbitMQ. Do not let the worked example imply a broker is required.

### Strangler Fig + Branch by Abstraction — Martin Fowler  *(neighbor-owned: m4-l4)*

- URL: https://martinfowler.com/bliki/StranglerFigApplication.html
  (origin: https://martinfowler.com/bliki/OriginalStranglerFigApplication.html ·
  https://martinfowler.com/bliki/BranchByAbstraction.html)
- Type: technical-post
- Author/publisher: Martin Fowler
- Checked: 2026-06-03
- Supports:
  - **Strangler Fig** — incremental, reversible migration around a stable facade; original post
    **June 29, 2004** (later renamed "Strangler Application" → "Strangler Fig Application").
  - **Branch by Abstraction** — the in-codebase equivalent (abstraction layer lets old + new
    implementations coexist during migration; also assoc. P. Hammant / J. Humble ~2011).
- Use in lesson:
  - **Reference only.** These migration *strategies* are **owned by m4-l4**. In L5 the async
    refactor may *name* them for continuity, but must not teach them — that is scope theft from L4.
- Confidence: high
- Notes:
  - Kept in this brief for the drafter's awareness and continuity, **not** as an L5-owned concept.

## Practitioner Signals

### "When is event-driven / a broker over-engineering for a small app?"

- URL: https://www.tinybird.co/blog/apache-kafka-alternatives (illustrative only)
- Type: practitioner-signal
- Signal:
  - Recurring practitioner consensus: many teams reach for Kafka/streaming when a lightweight queue
    or a DB-backed job would do; "Kafka alternative" searches often mask a simpler need.
- Useful language:
  - "right-sized", "you probably don't need a broker", "durable record + background worker".
- Risk:
  - **No crisp primary source.** Results were mostly vendor Kafka-vs-RabbitMQ comparisons. Do **not**
    cite a blog as proof. Present the right-sizing judgment as **editorial** — anchored to Fowler/
    Richardson's "simplest thing that works" posture and the notes §6 guardrail.
- Confidence: medium

## Examples Worth Using

- The 2ed draft's arc maps cleanly onto 10xCards: **Event Storming the full flashcard-generation
  cycle** (request → validate → queue → worker → candidates/failure → notify → drafts → finalize)
  → **plan the sync→async migration with AI** → **implement a DB-backed async pipeline**.
- Event Storming "hotspots" (red stickies) are the natural feed into element ⑤'s DDD opportunities:
  e.g. *source text is not persisted (privacy guardrail) → generation is one-shot, no resume*;
  *"preferred count" is a hint not a guarantee*; *per-learner limit as a policy on `GenerationRequested`*.
- "Reference by identity + eventual consistency between aggregates" is the textbook DDD reason the
  generation worker shouldn't update a deck inside the generation transaction — concrete and on-domain.

## Claims To Avoid Or Soften

- **"Introducing EventStorming (2013)" as a book citation** — wrong. Technique = 2013 (blog);
  book = ongoing Leanpub (~2018). Split the citation.
- **Presenting the 5-pattern context-mapping list as "the" set** — it's a subset; the full canon has
  9 (incl. Partnership, Customer/Supplier, Separate Ways, Big Ball of Mud).
- **"Bounded Context Canvas by Nick Tune"** alone — credit Tune **& the DDD Crew (with Evans)**.
- **Any claim that small apps "need" async/queues/event-driven** — soften to "we learn production-
  grade concepts on a small app"; the broker is explicitly out of scope (notes §6).
- **Teaching Strangler Fig / Branch by Abstraction here** — reference only; owned by m4-l4.

## Open Verification Questions

- (Editorial) Expand the schema `owns` context-mapping list to the full canon, or keep the curated
  5-pattern subset and say so in prose? — needs human decision.
- (Boundary) Confirm the async-migration worked example in L5 stays **reference-only** to m4-l4's
  Strangler Fig / Branch by Abstraction (continuity, not re-teaching). — needs human decision.
- (Fact, low-risk) Brandolini book "year" — there is no canonical publication year (ongoing). Confirm
  the lesson is comfortable citing it as "Leanpub, ongoing" rather than a single year.

## Addendum (2026-06-04): tldraw MCP — integration details & current behavior

> Targeted tool-grounding pass for the **Beat 3 whiteboard** decision (`lesson-spec.md`:
> tldraw MCP primary + Mermaid fallback). Posture: **standard** — verify current behavior of the
> "agent draws on a live tldraw canvas" path and produce a concrete **integration instruction**.
> Tool facts are time-sensitive; verify against current docs before the draft ships.

### Claims To Support (this pass)

- **There is an *official* tldraw way for an agent to draw on a live canvas** — the spec leans on it
  for the warsztat. Needs: official tldraw source + correct classification (MCP vs own protocol).
- **A concrete integration instruction exists** — the lesson must tell the learner how to wire it in.
- **Cross-client availability is uneven** — matters for tool-transferability (course spans Cursor /
  Claude Code / Codex / Copilot) and justifies the Mermaid fallback + "teach the pattern" framing.

### The landscape (three real paths — do not conflate them)

There is **no single "tldraw MCP"**. As of 2026-06, three distinct, *officially-relevant* options
exist, plus early-stage community servers. The lesson should name the path it demos and not imply a
monolith.

#### A. Official **tldraw MCP App** — *recommended for the Beat 3 demo*

- URL (announcement): https://tldraw.dev/blog/tldraw-mcp-app
- URL (install): https://cursor.com/marketplace/mcp/tldraw
- Source config: `apps/mcp-app/plugins/tldraw-mcp/mcp.json` in `github.com/tldraw/tldraw`
- Type: official-docs / product announcement · Publisher: **tldraw** · Published **2026-03-03** · Checked 2026-06-04
- What it is: an **MCP *App*** — a newer extension of MCP servers that returns an **interactive UI**
  (here: a live tldraw canvas) instead of plain text. The agent calls tools, the canvas renders in the
  client, and **canvas state is fed back into chat** so the model can "see" what changed.
- Tools exposed: **three** — `create shapes`, `edit shapes`, `delete shapes`. (Deliberately small; the
  agent reads back state rather than having dozens of fine-grained tools.)
- Integration instruction (Cursor, the only GA client today):
  1. Open the **Cursor MCP marketplace** → tldraw entry (**"Verified by Cursor"**, publisher tldraw).
  2. Click **"Add to Cursor"** (one-click; deeplink `/add-plugin tldraw`). No npm/clone/build.
  3. New chat → prompt e.g. *"draw me a state machine"*, *"diagram my current file"* — canvas opens
     in-client and updates live as the agent works.
- ⚠️ **Availability caveat (decisive for the lesson):** GA **only in Cursor** as of 2026-06. Support for
  **VS Code, ChatGPT, and Claude is announced as "planned"**, not shipped. So for a learner on Claude
  Code / Codex / Copilot this exact App may not yet be installable.
- Confidence: **high** (official source + verified marketplace listing). The *"planned" clients* date is
  the part most likely to change — recheck before the draft ships.

#### B. Official tldraw **Agent Starter Kit** — richer, but **not MCP**

- URL: https://tldraw.dev/starter-kits/agent · repo `github.com/tldraw/agent-template`
- Type: official-docs/repo · Publisher: tldraw · Checked 2026-06-04
- What it is: a **scaffolded app** (`npm create tldraw@latest -- --template agent`) where an agent
  manipulates a tldraw canvas via a **chat panel**. Uses tldraw's **own protocol, not MCP**; abstracts
  providers (Anthropic / OpenAI / Google; **Anthropic recommended**). Architecture: `client/` (React +
  agent logic), `worker/` (Cloudflare Worker for model calls), `shared/` (schemas).
- Capabilities (richer than the MCP App): create/update/delete shapes, freehand strokes, multi-shape
  rotate/resize/align/distribute, move viewport, count shapes, **schedule follow-up work**, call APIs.
- Use in lesson: the **conceptual reference** for "agent-moderated canvas" and the fallback if the demo
  should be self-hosted/stack-agnostic rather than Cursor-locked. Running it is a separate web app, not
  a drop-in into the learner's existing agent — heavier than the MCP App.
- Confidence: high.

#### C. Community **tldraw MCP servers** — fallback for non-Cursor / Claude Code

- `github.com/AndresMuelas2004/tldraw-mcp-server` — fullest: **30 tools / 7 categories**, all **14 shape
  types**, outputs standard **`.tldr`** files; Node 18+, MIT. Config (Claude Desktop **and** Claude Code,
  same format):
  ```json
  { "mcpServers": { "tldraw": { "command": "node", "args": ["/abs/path/tldraw-mcp-server/dist/index.js"] } } }
  ```
  Setup: `git clone` → `npm install` → `npm run build`. ⚠️ **Early-stage** (~2 stars, ~2 commits, no
  releases); **no live in-client canvas** — it writes `.tldr`/HTML you open separately. Treat as
  illustrative, not production-blessed.
- Others: `dpunj/tldraw-mcp` (Bun + WebSocket live canvas), `bassimeledath/tldraw-render-mcp` (headless
  PNG/SVG render), `shahidhustles/tldraw-mcp`. All low-maturity.
- Confidence: **medium** (works, but unofficial and volatile — do not pin a lesson's success to one).

### Use in lesson

- **Demo (video):** show **Path A (official MCP App in Cursor)** — it's the cleanest "agent draws on a
  live whiteboard" moment and is official + verified. Narrate it as **one illustration of the pattern**.
- **Pattern (owned concept):** the transferable idea is *agent-as-whiteboard*: agent calls a few
  create/edit/delete tools, the canvas re-renders, and **state flows back into the conversation** so the
  model reasons over the diagram. That pattern survives any specific server.
- **Fallback (text):** **Mermaid** (the 2ed-draft approach) for learners not on Cursor — already the
  spec's stack-agnostic fallback. Optionally mention Path B/C for the curious.
- This directly **vindicates the spec's tool-transferability framing**: teach the pattern, show tldraw
  MCP App as the illustration, keep Mermaid as the portable fallback.

### Claims To Avoid Or Soften (tldraw)

- **"Just install the tldraw MCP server in your agent"** — too loose. As of 2026-06 the official **MCP
  App is Cursor-only (GA)**; Claude/VS Code/ChatGPT are *planned*. State the client explicitly.
- **Treating the Agent Starter Kit as "the tldraw MCP"** — it is **not MCP** (own protocol). Keep A and B
  distinct.
- **Implying community servers are official/stable** — they are early-stage; do not let lesson success
  depend on a 2-star repo.
- **Hard-coding tldraw's 3-tool list as permanent** — tool surface and supported clients are evolving;
  frame counts/clients as "as of mid-2026".

### Open Verification Questions (tldraw)

- **Recheck before draft ships:** have **Claude / VS Code / ChatGPT** clients gained the official tldraw
  MCP App by record date? If yes, the lesson can drop the "Cursor-only" caveat. — needs a doc re-check.
- Does the course's canonical teaching client for this module assume Cursor, or must the demo be
  client-neutral (push harder on Mermaid + Starter Kit)? — **needs human decision** (ties to the
  whiteboard tooling decision already logged in the spec).

## Schema Source Update

Updated **only** the `m4-l5` object in `workbench/lessons-schema.json`:

- Added 7 `groundingSources` (canon pass): Brandolini 2013 blog (technique origin), eventstorming.com book
  (levels + grammar), Evans DDD Reference 2015 (context mapping / subdomains / entities-VOs),
  Vernon "Effective Aggregate Design" 2011 (aggregates/invariants), DDD Crew Bounded Context Canvas,
  microservices.io Transactional Outbox (Beat-2 *why*, right-sized), Fowler Strangler Fig
  (flagged **neighbor-owned: m4-l4**, reference-only).
- Added (this addendum) 2 `groundingSources` for the **Beat 3 whiteboard**: official **tldraw MCP App**
  (blog, 2026-03-03, confidence high) and the **tldraw Agent Starter Kit** (docs/repo, confidence high).
  Community tldraw MCP servers are **kept in this brief only** (low maturity), not added to schema.
- The weak "Kafka-alternative" practitioner signal is **kept in this brief only**, not added to schema.
- `sideEffectLedger.unsupportedFacts`: recorded the "small apps don't need a broker" judgment as
  editorial/practitioner-only (no primary source).
- `sideEffectLedger.needsHumanDecision`: recorded (a) context-mapping subset vs full canon,
  (b) the L4/L5 boundary on migration-strategy patterns, and (c) whether the tldraw MCP App demo stays
  Cursor-specific or must be client-neutral (recheck "planned" clients before draft).
