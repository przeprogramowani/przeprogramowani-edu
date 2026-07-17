import { getModuleStatuses, type ModuleStatus } from '@/server/courseGating';
import { TEN_X_DEVS_3_GATING } from '@/server/courseGating/tenXDevs3';
import {
  MAX_GENERATIONS_PER_LESSON,
  getQuotaForUser,
} from '@/server/missionLog/quotaService';
import {
  MISSION_LOG_LESSON_CATALOG,
  type MissionLogModuleId,
} from '@/models/missionLog/lessonCatalog';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface MissionLogLessonState {
  lessonId: string;
  title: string;
  moduleId: MissionLogModuleId;
  order: number;
  badgeId: number;
  count: number;
  remaining: number;
  badgeImageUrl: string | null;
  locked: boolean;
}

export interface MissionLogState {
  now: string;
  avatarUrl: string | null;
  modules: ModuleStatus[];
  lessons: MissionLogLessonState[];
}

export interface BuildMissionLogStateInput {
  userId: string;
  avatarUrl: string | null;
  env: SupabaseEnv;
  now?: Date;
}

export async function buildMissionLogState({
  userId,
  avatarUrl,
  env,
  now = new Date(),
}: BuildMissionLogStateInput): Promise<MissionLogState> {
  const modules = getModuleStatuses(TEN_X_DEVS_3_GATING, now);
  const unlockedById = new Map(
    modules.map((m) => [m.id as MissionLogModuleId, m.unlocked]),
  );

  const quotaRows = await getQuotaForUser(userId, env);
  const quotaByLessonId = new Map(quotaRows.map((q) => [q.lessonId, q]));

  const lessons: MissionLogLessonState[] = MISSION_LOG_LESSON_CATALOG.map((lesson) => {
    const q = quotaByLessonId.get(lesson.lessonId);
    const count = q?.count ?? 0;
    return {
      lessonId: lesson.lessonId,
      title: lesson.title,
      moduleId: lesson.moduleId,
      order: lesson.order,
      badgeId: lesson.badgeId,
      count,
      remaining: MAX_GENERATIONS_PER_LESSON - count,
      badgeImageUrl: q?.lastBadgeImageUrl ?? null,
      locked: !unlockedById.get(lesson.moduleId),
    };
  });

  return {
    now: now.toISOString(),
    avatarUrl,
    modules,
    lessons,
  };
}
