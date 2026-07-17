import * as fs from 'fs';
import * as path from 'path';
import {
  fetchLessonsForSection,
  TEN_X_DEVS_THIRD_ED,
  getTokenForPlatform,
  type CourseConfig,
} from '@edu/circle';
import { htmlToMarkdown, buildMarkdownFile } from './utils/convert';
import { createBackupDirectory, generateFileName } from './src/file-utils';
import { showAvailableCourses, showHelp } from './src/course-display';

// Configuration: Select which course to pull
const SELECTED_COURSE = TEN_X_DEVS_THIRD_ED; // Change this to pull different courses
const LESSON_STATUS: 'draft' | 'published' = 'draft';

async function pullCourse(courseConfig: CourseConfig) {
  console.log(`\n🎯 Pulling course: ${courseConfig.directory_name}`);
  console.log(`📍 Platform: ${courseConfig.platform}`);
  console.log(`🆔 Space ID: ${courseConfig.space_id}`);
  console.log(`📚 Sections: ${courseConfig.section_ids.length}`);

  const backupDir = createBackupDirectory(courseConfig);
  const token = getTokenForPlatform(courseConfig.platform);
  let totalLessons = 0;
  let globalLessonIndex = 1; // Global counter for continuous numbering

  for (const [sectionIndex, sectionId] of courseConfig.section_ids.entries()) {
    console.log(`\n📖 Processing section ${sectionIndex + 1}/${courseConfig.section_ids.length} (ID: ${sectionId})`);

    try {
      const lessons = await fetchLessonsForSection(token, courseConfig.space_id, sectionId, LESSON_STATUS);

      if (lessons.length === 0) {
        console.log(`   ⚠️  No lessons in status ${LESSON_STATUS} found for section ${sectionId}`);
        continue;
      }

      console.log(`   📝 Found ${lessons.length} lessons`);

      for (const lesson of lessons) {
        const fileName = generateFileName(lesson.name, globalLessonIndex);
        const filePath = path.join(backupDir, fileName);

        // Convert HTML to Markdown and wrap with frontmatter
        const markdown = htmlToMarkdown(lesson.body_html);
        const fileContent = buildMarkdownFile(lesson.id, lesson.section_id, lesson.name, markdown);

        fs.writeFileSync(filePath, fileContent);
        console.log(`   ✅ Saved: ${fileName}`);
        totalLessons++;
        globalLessonIndex++;
      }
    } catch (error) {
      console.error(`   ❌ Error processing section ${sectionId}:`, error);
    }
  }

  console.log(`\n🎉 Course backup completed!`);
  console.log(`📊 Total lessons saved: ${totalLessons}`);
  console.log(`📁 Backup directory: ${backupDir}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.includes('-l')) {
    showAvailableCourses(SELECTED_COURSE);
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // Default action: pull the selected course
  await pullCourse(SELECTED_COURSE);
}

// Run the backup
main().catch((error) => {
  console.error('❌ Error during backup:', error);
  process.exit(1);
});
