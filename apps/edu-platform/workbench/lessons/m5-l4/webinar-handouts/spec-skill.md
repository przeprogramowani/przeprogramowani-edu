# Code Review Skill — Requirements

## Goal
Create an Agent Skill for automated code review based on our team's engineering conventions.

## Input
Our team conventions are documented in the accompanying `conventions.md` handout
(delivered alongside this spec). Use them as the foundation for the skill's review
categories and rules.

## Configuration
- Skill name: `code-review`
- Category: quality
- Trigger phrases: "review code", "check this PR", "review my changes", "code review"

## Output format
Findings organized by severity: Critical → Warning → Suggestion.
Each finding includes file:line reference.
Summary with pass/fail recommendation (APPROVE / REQUEST CHANGES / NEEDS DISCUSSION).
