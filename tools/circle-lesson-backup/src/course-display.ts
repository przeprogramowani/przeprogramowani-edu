import { AVAILABLE_COURSES, type CourseConfig } from '@edu/circle';

export function showAvailableCourses(selectedCourse?: CourseConfig): void {
  console.log('\n📚 Available courses:');
  AVAILABLE_COURSES.forEach((course, index) => {
    const isSelected = selectedCourse && course === selectedCourse ? ' (SELECTED)' : '';
    console.log(`${index + 1}. ${course.directory_name} - ${course.platform}${isSelected}`);
    console.log(`   Space ID: ${course.space_id}, Sections: ${course.section_ids.length}`);
  });
  console.log('\n💡 To change course, update SELECTED_COURSE in index-v2.ts');
}

export function showHelp(): void {
  console.log(`
🔧 Course Backup Tool v2

Usage:
  node index-v2.ts              Pull the selected course
  node index-v2.ts --list       Show available courses
  node index-v2.ts --help       Show this help

Configuration:
  Update SELECTED_COURSE variable to change which course to pull.

Available courses:
  - TEN_X_DEVS_FIRST_ED
  - TEN_X_DEVS_SECOND_ED  
  - OPANUJ_FRONTEND
  `);
}