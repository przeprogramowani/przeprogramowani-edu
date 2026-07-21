import { describe, it, expect } from 'vitest';
import { parseLevelSource } from './parseSource';

const MINIMAL = `
theme: 1
grid: |
  ~~~~
  ~##~
`;

describe('parseLevelSource', () => {
  it('parses theme, grid, and defaults', () => {
    const source = parseLevelSource(MINIMAL, 'test');
    expect(source.theme).toBe(1);
    expect(source.cells).toEqual([
      ['OUT', 'OUT', 'OUT', 'OUT'],
      ['OUT', 'WALL', 'WALL', 'OUT'],
    ]);
    expect(source.props).toEqual([]);
    expect(source.zones).toEqual([]);
  });

  it('parses D as an explicit doorway wall cell', () => {
    const source = parseLevelSource('theme: 1\ngrid: |\n  ~~~~\n  ~#.D\n', 'test');
    expect(source.cells[1]).toEqual(['OUT', 'WALL', 'FLOOR', 'DOOR']);
  });

  it('parses props with slot numbers and defaults solid to true', () => {
    const source = parseLevelSource(
      `${MINIMAL}props:\n  - { slot: 3, at: [1, 1] }\n  - { slot: 5, at: [2, 1], solid: false }\n`,
      'test',
    );
    expect(source.props).toEqual([
      { slot: 3, at: [1, 1], solid: true },
      { slot: 5, at: [2, 1], solid: false },
    ]);
  });

  it('resolves theme-1 prop aliases to slots', () => {
    const source = parseLevelSource(
      `${MINIMAL}props:\n  - { prop: hibernation-chamber, at: [1, 1], solid: true }\n`,
      'test',
    );
    expect(source.props[0].slot).toBe(2);
  });

  it('rejects unknown prop aliases', () => {
    expect(() =>
      parseLevelSource(`${MINIMAL}props:\n  - { prop: warp-drive, at: [1, 1] }\n`, 'test'),
    ).toThrow(/unknown prop alias "warp-drive"/);
  });

  it('parses zones with defaults and properties', () => {
    const source = parseLevelSource(
      `${MINIMAL}zones:
  - id: pod
    name: Hibernation Pod
    type: trigger
    at: [1, 1]
    size: [2, 1]
  - id: door-out
    type: door
    at: [2, 1]
    properties: { targetMap: other-map, spawnX: 3, spawnY: 4 }
`,
      'test',
    );
    expect(source.zones[0]).toEqual({
      id: 'pod',
      name: 'Hibernation Pod',
      type: 'trigger',
      at: [1, 1],
      size: [2, 1],
      properties: {},
    });
    expect(source.zones[1]).toEqual({
      id: 'door-out',
      type: 'door',
      at: [2, 1],
      size: [1, 1],
      properties: { targetMap: 'other-map', spawnX: 3, spawnY: 4 },
    });
  });

  it('resolves a zone propId to the referenced prop coordinates', () => {
    const source = parseLevelSource(
      `${MINIMAL}props:
  - { id: main-console, slot: 1, at: [1, 1] }
zones:
  - { id: console-zone, type: trigger, propId: main-console }
`,
      'test',
    );

    expect(source.props[0]).toEqual({ slot: 1, at: [1, 1], solid: true });
    expect(source.zones[0].at).toEqual([1, 1]);
  });

  it('uses propId coordinates when a zone also contains at', () => {
    const source = parseLevelSource(
      `${MINIMAL}props:
  - { id: main-console, slot: 1, at: [1, 1] }
zones:
  - { id: console-zone, type: trigger, propId: main-console, at: [9, 9] }
`,
      'test',
    );

    expect(source.zones[0].at).toEqual([1, 1]);
  });

  it('rejects unknown propId references and duplicate prop ids', () => {
    expect(() =>
      parseLevelSource(
        `${MINIMAL}zones:\n  - { id: console-zone, type: trigger, propId: missing }\n`,
        'test',
      ),
    ).toThrow(/unknown propId "missing"/);

    expect(() =>
      parseLevelSource(
        `${MINIMAL}props:
  - { id: duplicate, slot: 1, at: [1, 1] }
  - { id: duplicate, slot: 2, at: [2, 1] }
`,
        'test',
      ),
    ).toThrow(/duplicate prop id "duplicate"/);
  });

  it('rejects non-rectangular grids', () => {
    expect(() => parseLevelSource('theme: 1\ngrid: |\n  ~~~\n  ~~\n', 'test')).toThrow(/not rectangular/);
  });

  it('rejects unknown grid characters', () => {
    expect(() => parseLevelSource('theme: 1\ngrid: |\n  ~X~\n', 'test')).toThrow(/Unknown grid char "X"/);
  });

  it('rejects missing theme and missing grid', () => {
    expect(() => parseLevelSource('grid: |\n  ~~\n', 'test')).toThrow(/theme/);
    expect(() => parseLevelSource('theme: 1\n', 'test')).toThrow(/grid/);
  });

  it('rejects invalid zone types and missing ids', () => {
    expect(() =>
      parseLevelSource(`${MINIMAL}zones:\n  - { id: x, type: portal, at: [1, 1] }\n`, 'test'),
    ).toThrow(/invalid type/);
    expect(() =>
      parseLevelSource(`${MINIMAL}zones:\n  - { type: trigger, at: [1, 1] }\n`, 'test'),
    ).toThrow(/missing a string "id"/);
  });

  it('rejects malformed coordinates', () => {
    expect(() =>
      parseLevelSource(`${MINIMAL}props:\n  - { slot: 1, at: [1.5, 2] }\n`, 'test'),
    ).toThrow(/pair of integers/);
  });
});
