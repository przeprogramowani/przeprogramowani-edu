import type { CourseGatingConfig } from './types';

// Module unlock targets are Europe/Warsaw 00:00 local time. May/June 2026 is CEST (+02:00).
export const TEN_X_DEVS_3_GATING: CourseGatingConfig = {
  courseSlug: '10xdevs-3',
  modules: [
    { id: 'm1', unlocksAt: '2026-05-18T00:00:00+02:00' },
    { id: 'm2', unlocksAt: '2026-05-25T00:00:00+02:00' },
    { id: 'm3', unlocksAt: '2026-06-01T00:00:00+02:00' },
    { id: 'm4', unlocksAt: '2026-06-08T00:00:00+02:00' },
    { id: 'm5', unlocksAt: '2026-06-15T00:00:00+02:00' },
  ],
};
