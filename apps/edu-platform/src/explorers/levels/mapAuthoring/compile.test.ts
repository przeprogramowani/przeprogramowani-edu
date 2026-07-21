import { describe, it, expect } from 'vitest';
import { roleOf, themeOf, TileRole, tileIndex } from '../../config/tileIndices';
import { compileLevel, serializeMap } from './compile';
import { decompileLevel, gridToText } from './decompile';
import { parseLevelSource } from './parseSource';

const FIXTURE = `
theme: 1
grid: |
  ~~~~~~~~
  ~######~
  ~#....#~
  ~#....D~
  ~######~
  ~~~~~~~~
props:
  - { slot: 1, at: [2, 2], solid: true }
  - { slot: 6, at: [4, 3], solid: false }
zones:
  - id: console-zone
    name: Main Console
    type: trigger
    at: [2, 2]
    size: [2, 1]
  - id: door-out
    type: door
    at: [6, 3]
    properties: { targetMap: other-map, spawnX: 2, spawnY: 2, requiredFlags: some-flag }
`;

function fixtureMap() {
  return compileLevel(parseLevelSource(FIXTURE, 'fixture'), 'fixture');
}

describe('compileLevel', () => {
  it('emits the canonical Tiled skeleton', () => {
    const map = fixtureMap();
    expect(map.width).toBe(8);
    expect(map.height).toBe(6);
    expect(map.layers.map((layer) => layer.name)).toEqual(['Ground', 'Walls', 'Above', 'Zones']);
    expect(map.nextobjectid).toBe(3);
    expect(map.tilesets[0]).toMatchObject({
      columns: 8,
      firstgid: 1,
      imageheight: 1536,
      imagewidth: 512,
      tilecount: 192,
      name: 'placeholder',
    });
  });

  it('auto-tiles the wall ring and scatters floor/background variants', () => {
    const map = fixtureMap();
    const walls = map.layers[1].data as number[];
    const ground = map.layers[0].data as number[];
    const at = (x: number, y: number) => y * 8 + x;

    expect(roleOf(walls[at(1, 1)])).toBe(TileRole.CORNER_NW);
    expect(roleOf(walls[at(6, 1)])).toBe(TileRole.CORNER_NE);
    expect(roleOf(walls[at(1, 4)])).toBe(TileRole.CORNER_SW);
    expect(roleOf(walls[at(6, 4)])).toBe(TileRole.CORNER_SE);
    expect(roleOf(walls[at(3, 1)])).toBe(TileRole.EDGE_N_A);
    expect(roleOf(walls[at(1, 2)])).toBe(TileRole.EDGE_W_A);

    // Floor cells get floor variants; wall/outside cells get backgrounds.
    expect([TileRole.FLOOR_1, TileRole.FLOOR_2, TileRole.FLOOR_3, TileRole.FLOOR_4]).toContain(
      roleOf(ground[at(3, 2)]),
    );
    expect([TileRole.BG_1, TileRole.BG_2, TileRole.BG_3, TileRole.BG_4]).toContain(roleOf(ground[at(0, 0)]));
    expect([TileRole.BG_1, TileRole.BG_2, TileRole.BG_3, TileRole.BG_4]).toContain(roleOf(ground[at(1, 1)]));
  });

  it('renders door art exactly on D side-wall cells', () => {
    const map = fixtureMap();
    const walls = map.layers[1].data as number[];
    const at = (x: number, y: number) => y * 8 + x;
    // door-out's D cell sits at (6, 3) on the east wall.
    expect(roleOf(walls[at(6, 3)])).toBe(TileRole.EDGE_E_B);
    expect(roleOf(walls[at(6, 2)])).toBe(TileRole.EDGE_E_A);
  });

  it('renders window art for "o" cells', () => {
    const source = parseLevelSource(FIXTURE.replace('~######~', '~##oo##~'), 'fixture');
    const walls = compileLevel(source, 'fixture').layers[1].data as number[];
    const at = (x: number, y: number) => y * 8 + x;
    expect(roleOf(walls[at(3, 1)])).toBe(TileRole.EDGE_N_B);
    expect(roleOf(walls[at(4, 1)])).toBe(TileRole.EDGE_N_B);
    expect(roleOf(walls[at(2, 1)])).toBe(TileRole.EDGE_N_A);
  });

  it('places solid props on Walls and decals on Ground', () => {
    const map = fixtureMap();
    const walls = map.layers[1].data as number[];
    const ground = map.layers[0].data as number[];
    expect(walls[2 * 8 + 2]).toBe(tileIndex(1, TileRole.PROP_1));
    expect(ground[3 * 8 + 4]).toBe(tileIndex(1, TileRole.PROP_6));
    expect(walls[3 * 8 + 4]).toBe(0);
  });

  it('applies the theme offset to every tile', () => {
    const source = parseLevelSource(FIXTURE.replace('theme: 1', 'theme: 4'), 'fixture');
    const map = compileLevel(source, 'fixture');
    for (const layer of [map.layers[0], map.layers[1]]) {
      for (const tile of layer.data as number[]) {
        if (tile > 0) {
          expect(themeOf(tile)).toBe(4);
        }
      }
    }
  });

  it('emits zones with sequential ids, pixel coordinates, and typed properties', () => {
    const map = fixtureMap();
    const zones = map.layers[3].objects;
    expect(zones.map((zone) => zone.id)).toEqual([1, 2]);
    expect(zones[0]).toMatchObject({
      name: 'Main Console',
      type: 'trigger',
      x: 128,
      y: 128,
      width: 128,
      height: 64,
    });
    expect(zones[0].properties).toEqual([{ name: 'id', type: 'string', value: 'console-zone' }]);
    expect(zones[1].name).toBe('door-out');
    expect(zones[1].properties).toEqual([
      { name: 'id', type: 'string', value: 'door-out' },
      { name: 'targetMap', type: 'string', value: 'other-map' },
      { name: 'spawnX', type: 'int', value: 2 },
      { name: 'spawnY', type: 'int', value: 2 },
      { name: 'requiredFlags', type: 'string', value: 'some-flag' },
    ]);
  });

  it('throws on unresolvable wall geometry', () => {
    const source = parseLevelSource('theme: 1\ngrid: |\n  ~~~\n  ~#~\n  ~~~\n', 'broken');
    expect(() => compileLevel(source, 'broken')).toThrow(/unresolvable wall/);
  });
});

describe('serializeMap', () => {
  it('is byte-deterministic for the same source', () => {
    const first = serializeMap(compileLevel(parseLevelSource(FIXTURE, 'fixture'), 'fixture'));
    const second = serializeMap(compileLevel(parseLevelSource(FIXTURE, 'fixture'), 'fixture'));
    expect(first).toBe(second);
  });

  it('emits alphabetically sorted keys with a trailing newline', () => {
    const text = serializeMap(fixtureMap());
    expect(text.endsWith('}\n')).toBe(true);
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const keys = Object.keys(parsed);
    expect(keys).toEqual([...keys].sort());
  });
});

describe('decompileLevel — inverse of compileLevel', () => {
  it('round-trips grid, props, and zones', () => {
    const source = parseLevelSource(FIXTURE, 'fixture');
    const { source: roundTripped, notes } = decompileLevel(compileLevel(source, 'fixture'));
    expect(notes).toEqual([]);
    expect(roundTripped.theme).toBe(source.theme);
    expect(gridToText(roundTripped.cells)).toBe(gridToText(source.cells));
    expect(roundTripped.props).toEqual(source.props);
    expect(roundTripped.zones).toEqual(source.zones);
  });

  it('round-trips window cells back to "o"', () => {
    const source = parseLevelSource(FIXTURE.replace('~######~', '~##oo##~'), 'fixture');
    const { source: roundTripped, notes } = decompileLevel(compileLevel(source, 'fixture'));
    expect(notes).toEqual([]);
    expect(gridToText(roundTripped.cells)).toBe(gridToText(source.cells));
  });
});
