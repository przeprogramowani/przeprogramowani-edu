import 'dotenv/config';
import readline from 'node:readline/promises';
import { createChromaClient } from './helpers/chroma.js';
import { executeQuery } from './lib/query-service.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function queryLoop() {
  console.log('\n✅ Connected to RAG system');
  console.log('📖 Ready to answer questions from all accessible lessons');
  console.log('\nℹ️  Type your question (or "exit" to quit)\n');

  let running = true;
  const client = createChromaClient();

  while (running) {
    const query = await rl.question('❓ Your question: ');

    if (query.trim().toLowerCase() === 'exit') {
      console.log('\n👋 Goodbye!');
      running = false;
      break;
    }

    if (!query.trim()) {
      continue;
    }

    try {
      console.log('\n⏳ Searching for relevant lessons...\n');

      // Execute query using the service
      const result = await executeQuery(client, query.trim());

      // Handle no relevant lessons found
      if (result.relevantLessons.length === 0) {
        console.log('❌ No relevant lessons found for your query.\n');
        continue;
      }

      console.log(`   ✓ Found ${result.relevantLessons.length} relevant lesson(s):`);
      result.relevantLessons.forEach((l, idx) => {
        console.log(`     ${idx + 1}. ${l.lessonId} (similarity: ${l.similarity.toFixed(3)})`);
      });

      // Handle no accessible lessons
      if (result.accessibleRelevant.length === 0) {
        console.log('\n⚠️  Found relevant lessons, but none are currently accessible.\n');
        console.log('   Lessons found (not accessible):');
        result.relevantLessons.forEach((l) => {
          console.log(`     - ${l.lessonId}`);
        });
        console.log('\n');
        continue;
      }

      console.log(`   ✓ ${result.accessibleRelevant.length} accessible lesson(s)`);

      console.log('\n⏳ Retrieving relevant content...\n');

      // Handle no chunks found
      if (result.chunks.length === 0) {
        console.log('❌ No relevant content found in accessible lessons.\n');
        continue;
      }

      console.log(`   ✓ Retrieved ${result.chunks.length} relevant chunk(s)`);

      for (const chunk of result.chunks) {
        console.log(chunk.id);
      }

      // Display answer
      console.log('\n🤖 Generating answer...\n');

      console.log('💬 ANSWER:');
      console.log('─'.repeat(80));
      console.log(result.answer);
      console.log('─'.repeat(80));

      // Show source lessons
      console.log(`\n📚 Sources: ${result.sourceLessons.join(', ')}`);
      console.log('\n');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`\n❌ Error: ${message}\n`);
    }
  }
}

async function main() {
  console.log('🚀 Interactive Multi-Lesson Query Tool');
  console.log('═'.repeat(80));

  try {
    await queryLoop();
    rl.close();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Error: ${message}`);
    rl.close();
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  rl.close();
  process.exit(1);
});
