import type { CourseSlug } from '@/models/CollectionMappings';

export type ModuleId = string;

export interface CourseGatingModule {
  id: ModuleId;
  unlocksAt: string;
}

export interface CourseGatingConfig {
  courseSlug: CourseSlug;
  modules: CourseGatingModule[];
}

export type { CourseSlug };
