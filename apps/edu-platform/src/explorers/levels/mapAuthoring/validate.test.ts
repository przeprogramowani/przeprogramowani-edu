import { describe, it, expect } from 'vitest';
import { parseLevelSource } from './parseSource';
import { validateLevel } from './validate';
import type { LevelSource, ValidationContext, ValidationIssue } from './types';

const ROOM = `
theme: 1
grid: |
  ~~~~~~
  ~####~
  ~#..#~
  ~#..#~
  ~####~
  ~~~~~~
`;

const ONE_DOOR_ROOM = `
theme: 1
grid: |
  ~~~~~~
  ~####~
  ~#..D~
  ~#..#~
  ~####~
  ~~~~~~
`;

const TWO_CELL_DOOR_ROOM = `
theme: 1
grid: |
  ~~~~~~
  ~####~
  ~#..D~
  ~#..D~
  ~####~
  ~~~~~~
`;

function source(yamlText: string, mapKey = 'room'): LevelSource {
  return parseLevelSource(yamlText, mapKey);
}

function ctx(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    sources: new Map(),
    knownMaps: new Set(),
    ...overrides,
  };
}

function messages(issues: ValidationIssue[], level?: 'error' | 'warning'): string[] {
  return issues.filter((issue) => !level || issue.level === level).map((issue) => issue.message);
}

describe('validateLevel — geometry', () => {
  it('accepts a sealed rectangular room', () => {
    expect(messages(validateLevel(source(ROOM), 'room', ctx()), 'error')).toEqual([]);
  });

  it('rejects themes outside 1-6', () => {
    const issues = validateLevel(source(ROOM.replace('theme: 1', 'theme: 7')), 'room', ctx());
    expect(messages(issues, 'error')).toContainEqual(expect.stringMatching(/theme 7 out of range/));
  });

  it('rejects unresolvable wall cells', () => {
    const thin = source('theme: 1\ngrid: |\n  ~~~~~~~\n  ~#####~\n  ~#.#.#~\n  ~#####~\n  ~~~~~~~\n');
    expect(messages(validateLevel(thin, 'room', ctx()), 'error')).toContainEqual(
      expect.stringMatching(/thin wall/),
    );
  });

  it('rejects floor cells touching the outside', () => {
    const leaky = source('theme: 1\ngrid: |\n  ~~~~~~\n  ~####~\n  ~#..#~\n  ~#..~~\n  ~####~\n  ~~~~~~\n');
    expect(messages(validateLevel(leaky, 'room', ctx()), 'error')).toContainEqual(
      expect.stringMatching(/floor cell touches the outside/),
    );
  });
});

describe('validateLevel — props', () => {
  it('rejects out-of-bounds and off-floor props', () => {
    const bad = source(`${ROOM}props:\n  - { slot: 1, at: [9, 9] }\n  - { slot: 2, at: [1, 1] }\n`);
    const errors = messages(validateLevel(bad, 'room', ctx()), 'error');
    expect(errors).toContainEqual(expect.stringMatching(/out of bounds/));
    expect(errors).toContainEqual(expect.stringMatching(/must stand on a floor cell/));
  });
});

describe('validateLevel — zones', () => {
  it('rejects duplicate zone ids and out-of-bounds zones', () => {
    const bad = source(
      `${ROOM}zones:\n  - { id: a, type: trigger, at: [2, 2] }\n  - { id: a, type: trigger, at: [3, 3] }\n  - { id: b, type: trigger, at: [5, 5], size: [2, 1] }\n`,
    );
    const errors = messages(validateLevel(bad, 'room', ctx()), 'error');
    expect(errors).toContainEqual(expect.stringMatching(/duplicate zone id "a"/));
    expect(errors).toContainEqual(expect.stringMatching(/zone "b" extends out of bounds/));
  });

  it('flags unknown door targets as warnings (future content) and missing spawns as errors', () => {
    const bad = source(
      `${TWO_CELL_DOOR_ROOM}zones:\n  - { id: d1, type: door, at: [4, 2], properties: { targetMap: nowhere, spawnX: 1, spawnY: 1 } }\n  - { id: d2, type: door, at: [4, 3], properties: { targetMap: room-b } }\n`,
    );
    const issues = validateLevel(bad, 'room', ctx({ knownMaps: new Set(['room-b']) }));
    expect(messages(issues, 'warning')).toContainEqual(expect.stringMatching(/targets unknown map "nowhere"/));
    expect(messages(issues, 'error')).toContainEqual(expect.stringMatching(/missing int spawnX\/spawnY/));
  });

  it('rejects door spawns on non-walkable cells of the target map', () => {
    const roomA = source(
      `${ONE_DOOR_ROOM}zones:\n  - { id: to-b, type: door, at: [4, 2], properties: { targetMap: room-b, spawnX: 1, spawnY: 1 } }\n`,
      'room-a',
    );
    const roomB = source(ROOM, 'room-b');
    const shared = ctx({
      sources: new Map([
        ['room-a', roomA],
        ['room-b', roomB],
      ]),
      knownMaps: new Set(['room-a', 'room-b']),
    });
    expect(messages(validateLevel(roomA, 'room-a', shared), 'error')).toContainEqual(
      expect.stringMatching(/\(1, 1\) in "room-b", which is not walkable floor/),
    );
  });

  it('warns when a door has no reciprocal door back', () => {
    const roomA = source(
      `${ONE_DOOR_ROOM}zones:\n  - { id: to-b, type: door, at: [4, 2], properties: { targetMap: room-b, spawnX: 2, spawnY: 2 } }\n`,
      'room-a',
    );
    const roomB = source(ROOM, 'room-b');
    const shared = ctx({
      sources: new Map([
        ['room-a', roomA],
        ['room-b', roomB],
      ]),
      knownMaps: new Set(['room-a', 'room-b']),
    });
    expect(messages(validateLevel(roomA, 'room-a', shared), 'warning')).toContainEqual(
      expect.stringMatching(/no door leading back/),
    );
  });

  it('requires every D cell to be covered by exactly one door zone', () => {
    const uncovered = source(ONE_DOOR_ROOM);
    expect(messages(validateLevel(uncovered, 'room', ctx()), 'error')).toContainEqual(
      expect.stringMatching(/D cell is not covered by a door zone/),
    );

    const overlapping = source(
      `${ONE_DOOR_ROOM}zones:\n  - { id: a, type: door, at: [4, 2], properties: { targetMap: future, spawnX: 1, spawnY: 1 } }\n  - { id: b, type: door, at: [4, 2], properties: { targetMap: future, spawnX: 1, spawnY: 1 } }\n`,
    );
    expect(messages(validateLevel(overlapping, 'room', ctx()), 'error')).toContainEqual(
      expect.stringMatching(/covered by multiple door zones: a, b/),
    );
  });

  it('requires door zones to cover only D cells and be one tile wide', () => {
    const bad = source(
      `${ROOM}zones:\n  - { id: misplaced, type: door, at: [3, 2], size: [2, 1], properties: { targetMap: future, spawnX: 1, spawnY: 1 } }\n`,
    );
    const errors = messages(validateLevel(bad, 'room', ctx()), 'error');
    expect(errors).toContainEqual(expect.stringMatching(/must be one tile wide/));
    expect(errors).toContainEqual(expect.stringMatching(/covers "FLOOR" instead of a D cell/));
    expect(errors).toContainEqual(expect.stringMatching(/covers "WALL" instead of a D cell/));
  });

  it('allows a door zone on a floor cell covered by a solid prop', () => {
    const teleport = source(
      `${ROOM}props:\n  - { slot: 1, at: [2, 2], solid: true }\nzones:\n  - { id: ship-teleport, type: door, at: [2, 2], properties: { targetMap: future, spawnX: 1, spawnY: 1 } }\n`,
    );
    expect(messages(validateLevel(teleport, 'room', ctx()), 'error')).not.toContainEqual(
      expect.stringMatching(/instead of a D cell/),
    );

    const walkableDecal = source(
      `${ROOM}props:\n  - { slot: 1, at: [2, 2], solid: false }\nzones:\n  - { id: ship-teleport, type: door, at: [2, 2], properties: { targetMap: future, spawnX: 1, spawnY: 1 } }\n`,
    );
    expect(messages(validateLevel(walkableDecal, 'room', ctx()), 'error')).toContainEqual(
      expect.stringMatching(/covers "FLOOR" instead of a D cell/),
    );
  });
});

describe('validateLevel — reachability', () => {
  it('warns about floor cells cut off from the entry point', () => {
    // Two sealed rooms with no connection between them.
    const split = source(
      'theme: 1\ngrid: |\n  ~~~~~~~~~\n  ~###~###~\n  ~#.#~#.#~\n  ~###~###~\n  ~~~~~~~~~\n',
    );
    expect(messages(validateLevel(split, 'room', ctx()), 'warning')).toContainEqual(
      expect.stringMatching(/unreachable from any entry point/),
    );
  });

  it('does not warn for a fully connected room', () => {
    expect(messages(validateLevel(source(ROOM), 'room', ctx()), 'warning')).toEqual([]);
  });
});

describe('validateLevel — manifest cross-checks', () => {
  const withZones = `${ROOM}zones:
  - { id: routed, type: trigger, at: [2, 2] }
  - { id: unrouted, type: trigger, at: [3, 2] }
  - { id: exam-1, type: exam, at: [2, 3], properties: { examId: missing-exam } }
  - { id: arcade-1, type: arcade, at: [3, 3], properties: { arcadeGameId: missing-game } }
`;

  it('warns on unrouted triggers and missing exam/arcade definitions', () => {
    const manifests = new Map([
      ['room', { interactionRoutes: [{ zoneId: 'routed' }], exams: [], arcadeGames: [] }],
    ]);
    const warnings = messages(validateLevel(source(withZones), 'room', ctx({ manifests })), 'warning');
    expect(warnings).toContainEqual(expect.stringMatching(/"unrouted" has no interactionRoutes entry/));
    expect(warnings).toContainEqual(expect.stringMatching(/missing exam "missing-exam"/));
    expect(warnings).toContainEqual(expect.stringMatching(/missing arcade game "missing-game"/));
    expect(warnings).not.toContainEqual(expect.stringMatching(/"routed" has no interactionRoutes/));
  });

  it('stays quiet without a manifest for the map', () => {
    expect(messages(validateLevel(source(withZones), 'room', ctx()), 'warning')).toEqual([]);
  });
});
