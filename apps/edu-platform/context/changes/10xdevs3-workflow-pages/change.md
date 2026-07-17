---
id: 10xdevs3-workflow-pages
title: "Strony 10x Workflow w platformie (10xdevs-3 internal + 10xdevs-4 public)"
status: implementing
created: 2026-07-10
updated: 2026-07-10
tags: [10xdevs-3, 10xdevs-4, workflow, landings, astro]
---

# Strony 10x Workflow w edu-platform

Migracja 7 stron kampanii (fundament, csc, skalowanie, jakość, legacy, teamwork,
docs quick-search) z osobnych projektów Cloudflare Pages do edu-platform:

- **Internal**: `src/pages/10xdevs-3/workflow/*.astro`, gating `verifyExternalAuth('10xdevs-3')`
  jak `mission-log.astro`.
- **Public**: `src/pages/10xdevs-4/*.astro` - cienkie wrappery bez auth; widoczność
  sterowana listą `PUBLIC_PAGES` (otwarcie strony = dopisanie sluga).
- **Wspólny design system**: `src/components/tenx-workflow/` (TenxCosmicLayout, universes.ts -
  kanon uniwersum→kolor+glif zatwierdzony przez usera, pages.ts - rejestr stron),
  fonty Chakra Petch jako woff2 w `public/fonts/chakra-petch/` (zamiast 4× data-URI/strona).
- **Nawigacja między stronami** w layoucie (rejestr stron, aktywna podświetlona,
  base-path aware; w kontekście public tylko strony otwarte).
- **Kanon kolorów** (przefarbowanie sekcji względem wersji z vaultu):
  Ender zieleń #4ade9b · Trzy ciała cyjan #4cc9f0 · Hyperion fiolet #a78bfa ·
  Diuna bursztyn #f0a64a · WH40k rdza #e2564a · Expanse morski #3ddad0 ·
  Star Wars żółty #ffd166 · Fundacja róż #f472b6. Glify per uniwersum w sec-uni i docs.
- Smoke e2e (bramka deploy), preview z brancha `tenx-workflow-pages`, po weryfikacji
  merge do master i wygaszenie 7 starych projektów Pages + workflowów deploy-10xdevs-*.

Źródła stron: vault `/Users/admin/Obsidian/sync/mkc-vault/kierunek-2026/10xdevs/assets/10xdevs-*.html`.
