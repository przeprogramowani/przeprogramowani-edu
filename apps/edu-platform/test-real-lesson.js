// Test script to verify DOCTYPE handling with real lesson HTML
// Run with: node test-real-lesson.js

import { readFileSync } from 'fs';
import { processHtmlForDisplay } from './src/server/circle/process-for-display.ts';
import { htmlToMarkdown } from './src/utils/htmlToMarkdown.ts';
import { sanitizeForYaml } from './src/utils/decodeHtmlEntities.ts';

// Read the actual 5x1 lesson HTML file
const lessonHtml = readFileSync('./tools/circle-lesson-backup/backup/10xdevs-2ed/32-5x1_poszerzanie_wiedzy_modelu_llmstxt.html', 'utf-8');

console.log('=== STEP 1: Raw lesson HTML (first 500 chars) ===');
console.log(lessonHtml.substring(0, 500));
console.log('\n');

console.log('=== STEP 2: After processHtmlForDisplay (first 500 chars) ===');
const processed = processHtmlForDisplay(lessonHtml, '[5x1] Poszerzanie wiedzy modelu - LLMs.txt');
console.log(processed.substring(0, 500));
console.log('\n');

console.log('=== STEP 3: After htmlToMarkdown (first 500 chars) ===');
const markdown = htmlToMarkdown(processed);
console.log(markdown.substring(0, 500));
console.log('\n');

console.log('=== STEP 4: Final frontmatter + markdown (first 800 chars) ===');
const cleanTitle = sanitizeForYaml('[5x1] Poszerzanie wiedzy modelu - LLMs.txt');
const frontmatter = `---
title: "${cleanTitle}"
course: "10xdevs-2"
source: "Przeprogramowani.pl"
exported: "2025-11-03"
format: "markdown"
---

`;
const finalContent = frontmatter + markdown;
console.log(finalContent.substring(0, 800));
console.log('\n');

console.log('=== CHECKS ===');
console.log('Has DOCTYPE in final output:', finalContent.includes('<!DOCTYPE'));
console.log('Has <html> in final output:', finalContent.includes('<html>'));
console.log('Has <head> in final output:', finalContent.includes('<head>'));
console.log('Has <body> in final output:', finalContent.includes('<body>'));
console.log('Has &quot; in frontmatter title:', finalContent.substring(0, 200).includes('&quot;'));
console.log('Starts with ---:', finalContent.trim().startsWith('---'));
console.log('First char:', JSON.stringify(finalContent[0]));
console.log('\n');

console.log('=== TITLE LINE ===');
const lines = finalContent.split('\n');
const titleLine = lines.find(l => l.startsWith('title:'));
console.log(titleLine);
