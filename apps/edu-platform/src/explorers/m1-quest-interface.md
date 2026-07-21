# M1 quest interface

This document defines the stable level surface used by the current M1 quest design. The old M1 quests remain retired; the five M1 manifests now register replacement quests with new IDs.

The maps, YAML zones, props, NPCs, doors, exams, dialogue routes, and progression flags remain the attachment surface for those replacements.

## Implemented quest roster

| Level | Quest ID | Completion | Learning beat |
| --- | --- | --- | --- |
| `m1-landing-pad` | `q-m1-prd-contract` | in-game event | Pass the PRD-contract certification exam. |
| `m1-echo-depths` | `q-m1-echotrace` | API answer | Build a reusable EchoTrace procedure and classify three protected scans from Earth HQ. |
| `m1-shaft-control` | `q-m1-safe-bootstrap` | in-game event | Pass the safe-bootstrap certification exam. |
| `m1-profile-vault` | `q-m1-moreau-onboarding` | API answer | Prepare minimal onboarding and isolate three Odyssey signatures from Earth HQ. |
| `m1-uplink-bay` | `q-m1-uplink-decision` | API answer | Select and adversarially review a safe uplink, then stop for explicit human authorization. |

The two event quests follow the M0 `q-pass-exams` pattern: an `exam:completed` objective matches a specific passing exam, and `requireFlag` makes activation safe when the player earned the certificate first. The three API quests use `earthctl`, pending grants, and plain module inputs in `~/dev/10x-explorers-hq`.

The API quests are intentionally agent-shaped rather than form-shaped. EchoTrace asks the agent to create a native reusable capability and operate an authenticated endpoint. Moreau asks it to curate minimal context and verify that context in a fresh or delegated run. Uplink asks it to produce a decision artifact, run adversarial reviews, compare CLI and MCP operability, and preserve a hard human authorization boundary.

## Runtime contract

The attachment path is:

1. `map.level.yaml` defines a zone with a stable `id` and `type`.
2. `manifest.ts` maps that ID through `interactionRoutes[].zoneId` to a dialogue.
3. `GameScene` resolves the default dialogue or the first matching `flagVariant` when the player interacts.
4. An activation dialogue may set `onComplete.activateQuest` to a registered quest ID.
5. `QuestManager` owns the active quest, completion, rewards, and completion event.
6. `manifest.questCompletionDialogues` may map the quest ID to a consequence dialogue.
7. Reward flags drive post-quest dialogue variants and unlock the door to the next map.

Zone IDs are the input ports. Reward and progression flags are the output ports. Quest IDs, quest type, copy, solution, hints, XP, activation dialogue, and completion dialogue are replaceable quest implementation details.

## Persisted-state boundary

Removing definitions does not rewrite existing local, KV, or Supabase game saves. A returning player may still carry retired quest IDs in `quests.active`, `quests.completed`, or `quests.objectivesDone`, and may still carry their reward flags.

The retired IDs are `q-synaptit-prd-audit`, `q-echotrace-skill`, `q-shaft-controller-policy`, `q-moreau-context`, and `q-uplink-to-earth`. The replacement quests use new IDs, so old completion records cannot suppress activation. Preserved reward flags still intentionally keep existing M1 door progress compatible for returning players.

## Preserved level ports

### `m1-landing-pad`

| Kind | IDs |
| --- | --- |
| Triggers | `operation-archive`, `landing-marker`, `drone1`, `drone2`, `drone3`, `drone4` |
| NPCs | `disabled-scout`, `canopy-surveyor` |
| Exam | `exam-prd-contract` |
| Doors | `ship-teleport` to `m0-core-ai`; `echo-depths-door` to `m1-echo-depths` |

The natural activation port is `operation-archive`. The preserved progression output is `FLAGS.M1_PRD_AUDIT_DONE` (`m1-prd-audit-done`): it selects the existing post-state route variants and unlocks `echo-depths-door`.

### `m1-echo-depths`

| Kind | IDs |
| --- | --- |
| Triggers | `echo-console`, `cavity-alpha`, `cavity-beta`, `cavity-gamma`, `synaptit-outcrop` |
| NPC | `echo-mapper` |
| Exam | `exam-agent-skills` |
| Doors | `landing-door` to `m1-landing-pad`; `shaft-control-door` to `m1-shaft-control` |

The natural activation port is `echo-console`. The preserved progression output is `FLAGS.M1_ECHOTRACE_DONE` (`m1-echotrace-done`): it selects the existing post-state route variants and unlocks `shaft-control-door`. `FLAGS.CMDS_SCAN` is an optional command unlock previously associated with this beat, not a door requirement.

### `m1-shaft-control`

| Kind | IDs |
| --- | --- |
| Triggers | `shaft-controller`, `bootloader-core`, `signature-beacon` |
| NPCs | `shaft-custodian`, `policy-sentinel` |
| Exam | `exam-safe-bootstrap` |
| Doors | `echo-depths-door` to `m1-echo-depths`; `profile-vault-door` to `m1-profile-vault` |

The natural activation port is `shaft-controller`. The preserved progression output is `FLAGS.M1_SHAFT_POLICY_DONE` (`m1-shaft-policy-done`): it selects the main post-state route variants and unlocks `profile-vault-door`. `FLAGS.M1_VOID_AWARE_OF_ODYSSEY` controls the `signature-beacon` variant, and `FLAGS.CMDS_POLICY` is an optional command unlock.

### `m1-profile-vault`

| Kind | IDs |
| --- | --- |
| Triggers | `crew-profile-cache`, `moreau-profile`, `recall-code`, `wake-relay` |
| NPCs | `archive-echo`, `vault-indexer` |
| Exam | `exam-agent-onboarding` |
| Doors | `shaft-control-door` to `m1-shaft-control`; `uplink-bay-door` to `m1-uplink-bay` |

The natural activation port is `crew-profile-cache`. The preserved progression output is `FLAGS.M1_MOREAU_CONTEXT_DONE` (`m1-moreau-context-done`): it selects the cache/indexer post-state variants and unlocks `uplink-bay-door`. `FLAGS.M1_MOREAU_AWAKE` and `FLAGS.M1_HARRIS_RECALL_DISCOVERED` control the other preserved variants; `FLAGS.CMDS_CREW` is an optional command unlock.

### `m1-uplink-bay`

| Kind | IDs |
| --- | --- |
| Triggers | `uplink-console`, `classical-route`, `amplified-route`, `relay-route`, `human-auth-panel` |
| NPC | `relay-tender` |
| Exam | `exam-authorization-boundary` |
| Doors | `profile-vault-door` to `m1-profile-vault`; `moon-two-door` to `m2-planning` |

The natural activation port is `uplink-console`. The preserved M1 completion output is `FLAGS.M1_UPLINK_DONE` (`m1-uplink-done`): together with `FLAGS.SYS_COURSE_M2_AVAILABLE`, it unlocks `moon-two-door`. `FLAGS.M1_BASIC_SENSORS_RESTORED` and `FLAGS.M1_HQ_CHANNEL_SUSPECT` drive terminal state; `FLAGS.CMDS_INTEL`, `FLAGS.CMDS_UPLINK`, and `FLAGS.CMDS_SENSORS` are optional command unlocks.

## Attaching a replacement quest

For each level that receives a new quest:

1. Add `levels/<map-key>/quests.ts` with a bilingual `QuestDefinition[]` using a globally unique quest ID.
2. Import it in the level manifest and add `quests`.
3. Select one or more preserved zone routes as activation, guidance, objective, or consequence ports. Add `activateQuest` only to the dialogue that should start the quest.
4. Add a new completion dialogue and `questCompletionDialogues[questId]` if completion should play a scene.
5. Reward the preserved progression flag if the existing next-door gate should remain unchanged. If the new design changes that flag, update the YAML door requirement and every route or terminal consumer together.
6. Use `flagVariants` for visible pre-quest, active, and completed state. Variants are evaluated in array order; the first matching flag wins.
7. Keep every player-facing quest and dialogue field bilingual (`pl` and `en`).

The five exams stay registered as independent learning checks. Only the landing-pad and shaft-control exams are quest objectives; completing the uplink exam does not transmit coordinates or complete the HQ quest.

## API-answer boundary

An `api-answer` quest is a cross-system contract, not only a level definition. Its quest ID, canonical answer/hash, HQ inputs, submission command, pending grant, reward flags, and completion dialogue must agree.

`src/pages/api/game/resources/echo/[scanId].ts` authorizes the active or completed `q-m1-echotrace` quest. The HQ side is deliberately static-only: `module-001-agentic-environment/QUEST_INDEX.csv` routes each quest to one prompt and its Markdown/CSV inputs. It contains no mission runner, validator, JavaScript, TypeScript, or custom script. The coding agent chooses its own native tools and must show evidence to the human before submission.

## Validation checklist

After attaching quests:

```bash
npm run levels:build
npm run levels:check
npx vitest run src/explorers/levels/contentValidation.test.ts
npx vitest run src/explorers/levels/bilingualParity.test.ts
```

For an `api-answer` quest, also test the complete HQ-to-browser submission and pending-grant flow. For any map or door change, render the affected map with zones and verify both directions and arrival spawns.
