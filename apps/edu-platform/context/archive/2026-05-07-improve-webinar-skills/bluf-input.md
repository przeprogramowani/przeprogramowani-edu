# BLUF & Top-Down Bridge — Input for Webinar Style Guide

Source: user-provided communication framework analysis.

## Core Principle

The most destructive mistake in expert communication is narrating bottom-up (the learning sequence: fundamentals → layers → conclusion) when the audience expects top-down (conclusion first → layers on demand).

## How This Maps to Webinar Talking Points

### Per-Slide Structure

Every slide's talking points should follow BLUF order:

1. **Lead with the takeaway** — what the audience should walk away understanding from this slide
2. **Bridge from what they know** — connect to something already established (previous slide, common experience)
3. **Layer details only as needed** — the host expands based on audience reaction, not because completeness demands it

**Anti-pattern (bottom-up):**
```
- kontekst: LLM generuje kod na podstawie rozkładu prawdopodobieństwa
- szczegół: oznacza to, że nie "rozumie" architektury
- szczegół: dlatego agent potrzebuje explicit reguł
- konkluzja: → dlatego powstały Agent Skills
```

**BLUF version (top-down):**
```
- Agent Skills to sposób na zakodowanie reguł, których AI sam nie wymyśli
- dlaczego? bo model generuje "najbardziej prawdopodobny" kod, nie "twój" kod
- (szczegóły: jak to działa technicznie → następny slajd lub Deep Dive)
```

### Demo Framing

Before a demo, the host should state **what the demo will prove** (BLUF), not build up to it:

- Bad: "Teraz pokażę wam strukturę pliku, potem jak agent go czyta, potem co robi..."
- Good: "Za chwilę zobaczycie, jak agent SAM zatrzymuje się i zadaje pytania zamiast generować kod. Zobaczmy dlaczego."

### Transition Design

Transitions should carry the conclusion forward, not summarize the journey:

- Bad: "Omówiliśmy czym są Skills, jak działają, i jak je tworzyć. Teraz przejdźmy do..."
- Good: "Wiemy już, że jeden plik markdown zmienia zachowanie agenta. Pytanie: co wpisać w ten plik?"

### Overall Webinar Arc

The webinar thesis (BLUF) should appear in the first 2-3 minutes, not be built toward over 30 minutes. The rest of the webinar provides evidence and depth for an already-stated conclusion.

## Just-in-Time Context Principle

Filter every piece of information through: "What does this audience need to DO with this information?"

- VP needs to decide whether to allocate 6 weeks → lead with the decision, not the history
- Designer needs to know what Claude Code does for them → lead with the outcome, not the architecture
- Developer needs to adopt Skills → lead with "this changes your Monday", not "this is how progressive disclosure works"

## Key Rule for webinar-style.md

"Wyjaśnienie kompletne rzadko jest tożsame z wyjaśnieniem użytecznym."
(A complete explanation is rarely the same as a useful explanation.)

This should be the meta-rule that governs talking point compression, slide ordering, and demo framing.
