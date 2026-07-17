export type AirtableCourse =
  | 'OPANUJ_FRONTEND'
  | 'CURSOR_AI'
  | 'OPANUJ_TYPESCRIPT'
  | '10XDEVS_1'
  | '10XDEVS_2'
  | '10XDEVS_2_EN'
  | '10XDEVS_3';

const AirtableCourseMappings: Record<string, AirtableCourse> = {
  recuqXvSzyvUrq1rY: 'OPANUJ_FRONTEND',
  recwaFxIpnNkvyZfN: 'CURSOR_AI',
  recboa8bHo2nU0LoT: 'OPANUJ_TYPESCRIPT',
  // Only available via shared/{guid} (no auth)
  notImplementedYET: '10XDEVS_1',
  // Only available via shared/{guid} (no auth)
  notImplementedYET2: '10XDEVS_2',
  // Only available via shared/{guid} (no auth)
  notImplementedYET3: '10XDEVS_2_EN',
  // Only available via shared/{guid} (no auth)
  notImplementedYET4: '10XDEVS_3',
};

export function getAirtableCourseFromIds(courseIds: string[]): AirtableCourse[] {
  const courses: AirtableCourse[] = [];

  courseIds.forEach((courseId) => {
    if (AirtableCourseMappings[courseId]) {
      courses.push(AirtableCourseMappings[courseId]);
    }
  });

  return courses;
}
