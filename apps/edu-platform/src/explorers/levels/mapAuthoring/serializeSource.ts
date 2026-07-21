import { stringify } from 'yaml';
import { aliasForSlot } from './propAliases';
import { gridToText } from './decompile';
import type { LevelSource, PropPlacement, ZoneSource } from './types';

/** Scalar → yaml text, quoting only when yaml requires it. */
function scalar(value: string | number | boolean): string {
  return stringify(value).trimEnd();
}

function propLine(prop: PropPlacement, theme: number): string {
  const alias = aliasForSlot(theme, prop.slot);
  const head = alias ? `prop: ${scalar(alias)}` : `slot: ${prop.slot}`;
  const idPart = prop.id !== undefined ? `id: ${scalar(prop.id)}, ` : '';
  return `  - { ${idPart}${head}, at: [${prop.at[0]}, ${prop.at[1]}], solid: ${prop.solid} }`;
}

function zoneBlock(zone: ZoneSource): string {
  const lines = [`  - id: ${scalar(zone.id)}`];
  if (zone.name !== undefined) {
    lines.push(`    name: ${scalar(zone.name)}`);
  }
  lines.push(`    type: ${zone.type}`);
  if (zone.propId !== undefined) {
    // Authoring link wins over coordinates; `at` mirrors the prop and is re-resolved on parse.
    lines.push(`    propId: ${scalar(zone.propId)}`);
  } else {
    lines.push(`    at: [${zone.at[0]}, ${zone.at[1]}]`);
  }
  if (zone.size[0] !== 1 || zone.size[1] !== 1) {
    lines.push(`    size: [${zone.size[0]}, ${zone.size[1]}]`);
  }
  const entries = Object.entries(zone.properties);
  if (entries.length > 0) {
    lines.push('    properties:');
    for (const [key, value] of entries) {
      lines.push(`      ${scalar(key)}: ${scalar(value)}`);
    }
  }
  return lines.join('\n');
}

/** Serialize just the zones: block (used by the zones-only round-trip). */
export function serializeZones(zones: ZoneSource[]): string {
  if (zones.length === 0) return '';
  return `${['zones:', ...zones.map(zoneBlock)].join('\n')}\n`;
}

/** Serialize a level source to canonical map.level.yaml text. */
export function serializeSource(source: LevelSource): string {
  const parts: string[] = [
    `theme: ${source.theme}`,
    'grid: |',
    ...gridToText(source.cells)
      .split('\n')
      .map((row) => `  ${row}`),
  ];
  if (source.props.length > 0) {
    parts.push('props:');
    for (const prop of source.props) {
      parts.push(propLine(prop, source.theme));
    }
  }
  return `${parts.join('\n')}\n${serializeZones(source.zones)}`;
}
