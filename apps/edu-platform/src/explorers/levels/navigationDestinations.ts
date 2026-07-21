import type { BilingualText } from '../i18n/types';
import type { GameFlag } from '../config/flags';
import { FLAGS } from '../config/flags';

/**
 * A selectable destination on the ship navigation deck.
 * `targetMap: null` marks future content — the entry renders as "no signal"
 * and can never be launched, regardless of flags.
 */
interface NavDestinationBase {
  id: string;
  name: BilingualText;
  description: BilingualText;
  /** Course-stage codename shown on the /navi mission map. */
  codename: string;
  /** Expected signal date (course schedule) — /navi shows a countdown while in the future. */
  eta?: string;
  /** All listed flags must be set to launch (AND logic). */
  requiredFlags: GameFlag[];
}

export type NavDestination = NavDestinationBase &
  (
    | {
        targetMap: string;
        spawnX: number;
        spawnY: number;
      }
    | {
        targetMap: null;
        spawnX?: never;
        spawnY?: never;
      }
  );

export type DestinationStatus = 'available' | 'locked' | 'no-signal';

/** Shared status logic for the navigation deck overlay and the /navi mission map. */
export function getDestinationStatus(dest: NavDestination, hasFlag: (flag: GameFlag) => boolean): DestinationStatus {
  if (!dest.targetMap) return 'no-signal';
  return dest.requiredFlags.every(hasFlag) ? 'available' : 'locked';
}

/** The 5-moon exploratory mission — one destination per course module. */
export const NAV_DESTINATIONS: readonly NavDestination[] = [
  {
    id: 'moon-1',
    name: { pl: 'Księżyc 1 — Dżungla', en: 'Moon 1 — Jungle' },
    description: {
      pl: 'Dżunglowy księżyc. Strefa Ciszy — sygnał urwany.',
      en: 'Jungle moon. The Silence Zone — signal cut off.',
    },
    codename: 'Agentic Asteroid',
    eta: '2026-05-22',
    targetMap: 'm1-landing-pad',
    spawnX: 2,
    spawnY: 7,
    requiredFlags: [FLAGS.M0_EARTH_SIGNAL_RECEIVED, FLAGS.SYS_COURSE_M1_AVAILABLE],
  },
  {
    id: 'moon-2',
    name: { pl: 'Księżyc 2 — Lodowy', en: 'Moon 2 — Ice' },
    description: {
      pl: 'Lodowa wykuwnia serii Odyssey-F. Sygnał nawigacyjny: powtarzalny. Załoga: żadna.',
      en: 'Odyssey-F ice forge. Navigation signal: repeating. Crew: none.',
    },
    codename: 'Wormhole Workflows',
    eta: '2026-05-29',
    targetMap: 'm2-planning',
    spawnX: 2,
    spawnY: 6,
    requiredFlags: [FLAGS.M1_SENSORS_ONLINE, FLAGS.SYS_COURSE_M2_AVAILABLE],
  },
  {
    id: 'moon-3',
    name: { pl: 'Księżyc 3 — Wulkaniczny', en: 'Moon 3 — Volcanic' },
    description: {
      pl: 'Poligon certyfikacyjny serii Odyssey-T. Raport stacji: wszystkie systemy sprawne — od 1892 dni.',
      en: 'Odyssey-T certification proving ground. Station report: all systems nominal — for 1,892 days.',
    },
    codename: 'Quality Quasar',
    eta: '2026-06-05',
    targetMap: 'm3-apron',
    spawnX: 4,
    spawnY: 7,
    requiredFlags: [FLAGS.M2_PLANNING_ONLINE, FLAGS.SYS_COURSE_M3_AVAILABLE],
  },
  {
    id: 'moon-4',
    name: { pl: 'Księżyc 4 — Pustynny', en: 'Moon 4 — Desert' },
    description: {
      pl: 'Banki pamięci długoterminowej. Sygnał niedostępny.',
      en: 'Long-term memory banks. Signal unavailable.',
    },
    codename: 'Megalithic Monolith',
    eta: '2026-06-12',
    targetMap: null,
    requiredFlags: [FLAGS.M3_DIAGNOSTICS_ONLINE, FLAGS.SYS_COURSE_M4_AVAILABLE],
  },
  {
    id: 'moon-5',
    name: { pl: 'Księżyc 5 — Oceaniczny', en: 'Moon 5 — Oceanic' },
    description: {
      pl: 'Zespół komunikacyjny CORE AI. Sygnał niedostępny.',
      en: 'CORE AI communication array. Signal unavailable.',
    },
    codename: 'Teamwork Teleport',
    eta: '2026-06-19',
    targetMap: null,
    requiredFlags: [],
  },
];
