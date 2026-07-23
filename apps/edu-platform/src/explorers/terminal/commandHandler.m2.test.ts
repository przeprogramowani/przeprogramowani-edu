import { afterEach, describe, expect, it } from 'vitest';
import { FLAGS, type GameFlag } from '../config/flags';
import { setLocale } from '../utils/locale';
import type { GameState } from '../state/types';
import { COMMAND_REGISTRY } from './commandRegistry';
import { handleCommand } from './commandHandler';

function makeState(currentMap: string, flags: GameFlag[]): GameState {
  return {
    version: 2,
    flags,
    currentMap,
    position: { x: 0, y: 0 },
    facing: 'right',
    quests: { active: null, completed: [], objectivesDone: {} },
    hintIndex: {},
    xp: 0,
    commandHistory: [],
    bookmarks: [],
  };
}

function output(command: string, currentMap: string, flags: GameFlag[]): string {
  return handleCommand(command, makeState(currentMap, flags)).output.join('\n');
}

afterEach(() => setLocale('pl'));

describe('Moon 2 terminal alignment', () => {
  it('no longer registers the companion ping commands', () => {
    for (const name of ['sopel', 'drone', 'iskra', 'echo', 'planner']) {
      expect(COMMAND_REGISTRY.some((command) => command.name === name)).toBe(false);
    }
    expect(output('/sopel', 'm2-staging-yard', [])).toContain('Nieznana komenda');
    expect(output('/drone', 'm2-planning', [])).toContain('Nieznana komenda');
  });

  it('returns a location-specific scan for every Moon 2 map and reveals the ring conditionally', () => {
    const scans: Array<[string, string]> = [
      ['m2-planning', 'Brama'],
      ['m2-drafting-hall', 'Warsztat'],
      ['m2-staging-yard', 'Martwy Punkt'],
      ['m2-assembly-line', 'Huta'],
      ['m2-planning-core', 'Dyspozytornia'],
    ];

    for (const [map, label] of scans) {
      expect(output('/scan', map, [FLAGS.CMDS_SCAN])).toContain(label);
    }

    expect(output('/scan', 'm2-assembly-line', [FLAGS.CMDS_SCAN])).not.toContain('regularny kształt');
    expect(output('/scan', 'm2-assembly-line', [FLAGS.CMDS_SCAN, FLAGS.M2_PLANNING_ONLINE])).toContain(
      'regularny kształt'
    );
  });

  it('shows Moon 2 crew assignments and the unexplained Harris delay', () => {
    const crew = output('/crew', 'm2-planning', [
      FLAGS.CMDS_CREW,
      FLAGS.M2_GATE_INTRO_SEEN,
      FLAGS.M2_HARRIS_DELAY_LOGGED,
    ]);

    expect(crew).toContain('ŁĄCZNOŚĆ / WACHTA MEDYCZNA — ORBITA');
    expect(crew).toContain('WARTOWNIA BRAMY — KSIĘŻYC 2');
    expect(crew).toContain('POBUDKA PRZESUNIĘTA ×3 — NIKT NIE ZLECAŁ');
  });

  it('gates all seven Moon 2 intel discoveries on their narrative flags', () => {
    const flags = [
      FLAGS.CMDS_INTEL,
      FLAGS.M2_BLACKBOX_DOCKING_SEEN,
      FLAGS.M2_ENDLESS_TASK_FOUND,
      FLAGS.M2_ENTROPY_PROFILED,
      FLAGS.M2_KERN_REVISION_NOTED,
      FLAGS.M2_SABOTAGE_TIMESTAMPED,
      FLAGS.M2_PURSUIT_ON_MAP,
      FLAGS.M2_CHECKSUM_MISMATCH_SEEN,
    ];
    const intel = output('/intel', 'm2-planning-core', flags);

    expect(intel).toContain('dokowania późniejszy niż zamrożenie fabryki');
    expect(intel).toContain('zadanie bez końca');
    expect(intel).toContain('profil ENTROPY');
    expect(intel).toContain('rewizją, której fabryka nie pobrała');
    expect(intel).toContain('godzina startu Odyssey');
    expect(intel).toContain('zmieniła kurs');
    expect(intel).toContain('różni się o jeden blok');
  });

  it('reports the noticed checksum mismatch and both Synaptit cargo records', () => {
    expect(output('/uplink', 'm2-planning-core', [FLAGS.CMDS_UPLINK, FLAGS.M2_CHECKSUM_MISMATCH_SEEN])).toContain(
      'NIEZGODNA O JEDEN BLOK — ODNOTOWANE'
    );

    const profile = output('/me', 'm2-planning-core', [FLAGS.M1_FIRST_ORE, FLAGS.M2_FIRST_INGOT]);
    expect(profile).toContain('Ładunek Synaptitu: 14 kg');
    expect(profile).toContain('sztaby Synaptitu 212 kg');
  });

  it('uses /plan as an ordered next-step surface for each map family', () => {
    const flags = [FLAGS.CMDS_PLAN];

    expect(output('/plan', 'm2-planning', flags)).toContain('1. Domknij bieżący takt');
    expect(output('/plan', 'm1-landing-pad', flags)).toContain('1. Księżyc 1 rozliczony');
    expect(output('/plan', 'm0-core-ai', flags)).toContain('1. Pokład nawigacyjny');
    expect(output('/plan', 'm9-unknown', flags)).toContain('Brak uszeregowanych kroków');
  });

  it('renders the new surfaces in English too', () => {
    setLocale('en');

    expect(output('/plan', 'm0-core-ai', [FLAGS.CMDS_PLAN])).toContain('Navigation deck');
  });
});
