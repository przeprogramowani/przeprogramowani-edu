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

describe('Moon 3 terminal alignment', () => {
  it('registers /iskra and /diag behind their flags', () => {
    expect(COMMAND_REGISTRY.find((c) => c.name === 'iskra')).toMatchObject({ requiredFlag: FLAGS.CMDS_ISKRA });
    expect(COMMAND_REGISTRY.find((c) => c.name === 'diag')).toMatchObject({ requiredFlag: FLAGS.CMDS_DIAG });
    expect(output('/iskra', 'm3-boneyard', [])).toContain('Nieznana komenda');
    expect(output('/diag', 'm3-apron', [])).toContain('Nieznana komenda');
  });

  it('reports Iskra moods and keeps her fault list non-empty', () => {
    const base = [FLAGS.CMDS_ISKRA];

    expect(output('/iskra', 'm3-boneyard', base)).toContain('na wszelki wypadek');
    expect(output('/iskra', 'm3-fire-trial', [...base, FLAGS.M3_RED_LIGHT_ONLINE])).toContain('zmierzone');
    expect(output('/iskra', 'm3-boneyard', [...base, FLAGS.M3_RED_LIGHT_ONLINE, FLAGS.M3_STATION_RECERTIFIED])).toContain(
      'USTEREK JAWNYCH: 214'
    );
    expect(output('/iskra', 'm1-landing-pad', base)).toContain('poza zasięgiem');
  });

  it('runs honest diagnostics per map and reveals the obelisk only after the core is online', () => {
    const base = [FLAGS.CMDS_DIAG];

    expect(output('/diag', 'm3-apron', base)).toContain('tablica kłamie');
    expect(output('/diag', 'm3-annealing-yard', base)).not.toContain('obelisk pod ostrogą');
    expect(output('/diag', 'm3-annealing-yard', [...base, FLAGS.M3_DIAGNOSTICS_ONLINE])).toContain('obelisk pod ostrogą');
    expect(output('/diag', 'm0-core-ai', base)).toContain('banki pamięci');
  });

  it('adds the Moon 3 scan, crew, intel and cargo surfaces', () => {
    expect(output('/scan', 'm3-apron', [FLAGS.CMDS_SCAN])).toContain('morze zielonych kontrolek');

    const crew = output('/crew', 'm3-apron', [FLAGS.CMDS_CREW, FLAGS.M3_APRON_INTRO_SEEN, FLAGS.M3_WAKE_TRAP_DIAGNOSED]);
    expect(crew).toContain('OBÓZ PRZEDPOLA');
    expect(crew).toContain('WACHTA MEDYCZNA — ORBITA');
    expect(crew).toContain('PUŁAPKA UZBROJONA');

    expect(output('/intel', 'm3-assay-office', [FLAGS.CMDS_INTEL, FLAGS.M3_CANARY_EDITED_SEEN])).toContain(
      'kanarek wrócił poprawiony'
    );

    const profile = output('/me', 'm3-assay-office', [FLAGS.M3_FIRST_CERT]);
    expect(profile).toContain('certyfikaty — Partia 03');
  });

  it('escalates uplink integrity to the edited canary and arms the side channel', () => {
    const uplink = output('/uplink', 'm3-assay-office', [FLAGS.CMDS_UPLINK, FLAGS.M3_CANARY_EDITED_SEEN]);
    expect(uplink).toContain('KANAREK POPRAWIONY');
    expect(uplink).toContain('kanał boczny');
  });

  it('surfaces the diagnostic module and the Moon 4 teaser once diagnostics are online', () => {
    const sensors = output('/sensors', 'm3-assay-office', [FLAGS.CMDS_SENSORS, FLAGS.M3_DIAGNOSTICS_ONLINE]);
    expect(sensors).toContain('moduł diagnostyczny');
    expect(sensors).toContain('Księżyc 4 / banki pamięci');
  });

  it('ranks the Moon 3 next steps under /plan', () => {
    expect(output('/plan', 'm3-fire-trial', [FLAGS.CMDS_PLAN])).toContain('Nie ufaj jednemu zielonemu');
  });

  it('renders the Moon 3 surfaces in English too', () => {
    setLocale('en');
    expect(output('/iskra', 'm3-boneyard', [FLAGS.CMDS_ISKRA])).toContain('just in case');
    expect(output('/diag', 'm3-apron', [FLAGS.CMDS_DIAG])).toContain('the board lies');
    expect(output('/plan', 'm3-fire-trial', [FLAGS.CMDS_PLAN])).toContain('Trust no single green');
  });
});
