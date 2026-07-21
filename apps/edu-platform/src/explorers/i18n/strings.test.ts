import { describe, it, expect } from 'vitest';
import { hudStrings } from './hud';
import { sceneStrings } from './scene';
import { examStrings } from './exam';
import { arcadeStrings } from './arcade';
import { terminalStrings } from './terminal';
import { previewStrings } from './preview';
import { grantStrings } from './grant';
import { navigationStrings } from './navigation';

type StringModule = { pl: Record<string, string>; en: Record<string, string> };

const MODULES: [string, StringModule][] = [
  ['hud', hudStrings as StringModule],
  ['scene', sceneStrings as StringModule],
  ['exam', examStrings as StringModule],
  ['arcade', arcadeStrings as StringModule],
  ['terminal', terminalStrings as StringModule],
  ['preview', previewStrings as StringModule],
  ['grant', grantStrings as StringModule],
  ['navigation', navigationStrings as StringModule],
];

// Keys where pl === en is intentional (technical terms, URLs, Latin mottos,
// format strings that are locale-neutral, or strings already in English in pl).
const INTENTIONALLY_IDENTICAL = new Set<string>([
  // Menu labels that are the same in both languages
  'hud.menu',
  'hud.terminal',
  // Locale toggle labels that are already in the target language
  'hud.localeTitleEn',
  'hud.localeSwitchToPl',
  // Game UI
  'arcade.startHint',
  // Terminal: brand name, format strings, URLs, Latin motto
  'terminal.header',
  'terminal.me.xpMax',
  'terminal.me.xpProgress',
  'terminal.navi.eta',
  'terminal.lockMotto',
  'terminal.support.centerUrl',
  'terminal.support.loginUrl',
  // System speaker label is the same in both locales by design
  'scene.speakerSystem',
  // "MAGENTA" is the same word in Polish and English (unlike BLUE/GREEN tints)
  'scene.debugNpcMagentaTint',
  // "XP:" is a universal gaming abbreviation, identical in both locales
  'terminal.me.xpLabel',
  // Debug NPC playground label — technical, identical by design
  'scene.debugNpcMagentaTint',
]);

describe('i18n parity — UI chrome modules', () => {
  for (const [name, mod] of MODULES) {
    it(`${name}: pl and en have identical key sets`, () => {
      expect(Object.keys(mod.pl).sort()).toEqual(Object.keys(mod.en).sort());
    });

    it(`${name}: no placeholder en values remaining`, () => {
      const placeholders: string[] = [];
      for (const key of Object.keys(mod.pl)) {
        if (mod.pl[key] === mod.en[key] && !INTENTIONALLY_IDENTICAL.has(key)) {
          placeholders.push(key);
        }
      }
      expect(placeholders, `Untranslated keys in module "${name}"`).toEqual([]);
    });

    it(`${name}: interpolation slots match between pl and en`, () => {
      for (const key of Object.keys(mod.pl)) {
        const plSlots = (mod.pl[key].match(/\{(\w+)\}/g) ?? []).sort();
        const enSlots = (mod.en[key].match(/\{(\w+)\}/g) ?? []).sort();
        expect(enSlots, `Slot mismatch at ${name}.${key}`).toEqual(plSlots);
      }
    });
  }
});
