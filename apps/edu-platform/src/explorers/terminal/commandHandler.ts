import type { GameState } from '../state/types';
import type { QuestManager, EventQuest } from '../systems/QuestManager';
import { getRankForXP, getRankProgress, RANKS } from '../config/ranks';
import { localized } from '../i18n/types';
import { t } from '../i18n';
import { isCommandAvailable, getAvailableCommands } from './commandRegistry';
import { getBookmarks } from '../systems/BookmarkManager';
import { FLAGS } from '../config/flags';

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
      return cmdNavi();
    case 'support':
      return cmdSupport(state);
    case 'badges':
      return cmdBadges(state);
    default:
      return { output: [t('terminal.unknownCommandWithName', { cmd })] };
  }
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

interface MissionEntry {
  name: string;
  date?: string;
  status?: 'active';
}

const MISSION_SCHEDULE: MissionEntry[] = [
  { name: 'Awakening Procedures', status: 'active' },
  { name: 'Agentic Asteroid', date: '2026-05-22' },
  { name: 'Wormhole Workflows', date: '2026-05-29' },
  { name: 'Quality Quasar', date: '2026-06-05' },
  { name: 'Megalithic Monolith', date: '2026-06-12' },
  { name: 'Teamwork Teleport', date: '2026-06-19' },
];

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

function cmdNavi(): CommandResult {
  const output: string[] = [
    t('terminal.navi.header'),
    '\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550',
    '',
  ];

  for (let i = 0; i < MISSION_SCHEDULE.length; i++) {
    const entry = MISSION_SCHEDULE[i];
    const marker = entry.status === 'active' ? '\u25C9' : '\u25CB';
    output.push(` ${marker} ${i + 1}. ${entry.name}`);
    if (entry.status === 'active') {
      output.push(t('terminal.navi.inProgress'));
    } else if (entry.date) {
      output.push(t('terminal.navi.eta', { countdown: formatCountdown(entry.date) }));
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
