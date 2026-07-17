# Prework Code Block Repair

This workflow repairs English 10xDevs 3 prework HTML when translated `<pre>` blocks were truncated to the first line.

The repair script compares generated Polish HTML with translated English HTML, reports suspicious or missing blocks, and can patch English HTML in explicit write mode. Report mode is local-only: it does not write files and does not call OpenRouter.

## Commands

```bash
npm run report:prework-code-blocks
npm run repair:prework-code-blocks
tsx scripts/repair-prework-code-blocks.ts --write --lesson 10
tsx scripts/repair-prework-code-blocks.ts --write --lesson 12 --translate-mermaid
npm run check:lesson-html
```

Use report mode first. It exits `0` even when it finds damaged blocks, because the report is meant to surface content work without failing regular checks.

Use repair mode only when you want the script to patch English HTML and update the cache. Repair mode may call OpenRouter for suspicious `pre>code` blocks that do not have a valid cached translation.

## Configuration

Repair mode needs an OpenRouter key when it has to translate an uncached code block or when `--translate-mermaid` needs an uncached Mermaid translation:

```bash
OPENROUTER_API_KEY=...
```

The default model is:

```bash
google/gemini-2.5-flash
```

You can override it with:

```bash
tsx scripts/repair-prework-code-blocks.ts --write --lesson 10 --model <model-id>
```

## Cache

Cache files are lesson-scoped:

```text
scripts/prework-code-translations/cache/<lesson-prefix>.cache.json
```

Each cache entry stores the source block, translated or restored text, block hash, model, prompt version, ordinal, and status. Re-running repair reuses valid cached translations unless `--force` is used.

Use `--force` when you want to regenerate translations after changing the prompt or model. With a lesson filter, it also revisits translated code entries from that lesson's cache even when the current HTML no longer reports a suspicious block:

```bash
tsx scripts/repair-prework-code-blocks.ts --write --lesson 09 --force
```

Code-block translation is directional: only clearly Polish comments, strings, visible HTML text, and prompt prose should become English. Already-English text should remain English. Validation rejects obvious English-to-Polish reversals before writing the cache or HTML.

## Mermaid Policy

Mermaid blocks are not translated automatically by default.

When a Mermaid block is truncated in English HTML, repair mode restores the full Polish Mermaid source so the diagram is complete again. The item is reported as requiring manual English translation, and the cache stores the source text plus metadata so later translation work can reuse it.

To try model-backed Mermaid translation, opt in explicitly:

```bash
tsx scripts/repair-prework-code-blocks.ts --write --lesson <prefix> --translate-mermaid
```

This uses a dedicated Mermaid prompt that asks the model to translate visible labels while preserving Mermaid syntax, node IDs, participant IDs, arrows, indentation, and line order. The output is structurally validated before it is written.

## Manual Checklist

1. Run `npm run report:prework-code-blocks`.
2. Run `tsx scripts/repair-prework-code-blocks.ts --write --lesson <prefix>`.
3. Inspect the cache and HTML diff.
4. Repeat for all affected lessons.
5. Run `npm run check:lesson-html`.
6. Open affected EN lessons locally.
7. Manually translate Mermaid labels where reported.
