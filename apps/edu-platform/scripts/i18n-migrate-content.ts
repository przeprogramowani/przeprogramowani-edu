/**
 * One-shot codemod: convert content data files from `text: '...'` to
 * `text: { pl: '...', en: '...' }` for bilingual schema migration.
 *
 * Targets these property names anywhere they appear in object literals:
 *   text, title, description, briefing, label, hint, openUrlTitle
 *
 * Plus arrays of strings on the `hints` property (each entry becomes bilingual).
 *
 * Idempotent: skips entries whose value is already an object literal.
 *
 * Run once: `npx tsx scripts/i18n-migrate-content.ts`
 */
import * as ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const FILES = [
  'src/explorers/levels/m0-awakening/dialogues.ts',
  'src/explorers/levels/m0-core-ai/dialogues.ts',
  'src/explorers/levels/m0-core-ai/quests.ts',
  'src/explorers/levels/m0-exam-room/dialogues.ts',
  'src/explorers/levels/m0-exam-room/exams.ts',
  'src/explorers/levels/m0-exam-room/quests.ts',
  'src/explorers/levels/m0-crew-room/dialogues.ts',
];

const BILINGUAL_KEYS = new Set([
  'text',
  'title',
  'description',
  'briefing',
  'label',
  'openUrlTitle',
]);

// `hint` is bilingual on ApiAnswerQuest, but `hint` also appears on game state
// shapes occasionally — we restrict by directory: files in this list always
// have `hint` as a quest property.
const FILES_WHERE_HINT_IS_BILINGUAL = new Set([
  'src/explorers/levels/m0-core-ai/quests.ts',
]);

function isStringLiteralLike(node: ts.Node): node is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral | ts.TemplateExpression {
  return (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isTemplateExpression(node)
  );
}

function getNodeText(node: ts.Node, source: ts.SourceFile): string {
  return source.text.slice(node.getStart(source), node.getEnd());
}

interface Edit {
  start: number;
  end: number;
  replacement: string;
}

function collectEdits(source: ts.SourceFile, filePath: string): Edit[] {
  const edits: Edit[] = [];
  const hintIsBilingual = FILES_WHERE_HINT_IS_BILINGUAL.has(filePath);

  function visit(node: ts.Node, parent?: ts.Node): void {
    if (ts.isPropertyAssignment(node)) {
      const name = node.name;
      let key = '';
      if (ts.isIdentifier(name)) key = name.text;
      else if (ts.isStringLiteral(name)) key = name.text;

      const isBilingualKey = BILINGUAL_KEYS.has(key) || (key === 'hint' && hintIsBilingual);
      const isHintsArray = key === 'hints';

      if (isBilingualKey && isStringLiteralLike(node.initializer)) {
        const value = getNodeText(node.initializer, source);
        edits.push({
          start: node.initializer.getStart(source),
          end: node.initializer.getEnd(),
          replacement: `{ pl: ${value}, en: ${value} }`,
        });
      }

      if (isHintsArray && ts.isArrayLiteralExpression(node.initializer)) {
        for (const elem of node.initializer.elements) {
          if (isStringLiteralLike(elem)) {
            const value = getNodeText(elem, source);
            edits.push({
              start: elem.getStart(source),
              end: elem.getEnd(),
              replacement: `{ pl: ${value}, en: ${value} }`,
            });
          }
        }
      }
    }

    ts.forEachChild(node, (child) => visit(child, node));
  }

  visit(source);
  return edits;
}

function applyEdits(text: string, edits: Edit[]): string {
  // Apply from the end so earlier offsets stay valid.
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  let result = text;
  for (const e of sorted) {
    result = result.slice(0, e.start) + e.replacement + result.slice(e.end);
  }
  return result;
}

let totalEdits = 0;
let touchedFiles = 0;
for (const rel of FILES) {
  const full = resolve(projectRoot, rel);
  const original = readFileSync(full, 'utf8');
  const source = ts.createSourceFile(full, original, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits = collectEdits(source, rel);

  if (edits.length === 0) {
    console.log(`[skip] ${rel} — no edits (already migrated)`);
    continue;
  }

  const next = applyEdits(original, edits);
  writeFileSync(full, next, 'utf8');
  totalEdits += edits.length;
  touchedFiles++;
  console.log(`[migrate] ${rel} — ${edits.length} edits`);
}

console.log(`\nDone. ${touchedFiles} files touched, ${totalEdits} edits total.`);
