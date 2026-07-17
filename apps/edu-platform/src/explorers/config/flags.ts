/** Central registry of all game flag string constants. */
export const FLAGS = {
  // Terminal command unlock flags
  CMDS_QUEST: 'cmds:quest',
  CMDS_NAVI: 'cmds:navi',
  CMDS_SUPPORT: 'cmds:support',
  CMDS_BADGES: 'cmds:badges',
  CMDS_BOOKMARKS: 'cmds:bookmarks',

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

  // M0 Exam Room
  M0_EXAM_AGENT_SYSTEMS_DONE: 'm0-exam-agent-systems-done',
  M0_EXAM_OPERATIONAL_PROCEDURES_DONE: 'm0-exam-operational-procedures-done',
  M0_EXAM_CONTEXT_ENGINEERING_DONE: 'm0-exam-context-engineering-done',

  // System flags (controlled server-side via Supabase, never saved in player state)
  SYS_COURSE_M1_AVAILABLE: 'sys:course-m1-available',
  SYS_COURSE_M2_AVAILABLE: 'sys:course-m2-available',
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
