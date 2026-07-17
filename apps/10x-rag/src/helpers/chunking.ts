import { Block, Section, Chunk, ChunkMeta, ChunkingParams } from '../types.js';
import { estimateTokens } from './utilities.js';
import crypto from 'node:crypto';

/**
 * Generate a short hash from a string (8 characters)
 * Used to create compact IDs that fit within Chroma's 128 byte limit
 */
function shortHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 8);
}

export const defaultChunking: ChunkingParams = {
  targetTokens: 300,
  maxTokens: 500,
  minTokens: 120,
  overlapTokens: 40,
};

export function toChunks(
  lessonId: string,
  sourceFile: string,
  sections: Section[],
  langHint?: string,
  params: ChunkingParams = defaultChunking
): Chunk[] {
  const chunks: Chunk[] = [];

  for (const s of sections) {
    // Build a concise parent summary chunk (first N tokens of section)
    // Use hash-based ID to keep under 128 bytes (Chroma Cloud limit)
    const lessonHash = shortHash(lessonId);
    const sectionHash = shortHash(s.slug);
    const parentId = `sec:${lessonHash}:${sectionHash}`;
    const sectionIntro = [s.title, ...s.blocks.map((b) => b.rawText)].join(' ').slice(0, 2000);
    const introToks = estimateTokens(sectionIntro);
    const introWindow = Math.min(150, introToks); // cap parent intro length

    // Build parent text with optional LLM-generated context
    let parentText = `# ${s.breadcrumbs.join(' › ')}\n\n`;
    if (s.context) {
      parentText += `${s.context}\n\n---\n\n`;
    }
    parentText += collapseToTokenBudget([s.blocks.map((b) => b.markdown).join('\n\n')].join('\n\n'), introWindow);

    const parentChunk: Chunk = {
      id: parentId,
      text: parentText,
      meta: {
        lessonId,
        sourceFile,
        sectionSlug: s.slug,
        sectionTitle: s.title,
        breadcrumbs: s.breadcrumbs,
        order: s.order,
        blockSpan: [0, Math.min(1, s.blocks.length - 1)],
        charCount: parentText.length,
        tokenEstimate: estimateTokens(parentText),
        links: collectLinks(s.blocks),
        images: collectImages(s.blocks),
        lang: langHint,
      },
    };
    chunks.push(parentChunk);

    // Child content chunks with overlap
    let buf: Block[] = [];
    let bufTokens = 0;
    let startIdx = 0;

    const flush = (endIdx: number) => {
      if (!buf.length) return;
      const md = buf.map((b) => b.markdown).join('\n\n');
      const title = s.breadcrumbs.join(' › ');
      let text = title ? `# ${title}\n\n` : '';
      // Prepend section context if available
      if (s.context) {
        text += `${s.context}\n\n---\n\n`;
      }
      text += md;
      // Use hash-based ID to keep under 128 bytes (Chroma Cloud limit)
      const id = `chk:${lessonHash}:${sectionHash}:${startIdx}-${endIdx}`;
      const meta: ChunkMeta = {
        lessonId,
        sourceFile,
        sectionSlug: s.slug,
        sectionTitle: s.title,
        breadcrumbs: s.breadcrumbs,
        order: s.order,
        blockSpan: [startIdx, endIdx],
        charCount: text.length,
        tokenEstimate: estimateTokens(text),
        parentId,
        links: collectLinks(buf),
        images: collectImages(buf),
        lang: langHint,
      };
      chunks.push({ id, text, meta });
    };

    const blocks = s.blocks;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b) continue;
      const bTokens = estimateTokens(b.markdown);

      const hardBoundary = b.type === 'code' || b.type === 'table';
      const wouldExceed = bufTokens + bTokens > params.maxTokens;

      if (wouldExceed || (bufTokens >= params.targetTokens && !hardBoundary)) {
        // finalize current chunk
        const endIdx = i - 1;
        flush(endIdx);

        // prepare overlap (approx by last few blocks within overlapTokens)
        let back = endIdx;
        const overlap: Block[] = [];
        let overlapBudget = params.overlapTokens;
        while (back >= startIdx && overlapBudget > 0) {
          const block = blocks[back];
          if (!block) break;
          const t = estimateTokens(block.markdown);
          // keep semantic units intact, but stop at list/code/table boundaries if needed
          overlap.unshift(block);
          overlapBudget -= t;
          back--;
        }

        buf = [...overlap];
        bufTokens = buf.reduce((acc, bl) => acc + estimateTokens(bl.markdown), 0);
        startIdx = i - overlap.length;
      }

      // Always keep atomic units; don't split inside code/table/list
      buf.push(b);
      bufTokens += bTokens;
    }

    // Flush tail
    flush(blocks.length - 1);
  }

  return chunks;
}

export function collapseToTokenBudget(markdown: string, budget: number): string {
  // naive but safe: cut by sentences/paragraphs until under budget
  const parts = markdown.split(/\n{2,}/); // paragraphs
  const out: string[] = [];
  let used = 0;
  for (const p of parts) {
    const t = estimateTokens(p);
    if (used + t > budget) break;
    out.push(p);
    used += t;
  }
  return out.join('\n\n');
}

export function collectLinks(blocks: Block[]): string[] {
  const links: string[] = [];
  const linkRe = /\[[^\]]*?\]\((https?:\/\/[^\s)]+)\)/g;
  for (const b of blocks) {
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(b.markdown))) {
      if (m[1]) links.push(m[1]);
    }
  }
  return Array.from(new Set(links));
}

export function collectImages(blocks: Block[]): string[] {
  const imgs: string[] = [];
  const imgRe = /!\[[^\]]*?\]\((https?:\/\/[^\s)]+)\)/g;
  for (const b of blocks) {
    let m: RegExpExecArray | null;
    while ((m = imgRe.exec(b.markdown))) {
      if (m[1]) imgs.push(m[1]);
    }
  }
  return Array.from(new Set(imgs));
}
