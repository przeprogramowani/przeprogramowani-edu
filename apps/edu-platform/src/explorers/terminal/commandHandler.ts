import type { GameState } from '../state/types';
import type { QuestManager, EventQuest } from '../systems/QuestManager';
import { getRankForXP, getRankProgress, RANKS } from '../config/ranks';
import { localized } from '../i18n/types';
import { t } from '../i18n';
import { isCommandAvailable, getAvailableCommands } from './commandRegistry';
import { getBookmarks } from '../systems/BookmarkManager';
import { FLAGS, type GameFlag } from '../config/flags';
import { NAV_DESTINATIONS, getDestinationStatus } from '../levels/navigationDestinations';

export interface InteractiveAction {
  type: 'preview' | 'link';
  url: string;
  title: string;
}

export interface InteractiveItem {
  label: string;
  action: InteractiveAction;
}

export interface CommandResult {
  output: string[];
  interactive?: InteractiveItem[];
  /** Dialogue ID to trigger after displaying the command output */
  triggerDialogue?: string;
  /** Re-run this command periodically and replace its output block */
  liveUpdate?: { intervalMs: number };
}

export function handleCommand(raw: string, state: GameState, questManager?: QuestManager): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/')) {
    return { output: [t('terminal.unknownCommand')] };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === 'help') {
    return cmdHelp(state);
  }

  if (!isCommandAvailable(cmd, state.flags)) {
    return { output: [t('terminal.unknownCommandWithName', { cmd })] };
  }

  switch (cmd) {
    case 'me':
      return cmdMe(state);
    case 'time':
      return cmdTime();
    case 'quest':
      return cmdQuest(state, questManager);
    case 'solve':
      return cmdSolve(args, state, questManager);
    case 'hint':
      return cmdHint(state, questManager);
    case 'bookmarks':
      return cmdBookmarks(state);
    case 'navi':
      return cmdNavi(state);
    case 'support':
      return cmdSupport(state);
    case 'badges':
      return cmdBadges(state);
    case 'scan':
      return cmdScan(state);
    case 'drone':
      return cmdDrone(state);
    case 'crew':
      return cmdCrew(state);
    case 'intel':
      return cmdIntel(state);
    case 'uplink':
      return cmdUplink(state);
    case 'sensors':
      return cmdSensors(state);
    case 'plan':
      return cmdPlan(state);
    case 'sopel':
      return cmdSopel(state);
    case 'iskra':
      return cmdIskra(state);
    case 'diag':
      return cmdDiag(state);
    case 'echo':
      return cmdEcho(state);
    case 'recall':
      return cmdRecall(state);
    default:
      return { output: [t('terminal.unknownCommandWithName', { cmd })] };
  }
}

function statusBlock(header: string, lines: string[]): CommandResult {
  return { output: [header, '═════════════════════════════', '', ...lines] };
}

// CORE AI is flooded with readings on the moon and needs the astronaut to rank
// what matters. /scan is the per-location readout and the hint channel for what
// lies deeper.
function cmdScan(state: GameState): CommandResult {
  const map = state.currentMap;
  let lines: string[];
  switch (map) {
    case 'm1-landing-pad':
      lines = [t('terminal.scan.landing')];
      break;
    case 'm1-shaft-control':
      lines = [t('terminal.scan.grove')];
      break;
    case 'm1-echo-depths':
      lines = [t('terminal.scan.silence')];
      break;
    case 'm1-profile-vault':
      lines = [t('terminal.scan.vein')];
      break;
    case 'm1-uplink-bay':
      lines = [t('terminal.scan.crest')];
      break;
    case 'm2-planning':
      lines = [t('terminal.scan.gate')];
      break;
    case 'm2-drafting-hall':
      lines = [t('terminal.scan.service')];
      break;
    case 'm2-staging-yard':
      lines = [t('terminal.scan.deadlock')];
      break;
    case 'm2-assembly-line':
      lines = [t('terminal.scan.foundry')];
      // Once the tower runs its plan, the deep-ice ring reads on the scan —
      // a regular shape whose harmonics match the Moon 1 orb. Never explained.
      if (state.flags.includes(FLAGS.M2_PLANNING_ONLINE)) lines.push(t('terminal.scan.ring'));
      break;
    case 'm2-planning-core':
      lines = [t('terminal.scan.dispatch')];
      break;
    case 'm3-apron':
      lines = [t('terminal.scan.apron')];
      break;
    case 'm3-boneyard':
      lines = [t('terminal.scan.boneyard')];
      break;
    case 'm3-fire-trial':
      lines = [t('terminal.scan.trial')];
      break;
    case 'm3-annealing-yard':
      lines = [t('terminal.scan.yard')];
      break;
    case 'm3-assay-office':
      lines = [t('terminal.scan.assay')];
      break;
    default:
      lines = [t('terminal.scan.generic')];
  }
  return statusBlock(t('terminal.scan.header'), lines);
}

// Świerszcz — the drone rebuilt from the Odyssey probe. Reports his own status;
// his chirp frequency rises near live void-nodes in the Silence Zone.
function cmdDrone(state: GameState): CommandResult {
  const map = state.currentMap;
  const lines: string[] = [t('terminal.drone.status')];

  // Świerszcz stayed on Moon 1 — out of range aboard the ship and on Moons 2 & 3.
  if (map.startsWith('m0') || map.startsWith('m2') || map.startsWith('m3')) {
    lines.push(t('terminal.drone.moodRange'));
  } else if (map === 'm1-echo-depths') {
    lines.push(
      state.flags.includes(FLAGS.M1_SILENCE_DONE) ? t('terminal.drone.moodCalm') : t('terminal.drone.moodNervous')
    );
  } else {
    lines.push(t('terminal.drone.moodSteady'));
  }

  return statusBlock(t('terminal.drone.header'), lines);
}

// Sopel (S-0PL) — the recovered service robot, companion from Moon 2's Deadlock.
// Reports his task-queue state: the old dead loop before the junction is cleared,
// a measured cadence after, and the factory-rebuild schedule once planning is online.
function cmdSopel(state: GameState): CommandResult {
  const map = state.currentMap;
  const lines: string[] = [t('terminal.sopel.status')];

  if (!map.startsWith('m2')) {
    lines.push(t('terminal.sopel.moodRange'));
  } else if (state.flags.includes(FLAGS.M2_PLANNING_ONLINE)) {
    lines.push(t('terminal.sopel.moodRebuild'));
  } else if (map === 'm2-staging-yard' && !state.flags.includes(FLAGS.M2_DEADLOCK_CLEARED)) {
    lines.push(t('terminal.sopel.moodLoop'));
  } else {
    lines.push(t('terminal.sopel.moodMeasured'));
  }

  return statusBlock(t('terminal.sopel.header'), lines);
}

// Iskra (I-5KRA) — the hypochondriac rover, companion from Moon 3's Boneyard. Her
// fault list is never empty (that's the joke, and the doctrine): nervous while the
// range still lies, measured once the honest red light is up, and a verifier's
// tally once she recertifies the station. Out of range off Moon 3.
function cmdIskra(state: GameState): CommandResult {
  const map = state.currentMap;
  const has = (flag: GameFlag) => state.flags.includes(flag);
  const lines: string[] = [t('terminal.iskra.status')];

  if (!map.startsWith('m3')) {
    lines.push(t('terminal.iskra.moodRange'));
  } else if (has(FLAGS.M3_STATION_RECERTIFIED)) {
    lines.push(t('terminal.iskra.moodVerifier'));
  } else if (has(FLAGS.M3_RED_LIGHT_ONLINE)) {
    lines.push(t('terminal.iskra.moodMeasured'));
  } else {
    lines.push(t('terminal.iskra.moodNervous'));
  }

  return statusBlock(t('terminal.iskra.header'), lines);
}

// CORE AI's honest diagnostics — sister of /scan (what I see) and /plan (what
// next): what actually works and what doesn't, red/amber/green with no green
// taken on faith. One block per map, plus the obelisk harmonic once the
// diagnostic core comes online on the Annealing Yard.
function cmdDiag(state: GameState): CommandResult {
  const map = state.currentMap;
  const has = (flag: GameFlag) => state.flags.includes(flag);
  let lines: string[];

  switch (map) {
    case 'm3-apron':
      lines = [t('terminal.diag.apron')];
      break;
    case 'm3-boneyard':
      lines = [t('terminal.diag.boneyard')];
      break;
    case 'm3-fire-trial':
      lines = [t('terminal.diag.trial')];
      break;
    case 'm3-annealing-yard':
      lines = [t('terminal.diag.yard')];
      // Once the diagnostic core runs, /diag reads the obelisk under the spur —
      // deep harmonic structure agreeing with the Moon 1 orb and Moon 2 ring.
      if (has(FLAGS.M3_DIAGNOSTICS_ONLINE)) lines.push(t('terminal.diag.obelisk'));
      break;
    case 'm3-assay-office':
      lines = [t('terminal.diag.assay')];
      break;
    default:
      if (map.startsWith('m2')) lines = [t('terminal.diag.m2')];
      else if (map.startsWith('m1')) lines = [t('terminal.diag.m1')];
      else if (map.startsWith('m0')) lines = [t('terminal.diag.m0')];
      else lines = [t('terminal.diag.generic')];
  }

  return statusBlock(t('terminal.diag.header'), lines);
}

// Echo (E-CH0) — the courier-archivist woken in the Courier Yard, companion from
// the Erased Index on. A memory that was kept and skipped: he asks "where to?"
// before every move (the doctrine — you ask memory, you don't clone it). Out of
// range off Moon 4. One remembered route or fact per stage; archivist once memory
// comes online.
function cmdEcho(state: GameState): CommandResult {
  const map = state.currentMap;
  const has = (flag: GameFlag) => state.flags.includes(flag);
  const lines: string[] = [t('terminal.echo.status')];

  if (!map.startsWith('m4')) {
    lines.push(t('terminal.echo.moodRange'));
  } else if (has(FLAGS.M4_MEMORY_ONLINE)) {
    lines.push(t('terminal.echo.moodArchivist'));
  } else if (map === 'm4-memory-vault') {
    lines.push(t('terminal.echo.moodVault'));
  } else if (map === 'm4-map-vault') {
    lines.push(t('terminal.echo.moodMap'));
  } else if (map === 'm4-erased-index') {
    lines.push(t('terminal.echo.moodIndex'));
  } else {
    lines.push(t('terminal.echo.moodWoke'));
  }

  return statusBlock(t('terminal.echo.header'), lines);
}

// CORE AI's restored long-term memory — sister of /scan (what I see), /plan (what
// next) and /diag (what's true): what the mission remembers about this map, plus
// Odyssey-A archive cross-references. One block per Moon 4 map; on the Erased Index
// the return-trip /recall also catches the sealed Lower Reading Room.
function cmdRecall(state: GameState): CommandResult {
  const map = state.currentMap;
  const has = (flag: GameFlag) => state.flags.includes(flag);
  let lines: string[];

  switch (map) {
    case 'm4-caravanserai':
      lines = [t('terminal.recall.caravanserai')];
      break;
    case 'm4-courier-yard':
      lines = [t('terminal.recall.courier')];
      break;
    case 'm4-erased-index':
      lines = [t('terminal.recall.index')];
      // On the walk back, with memory online, /recall surfaces the Lower Reading
      // Room — a chamber in no entry, harmonics agreeing with the earlier moons.
      if (has(FLAGS.M4_MEMORY_ONLINE)) lines.push(t('terminal.recall.lowerRoom'));
      break;
    case 'm4-map-vault':
      lines = [t('terminal.recall.vault')];
      break;
    case 'm4-memory-vault':
      lines = [t('terminal.recall.memory')];
      break;
    default:
      lines = [t('terminal.recall.generic')];
  }

  return statusBlock(t('terminal.recall.header'), lines);
}

function cmdCrew(state: GameState): CommandResult {
  const has = (flag: GameFlag) => state.flags.includes(flag);
  // Moon 2: Kern is on the ground at the guardhouse, Moreau on orbit comms.
  // Moon 3: the watch swaps back — Moreau anchors the apron camp on the ground,
  // Kern takes comms / medical watch in orbit at Harris's pod.
  const onMoon3 = has(FLAGS.M3_APRON_INTRO_SEEN);
  const onMoon2 = has(FLAGS.M2_GATE_INTRO_SEEN);

  const moreauLine = onMoon3
    ? t('terminal.crew.moreauApron')
    : onMoon2
    ? t('terminal.crew.moreauOrbit')
    : t('terminal.crew.moreau');
  const kernLine = onMoon3
    ? t('terminal.crew.kernOrbitWatch')
    : onMoon2
    ? t('terminal.crew.kernGuardhouse')
    : t('terminal.crew.kern');

  const lines = [
    t('terminal.crew.dexo'),
    moreauLine,
    t('terminal.crew.harris'),
    kernLine,
    t('terminal.crew.remaining'),
  ];

  // Once CORE AI's senses return, the missed comms check with Harris surfaces.
  if (has(FLAGS.M1_SENSORS_ONLINE)) {
    lines.push('', t('terminal.crew.harrisWarning'));
  }

  // Moon 2: the medical schedule keeps slipping his wake-up — no one ordered it.
  if (has(FLAGS.M2_HARRIS_DELAY_LOGGED)) {
    lines.push('', t('terminal.crew.harrisDelay'));
  }

  // Moon 3: honest diagnostics name why the wake-up kept slipping — his wake
  // circuit carries an armed Entropy trap coupled to his vitals.
  if (has(FLAGS.M3_WAKE_TRAP_DIAGNOSED)) {
    lines.push('', t('terminal.crew.harrisTrap'));
  }

  return statusBlock(t('terminal.crew.header'), lines);
}

// Intel accumulates as the astronaut recovers the moon's anomalies — each line
// gated on the flag that first uncovered it.
function cmdIntel(state: GameState): CommandResult {
  const has = (flag: GameFlag) => state.flags.includes(flag);
  const lines: string[] = [];

  if (has(FLAGS.M1_OLD_BURNS_FOUND)) lines.push(t('terminal.intel.burns'));
  if (has(FLAGS.M1_SWIERSZCZ_ONLINE)) lines.push(t('terminal.intel.receiver'));
  if (has(FLAGS.M1_ENTROPY_NAMED)) lines.push(t('terminal.intel.entropy'));
  if (has(FLAGS.M1_FIRST_ORE)) lines.push(t('terminal.intel.samples'));
  if (has(FLAGS.M1_HQ_ECHO_LOGGED)) lines.push(t('terminal.intel.hqEcho'));

  // Moon 2 — the sabotage stops being an incident and becomes a method.
  if (has(FLAGS.M2_BLACKBOX_DOCKING_SEEN)) lines.push(t('terminal.intel.docking'));
  if (has(FLAGS.M2_ENDLESS_TASK_FOUND)) lines.push(t('terminal.intel.endlessTask'));
  if (has(FLAGS.M2_ENTROPY_PROFILED)) lines.push(t('terminal.intel.entropyProfiled'));
  if (has(FLAGS.M2_KERN_REVISION_NOTED)) lines.push(t('terminal.intel.kernRevision'));
  if (has(FLAGS.M2_SABOTAGE_TIMESTAMPED)) lines.push(t('terminal.intel.sabotageStamp'));
  if (has(FLAGS.M2_PURSUIT_ON_MAP)) lines.push(t('terminal.intel.pursuit'));
  if (has(FLAGS.M2_CHECKSUM_MISMATCH_SEEN)) lines.push(t('terminal.intel.checksum'));

  // Moon 3 — the lie hides in the checking itself, and the channel gains an editor.
  if (has(FLAGS.M3_VOID_READ_SESSION_SEEN)) lines.push(t('terminal.intel.voidRead'));
  if (has(FLAGS.M3_DOCTRINE_AUTHOR_FOUND)) lines.push(t('terminal.intel.doctrineAuthor'));
  if (has(FLAGS.M3_ENTROPY_UNMASKED)) lines.push(t('terminal.intel.entropyUnmasked'));
  if (has(FLAGS.M3_DEAD_DISH_RELAY_SEEN)) lines.push(t('terminal.intel.deadDish'));
  if (has(FLAGS.M3_KERN_DECIMALS_NOTED)) lines.push(t('terminal.intel.kernDecimals'));
  if (has(FLAGS.M3_CANARY_EDITED_SEEN)) lines.push(t('terminal.intel.canary'));
  if (has(FLAGS.M3_WAKE_TRAP_DIAGNOSED)) lines.push(t('terminal.intel.wakeTrap'));
  if (has(FLAGS.M3_REVISION_ORDER_FOUND)) lines.push(t('terminal.intel.revisionOrder'));
  if (has(FLAGS.M3_PURSUIT_SPLIT_SEEN)) lines.push(t('terminal.intel.pursuitSplit'));

  if (lines.length === 0) lines.push(t('terminal.intel.empty'));

  return statusBlock(t('terminal.intel.header'), lines);
}

function cmdUplink(state: GameState): CommandResult {
  const has = (flag: GameFlag) => state.flags.includes(flag);
  // Moon 3's edited canary is the sharpest integrity reading — someone in the
  // channel doesn't just read, they correct. It supersedes Moon 2's one-block
  // checksum mismatch, which itself supersedes the Moon 1 double-ack echo.
  const integrity = has(FLAGS.M3_CANARY_EDITED_SEEN)
    ? t('terminal.uplink.canary')
    : has(FLAGS.M2_CHECKSUM_MISMATCH_SEEN)
    ? t('terminal.uplink.checksum')
    : has(FLAGS.M1_HQ_ECHO_LOGGED)
    ? t('terminal.uplink.echo')
    : t('terminal.uplink.nominal');

  const lines = [t('terminal.uplink.primary'), t('terminal.uplink.hq', { integrity })];

  // The edited channel forces a second, private line into being.
  if (has(FLAGS.M3_CANARY_EDITED_SEEN)) lines.push(t('terminal.uplink.sideChannel'));

  return statusBlock(t('terminal.uplink.header'), lines);
}

function cmdSensors(state: GameState): CommandResult {
  const sensorStatus = state.flags.includes(FLAGS.M1_SENSORS_ONLINE)
    ? t('terminal.sensors.online')
    : t('terminal.sensors.offline');
  const planningRestored = state.flags.includes(FLAGS.M2_PLANNING_ONLINE);
  const planningStatus = planningRestored
    ? t('terminal.sensors.planningOnline')
    : t('terminal.sensors.planningOffline');
  const diagnosticsOnline = state.flags.includes(FLAGS.M3_DIAGNOSTICS_ONLINE);
  const diagnosticsStatus = diagnosticsOnline
    ? t('terminal.sensors.diagnosticsOnline')
    : t('terminal.sensors.diagnosticsOffline');

  const teaser = diagnosticsOnline
    ? t('terminal.sensors.nextM4')
    : planningRestored
    ? t('terminal.sensors.nextM3')
    : t('terminal.sensors.next');

  return statusBlock(t('terminal.sensors.header'), [
    t('terminal.sensors.basic', { status: sensorStatus }),
    t('terminal.sensors.planning', { status: planningStatus }),
    t('terminal.sensors.diagnostics', { status: diagnosticsStatus }),
    teaser,
  ]);
}

// CORE AI's ordered-next-steps surface — unlocked once planning comes online on
// Moon 2. The sister of /scan: /scan reads the place, /plan ranks what to do next.
// One block per map family (m2 / m1 / m0) plus a generic fallback.
function cmdPlan(state: GameState): CommandResult {
  const map = state.currentMap;
  const lines: string[] = [t('terminal.plan.intro'), ''];

  if (map.startsWith('m3')) {
    lines.push(t('terminal.plan.m3a'), t('terminal.plan.m3b'), t('terminal.plan.m3c'));
  } else if (map.startsWith('m2')) {
    lines.push(t('terminal.plan.m2a'), t('terminal.plan.m2b'), t('terminal.plan.m2c'));
  } else if (map.startsWith('m1')) {
    lines.push(t('terminal.plan.m1a'), t('terminal.plan.m1b'));
  } else if (map.startsWith('m0')) {
    lines.push(t('terminal.plan.m0a'), t('terminal.plan.m0b'));
  } else {
    lines.push(t('terminal.plan.generic'));
  }

  return statusBlock(t('terminal.plan.header'), lines);
}

function cmdHelp(state: GameState): CommandResult {
  const available = getAvailableCommands(state.flags);
  const lines: string[] = [t('terminal.helpHeader'), '═════════════════════════════', ''];

  for (const cmd of available) {
    lines.push(`  /${cmd.name.padEnd(12)} ${t(cmd.descriptionKey)}`);
  }

  lines.push('', `  /help${' '.repeat(9)}${t('terminal.helpHelpEntry')}`);

  return { output: lines };
}

function cmdMe(state: GameState): CommandResult {
  const { rank, nextRank } = getRankForXP(state.xp);
  const progress = getRankProgress(state.xp);

  const BAR_WIDTH = 20;
  const barPercent = progress.displayMax !== null ? Math.min((state.xp / progress.displayMax) * 100, 100) : 100;
  const filled = Math.round((barPercent / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  const xpDisplay =
    progress.displayMax !== null
      ? t('terminal.me.xpProgress', { xp: state.xp, max: progress.displayMax })
      : t('terminal.me.xpMax', { xp: state.xp });

  const output: string[] = [
    t('terminal.me.header'),
    '═════════════════════════════',
    '',
    `  ${t('terminal.me.rankLabel')}  ${rank.name}`,
    `  ${t('terminal.me.tierLabel')} ${rank.tier}`,
    `  ${t('terminal.me.xpLabel')}     ${xpDisplay}`,
    `  ${bar} ${Math.round(barPercent)}%`,
    '',
  ];

  // The cargo ladder — ore on Moon 1, ingots on Moon 2, certificates on Moon 3.
  if (
    state.flags.includes(FLAGS.M1_FIRST_ORE) ||
    state.flags.includes(FLAGS.M2_FIRST_INGOT) ||
    state.flags.includes(FLAGS.M3_FIRST_CERT)
  ) {
    if (state.flags.includes(FLAGS.M1_FIRST_ORE)) output.push(t('terminal.me.cargo'));
    if (state.flags.includes(FLAGS.M2_FIRST_INGOT)) output.push(t('terminal.me.cargoIngots'));
    if (state.flags.includes(FLAGS.M3_FIRST_CERT)) output.push(t('terminal.me.cargoCerts'));
    output.push('');
  }

  // Progression toward remaining ranks
  const remainingRanks = RANKS.filter((r) => r.tier > rank.tier);

  if (remainingRanks.length > 0) {
    output.push(t('terminal.me.upcomingHeader'));
    output.push('─────────────────────────────');
    for (const r of remainingRanks) {
      const xpNeeded = r.minXP - state.xp;
      const marker = r.tier === (nextRank?.tier ?? -1) ? '►' : ' ';
      const status = xpNeeded > 0 ? t('terminal.me.missing', { xp: xpNeeded }) : t('terminal.me.unlocked');
      output.push(`  ${marker} Lv.${r.tier} ${r.name.padEnd(20)} ${status}`);
    }
  } else {
    output.push(t('terminal.me.maxRank'));
  }

  return { output };
}

function cmdTime(): CommandResult {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const isDay = now.getHours() >= 6 && now.getHours() < 22;
  return {
    output: [
      t('terminal.time.header'),
      '═══════════════════════════',
      '',
      `    ██  ${h} : ${m} : ${s}  ██`,
      '',
      t('terminal.time.dateLine', { month, day }),
      t('terminal.time.cycleLine', {
        cycle: isDay ? t('terminal.time.cycleDay') : t('terminal.time.cycleNight'),
      }),
      t('terminal.time.zoneLine'),
      '',
      '═══════════════════════════',
    ],
  };
}

function cmdQuest(state: GameState, questManager?: QuestManager): CommandResult {
  if (!state.quests.active) {
    return { output: [t('terminal.quest.noActive')] };
  }

  const quest = questManager?.getActiveQuest();
  if (!quest) {
    return { output: [t('terminal.quest.noData', { id: state.quests.active })] };
  }

  if (quest.completionType === 'event') {
    return cmdQuestEvent(quest, questManager!);
  }

  if (quest.completionType === 'api-answer') {
    return {
      output: [
        t('terminal.quest.titleLine', { title: localized(quest.title) }),
        '─────────────────────────────',
        localized(quest.briefing),
        '',
        t('terminal.quest.supportHint'),
      ],
    };
  }

  // Text-answer quest (existing behavior)
  const hintsLeft = questManager?.getRemainingHints() ?? 0;
  return {
    output: [
      t('terminal.quest.titleLine', { title: localized(quest.title) }),
      '─────────────────────────────',
      localized(quest.briefing),
      '',
      t('terminal.quest.inputs'),
      quest.inputPayload,
      '',
      t('terminal.quest.hintsAvailable', { count: hintsLeft }),
      t('terminal.quest.solveHint'),
      t('terminal.quest.hintHint'),
    ],
  };
}

function cmdQuestEvent(quest: EventQuest, questManager: QuestManager): CommandResult {
  const progress = questManager.getObjectiveProgress(quest.id);
  if (!progress) return { output: [t('terminal.quest.dataError')] };

  const doneCount = progress.filter((p) => p.done).length;
  const totalCount = progress.length;

  const objectiveLines = progress.map((p, i) => `  ${i + 1}. ${p.done ? '✓' : '☐'} ${localized(p.objective.label)}`);

  const hintsLeft = questManager.getRemainingHints();

  const output = [
    t('terminal.quest.titleLine', { title: localized(quest.title) }),
    '─────────────────────────────',
    localized(quest.briefing),
    '',
    t('terminal.quest.objectivesHeader', { total: totalCount }),
    ...objectiveLines,
    '',
    t('terminal.quest.progress', { done: doneCount, total: totalCount }),
  ];

  if (hintsLeft > 0) {
    output.push('', t('terminal.quest.hintsAvailable', { count: hintsLeft }), t('terminal.quest.hintHint'));
  }

  return { output };
}

function cmdSolve(args: string[], state: GameState, questManager?: QuestManager): CommandResult {
  if (!state.quests.active) {
    return { output: [t('terminal.quest.noActive')] };
  }

  // Check if active quest is event-based or api-answer
  const quest = questManager?.getActiveQuest();
  if (quest?.completionType === 'event') {
    return { output: [t('terminal.solve.eventOnly')] };
  }
  if (quest?.completionType === 'api-answer') {
    return { output: [t('terminal.solve.apiOnly')] };
  }

  if (args.length === 0) {
    return { output: [t('terminal.solve.usage')] };
  }

  if (!questManager) {
    return { output: [t('terminal.solve.systemError')] };
  }

  const answer = args.join(' ');
  const correct = questManager.submitAnswer(answer);

  if (correct) {
    return { output: [t('terminal.solve.correct')] };
  }

  return {
    output: [t('terminal.solve.incorrect')],
  };
}

function cmdHint(state: GameState, questManager?: QuestManager): CommandResult {
  if (!state.quests.active) {
    return { output: [t('terminal.hint.noActive')] };
  }

  if (!questManager) {
    return { output: [t('terminal.solve.systemError')] };
  }

  const hint = questManager.getHint();
  if (!hint) {
    return { output: [t('terminal.hint.noMore')] };
  }

  return { output: [t('terminal.hint.line', { hint })] };
}

function cmdBookmarks(state: GameState): CommandResult {
  const bookmarks = getBookmarks(state);

  if (bookmarks.length === 0) {
    return { output: [t('terminal.bookmarks.empty')] };
  }

  const output: string[] = [t('terminal.bookmarks.header'), '═════════════════════════════', ''];

  const interactive: InteractiveItem[] = bookmarks.map((b, i) => ({
    label: `  ${i + 1}. ${b.title}`,
    action: { type: 'preview' as const, url: b.url, title: b.title },
  }));

  return { output, interactive };
}

function isFutureDate(targetDate: string): boolean {
  return new Date(targetDate + 'T00:00:00').getTime() > Date.now();
}

function formatCountdown(targetDate: string): string {
  const now = new Date();
  const target = new Date(targetDate + 'T00:00:00');
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return t('terminal.navi.now');

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (days > 0)
    return `${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Mission map \u2014 driven by the same registry as the ship navigation deck,
// so /navi statuses always match what the deck lets the player launch.
function cmdNavi(state: GameState): CommandResult {
  const output: string[] = [
    t('terminal.navi.header'),
    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
    '',
  ];

  const hasFlag = (flag: GameFlag) => state.flags.includes(flag);
  const anyMoonAvailable = NAV_DESTINATIONS.some((dest) => getDestinationStatus(dest, hasFlag) === 'available');

  // Stage 0 \u2014 the ship itself; active until the first moon opens up
  output.push(` ${anyMoonAvailable ? '\u25CB' : '\u25C9'} 0. Awakening Procedures`);
  if (!anyMoonAvailable) output.push(t('terminal.navi.inProgress'));

  for (let i = 0; i < NAV_DESTINATIONS.length; i++) {
    const dest = NAV_DESTINATIONS[i];
    const status = getDestinationStatus(dest, hasFlag);
    const marker = status === 'available' ? '\u25C9' : '\u25CB';
    output.push(` ${marker} ${i + 1}. ${localized(dest.name)} (${dest.codename})`);
    if (status === 'available') {
      output.push(t('terminal.navi.ready'));
    } else if (status === 'locked') {
      output.push(t('terminal.navi.locked'));
    } else if (dest.eta && isFutureDate(dest.eta)) {
      output.push(t('terminal.navi.eta', { countdown: formatCountdown(dest.eta) }));
    } else {
      output.push(t('terminal.navi.noSignal'));
    }
  }

  return { output, liveUpdate: { intervalMs: 1000 } };
}

function cmdBadges(state: GameState): CommandResult {
  const { rank } = getRankForXP(state.xp);
  const url = `/explorers/badges/rank?tier=${rank.tier}`;

  return {
    output: [
      t('terminal.badges.header'),
      '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
      '',
    ],
    interactive: [
      {
        label: t('terminal.badges.openLabel', { rank: rank.name }),
        action: { type: 'preview' as const, url, title: t('terminal.badges.previewTitle') },
      },
    ],
  };
}

function cmdSupport(state: GameState): CommandResult {
  // Before uplink calibration — connection fails
  if (!state.flags.includes(FLAGS.M0_SUPPORT_CALIBRATED)) {
    return {
      output: [
        t('terminal.support.header'),
        '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
        '',
        t('terminal.support.connecting'),
        '',
        t('terminal.support.errorUplink'),
        t('terminal.support.checkInstructions'),
      ],
    };
  }

  // After calibration — connection works, show GitHub URL
  // Token display is handled asynchronously in SmartTerminal via /api/game/token
  return {
    output: [
      t('terminal.support.activeHeader'),
      '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
      '',
      t('terminal.support.centerLabel'),
      t('terminal.support.centerUrl'),
    ],
    triggerDialogue: 'm0-support-github-reaction',
  };
}
