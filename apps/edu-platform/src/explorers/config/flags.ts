/** Central registry of all game flag string constants. */
export const FLAGS = {
  // Terminal command unlock flags
  CMDS_QUEST: 'cmds:quest',
  CMDS_NAVI: 'cmds:navi',
  CMDS_SUPPORT: 'cmds:support',
  CMDS_BADGES: 'cmds:badges',
  CMDS_BOOKMARKS: 'cmds:bookmarks',
  CMDS_SCAN: 'cmds:scan',
  CMDS_DRONE: 'cmds:drone',
  CMDS_CREW: 'cmds:crew',
  CMDS_INTEL: 'cmds:intel',
  CMDS_UPLINK: 'cmds:uplink',
  CMDS_SENSORS: 'cmds:sensors',
  CMDS_PLAN: 'cmds:plan',
  CMDS_SOPEL: 'cmds:sopel',
  CMDS_ISKRA: 'cmds:iskra',
  CMDS_DIAG: 'cmds:diag',
  CMDS_ECHO: 'cmds:echo',
  CMDS_RECALL: 'cmds:recall',

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
  M0_RETURN_FROM_MOON2_SEEN: 'm0-return-from-moon2-seen',
  M0_RETURN_FROM_MOON3_SEEN: 'm0-return-from-moon3-seen',
  M0_RETURN_FROM_MOON4_SEEN: 'm0-return-from-moon4-seen',

  // M0 Exam Room
  M0_EXAM_AGENT_SYSTEMS_DONE: 'm0-exam-agent-systems-done',
  M0_EXAM_OPERATIONAL_PROCEDURES_DONE: 'm0-exam-operational-procedures-done',
  M0_EXAM_CONTEXT_ENGINEERING_DONE: 'm0-exam-context-engineering-done',

  // M1 Jungle Moon — Strefa Ciszy (Agentic Environment)
  // Intro-seen flags
  M1_LANDING_INTRO_SEEN: 'm1-landing-intro-seen',
  M1_GROVE_INTRO_SEEN: 'm1-grove-intro-seen',
  M1_SILENCE_INTRO_SEEN: 'm1-silence-intro-seen',
  M1_VEIN_INTRO_SEEN: 'm1-vein-intro-seen',
  M1_CREST_INTRO_SEEN: 'm1-crest-intro-seen',
  // l1 — Oczy misji (Landing Pad)
  M1_EYES_ACTIVE: 'm1-eyes-active',
  M1_EYES_WALL_SEEN: 'm1-eyes-wall-seen',
  M1_EYES_BURN_SEEN: 'm1-eyes-burn-seen',
  M1_EYES_RIDGE_SEEN: 'm1-eyes-ridge-seen',
  M1_EYES_DONE: 'm1-eyes-done',
  M1_CAMP_ONLINE: 'm1-camp-online',
  M1_OLD_BURNS_FOUND: 'm1-old-burns-found',
  // l2 — Świerszcz (Probe Grove)
  M1_PROBE_CORE_FOUND: 'm1-probe-core-found',
  M1_SWIERSZCZ_ONLINE: 'm1-swierszcz-online',
  // l3 — Cisza (Silence Zone)
  M1_SILENCE_ACTIVE: 'm1-silence-active',
  M1_NODE_DEEP_ISOLATED: 'm1-node-deep-isolated',
  M1_NODE_NORTH_ISOLATED: 'm1-node-north-isolated',
  M1_NODE_EAST_ISOLATED: 'm1-node-east-isolated',
  M1_SILENCE_DONE: 'm1-silence-done',
  M1_ENTROPY_NAMED: 'm1-entropy-named',
  // l4 — Pierwsza Żyła (The Vein)
  M1_VEIN_ACTIVE: 'm1-vein-active',
  M1_RIG_POWERED: 'm1-rig-powered',
  M1_DEEP_SCAN_DONE: 'm1-deep-scan-done',
  M1_VEIN_EXTRACTED: 'm1-vein-extracted',
  M1_FIRST_ORE: 'm1-first-ore',
  // l5 — Kalibracja (Relay Crest)
  M1_PYLON_WEST_SET: 'm1-pylon-west-set',
  M1_PYLON_EAST_SET: 'm1-pylon-east-set',
  M1_ARRAY_POWERED: 'm1-array-powered',
  M1_CALIBRATION_ACTIVE: 'm1-calibration-active',
  M1_SENSORS_ONLINE: 'm1-sensors-online',
  M1_HQ_ECHO_LOGGED: 'm1-hq-echo-logged',
  // Return path (conditional-intro seen flags)
  M1_RETURN_VEIN_SEEN: 'm1-return-vein-seen',
  M1_RETURN_SILENCE_SEEN: 'm1-return-silence-seen',
  M1_RETURN_GROVE_SEEN: 'm1-return-grove-seen',
  M1_RETURN_CAMP_SEEN: 'm1-return-camp-seen',
  M1_ORB_MET: 'm1-orb-met',

  // M1 Protokół Ekspedycyjny certification exams (I–V)
  M1_EXAM_PROTOCOL_1_DONE: 'm1-exam-protocol-1-done',
  M1_EXAM_PROTOCOL_2_DONE: 'm1-exam-protocol-2-done',
  M1_EXAM_PROTOCOL_3_DONE: 'm1-exam-protocol-3-done',
  M1_EXAM_PROTOCOL_4_DONE: 'm1-exam-protocol-4-done',
  M1_EXAM_PROTOCOL_5_DONE: 'm1-exam-protocol-5-done',

  // ─────────────────────────────────────────────────────────────────────────
  // M2 Ice Factory — „Martwy Punkt" (10xDevs Workflow arc)
  // ─────────────────────────────────────────────────────────────────────────
  // intros
  M2_GATE_INTRO_SEEN: 'm2-gate-intro-seen',
  M2_SERVICE_INTRO_SEEN: 'm2-service-intro-seen',
  M2_DEADLOCK_INTRO_SEEN: 'm2-deadlock-intro-seen',
  M2_FOUNDRY_INTRO_SEEN: 'm2-foundry-intro-seen',
  M2_DISPATCH_INTRO_SEEN: 'm2-dispatch-intro-seen',
  // l1 — Rozruch Bramy
  M2_BOOT_ACTIVE: 'm2-boot-active',
  M2_GUARDHOUSE_WARM: 'm2-guardhouse-warm',
  M2_HEAT_NODE_1_ON: 'm2-heat-node-1-on',
  M2_HEAT_NODE_2_ON: 'm2-heat-node-2-on',
  M2_HEAT_NODE_3_ON: 'm2-heat-node-3-on',
  M2_BOOT_DONE: 'm2-boot-done',
  M2_GATE_ONLINE: 'm2-gate-online',
  M2_BLACKBOX_DOCKING_SEEN: 'm2-blackbox-docking-seen',
  // l2 — Nowy Rozkaz
  M2_SOPEL_ONLINE: 'm2-sopel-online',
  M2_ENDLESS_TASK_FOUND: 'm2-endless-task-found',
  // l3 — Zakleszczenie
  M2_DEADLOCK_ACTIVE: 'm2-deadlock-active',
  M2_TRAM_GAMMA_RELEASED: 'm2-tram-gamma-released',
  M2_TRAM_BETA_RELEASED: 'm2-tram-beta-released',
  M2_TRAM_ALPHA_RELEASED: 'm2-tram-alpha-released',
  M2_DEADLOCK_CLEARED: 'm2-deadlock-cleared',
  M2_ENTROPY_PROFILED: 'm2-entropy-profiled',
  // l4 — Pierwszy Wytop
  M2_MELT_ACTIVE: 'm2-melt-active',
  M2_GALLERY_OPEN: 'm2-gallery-open',
  M2_SWITCHYARD_DONE: 'm2-switchyard-done',
  M2_CAST_DONE: 'm2-cast-done',
  M2_FIRST_INGOT: 'm2-first-ingot',
  M2_HARRIS_DELAY_LOGGED: 'm2-harris-delay-logged',
  M2_KERN_REVISION_NOTED: 'm2-kern-revision-noted',
  // l5 — Plan Główny
  M2_MASTER_PLAN_ACTIVE: 'm2-master-plan-active',
  M2_PLANNING_ONLINE: 'm2-planning-online',
  M2_SABOTAGE_TIMESTAMPED: 'm2-sabotage-timestamped',
  M2_PURSUIT_ON_MAP: 'm2-pursuit-on-map',
  M2_CHECKSUM_MISMATCH_SEEN: 'm2-checksum-mismatch-seen',
  // return path (conditional-intro seen flags)
  M2_RETURN_FOUNDRY_SEEN: 'm2-return-foundry-seen',
  M2_RETURN_DEADLOCK_SEEN: 'm2-return-deadlock-seen',
  M2_RETURN_SERVICE_SEEN: 'm2-return-service-seen',
  M2_RETURN_GATE_SEEN: 'm2-return-gate-seen',
  M2_RING_SCANNED: 'm2-ring-scanned',
  M2_DELIVERY_001: 'm2-delivery-001',
  // exams (Protokół Ekspedycyjny VI–X)
  M2_EXAM_PROTOCOL_6_DONE: 'm2-exam-protocol-6-done',
  M2_EXAM_PROTOCOL_7_DONE: 'm2-exam-protocol-7-done',
  M2_EXAM_PROTOCOL_8_DONE: 'm2-exam-protocol-8-done',
  M2_EXAM_PROTOCOL_9_DONE: 'm2-exam-protocol-9-done',
  M2_EXAM_PROTOCOL_10_DONE: 'm2-exam-protocol-10-done',

  // ─────────────────────────────────────────────────────────────────────────
  // M3 Volcanic Proving Grounds — „Próba Ognia" (Quality & Maintenance arc)
  // ─────────────────────────────────────────────────────────────────────────
  // intros
  M3_APRON_INTRO_SEEN: 'm3-apron-intro-seen',
  M3_BONEYARD_INTRO_SEEN: 'm3-boneyard-intro-seen',
  M3_FIRE_TRIAL_INTRO_SEEN: 'm3-fire-trial-intro-seen',
  M3_ANNEALING_INTRO_SEEN: 'm3-annealing-intro-seen',
  M3_ASSAY_INTRO_SEEN: 'm3-assay-intro-seen',
  // l1 — Audyt
  M3_AUDIT_ACTIVE: 'm3-audit-active',
  M3_AUDIT_TOWER_CHECKED: 'm3-audit-tower-checked',
  M3_AUDIT_ANCHOR_CHECKED: 'm3-audit-anchor-checked',
  M3_AUDIT_MAST_CHECKED: 'm3-audit-mast-checked',
  M3_CAMP_ONLINE: 'm3-camp-online',
  M3_VOID_READ_SESSION_SEEN: 'm3-void-read-session-seen',
  // l2 — Prawdziwa Usterka
  M3_FAULT_HUNT_ACTIVE: 'm3-fault-hunt-active',
  M3_ISKRA_ONLINE: 'm3-iskra-online',
  M3_DOCTRINE_AUTHOR_FOUND: 'm3-doctrine-author-found',
  // l3 — Czerwone Światło
  M3_TRIAL_ACTIVE: 'm3-trial-active',
  M3_STAND_3_TESTED: 'm3-stand-3-tested',
  M3_STAND_1_TESTED: 'm3-stand-1-tested',
  M3_STAND_2_TESTED: 'm3-stand-2-tested',
  M3_RED_LIGHT_ONLINE: 'm3-red-light-online',
  M3_ENTROPY_UNMASKED: 'm3-entropy-unmasked',
  // l4 — Pierwszy Certyfikat
  M3_CERT_ACTIVE: 'm3-cert-active',
  M3_ASSAY_RIG_POWERED: 'm3-assay-rig-powered',
  M3_COOLING_CERTIFIED: 'm3-cooling-certified',
  M3_BATCH_ANNEALED: 'm3-batch-annealed',
  M3_FIRST_CERT: 'm3-first-cert',
  M3_DEAD_DISH_RELAY_SEEN: 'm3-dead-dish-relay-seen',
  M3_KERN_DECIMALS_NOTED: 'm3-kern-decimals-noted',
  // l5 — Wzorzec
  M3_STANDARD_ACTIVE: 'm3-standard-active',
  M3_DIAGNOSTICS_ONLINE: 'm3-diagnostics-online',
  M3_CANARY_EDITED_SEEN: 'm3-canary-edited-seen',
  M3_WAKE_TRAP_DIAGNOSED: 'm3-wake-trap-diagnosed',
  M3_PURSUIT_SPLIT_SEEN: 'm3-pursuit-split-seen',
  M3_REVISION_ORDER_FOUND: 'm3-revision-order-found',
  // return path (conditional-intro seen flags + optional beats)
  M3_RETURN_ANNEALING_SEEN: 'm3-return-annealing-seen',
  M3_RETURN_FIRE_TRIAL_SEEN: 'm3-return-fire-trial-seen',
  M3_RETURN_BONEYARD_SEEN: 'm3-return-boneyard-seen',
  M3_RETURN_APRON_SEEN: 'm3-return-apron-seen',
  M3_OBELISK_DIAGNOSED: 'm3-obelisk-diagnosed',
  M3_STATION_RECERTIFIED: 'm3-station-recertified',
  // exams (Protokół Ekspedycyjny XI–XV)
  M3_EXAM_PROTOCOL_11_DONE: 'm3-exam-protocol-11-done',
  M3_EXAM_PROTOCOL_12_DONE: 'm3-exam-protocol-12-done',
  M3_EXAM_PROTOCOL_13_DONE: 'm3-exam-protocol-13-done',
  M3_EXAM_PROTOCOL_14_DONE: 'm3-exam-protocol-14-done',
  M3_EXAM_PROTOCOL_15_DONE: 'm3-exam-protocol-15-done',

  // ─────────────────────────────────────────────────────────────────────────
  // M4 Desert Archive — „Wymazany Indeks" (Large-scale & Legacy arc)
  // ─────────────────────────────────────────────────────────────────────────
  // intros
  M4_CARAVANSERAI_INTRO_SEEN: 'm4-caravanserai-intro-seen',
  M4_COURIER_INTRO_SEEN: 'm4-courier-intro-seen',
  M4_INDEX_INTRO_SEEN: 'm4-index-intro-seen',
  M4_VAULT_INTRO_SEEN: 'm4-vault-intro-seen',
  M4_MEMORY_INTRO_SEEN: 'm4-memory-intro-seen',
  // l1 — Trzy Kopce
  M4_CAIRNS_ACTIVE: 'm4-cairns-active',
  M4_PANELS_POWERED: 'm4-panels-powered',
  M4_CAIRN_1_READ: 'm4-cairn-1-read',
  M4_CAIRN_2_READ: 'm4-cairn-2-read',
  M4_CAIRN_3_READ: 'm4-cairn-3-read',
  M4_CAMP_ONLINE: 'm4-camp-online',
  M4_MOVED_CAIRN_SEEN: 'm4-moved-cairn-seen',
  // l2 — Ostatnia Trasa
  M4_COURIER_HUNT_ACTIVE: 'm4-courier-hunt-active',
  M4_YARD_POWERED: 'm4-yard-powered',
  M4_ECHO_ONLINE: 'm4-echo-online',
  M4_GHOST_COURSE_SEEN: 'm4-ghost-course-seen',
  M4_DEXO_ARCHITECT_SEEN: 'm4-dexo-architect-seen',
  // l3 — Nić
  M4_THREAD_ACTIVE: 'm4-thread-active',
  M4_SPINDLE_1_LINKED: 'm4-spindle-1-linked',
  M4_SPINDLE_2_LINKED: 'm4-spindle-2-linked',
  M4_SPINDLE_3_LINKED: 'm4-spindle-3-linked',
  M4_ENTROPY_CATALOGUED: 'm4-entropy-catalogued',
  M4_ENTROPY_FOURTH_FACE_SEEN: 'm4-entropy-fourth-face-seen',
  M4_VEIN_TRACE_SEEN: 'm4-vein-trace-seen',
  // l4 — Pierwsza Mapa
  M4_MAP_ACTIVE: 'm4-map-active',
  M4_LIFTS_POWERED: 'm4-lifts-powered',
  M4_GALLERIES_MAPPED: 'm4-galleries-mapped',
  M4_MASTER_MAP: 'm4-master-map',
  M4_MEDBAY_INDEX_SEEN: 'm4-medbay-index-seen',
  M4_KERN_FILE_MISMATCH_SEEN: 'm4-kern-file-mismatch-seen',
  // l5 — Drugi Kanał
  M4_MEMORY_ACTIVE: 'm4-memory-active',
  M4_CORES_BROUGHT: 'm4-cores-brought',
  M4_SIDE_CHANNEL_ONLINE: 'm4-side-channel-online',
  M4_MEMORY_ONLINE: 'm4-memory-online',
  M4_SLEEPING_ENTROPY_SEEN: 'm4-sleeping-entropy-seen',
  M4_R077_FOUND: 'm4-r077-found',
  M4_HERDING_PATTERN_SEEN: 'm4-herding-pattern-seen',
  // return path (conditional-intro seen flags + optional beats)
  M4_RETURN_VAULT_SEEN: 'm4-return-vault-seen',
  M4_RETURN_INDEX_SEEN: 'm4-return-index-seen',
  M4_RETURN_COURIER_SEEN: 'm4-return-courier-seen',
  M4_RETURN_CARAVANSERAI_SEEN: 'm4-return-caravanserai-seen',
  M4_LOWER_READING_ROOM_SEEN: 'm4-lower-reading-room-seen',
  M4_KERN_CONFESSION_SEEN: 'm4-kern-confession-seen',
  // exams (Protokół Ekspedycyjny XVI–XX)
  M4_EXAM_PROTOCOL_16_DONE: 'm4-exam-protocol-16-done',
  M4_EXAM_PROTOCOL_17_DONE: 'm4-exam-protocol-17-done',
  M4_EXAM_PROTOCOL_18_DONE: 'm4-exam-protocol-18-done',
  M4_EXAM_PROTOCOL_19_DONE: 'm4-exam-protocol-19-done',
  M4_EXAM_PROTOCOL_20_DONE: 'm4-exam-protocol-20-done',

  // System flags (controlled server-side via Supabase, never saved in player state)
  SYS_COURSE_M1_AVAILABLE: 'sys:course-m1-available',
  SYS_COURSE_M2_AVAILABLE: 'sys:course-m2-available',
  SYS_COURSE_M3_AVAILABLE: 'sys:course-m3-available',
  SYS_COURSE_M4_AVAILABLE: 'sys:course-m4-available',
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
