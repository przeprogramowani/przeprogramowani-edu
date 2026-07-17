export type TerminalLine =
  | { kind: 'command'; text: string }
  | { kind: 'info'; text: string }
  | { kind: 'quest'; text: string }
  | { kind: 'success'; text: string }
  | { kind: 'separator'; text: string }
  | { kind: 'new-command'; text: string }
  | { kind: 'blank' };

export interface TerminalBlock {
  id: string;
  lines: TerminalLine[];
}

export function classifyLine(text: string): TerminalLine {
  if (text === '') return { kind: 'blank' };
  if (text.startsWith('> ')) return { kind: 'command', text };
  if (text.startsWith('◆')) return { kind: 'quest', text };
  if (text.startsWith('✓')) return { kind: 'success', text };
  if (text.startsWith('─') || text.startsWith('═')) return { kind: 'separator', text };
  if (text.startsWith('▸')) return { kind: 'new-command', text };
  return { kind: 'info', text };
}

export function stringsToLines(texts: string[]): TerminalLine[] {
  return texts.map(classifyLine);
}

export function makeBlock(lines: TerminalLine[]): TerminalBlock {
  return { id: crypto.randomUUID(), lines };
}

export function lineClass(line: TerminalLine): string {
  switch (line.kind) {
    case 'command': return 'text-teal-300 font-semibold pt-2';
    case 'quest': return 'text-amber-400';
    case 'success': return 'text-teal-400';
    case 'separator': return 'text-gray-700';
    case 'new-command': return 'text-teal-300';
    default: return 'text-gray-400';
  }
}

export function lineText(line: TerminalLine): string {
  return line.kind === 'blank' ? '' : line.text;
}
