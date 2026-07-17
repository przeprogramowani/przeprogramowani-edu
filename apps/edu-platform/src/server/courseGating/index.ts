import type { CourseGatingConfig, CourseSlug, ModuleId } from './types';
import { TEN_X_DEVS_3_GATING } from './tenXDevs3';

export type { CourseGatingConfig, ModuleId } from './types';

export interface ModuleStatus {
  id: ModuleId;
  unlocksAt: string;
  unlocked: boolean;
}

export function isModuleUnlocked(
  config: CourseGatingConfig,
  moduleId: ModuleId,
  now: Date = new Date(),
): boolean {
  const module = config.modules.find((m) => m.id === moduleId);
  if (!module) return false;
  return Date.parse(module.unlocksAt) <= now.getTime();
}

export function getModuleStatuses(
  config: CourseGatingConfig,
  now: Date = new Date(),
): ModuleStatus[] {
  const nowMs = now.getTime();
  return config.modules.map((m) => ({
    id: m.id,
    unlocksAt: m.unlocksAt,
    unlocked: Date.parse(m.unlocksAt) <= nowMs,
  }));
}

export function getNextUnlockAt(
  config: CourseGatingConfig,
  now: Date = new Date(),
): string | null {
  const nowMs = now.getTime();
  const upcoming = config.modules
    .filter((m) => Date.parse(m.unlocksAt) > nowMs)
    .sort((a, b) => Date.parse(a.unlocksAt) - Date.parse(b.unlocksAt));
  return upcoming.length > 0 ? upcoming[0].unlocksAt : null;
}

export function loadCourseGatingConfig(courseSlug: CourseSlug): CourseGatingConfig {
  switch (courseSlug) {
    case '10xdevs-3':
      return TEN_X_DEVS_3_GATING;
    default:
      throw new Error(`No course gating config registered for course slug: ${courseSlug}`);
  }
}
