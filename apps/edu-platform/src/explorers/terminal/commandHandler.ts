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
      return cmdScan();
    case 'policy':
      return cmdPolicy();
    case 'crew':
      return cmdCrew(state);
    case 'intel':
      return cmdIntel();
    case 'uplink':
      return cmdUplink(state);
    case 'sensors':
      return cmdSensors(state);
    case 'plan':
      return cmdPlan(state);
    case 'planner':
      return cmdPlanner(state);
    default:
      return { output: [t('terminal.unknownCommandWithName', { cmd })] };
  }
}

function statusBlock(header: string, lines: string[]): CommandResult {
  return { output: [header, '═════════════════════════════', '', ...lines] };
}

function cmdScan(): CommandResult {
  return statusBlock(t('terminal.scan.header'), [
    t('terminal.scan.alpha'),
    t('terminal.scan.beta'),
    t('terminal.scan.gamma'),
  ]);
}

function cmdPolicy(): CommandResult {
  return statusBlock(t('terminal.policy.header'), [
    t('terminal.policy.precheck'),
    t('terminal.policy.generalization'),
    t('terminal.policy.surface'),
    t('terminal.policy.beacon'),
  ]);
}

function cmdCrew(state: GameState): CommandResult {
  const moreauStatus = state.flags.includes(FLAGS.M1_MOREAU_AWAKE)
    ? t('terminal.crew.awake')
    : t('terminal.crew.asleep');
  const harrisStatus = state.flags.includes(FLAGS.M1_HARRIS_RECALL_DISCOVERED)
    ? t('terminal.crew.quarantined')
    : t('terminal.crew.asleep');

  return statusBlock(t('terminal.crew.header'), [
    t('terminal.crew.dexo'),
    t('terminal.crew.moreau', { status: moreauStatus }),
    t('terminal.crew.harris', { status: harrisStatus }),
    t('terminal.crew.remaining'),
  ]);
}

function cmdIntel(): CommandResult {
  return statusBlock(t('terminal.intel.header'), [
    t('terminal.intel.prd'),
    t('terminal.intel.echo'),
    t('terminal.intel.policy'),
    t('terminal.intel.signatures'),
    t('terminal.intel.hq'),
  ]);
}

function cmdUplink(state: GameState): CommandResult {
  const integrity = state.flags.includes(FLAGS.M1_HQ_CHANNEL_SUSPECT)
    ? t('terminal.uplink.suspect')
    : t('terminal.uplink.unknown');

  return statusBlock(t('terminal.uplink.header'), [
    t('terminal.uplink.primary'),
    t('terminal.uplink.reserve'),
    t('terminal.uplink.hq', { integrity }),
  ]);
}

function cmdSensors(state: GameState): CommandResult {
  const sensorStatus = state.flags.includes(FLAGS.M1_BASIC_SENSORS_RESTORED)
    ? t('terminal.sensors.online')
    : t('terminal.sensors.offline');
  const planningRestored = state.flags.includes(FLAGS.M2_PLANNING_MODULE_RESTORED);
  const planningStatus = planningRestored
    ? t('terminal.sensors.planningOnline')
    : t('terminal.sensors.planningOffline');

  return statusBlock(t('terminal.sensors.header'), [
    t('terminal.sensors.basic', { status: sensorStatus }),
    t('terminal.sensors.planning', { status: planningStatus }),
    planningRestored ? t('terminal.sensors.nextM3') : t('terminal.sensors.next'),
  ]);
}

// The extraction plan artifact — grows with the module, section by section
function cmdPlan(state: GameState): CommandResult {
  const has = (flag: GameFlag) => state.flags.includes(flag);
  const lines: string[] = [t('terminal.plan.contract')];

  if (has(FLAGS.M2_MILESTONES_DONE)) lines.push(t('terminal.plan.milestones'));
  if (has(FLAGS.M2_ARCHITECTURE_DONE)) lines.push(t('terminal.plan.architecture'));
  if (has(FLAGS.M2_IMPL_CONTROL_DONE)) lines.push(t('terminal.plan.execution'));

  if (has(FLAGS.M2_SOLO_REVIEW_DONE)) {
    lines.push(t('terminal.plan.review'), '', t('terminal.plan.approved'));
  } else {
    lines.push('', t('terminal.plan.inPreparation'));
  }

  return statusBlock(t('terminal.plan.header'), lines);
}

function cmdPlanner(state: GameState): CommandResult {
  const moduleStatus = state.flags.includes(FLAGS.M2_PLANNING_MODULE_RESTORED)
    ? t('terminal.planner.online')
    : t('terminal.planner.offline');

  return statusBlock(t('terminal.planner.header'), [
    t('terminal.planner.module', { status: moduleStatus }),
    t('terminal.planner.activePlan'),
    t('terminal.planner.next'),
  ]);
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
  const barPercent =
    progress.displayMax !== null ? Math.min((state.xp / progress.displayMax) * 100, 100) : 100;
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

  // Progression toward remaining ranks
  const remainingRanks = RANKS.filter((r) => r.tier > rank.tier);

  if (remainingRanks.length > 0) {
    output.push(t('terminal.me.upcomingHeader'));
    output.push('─────────────────────────────');
    for (const r of remainingRanks) {
      const xpNeeded = r.minXP - state.xp;
      const marker = r.tier === (nextRank?.tier ?? -1) ? '►' : ' ';
      const status =
        xpNeeded > 0
          ? t('terminal.me.missing', { xp: xpNeeded })
          : t('terminal.me.unlocked');
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

  const objectiveLines = progress.map(
    (p, i) => `  ${i + 1}. ${p.done ? '✓' : '☐'} ${localized(p.objective.label)}`
  );

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
    output.push(
      '',
      t('terminal.quest.hintsAvailable', { count: hintsLeft }),
      t('terminal.quest.hintHint')
    );
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
  const anyMoonAvailable = NAV_DESTINATIONS.some(
    (dest) => getDestinationStatus(dest, hasFlag) === 'available'
  );

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
    output: [t('terminal.badges.header'), '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550', ''],
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
