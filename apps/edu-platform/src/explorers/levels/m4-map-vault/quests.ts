import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m4-first-map',
    completionType: 'event',
    title: { pl: 'Pierwsza Mapa', en: 'The First Map' },
    briefing: {
      pl: 'Zasil wyciągi, skartuj zawalone galerie kartografem i skompiluj Mapę Główną Złóż: przedstartowa ekspertyza dr Kern, żywy skan i certyfikaty czystości z Księżyca 3 — trzy źródła, jedna mapa. Nie wpuszczaj gąsienic, zanim nie masz mapy, i nie ufaj staremu planowi piętra. Księżyc 1: znaleźć. Księżyc 2: przetopić. Księżyc 3: poręczyć. Księżyc 4: zmapować.',
      en: 'Power the lifts, map the collapsed galleries with the cartograph, and compile the Master Deposit Map: Dr Kern\'s pre-launch survey, a live scan, and the purity certificates from Moon 3 — three sources, one map. Do not send the crawlers in before you have a map, and do not trust the old floor plan. Moon 1: find. Moon 2: smelt. Moon 3: vouch. Moon 4: map.',
    },
    hints: [
      { pl: 'Zacznij od ciągu zasilającego — pierwsze dotknięcie budzi wyciągi.', en: 'Start at the power line — the first touch wakes the lifts.' },
      { pl: 'Konsola „Kartograf" odtwarza topologię galerii. Sondy są drogie — nie zgaduj.', en: 'The Cartograph console reconstructs the gallery topology. Probes are expensive — do not guess.' },
      { pl: 'Fragmenty starej kondygnacji nie łączą się z sąsiadami. Odrzuć je, zanim zatwierdzisz trasę.', en: 'Fragments of the old floor connect to nothing. Reject them before committing the route.' },
    ],
    objectives: [
      {
        id: 'power-lifts',
        label: { pl: 'Zasil wyciągi galerii', en: 'Power the gallery lifts' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_LIFTS_POWERED },
        requireFlag: FLAGS.M4_LIFTS_POWERED,
      },
      {
        id: 'map-galleries',
        label: { pl: 'Skartuj galerie kartografem', en: 'Map the galleries with the cartograph' },
        event: 'arcade:completed',
        matchPayload: { arcadeGameId: 'arcade-cartograph', solved: true },
        requireFlag: FLAGS.M4_GALLERIES_MAPPED,
      },
    ],
    rewards: { xp: 150, flags: [FLAGS.M4_MASTER_MAP] },
  },
];
