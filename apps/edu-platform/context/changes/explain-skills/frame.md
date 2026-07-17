# Frame Brief: Skill Mechanics Gap in M1/M2

> Framing step before /10x-plan. This document captures what is *actually*
> at issue, separated from what was initially assumed.

## Reported Observation

Learner at M2-L2 (Marcin Gościniak) reports: "zostałem zalany tysiącami linii skilli, bez żadnej analizy czemu skill jest tak a nie inaczej budowany [...] kompletnie nie ma omówionego jak taki workflow się buduje, bo dostajemy od razy masę kodu bez żadnej analizy szczegółowej." Pattern confirmed across multiple channels (Slack, webinars, support), not a vocal minority.

## Initial Framing (preserved)

- **User's stated cause or approach**: 18/19 skills get "contextual" or "action-only" treatment in lessons. The gap is explanation depth. Build `/10x-skill-explainer` as a skill + add Deep Dive callouts to lessons.
- **User's proposed direction**: Hybrid approach — explainer skill as primary mechanism + lesson callouts.
- **Pre-dispatch narrowing**: Both "how to build from scratch" and "why built this way" are intertwined — user doesn't separate them. Scale is systemic (multiple channels). Format is open for recommendation.

## Reframed Problem Statement

> **The actual problem to plan around is two-fold**: (1) learners need an on-demand tool to understand any skill's mechanics — but it must be packaged as a **prompt** (not a skill) to avoid the "skill-on-a-skill" perception that deepens complexity instead of reducing it; (2) learners need to see the **progressive construction path** (prompt → simple skill → more advanced → final version), not just reverse-engineer finished 800-line SKILL.md files.

The cofounder's key insight: "ci ludzie nie chcą analizować istniejących, tylko widzieć ścieżkę od prompta do prostego skilla, do czegoś bardziej zaawansowanego, a dopiero do tej wersji finalnej." The explainer-as-prompt solves "I'm staring at this skill and don't understand it." The progressive path solves "I could never build something like this myself." Both pains are real, intertwined, and reported systemically.

Packaging matters: prompt vs skill is functionally identical, but for learners it's the difference between "a simple prompt I paste" and "yet another tool to learn." The cofounder called it correctly — "skill na skilla zostanie odebrany tak, że problem pogłębiamy."

## Confidence

- **HIGH** — cofounder challenge validated the reframe from "build a skill" to "build a prompt + teach progressive path." User confirmed both aspects in scope. Systemic pattern, not isolated feedback.

## What Changes for /10x-plan

Plan should deliver two artifacts: (1) a skill-explainer **prompt** (not a skill) that learners paste into any Claude conversation to analyze a SKILL.md, and (2) a progressive skill-building path integrated into existing lessons or as a standalone content piece — showing the journey from bare prompt to structured skill. Research findings on skill anatomy, complexity spectrum, and customization surface remain valid and feed directly into both artifacts.

## References

- Research: `context/changes/explain-skills/research.md`
- Learner feedback: Slack screenshot from Marcin Gościniak (M2-L2, 10+ skills)
- Cofounder challenge: inline conversation provided at frame invocation
