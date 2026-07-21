import { FLAGS } from '../config/flags';
import type { GameFlag } from '../config/flags';
import type { StringKey } from '../i18n';

export interface CommandEntry {
  name: string;
  descriptionKey: StringKey;
  requiredFlag?: GameFlag;
}

export const COMMAND_REGISTRY: CommandEntry[] = [
  { name: 'me', descriptionKey: 'terminal.cmd.me' },
  { name: 'time', descriptionKey: 'terminal.cmd.time' },
  { name: 'bookmarks', descriptionKey: 'terminal.cmd.bookmarks', requiredFlag: FLAGS.CMDS_BOOKMARKS },
  { name: 'quest', descriptionKey: 'terminal.cmd.quest', requiredFlag: FLAGS.CMDS_QUEST },
  { name: 'solve', descriptionKey: 'terminal.cmd.solve', requiredFlag: FLAGS.CMDS_QUEST },
  { name: 'hint', descriptionKey: 'terminal.cmd.hint', requiredFlag: FLAGS.CMDS_QUEST },
  { name: 'navi', descriptionKey: 'terminal.cmd.navi', requiredFlag: FLAGS.CMDS_NAVI },
  { name: 'support', descriptionKey: 'terminal.cmd.support', requiredFlag: FLAGS.CMDS_SUPPORT },
  { name: 'badges', descriptionKey: 'terminal.cmd.badges', requiredFlag: FLAGS.CMDS_BADGES },
  { name: 'scan', descriptionKey: 'terminal.cmd.scan', requiredFlag: FLAGS.CMDS_SCAN },
  { name: 'policy', descriptionKey: 'terminal.cmd.policy', requiredFlag: FLAGS.CMDS_POLICY },
  { name: 'crew', descriptionKey: 'terminal.cmd.crew', requiredFlag: FLAGS.CMDS_CREW },
  { name: 'intel', descriptionKey: 'terminal.cmd.intel', requiredFlag: FLAGS.CMDS_INTEL },
  { name: 'uplink', descriptionKey: 'terminal.cmd.uplink', requiredFlag: FLAGS.CMDS_UPLINK },
  { name: 'sensors', descriptionKey: 'terminal.cmd.sensors', requiredFlag: FLAGS.CMDS_SENSORS },
  { name: 'plan', descriptionKey: 'terminal.cmd.plan', requiredFlag: FLAGS.CMDS_PLAN },
  { name: 'planner', descriptionKey: 'terminal.cmd.planner', requiredFlag: FLAGS.CMDS_PLANNER },
];

export function getAvailableCommands(flags: GameFlag[]): CommandEntry[] {
  return COMMAND_REGISTRY.filter((cmd) => !cmd.requiredFlag || flags.includes(cmd.requiredFlag));
}

export function isCommandAvailable(name: string, flags: GameFlag[]): boolean {
  const entry = COMMAND_REGISTRY.find((cmd) => cmd.name === name);
  if (!entry) return false;
  return !entry.requiredFlag || flags.includes(entry.requiredFlag);
}
