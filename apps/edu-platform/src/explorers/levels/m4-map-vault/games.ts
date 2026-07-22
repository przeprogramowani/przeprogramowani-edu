import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-cartograph',
    type: 'cartograph',
    title: { pl: 'Kartograf', en: 'Cartograph' },
    description: {
      pl: 'Skartuj zawalone galerie złóż, zanim wpuścisz gąsienice wydobywcze. Wbijaj sondy gruntowe: każda odsłania fragment korytarza z końcówkami połączeń — z fragmentów odtwórz spójną topologię przejścia i zatwierdź trasę. Sond jest mało, a każda zmarnowana to zużyte wiertło. Haczyk: przez odczyt przebijają fragmenty starszej, nieaktualnej kondygnacji — wyglądają poprawnie, ale nie pasują do żadnego sąsiada; rozpoznaj je i odrzuć. Stary plan piętra to teza tego księżyca w miniaturze: dokumentacja potrafi opisywać budynek, którego już nie ma.',
      en: 'Map the collapsed deposit galleries before you send in the mining crawlers. Drive ground probes: each reveals a corridor fragment with connection stubs — from the fragments reconstruct a coherent passage topology and commit the route. Probes are scarce, and every wasted one wears the drill. The catch: fragments of an older, out-of-date floor bleed through the read — they look correct but connect to no neighbour; recognise and reject them. The old floor plan is this moon\'s thesis in miniature: documentation can describe a building that no longer exists.',
    },
    difficulty: 3,
    durationSeconds: 0,
    mission: {
      minScore: 70,
      firstClearXp: 25,
      firstClearDialogueId: 'm4-cartograph-cleared',
    },
  },
];
