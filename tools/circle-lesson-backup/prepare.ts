import * as fs from 'fs';
import * as path from 'path';
import { tagsToPlaceholders } from './utils/tag-placeholders';

type SupportedLanguage = 'pl' | 'en';

function parseLanguage(args: string[]): SupportedLanguage {
  const idx = args.indexOf('--lang');
  if (idx === -1 || idx + 1 >= args.length) return 'pl';
  const lang = args[idx + 1];
  if (lang !== 'pl' && lang !== 'en') {
    console.error(`❌ Unsupported language: ${lang}. Use "pl" or "en".`);
    process.exit(1);
  }
  return lang;
}

function getPlatformHtmlDir(lang: SupportedLanguage): string {
  return path.resolve(
    __dirname,
    `../../projects/edu-platform/src/content/lessons10xDevs3/${lang}`
  );
}

function getOutputDir(lang: SupportedLanguage): string {
  return path.resolve(__dirname, `content/lessons10xDevs3/${lang}`);
}

export function replaceInlineCodeWithStrong(html: string): string {
  const preBlocks: string[] = [];
  const withPlaceholders = html.replace(
    /<pre[\s>][\s\S]*?<\/pre>/g,
    (preBlock) => {
      const idx = preBlocks.length;
      preBlocks.push(preBlock);
      return `__PRE_BLOCK_${idx}__`;
    }
  );
  const withStrong = withPlaceholders.replace(
    /<code>([\s\S]*?)<\/code>/g,
    '<strong>$1</strong>'
  );
  return withStrong.replace(/__PRE_BLOCK_(\d+)__/g, (_, idx) => preBlocks[Number(idx)]);
}

export function unwrapTableStructureTags(html: string): string {
  return html
    .replace(/<thead>/g, '')
    .replace(/<\/thead>/g, '')
    .replace(/<tbody>/g, '')
    .replace(/<\/tbody>/g, '');
}

export function convertTablesToLists(html: string): string {
  return html.replace(/<table>[\s\S]*?<\/table>/g, (table) => {
    const rows: string[][] = [];
    const rowMatches = table.match(/<tr>[\s\S]*?<\/tr>/g) || [];
    for (const row of rowMatches) {
      const cells = (row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g) || []).map((cell) =>
        cell.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/, '$1').trim()
      );
      rows.push(cells);
    }
    if (rows.length === 0) return '';
    const headers = rows[0];
    const dataRows = rows.slice(1);
    if (dataRows.length === 0) return '';
    const items = dataRows.map((row) => {
      const parts = row
        .map((cell, i) => (headers[i] ? `<strong>${headers[i]}</strong>: ${cell}` : cell))
        .filter(Boolean);
      return `<li>${parts.join(' | ')}</li>`;
    });
    return `<ul>\n${items.join('\n')}\n</ul>`;
  });
}

export function collapseEmptyLines(html: string): string {
  return html.replace(/\n{3,}/g, '\n\n');
}

export function convertH4ToH3(html: string): string {
  return html
    .replace(/<h4>/g, '<h3>')
    .replace(/<\/h4>/g, '</h3>')
    .replace(/<h4\s/g, '<h3 ');
}

export function stripInputCheckboxes(html: string): string {
  return html.replace(/<input[^>]*type="checkbox"[^>]*>\s*/g, '');
}

export function sanitizeCodeBlocks(html: string): string {
  return html.replace(
    /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (match, content) => {
      if (content.includes('curl')) return '';
      return match;
    }
  );
}

export function stripClassAttributes(html: string): string {
  const preBlocks: string[] = [];
  const withPlaceholders = html.replace(
    /<pre[\s>][\s\S]*?<\/pre>/g,
    (preBlock) => {
      const idx = preBlocks.length;
      preBlocks.push(preBlock);
      return `__PRE_CLASS_${idx}__`;
    }
  );
  const stripped = withPlaceholders.replace(/ class="[^"]*"/g, '');
  return stripped.replace(/__PRE_CLASS_(\d+)__/g, (_, idx) => preBlocks[Number(idx)]);
}

export function unwrapUnknownTags(html: string): string {
  const allowed = new Set([
    'a', 'blockquote', 'br', 'code', 'div', 'em', 'h2', 'h3', 'hr',
    'li', 'ol', 'p', 'pre', 'strong', 'table', 'td', 'th', 'tr', 'ul',
    'span', 'script', 'sub', 'sup', 's', 'u',
  ]);
  return html.replace(/<\/?([a-z][a-z0-9]*)[^>]*>/g, (match, tag) => {
    if (allowed.has(tag)) return match;
    return '';
  });
}

export function prepareForCircle(html: string): string {
  let result = replaceInlineCodeWithStrong(html);
  result = convertH4ToH3(result);
  result = stripInputCheckboxes(result);
  result = stripClassAttributes(result);
  result = sanitizeCodeBlocks(result);
  result = tagsToPlaceholders(result);
  result = unwrapTableStructureTags(result);
  result = convertTablesToLists(result);
  result = unwrapUnknownTags(result);
  result = collapseEmptyLines(result);
  return result;
}

function extractBody(html: string): string {
  const bodyStart = html.indexOf('<body>');
  const bodyEnd = html.indexOf('</body>');
  if (bodyStart === -1 || bodyEnd === -1) {
    return html;
  }
  return html.slice(bodyStart + '<body>'.length, bodyEnd).trim();
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const lang = parseLanguage(args);

  const platformHtmlDir = getPlatformHtmlDir(lang);
  const outputDir = getOutputDir(lang);

  if (!fs.existsSync(platformHtmlDir)) {
    console.error(`❌ Platform HTML directory not found: ${platformHtmlDir}`);
    process.exit(1);
  }

  const htmlFiles = fs
    .readdirSync(platformHtmlDir)
    .filter((f) => f.endsWith('.html'))
    .sort();

  if (htmlFiles.length === 0) {
    console.error('❌ No .html files found in platform content directory');
    process.exit(1);
  }

  console.log(`\n📂 Reading platform HTML from: ${platformHtmlDir}`);
  console.log(`📤 Output directory: ${outputDir}`);
  console.log(`🌐 Language: ${lang}`);
  console.log(`🔄 Mode: ${dryRun ? 'DRY RUN' : 'WRITE'}`);
  console.log(`📚 Files: ${htmlFiles.length}`);
  console.log('---');

  if (!dryRun) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const file of htmlFiles) {
    const inputPath = path.join(platformHtmlDir, file);
    const raw = fs.readFileSync(inputPath, 'utf-8');
    const body = extractBody(raw);
    const prepared = prepareForCircle(body);

    if (dryRun) {
      console.log(`  📋 ${file} (${body.length} → ${prepared.length} chars)`);
    } else {
      const outputPath = path.join(outputDir, file);
      fs.writeFileSync(outputPath, prepared, 'utf-8');
      console.log(`  ✅ ${file} (${body.length} → ${prepared.length} chars)`);
    }
  }

  console.log(`\n${dryRun ? '✅ Dry run complete.' : '🎉 Prepare complete.'} ${htmlFiles.length} files processed.`);
}

if (require.main === module) {
  main();
}
