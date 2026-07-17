import { AirtableCourse } from '@/server/airtable/airtable-course';
import { LessonCollection } from './LessonCollection';

export type CourseSlug =
  | 'cursor-ai'
  | 'opanuj-frontend'
  | 'opanuj-frontend-live'
  | 'opanuj-typescript-core'
  | 'opanuj-typescript-react'
  | '10xdevs-1'
  | '10xdevs-2'
  | '10xdevs-2-en'
  | '10xdevs-3'
  | '10xdevs-3-prework';

export const COURSE_SLUG_TO_NAME: Record<CourseSlug, string> = {
  'cursor-ai': 'Cursor AI',
  'opanuj-frontend': 'Opanuj Frontend',
  'opanuj-frontend-live': 'Opanuj Frontend',
  'opanuj-typescript-core': 'Opanuj TypeScript Core',
  'opanuj-typescript-react': 'Opanuj TypeScript React',
  '10xdevs-1': '10xDevs',
  '10xdevs-2': '10xDevs 2.0',
  '10xdevs-2-en': '10xDevs 2.0 (EN)',
  '10xdevs-3': '10xDevs 3.0',
  '10xdevs-3-prework': '10xDevs 3.0: Prework',
};

export const COLLECTION_MAPPINGS: Record<CourseSlug, LessonCollection> = {
  'cursor-ai': 'lessonsCursor',
  'opanuj-frontend': 'lessonsOfe',
  'opanuj-frontend-live': 'livesOfe',
  'opanuj-typescript-core': 'lessonsOtsCore',
  'opanuj-typescript-react': 'lessonsOtsReact',
  '10xdevs-1': 'lessons10xDevs1',
  '10xdevs-2': 'lessons10xDevs2',
  '10xdevs-2-en': 'lessons10xDevs2EN',
  '10xdevs-3': 'lessons10xDevs3',
  '10xdevs-3-prework': 'lessons10xDevs3Prework',
};

export const PERMISSION_MAPPINGS: Record<CourseSlug, AirtableCourse> = {
  'cursor-ai': 'CURSOR_AI',
  'opanuj-frontend': 'OPANUJ_FRONTEND',
  'opanuj-frontend-live': 'OPANUJ_FRONTEND',
  'opanuj-typescript-core': 'OPANUJ_TYPESCRIPT',
  'opanuj-typescript-react': 'OPANUJ_TYPESCRIPT',
  '10xdevs-1': '10XDEVS_1',
  '10xdevs-2': '10XDEVS_2',
  '10xdevs-2-en': '10XDEVS_2_EN',
  '10xdevs-3': '10XDEVS_3',
  '10xdevs-3-prework': '10XDEVS_3',
};

export function airtableCoursesToCourseSlugs(courses: AirtableCourse[]): CourseSlug[] {
  const courseSet = new Set<AirtableCourse>(courses);
  return (Object.entries(PERMISSION_MAPPINGS) as [CourseSlug, AirtableCourse][])
    .filter(([, permission]) => courseSet.has(permission))
    .map(([slug]) => slug);
}
