# 10xDevs 3.0 — Specification

## Overview

**10xDevs** is a 5+1 week intensive program by Przeprogramowani & BRAVE (publishers of AI_devs) that teaches developers how to work with AI across the entire software development lifecycle — from research and planning, through implementation, to production maintenance.

- **Edition:** 3.0
- **Start date:** 18.05 (2025/2026)
- **Duration:** 5+1 weeks (5 core modules + bonus week)
- **Alumni:** 3,700+ (across all editions)
- **Rating:** 5 stars

## Core Philosophy

The program is built around a **repeatable, production-grade process** for working with AI agents — not prompt tricks or demos. Key principles:

- AI works as an engineering tool, not a chatbot
- Focus on real repos, real APIs, complex functions, real problems
- No guessing, no hallucinations, no chaos
- Context Engineering as a foundation (context windows, drift, summaries, thread management, Agents.md files)
- Full AI-Native workflow: Cursor (IDE) + Claude Code (CLI) + MCP (servers, security)

## Program Structure

Each module represents a "planetary system" in a narrative arc. Learners progress through **quests** earning badges. Two learning modes are available:

| Mode | Description |
|------|-------------|
| **Solo-Explorer** | Self-paced, focused individual work |
| **Squad-Mode** | Team-based learning, shared discoveries, collaboration |

Learning tracks within each module:

- **Fast Track** — quick entry, essentials only
- **Deep Dive** — full technical breakdown
- **Innovate** — cutting-edge solutions ahead of market
- **Extension Packs (10xToolkit)** — portable rules, skills, context files, and processes

---

## Module 1 — Agentic Environment

**Goal:** Set up a fully configured AI-powered development environment.

### Lessons

1. Od pomysłu do PRD: Metoda Sokratejska z Agentem
2. Od chatbota do Agenta: toolkit, skille i metaprompting
3. AI-Powered Bootstrap: stack i bezpieczna praca z Agentem
4. Agent Onboarding: Agents.md, AI Rules i feedback loops
5. Deployment z Agentem: CI/CD, MCP i CLI

### What you build

- **Decision Documentation** — PRDs generated via Socratic Method (starting point for every project and feature)
- Personal **Toolkit** and reusable bootstrap (project setup in minutes)
- **Context Stack** — project memory architecture (external hard drive for the Agent)
- **MCP integrations** and Agent Skills
- **Eval system** and feedback loops for Agent quality assessment

### What you learn

- Socratic Method and Anti-Confirmation Bias prompting (idea → PRD)
- Agent setup and tooling (terminal, filesystem, Git access)
- Effective delegation and metaprompting
- Operational security (sandboxes, permissions, git worktrees)
- Project memory design (PRD, Agents.md, Rules — long-term memory)
- MCP in practice (external data sources for the Agent)
- Running Evals on AI-generated code

---

## Module 2 — 10xDevs Workflow

**Goal:** Deliver a working MVP feature-by-feature using a repeatable AI workflow.

### What you build

- **Roadmap and MVP Backlog** with milestones and acceptance criteria
- **Feature delivery pipeline** (10xWorkflow): AI as Architect (plan) → AI as Coder (implement)
- **Living Documentation** system (plans, statuses, decisions in Markdown)
- **Solo Reviewer** system (checklists, git scripts for safe merging)
- Functional MVP delivered feature by feature (Plan → Review → Implement)

### What you learn

- Idea to product in one week using AI agents
- Artifact management (plans, statuses, decision files)
- Subagent delegation (separate threads to save main context)
- **80% Challenge** — handling hallucinations and error loops in final 20%
- Solo Code Review techniques (custom skills, hooks)
- Backlog Velocity vs Execution Velocity balancing
- Asynchronous multi-threaded work across parallel sessions

---

## Module 3 — AI Development Quality & Maintenance

**Goal:** Build a testing and debugging infrastructure powered by AI agents.

### What you build

- **Intelligent test pipeline** (auto-run tests → feed results to Agent)
- **Custom QA Agent** with a Testing Guide
- **Self-Healing infrastructure** (hooks-based auto-fix after failed tests)
- **E2E test suite** with MCP + Playwright
- **Bug reporting system** (Agent analyzes logs/stack traces → proposes fixes)

### What you learn

- Quality Gates in CI/CD
- Writing a Testing Guide (eliminating guesswork, enforcing conventions)
- QA prioritization (risk-based testing, tech debt backlog)
- Agent orchestration via hooks (triggers on test/linter failures)
- MCP-based testing (Playwright browser control for E2E)
- Multimodal debugging (code + logs + screenshots/video for regression testing)

---

## Module 4 — Large Scale & Legacy Projects

**Goal:** Scale AI context for complex legacy systems and drive modernization.

### What you build

- **Agent Repo Map** — navigation map of key files, modules, and dependencies
- **Nested Knowledge** structure (Agents.md files per module/folder)
- **Agent-Ready Module** — refactored legacy code prepared for autonomous AI development
- **Migration Playbook** — repeatable instructions for component-by-component migration
- **Post-Factum Documentation** — system docs generated from code and tickets

### What you learn

- Building a "Mental Model" of a project for the Agent
- Hierarchical context management (Global vs Module level, nested context files)
- Refactoring "for the Agent" (simplifying code too complex for LLMs)
- Context archaeology (recovering knowledge from tickets, old PRs, knowledge bases)
- DDD implementation in legacy (domain and module isolation)
- Migration strategies (semi-automated scenarios, e.g., Class → Function components)

---

## Module 5 — AI-Native Teamwork

**Goal:** Integrate AI into team engineering processes and build internal AI tools.

### What you build

- **Custom AI Agent** in TypeScript for CI/CD
- **Massive CR pipeline** (automated pre-filtering of AI-generated code)
- **llms.txt endpoint** (machine-readable API docs for agents)
- **Shared AI Registry** (central repo of skills, prompts, configs for the team)
- **Async Worker configuration** (delegate tasks → get results via Slack notification)

### What you learn

- Agent programming with AI SDK (TypeScript, Tool Use, token monitoring)
- Massive Code Review strategy (Automated Evals, AI-pre-check)
- llms.txt standard (exposing internal service docs for autonomous agent use)
- AI economics (cost monitoring, balancing Opus vs Haiku/Flash usage)
- Team knowledge management (versioning and distributing commands, skills, Rules for AI)
- Async agent workflows (background workers returning results after long processes)

---

## Instructors

| Name | Role |
|------|------|
| **Przemek Smyrdek** | Co-founder Przeprogramowani. Lead Engineer/Manager at DAZN, Cabify. Full-stack (.NET/C#, Java, Node.js, Angular, TypeScript). OSS contributor (CursorLens, openapi-typescript). Speaker at 4Developers, ReactiveConf, InfoShare. |
| **Marcin Czarkowski** | Co-founder Przeprogramowani. Lead at SmartRecruiters (HR-Tech). 10+ years in TypeScript, React, Node.js, PHP. Host of "Opanuj AI Podcast" (most popular Polish LLM podcast). Neuroscience enthusiast. |

## Key Tooling Stack

- **Cursor** — AI-native IDE
- **Claude Code** — CLI agent
- **OpenAI Codex** — CLI agent
- **MCP** — Model Context Protocol (host, servers, security)
- **Playwright** — E2E testing via MCP
- **AI SDK** — Agent programming in TypeScript
- **v0.dev / Bolt.new** — Rapid prototyping
- **Docker + Cloudflare** — Production deployment
