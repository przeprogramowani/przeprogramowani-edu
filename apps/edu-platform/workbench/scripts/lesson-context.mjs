import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WORKBENCH_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const SCHEMA_PATH = join(WORKBENCH_DIR, "lessons-schema.json");

function readSchema() {
  return JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));
}

function flattenLessons(schema) {
  return schema.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.moduleId,
      moduleTitle: module.title,
      moduleGlobalOrder: module.order,
    })),
  );
}

function findLesson(lessons, query) {
  if (!query) return null;

  const normalized = query.toLowerCase();
  return (
    lessons.find((lesson) => lesson.lessonId === query) ??
    lessons.find((lesson) => lesson.title.toLowerCase() === normalized) ??
    lessons.find((lesson) => lesson.title.toLowerCase().includes(normalized)) ??
    null
  );
}

function summarizeGroundingSources(sources = []) {
  return sources.map((source) => ({
    title: source.title,
    url: source.url,
    sourceType: source.sourceType,
    publisherOrAuthor: source.publisherOrAuthor,
    checkedAt: source.checkedAt,
    confidence: source.confidence,
    claimsSupportedCount: source.claimsSupported?.length ?? 0,
    relevance: source.relevance,
    notes: source.notes,
  }));
}

function compactLesson(lesson, { full = false } = {}) {
  if (!lesson) return null;

  return {
    lessonId: lesson.lessonId,
    title: lesson.title,
    titleEn: lesson.titleEn,
    status: lesson.status,
    moduleId: lesson.moduleId,
    moduleTitle: lesson.moduleTitle,
    globalOrder: lesson.globalOrder,
    moduleOrder: lesson.moduleOrder,
    dependsOn: lesson.dependsOn,
    preparesFor: lesson.preparesFor,
    owns: lesson.owns,
    referencesOnly: lesson.referencesOnly,
    mustNotCover: lesson.mustNotCover,
    learningOutcomes: lesson.learningOutcomes,
    requiredFragments: lesson.requiredFragments,
    videoPlaceholders: lesson.videoPlaceholders,
    requiredArtifacts: lesson.requiredArtifacts,
    groundingSources: full ? (lesson.groundingSources ?? []) : summarizeGroundingSources(lesson.groundingSources),
    sideEffectLedger: lesson.sideEffectLedger,
  };
}

function summarizeTextList(items = [], maxItems = 5) {
  return {
    count: items.length,
    items: items.slice(0, maxItems),
    truncated: items.length > maxItems,
  };
}

function boundaryLesson(lesson, { full = false } = {}) {
  if (!lesson) return null;

  if (full) {
    return {
      lessonId: lesson.lessonId,
      title: lesson.title,
      status: lesson.status,
      moduleId: lesson.moduleId,
      globalOrder: lesson.globalOrder,
      owns: lesson.owns,
      referencesOnly: lesson.referencesOnly,
      mustNotCover: lesson.mustNotCover,
      learningOutcomes: lesson.learningOutcomes,
      requiredFragments: lesson.requiredFragments,
    };
  }

  return {
    lessonId: lesson.lessonId,
    title: lesson.title,
    status: lesson.status,
    moduleId: lesson.moduleId,
    globalOrder: lesson.globalOrder,
    owns: summarizeTextList(lesson.owns),
    referencesOnly: summarizeTextList(lesson.referencesOnly),
    mustNotCover: summarizeTextList(lesson.mustNotCover),
    learningOutcomes: summarizeTextList(lesson.learningOutcomes),
    requiredFragments: summarizeTextList(lesson.requiredFragments),
  };
}

function courseMap(schema) {
  return schema.modules.map((module) => ({
    moduleId: module.moduleId,
    title: module.title,
    lessons: module.lessons.map((lesson) => ({
      lessonId: lesson.lessonId,
      title: lesson.title,
      status: lesson.status,
      globalOrder: lesson.globalOrder,
      moduleOrder: lesson.moduleOrder,
    })),
  }));
}

function buildContext(schema, query, { full = false } = {}) {
  const lessons = flattenLessons(schema).sort((a, b) => a.globalOrder - b.globalOrder);
  const target = findLesson(lessons, query);

  if (!target) {
    return {
      error: query ? `Lesson not found: ${query}` : "Missing lesson id or title query.",
      usage: "node scripts/lesson-context.mjs <lessonId-or-title> [--json]",
      courseMap: courseMap(schema),
    };
  }

  const byId = new Map(lessons.map((lesson) => [lesson.lessonId, lesson]));
  const targetIndex = lessons.findIndex((lesson) => lesson.lessonId === target.lessonId);

  return {
    schema: {
      file: "workbench/lessons-schema.json",
      jsonSchema: "workbench/schemas/lessons-schema.schema.json",
      note: "Use this context for orientation. Read and edit the full lessons-schema.json when changing the curriculum contract.",
      fullOutput: full,
    },
    course: {
      courseId: schema.courseId,
      language: schema.language,
      version: schema.version,
      source: schema.source,
      scope: schema.scope,
    },
    target: compactLesson(target, { full }),
    graph: {
      dependsOn: target.dependsOn.map((lessonId) => boundaryLesson(byId.get(lessonId), { full })),
      preparesFor: target.preparesFor.map((lessonId) => boundaryLesson(byId.get(lessonId), { full })),
      previousByOrder: boundaryLesson(lessons[targetIndex - 1], { full }),
      nextByOrder: boundaryLesson(lessons[targetIndex + 1], { full }),
    },
    courseMap: courseMap(schema),
  };
}

function writeMarkdown(context) {
  if (context.error) {
    console.log(`# Lesson Context\n\n${context.error}\n\nUsage: \`${context.usage}\`\n`);
    console.log("## Course Map");
    printCourseMap(context.courseMap);
    return;
  }

  console.log(`# Lesson Context: ${context.target.lessonId} - ${context.target.title}\n`);
  console.log("## Schema");
  console.log(`- source: \`${context.schema.file}\``);
  console.log(`- structural schema: \`${context.schema.jsonSchema}\``);
  console.log(`- note: ${context.schema.note}\n`);

  console.log("## Position");
  console.log(`- course: ${context.course.courseId} (${context.course.language}), schema version ${context.course.version}`);
  console.log(`- module: ${context.target.moduleId} - ${context.target.moduleTitle}`);
  console.log(`- order: module ${context.target.moduleOrder}, global ${context.target.globalOrder}`);
  console.log(`- status: ${context.target.status}\n`);

  console.log("## Target Contract");
  printJson(context.target);

  console.log("\n## Neighbor Boundaries");
  printJson(context.graph);

  console.log("\n## Course Map");
  printCourseMap(context.courseMap);
}

function printCourseMap(modules) {
  for (const module of modules) {
    console.log(`\n### ${module.moduleId} - ${module.title}`);
    for (const lesson of module.lessons) {
      console.log(`- ${lesson.lessonId} [${lesson.status}] ${lesson.title}`);
    }
  }
}

function printJson(value) {
  console.log("```json");
  console.log(JSON.stringify(value, null, 2));
  console.log("```");
}

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const full = args.includes("--full");
const query = args.filter((arg) => arg !== "--json" && arg !== "--full").join(" ").trim();
const context = buildContext(readSchema(), query, { full });

if (asJson) {
  console.log(JSON.stringify(context, null, 2));
} else {
  writeMarkdown(context);
}

if (context.error) {
  process.exitCode = 1;
}
