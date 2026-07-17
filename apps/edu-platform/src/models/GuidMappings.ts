import { LESSON_GUID_MAPPINGS, type LessonGuidMapping } from './LessonGuidMappingsData';

export function getLessonByGuid(guid: string): LessonGuidMapping | null {
  return LESSON_GUID_MAPPINGS[guid] || null;
}

export function isValidGuid(guid: string): boolean {
  return guid in LESSON_GUID_MAPPINGS;
}
