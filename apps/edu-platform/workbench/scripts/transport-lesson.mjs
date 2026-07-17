#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKBENCH = join(__dirname, "..");
const SCHEMA_PATH = join(WORKBENCH, "lessons-schema.json");
const DRAFTS_DIR = join(WORKBENCH, "lessons");
const DEST_DIR = join(
  WORKBENCH,
  "..",
  "src",
  "content-source",
  "lessons10xDevs3",
  "pl"
);

function slugify(text) {
  const beforeColon = text.includes(":") ? text.split(":")[0] : text;
  return beforeColon
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildOrderMap() {
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf-8"));
  const map = new Map();
  let order = 0;
  for (const mod of schema.modules) {
    for (const lesson of mod.lessons) {
      order++;
      const compactId = lesson.lessonId.replace("-l", "l").replace("-", "");
      map.set(lesson.lessonId, {
        order,
        orderPadded: String(order).padStart(2, "0"),
        compactId,
        title: lesson.title,
        titleEn: lesson.titleEn || "",
        slug: slugify(lesson.title),
      });
    }
  }
  return map;
}

function findExistingFile(orderPadded, compactId) {
  if (!existsSync(DEST_DIR)) return null;
  const pattern = new RegExp(`^${orderPadded}-${compactId}-`);
  const files = readdirSync(DEST_DIR);
  return files.find((f) => pattern.test(f)) || null;
}

function buildFrontmatter(title, orderPadded, order, titleEn) {
  return [
    "---",
    `title: "${title}"`,
    `titleEn: "${titleEn}"`,
    `lessonId: "${orderPadded}"`,
    `language: "pl"`,
    `order: ${order}`,
    "---",
  ].join("\n");
}

function transportLesson(lessonId, orderMap, { dryRun = false } = {}) {
  const meta = orderMap.get(lessonId);
  if (!meta) {
    console.error(`  [skip] ${lessonId}: not found in schema`);
    return false;
  }

  const draftPath = join(DRAFTS_DIR, lessonId, "lesson-draft.md");
  if (!existsSync(draftPath)) {
    console.error(`  [skip] ${lessonId}: no lesson-draft.md`);
    return false;
  }

  const existing = findExistingFile(meta.orderPadded, meta.compactId);
  const destFilename =
    existing || `${meta.orderPadded}-${meta.compactId}-${meta.slug}.md`;
  const destPath = join(DEST_DIR, destFilename);

  const draft = readFileSync(draftPath, "utf-8");
  const frontmatter = buildFrontmatter(
    meta.title,
    meta.orderPadded,
    meta.order,
    meta.titleEn
  );
  const output = frontmatter + "\n" + draft;

  if (dryRun) {
    console.log(`  [dry-run] ${lessonId} -> ${destFilename}`);
    return true;
  }

  writeFileSync(destPath, output, "utf-8");
  console.log(`  [ok] ${lessonId} -> ${destFilename}`);
  return true;
}

function resolveTargets(ids, orderMap) {
  const targets = [];
  for (const id of ids) {
    if (orderMap.has(id)) {
      targets.push(id);
    } else if (/^m\d+$/.test(id)) {
      const modulePrefix = id + "-l";
      const matched = [...orderMap.keys()]
        .filter((k) => k.startsWith(modulePrefix))
        .sort(
          (a, b) =>
            (orderMap.get(a)?.order || 0) - (orderMap.get(b)?.order || 0)
        );
      if (matched.length === 0) {
        console.error(`  [skip] ${id}: no lessons found for this module`);
      }
      targets.push(...matched);
    } else {
      console.error(`  [skip] ${id}: not recognized as a lesson or module`);
    }
  }
  return targets;
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positional = args.filter((a) => !a.startsWith("--"));

const orderMap = buildOrderMap();

if (positional.length === 0) {
  const available = readdirSync(DRAFTS_DIR, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        existsSync(join(DRAFTS_DIR, d.name, "lesson-draft.md"))
    )
    .map((d) => d.name)
    .filter((id) => orderMap.has(id))
    .sort(
      (a, b) => (orderMap.get(a)?.order || 0) - (orderMap.get(b)?.order || 0)
    );

  console.log(
    `Transporting all ${available.length} drafts${dryRun ? " (dry run)" : ""}:`
  );
  let ok = 0;
  for (const id of available) {
    if (transportLesson(id, orderMap, { dryRun })) ok++;
  }
  console.log(`\nDone: ${ok}/${available.length} transported.`);
} else {
  const targets = resolveTargets(positional, orderMap);
  for (const id of targets) {
    transportLesson(id, orderMap, { dryRun });
  }
}
