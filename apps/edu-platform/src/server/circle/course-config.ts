import { CourseSlug } from '../../models/CollectionMappings';
import { Platform } from '@edu/circle';
import { getExternalAuthConfig } from './externalAuthConfig';

/**
 * Gets the Circle platform for a course from EXTERNAL_AUTH_CONFIG
 * @throws Error if course has no platform configuration
 */
export const getPlatformForCourse = (courseId: CourseSlug): Platform => {
  const config = getExternalAuthConfig(courseId);
  if (!config) {
    throw new Error(`Unknown course: ${courseId} - no platform configuration found`);
  }
  return config.platform;
};
