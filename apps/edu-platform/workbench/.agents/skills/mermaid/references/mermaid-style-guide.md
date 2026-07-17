# Mermaid Diagram Style Guide

Style rules for mermaid diagrams in 10xDevs 3.0 lesson content. Derived from 22 diagrams across prework and main-course drafts.

## 1. Diagram Type

Use `flowchart`, not `graph`. Reserve `sequenceDiagram` only for multi-actor message-passing (e.g., user → harness → model → tool loops).

```mermaid
flowchart LR   ← correct
graph LR       ← avoid
```
<!-- rendered: assets/diagrams/mermaid-style-guide-1.png | cdn: https://images.przeprogramowani.pl/diagrams/mermaid-style-guide-1.png -->

## 2. Direction Follows Purpose

| Direction | Use for | Examples |
|-----------|---------|----------|
| `LR` | Linear pipelines, file flows, step sequences, before/after | prd.md → tech-stack.md → scaffolded repo |
| `TD` | Decision trees, hierarchies, layered architectures, branching | permission evaluation, defense-in-depth, failure recovery |

Do not mix directions within a single diagram.

## 3. Dark-Mode Color Palette

All styled diagrams use the same Tailwind-based dark palette:

### Node fills

| Hex | Role | When to use |
|-----|------|-------------|
| `#1e293b` | Primary (slate-800) | Default node background |
| `#0f172a` | Container (slate-900) | Subgraph backgrounds |
| `#451a2b` | Negative (dark red) | Blocked, failed, denied states |
| `#1a2e1a` | Positive (dark green) | Success, passed, allowed states |

### Stroke colors (semantic borders)

| Hex | Meaning | Mnemonic |
|-----|---------|----------|
| `#3b82f6` | Blue — neutral, info, in-progress | Default for most nodes |
| `#10b981` | Green — success, pass, positive outcome | Post-execution, healthy state |
| `#f59e0b` | Amber — warning, pre-check, caution | Pre-execution gates, warnings |
| `#ef4444` | Red — blocked, failed, danger | Hard-stop, denied, critical |
| `#8b5cf6` | Purple — convergence, next step, special | Bridge to next lesson, convergence point |
| `#64748b` | Gray — neutral/default | Low-emphasis nodes |

### Text colors

| Hex | Role |
|-----|------|
| `#e2e8f0` | Primary light text (slate-200) — default |
| `#94a3b8` | Muted text (slate-400) — subgraph labels, secondary |
| `#fca5a5` | Red accent text — on negative-fill nodes |
| `#fde68a` | Amber accent text — on warning-fill nodes |
| `#a7f3d0` | Green accent text — on positive-fill nodes |

### Example styled node

```
style NODE fill:#1e293b,stroke:#3b82f6,color:#e2e8f0
style BLOCKED fill:#451a2b,stroke:#ef4444,color:#fca5a5
style SUCCESS fill:#1a2e1a,stroke:#10b981,color:#a7f3d0
```

## 4. Style All or Nothing

Either a diagram is fully unstyled (no `style` directives) or fully styled (every node and subgraph has `fill`, `stroke`, `color`). Do not style only some nodes.

**When to style:** Diagrams that carry semantic weight — decision trees, architecture layers, status flows, anything where color adds meaning (pass/fail, allow/deny, greenfield/brownfield).

**When to leave bare:** Simple linear pipelines, quick sketches, diagrams where the structure alone is the message.

## 5. Node Shapes

| Shape | Syntax | Use for |
|-------|--------|---------|
| Rectangle | `["text"]` | Default for all nodes |
| Diamond | `{"text"}` | Decision/branching nodes only |

Do not use stadium `(["text"])`, round `("text")`, hexagonal `{{"text"}}`, or other shapes.

## 6. Label Language

- **Polish** with full diacritics (`ą`, `ć`, `ę`, `ł`, `ń`, `ó`, `ś`, `ź`, `ż`) for all descriptive labels.
- **English** for file names (`prd.md`), skill names (`/10x-shape`), commands (`npm audit`), and technical identifiers.
- Never use ASCII-stripped Polish (`Slabsze` instead of `Słabsze`).

## 7. Multi-Line Labels

**Unstyled diagrams:** use `\n` for line breaks.

```mermaid
A["Metadane\n~100 tokenów / skill\nZawsze w kontekście"]
```
<!-- rendered: assets/diagrams/mermaid-style-guide-2.png | cdn: https://images.przeprogramowani.pl/diagrams/mermaid-style-guide-2.png -->

**Styled diagrams:** use `<br/>` for line breaks and `<small>` for secondary text.

```mermaid
A["🔍 Pre-execution<br/><small>Czy mam mandat?</small>"]
```
<!-- rendered: assets/diagrams/mermaid-style-guide-3.png | cdn: https://images.przeprogramowani.pl/diagrams/mermaid-style-guide-3.png -->

## 8. Emoji

- Use emoji **only in styled diagrams** — never in bare/unstyled ones.
- One emoji per node, at the **start** of the label text.
- Emoji provide semantic anchoring, not decoration:

| Emoji | Meaning |
|-------|---------|
| 🔍 | Pre-check, inspection, analysis |
| ⚙️ | In-progress, execution, processing |
| 📋 | Post-check, report, assessment |
| 🛡️ | Security, protection, policy |
| 🚫 | Blocked, denied, absent |
| 📂 | File system, repository, git |
| 📝 | Configuration, rules, instruction file |
| 🤖 | Agent, AI, model |
| ⛔ | Hard stop, critical failure |
| ✅ | Pass, success, allowed |
| ❓ | Question, prompt, decision |
| 🔒 | Preserved, locked, protected |
| 🔀 | Merge, combine |
| 📄 | File, document, artifact |

## 9. Edge Labels

- Optional — use only when the transition condition is not obvious from the nodes.
- Keep to 1-4 words.
- Use quoted syntax: `-->|"label"|`.
- Do not label every edge in a diagram.

```mermaid
A -->|"pasuje"| B
A -->|"nie pasuje"| C
```
<!-- rendered: assets/diagrams/mermaid-style-guide-4.png | cdn: https://images.przeprogramowani.pl/diagrams/mermaid-style-guide-4.png -->

## 10. Subgraphs

Use subgraphs to group **parallel alternatives** (greenfield vs brownfield, tool categories), not sequential steps.

Conventions:
- Subgraph ID: ALLCAPS English identifier (`GREENFIELD`, `BROWNFIELD`, `BUILTIN`).
- Display label: Polish descriptive text in brackets.
- Style subgraph backgrounds with `fill:#0f172a` (darker container).

```mermaid
subgraph GREENFIELD["Ścieżka greenfield"]
    G1["tech-stack.md"] -->|"/10x-bootstrapper"| G2["scaffolded repo"]
end
```
<!-- rendered: assets/diagrams/mermaid-style-guide-5.png | cdn: https://images.przeprogramowani.pl/diagrams/mermaid-style-guide-5.png -->

## 11. Diagram Size

Target **3-8 nodes** per diagram. If you need more than 10, split into two diagrams or use subgraphs. The largest effective diagrams in this corpus have 7-8 meaningful nodes.

## 12. Lesson References in Diagrams

When a diagram references another lesson (forward link, convergence point, origin annotation), use the format `M1L4` — not `m1-l4`. The internal hyphenated ID is for file paths and schema keys, not for learner-facing content.

### Format rules

| Context | Format | Example |
|---------|--------|---------|
| `<small>` annotation under artifact name | ID only | `<small>M1L1</small>` |
| Convergence node or standalone reference | ID + short title | `M1L4: Agent Onboarding` |
| Subgraph or edge label | ID + short title | `MCP <small>(M1L5: Sprint Zero)</small>` |

### Short-title lookup

| ID | Short title |
|---|---|
| M1L1 | PRD z Agentem |
| M1L2 | Stack i skille |
| M1L3 | Bootstrap |
| M1L4 | Agent Onboarding |
| M1L5 | Sprint Zero |
| M2L1 | Plan MVP |
| M2L2 | Architektura |
| M2L3 | Implementacja |
| M2L4 | Code Review |
| M2L5 | Wielowątkowość |
| M3L1 | Plan testów |
| M3L2 | Testy jednostkowe |
| M3L3 | Hooki i triggery |
| M3L4 | Testy E2E |
| M3L5 | Debugowanie |
| M4L1 | Skalowanie kontekstu |
| M4L2 | Mapa codebase |
| M4L3 | Analiza feature |
| M4L4 | Refaktoryzacja |
| M4L5 | Legacy z DDD |
| M5L1 | Agent zespołowy |
| M5L2 | Code Review w CI |
| M5L3 | Shared AI Registry |
| M5L4 | Internal Builders |
| M5L5 | Async Agents |

### Examples

Artifact origin annotation:
```
A["prd.md<br/><small>M1L1</small>"]
```

Convergence node:
```
CONV["M1L4: Agent Onboarding<br/><small>obie ścieżki zbiegają się</small>"]
```

Forward reference in subgraph:
```
subgraph MCP["MCP <small>(M1L5: Sprint Zero)</small>"]
```

## 13. No Captions, Inline Prose

Diagrams are embedded inline in lesson prose. Precede each diagram with a sentence that sets up what follows. Do not use `accTitle`, `accDescr`, or markdown figure captions — the surrounding text provides context.

---

## Quick Reference: Styled Diagram Template

```
flowchart TD
    A["🔍 Pre-execution<br/><small>Czy mam mandat?</small>"]
    B["⚙️ In-execution<br/><small>Kto kontroluje bieg?</small>"]
    C["📋 Post-execution<br/><small>Co wyszło?</small>"]

    A -->|"hand-off ✓"| B
    B -->|"scaffold done"| C

    style A fill:#1e293b,stroke:#f59e0b,color:#e2e8f0
    style B fill:#1e293b,stroke:#3b82f6,color:#e2e8f0
    style C fill:#1e293b,stroke:#10b981,color:#e2e8f0
```

## Quick Reference: Bare Diagram Template

```
flowchart LR
    A["Mętna idea"] --> B["/10x-shape"]
    B --> C["shape-notes.md"]
    C --> D["/10x-prd"]
    D --> E["prd.md"]
```

---

## Consistency Note

Prework lessons and m1-l1/m1-l2 currently use bare (unstyled) diagrams. m1-l3 introduced full dark-mode styling. New diagrams going forward should use the styled template when the diagram carries semantic weight (decision flows, status, architecture). Existing bare diagrams in earlier lessons may be retroactively styled for visual consistency, but this is not required — bare diagrams are acceptable for simple pipelines.
