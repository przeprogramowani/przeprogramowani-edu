/** Central registry of all game flag string constants. */
export const FLAGS = {
  // Terminal command unlock flags
  CMDS_QUEST: 'cmds:quest',
  CMDS_NAVI: 'cmds:navi',
  CMDS_SUPPORT: 'cmds:support',
  CMDS_BADGES: 'cmds:badges',
  CMDS_BOOKMARKS: 'cmds:bookmarks',
  CMDS_SCAN: 'cmds:scan',
  CMDS_POLICY: 'cmds:policy',
  CMDS_CREW: 'cmds:crew',
  CMDS_INTEL: 'cmds:intel',
  CMDS_UPLINK: 'cmds:uplink',
  CMDS_SENSORS: 'cmds:sensors',
  CMDS_PLAN: 'cmds:plan',
  CMDS_PLANNER: 'cmds:planner',

  // General progression flags
  TERMINAL_FOUND: 'terminal-found',
  TERMINAL_UNLOCKED: 'terminal-unlocked',
  KEYCODE_FOUND: 'keycode-found',

  // Quest flags
  QUEST_EXAMS_DONE: 'quest:exams-done',

  // M0 Awakening
  M0_INTRO_SEEN: 'm0-intro-seen',
  M0_INFO_BOARD_READ: 'm0-info-board-read',

  // M0 Core AI
  M0_CORE_AI_INTRO_SEEN: 'm0-core-ai-intro-seen',
  M0_FIRMWARE_UPGRADED: 'm0-firmware-upgraded',
  M0_CORE_AI_MALFUNCTION_SEEN: 'm0-core-ai-malfunction-seen',
  M0_SUPPORT_CALIBRATED: 'm0-support-calibrated',
  M0_EARTH_SIGNAL_RECEIVED: 'm0-earth-signal-received',
  M0_RETURN_FROM_MOON1_SEEN: 'm0-return-from-moon1-seen',

  // M0 Exam Room
  M0_EXAM_AGENT_SYSTEMS_DONE: 'm0-exam-agent-systems-done',
  M0_EXAM_OPERATIONAL_PROCEDURES_DONE: 'm0-exam-operational-procedures-done',
  M0_EXAM_CONTEXT_ENGINEERING_DONE: 'm0-exam-context-engineering-done',

  // M1 Jungle Moon — Agentic Environment
  M1_LANDING_INTRO_SEEN: 'm1-landing-intro-seen',
  M1_PRD_AUDIT_DONE: 'm1-prd-audit-done',
  M1_ECHO_INTRO_SEEN: 'm1-echo-intro-seen',
  M1_ECHOTRACE_DONE: 'm1-echotrace-done',
  M1_SHAFT_INTRO_SEEN: 'm1-shaft-intro-seen',
  M1_SHAFT_POLICY_DONE: 'm1-shaft-policy-done',
  M1_VOID_AWARE_OF_ODYSSEY: 'm1-void-aware-of-odyssey',
  M1_PROFILE_INTRO_SEEN: 'm1-profile-intro-seen',
  M1_MOREAU_CONTEXT_DONE: 'm1-moreau-context-done',
  M1_MOREAU_AWAKE: 'm1-moreau-awake',
  M1_HARRIS_RECALL_DISCOVERED: 'm1-harris-recall-discovered',
  M1_UPLINK_INTRO_SEEN: 'm1-uplink-intro-seen',
  M1_UPLINK_DONE: 'm1-uplink-done',
  M1_BASIC_SENSORS_RESTORED: 'm1-basic-sensors-restored',
  M1_HQ_CHANNEL_SUSPECT: 'm1-hq-channel-suspect',

  // M1 VOID operator certification exams
  M1_EXAM_PRD_CONTRACT_DONE: 'm1-exam-prd-contract-done',
  M1_EXAM_AGENT_SKILLS_DONE: 'm1-exam-agent-skills-done',
  M1_EXAM_SAFE_BOOTSTRAP_DONE: 'm1-exam-safe-bootstrap-done',
  M1_EXAM_AGENT_ONBOARDING_DONE: 'm1-exam-agent-onboarding-done',
  M1_EXAM_AUTHORIZATION_BOUNDARY_DONE: 'm1-exam-authorization-boundary-done',

  // M2 Snow Moon — 10xDevs Workflow
  M2_PLANNING_INTRO_SEEN: 'm2-planning-intro-seen',
  M2_STAGING_INTRO_SEEN: 'm2-staging-intro-seen',
  M2_DRAFTING_INTRO_SEEN: 'm2-drafting-intro-seen',
  M2_ASSEMBLY_INTRO_SEEN: 'm2-assembly-intro-seen',
  M2_CORE_INTRO_SEEN: 'm2-core-intro-seen',
  M2_SIDE_CHANNEL_ESTABLISHED: 'm2-side-channel-established',
  M2_PLAN_CONTRACT_DONE: 'm2-plan-contract-done',
  M2_MILESTONES_DONE: 'm2-milestones-done',
  M2_INBOUND_CONTACT_LOGGED: 'm2-inbound-contact-logged',
  M2_ARCHITECTURE_DONE: 'm2-architecture-done',
  M2_INSIDER_WORK_ORDER_FOUND: 'm2-insider-work-order-found',
  M2_IMPL_CONTROL_DONE: 'm2-impl-control-done',
  M2_SOLO_REVIEW_DONE: 'm2-solo-review-done',
  M2_PLANNING_MODULE_RESTORED: 'm2-planning-module-restored',
  M2_VOID_INTERCEPT_PLAN_FOUND: 'm2-void-intercept-plan-found',

  // M2 VOID operator certification exams
  M2_EXAM_PLAN_FIRST_DONE: 'm2-exam-plan-first-done',
  M2_EXAM_MVP_MILESTONES_DONE: 'm2-exam-mvp-milestones-done',
  M2_EXAM_AGENT_ARCHITECTURE_DONE: 'm2-exam-agent-architecture-done',
  M2_EXAM_IMPL_CONTROL_DONE: 'm2-exam-impl-control-done',
  M2_EXAM_SOLO_REVIEW_DONE: 'm2-exam-solo-review-done',

  // System flags (controlled server-side via Supabase, never saved in player state)
  SYS_COURSE_M1_AVAILABLE: 'sys:course-m1-available',
  SYS_COURSE_M2_AVAILABLE: 'sys:course-m2-available',
  SYS_COURSE_M3_AVAILABLE: 'sys:course-m3-available',
} as const;

type StaticGameFlag = (typeof FLAGS)[keyof typeof FLAGS];

export type ArcadeStationFlag<
  MapKey extends string = string,
  ZoneId extends string = string,
  ArcadeGameId extends string = string,
> = `arcade:${MapKey}:${ZoneId}:${ArcadeGameId}`;

export type GameFlag = StaticGameFlag | ArcadeStationFlag;

/** Flat array of all known flag values — used by QA overlay and tooling. */
export const ALL_FLAGS: StaticGameFlag[] = Object.values(FLAGS);
