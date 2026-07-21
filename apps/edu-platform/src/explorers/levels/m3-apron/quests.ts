import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m3-audit',
    completionType: 'event',
    title: { pl: 'Audyt', en: 'The Audit' },
    briefing: {
      pl: 'Tablica główna raportuje trzy zielone statusy: wieżę chłodzenia, kotwę sejsmiczną i maszt telemetryczny. Odwiedź wszystkie trzy punkty na obrzeżach, porównaj raport z rzeczywistością i zamelduj w obozie. Wątpienie to nie cynizm — chodzi o to, by wiedzieć, które zielone jest prawdziwe.',
      en: 'The main board reports three green statuses: the cooling tower, the seismic anchor, and the telemetry mast. Visit all three points on the outskirts, compare the report against reality, and report back at camp. Doubt is not cynicism — the point is to know which green is real.',
    },
    hints: [
      { pl: 'Zacznij w obozie — tam aktywujesz audyt i zobaczysz listę statusów.', en: 'Start at camp — that is where you open the audit and see the status list.' },
      { pl: 'Każdy punkt audytu jest na obrzeżu równiny. Podejdź i sprawdź sam, nie wierz tablicy.', en: 'Each audit point sits on the outskirts of the plain. Walk up and check for yourself, do not trust the board.' },
      { pl: 'Dwa statusy kłamią, jeden mówi prawdę. Zbierz wszystkie trzy pomiary, żeby wiedzieć które.', en: 'Two statuses lie, one tells the truth. Collect all three measurements to know which.' },
    ],
    objectives: [
      {
        id: 'audit-tower',
        label: { pl: 'Sprawdź wieżę chłodzenia', en: 'Check the cooling tower' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_AUDIT_TOWER_CHECKED },
        requireFlag: FLAGS.M3_AUDIT_TOWER_CHECKED,
      },
      {
        id: 'audit-anchor',
        label: { pl: 'Sprawdź kotwę sejsmiczną', en: 'Check the seismic anchor' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_AUDIT_ANCHOR_CHECKED },
        requireFlag: FLAGS.M3_AUDIT_ANCHOR_CHECKED,
      },
      {
        id: 'audit-mast',
        label: { pl: 'Sprawdź maszt telemetryczny', en: 'Check the telemetry mast' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_AUDIT_MAST_CHECKED },
        requireFlag: FLAGS.M3_AUDIT_MAST_CHECKED,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M3_CAMP_ONLINE] },
  },
];
