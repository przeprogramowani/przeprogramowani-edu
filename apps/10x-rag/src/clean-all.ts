import 'dotenv/config';
import { CloudClient } from 'chromadb';
import { getAllLessonMetadata, lessonToCollectionName } from './helpers/lessons.js';

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY!,
  tenant: process.env.CHROMA_TENANT!,
  database: process.env.CHROMA_DATABASE!,
});

async function cleanAllCollections() {
  try {
    console.log('🔍 Fetching all lesson metadata...');
    const lessons = await getAllLessonMetadata();

    if (lessons.length === 0) {
      console.log('ℹ️ No lessons found in metadata.');
      return;
    }

    console.log(`📋 Found ${lessons.length} lessons. Starting collection cleanup...`);

    let deletedCount = 0;
    let errorCount = 0;

    for (const lesson of lessons) {
      const collectionName = lessonToCollectionName(lesson.lessonId);

      try {
        console.log(`🗑️ Deleting collection: ${collectionName} (lesson: ${lesson.lessonId})`);
        await client.deleteCollection({ name: collectionName });
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete collection ${collectionName}:`, error);
        errorCount++;
      }
    }

    console.log(`✅ Cleanup complete! Deleted ${deletedCount} collections.`);
    if (errorCount > 0) {
      console.log(`⚠️ ${errorCount} collections could not be deleted.`);
    }
  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanAllCollections();
